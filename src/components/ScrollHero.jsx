import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

// Cinematic, scroll-choreographed landing.
//   Act 1  the brand name resolves out of a blur.
//   Act 2  the brushed-gold cap detaches and FLIES along a curved Bezier path, spinning,
//          while three lines of the Svaya story cross-fade behind it.
//   Act 3  the cap descends and SEATS onto the neck of the serum bottle; the assembled
//          vessel then dissolves into the photoreal product, and the name + CTA rise.
// Cap, guide curve and bottle share ONE responsive SVG (viewBox 0 0 100 150) so the cap
// lands on the neck exactly at any size. Driven by a rAF scroll loop; respects
// prefers-reduced-motion. Flows straight into the next section - no gaps, no overlap.

const HERO_SLUG = 'saffron-radiance-serum'
const P = [[18, 30], [88, 16], [12, 70], [50, 73]] // cap path; P3 = seat above the neck
const bez = (t, i) => {
  const u = 1 - t
  return u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]
}
const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10) // smootherstep

// Piecewise linear interpolation across keyframe stops.
function track(p, xs, ys) {
  if (p <= xs[0]) return ys[0]
  for (let i = 1; i < xs.length; i++) {
    if (p <= xs[i]) {
      const t = (p - xs[i - 1]) / (xs[i] - xs[i - 1])
      return ys[i - 1] + (ys[i] - ys[i - 1]) * t
    }
  }
  return ys[ys.length - 1]
}
// A 0->1->0 "bell" so a story beat fades in, holds, then fades out.
const bell = (p, a, b, c, d) => track(p, [a, b, c, d], [0, 1, 1, 0])

const STORY = [
  { k: 'The name', t: 'Svāya means self — belonging to oneself.' },
  { k: 'The marriage', t: 'Korean fermentation, married to Ayurvedic ritual.' },
  { k: 'The promise', t: 'Radiance is earned, gently, day after day.' }
]

function HeroBottle({ glow }) {
  return (
    <g>
      <ellipse cx="50" cy="139" rx="15" ry="2.4" fill="#2C2A22" opacity="0.12" />
      <circle cx="50" cy="108" r="26" fill="#E0A126" opacity={glow} />
      <rect x="44.5" y="75" width="11" height="9" rx="2" fill="#F4EEE1" stroke="#E1D6BF" strokeWidth="0.4" />
      <rect x="38" y="82" width="24" height="54" rx="8" fill="url(#hg-glass)" stroke="#C7A05A" strokeWidth="0.5" />
      <clipPath id="hg-clip"><rect x="38.6" y="82.6" width="22.8" height="52.8" rx="7.4" /></clipPath>
      <g clipPath="url(#hg-clip)">
        <rect x="38" y="104" width="24" height="34" fill="url(#hg-liq)" />
        <ellipse cx="50" cy="104" rx="11" ry="1.6" fill="#fff" opacity="0.25" />
      </g>
      <rect x="40.5" y="100" width="19" height="21" rx="2" fill="#FBF7EE" stroke="#E1D6BF" strokeWidth="0.4" />
      <text x="50" y="109" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="5" fill="#2C2A22">Sv&#257;ya</text>
      <line x1="46" y1="112" x2="54" y2="112" stroke="#C9A86A" strokeWidth="0.4" />
      <text x="50" y="117.5" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="1.9" letterSpacing="0.2" fill="#6B6450">SAFFRON RADIANCE</text>
      <rect x="40" y="86" width="2.4" height="44" rx="1.2" fill="#fff" opacity="0.6" />
    </g>
  )
}

// Cap drawn symmetric about (0,0) so `rotate` after `translate` spins it in place.
function Cap() {
  return (
    <g>
      <rect x="-5" y="2.4" width="10" height="3.6" rx="1.2" fill="url(#hg-gold)" />
      <rect x="-4" y="-5.6" width="8" height="8.2" rx="2.6" fill="url(#hg-gold)" stroke="#A8842F" strokeWidth="0.3" />
      <rect x="-2.4" y="-8.6" width="4.8" height="3.6" rx="1.4" fill="#B8924E" />
      <rect x="-3.4" y="-4.6" width="1.5" height="6.4" rx="0.7" fill="#F4E3B4" opacity="0.85" />
    </g>
  )
}

