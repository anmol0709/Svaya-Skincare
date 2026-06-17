import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

// Scroll-choreographed landing — "Tracing the Ritual."
//   Act 1  the brand name resolves out of a blur.
//   Act 2  a gold line DRAWS itself down the page as you scroll; a brushed-gold Svaya medallion
//          (vector — our emblem on a coin that FLIPS in 3D) rides the drawing tip, past the story.
//   Act 3  the line reaches the open Kumud Night Balm jar (blended into the scene); the medallion
//          settles beside it face-on with a sheen, a warm halo glows, name + CTA resolve.
// rAF loop EASES scroll progress; the path d + viewBox are rebuilt in px on resize so the line
// draws cleanly and the medallion tracks it exactly. Respects reduced-motion (static scene).

const HERO_SLUG = 'kumud-night-balm'
const SEAL_VIDEO = '/hero-seal.mp4'                                   // lid screws onto the jar
const SEAL_POSTER = '/images/campaign/hero-seal-poster.jpg'          // sealed frame (instant paint / reduced-motion)
const JAR_W = 'clamp(230px, 38vh, 350px)'
const SEAL_FROM = 0.56, SEAL_TO = 0.9                                 // scroll range that scrubs the seal video

// normalised route (x,y in 0..1 of the stage) — bows right, clear of the centred story, to the jar
const ROUTE = (W, H) => `M ${0.5 * W} ${0.17 * H} C ${0.79 * W} ${0.27 * H}, ${0.82 * W} ${0.46 * H}, ${0.6 * W} ${0.605 * H}`

