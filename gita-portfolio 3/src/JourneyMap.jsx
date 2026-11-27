import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Peta kecil: satu layout untuk semua ukuran layar.
const L = {
  w: 560, h: 400,
  d: 'M80 310 C 120 310, 150 120, 200 120 C 262 120, 300 290, 360 290 C 415 290, 425 90, 470 90',
  nodes: [[80, 310], [200, 120], [360, 290], [470, 90]],
  labels: ['below', 'above', 'below', 'below'],
}
const K = '#6F2D43', PK = '#E58BA8', LT = '#EBD5D8', CR = '#F8F4EF'
// Empat ilustrasi satu gaya: garis wine, isi pink/krem
const ILLUS = [
  <>
    <path d="M24 9L44 19L24 29L4 19Z" fill={PK} />
    <path d="M12 25V34Q24 41 36 34V25L24 30Z" fill={LT} />
    <path d="M41 20.5V33" /><circle cx="41" cy="35" r="2.4" fill={K} />
  </>,
  <>
    <circle cx="24" cy="24" r="18" fill={CR} />
    <circle cx="24" cy="24" r="12.5" fill="none" strokeDasharray="1 4" />
    <path d="M24 9L29.5 24H18.5Z" fill={PK} /><path d="M24 39L18.5 24H29.5Z" fill={LT} />
    <circle cx="24" cy="24" r="2" fill={K} />
  </>,
  <>
    <rect x="6" y="31" width="36" height="9" rx="2" fill={PK} />
    <rect x="9" y="21" width="31" height="9" rx="2" fill={LT} />
    <rect x="7" y="11" width="34" height="9" rx="2" fill={CR} />
    <path d="M12 35.5H20M14 25.5H22M13 15.5H21" />
  </>,
  <>
    <ellipse cx="24" cy="42" rx="15" ry="3.5" fill={LT} />
    <path d="M16 6V42" /><path d="M16 7L39 13.5L16 21Z" fill={PK} />
  </>,
]
const G = ({ i, x, y, s }) => <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={2.2 / s}>{ILLUS[i]}</g>
const Sp = ({ x, y }) => <path d="M0 -7L2 -2L7 0L2 2L0 7L-2 2L-7 0L-2 -2Z" transform={`translate(${x} ${y})`} fill={CR} />
// Ilustrasi pop-up tiap checkpoint (satu gaya: garis wine, isi pink/krem)
const SCENES = [
  <>
    <G i={0} x={81} y={12} s={1.6} /><G i={2} x={8} y={48} s={1} />
    <path d="M184 88L206 44L214 48L192 92Z" fill={PK} /><path d="M184 88L186 98L192 92Z" fill={CR} /><path d="M206 44L210 36L218 40L214 48Z" fill={LT} />
    <Sp x={40} y={26} /><Sp x={200} y={22} /><Sp x={150} y={14} />
  </>,
  <>
    <G i={1} x={84} y={14} s={1.5} />
    <path d="M8 100L30 62L52 100Z" fill={LT} /><path d="M34 100L56 76L78 100Z" fill={PK} />
    <path d="M200 76C180 62 178 46 190 44C196 43 200 48 200 48C200 48 204 43 210 44C222 46 220 62 200 76Z" fill={PK} />
    <Sp x={170} y={20} /><Sp x={30} y={30} /><Sp x={224} y={30} />
  </>,
  <>
    <G i={2} x={4} y={44} s={1} />
    <rect x="76" y="24" width="90" height="56" rx="5" fill={CR} /><rect x="83" y="31" width="76" height="42" rx="2" fill={LT} />
    <path d="M108 44L98 52L108 60M134 44L144 52L134 60M124 40L118 64" fill="none" />
    <path d="M62 84H180L174 94H68Z" fill={PK} />
    <path d="M192 62H216V82Q216 90 208 90H200Q192 90 192 82Z" fill={CR} /><path d="M216 68H222Q227 68 227 74Q227 80 216 80" fill="none" /><path d="M200 56Q198 50 202 46M208 56Q206 50 210 46" fill="none" />
    <Sp x={52} y={22} /><Sp x={176} y={20} />
  </>,
  <>
    <path d="M34 40H70V62Q70 78 52 80Q34 78 34 62Z" fill={PK} /><path d="M34 46H26Q24 62 36 64M70 46H78Q80 62 68 64" fill="none" />
    <path d="M52 80V92" /><path d="M40 92H64V100H40Z" fill={LT} />
    <G i={3} x={81.6} y={32} s={1.6} />
    <path d="M190 34L196 50L214 52L200 63L205 80L190 70L175 80L180 63L166 52L184 50Z" fill={CR} />
    <Sp x={130} y={14} /><Sp x={228} y={92} />
  </>,
]
const Scene = ({ i }) => <svg className="jm-scene" viewBox="0 0 240 120" stroke={K} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><ellipse cx="120" cy="108" rx="98" ry="7" fill={CR} stroke="none" />{SCENES[i]}</svg>
const ICONS = ['🎓', '💡', '📚', '🎯']

