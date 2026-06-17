import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

// Cinematic, scroll-choreographed landing — imperative for smoothness, REAL photography
// for the payoff (no SVG bottle).
//   Act 1  the brand name resolves out of a blur.
//   Act 2  a brushed-gold cap (pure CSS) detaches FROM the name and arcs along the right
//          side — framing, never covering, the three Svaya story lines — while faint
//          ingredient tags drift in the margins.
//   Act 3  the cap descends to centre and the photoreal serum BLOOMS into being with a
//          saffron flash; the finished product holds with the name + CTA.
// Driven by a rAF loop that EASES progress (lerp = inertia) and writes transforms/opacity
// straight to refs — zero React renders per frame. Respects prefers-reduced-motion.

const HERO_SLUG = 'saffron-radiance-serum'
// cap path in stage PERCENT coords; P0 = on the name, P3 = onto the blooming bottle
const P = [[50, 27], [88, 26], [74, 50], [50, 45]]
const bez = (t, i) => {
  const u = 1 - t
  return u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]
}
const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10)
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
// tags live in the side/corner margins so they never collide with the centred story
const TAGS = [
  { t: 'Kumkumadi saffron', x: '12%', y: '36%', a: 0.15, b: 0.42 },
  { t: 'Korean niacinamide', x: '85%', y: '64%', a: 0.20, b: 0.48 },
  { t: 'Fermented ginseng', x: '13%', y: '66%', a: 0.28, b: 0.54 },
  { t: 'Centella · cica', x: '86%', y: '34%', a: 0.34, b: 0.58 }
]