function Finale({ opacity, y, active }) {
  const [photo, setPhoto] = useState(true)
  return (
    <div style={{ ...finaleWrap, opacity, transform: `translateY(${y}px)`, pointerEvents: active ? 'auto' : 'none' }}>
      {photo && (
        <img
          src={`/images/${HERO_SLUG}.jpg`}
          alt="Svaya Saffron Radiance Serum"
          onError={() => setPhoto(false)}
          style={finaleImg}
        />
      )}
      <h2 style={revealH}>Saffron Radiance Serum</h2>
      <p style={revealSub}>Kumkumadi saffron meets Korean niacinamide. A daily return to your most radiant self.</p>
      <Link to={`/product/${HERO_SLUG}`} className="btn">Explore the Ritual</Link>
    </div>
  )
}

export default function ScrollHero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduce) return
    let raf
    const tick = () => {
      const el = ref.current
      if (el) {
        const top = el.getBoundingClientRect().top
        const range = el.offsetHeight - window.innerHeight
        const next = clamp(range > 0 ? -top / range : 0)
        setP((prev) => (Math.abs(prev - next) > 0.0012 ? next : prev))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  // ---- Reduced motion: calm static hero with the real product ----
  if (reduce) {
    return (
      <section style={{ ...stage, height: 'auto', minHeight: '100vh', position: 'relative', paddingBlock: 48 }}>
        <div className="container center">
          <span className="eyebrow">An East-Meets-East Ritual</span>
          <h1 style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', margin: '8px 0 14px' }}>Sv&#257;ya</h1>
          <Finale opacity={1} y={0} active />
        </div>
      </section>
    )
  }

  // Derived values
  const t = smooth(clamp((p - 0.16) / 0.58))
  const capX = bez(t, 0).toFixed(2)
  const capY = bez(t, 1).toFixed(2)
  const capRot = ((1 - t) * 900).toFixed(1)

  const nameOpacity = track(p, [0, 0.08, 0.16], [1, 1, 0])
  const nameY = track(p, [0.06, 0.16], [0, -34])
  const tagOpacity = track(p, [0, 0.08, 0.15], [1, 1, 0])

  const guideOpacity = track(p, [0.16, 0.22, 0.66, 0.74], [0, 0.7, 0.7, 0])
  const bottleOpacity = track(p, [0.6, 0.72], [0, 1])
  const glow = track(p, [0.72, 0.82, 1], [0, 0.2, 0.12])

  const sceneOpacity = track(p, [0.82, 0.9], [1, 0]) // assembled vector dissolves out
  const finaleOpacity = track(p, [0.84, 0.93], [0, 1]) // photoreal product dissolves in
  const finaleY = track(p, [0.84, 0.96], [28, 0])
  const finaleActive = p > 0.9
  const hintOpacity = track(p, [0, 0.05], [1, 0])

  // Three story beats fade through while the cap flies.
  const beats = [bell(p, 0.17, 0.24, 0.31, 0.38), bell(p, 0.36, 0.43, 0.5, 0.57), bell(p, 0.55, 0.62, 0.69, 0.76)]

  return (
    <section ref={ref} style={{ height: '460vh', position: 'relative' }}>
      <div style={stage}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className="sv-mote" style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--sv-marigold)', filter: 'blur(1px)',
            left: `${12 + i * 14}%`, top: `${30 + (i % 3) * 18}%`,
            animationDelay: `${i * 1.1}s`, opacity: 0
          }} />
        ))}

        {/* Act 1 - brand name */}
        <div style={{ ...nameWrap, opacity: nameOpacity, transform: `translateY(${nameY}px)` }}>
          <h1 className="sv-hero-name" style={nameText}>Sv&#257;ya</h1>
          <p style={{ ...tagText, opacity: tagOpacity }}>Korean fermentation, Ayurvedic ritual</p>
        </div>

        {/* Act 2 - the story the cap flies through */}
        {STORY.map((s, i) => (
          <div key={i} style={{ ...storyWrap, opacity: beats[i] }}>
            <span className="eyebrow" style={{ color: 'var(--sv-saffron)' }}>{s.k}</span>
            <p style={storyLine}>{s.t}</p>
          </div>
        ))}

        {/* shared SVG scene: guide curve, bottle, flying cap */}
        <svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMid meet" style={{ ...sceneSvg, opacity: sceneOpacity }} aria-label="Svaya serum assembling">
          <Defs />
          <path d="M18,30 C88,16 12,70 50,73" fill="none" stroke="#C0822E" strokeWidth="0.5"
            strokeDasharray="0.4 2.4" strokeLinecap="round" opacity={guideOpacity} />
          <g opacity={bottleOpacity}><HeroBottle glow={glow} /></g>
          <g transform={`translate(${capX} ${capY}) rotate(${capRot})`}><Cap /></g>
        </svg>

        {/* Act 3 - photoreal reveal */}
        <Finale opacity={finaleOpacity} y={finaleY} active={finaleActive} />

        <div className="muted" style={{ ...hint, opacity: hintOpacity }}>Scroll</div>
      </div>
    </section>
  )
}