// Dekorasi kotak peta (posisi dalam %)
const DECOR = [['🌲', 30, 70, 0.8], ['🌳', 52, 84, 0.75], ['🌷', 12, 22, 0.7], ['⛰️', 62, 18, 0.95], ['🌲', 88, 62, 0.75], ['🌳', 36, 34, 0.7]]

const TONES = ['pink', 'butter', 'mint', 'lav']

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function JourneyMap({ a, Modal }) {
  const wrap = useRef(null)
  const pathRef = useRef(null)
  const walkedRef = useRef(null)
  const charRef = useRef(null)

  const len = useMotionValue(0)
  const frac = useRef(0)
  const token = useRef(0)

  const [total, setTotal] = useState(0)
  const [lens, setLens] = useState([0, 0, 0, 0])
  const [reached, setReached] = useState(0)
  const [walking, setWalking] = useState(false)
  const [open, setOpen] = useState(null)
  const [seen, setSeen] = useState([])

  // Ukur panjang jalur & posisi tiap checkpoint
  useEffect(() => {
    const p = pathRef.current
    if (!p) return
    const T = p.getTotalLength()
    const ls = L.nodes.map(([nx, ny]) => {
      let best = 0, bd = Infinity
      for (let i = 0; i <= 800; i++) {
        const pt = p.getPointAtLength((T * i) / 800)
        const dd = (pt.x - nx) ** 2 + (pt.y - ny) ** 2
        if (dd < bd) { bd = dd; best = (T * i) / 800 }
      }
      return best
    })
    setTotal(T)
    setLens(ls)
    len.set(frac.current * T)
  }, []) // eslint-disable-line

  // Gerakkan karakter + gambar garis perjalanan mengikuti nilai len
  const apply = useCallback((v) => {
    const p = pathRef.current
    if (!p || !total) return
    const pt = p.getPointAtLength(Math.max(0, Math.min(total, v)))
    const c = charRef.current
    if (c) { c.style.left = `${(pt.x / L.w) * 100}%`; c.style.top = `${(pt.y / L.h) * 100}%` }
    if (walkedRef.current) walkedRef.current.style.strokeDashoffset = String(total - v)
    frac.current = v / total
    setReached(lens.filter((l) => l <= v + 2).length)
  }, [total, lens])

  useEffect(() => {
    apply(len.get())
    return len.on('change', apply)
  }, [apply, len])

  const goTo = async (i) => {
    const my = ++token.current
    const dist = Math.abs(len.get() - lens[i])
    if (dist > 2 && !reduced()) {
      setWalking(true)
      await animate(len, lens[i], { duration: Math.min(1.6, 0.5 + dist / 700), ease: 'easeInOut' }).finished
      if (token.current !== my) return
    } else len.set(lens[i])
    setWalking(false)
    setSeen((s) => (s.includes(i) ? s : [...s, i]))
    setOpen(i)
  }

  const close = () => setOpen(null)
  const step = open != null ? a.steps[open] : null

  return (
    <div className="jm" ref={wrap}>
      <motion.div
        className="jm-stage"
        initial={{ opacity: 0, scale: 1.14, x: '3%' }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
        style={{ aspectRatio: `${L.w} / ${L.h}` }}
      >
        <div className="jm-land" aria-hidden="true" />
        {['☁️', '☁️', '☁️'].map((c, i) => <span key={i} className={`jm-cloud c${i}`} aria-hidden="true">{c}</span>)}
        {DECOR.map(([e, x, y, s], i) => (
          <motion.span key={i} className="jm-deco" aria-hidden="true" style={{ left: `${x}%`, top: `${y}%`, fontSize: `${s}rem` }}
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 0.9, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 160, damping: 12 }}>{e}</motion.span>
        ))}

        <svg className="jm-svg" viewBox={`0 0 ${L.w} ${L.h}`} preserveAspectRatio="none" aria-hidden="true">
          <path className="jm-trail" d={L.d} />
          <path ref={pathRef} className="jm-guide" d={L.d} />
          <path ref={walkedRef} className="jm-walked" d={L.d} strokeDasharray={total || 1} strokeDashoffset={total || 1} />
        </svg>

        <ol className="jm-nodes">
          {L.nodes.map(([nx, ny], i) => {
            const reachedNow = reached > i
            return (
              <li key={i} style={{ left: `${(nx / L.w) * 100}%`, top: `${(ny / L.h) * 100}%` }}>
                <motion.button
                  type="button"
                  className={`jm-node${reachedNow ? ' on' : ''}${reachedNow && !seen.includes(i) ? ' new' : ''}${i === 3 ? ' goal' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}. ${a.steps[i].tag} — ${a.steps[i].title}. ${a.openLabel}`}
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.25, type: 'spring', stiffness: 220, damping: 13 }}
                  whileHover={{ scale: 1.22, rotate: [0, -8, 8, 0], transition: { duration: 0.45 } }}
                  whileTap={{ scale: 0.88 }}
                >
                  <span className="jm-ring" aria-hidden="true" />
                  <span className="jm-num" aria-hidden="true">{i + 1}</span>
                  <span className="jm-ico" aria-hidden="true">{ICONS[i]}</span>
                </motion.button>
                <motion.div
                  className={`jm-lbl ${L.labels[i]}${reachedNow ? ' on' : ''}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: reachedNow ? 1 : 0.55, y: 0 }} transition={{ duration: 0.4 }}
                >
                  <small>{a.steps[i].tag}</small>
                  <strong>{a.steps[i].title}</strong>
                </motion.div>
              </li>
            )
          })}
        </ol>

        <div ref={charRef} className={`jm-char${walking ? ' walk' : ''}`} aria-hidden="true">
          <span className="jm-sh" />
          <svg viewBox="0 0 84 46" stroke="#6F2D43" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M4 34V26Q4 21 9 20L18 18L26 8Q28 5 32 5H52Q56 5 59 8L66 18L75 20Q80 21 80 26V34Q80 36 78 36H6Q4 36 4 34Z" fill="#E58BA8" />
            <path d="M31 9H40V17H25Z" fill="#F8F4EF" /><path d="M44 9H52L58 17H44Z" fill="#F8F4EF" />
            <circle cx="75" cy="26" r="2.4" fill="#F8F4EF" /><path d="M8 25H11" />
            <g className="wh"><circle cx="22" cy="37" r="7" fill="#4A2A35" /><circle cx="22" cy="37" r="2.6" fill="#F8F4EF" stroke="none" /><path d="M22 32.5V41.5M17.5 37H26.5" stroke="#F8F4EF" strokeWidth="1.4" /></g>
            <g className="wh"><circle cx="62" cy="37" r="7" fill="#4A2A35" /><circle cx="62" cy="37" r="2.6" fill="#F8F4EF" stroke="none" /><path d="M62 32.5V41.5M57.5 37H66.5" stroke="#F8F4EF" strokeWidth="1.4" /></g>
          </svg>
        </div>

      </motion.div>
      <p className="jm-hint">{a.hint}</p>

      <AnimatePresence>
        {step && (
          <Modal label={`${step.tag} — ${step.title}`} onClose={close}>
            <div className="jm-pop">
              <div className={`jm-banner ${TONES[open]}`} aria-hidden="true">
                <Scene i={open} />
              </div>
              {step.images?.length > 0 && <div className="pgal">{step.images.map((u) => <img key={u} src={u} alt="" loading="lazy" />)}</div>}
              <p className="jm-step"><span>{String(open + 1).padStart(2, '0')}</span> {step.tag}</p>
              <h3>{step.title}</h3>
              <p className="jm-short">{step.short}</p>
              {step.story.map((s, i) => <p key={i}>{s}</p>)}
              <ul className="chips jm-chips">{step.chips.map((c) => <li key={c}>{c}</li>)}</ul>
              <div className="jm-nav">
                <button type="button" className="btn sm" disabled={open === 0} onClick={() => { close(); setTimeout(() => goTo(open - 1), 250) }}><ArrowLeft size={14} /> {a.prev}</button>
                {open < 3
                  ? <button type="button" className="btn sm solid" onClick={() => { close(); setTimeout(() => goTo(open + 1), 250) }}>{a.next} <ArrowRight size={14} /></button>
                  : <a className="btn sm solid" href="#contact" onClick={close}>{a.finish} <ArrowRight size={14} /></a>}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
