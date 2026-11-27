import { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react'
import { motion, MotionConfig, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Menu, X, ArrowDown, ArrowLeft, ArrowUpRight, Mail, Github, Linkedin, Instagram, Globe } from 'lucide-react'
import { copy, SECTIONS } from './i18n.js'
import JourneyMap from './JourneyMap.jsx'
import { hasSupabase } from './lib/supabase.js'
import { usePublicContent, mergeCopy, SEMESTERS, journeyFrom, projectsFrom, certsFrom, socialsFrom, generalFrom, tr } from './lib/content.js'

const UiCtx = createContext({ close: 'Close' })
const Tiktok = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.2v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.1 6.1 0 1 0 5.2 6V8.6a7.6 7.6 0 0 0 4.4 1.4V6.8A4.4 4.4 0 0 1 16.6 2z" /></svg>
const ICON = { mail: Mail, github: Github, linkedin: Linkedin, instagram: Instagram, tiktok: Tiktok, globe: Globe }

const rise = { hidden: { opacity: 0, y: 28 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] } }) }
const Reveal = ({ children, i = 0, className = '', as = 'div' }) => {
  const M = motion[as]
  return <M className={className} variants={rise} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>{children}</M>
}
// Ambil teks sesuai bahasa: string biasa, atau objek { en, id }. Kosong -> fallback.
const pick = (v, lang, fb) => (v == null || v === '' ? fb : typeof v === 'string' ? v : Array.isArray(v) ? v : v[lang] || v.en || fb)
const LinkBtn = ({ href, label, none, icon }) => href
  ? <a className="btn sm" href={href} target="_blank" rel="noreferrer">{label} {icon}</a>
  : <span className="btn sm off" title={none}>{label}</span>
const Head = ({ id, title, sub }) => <Reveal className="head"><h2 id={id}>{title}</h2>{sub && <p>{sub}</p>}</Reveal>
const Ph = ({ label, tone = 'butter', className = '' }) => <div className={`ph ${tone} ${className}`}><span>{label}</span></div>

// Rel bergerak ke samping (berhenti saat hover). Isi diduplikasi agar loop mulus.
const Marquee = ({ items, render, speed = 40, reverse = false, label, min = 0 }) => {
  const base = min && items.length ? Array.from({ length: Math.max(1, Math.ceil(min / items.length)) }, () => items).flat() : items
  return (
    <div className="mq" role="region" aria-label={label} tabIndex={0}>
      <div className={`mq-track${reverse ? ' rev' : ''}`} style={{ '--s': `${speed}s` }}>
        {[0, 1].map((n) => <div className="mq-set" key={n} aria-hidden={n ? 'true' : undefined}>{base.map((x, i) => render(x, `${n}-${i}`))}</div>)}
      </div>
    </div>
  )
}

const Modal = ({ onClose, label, children }) => {
  const ui = useContext(UiCtx)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <motion.div className="modal" role="dialog" aria-modal="true" aria-label={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-in" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()}>
        <button className="x" autoFocus aria-label={ui.close} onClick={onClose}><X size={18} /></button>
        {children}
      </motion.div>
    </motion.div>
  )
}

function useActive(ready, sections) {
  const [active, setActive] = useState('home')
  const lock = useRef(0)
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && Date.now() > lock.current && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((s) => { const el = document.getElementById(s); el && io.observe(el) })
    // bagian paling bawah (Kontak) pendek, jadi tandai aktif saat sudah mentok di dasar halaman
    const end = () => { if (Date.now() > lock.current && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) setActive(sections[sections.length - 1]) }
    window.addEventListener('scroll', end, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', end) }
  }, [ready, sections.join()])
  // saat menu diklik: langsung aktif, abaikan observer selama animasi scroll
  const pick = (id) => { lock.current = Date.now() + 900; setActive(id) }
  return [active, pick]
}

function Nav({ t, lang, setLang, active, onPick, sections }) {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // menu mobile: tutup saat klik di luar / tekan Escape / layar dibesarkan
  useEffect(() => {
    if (!open) return
    const out = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    const big = () => window.innerWidth > 1020 && setOpen(false)
    document.addEventListener('pointerdown', out); window.addEventListener('keydown', esc); window.addEventListener('resize', big)
    return () => { document.removeEventListener('pointerdown', out); window.removeEventListener('keydown', esc); window.removeEventListener('resize', big) }
  }, [open])
  return (
    <header className={`nav${stuck ? ' stuck' : ''}${open ? ' is-open' : ''}`} ref={ref}>
      <a className="logo" href="#home" aria-label={t.ui.home} onClick={() => { onPick('home'); setOpen(false) }}>✦</a>
      <nav id="main-nav" aria-label={t.ui.mainNav} className={open ? 'open' : ''}>
        <ul>
          {sections.map((s) => (
            <li key={s}>
              <a href={`#${s}`} onClick={() => { onPick(s); setOpen(false) }} aria-current={active === s ? 'true' : undefined}>
                <span>{t.nav[s]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-r">
        <div className="lang" role="group" aria-label={t.ui.language}>
          {['id', 'en'].map((l) => <button key={l} className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
        </div>
        <button className="burger" aria-expanded={open} aria-controls="main-nav" aria-label={t.menu} onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>
  )
}

function Hero({ t, socials, cv, photo }) {
  const h = t.hero
  const x = h
  const ribbon = Array(6).fill(h.tags).flat()
  return (
    <section id="home" className="hero" aria-label="Home">
      <div className="hero-in">
        <h1 className="title" aria-label={`${x.line1} ${x.name} ${x.script}`}>
          <motion.span className="t-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{x.line1}</motion.span>
          <span className="name" translate="no" aria-hidden="true">
            {x.name.split('').map((c, i) => (
              <motion.span key={i} className="ch" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 120, damping: 14 }} whileHover={{ y: -22, rotate: i % 2 ? 7 : -7, transition: { type: 'spring', stiffness: 300, damping: 12 } }}>{c === ' ' ? '\u00A0' : c}</motion.span>
            ))}
          </span>
          <motion.span className="script" translate="no" aria-hidden="true" initial={{ opacity: 0, x: -24, rotate: -2 }} animate={{ opacity: 1, x: 0, rotate: -6 }} transition={{ delay: 1, duration: 0.7 }}>{x.script}</motion.span>
        </h1>
        <motion.p className="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{h.role}</motion.p>
        <motion.p className="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>{h.intro}</motion.p>
        <motion.div className="cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <a className="btn solid" href="#projects">{h.cta1} <ArrowDown size={16} /></a>
          {cv && <a className="btn" href={cv} target="_blank" rel="noreferrer">{h.cta2} <ArrowUpRight size={16} /></a>}
        </motion.div>
      </div>
      <motion.div className="hero-pic" initial={{ y: '100%', rotate: -6, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 13 }}>
        <img src={photo} alt={t.ui.photoAlt} width="640" height="1192" draggable="false" />
        <motion.span className="hi" aria-hidden="true" initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: -6 }} transition={{ delay: 2.2, type: 'spring', stiffness: 260, damping: 12 }}>{h.hi}</motion.span>
      </motion.div>
      <ul className="hero-soc">{socials.filter((x) => x.icon !== 'globe').map((x) => { const I = ICON[x.icon]; return <li key={x.key}><a href={x.url} target="_blank" rel="noreferrer" aria-label={x.label}><I size={20} /></a></li> })}</ul>
      <div className="ribbon" aria-hidden="true">
        <Marquee items={ribbon} speed={30} render={(x, k) => <span key={k}>{x} <i>•</i></span>} />
      </div>
    </section>
  )
}

function About({ t }) {
  const a = t.about
  return (
    <section id="about" className="sec about" aria-labelledby="h-about">
      <Head id="h-about" title={a.title} />
      <div className="about-split">
        <Reveal className="lead"><p>{a.lead}</p></Reveal>
        <JourneyMap a={a} Modal={Modal} />
      </div>
    </section>
  )
}

function Projects({ t, lang, data, focus, current }) {
  const p = t.projects
  const { items, loading } = data
  const [sem, setSem] = useState(null)
  const [sel, setSel] = useState(null)
  const done = useRef(null)
  // default: semester yang sedang berjalan kalau sudah punya project, kalau tidak semester terbaru yang punya project
  const active = sem || (items.some((x) => x.semester === `Semester ${current}`) ? `Semester ${current}` : [...SEMESTERS].reverse().find((l) => items.some((x) => x.semester === l))) || SEMESTERS[0]
  const list = items.filter((x) => x.semester === active)
  // datang dari halaman semester (#projects-3 / #project-slug): pilih semester, buka detail, lalu scroll ke sini
  useEffect(() => {
    if (!focus || done.current === focus.k) return
    if (focus.uid) {
      const x = items.find((i) => i.uid === focus.uid)
      if (!x) return
      setSem(x.semester); setSel(x)
    } else if (focus.sem) { setSem(focus.sem); setSel(null) }
    done.current = focus.k
    setTimeout(() => document.getElementById('projects')?.scrollIntoView(), 60)
    history.replaceState(null, '', '#projects')
  }, [focus, items])
  const name = (x) => pick(x.title, lang, '') || `${p.phTitle} ${x.id + 1}`
  const Thumb = ({ x, className }) => x.image ? <img className={`pimg ${className || ''}`} src={x.image} alt={name(x)} loading="lazy" /> : <Ph label={pick(x.title, lang, '') || p.image} tone={x.tone} className={className} />
  const feats = sel && pick(sel.features, lang, null)
  return (
    <section id="projects" className="sec projects" aria-labelledby="h-projects">
      <Head id="h-projects" title={p.title} sub={p.sub} />
      <div className="semtabs" role="group" aria-label={p.semester}>
        {SEMESTERS.map((l, i) => <button key={l} type="button" className={`btn sm${active === l ? ' solid' : ''}`} aria-pressed={active === l} onClick={() => setSem(l)}>{p.semester} {i + 1}</button>)}
      </div>
      {!loading && !list.length && <p className="sem-empty">{p.empty}</p>}
      <div className="pgrid" key={active}>
        {list.map((x) => (
          <Reveal key={x.uid} i={x.id % 4} className="pcard">
            <button onClick={() => setSel(x)} aria-label={`${name(x)}: ${p.open}`}>
              <div className="thumb"><Thumb x={x} /></div>
              <p className="meta"><span>{pick(x.cat, lang, '') || p.cat}</span><span>{x.year}</span></p>
              <h3>{name(x)}</h3>
              <span className="more">{p.open} <ArrowUpRight size={14} /></span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <Modal label={name(sel)} onClose={() => setSel(null)}>
            <Thumb x={sel} className="big" />
            {sel.images?.length > 0 && <div className="pgal">{sel.images.map((u) => <img key={u} src={u} alt="" loading="lazy" />)}</div>}
            <p className="meta"><span>{pick(sel.cat, lang, '') || p.cat}</span><span>{sel.year}</span><span>{pick(sel.status, lang, p.statusV)}</span></p>
            <h3>{name(sel)}</h3>
            {pick(sel.desc, lang, '') && <p>{pick(sel.desc, lang, '')}</p>}
            <dl className="detail">
              {[['problem', p.problem], ['solution', p.solution]].map(([k, l]) => { const v = pick(sel[k], lang, ''); return v && <div key={k}><dt>{l}</dt><dd>{v}</dd></div> })}
              {Array.isArray(feats) && feats.length > 0 && <div><dt>{p.features}</dt><dd><ul>{feats.map((f) => <li key={f}>{f}</li>)}</ul></dd></div>}
              {pick(sel.learned, lang, '') && <div><dt>{p.learned}</dt><dd>{pick(sel.learned, lang, '')}</dd></div>}
              {sel.course && <div><dt>{p.course}</dt><dd>{sel.course}</dd></div>}
              {sel.tech.length > 0 && <div><dt>{p.tech}</dt><dd className="chips">{sel.tech.map((c) => <span key={c}>{c}</span>)}</dd></div>}
              {pick(sel.role, lang, '') && <div><dt>{p.role}</dt><dd>{pick(sel.role, lang, '')}</dd></div>}
            </dl>
            <div className="links"><LinkBtn href={sel.demo} label={p.demo} none={p.noLink} icon={<ArrowUpRight size={14} />} /><LinkBtn href={sel.github} label={p.github} none={p.noLink} icon={<Github size={14} />} /></div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  )
}

function Certs({ t, CERTS }) {
  const c = t.certs
  const [sel, setSel] = useState(null)
  if (!CERTS.length) return <section id="certs" className="sec certs" aria-labelledby="h-certs"><Head id="h-certs" title={c.title} sub={c.sub} /><p className="sem-empty">{c.empty}</p></section>
  const name = (x) => x.title || `${c.title1} ${x.id + 1}`
  const Img = ({ x, className }) => x.image ? <img className={`cimg ${className || ''}`} src={x.image} alt={name(x)} loading="lazy" /> : <Ph label={c.img} tone={x.tone} className={className} />
  return (
    <section id="certs" className="sec certs" aria-labelledby="h-certs">
      <Head id="h-certs" title={c.title} sub={c.sub} />
      {(() => {
        const card = (x, k) => (
          <figure className="cert" key={k}>
            <button className="doc" onClick={() => setSel(x)} aria-label={name(x)}><Img x={x} /></button>
            <figcaption><strong>{name(x)}</strong><span>{x.issuer || c.issuer}{x.year ? ` · ${x.year}` : ''}</span></figcaption>
          </figure>
        )
        if (CERTS.length <= 4) return <div className="cert-static">{CERTS.map((x) => card(x, x.id))}</div>
        return [CERTS.slice(0, Math.ceil(CERTS.length / 2)), CERTS.slice(Math.ceil(CERTS.length / 2))].map((row, ri) => (
          <Marquee key={ri} label={`${c.title} ${ri + 1}`} items={row} min={6} speed={45} reverse={ri === 1} render={card} />
        ))
      })()}
      <AnimatePresence>
        {sel && (
          <Modal label={name(sel)} onClose={() => setSel(null)}>
            <Img x={sel} className="big" />
            <h3>{name(sel)}</h3>
            <p>{sel.issuer || c.issuer} · {c.year}: {sel.year}</p>
            {sel.link ? <a className="btn sm" href={sel.link} target="_blank" rel="noreferrer">{c.cred}</a> : <span className="btn sm off">{c.cred}</span>}
          </Modal>
        )}
      </AnimatePresence>
    </section>
  )
}

function Publications({ t, lang, items }) {
  const [sel, setSel] = useState(null)
  const p = t.pubs
  const fmt = (d) => (d ? new Date(d).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short' }) : '')
  const meta = (x) => [tr(x, 'kind', lang), fmt(x.publication_date)].filter(Boolean)
  const paras = (x) => String(tr(x, 'description', lang) || '').split(/\n+/).filter(Boolean)
  return (
    <section id="publications" className="sec projects pubs" aria-labelledby="h-publications">
      <Head id="h-publications" title={p.title} sub={p.sub} />
      <div className="pgrid">
        {items.map((x, i) => (
          <Reveal key={x.id} i={i % 4} className="pcard pub">
            <button onClick={() => setSel(x)} aria-label={`${tr(x, 'title', lang)}: ${t.projects.open}`}>
              <p className="meta">{meta(x).map((m) => <span key={m}>{m}</span>)}</p>
              <h3>{tr(x, 'title', lang)}</h3>
              {paras(x)[0] && <p className="pdesc">{paras(x)[0]}</p>}
              <span className="more">{t.projects.open} <ArrowUpRight size={14} /></span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <Modal label={tr(sel, 'title', lang)} onClose={() => setSel(null)}>
            <p className="meta">{meta(sel).map((m) => <span key={m}>{m}</span>)}</p>
            <h3>{tr(sel, 'title', lang)}</h3>
            {paras(sel).map((x, i) => <p key={i}>{x}</p>)}
            {(sel.external_url || sel.file_url) && (
              <div className="links">
                {sel.external_url && <a className="btn sm" href={sel.external_url} target="_blank" rel="noreferrer">{p.link} <ArrowUpRight size={14} /></a>}
                {sel.file_url && <a className="btn sm" href={sel.file_url} target="_blank" rel="noreferrer">{p.pdf} <ArrowUpRight size={14} /></a>}
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </section>
  )
}

function Contact({ t, socials, email }) {
  const c = t.contact
  return (
    <>
      <section id="contact" className="sec contact" aria-labelledby="h-contact">
        <Reveal><h2 id="h-contact" className="big">{c.title}</h2><p className="sub">{c.sub}</p></Reveal>
        <Reveal i={1}>
          <ul className="soc">{socials.map((x) => { const I = ICON[x.icon]; return <li key={x.key}><a href={x.url} target="_blank" rel="noreferrer"><I size={18} /> {x.label}</a></li> })}</ul>
          {email && <a className="btn solid lg" href={email}>{c.btn} <ArrowUpRight size={18} /></a>}
        </Reveal>
      </section>
      <footer className="foot"><span>{c.copyright}</span><span>{c.footer}</span><a href="#home">{c.top} ↑</a></footer>
    </>
  )
}


// ───────── Learning Journey: timeline semester + halaman detail ─────────
function LearningJourney({ t, lang, items, projects }) {
  const j = t.journey
  const count = (n) => projects.filter((x) => x.semester === `Semester ${n}`).length
  return (
    <section id="journey" className="sec lj" aria-labelledby="h-journey">
      <Head id="h-journey" title={j.title} sub={j.sub} />
      <div className="lj-tl">
        {items.map((r, i) => (
          <Reveal key={r.semester} i={i % 3} className={`lj-sem ${r.progress}`}>
            <span className="lj-dot" aria-hidden="true" />
            <div className="lj-top"><h3>{j.semester} {r.semester}</h3><span className="lj-pill">{j.status[r.progress]}</span></div>
            {tr(r, 'tagline', lang) && <p className="lj-tag">{tr(r, 'tagline', lang)}</p>}
            {tr(r, 'intro', lang) && <p className="lj-desc">{tr(r, 'intro', lang)}</p>}
            <div className="lj-links">
              {r.progress !== 'upcoming' && <a className="more" href={`#semester-${r.semester}`}>{j.details} <ArrowUpRight size={14} /></a>}
              {count(r.semester) > 0 && <a className="more" href={`#projects-${r.semester}`}>{j.seeProjects} ({count(r.semester)}) <ArrowUpRight size={14} /></a>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const Block = ({ title, note, children }) => <Reveal className="lj-block"><h3>{title}</h3>{note && <p className="lj-note">{note}</p>}{children}</Reveal>

function SemesterPage({ t, lang, row, projects }) {
  const j = t.journey, S = j.sections
  const [area, setArea] = useState(null)
  const soon = <p className="lj-soon">{j.soon}</p>
  const T = (o, k) => tr(o, k, lang)
  const tech = [['learning', row.tech_learning], ['explored', row.tech_explored], ['used', row.tech_used]].filter(([, a]) => a.length)
  return (
    <section id="semester" className="sec lj lj-page" aria-labelledby="h-semester">
      <Reveal className="head">
        <a className="more back" href="#journey"><ArrowLeft size={14} /> {j.back}</a>
        <h2 id="h-semester">{j.semester} {row.semester}{T(row, 'tagline') ? `: ${T(row, 'tagline')}` : ''}</h2>
        {(T(row, 'headline') || T(row, 'lead')) && <p className="lj-lead">{T(row, 'headline') && <b>{T(row, 'headline')}</b>}{T(row, 'headline') && T(row, 'lead') ? ' — ' : ''}{T(row, 'lead')}</p>}
        <span className="lj-pill">{j.status[row.progress]}</span>
      </Reveal>
      {T(row, 'intro') && <Reveal className="lj-intro"><p>{T(row, 'intro')}</p></Reveal>}
      <div className="lj-stack">
        <Block title={S.learned} note={row.areas.length > 0 && j.note}>
          {row.areas.length ? <div className="lj-areas">{row.areas.map((a) => (
            <div key={a.name} className="lj-area"><h4>{T(a, 'name')}</h4>{T(a, 'courses').length > 0 && <ul>{T(a, 'courses').map((c) => <li key={c}>{c}</li>)}</ul>}{T(a, 'description') && <p>{T(a, 'description')}</p>}</div>
          ))}</div> : soon}
        </Block>
        <Block title={S.showcase}>
          {row.areas.length ? <div className="lj-show">{row.areas.map((a) => <button key={a.name} type="button" className="lj-tile" onClick={() => setArea(a)}><span>{T(a, 'name')}</span><small>{j.open} <ArrowUpRight size={13} /></small></button>)}</div> : soon}
        </Block>
        <Block title={S.made}>
          {projects.length ? <ul className="lj-made">{projects.map((x) => <li key={x.uid}><a href={`#project-${x.uid}`}><b>{pick(x.title, lang, '')}</b>{pick(x.cat, lang, '') && <small> — {pick(x.cat, lang, '')}</small>}<ArrowUpRight size={13} /></a></li>)}</ul> : soon}
          {projects.length > 0 && <a className="more" href={`#projects-${row.semester}`}>{j.seeProjects} <ArrowUpRight size={14} /></a>}
        </Block>
        <Block title={S.tech}>
          {tech.length ? tech.map(([k, a]) => <div key={k} className="lj-tech"><h4>{j.techStatus[k]}</h4><div className="chips">{a.map((x) => <span key={x}>{x}</span>)}</div></div>) : soon}
        </Block>
        <Block title={S.reflection}>{T(row, 'reflection') ? <p className="refl">{T(row, 'reflection')}</p> : soon}</Block>
      </div>
      <AnimatePresence>
        {area && (
          <Modal label={T(area, 'name')} onClose={() => setArea(null)}>
            <h3>{T(area, 'name')}</h3>
            {T(area, 'courses').length > 0 && <div className="chips">{T(area, 'courses').map((c) => <span key={c}>{c}</span>)}</div>}
            {T(area, 'description') && <p>{T(area, 'description')}</p>}
            {T(area, 'notes').length ? T(area, 'notes').map((n, i) => <p key={i}>{n}</p>) : <p className="lj-soon">{j.notesSoon}</p>}
            {area.images.length > 0 && <div className="pgal">{area.images.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" loading="lazy" /></a>)}</div>}
          </Modal>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const db = usePublicContent()
  const t = useMemo(() => mergeCopy(copy[lang], db, lang), [lang, db])
  const projects = useMemo(() => projectsFrom(db), [db])
  const certs = useMemo(() => certsFrom(db), [db])
  const { items: socials, email } = useMemo(() => socialsFrom(db), [db])
  const gen = useMemo(() => generalFrom(db, lang), [db, lang])
  const pubs = db?.pubs || []
  const journey = useMemo(() => journeyFrom(db), [db])
  // hash: #semester-3 (halaman semester) | #projects-3 (tab Karya Saya semester 3) | #project-slug (buka detail project)
  const parse = () => {
    const h = globalThis.location?.hash || ''
    let m = h.match(/^#semester-([1-8])$/); if (m) return { sem: +m[1] }
    m = h.match(/^#projects-([1-8])$/); if (m) return { focus: { sem: `Semester ${m[1]}` } }
    m = h.match(/^#project-([\w-]+)$/); if (m) return { focus: { uid: m[1] } }
    return {}
  }
  const [semView, setSemView] = useState(() => parse().sem || null)
  const [focus, setFocus] = useState(() => { const f = parse().focus; return f ? { ...f, k: 0 } : null })
  useEffect(() => {
    const on = () => {
      const v = parse()
      setSemView(v.sem || null)
      if (v.sem) window.scrollTo({ top: 0, behavior: 'instant' })
      else if (v.focus) setFocus({ ...v.focus, k: Date.now() })
      else setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView(), 60)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const current = (journey.find((r) => r.progress === 'current') || {}).semester || 1
  const sections = useMemo(() => SECTIONS.filter((x) => x !== 'publications' || pubs.length > 0), [pubs.length])
  const [active, pickActive] = useActive(!semView && !(hasSupabase && db === null), sections)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 })
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  // Full-page scroll snap hanya di halaman utama (bukan halaman detail semester)
  useEffect(() => { const el = document.documentElement; el.classList.toggle('snap', !semView); return () => el.classList.remove('snap') }, [semView])
  // Klik link #anchor (menu, tombol hero, "kembali ke atas"): matikan snap sebentar supaya scroll tidak tertahan di tengah jalan
  useEffect(() => {
    const el = document.documentElement; let t
    const hold = (e) => { if (!e.target.closest?.('a[href^="#"]')) return; el.classList.add('nosnap'); clearTimeout(t); t = setTimeout(() => el.classList.remove('nosnap'), 1200) }
    document.addEventListener('click', hold, true)
    return () => { document.removeEventListener('click', hold, true); clearTimeout(t); el.classList.remove('nosnap') }
  }, [])
  useEffect(() => {
    document.title = gen.title
    let m = document.querySelector('meta[name="description"]')
    if (gen.desc) { if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) } m.content = gen.desc }
    if (gen.favicon) { let l = document.querySelector('link[rel="icon"]'); if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l) } l.href = gen.favicon }
  }, [gen])
  // tunggu data dari database supaya teks tidak "berkedip" dari bawaan ke hasil editan
  if (hasSupabase && db === null) return null
  return (
    <UiCtx.Provider value={t.ui}><MotionConfig reducedMotion="user">
      <a className="skip" href="#main">{t.skip}</a>
      <motion.div className="progress" style={{ scaleX: bar }} aria-hidden="true" />
      <Nav t={t} lang={lang} setLang={setLang} active={semView ? 'journey' : active} onPick={pickActive} sections={sections} />
      <main id="main">{semView
        ? <SemesterPage t={t} lang={lang} row={journey.find((r) => r.semester === semView) || { semester: semView, progress: 'upcoming', tagline: '', headline: '', lead: '', intro: '', areas: [], tech_learning: [], tech_explored: [], tech_used: [], reflection: '' }} projects={projects.items.filter((x) => x.semester === `Semester ${semView}`)} />
        : <><Hero t={t} socials={socials} cv={gen.cv} photo={gen.photo} />
        <About t={t} />
        <LearningJourney t={t} lang={lang} items={journey} projects={projects.items} />
        <Projects t={t} lang={lang} data={projects} focus={focus} current={current} />
        {pubs.length > 0 && <Publications t={t} lang={lang} items={pubs} />}
        <Certs t={t} CERTS={certs} />
        <Contact t={t} socials={socials} email={email} /></>}</main>
    </MotionConfig></UiCtx.Provider>
  )
}