const clamp = (v) => Math.max(0, Math.min(1, v))
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10)
function track(p, xs, ys) {
  if (p <= xs[0]) return ys[0]
  for (let i = 1; i < xs.length; i++) {
    if (p <= xs[i]) { const t = (p - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + (ys[i] - ys[i - 1]) * t }
  }
  return ys[ys.length - 1]
}
const bell = (p, a, b, c, d) => track(p, [a, b, c, d], [0, 1, 1, 0])

const STORY = [
  { k: 'The name', t: 'Svāya means self — belonging to oneself.' },
  { k: 'The marriage', t: 'Korean fermentation, married to Ayurvedic ritual.' },
  { k: 'The promise', t: 'Radiance is earned, gently, day after day.' }
]
const TAGS = [
  { t: 'Fermented rice', x: '12%', y: '34%', a: 0.15, b: 0.42 },
  { t: 'Ayurvedic saffron', x: '87%', y: '72%', a: 0.20, b: 0.48 },
  { t: 'Ceramides', x: '12%', y: '70%', a: 0.28, b: 0.54 },
  { t: 'Shea · rose', x: '88%', y: '30%', a: 0.34, b: 0.58 }
]

// Our brand emblem (favicon.svg) recoloured to read engraved on gold.
const Emblem = () => (
  <svg viewBox="0 0 64 64" style={{ width: '64%', height: '64%' }} aria-hidden="true">
    <circle cx="32" cy="32" r="22" fill="none" stroke="#6E4F1E" strokeOpacity="0.85" strokeWidth="2.4"
      style={{ filter: 'drop-shadow(0 0.6px 0 rgba(255,247,226,0.65))' }} />
    <circle cx="32" cy="18" r="3.2" fill="#7A5418" />
    <text x="32" y="43" fontFamily="Georgia, 'Times New Roman', serif" fontSize="27" fill="#6E4F1E"
      fillOpacity="0.92" textAnchor="middle" style={{ filter: 'drop-shadow(0 0.6px 0 rgba(255,247,226,0.7))' }}>S</text>
  </svg>
)

// Double-sided brushed-gold coin so the 3D flip shows metal on both faces.
const Medallion = ({ medRef, seated = false }) => (
  <div ref={medRef} style={{ ...medallion, ...(seated ? { opacity: 1, transform: 'translate(-50%,-50%) rotateY(0deg)' } : {}) }}>
    <div style={coinFace}><span style={coinSheen} aria-hidden="true" /><Emblem /></div>
    <div style={coinBack} />
  </div>
)

export default function ScrollHero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const svgRef = useRef(null)
  const guideRef = useRef(null)
  const inkRef = useRef(null)
  const lenRef = useRef(0)
  const nameRef = useRef(null)
  const tagLineRef = useRef(null)
  const spotRef = useRef(null)
  const storyRefs = useRef([])
  const tagRefs = useRef([])
  const sealWrapRef = useRef(null)
  const videoRef = useRef(null)
  const glowRef = useRef(null)
  const medRef = useRef(null)
  const finaleTextRef = useRef(null)
  const railDotRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    let raf
    let cur = 0
    const set = (el, prop, val) => { if (el) el.style[prop] = val }

    const layout = () => {
      const st = stageRef.current
      if (!st || !inkRef.current) return
      const W = st.clientWidth, H = st.clientHeight
      const d = ROUTE(W, H)
      svgRef.current.setAttribute('viewBox', `0 0 ${W} ${H}`)
      guideRef.current.setAttribute('d', d)
      inkRef.current.setAttribute('d', d)
      lenRef.current = inkRef.current.getTotalLength()
      inkRef.current.style.strokeDasharray = lenRef.current
    }
    layout()
    window.addEventListener('resize', layout)

    const apply = (p) => {
      // Act 1 — name + spotlight
      set(nameRef.current, 'opacity', track(p, [0, 0.07, 0.13], [1, 1, 0]))
      set(nameRef.current, 'transform', `translateY(${track(p, [0.05, 0.13], [0, -30]).toFixed(1)}px)`)
      set(tagLineRef.current, 'opacity', track(p, [0, 0.07, 0.12], [1, 1, 0]))
      set(spotRef.current, 'opacity', track(p, [0, 0.2, 0.3], [0.9, 0.9, 0.14]))
      set(spotRef.current, 'transform', `scale(${track(p, [0, 0.26], [0.92, 1.25]).toFixed(3)})`)

      // story + tags
      storyRefs.current.forEach((el, i) => {
        const o = [bell(p, 0.14, 0.19, 0.25, 0.30), bell(p, 0.30, 0.35, 0.40, 0.45), bell(p, 0.45, 0.50, 0.56, 0.62)][i]
        set(el, 'opacity', o); set(el, 'transform', `translateY(${((1 - o) * 16).toFixed(1)}px)`)
      })
      tagRefs.current.forEach((el, i) => { const c = TAGS[i]; set(el, 'opacity', bell(p, c.a, c.a + 0.04, c.b - 0.04, c.b)) })

      // Act 2 — the line draws + the medallion rides its tip, flipping in 3D
      const ink = inkRef.current, med = medRef.current, len = lenRef.current
      set(svgRef.current, 'opacity', track(p, [0.08, 0.16, 0.9, 0.98], [0, 1, 1, 0.4]))
      if (ink && med && len) {
        const drawn = smooth(clamp((p - 0.12) / 0.5))       // 0..1, completes ~0.62
        ink.style.strokeDashoffset = (len * (1 - drawn)).toFixed(1)
        const pt = ink.getPointAtLength(drawn * len)
        const flip = drawn * 1080 + track(p, [0.66, 0.72, 0.8], [0, 10, 0]) // 3 flips -> face-on + settle
        const sc = track(p, [0.1, 0.18, 0.62, 0.72], [0.5, 1, 1, 1.12])
        med.style.left = pt.x.toFixed(1) + 'px'
        med.style.top = pt.y.toFixed(1) + 'px'
        med.style.opacity = track(p, [0.1, 0.17, 0.54, 0.60], [0, 1, 1, 0]).toFixed(3) // hands off to the seal video
        med.style.transform = `translate(-50%,-50%) rotateY(${flip.toFixed(1)}deg) scale(${sc.toFixed(3)})`
      }

      // Act 3 — the seal video scrubs with scroll (open jar -> lid screws on), warm halo, copy
      const vid = videoRef.current
      if (vid) {
        vid.style.opacity = track(p, [0.46, 0.58], [0, 1]).toFixed(3)
        if (vid.duration) {
          const t = clamp((p - SEAL_FROM) / (SEAL_TO - SEAL_FROM)) * vid.duration
          if (Math.abs(t - vid.currentTime) > 0.03) { try { vid.currentTime = t } catch (e) { /* seeking */ } }
        }
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = track(p, [0.5, 0.7, 0.95], [0, 0.55, 0.4]).toFixed(3)
        glowRef.current.style.transform = `translate(-50%,-50%) scale(${track(p, [0.5, 0.8], [0.7, 1.1]).toFixed(3)})`
      }
      set(finaleTextRef.current, 'opacity', track(p, [0.78, 0.9], [0, 1]))
      set(finaleTextRef.current, 'transform', `translateY(${track(p, [0.78, 0.92], [16, 0]).toFixed(1)}px)`)

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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', layout) }
  }, [reduce])

  // ---- Reduced motion: calm static hero, jar + medallion beside it ----
  if (reduce) {
    return (
      <section style={{ ...stage, height: 'auto', minHeight: '100vh', position: 'relative', paddingBlock: 56 }}>
        <div className="container center">
          <span className="eyebrow">An East-Meets-East Ritual</span>
          <h1 style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', margin: '8px 0 18px' }}>Sv&#257;ya</h1>
          <div style={{ ...jarBox, margin: '0 auto', maskImage: jarFeather, WebkitMaskImage: jarFeather }}>
            <span style={{ ...sealGlow, opacity: 0.4 }} aria-hidden="true" />
            <img src={SEAL_POSTER} alt="Svaya Kumud Night Balm" style={{ ...sealVideo, opacity: 1 }} />
          </div>
          <div style={{ ...finaleText, opacity: 1, transform: 'none', marginTop: 20 }}>
            <h2 style={revealH}>Kumud Night Balm</h2>
            <p style={revealSub}>Fermented rice and saffron. Replenishment while you rest.</p>
            <Link to={`/product/${HERO_SLUG}`} className="btn">Explore the Ritual</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} style={{ height: '440vh', position: 'relative' }}>
      <div ref={stageRef} style={stage}>
        <div ref={spotRef} style={spotlight} />
        {[...Array(7)].map((_, i) => (
          <span key={i} className="sv-mote" style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--sv-marigold)', filter: 'blur(1px)',
            left: `${10 + i * 12}%`, top: `${24 + (i % 4) * 16}%`, animationDelay: `${i * 0.9}s`, opacity: 0
          }} />
        ))}

        {/* the self-drawing path */}
        <svg ref={svgRef} style={pathSvg} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="sv-ink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E0A126" /><stop offset="1" stopColor="#B5792A" />
            </linearGradient>
          </defs>
          <path ref={guideRef} fill="none" stroke="var(--sv-saffron)" strokeOpacity="0.22" strokeWidth="2"
            strokeLinecap="round" strokeDasharray="1 9" />
          <path ref={inkRef} fill="none" stroke="url(#sv-ink)" strokeWidth="2.6" strokeLinecap="round" />
        </svg>

        {/* Act 1 - brand name */}
        <div ref={nameRef} style={nameWrap}>
          <h1 className="sv-hero-name" style={nameText}>Sv&#257;ya</h1>
          <p ref={tagLineRef} style={tagText}>Korean fermentation, Ayurvedic ritual</p>
        </div>

        {/* Act 2 - story */}
        {STORY.map((s, i) => (
          <div key={i} ref={(el) => (storyRefs.current[i] = el)} style={{ ...storyWrap, opacity: 0 }}>
            <span className="eyebrow" style={{ color: 'var(--sv-saffron)' }}>{s.k}</span>
            <p style={storyLine}>{s.t}</p>
          </div>
        ))}

        {/* ingredient tags */}
        {TAGS.map((tg, i) => (
          <span key={i} ref={(el) => (tagRefs.current[i] = el)}
            className="sv-tag-drift" style={{ ...tagChip, left: tg.x, top: tg.y, opacity: 0, animationDelay: `${i * 0.8}s` }}>
            {tg.t}
          </span>
        ))}

        {/* Act 3 - the seal video (blended) + copy */}
        <div ref={sealWrapRef} style={sealWrap}>
          <div style={{ ...jarBox, maskImage: jarFeather, WebkitMaskImage: jarFeather }}>
            <span ref={glowRef} style={sealGlow} aria-hidden="true" />
            <video ref={videoRef} src={SEAL_VIDEO} poster={SEAL_POSTER} muted playsInline preload="auto"
              tabIndex={-1} aria-hidden="true" style={sealVideo} />
          </div>
          <div ref={finaleTextRef} style={finaleText}>
            <h2 style={revealH}>Kumud Night Balm</h2>
            <p style={revealSub}>Fermented rice and saffron. Replenishment while you rest.</p>
            <Link to={`/product/${HERO_SLUG}`} className="btn">Explore the Ritual</Link>
          </div>
        </div>

        {/* the travelling medallion */}
        <Medallion medRef={medRef} />

        {/* scroll rail */}
        <div style={rail} aria-hidden="true"><span style={railTrack} /><span ref={railDotRef} style={railDot} /></div>
        <div ref={hintRef} className="muted" style={hint}>Scroll</div>
        <div style={seam} aria-hidden="true" />
      </div>
    </section>
  )
}