function FinaleContent({ imgRef }) {
  const [photo, setPhoto] = useState(true)
  return (
    <>
      <div style={finaleImgWrap}>
        <span style={finaleGlow} aria-hidden="true" />
        {photo ? (
          <img ref={imgRef} src={`/images/${HERO_SLUG}.jpg`} alt="Svaya Saffron Radiance Serum"
            onError={() => setPhoto(false)} style={finaleImg} />
        ) : (
          <div ref={imgRef} style={{ ...finaleImg, display: 'grid', placeItems: 'center', color: 'var(--sv-dim)', fontFamily: 'var(--sv-font-display)', fontSize: '2rem' }}>Svāya</div>
        )}
      </div>
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
  const nameRef = useRef(null)
  const tagLineRef = useRef(null)
  const spotRef = useRef(null)
  const glowRef = useRef(null)
  const storyRefs = useRef([])
  const tagRefs = useRef([])
  const finaleRef = useRef(null)
  const finaleImgRef = useRef(null)
  const railDotRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    let raf
    let cur = 0
    const set = (el, prop, val) => { if (el) el.style[prop] = val }

    const apply = (p) => {
      // cap flight 0.13 -> 0.58, then it fades onto the blooming bottle
      const t = smooth(clamp((p - 0.13) / 0.45))
      const capX = bez(t, 0)
      const capY = bez(t, 1)
      const capRot = (1 - t) * 820
      if (capRef.current) {
        capRef.current.style.left = capX.toFixed(2) + '%'
        capRef.current.style.top = capY.toFixed(2) + '%'
        capRef.current.style.transform = `translate(-50%, -50%) rotate(${capRot.toFixed(1)}deg)`
        capRef.current.style.opacity = track(p, [0, 0.05, 0.5, 0.6], [0, 1, 1, 0])
      }

      // Act 1 name + spotlight
      set(nameRef.current, 'opacity', track(p, [0, 0.07, 0.13], [1, 1, 0]))
      set(nameRef.current, 'transform', `translateY(${track(p, [0.05, 0.13], [0, -36]).toFixed(1)}px)`)
      set(tagLineRef.current, 'opacity', track(p, [0, 0.07, 0.12], [1, 1, 0]))
      set(spotRef.current, 'opacity', track(p, [0, 0.2, 0.3], [0.9, 0.9, 0.14]))
      set(spotRef.current, 'transform', `scale(${track(p, [0, 0.26], [0.92, 1.25]).toFixed(3)})`)

      // story beats (kept clear of the cap's right-side arc)
      storyRefs.current.forEach((el, i) => {
        const o = [bell(p, 0.15, 0.2, 0.27, 0.33), bell(p, 0.3, 0.35, 0.42, 0.48), bell(p, 0.45, 0.5, 0.55, 0.6)][i]
        set(el, 'opacity', o)
        set(el, 'transform', `translateY(${((1 - o) * 16).toFixed(1)}px)`)
      })
      // legible ingredient tags
      tagRefs.current.forEach((el, i) => {
        const c = TAGS[i]
        set(el, 'opacity', bell(p, c.a, c.a + 0.04, c.b - 0.04, c.b))
      })

      // Act 3 — saffron flash + photoreal bloom, settles by ~0.74 then HOLDS
      glowRef.current && (glowRef.current.style.opacity = track(p, [0.52, 0.6, 0.74], [0, 0.6, 0.16]))
      set(finaleRef.current, 'opacity', track(p, [0.56, 0.7], [0, 1]))
      const fRise = track(p, [0.56, 0.74], [34, 0])
      set(finaleRef.current, 'transform', `translateY(calc(-50% + ${fRise.toFixed(1)}px))`)
      set(finaleRef.current, 'pointerEvents', p > 0.72 ? 'auto' : 'none')
      set(finaleImgRef.current, 'transform', `scale(${track(p, [0.54, 0.72], [0.72, 1]).toFixed(3)})`)

      set(hintRef.current, 'opacity', track(p, [0, 0.04], [1, 0]))
      if (railDotRef.current) railDotRef.current.style.transform = `translateY(${(p * 100).toFixed(2)}px)`
    }

    const tick = () => {
      const el = sectionRef.current
      if (el) {
        const top = el.getBoundingClientRect().top
        const range = el.offsetHeight - window.innerHeight
        const target = clamp(range > 0 ? -top / range : 0)
        cur += (target - cur) * 0.1
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
          <div style={{ ...finaleWrap, position: 'static', transform: 'none', opacity: 1 }}><FinaleContent imgRef={null} /></div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} style={{ height: '420vh', position: 'relative' }}>
      <div style={stage}>
        <div ref={spotRef} style={spotlight} />
        {[...Array(7)].map((_, i) => (
          <span key={i} className="sv-mote" style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--sv-marigold)', filter: 'blur(1px)',
            left: `${10 + i * 12}%`, top: `${24 + (i % 4) * 16}%`,
            animationDelay: `${i * 0.9}s`, opacity: 0
          }} />
        ))}

        {/* Act 1 - brand name (cap starts here) */}
        <div ref={nameRef} style={nameWrap}>
          <h1 className="sv-hero-name" style={nameText}>Sv&#257;ya</h1>
          <p ref={tagLineRef} style={tagText}>Korean fermentation, Ayurvedic ritual</p>
        </div>

        {/* Act 2 - story the cap arcs past */}
        {STORY.map((s, i) => (
          <div key={i} ref={(el) => (storyRefs.current[i] = el)} style={{ ...storyWrap, opacity: 0 }}>
            <span className="eyebrow" style={{ color: 'var(--sv-saffron)' }}>{s.k}</span>
            <p style={storyLine}>{s.t}</p>
          </div>
        ))}

        {/* legible ingredient tags */}
        {TAGS.map((tg, i) => (
          <span key={i} ref={(el) => (tagRefs.current[i] = el)}
            className="sv-tag-drift" style={{ ...tagChip, left: tg.x, top: tg.y, opacity: 0, animationDelay: `${i * 0.8}s` }}>
            {tg.t}
          </span>
        ))}

        {/* flying cap — pure CSS, no SVG */}
        <div ref={capRef} style={cap} aria-hidden="true">
          <span style={capBulb} />
          <span style={capCollar} />
          <span style={capStem} />
        </div>

        {/* Act 3 - photoreal reveal */}
        <span ref={glowRef} style={centerGlow} aria-hidden="true" />
        <div ref={finaleRef} style={{ ...finaleWrap, opacity: 0, pointerEvents: 'none' }}>
          <FinaleContent imgRef={finaleImgRef} />
        </div>

        {/* scroll-progress rail */}
        <div style={rail} aria-hidden="true">
          <span style={railTrack} />
          <span ref={railDotRef} style={railDot} />
        </div>

        <div ref={hintRef} className="muted" style={hint}>Scroll</div>
        <div style={seam} aria-hidden="true" />
      </div>
    </section>
  )
}

const stage = {
  position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden',
  background: 'radial-gradient(120% 80% at 50% 26%, #FBF7EE 0%, #F6F1E7 46%, #EFE7D6 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const spotlight = {
  position: 'absolute', inset: 0, pointerEvents: 'none', transformOrigin: '50% 30%', opacity: 0.9, willChange: 'transform, opacity',
  background: 'radial-gradient(circle at 50% 30%, rgba(224,161,38,0.28) 0%, rgba(224,161,38,0.08) 24%, transparent 50%)'
}
const nameWrap = { position: 'absolute', top: '29%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const nameText = { fontSize: 'clamp(3.4rem, 14vw, 9.5rem)', lineHeight: 1, margin: 0, color: 'var(--sv-ink)', letterSpacing: '-0.01em' }
const tagText = { marginTop: 18, fontFamily: 'var(--sv-font-body)', fontSize: '0.78rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sv-saffron)' }
const storyWrap = { position: 'absolute', top: '30%', left: 0, right: 0, padding: '0 24px', textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const storyLine = { fontFamily: 'var(--sv-font-display)', fontSize: 'clamp(1.7rem, 5vw, 3.4rem)', lineHeight: 1.18, color: 'var(--sv-ink)', maxWidth: 720, margin: '14px auto 0', textWrap: 'balance' }

// ingredient tag chip — solid enough for AA contrast on ivory
const tagChip = {
  position: 'absolute', transform: 'translate(-50%,-50%)', fontFamily: 'var(--sv-font-body)', fontSize: '0.72rem',
  fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sv-saffron-hi)', whiteSpace: 'nowrap',
  border: '1px solid rgba(192,130,46,0.4)', borderRadius: 999, padding: '8px 16px', background: 'rgba(251,247,238,0.94)',
  boxShadow: '0 6px 16px rgba(44,42,34,0.07)', pointerEvents: 'none', willChange: 'opacity'
}

// pure-CSS brushed-gold cap
const cap = { position: 'absolute', left: '50%', top: '27%', width: 38, height: 56, transformOrigin: 'center', willChange: 'transform, opacity', filter: 'drop-shadow(0 7px 11px rgba(44,42,34,0.22))', pointerEvents: 'none' }
const goldGrad = 'linear-gradient(105deg, #9C7A2E 0%, #F0DCA6 24%, #C9A86A 50%, #EBD49A 74%, #9C7A2E 100%)'
const capBulb = { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 26, height: 30, borderRadius: '11px 11px 8px 8px', background: goldGrad, boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.55)' }
const capCollar = { position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', width: 33, height: 11, borderRadius: 3, background: goldGrad }
const capStem = { position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)', width: 5, height: 17, borderRadius: '0 0 2px 2px', background: 'linear-gradient(to bottom, rgba(215,162,62,0.55), rgba(168,108,31,0.2))' }

const centerGlow = { position: 'absolute', top: '50%', left: '50%', width: 'min(70vw, 460px)', aspectRatio: 1, transform: 'translate(-50%,-50%)', borderRadius: '50%', opacity: 0, pointerEvents: 'none', willChange: 'opacity', background: 'radial-gradient(circle, rgba(224,161,38,0.4) 0%, rgba(224,161,38,0.12) 40%, transparent 70%)' }

const finaleWrap = { position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', willChange: 'transform, opacity' }
const finaleImgWrap = { position: 'relative', display: 'grid', placeItems: 'center' }
const finaleGlow = { position: 'absolute', width: '150%', aspectRatio: 1, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,161,38,0.16) 0%, transparent 62%)', pointerEvents: 'none' }
const featherMask = 'radial-gradient(118% 118% at 50% 45%, #000 52%, transparent 84%)'
const finaleImg = {
  position: 'relative', width: 'clamp(200px, 30vw, 320px)', aspectRatio: '7 / 9', objectFit: 'cover',
  filter: 'drop-shadow(0 24px 40px rgba(44,42,34,0.14))', willChange: 'transform',
  WebkitMaskImage: featherMask, maskImage: featherMask
}
const revealH = { fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', margin: '14px 0 0' }
const revealSub = { maxWidth: 460, margin: '12px auto 22px', color: 'var(--sv-taupe)', fontSize: '1.02rem' }
const rail = { position: 'absolute', right: 'max(18px, 2.4vw)', top: '50%', transform: 'translateY(-50%)', height: 120, width: 2, pointerEvents: 'none' }
const railTrack = { position: 'absolute', inset: 0, background: 'var(--sv-line)', borderRadius: 2 }
const railDot = { position: 'absolute', top: 0, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--sv-saffron)', boxShadow: '0 0 0 4px rgba(192,130,46,0.14)', willChange: 'transform' }
const hint = { position: 'absolute', bottom: '3vh', left: 0, right: 0, textAlign: 'center', fontSize: '0.66rem', letterSpacing: '0.3em', textTransform: 'uppercase' }
const seam = { position: 'absolute', left: 0, right: 0, bottom: 0, height: 96, background: 'linear-gradient(to bottom, transparent, var(--sv-ivory))', pointerEvents: 'none' }
