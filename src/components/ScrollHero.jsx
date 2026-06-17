import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { getProduct } from '../data/products.js'

// Cinematic, scroll-choreographed landing — driven IMPERATIVELY for smoothness.
//   Act 1  the brand name resolves out of a blur inside a marigold spotlight.
//   Act 2  the brushed-gold cap FLIES a curved Bezier path, spinning, while three lines
//          of the Svaya story cross-fade and faint ingredient tags drift past it.
//   Act 3  the cap SEATS onto the bottle neck; the assembled vessel dissolves into the
//          photoreal product and the name + CTA rise.
//
// Why imperative: a rAF loop that calls setState every frame forces a full React
// re-render per frame -> jank. Instead we read scroll once per frame, EASE the progress
// toward its target (lerp = inertia/smoothness), then write transforms/opacity straight
// to element refs. Zero React renders during scroll. The cap rides the SVG `transform`
// ATTRIBUTE (the reliable path for an SVG <g>). Respects prefers-reduced-motion.

const HERO_SLUG = 'saffron-radiance-serum'
const P = [[18, 30], [88, 16], [12, 70], [50, 73]] // cap path; P3 = seat above the neck
const bez = (t, i) => {
  const u = 1 - t
  return u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]
}
const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10) // smootherstep
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
const bell = (p, a, b, c, d) => track(p, [a, b, c, d], [0, 1, 1, 0])

const STORY = [
  { k: 'The name', t: 'Svāya means self — belonging to oneself.' },
  { k: 'The marriage', t: 'Korean fermentation, married to Ayurvedic ritual.' },
  { k: 'The promise', t: 'Radiance is earned, gently, day after day.' }
]
// Drifting ingredient tags fill the empty space during the cap's flight.
const TAGS = [
  { t: 'Kumkumadi saffron', x: '14%', y: '32%', a: 0.15, b: 0.40 },
  { t: 'Korean niacinamide', x: '70%', y: '26%', a: 0.20, b: 0.46 },
  { t: 'Fermented ginseng', x: '22%', y: '64%', a: 0.28, b: 0.52 },
  { t: 'Centella · cica', x: '74%', y: '60%', a: 0.34, b: 0.56 },
  { t: 'Bakuchiol', x: '46%', y: '19%', a: 0.40, b: 0.60 }
]