const stage = {
  position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', perspective: '1200px',
  background: 'radial-gradient(120% 80% at 50% 26%, #FBF7EE 0%, #F6F1E7 46%, #EFE7D6 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const spotlight = {
  position: 'absolute', inset: 0, pointerEvents: 'none', transformOrigin: '50% 30%', opacity: 0.9, willChange: 'transform, opacity',
  background: 'radial-gradient(circle at 50% 30%, rgba(224,161,38,0.28) 0%, rgba(224,161,38,0.08) 24%, transparent 50%)'
}
const pathSvg = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0, willChange: 'opacity' }
const nameWrap = { position: 'absolute', top: '17%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const nameText = { fontSize: 'clamp(3rem, 12vw, 8rem)', lineHeight: 1, margin: 0, color: 'var(--sv-ink)', letterSpacing: '-0.01em' }
const tagText = { marginTop: 16, fontFamily: 'var(--sv-font-body)', fontSize: '0.74rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sv-saffron)' }
const storyWrap = { position: 'absolute', top: '31%', left: 0, right: 0, padding: '0 24px', textAlign: 'center', pointerEvents: 'none', willChange: 'transform, opacity' }
const storyLine = { fontFamily: 'var(--sv-font-display)', fontSize: 'clamp(1.5rem, 4.4vw, 3rem)', lineHeight: 1.18, color: 'var(--sv-ink)', maxWidth: 640, margin: '12px auto 0', textWrap: 'balance' }

const tagChip = {
  position: 'absolute', transform: 'translate(-50%,-50%)', fontFamily: 'var(--sv-font-body)', fontSize: '0.72rem',
  fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sv-saffron-hi)', whiteSpace: 'nowrap',
  border: '1px solid rgba(192,130,46,0.4)', borderRadius: 999, padding: '8px 16px', background: 'rgba(251,247,238,0.94)',
  boxShadow: '0 6px 16px rgba(44,42,34,0.07)', pointerEvents: 'none', willChange: 'opacity'
}

