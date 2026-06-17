import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ProductRender from './ProductRender.jsx'

// The "information ring" treatment: a product framed inside a premium ring of text that
// curves around it via SVG <textPath> — so the copy genuinely wraps the bottle in 2.5D
// while staying pixel-crisp and 100% legible (vector text, never an AI hallucination).
//
//   top arc     -> PRODUCT NAME (the headline, saffron)
//   bottom arc  -> CONCERN · SIZE (the spec line, taupe)
//   centre      -> the product itself (clean vector render, or a text-free photo via `image`)
//   orbit       -> a faint dotted guide-ring + tick that slowly rotates (decorative only)
//
// Drop in a text-free photo by passing `image="/images/campaign/clean-<slug>.png"`; otherwise
// it falls back to the zero-asset vector render. Honors prefers-reduced-motion (no spin).

const VB = 400          // square viewBox
const C = VB / 2        // centre
const R_TEXT = 176      // radius the text rides on
const R_GUIDE = 150     // faint dotted guide ring

// Two semicircular baselines. Both travel left→right so the text reads upright:
// top arcs over the bottle, bottom arcs beneath it.
const arcTop = `M ${C - R_TEXT},${C} A ${R_TEXT},${R_TEXT} 0 0 1 ${C + R_TEXT},${C}`
const arcBottom = `M ${C - R_TEXT},${C} A ${R_TEXT},${R_TEXT} 0 0 0 ${C + R_TEXT},${C}`

export default function InfoRing({ product, image, size = 320 }) {
  const reduce = useReducedMotion()
  const [usePhoto, setUsePhoto] = useState(Boolean(image))
  const uid = product.slug

  const name = product.name.replace(/Sv[āa]ya?\s*/i, '').toUpperCase()
  // bottom arc = the dual-heritage signature (Korean active × Ayurvedic root) — the literal
  // promise this section makes ("Korean actives, Ayurvedic roots ... in a single ring of light").
  // Falls back to concern · size if a product has no curated pairing yet.
  const spec = (product.actives || `${product.concern} · ${product.sizeMl} ML`).toUpperCase()

  return (
    <figure style={{ ...wrap, width: size, height: size }}>
      {/* centred product */}
      <div style={center}>
        {usePhoto ? (
          <img
            src={image}
            alt={product.name}
            onError={() => setUsePhoto(false)}
            style={{ height: '66%', width: 'auto', maxWidth: '66%', objectFit: 'contain', transform: 'translateY(-2%)', filter: 'drop-shadow(0 18px 30px rgba(44,42,34,0.20))',
              // feather the warm-beige studio backdrop so the shot dissolves into the ivory ring
              WebkitMaskImage: ringFeather, maskImage: ringFeather }}
          />
        ) : (
          <ProductRender product={product} size={Math.round(size * 0.46)} />
        )}
      </div>

      {/* the ring */}
      <svg viewBox={`0 0 ${VB} ${VB}`} style={ringSvg} aria-hidden="true">
        <defs>
          <path id={`top-${uid}`} d={arcTop} fill="none" />
          <path id={`bot-${uid}`} d={arcBottom} fill="none" />
        </defs>

        {/* slow decorative orbit — dotted guide + a single saffron tick */}
        <motion.g
          style={{ transformOrigin: '50% 50%' }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx={C} cy={C} r={R_GUIDE} fill="none"
            stroke="var(--sv-saffron)" strokeOpacity="0.28" strokeWidth="1"
            strokeDasharray="1.5 9" strokeLinecap="round" />
          <circle cx={C} cy={C - R_GUIDE} r="3.2" fill="var(--sv-saffron)" />
        </motion.g>

        {/* curved copy — crisp vector, fully legible */}
        <text fill="var(--sv-saffron)"
          fontFamily="'Inter', system-ui, sans-serif" fontSize="20"
          fontWeight="500" letterSpacing="3.4" style={{ textTransform: 'uppercase' }}>
          <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">{name}</textPath>
        </text>
        <text fill="var(--sv-taupe)"
          fontFamily="'Inter', system-ui, sans-serif" fontSize="12.5"
          fontWeight="500" letterSpacing="5">
          <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">{spec}</textPath>
        </text>
      </svg>
    </figure>
  )
}

const wrap = {
  position: 'relative', margin: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', overflow: 'hidden',
  background: 'radial-gradient(120% 100% at 50% 32%, #FBF7EE 0%, #F6F1E7 52%, #EFE7D6 100%)',
  border: '1px solid var(--sv-line)', boxShadow: '0 26px 60px -28px rgba(44,42,34,0.28)'
}
const center = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }
// soft elliptical vignette: keeps the centred bottle, dissolves the rectangular studio backdrop
const ringFeather = 'radial-gradient(70% 94% at 50% 46%, #000 60%, rgba(0,0,0,0) 92%)'
const ringSvg = { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }
