import { useEffect, useMemo, useState, useCallback } from 'react'
import { LayoutDashboard, FolderKanban, Layers, UserRound, Flag, GraduationCap, Award, BookOpen, Mail, Image as ImageIcon, LogOut, Plus, Search, Pencil, Trash2, X, Upload, ExternalLink, Copy, Languages, Settings2, Download, FileText, RotateCcw } from 'lucide-react'
import { supabase, hasSupabase, BUCKET } from './lib/supabase.js'
import { SEMESTERS } from './lib/content.js'
import { copy } from './i18n.js'
import './admin.css'

const URL_RE = /^https?:\/\/\S+$/i
const MAX_MB = 5, MAX_PDF_MB = 10

/* ───────── helpers ───────── */
async function uploadFile(file, folder, allowPdf = false) {
  const isPdf = file.type === 'application/pdf'
  if (!file.type.startsWith('image/') && !(allowPdf && isPdf)) throw new Error(allowPdf ? 'File harus berupa PDF atau gambar.' : 'File harus berupa gambar.')
  const lim = isPdf ? MAX_PDF_MB : MAX_MB
  if (file.size > lim * 1024 * 1024) throw new Error(`Ukuran maksimal ${lim} MB.`)
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'png'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function validate(fields, v) {
  const errs = {}
  fields.forEach((f) => {
    const x = v[f.k]
    const empty = x == null || x === '' || (Array.isArray(x) && !x.length)
    if (f.req && empty) errs[f.k] = 'Wajib diisi'
    else if (!empty && f.type === 'url' && !URL_RE.test(x)) errs[f.k] = 'Harus diawali http:// atau https://'
    else if (!empty && f.type === 'email' && !/^\S+@\S+\.\S+$/.test(x)) errs[f.k] = 'Email tidak valid'
    else if (!empty && f.max && String(x).length > f.max) errs[f.k] = `Maksimal ${f.max} karakter`
  })
  return errs
}
const toPayload = (fields, v) => Object.fromEntries(fields.map((f) => {
  let x = v[f.k]
  if (f.type === 'number' || f.num) x = x === '' || x == null ? 0 : Number(x)
  else if (f.type === 'tags' || f.type === 'images') x = x || []
  else if (typeof x === 'string') x = x.trim() || null
  else if (x === '') x = null
  return [f.k, x]
}))

/* ───────── UI kecil ───────── */
const Toasts = ({ items }) => <div className="ad-toasts" role="status" aria-live="polite">{items.map((t) => <div key={t.id} className={`ad-toast ${t.type}`}>{t.msg}</div>)}</div>

const Confirm = ({ text, onYes, onNo, busy }) => (
  <div className="ad-overlay" role="dialog" aria-modal="true" onClick={onNo}>
    <div className="ad-dialog sm" onClick={(e) => e.stopPropagation()}>
      <h3>Hapus data?</h3><p>{text}</p>
      <div className="ad-row end"><button className="ad-btn" onClick={onNo}>Batal</button><button className="ad-btn danger" disabled={busy} onClick={onYes}>{busy ? 'Menghapus…' : 'Ya, hapus'}</button></div>
    </div>
  </div>
)

function TagsInput({ value = [], onChange, id }) {
  const [raw, setRaw] = useState(value.join(', '))
  useEffect(() => { setRaw(value.join(', ')) }, [value.join('|')]) // eslint-disable-line
  return <input id={id} value={raw} placeholder="React, Supabase, Figma" onChange={(e) => setRaw(e.target.value)} onBlur={() => onChange(raw.split(',').map((s) => s.trim()).filter(Boolean))} />
}

function ImageField({ value, onChange, folder, notify, multi }) {
  const [busy, setBusy] = useState(false)
  const list = multi ? value || [] : value ? [value] : []
  const pick = async (e) => {
    const files = [...e.target.files]; e.target.value = ''
    if (!files.length) return
    setBusy(true)
    try {
      const urls = []
      for (const f of multi ? files : files.slice(0, 1)) urls.push(await uploadFile(f, folder))
      onChange(multi ? [...list, ...urls] : urls[0]); notify('success', 'Gambar berhasil diunggah')
    } catch (err) { notify('error', err.message || 'Upload gagal') }
    setBusy(false)
  }
  return (
    <div className="ad-img">
      <div className="ad-thumbs">
        {list.map((u) => (
          <div className="ad-th" key={u}><img src={u} alt="" /><button type="button" aria-label="Hapus gambar" onClick={() => onChange(multi ? list.filter((x) => x !== u) : '')}><X size={12} /></button></div>
        ))}
        <label className={`ad-up${busy ? ' busy' : ''}`}><Upload size={16} /><span>{busy ? 'Mengunggah…' : multi ? 'Tambah gambar' : list.length ? 'Ganti' : 'Unggah'}</span>
          <input type="file" accept="image/*" multiple={multi} hidden onChange={pick} disabled={busy} /></label>
      </div>
    </div>
  )
}

function FileField({ id, value, onChange, folder, notify, pdf }) {
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const file = e.target.files[0]; e.target.value = ''
    if (!file) return
    setBusy(true)
    try { onChange(await uploadFile(file, folder, pdf)); notify('success', 'File berhasil diunggah — jangan lupa klik Simpan') } catch (err) { notify('error', err.message || 'Upload gagal') }
    setBusy(false)
  }
  return (
    <div className="ad-img">
      <div className="ad-row">
        <input id={id} value={value || ''} placeholder="https://… (tempel link) atau unggah file →" onChange={(e) => onChange(e.target.value)} />
        <label className={`ad-up${busy ? ' busy' : ''}`}><Upload size={16} /><span>{busy ? 'Mengunggah…' : 'Unggah'}</span><input type="file" accept={pdf ? 'application/pdf,image/*' : 'image/*'} hidden onChange={pick} disabled={busy} /></label>
        {value && <button type="button" className="ad-ic danger" aria-label="Kosongkan" onClick={() => onChange('')}><X size={15} /></button>}
      </div>
      {value && /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value) && <div className="ad-thumbs" style={{ marginTop: 8 }}><div className="ad-th"><img src={value} alt="" /></div></div>}
      {value && <a className="ad-link" href={value} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Buka file / link</a>}
    </div>
  )
}

function Field({ f, v, set, err, ctx }) {
  const id = `f-${f.k}`
  const val = v[f.k] ?? (f.type === 'tags' || f.type === 'images' ? [] : '')
  let input
  if (f.type === 'textarea') input = <textarea id={id} rows={f.rows || 4} value={val} onChange={(e) => set(f.k, e.target.value)} />
  else if (f.type === 'file') input = <FileField id={id} value={val} pdf={f.pdf} folder={f.folder || 'files'} notify={ctx.notify} onChange={(x) => set(f.k, x)} />
  else if (f.type === 'tags') input = <TagsInput id={id} value={val} onChange={(x) => set(f.k, x)} />
  else if (f.type === 'image' || f.type === 'images') input = <ImageField value={val} multi={f.type === 'images'} folder={f.folder || 'media'} notify={ctx.notify} onChange={(x) => set(f.k, x)} />
  else if (f.type === 'select' || f.type === 'semester') {
    const opts = f.type === 'semester' ? SEMESTERS.map((l) => [l, l]) : f.options
    input = <select id={id} value={val} onChange={(e) => set(f.k, e.target.value)}><option value="">{f.type === 'semester' ? '— Pilih semester —' : '—'}</option>{opts.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
  } else input = <>
    <input id={id} type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'} value={val} list={f.suggest ? `dl-${f.k}` : undefined} placeholder={f.ph} onChange={(e) => set(f.k, e.target.value)} />
    {f.suggest && <datalist id={`dl-${f.k}`}>{(ctx.suggest[f.k] || []).map((s) => <option key={s} value={s} />)}</datalist>}
  </>
  return <div className={`ad-f${f.wide ? ' wide' : ''}${err ? ' bad' : ''}`}><label htmlFor={id}>{f.label}{f.req && <b> *</b>}</label>{input}{f.help && <small>{f.help}</small>}{err && <em>{err}</em>}</div>
}

/* ───────── Manager CRUD generik ───────── */
function Manager({ cfg, ctx }) {
  const { notify } = ctx
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [fs, setFs] = useState({ semester: '', category: '', status: '' })
  const [edit, setEdit] = useState(null) // null | {} (baru) | row
  const [errs, setErrs] = useState({})
  const [saving, setSaving] = useState(false)
  const [del, setDel] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(cfg.table).select('*').order(cfg.order || 'created_at', { ascending: cfg.asc ?? false })
    if (error) notify('error', error.message); else setRows(data)
    setLoading(false)
  }, [cfg, notify])
  useEffect(() => { load() }, [load])

  const ttl = (r) => (cfg.titleFn ? cfg.titleFn(r) : r[cfg.title] || r[cfg.titleAlt])
  const hasF = (k) => cfg.fields.some((f) => f.k === k)
  const cats = useMemo(() => [...new Set(rows.map((r) => r.category).filter(Boolean))], [rows])
  const shown = rows.filter((r) => {
    const hay = cfg.search.map((k) => r[k]).join(' ').toLowerCase()
    return (!q || hay.includes(q.toLowerCase())) && (!fs.semester || String(r.semester) === fs.semester) && (!fs.category || r.category === fs.category) && (!fs.status || r.status === fs.status)
  })
  const suggest = { category: cats, ...ctx.suggest }

  const save = async (statusOverride) => {
    const v = { ...edit, ...(statusOverride ? { status: statusOverride } : {}) }
    const e = validate(cfg.fields, v)
    setErrs(e)
    if (Object.keys(e).length) return notify('error', 'Periksa kolom yang ditandai.')
    setSaving(true)
    const payload = toPayload(cfg.fields, v)
    const res = v.id ? await supabase.from(cfg.table).update(payload).eq('id', v.id) : await supabase.from(cfg.table).insert(payload)
    setSaving(false)
    if (res.error) return notify('error', res.error.code === '23505' ? 'Data dengan nilai unik tersebut sudah ada.' : res.error.message)
    notify('success', v.status === 'published' ? 'Tersimpan & dipublikasikan' : v.status === 'draft' ? 'Tersimpan sebagai draft' : 'Tersimpan')
    setEdit(null); load(); ctx.refresh()
  }
  const remove = async () => {
    setSaving(true)
    const { error } = await supabase.from(cfg.table).delete().eq('id', del.id)
    setSaving(false); setDel(null)
    if (error) return notify('error', error.message)
    notify('success', 'Data dihapus'); load(); ctx.refresh()
  }
  const fmt = (r, k) => (k === 'technologies' ? (r[k] || []).join(', ') : k === 'semester' && cfg.table !== 'projects' ? `Semester ${r[k]}` : r[k])

  return (
    <>
      <div className="ad-bar">
        <label className="ad-search"><Search size={16} /><input placeholder="Cari…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        {hasF('semester') && <select value={fs.semester} onChange={(e) => setFs({ ...fs, semester: e.target.value })}><option value="">Semua semester</option>{SEMESTERS.map((l, i) => <option key={l} value={cfg.table === 'projects' ? l : String(i + 1)}>{l}</option>)}</select>}
        {hasF('category') && cfg.table === 'projects' && <select value={fs.category} onChange={(e) => setFs({ ...fs, category: e.target.value })}><option value="">Semua kategori</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>}
        {hasF('status') && <select value={fs.status} onChange={(e) => setFs({ ...fs, status: e.target.value })}><option value="">Semua status</option><option value="published">Published</option><option value="draft">Draft</option></select>}
        <button className="ad-btn solid" onClick={() => { setErrs({}); setEdit(cfg.defaults ? { ...cfg.defaults } : {}) }}><Plus size={16} /> {cfg.add}</button>
      </div>

      {loading ? <p className="ad-muted">Memuat…</p> : !shown.length ? <p className="ad-empty">{rows.length ? 'Tidak ada hasil untuk filter ini.' : 'Belum ada data. Klik tombol tambah untuk mulai.'}</p> : (
        <ul className="ad-list">
          {shown.map((r) => (
            <li key={r.id} className="ad-item">
              {cfg.thumb && (r[cfg.thumb] ? <img className="ad-ti" src={r[cfg.thumb]} alt="" /> : <span className="ad-ti ph" />)}
              <div className="ad-it">
                <strong>{ttl(r) || '(tanpa judul)'}</strong>
                <span>{cfg.sub.map((k) => fmt(r, k)).filter(Boolean).join(' · ')}</span>
              </div>
              {r.status && <span className={`ad-badge ${r.status}`}>{r.status}</span>}
              <button className="ad-ic" aria-label="Edit" onClick={() => { setErrs({}); setEdit(r) }}><Pencil size={16} /></button>
              <button className="ad-ic danger" aria-label="Hapus" onClick={() => setDel(r)}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      {edit && (
        <div className="ad-overlay" role="dialog" aria-modal="true">
          <div className="ad-dialog">
            <div className="ad-dh"><h3>{edit.id ? 'Edit' : cfg.add}</h3><button className="ad-ic" aria-label="Tutup" onClick={() => setEdit(null)}><X size={18} /></button></div>
            <div className="ad-grid">{cfg.fields.filter((f) => f.k !== 'status' || !cfg.draftButtons).map((f) => <Field key={f.k} f={f} v={edit} err={errs[f.k]} ctx={{ ...ctx, suggest }} set={(k, x) => setEdit((o) => ({ ...o, [k]: x }))} />)}</div>
            <div className="ad-row end">
              <button className="ad-btn" onClick={() => setEdit(null)}>Batal</button>
              {cfg.draftButtons ? <>
                <button className="ad-btn" disabled={saving} onClick={() => save('draft')}>Simpan sebagai draft</button>
                <button className="ad-btn solid" disabled={saving} onClick={() => save('published')}>{saving ? 'Menyimpan…' : 'Publish'}</button>
              </> : <button className="ad-btn solid" disabled={saving} onClick={() => save()}>{saving ? 'Menyimpan…' : 'Simpan'}</button>}
            </div>
          </div>
        </div>
      )}
      {del && <Confirm busy={saving} text={`“${ttl(del) || 'Item ini'}” akan dihapus permanen dan hilang dari website publik.`} onYes={remove} onNo={() => setDel(null)} />}
    </>
  )
}

/* ───────── Form pengaturan (About, Contact) ───────── */
function Settings({ skey, fields, ctx }) {
  const [v, setV] = useState(null); const [errs, setErrs] = useState({}); const [saving, setSaving] = useState(false)
  useEffect(() => { supabase.from('site_settings').select('value').eq('key', skey).maybeSingle().then(({ data }) => setV(data?.value || {})) }, [skey])
  if (!v) return <p className="ad-muted">Memuat…</p>
  const save = async () => {
    const e = validate(fields, v); setErrs(e)
    if (Object.keys(e).length) return ctx.notify('error', 'Periksa kolom yang ditandai.')
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({ key: skey, value: Object.fromEntries(fields.map((f) => [f.k, (v[f.k] || '').toString().trim()])) })
    setSaving(false)
    error ? ctx.notify('error', error.message) : ctx.notify('success', 'Perubahan tersimpan')
  }
  return (
    <div className="ad-card">
      <div className="ad-grid">{fields.map((f) => <Field key={f.k} f={f} v={v} err={errs[f.k]} ctx={ctx} set={(k, x) => setV((o) => ({ ...o, [k]: x }))} />)}</div>
      <div className="ad-row end"><button className="ad-btn solid" disabled={saving} onClick={save}>{saving ? 'Menyimpan…' : 'Simpan perubahan'}</button></div>
    </div>
  )
}

/* ───────── Media ───────── */
const FOLDERS = ['journey', 'projects', 'certificates', 'tech', 'about', 'publications', 'media', 'files']
function Media({ ctx }) {
  const [files, setFiles] = useState([]); const [busy, setBusy] = useState(false); const [del, setDel] = useState(null)
  const load = useCallback(async () => {
    const all = await Promise.all(FOLDERS.map(async (f) => { const { data } = await supabase.storage.from(BUCKET).list(f, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } }); return (data || []).filter((x) => x.id).map((x) => ({ path: `${f}/${x.name}`, size: x.metadata?.size })) }))
    setFiles(all.flat())
  }, [])
  useEffect(() => { load() }, [load])
  const url = (p) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl
  const up = async (e) => {
    const fs = [...e.target.files]; e.target.value = ''; setBusy(true)
    try { for (const f of fs) await uploadFile(f, 'media'); ctx.notify('success', 'Berhasil diunggah'); load() } catch (er) { ctx.notify('error', er.message) }
    setBusy(false)
  }
  const remove = async () => { const { error } = await supabase.storage.from(BUCKET).remove([del.path]); setDel(null); error ? ctx.notify('error', error.message) : (ctx.notify('success', 'File dihapus'), load()) }
  return (
    <>
      <div className="ad-bar"><label className={`ad-btn solid${busy ? ' busy' : ''}`}><Upload size={16} /> {busy ? 'Mengunggah…' : 'Unggah gambar'}<input type="file" accept="image/*" multiple hidden onChange={up} disabled={busy} /></label></div>
      {!files.length ? <p className="ad-empty">Belum ada media.</p> : (
        <ul className="ad-media">{files.map((f) => (
          <li key={f.path}>{/\.pdf$/i.test(f.path) ? <span className="ad-pdf"><FileText size={36} /></span> : <img src={url(f.path)} alt="" loading="lazy" />}<small>{f.path}</small>
            <div className="ad-row"><button className="ad-ic" aria-label="Salin URL" onClick={() => navigator.clipboard.writeText(url(f.path)).then(() => ctx.notify('success', 'URL disalin'))}><Copy size={15} /></button><a className="ad-ic" aria-label="Buka" href={url(f.path)} target="_blank" rel="noreferrer"><ExternalLink size={15} /></a><button className="ad-ic danger" aria-label="Hapus" onClick={() => setDel(f)}><Trash2 size={15} /></button></div></li>
        ))}</ul>
      )}
      {del && <Confirm text={`File ${del.path} akan dihapus. Jika masih dipakai di konten, gambarnya akan hilang.`} onYes={remove} onNo={() => setDel(null)} />}
    </>
  )
}

/* ───────── Overview ───────── */
function Overview({ go, ctx }) {
  const [c, setC] = useState(null)
  useEffect(() => {
    const cnt = async (t, status) => { let r = supabase.from(t).select('id', { count: 'exact', head: true }); if (status) r = r.eq('status', status); return (await r).count || 0 }
    Promise.all([cnt('projects'), cnt('projects', 'draft'), cnt('semester_journeys'), cnt('certificates'), cnt('publications')]).then(([p, d, t, ce, pu]) => setC({ p, d, t, ce, pu }))
  }, [])
  const cards = c && [['Projects', c.p, `${c.d} draft`, 'projects'], ['Semester', c.t, 'halaman', 'sempages'], ['Sertifikat', c.ce, 'dokumen', 'certs'], ['Publikasi', c.pu, 'item', 'pubs']]
  return !c ? <p className="ad-muted">Memuat…</p> : (
    <>
      <div className="ad-stats">{cards.map(([l, n, s, k]) => <button key={l} className="ad-stat" onClick={() => go(k)}><b>{n}</b><span>{l}</span><small>{s}</small></button>)}</div>
      <div className="ad-card" style={{ marginTop: 18 }}><h3>Backup konten</h3><p className="ad-muted">Unduh semua konten (termasuk draft) sebagai file JSON. Sebaiknya dilakukan sebelum perubahan besar.</p><button className="ad-btn" onClick={() => backup(ctx.notify)}><Download size={16} /> Unduh backup</button></div>
    </>
  )
}

/* ───────── Editor teks website (EN / ID) ───────── */
// Menampilkan SEMUA teks antarmuka dari i18n.js dalam dua bahasa. Yang diubah disimpan di database (site_settings → texts) dan menimpa teks bawaan.
const SECTION_NAMES = { nav: 'Menu navigasi', menu: 'Umum', skip: 'Umum', hero: 'Hero (halaman depan)', about: 'About', journey: 'Learning Journey', projects: 'What I Made (Projects)', certs: 'Certificates', contact: 'Contact & footer', pubs: 'Publications', ui: 'Label aksesibilitas & alt-text' }
const SKIP = ['about.steps', 'about.lead']
function flatten(o, pre = '', out = []) {
  Object.entries(o).forEach(([k, v]) => {
    const path = pre ? `${pre}.${k}` : k
    if (SKIP.some((x) => path === x || path.startsWith(x + '.'))) return
    if (typeof v === 'string') out.push(path)
    else if (v && typeof v === 'object') flatten(v, path, out)
  })
  return out
}
const getPath = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o)
const TEXT_PATHS = flatten(copy.en)

function TextsEditor({ ctx }) {
  const [over, setOver] = useState(null); const [saving, setSaving] = useState(false); const [q, setQ] = useState('')
  useEffect(() => { supabase.from('site_settings').select('value').eq('key', 'texts').maybeSingle().then(({ data }) => setOver(data?.value || {})) }, [])
  if (!over) return <p className="ad-muted">Memuat…</p>
  const def = (p, l) => getPath(copy[l], p) ?? ''
  const cur = (p, l) => over[p]?.[l] ?? def(p, l)
  const setVal = (p, l, x) => setOver((o) => ({ ...o, [p]: { ...(o[p] || {}), [l]: x } }))
  const reset = (p) => setOver((o) => { const n = { ...o }; delete n[p]; return n })
  const groups = {}
  TEXT_PATHS.forEach((p) => { const g = SECTION_NAMES[p.split('.')[0]] || 'Lainnya'; (groups[g] ||= []).push(p) })
  const save = async () => {
    const clean = {}
    TEXT_PATHS.forEach((p) => {
      const o = {}
      ;['en', 'id'].forEach((l) => { const x = (over[p]?.[l] ?? '').trim(); if (x && x !== def(p, l)) o[l] = x })
      if (Object.keys(o).length) clean[p] = o
    })
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({ key: 'texts', value: clean })
    setSaving(false)
    if (error) return ctx.notify('error', error.message)
    setOver(clean); ctx.notify('success', 'Teks tersimpan')
  }
  const ql = q.toLowerCase()
  const match = (p) => !ql || [p, cur(p, 'en'), cur(p, 'id')].join(' ').toLowerCase().includes(ql)
  return (
    <>
      <p className="ad-muted" style={{ maxWidth: 880, marginTop: 0 }}>Semua teks tetap di website (tombol, judul section, label, footer, dll) dalam Indonesia & English. Edit langsung lalu klik <b>Simpan semua teks</b>. Ikon ↺ mengembalikan satu teks ke bawaan. Teks bio About dan checkpoint peta ada di menu About masing-masing.</p>
      <div className="ad-bar"><label className="ad-search"><Search size={16} /><input placeholder="Cari teks…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <button className="ad-btn solid" disabled={saving} onClick={save}>{saving ? 'Menyimpan…' : 'Simpan semua teks'}</button></div>
      {Object.entries(groups).map(([g, ps]) => ps.some(match) && (
        <details key={g} className="ad-acc" open={!!ql || g.startsWith('Hero')}>
          <summary>{g} <small>({ps.length})</small></summary>
          {ps.filter(match).map((p) => {
            const long = Math.max(def(p, 'en').length, def(p, 'id').length) > 70
            const changed = ['en', 'id'].some((l) => cur(p, l) !== def(p, l))
            return (
              <div className="ad-tx" key={p}>
                <div className="ad-txh"><code>{p}</code>{changed && <button type="button" className="ad-ic" title="Kembalikan ke bawaan" aria-label="Kembalikan ke bawaan" onClick={() => reset(p)}><RotateCcw size={13} /></button>}</div>
                <div className="ad-grid">
                  {['en', 'id'].map((l) => (
                    <div className="ad-f" key={l}><label>{l === 'en' ? 'English' : 'Indonesia'}</label>
                      {long ? <textarea rows={Math.min(8, Math.ceil(cur(p, l).length / 60) + 1)} value={cur(p, l)} onChange={(e) => setVal(p, l, e.target.value)} /> : <input value={cur(p, l)} onChange={(e) => setVal(p, l, e.target.value)} />}</div>
                  ))}
                </div>
              </div>
            )
          })}
        </details>
      ))}
      <div className="ad-row end" style={{ maxWidth: 880, marginTop: 16 }}><button className="ad-btn solid" disabled={saving} onClick={save}>{saving ? 'Menyimpan…' : 'Simpan semua teks'}</button></div>
    </>
  )
}

/* ───────── Backup ───────── */
const TABLES = ['projects', 'certificates', 'publications', 'journey_steps', 'semester_journeys', 'semester_areas', 'site_settings']
async function backup(notify) {
  const out = { exported_at: new Date().toISOString() }
  for (const t of TABLES) {
    const { data, error } = await supabase.from(t).select('*')
    if (error) return notify('error', `${t}: ${error.message}`)
    out[t] = data
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }))
  a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
  notify('success', 'Backup diunduh')
}

/* ───────── Konfigurasi tiap halaman ───────── */
const STATUS = [['draft', 'Draft'], ['published', 'Published']]
const SEM_OPTS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [String(n), `Semester ${n}`])
const ORDER = { k: 'sort_order', label: 'Urutan tampil', type: 'number', help: 'Angka kecil tampil lebih dulu (0 = default).' }
const CFG = {
  projects: { table: 'projects', add: 'Project baru', title: 'title', order: 'sort_order', asc: true, sub: ['semester', 'category', 'technologies'], search: ['title', 'title_id', 'description', 'category', 'course', 'technologies'], thumb: 'thumbnail_url', draftButtons: true, defaults: { status: 'draft', sort_order: 0, created_date: new Date().toISOString().slice(0, 10) },
    fields: [
      { k: 'title', label: 'Judul project (EN)', req: true, max: 160 }, { k: 'title_id', label: 'Judul project (ID)', max: 160, help: 'Kosong = pakai versi EN' },
      { k: 'description', label: 'Deskripsi singkat (EN)', type: 'textarea', max: 4000 }, { k: 'description_id', label: 'Deskripsi singkat (ID)', type: 'textarea', max: 4000 },
      { k: 'category', label: 'Kategori (EN)', suggest: true, max: 80, ph: 'Web App, Mobile, UI/UX…' }, { k: 'category_id', label: 'Kategori (ID)', max: 80, ph: 'Aplikasi Web, Desain UI/UX…' },
      { k: 'problem', label: 'Masalah (EN)', type: 'textarea', rows: 3, max: 2000 }, { k: 'problem_id', label: 'Masalah (ID)', type: 'textarea', rows: 3, max: 2000 },
      { k: 'solution', label: 'Solusi (EN)', type: 'textarea', rows: 3, max: 2000 }, { k: 'solution_id', label: 'Solusi (ID)', type: 'textarea', rows: 3, max: 2000 },
      { k: 'features', label: 'Fitur utama (EN)', type: 'textarea', rows: 4, max: 2000, help: 'Satu fitur per baris' }, { k: 'features_id', label: 'Fitur utama (ID)', type: 'textarea', rows: 4, max: 2000, help: 'Satu fitur per baris' },
      { k: 'role', label: 'Peran (EN)', max: 120, ph: 'Full-stack Developer' }, { k: 'role_id', label: 'Peran (ID)', max: 120, ph: 'Developer Full-stack' },
      { k: 'learned', label: 'What I learned (EN)', type: 'textarea', max: 4000 }, { k: 'learned_id', label: 'Yang kupelajari (ID)', type: 'textarea', max: 4000 },
      { k: 'semester', label: 'Semester', type: 'semester', req: true }, { k: 'course', label: 'Mata kuliah (opsional)', max: 120 },
      { k: 'created_date', label: 'Tanggal project dibuat', type: 'date' }, ORDER,
      { k: 'technologies', label: 'Teknologi yang dipakai', type: 'tags', wide: true, help: 'Pisahkan dengan koma' },
      { k: 'thumbnail_url', label: 'Thumbnail', type: 'image', folder: 'projects', wide: true },
      { k: 'images', label: 'Gambar tambahan', type: 'images', folder: 'projects', wide: true },
      { k: 'github_url', label: 'URL GitHub', type: 'url' }, { k: 'demo_url', label: 'URL Live demo', type: 'url' },
      { k: 'status', label: 'Status', type: 'select', options: STATUS },
    ] },
  steps: { table: 'journey_steps', add: 'Checkpoint', order: 'position', asc: true, title: 'title_en', sub: ['tag_en'], search: ['title_en', 'title_id', 'tag_en'],
    fields: [
      { k: 'position', num: true, label: 'Slot checkpoint (1–4)', type: 'select', req: true, options: [['1', '1 · Titik awal'], ['2', '2 · Kedua'], ['3', '3 · Ketiga'], ['4', '4 · Tujuan akhir']], help: 'Peta punya 4 titik tetap, sesuai desain asli.', wide: true },
      { k: 'tag_en', label: 'Tag (EN)', max: 60 }, { k: 'tag_id', label: 'Tag (ID)', max: 60 },
      { k: 'title_en', label: 'Title (EN)', req: true, max: 80 }, { k: 'title_id', label: 'Judul (ID)', max: 80 },
      { k: 'short_en', label: 'Short (EN)', type: 'textarea', rows: 2, max: 300 }, { k: 'short_id', label: 'Ringkas (ID)', type: 'textarea', rows: 2, max: 300 },
      { k: 'story_en', label: 'Description (EN)', type: 'textarea', max: 2000, help: 'Pisahkan paragraf dengan baris kosong' }, { k: 'story_id', label: 'Deskripsi (ID)', type: 'textarea', max: 2000 },
      { k: 'chips_en', label: 'Chips (EN)', help: 'Pisahkan dengan koma' }, { k: 'chips_id', label: 'Chips (ID)', help: 'Pisahkan dengan koma' },
      { k: 'images', label: 'Gambar (tampil di pop-up)', type: 'images', folder: 'about', wide: true },
    ] },
  sempages: { table: 'semester_journeys', add: 'Halaman semester', order: 'semester', asc: true, search: ['tagline', 'tagline_id', 'headline', 'intro', 'reflection'], sub: ['progress'],
    titleFn: (r) => `Semester ${r.semester}${r.tagline ? ' — ' + r.tagline : ''}`, defaults: { status: 'published', progress: 'current' },
    fields: [
      { k: 'semester', num: true, label: 'Semester', type: 'select', req: true, options: SEM_OPTS, help: 'Satu halaman per semester.' },
      { k: 'progress', label: 'Progress', type: 'select', options: [['completed', 'Completed'], ['current', 'Currently Learning'], ['upcoming', 'Upcoming']] },
      { k: 'tagline', label: 'Tagline kecil (EN)', max: 120, ph: 'Building the Foundation' }, { k: 'tagline_id', label: 'Tagline kecil (ID)', max: 120, ph: 'Membangun Fondasi' },
      { k: 'headline', label: 'Judul halaman (EN)', max: 120, ph: 'The Foundation' }, { k: 'headline_id', label: 'Judul halaman (ID)', max: 120 },
      { k: 'lead', label: 'Kalimat pembuka (EN)', max: 300 }, { k: 'lead_id', label: 'Kalimat pembuka (ID)', max: 300 },
      { k: 'intro', label: 'Deskripsi semester (EN)', type: 'textarea', rows: 5, max: 3000, help: 'Tampil di kartu timeline dan halaman detail.' }, { k: 'intro_id', label: 'Deskripsi semester (ID)', type: 'textarea', rows: 5, max: 3000 },
      { k: 'reflection', label: 'What This Semester Taught Me (EN)', type: 'textarea', rows: 6, max: 4000 }, { k: 'reflection_id', label: 'Yang Diajarkan Semester Ini (ID)', type: 'textarea', rows: 6, max: 4000 },
      { k: 'tech_learning', label: 'Tech — Currently Learning', type: 'tags', wide: true, help: 'Pisahkan dengan koma' },
      { k: 'tech_explored', label: 'Tech — Have Explored', type: 'tags', wide: true },
      { k: 'tech_used', label: 'Tech — Used in Projects', type: 'tags', wide: true },
      { k: 'status', label: 'Status', type: 'select', options: STATUS },
    ] },
  areas: { table: 'semester_areas', add: 'Bidang pengetahuan', order: 'semester', asc: true, title: 'name', search: ['name', 'name_id', 'courses', 'description'], sub: ['semester'],
    fields: [
      { k: 'semester', num: true, label: 'Semester', type: 'select', req: true, options: SEM_OPTS }, { k: 'sort_order', label: 'Urutan', type: 'number' },
      { k: 'name', label: 'Nama bidang (EN)', req: true, max: 120, ph: 'Computer Fundamentals' }, { k: 'name_id', label: 'Nama bidang (ID)', max: 120 },
      { k: 'courses', label: 'Mata kuliah (EN)', type: 'textarea', rows: 3, max: 1000, help: 'Satu per baris' }, { k: 'courses_id', label: 'Mata kuliah (ID)', type: 'textarea', rows: 3, max: 1000, help: 'Satu per baris' },
      { k: 'description', label: 'Deskripsi singkat (EN)', type: 'textarea', rows: 3, max: 1500 }, { k: 'description_id', label: 'Deskripsi singkat (ID)', type: 'textarea', rows: 3, max: 1500 },
      { k: 'notes', label: 'Knowledge Showcase — catatan (EN)', type: 'textarea', rows: 8, max: 6000, help: 'Tampil saat bidang diklik. Satu paragraf per baris. Isi hanya yang memang pernah kamu pelajari.' }, { k: 'notes_id', label: 'Knowledge Showcase — catatan (ID)', type: 'textarea', rows: 8, max: 6000, help: 'Satu paragraf per baris.' },
      { k: 'images', label: 'Diagram / foto catatan', type: 'images', folder: 'journey', wide: true },
    ] },
  certs: { table: 'certificates', add: 'Sertifikat baru', order: 'sort_order', asc: true, title: 'name', sub: ['issuer', 'issue_date'], search: ['name', 'issuer'], thumb: 'image_url', defaults: { status: 'published', sort_order: 0 },
    fields: [
      { k: 'name', label: 'Nama sertifikat', req: true, max: 200, wide: true }, { k: 'issuer', label: 'Penerbit', max: 160 }, { k: 'issue_date', label: 'Tanggal terbit', type: 'date' },
      { k: 'credential_url', label: 'URL kredensial', type: 'url' }, ORDER, { k: 'image_url', label: 'Gambar sertifikat', type: 'image', folder: 'certificates', wide: true },
      { k: 'status', label: 'Status', type: 'select', options: STATUS },
    ] },
  pubs: { table: 'publications', add: 'Publikasi baru', order: 'sort_order', asc: true, title: 'title', sub: ['publication_date'], search: ['title', 'description'], defaults: { status: 'published', sort_order: 0 },
    fields: [
      { k: 'title', label: 'Judul (EN)', req: true, max: 240 }, { k: 'title_id', label: 'Judul (ID)', max: 240 },
      { k: 'description', label: 'Deskripsi (EN)', type: 'textarea', max: 4000 }, { k: 'description_id', label: 'Deskripsi (ID)', type: 'textarea', max: 4000 },
      { k: 'publication_date', label: 'Tanggal publikasi', type: 'date' }, { k: 'external_url', label: 'URL eksternal', type: 'url' }, ORDER,
      { k: 'status', label: 'Status', type: 'select', options: STATUS },
    ] },
}
const ABOUT = [{ k: 'lead_en', label: 'Biography (EN)', type: 'textarea', rows: 6, max: 2000, wide: true }, { k: 'lead_id', label: 'Biografi (ID)', type: 'textarea', rows: 6, max: 2000, wide: true }]
const CONTACT = [
  { k: 'email', label: 'Email', type: 'email', help: 'Kosongkan untuk menyembunyikan email & tombol “Kirim email”.' }, { k: 'email_label', label: 'Teks tampil email (opsional)', max: 80 },
  { k: 'github', label: 'GitHub URL', type: 'url' }, { k: 'github_label', label: 'Teks tampil GitHub (opsional)', max: 80, help: 'Kosong = otomatis dari URL' },
  { k: 'linkedin', label: 'LinkedIn URL', type: 'url' }, { k: 'linkedin_label', label: 'Teks tampil LinkedIn (opsional)', max: 80 },
  { k: 'instagram', label: 'Instagram URL', type: 'url' }, { k: 'instagram_label', label: 'Teks tampil Instagram (opsional)', max: 80 },
  { k: 'tiktok', label: 'TikTok URL', type: 'url', ph: 'https://www.tiktok.com/@username' }, { k: 'tiktok_label', label: 'Teks tampil TikTok (opsional)', max: 80, ph: '@username' },
  { k: 'extra', label: 'Social media lainnya', type: 'textarea', rows: 3, wide: true, max: 600, help: 'Satu per baris: Nama | https://link  (contoh: YouTube | https://youtube.com/@nama)' },
]
const GENERAL = [
  { k: 'cv_en', label: 'CV — versi English', type: 'file', pdf: true, folder: 'files', wide: true, help: 'Unggah PDF (maks 10 MB) atau tempel link Google Drive. Tombol “Download CV” di halaman depan muncul otomatis kalau diisi.' },
  { k: 'cv_id', label: 'CV — versi Indonesia (opsional)', type: 'file', pdf: true, folder: 'files', wide: true, help: 'Kosong = bahasa Indonesia memakai CV English (dan sebaliknya).' },
  { k: 'hero_photo', label: 'Foto hero (halaman depan)', type: 'file', folder: 'about', wide: true, help: 'Kosong = foto bawaan. Disarankan PNG/WebP transparan.' },
  { k: 'site_title_en', label: 'Judul tab browser (EN)', max: 120, ph: 'Gita Cahya — Learning Archive' }, { k: 'site_title_id', label: 'Judul tab browser (ID)', max: 120 },
  { k: 'site_desc_en', label: 'Deskripsi website / SEO (EN)', type: 'textarea', rows: 2, max: 300 }, { k: 'site_desc_id', label: 'Deskripsi website / SEO (ID)', type: 'textarea', rows: 2, max: 300 },
  { k: 'favicon', label: 'Favicon (ikon tab)', type: 'file', folder: 'about', wide: true, help: 'PNG persegi kecil (mis. 64×64).' },
]
const NAV = [
  ['overview', 'Dashboard', LayoutDashboard], ['projects', 'Projects', FolderKanban], ['about', 'About Me (bio)', UserRound],
  ['steps', 'Peta About (checkpoint)', Flag], ['sempages', 'Learning Journey', GraduationCap], ['areas', 'Bidang & Showcase', Layers], ['certs', 'Certificates', Award], ['pubs', 'Publications', BookOpen],
  ['contact', 'Contact & Sosial Media', Mail], ['general', 'Umum: CV, Foto, Tab', Settings2], ['texts', 'Teks Website (EN/ID)', Languages], ['media', 'Media', ImageIcon],
]