function Defs() {
  return (
    <defs>
      <linearGradient id="hg-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="16%" stopColor="#E9C98A" stopOpacity="0.5" />
        <stop offset="52%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C89A4E" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="hg-liq" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D7A23E" />
        <stop offset="100%" stopColor="#A86C1F" />
      </linearGradient>
      <linearGradient id="hg-gold" x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0%" stopColor="#9C7A2E" />
        <stop offset="24%" stopColor="#F0DCA6" />
        <stop offset="48%" stopColor="#C9A86A" />
        <stop offset="72%" stopColor="#EBD49A" />
        <stop offset="100%" stopColor="#9C7A2E" />
      </linearGradient>
    </defs>
  )
}

const stage = {
  position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden',
  background: 'radial-gradient(120% 80% at 50% 22%, #FBF7EE 0%, #F6F1E7 45%, #EFE7D6 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const nameWrap = { position: 'absolute', top: '30%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }
const nameText = { fontSize: 'clamp(3.4rem, 15vw, 11rem)', lineHeight: 1, margin: 0, color: 'var(--sv-ink)' }
const tagText = { marginTop: 18, fontFamily: 'var(--sv-font-body)', fontSize: '0.78rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--sv-saffron)' }
const storyWrap = { position: 'absolute', top: '30%', left: 0, right: 0, padding: '0 24px', textAlign: 'center', pointerEvents: 'none' }
const storyLine = { fontFamily: 'var(--sv-font-display)', fontSize: 'clamp(1.6rem, 5vw, 3.4rem)', lineHeight: 1.18, color: 'var(--sv-ink)', maxWidth: 760, margin: '14px auto 0' }
const sceneSvg = { position: 'absolute', inset: 0, width: '100%', height: '100%' }
const finaleWrap = { position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
const finaleImg = { width: 'clamp(200px, 30vw, 320px)', aspectRatio: '7 / 9', objectFit: 'contain', filter: 'drop-shadow(0 24px 40px rgba(44,42,34,0.16))' }
const revealH = { fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', margin: '18px 0 0' }
const revealSub = { maxWidth: 460, margin: '12px auto 22px', color: 'var(--sv-taupe)', fontSize: '1.02rem' }
const hint = { position: 'absolute', bottom: '3vh', left: 0, right: 0, textAlign: 'center', fontSize: '0.66rem', letterSpacing: '0.3em', textTransform: 'uppercase' }