// --- the seal stage: jar lives lower, blended into the ivory ---
const sealWrap = {
  position: 'absolute', left: 0, right: 0, top: '64%', transform: 'translateY(-50%)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px'
}
const jarBox = { position: 'relative', width: JAR_W, aspectRatio: '4 / 5', overflow: 'hidden', lineHeight: 0 }
// soft oval feather so the video's warm backdrop dissolves into the ivory (no hard card edge)
const jarFeather = 'radial-gradient(58% 60% at 50% 49%, #000 34%, rgba(0,0,0,0) 78%)'
const sealVideo = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', display: 'block', transform: 'scale(1.32)', opacity: 0, willChange: 'opacity' }
const sealGlow = {
  position: 'absolute', left: '50%', top: '46%', width: '170%', aspectRatio: 1, borderRadius: '50%',
  transform: 'translate(-50%,-50%)', opacity: 0, pointerEvents: 'none', willChange: 'transform, opacity',
  background: 'radial-gradient(circle, rgba(231,201,126,0.5) 0%, rgba(246,241,231,0.55) 30%, rgba(246,241,231,0) 66%)'
}

// --- vector gold medallion (double-sided coin) ---
const goldGrad = 'radial-gradient(circle at 36% 30%, #FCEFCB 0%, #EBCE86 32%, #C9A468 60%, #9A7426 100%)'
const medallion = {
  position: 'absolute', left: '50%', top: '17%', width: 'clamp(54px, 6.4vw, 78px)', aspectRatio: 1,
  transformOrigin: 'center', transformStyle: 'preserve-3d', opacity: 0, willChange: 'transform, opacity', pointerEvents: 'none'
}
const coinFace = {
  position: 'absolute', inset: 0, borderRadius: '50%', backfaceVisibility: 'hidden', overflow: 'hidden',
  display: 'grid', placeItems: 'center', background: goldGrad,
  boxShadow: 'inset 0 2px 4px rgba(255,248,225,0.75), inset 0 -3px 7px rgba(120,86,20,0.55), 0 8px 16px rgba(60,40,16,0.32)'
}
const coinBack = {
  position: 'absolute', inset: 0, borderRadius: '50%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: goldGrad,
  boxShadow: 'inset 0 2px 4px rgba(255,248,225,0.7), inset 0 -3px 7px rgba(120,86,20,0.55), 0 8px 16px rgba(60,40,16,0.32)'
}
const coinSheen = {
  position: 'absolute', inset: 0, pointerEvents: 'none',
  background: 'linear-gradient(118deg, transparent 38%, rgba(255,251,235,0.7) 50%, transparent 62%)'
}

const finaleText = { textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0, willChange: 'transform, opacity' }
const revealH = { fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', margin: 0 }
const revealSub = { maxWidth: 460, margin: '12px auto 22px', color: 'var(--sv-taupe)', fontSize: '1.02rem' }
const rail = { position: 'absolute', right: 'max(18px, 2.4vw)', top: '50%', transform: 'translateY(-50%)', height: 120, width: 2, pointerEvents: 'none' }
const railTrack = { position: 'absolute', inset: 0, background: 'var(--sv-line)', borderRadius: 2 }
const railDot = { position: 'absolute', top: 0, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--sv-saffron)', boxShadow: '0 0 0 4px rgba(192,130,46,0.14)', willChange: 'transform' }
const hint = { position: 'absolute', bottom: '3vh', left: 0, right: 0, textAlign: 'center', fontSize: '0.66rem', letterSpacing: '0.3em', textTransform: 'uppercase' }
const seam = { position: 'absolute', left: 0, right: 0, bottom: 0, height: 96, background: 'linear-gradient(to bottom, transparent, var(--sv-ivory))', pointerEvents: 'none' }
