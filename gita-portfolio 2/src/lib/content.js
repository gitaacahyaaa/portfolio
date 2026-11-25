import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from './supabase.js'
import { CERTS, PROJECTS, LINKS, CONTACT_LABELS, JOURNEY } from '../data.js'
import { HERO_PHOTO } from '../hero.js'

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `Semester ${n}`)

const tones = ['peach', 'pink', 'mint', 'lav', 'butter']
const ok = (r) => (r && !r.error && Array.isArray(r.data) ? r.data : null)

// Ambil semua konten publik dari Supabase. RLS memastikan hanya baris 'published' yang terbaca.
// Gagal / belum dikonfigurasi → website memakai konten bawaan (data.js / i18n.js), jadi tidak pernah blank.
export function usePublicContent() {
  const [db, setDb] = useState(null)
  useEffect(() => {
    if (!hasSupabase) return
    let off = false
    const get = (t, ...orders) => orders.reduce((q, [c, asc]) => q.order(c, { ascending: asc }), supabase.from(t).select('*'))
    const giveUp = setTimeout(() => { if (!off) setDb((d) => d || {}) }, 6000)
    Promise.all([
      get('projects', ['sort_order', true], ['created_date', false]),
      get('certificates', ['sort_order', true], ['issue_date', false]),
      get('publications', ['sort_order', true], ['publication_date', false]),
      get('semester_areas', ['sort_order', true]),
      get('journey_steps', ['position', true]),
      get('semester_journeys', ['semester', true]),
      supabase.from('site_settings').select('*'),
    ]).then((rs) => {
      if (off) return
      const [pr, ce, pu, te, st, sj, ss] = rs
      rs.forEach((r, i) => { if (r?.error) console.warn('[portfolio] gagal membaca tabel #' + i, r.error.message, '— sudah menjalankan supabase/01-setup.sql?') })
      const settings = {}
      ;(ok(ss) || []).forEach((r) => { settings[r.key] = r.value })
      setDb({ projects: ok(pr), certs: ok(ce), pubs: ok(pu), areas: ok(te), steps: ok(st), journey: ok(sj), settings })
    }).catch((e) => { console.warn('[portfolio] Supabase tidak terjangkau', e); if (!off) setDb({}) })
    return () => { off = true; clearTimeout(giveUp) }
  }, [])
  return db
}

const split = (s, sep) => String(s || '').split(sep).map((x) => x.trim()).filter(Boolean)
const lines = (v) => (Array.isArray(v) ? v : String(v || '').split(/\n/)).map((x) => x.replace(/^\s*[-•*]\s*/, '').trim()).filter(Boolean)
// Pilih teks sesuai bahasa; kalau terjemahan kosong → pakai bahasa lainnya.
export const tr = (o, k, lang) => {
  const a = o?.[k], b = o?.[`${k}_id`]
  const order = lang === 'id' ? [b, a] : [a, b]
  const hit = order.find((x) => (Array.isArray(x) ? x.length : x))
  return hit ?? (Array.isArray(a) ? [] : '')
}
const bi = (en, id) => ({ en: en || id || '', id: id || en || '' })

// ───────── Teks UI: timpa teks bawaan (i18n.js) dengan editan dari admin ─────────
function setPath(obj, path, val) {
  const ks = path.split('.')
  let o = obj
  for (let i = 0; i < ks.length - 1; i++) { o = o?.[ks[i]]; if (o == null) return }
  if (typeof o[ks[ks.length - 1]] === 'string') o[ks[ks.length - 1]] = val
}
export function mergeCopy(base, db, lang) {
  if (!db) return base
  const t = JSON.parse(JSON.stringify(base))
  const texts = db.settings?.texts || {}
  Object.entries(texts).forEach(([path, v]) => { const x = v?.[lang]; if (typeof x === 'string' && x.trim()) setPath(t, path, x) })
  const lead = db.settings?.about?.[`lead_${lang}`]
  if (lead) t.about.lead = lead
  ;(db.steps || []).forEach((r) => {
    const s = t.about.steps[r.position - 1]
    if (!s) return
    const g = (k) => r[`${k}_${lang}`]
    if (g('tag')) s.tag = g('tag')
    if (g('title')) s.title = g('title')
    if (g('short')) s.short = g('short')
    if (g('story')) s.story = split(g('story'), /\n{2,}/)
    if (g('chips')) s.chips = split(g('chips'), ',')
    s.images = r.images || []
  })
  return t
}