function HeroBottle({ glowRef }) {
  return (
    <g>
      <ellipse cx="50" cy="139" rx="15" ry="2.4" fill="#2C2A22" opacity="0.12" />
      <circle ref={glowRef} cx="50" cy="108" r="26" fill="#E0A126" opacity="0" />
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

function FinaleContent() {
  const [photo, setPhoto] = useState(true)
  return (
    <>
      {photo ? (
        <img
          src={`/images/${HERO_SLUG}.jpg`}
          alt="Svaya Saffron Radiance Serum"
          onError={() => setPhoto(false)}
          style={finaleImg}
        />
      ) : (
        <div style={{ ...finaleImg, display: 'grid', placeItems: 'center', color: 'var(--sv-dim)' }}>Svāya</div>
      )}
      <h2 style={revealH}>Saffron Radiance Serum</h2>
      <p style={revealSub}>Kumkumadi saffron meets Korean niacinamide. A daily return to your most radiant self.</p>
      <Link to={`/product/${HERO_SLUG}`} className="btn">Explore the Ritual</Link>
    </>
  )
}

export default function ScrollHero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const capRef = useRef(null)
  const bottleRef = useRef(null)
  const sceneRef = useRef(null)
  const guideRef = useRef(null)
  const glowRef = useRef(null)
  const nameRef = useRef(null)
  const tagRef = useRef(null)
  const spotRef = useRef(null)
  const ringsRef = useRef(null)
  const storyRefs = useRef([])
  const tagRefs = useRef([])
  const finaleRef = useRef(null)
  const railDotRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    let raf
    let cur = 0
    const set = (el, prop, val) => { if (el) el.style[prop] = val }

    const apply = (p) => {
      // Choreography is front-loaded so the finished product HOLDS on screen for the
      // final ~22% of scroll (0.78 -> 1.0) instead of flashing past at the unpin point.
      const t = smooth(clamp((p - 0.12) / 0.46)) // cap flight 0.12 -> 0.58
      const capX = bez(t, 0)
      const capY = bez(t, 1)
      const capRot = (1 - t) * 900
      capRef.current?.setAttribute('transform', `translate(${capX.toFixed(2)} ${capY.toFixed(2)}) rotate(${capRot.toFixed(1)})`)

      set(sceneRef.current, 'opacity', track(p, [0.64, 0.72], [1, 0]))
      set(bottleRef.current, 'opacity', track(p, [0.46, 0.57], [0, 1]))
      set(guideRef.current, 'opacity', track(p, [0.12, 0.18, 0.5, 0.58], [0, 0.7, 0.7, 0]))
      glowRef.current?.setAttribute('opacity', track(p, [0.57, 0.66, 1], [0, 0.2, 0.12]).toFixed(3))

      // Act 1 name + spotlight
      set(nameRef.current, 'opacity', track(p, [0, 0.06, 0.12], [1, 1, 0]))
      set(nameRef.current, 'transform', `translateY(${track(p, [0.05, 0.12], [0, -34]).toFixed(1)}px)`)
      set(tagRef.current, 'opacity', track(p, [0, 0.06, 0.11], [1, 1, 0]))
      set(spotRef.current, 'opacity', track(p, [0, 0.18, 0.26], [0.9, 0.9, 0.16]))
      set(spotRef.current, 'transform', `scale(${track(p, [0, 0.24], [0.92, 1.25]).toFixed(3)})`)
      // ripple rings expand then fade as the story begins
      set(ringsRef.current, 'opacity', track(p, [0, 0.1, 0.26], [0.5, 0.5, 0]))
      set(ringsRef.current, 'transform', `scale(${track(p, [0, 0.26], [0.85, 1.5]).toFixed(3)})`)

      // story beats (within the flight window)
      storyRefs.current.forEach((el, i) => {
        const o = [bell(p, 0.13, 0.18, 0.24, 0.3), bell(p, 0.28, 0.34, 0.4, 0.46), bell(p, 0.43, 0.49, 0.54, 0.59)][i]
        set(el, 'opacity', o)
        set(el, 'transform', `translateY(${((1 - o) * 14).toFixed(1)}px)`)
      })
      // drifting ingredient tags
      tagRefs.current.forEach((el, i) => {
        const cfg = TAGS[i]
        set(el, 'opacity', bell(p, cfg.a, cfg.a + 0.05, cfg.b - 0.05, cfg.b) * 0.9)
      })

      // finale settles by ~0.78, then holds. NB: keep the -50% vertical centering in the
      // transform we set here, or the column drops half a screen and the CTA falls below fold.
      set(finaleRef.current, 'opacity', track(p, [0.66, 0.76], [0, 1]))
      const fRise = track(p, [0.66, 0.78], [30, 0])
      const fScale = track(p, [0.66, 0.78], [0.965, 1])
      set(finaleRef.current, 'transform', `translateY(calc(-50% + ${fRise.toFixed(1)}px)) scale(${fScale.toFixed(3)})`)
      set(finaleRef.current, 'pointerEvents', p > 0.74 ? 'auto' : 'none')

      set(hintRef.current, 'opacity', track(p, [0, 0.04], [1, 0]))
      if (railDotRef.current) railDotRef.current.style.transform = `translateY(${(p * 100).toFixed(2)}px)`
    }

    const tick = () => {
      const el = sectionRef.current
      if (el) {
        const top = el.getBoundingClientRect().top
        const range = el.offsetHeight - window.innerHeight
        const target = clamp(range > 0 ? -top / range : 0)
        cur += (target - cur) * 0.1 // ease toward target (inertia = smoothness)
        if (Math.abs(target - cur) < 0.0002) cur = target
        apply(cur)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  // ---- Reduced motion: calm static hero with the real product ----
  if (reduce) {
    return (
      <section style={{ ...stage, height: 'auto', minHeight: '100vh', position: 'relative', paddingBlock: 56 }}>
        <div className="container center">
          <span className="eyebrow">An East-Meets-East Ritual</span>
          <h1 style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', margin: '8px 0 18px' }}>Sv&#257;ya</h1>
          <div style={{ ...finaleWrap, position: 'static', transform: 'none', opacity: 1 }}><FinaleContent /></div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} style={{ height: '420vh', position: 'relative' }}>
      <div style={stage}>
        {/* spotlight + ripple rings + motes (ambient fillers) */}
        <div ref={spotRef} style={spotlight} />
        <div ref={ringsRef} style={rings} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ ...ring, width: 260 + i * 150, height: 260 + i * 150, opacity: 0.5 - i * 0.14 }} />
          ))}
        </div>
        {[...Array(7)].map((_, i) => (
          <span key={i} className="sv-mote" style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--sv-marigold)', filter: 'blur(1px)',
            left: `${10 + i * 12}%`, top: `${26 + (i % 4) * 16}%`,
            animationDelay: `${i * 0.9}s`, opacity: 0
          }} />
        ))}

        {/* Act 1 - brand name */}
        <div ref={nameRef} style={nameWrap}>
          <h1 className="sv-hero-name" style={nameText}>Sv&#257;ya</h1>
          <p ref={tagRef} style={tagText}>Korean fermentation, Ayurvedic ritual</p>
        </div>

        {/* Act 2 - story the cap flies through */}
        {STORY.map((s, i) => (
          <div key={i} ref={(el) => (storyRefs.current[i] = el)} style={{ ...storyWrap, opacity: 0 }}>
            <span className="eyebrow" style={{ color: 'var(--sv-saffron)' }}>{s.k}</span>
            <p style={storyLine}>{s.t}</p>
          </div>
        ))}

        {/* drifting ingredient tags */}
        {TAGS.map((tg, i) => (
          <span key={i} ref={(el) => (tagRefs.current[i] = el)}
            className="sv-tag-drift" style={{ ...tagChip, left: tg.x, top: tg.y, opacity: 0, animationDelay: `${i * 0.7}s` }}>
            {tg.t}
          </span>
        ))}

        {/* shared SVG scene */}
        <svg ref={sceneRef} viewBox="0 0 100 150" preserveAspectRatio="xMidYMid meet" style={sceneSvg} aria-label="Svaya serum assembling">
          <Defs />
          <path ref={guideRef} d="M18,30 C88,16 12,70 50,73" fill="none" stroke="#C0822E" strokeWidth="0.5"
            strokeDasharray="0.4 2.4" strokeLinecap="round" opacity="0" />
          <g ref={bottleRef} opacity="0"><HeroBottle glowRef={glowRef} /></g>
          <g ref={capRef} transform="translate(18 30)"><Cap /></g>
        </svg>

        {/* Act 3 - photoreal reveal */}
        <div ref={finaleRef} style={{ ...finaleWrap, opacity: 0, pointerEvents: 'none' }}><FinaleContent /></div>

        {/* scroll-progress rail (right edge filler + wayfinding) */}
        <div style={rail} aria-hidden="true">
          <span style={railTrack} />
          <span ref={railDotRef} style={railDot} />
        </div>

        <div ref={hintRef} className="muted" style={hint}>Scroll</div>
        {/* soft seam into the next section */}
        <div style={seam} aria-hidden="true" />
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
  background: 'radial-gradient(120% 80% at 50% 24%, #FBF7EE 0%, #F6F1E7 46%, #EFE7D6 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const spotlight = {
  position: 'absolute', inset: 0, pointerEvents: 'none', transformOrigin: '50% 30%', opacity: 0.9, willChange: 'transform, opacity',
  background: 'radial-gradient(circle at 50% 30%, rgba(224,161,38,0.30) 0%, rgba(224,161,38,0.09) 24%, transparent 50%)'
}
const rings = { position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', transformOrigin: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const ring = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(192,130,46,0.28)' }
const nameWrap = { position: 'absolute', top: '30%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const nameText = { fontSize: 'clamp(3.4rem, 15vw, 11rem)', lineHeight: 1, margin: 0, color: 'var(--sv-ink)' }
const tagText = { marginTop: 18, fontFamily: 'var(--sv-font-body)', fontSize: '0.78rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--sv-saffron)' }
const storyWrap = { position: 'absolute', top: '31%', left: 0, right: 0, padding: '0 24px', textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const storyLine = { fontFamily: 'var(--sv-font-display)', fontSize: 'clamp(1.6rem, 5vw, 3.4rem)', lineHeight: 1.18, color: 'var(--sv-ink)', maxWidth: 760, margin: '14px auto 0' }
const tagChip = {
  position: 'absolute', transform: 'translate(-50%,-50%)', fontFamily: 'var(--sv-font-body)', fontSize: '0.66rem',
  letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sv-saffron)', whiteSpace: 'nowrap',
  border: '1px solid var(--sv-line)', borderRadius: 999, padding: '6px 14px', background: 'rgba(251,247,238,0.6)',
  backdropFilter: 'blur(2px)', pointerEvents: 'none', willChange: 'opacity'
}
const sceneSvg = { position: 'absolute', inset: 0, width: '100%', height: '100%', willChange: 'opacity' }
const finaleWrap = { position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', willChange: 'transform, opacity' }
const featherMask = 'radial-gradient(118% 118% at 50% 45%, #000 52%, transparent 84%)'
const finaleImg = {
  width: 'clamp(200px, 30vw, 320px)', aspectRatio: '7 / 9', objectFit: 'cover',
  filter: 'drop-shadow(0 24px 40px rgba(44,42,34,0.14))',
  WebkitMaskImage: featherMask, maskImage: featherMask
}
const revealH = { fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', margin: '18px 0 0' }
const revealSub = { maxWidth: 460, margin: '12px auto 22px', color: 'var(--sv-taupe)', fontSize: '1.02rem' }
const rail = { position: 'absolute', right: 'max(18px, 2.4vw)', top: '50%', transform: 'translateY(-50%)', height: 120, width: 2, pointerEvents: 'none' }
const railTrack = { position: 'absolute', inset: 0, background: 'var(--sv-line)', borderRadius: 2 }
const railDot = { position: 'absolute', top: 0, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--sv-saffron)', boxShadow: '0 0 0 4px rgba(192,130,46,0.14)', willChange: 'transform' }
const hint = { position: 'absolute', bottom: '3vh', left: 0, right: 0, textAlign: 'center', fontSize: '0.66rem', letterSpacing: '0.3em', textTransform: 'uppercase' }
const seam = { position: 'absolute', left: 0, right: 0, bottom: 0, height: 96, background: 'linear-gradient(to bottom, transparent, var(--sv-ivory))', pointerEvents: 'none' }