/* ───────── Login ───────── */
function Login({ onDone }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) { setBusy(false); return setErr('Email atau password salah.') }
    const { data: ok } = await supabase.rpc('is_admin')
    if (!ok) { await supabase.auth.signOut(); setBusy(false); return setErr('Akun ini tidak memiliki akses admin.') }
    setBusy(false); onDone()
  }
  return (
    <div className="ad-login"><form className="ad-card" onSubmit={go}>
      <span className="ad-logo">✦</span><h1>Admin</h1><p className="ad-muted">Masuk untuk mengelola portfolio.</p>
      <div className="ad-f"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="ad-f"><label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      {err && <p className="ad-err" role="alert">{err}</p>}
      <button className="ad-btn solid full" disabled={busy}>{busy ? 'Masuk…' : 'Masuk'}</button>
      <a className="ad-muted back" href="/">← Kembali ke website</a>
    </form></div>
  )
}

/* ───────── Root ───────── */
export default function Admin() {
  const [state, setState] = useState('loading') // loading | out | in
  const [page, setPage] = useState('overview')
  const [toasts, setToasts] = useState([])
  const [navOpen, setNavOpen] = useState(false)

  const notify = useCallback((type, msg) => {
    const id = Math.random(); setToasts((t) => [...t, { id, type, msg }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])
  const refresh = useCallback(() => {}, [])

  useEffect(() => {
    if (!hasSupabase) return setState('nosetup')
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return setState('out')
      const { data: ok } = await supabase.rpc('is_admin')
      setState(ok ? 'in' : 'out')
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') setState('out') })
    return () => sub.subscription.unsubscribe()
  }, [])
  useEffect(() => { document.title = 'Admin — Gita Cahya' }, [])

  if (state === 'loading') return <div className="ad-root"><p className="ad-muted pad">Memuat…</p></div>
  if (state === 'nosetup') return <div className="ad-root ad-login"><div className="ad-card"><h1>Supabase belum diatur</h1><p>Buat file <code>.env</code> dari <code>.env.example</code> lalu isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>. Lihat README.</p></div></div>
  if (state === 'out') return <div className="ad-root"><Login onDone={() => setState('in')} /><Toasts items={toasts} /></div>

  const ctx = { notify, refresh, suggest: {} }
  const cur = NAV.find((n) => n[0] === page)
  const body = CFG[page] ? <Manager key={page} cfg={CFG[page]} ctx={ctx} />
    : page === 'overview' ? <Overview go={setPage} ctx={ctx} />
    : page === 'about' ? <Settings skey="about" fields={ABOUT} ctx={ctx} />
    : page === 'contact' ? <Settings skey="contact" fields={CONTACT} ctx={ctx} />
    : page === 'general' ? <Settings skey="general" fields={GENERAL} ctx={ctx} />
    : page === 'texts' ? <TextsEditor ctx={ctx} />
    : <Media ctx={ctx} />
  return (
    <div className="ad-root ad-shell">
      <aside className={`ad-side${navOpen ? ' open' : ''}`}>
        <div className="ad-brand"><span className="ad-logo">✦</span> Admin</div>
        <nav>{NAV.map(([k, l, I]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => { setPage(k); setNavOpen(false) }}><I size={17} /> {l}</button>)}</nav>
        <div className="ad-foot"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Lihat website</a>
          <button onClick={() => supabase.auth.signOut()}><LogOut size={15} /> Logout</button></div>
      </aside>
      <main className="ad-main">
        <header className="ad-top"><button className="ad-burger" aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>☰</button><h2>{cur[1]}</h2></header>
        {body}
      </main>
      <Toasts items={toasts} />
    </div>
  )
}