// ───────── Pengaturan umum: CV, foto hero, judul tab, favicon ─────────
export function generalFrom(db, lang) {
  const g = db?.settings?.general || {}
  const pick = (k, fb = '') => (lang === 'id' ? g[`${k}_id`] || g[`${k}_en`] : g[`${k}_en`] || g[`${k}_id`]) || fb
  return { cv: pick('cv'), photo: g.hero_photo || HERO_PHOTO, favicon: g.favicon || '', title: pick('site_title', 'Gita Cahya — Learning Archive'), desc: pick('site_desc') }
}

// ───────── Project ─────────
export function projectsFrom(db) {
  const rows = db?.projects
  const fromDb = (rows || []).map((r) => ({
    uid: r.id, db: true, year: (r.created_date || '').slice(0, 4), tech: r.technologies || [],
    demo: r.demo_url || '', github: r.github_url || '', course: r.course || '', semester: r.semester || '', status: r.semester || null,
    image: r.thumbnail_url || '', images: r.images || [],
    title: bi(r.title, r.title_id), cat: bi(r.category, r.category_id), desc: bi(r.description, r.description_id),
    problem: bi(r.problem, r.problem_id), solution: bi(r.solution, r.solution_id), role: bi(r.role, r.role_id), learned: bi(r.learned, r.learned_id),
    features: { en: lines(r.features || r.features_id), id: lines(r.features_id || r.features) },
  }))
  // Konten bawaan (data.js) hanya dipakai kalau database belum bisa dibaca. Kalau database terhubung, database = satu-satunya sumber
  // (jadi project yang dihapus di admin benar-benar hilang).
  const fallback = rows ? [] : PROJECTS.map((x) => ({ ...x, uid: x.slug, db: false, title: bi(x.title), learned: bi(''), course: '' }))
  const items = [...fromDb, ...fallback].map((x, i) => ({ ...x, id: i, tone: tones[i % 5] }))
  return { items, loading: hasSupabase && db === null }
}

export function certsFrom(db) {
  if (!db?.certs) return CERTS
  return db.certs.map((r, i) => ({
    id: i, tone: tones[i % 5], title: r.name, issuer: r.issuer || '', year: r.issue_date ? r.issue_date.slice(0, 4) : '', link: r.credential_url || '', image: r.image_url || '',
  }))
}

// ───────── Kontak & sosial media ─────────
const strip = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const SOCIAL = ['github', 'linkedin', 'instagram', 'tiktok']
// Kembalian: { items: [{ key, icon, label, url }], email }. Kolom yang dikosongkan di admin otomatis disembunyikan.
export function socialsFrom(db) {
  const src = db?.settings?.contact || { email: LINKS.email.replace('mailto:', ''), github: LINKS.github, linkedin: LINKS.linkedin, instagram: LINKS.instagram, tiktok: LINKS.tiktok, extra: '',
    github_label: CONTACT_LABELS.github, linkedin_label: CONTACT_LABELS.linkedin, instagram_label: CONTACT_LABELS.instagram }
  const items = []
  if (src.email) items.push({ key: 'email', icon: 'mail', label: src.email_label || src.email, url: `mailto:${src.email}` })
  SOCIAL.forEach((k) => { if (src[k]) items.push({ key: k, icon: k, label: src[`${k}_label`] || strip(src[k]), url: src[k] }) })
  split(src.extra, /\n/).forEach((l, i) => {
    const [a, ...b] = l.split('|'); const url = (b.join('|') || '').trim()
    if (a.trim() && /^https?:\/\//i.test(url)) items.push({ key: `x${i}`, icon: 'globe', label: a.trim(), url })
  })
  return { items, email: src.email ? `mailto:${src.email}` : '' }
}

// ───────── Learning Journey ─────────
export function journeyFrom(db) {
  if (!db?.journey?.length) return JOURNEY
  return db.journey.map((r) => ({
    semester: r.semester, progress: r.progress,
    tagline: r.tagline || '', tagline_id: r.tagline_id || '', headline: r.headline || '', headline_id: r.headline_id || '', lead: r.lead || '', lead_id: r.lead_id || '',
    intro: r.intro || '', intro_id: r.intro_id || '', reflection: r.reflection || '', reflection_id: r.reflection_id || '',
    tech_learning: r.tech_learning || [], tech_explored: r.tech_explored || [], tech_used: r.tech_used || [],
    areas: (db.areas || []).filter((a) => a.semester === r.semester).map((a) => ({
      name: a.name, name_id: a.name_id || '', courses: lines(a.courses), courses_id: lines(a.courses_id),
      description: a.description || '', description_id: a.description_id || '', notes: lines(a.notes), notes_id: lines(a.notes_id), images: a.images || [],
    })),
  }))
}
