// Membuat supabase/02-seed.sql dari src/data.js + src/i18n.js.
// Jalankan: node scripts/generate-seed.mjs   (hanya perlu kalau kamu mengubah konten bawaan di data.js / i18n.js)
import { writeFileSync } from 'node:fs'
import { LINKS, JOURNEY, PROJECTS } from '../src/data.js'
import { copy } from '../src/i18n.js'

const q = (v) => (v == null || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const arr = (a) => `array[${(a || []).map(q).join(', ')}]::text[]`
const bi = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? [x.en, x.id] : [x, null])
const out = ['-- 02-seed.sql — isi awal konten (diambil dari website lama). Aman dijalankan ulang: TIDAK menimpa editan kamu di admin.\n-- Semua statement sederhana tanpa alias, supaya jalan di SQL Editor Supabase.']

// About: checkpoint peta
const steps = copy.en.about.steps.map((s, i) => {
  const d = copy.id.about.steps[i]
  return `(${i + 1}, ${q(s.tag)}, ${q(d.tag)}, ${q(s.title)}, ${q(d.title)}, ${q(s.short)}, ${q(d.short)}, ${q(s.story.join('\n\n'))}, ${q(d.story.join('\n\n'))}, ${q(s.chips.join(', '))}, ${q(d.chips.join(', '))})`
})
out.push(`insert into public.journey_steps (position, tag_en, tag_id, title_en, title_id, short_en, short_id, story_en, story_id, chips_en, chips_id) values\n${steps.join(',\n')}\non conflict (position) do nothing;`)

// Pengaturan: bio, kontak, umum, teks
const about = { lead_en: copy.en.about.lead, lead_id: copy.id.about.lead }
const contact = { email: LINKS.email.replace('mailto:', ''), github: LINKS.github, linkedin: LINKS.linkedin, instagram: LINKS.instagram, tiktok: '', extra: '' }
out.push(`insert into public.site_settings (key, value) values\n('about', ${q(JSON.stringify(about))}::jsonb),\n('contact', ${q(JSON.stringify(contact))}::jsonb),\n('general', '{}'::jsonb),\n('texts', '{}'::jsonb)\non conflict (key) do nothing;`)

// Learning Journey: semester 1–8 (EN + ID). Kolom terjemahan hanya diisi kalau masih kosong.
const rows = JOURNEY.map((r) => `(${r.semester}, ${q(r.progress)}, ${q(r.tagline)}, ${q(r.tagline_id)}, ${q(r.headline)}, ${q(r.headline_id)}, ${q(r.lead)}, ${q(r.lead_id)}, ${q(r.intro)}, ${q(r.intro_id)}, ${arr(r.tech_learning)}, ${arr(r.tech_explored)}, ${arr(r.tech_used)}, ${q(r.reflection)}, ${q(r.reflection_id)})`)
const fill = ['tagline_id', 'headline_id', 'lead_id', 'intro_id', 'reflection_id'].map((c) => `${c} = coalesce(nullif(semester_journeys.${c}, ''), excluded.${c})`).join(', ')
out.push(`insert into public.semester_journeys (semester, progress, tagline, tagline_id, headline, headline_id, lead, lead_id, intro, intro_id, tech_learning, tech_explored, tech_used, reflection, reflection_id) values\n${rows.join(',\n')}\non conflict (semester) do update set ${fill};`)

// Bidang pengetahuan: satu statement per baris
const areaStmts = JOURNEY.flatMap((r) => r.areas.map((a, i) => {
  const cond = `semester = ${r.semester} and name = ${q(a.name)}`
  return `insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select ${r.semester}, ${i}, ${q(a.name)}, ${q(a.name_id)}, ${q(a.courses.join('\n'))}, ${q(a.courses_id.join('\n'))}, ${q(a.description)}, ${q(a.description_id)}
where not exists (select 1 from public.semester_areas where ${cond});
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), ${q(a.name_id)}), courses_id = coalesce(nullif(courses_id, ''), ${q(a.courses_id.join('\n'))}), description_id = coalesce(nullif(description_id, ''), ${q(a.description_id)}) where ${cond};`
}))
out.push(`-- Bidang pengetahuan: ditambah hanya kalau belum ada; terjemahan ID dilengkapi hanya kalau masih kosong\n${areaStmts.join('\n\n')}`)

// Project (dulu hardcode di data.js → sekarang di database supaya bisa diedit penuh)
const pr = PROJECTS.map((x, i) => {
  const [cat, catId] = bi(x.cat), [desc, descId] = bi(x.desc), [prob, probId] = bi(x.problem), [sol, solId] = bi(x.solution), [role, roleId] = bi(x.role)
  const feats = x.features && !Array.isArray(x.features) ? [x.features.en.join('\n'), x.features.id.join('\n')] : [null, null]
  return `insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select ${q(x.title)}, ${q(desc)}, ${q(descId)}, ${q(x.semester)}, ${q(cat)}, ${q(catId)}, ${arr(x.tech)}, ${q(prob)}, ${q(probId)}, ${q(sol)}, ${q(solId)}, ${q(feats[0])}, ${q(feats[1])}, ${q(role)}, ${q(roleId)}, ${i * 10}, date '${x.year}-01-01', 'published'
where not exists (select 1 from public.projects where title = ${q(x.title)});`
})
out.push(`-- Project: ditambah hanya kalau judul yang sama belum ada\n${pr.join('\n\n')}`)

writeFileSync(new URL('../supabase/02-seed.sql', import.meta.url), out.join('\n\n') + '\n')
console.log('supabase/02-seed.sql dibuat')
