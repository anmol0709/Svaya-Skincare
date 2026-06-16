import { motion, useReducedMotion } from 'framer-motion'

// Studio-lit animated product render. A single reusable vector "photograph" of a
// Svaya vessel: refracted glass, a moving specular shimmer, tinted liquid with a
// meniscus, embossed label and a brushed-gold cap. Gently floats; the float and
// shimmer are disabled under prefers-reduced-motion. Vessel + tint come from the
// catalog, so all 15 SKUs render consistently with zero binary assets.
//
// viewBox is 300 x 380 (cx = 150). Each vessel supplies body/liquid/label/cap geometry.

const VESSELS = {
  dropper: {
    body: { x: 96, y: 122, w: 108, h: 208, rx: 26 },
    liquid: 0.62,
    label: { y: 222, w: 86, h: 96 },
    cap: (g) => `
      <rect x="120" y="104" width="60" height="22" rx="4" fill="url(#gold-${g})"/>
      <rect x="118" y="100" width="64" height="7" rx="3" fill="#E7C98B"/>
      <rect x="131" y="58" width="38" height="48" rx="15" fill="url(#gold-${g})" stroke="#A8842F" stroke-width="0.6"/>
      <rect x="139" y="44" width="22" height="18" rx="6" fill="#B8924E"/>`
  },
  tall: {
    body: { x: 104, y: 96, w: 92, h: 236, rx: 22 },
    liquid: 0.66,
    label: { y: 226, w: 74, h: 100 },
    cap: (g) => `
      <rect x="128" y="60" width="44" height="40" rx="8" fill="url(#gold-${g})" stroke="#A8842F" stroke-width="0.6"/>
      <rect x="120" y="96" width="60" height="14" rx="5" fill="#E7C98B"/>`
  },
  tube: {
    body: { x: 110, y: 118, w: 80, h: 212, rx: 18, taper: 0.42 },
    liquid: 0.5,
    label: { y: 226, w: 70, h: 92 },
    cap: (g) => `
      <rect x="120" y="74" width="60" height="46" rx="10" fill="url(#gold-${g})" stroke="#A8842F" stroke-width="0.6"/>
      <rect x="118" y="112" width="64" height="10" rx="4" fill="#E7C98B"/>`
  },
  jar: {
    body: { x: 82, y: 178, w: 136, h: 152, rx: 30 },
    liquid: 0.74,
    label: { y: 250, w: 110, h: 78 },
    cap: (g) => `
      <rect x="74" y="150" width="152" height="42" rx="14" fill="url(#gold-${g})" stroke="#A8842F" stroke-width="0.6"/>
      <rect x="90" y="146" width="120" height="9" rx="4" fill="#E7C98B"/>`
  },
  jarSmall: {
    body: { x: 104, y: 196, w: 92, h: 134, rx: 26 },
    liquid: 0.72,
    label: { y: 256, w: 76, h: 66 },
    cap: (g) => `
      <rect x="98" y="172" width="104" height="34" rx="12" fill="url(#gold-${g})" stroke="#A8842F" stroke-width="0.6"/>
      <rect x="112" y="168" width="76" height="8" rx="4" fill="#E7C98B"/>`
  }
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt)
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b)
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export default function ProductRender({ product, size = 200, float = true }) {
  const reduce = useReducedMotion()
  const v = VESSELS[product.vessel] || VESSELS.dropper
  const { body } = v
  const tint = product.tint
  const id = (product.slug + '-' + size).replace(/[^a-z0-9-]/gi, '')

  // inner liquid rect within the glass body
  const inset = 10
  const liqH = (body.h - inset * 2) * v.liquid
  const liqY = body.y + (body.h - inset) - liqH
  const liqX = body.x + inset
  const liqW = body.w - inset * 2

  const labelLine = product.name.replace(/Sv[āa]ya?\s*/i, '').toUpperCase()

  const animate = float && !reduce
    ? { y: [0, -7, 0], rotate: [-0.5, 0.5, -0.5] }
    : { y: 0, rotate: 0 }

  return (
    <motion.svg
      viewBox="0 0 300 380" width={size} height={Math.round(size * 1.26)}
      role="img" aria-label={`${product.name} bottle`}
      style={{ display: 'block', overflow: 'visible' }}
      animate={animate}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        {/* glass: bright edges, translucent tinted core */}
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="14%" stopColor={shade(tint, 0.78)} stopOpacity="0.55" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="86%" stopColor={shade(tint, 0.5)} stopOpacity="0.5" />
          <stop offset="100%" stopColor={shade(tint, 0.25)} stopOpacity="0.65" />
        </linearGradient>
        {/* liquid: deeper at the base */}
        <linearGradient id={`liq-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(tint, 0.3)} />
          <stop offset="40%" stopColor={tint} />
          <stop offset="100%" stopColor={shade(tint, -0.22)} />
        </linearGradient>
        {/* brushed gold */}
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#9C7A2E" />
          <stop offset="22%" stopColor="#F0DCA6" />
          <stop offset="46%" stopColor="#C9A86A" />
          <stop offset="70%" stopColor="#EBD49A" />
          <stop offset="100%" stopColor="#9C7A2E" />
        </linearGradient>
        {/* moving specular streak */}
        <linearGradient id={`sheen-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* label face: gently curved (lighter centre) */}
        <linearGradient id={`label-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade('#F6F1E7', -0.06)} />
          <stop offset="50%" stopColor="#FBF7EE" />
          <stop offset="100%" stopColor={shade('#F6F1E7', -0.06)} />
        </linearGradient>
        <radialGradient id={`floor-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2C2A22" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2C2A22" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${id}`}>
          <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} />
        </clipPath>
      </defs>

      {/* grounding shadow */}
      <ellipse cx="150" cy="350" rx={body.w * 0.66} ry="15" fill={`url(#floor-${id})`} />

      {/* glass body */}
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx}
        fill={`url(#glass-${id})`} stroke={shade(tint, 0.45)} strokeWidth="1.4" />

      {/* liquid + meniscus, clipped to the glass */}
      <g clipPath={`url(#clip-${id})`}>
        <rect x={liqX} y={liqY} width={liqW} height={liqH + 20} fill={`url(#liq-${id})`} />
        <ellipse cx="150" cy={liqY} rx={liqW / 2} ry="6" fill="#ffffff" opacity="0.22" />
        {/* inner side shading for volume */}
        <rect x={liqX} y={liqY} width="10" height={liqH} fill={shade(tint, -0.2)} opacity="0.3" />
        <rect x={liqX + liqW - 10} y={liqY} width="10" height={liqH} fill={shade(tint, -0.2)} opacity="0.3" />
      </g>

      {/* label */}
      <g>
        <rect x={150 - v.label.w / 2 + 2} y={v.label.y + 2} width={v.label.w} height={v.label.h} rx="9"
          fill="#000" opacity="0.05" />
        <rect x={150 - v.label.w / 2} y={v.label.y} width={v.label.w} height={v.label.h} rx="9"
          fill={`url(#label-${id})`} stroke="#E1D6BF" strokeWidth="0.8" />
        <text x="150" y={v.label.y + v.label.h * 0.42} textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif" fontSize={Math.min(22, v.label.w * 0.22)}
          letterSpacing="1.5" fill="#2C2A22">Svāya</text>
        <line x1={150 - v.label.w * 0.2} y1={v.label.y + v.label.h * 0.56}
          x2={150 + v.label.w * 0.2} y2={v.label.y + v.label.h * 0.56} stroke="#C9A86A" strokeWidth="1.2" />
        <text x="150" y={v.label.y + v.label.h * 0.78} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={Math.min(7.5, v.label.w * 0.072)}
          letterSpacing="1.1" fill="#6B6450">{labelLine.slice(0, 22)}</text>
      </g>

      {/* edge highlights */}
      <rect x={body.x + 6} y={body.y + 12} width="7" height={body.h - 28} rx="3.5" fill="#ffffff" opacity="0.7" />
      <rect x={body.x + body.w - 11} y={body.y + 16} width="4" height={body.h - 34} rx="2" fill={shade(tint, -0.2)} opacity="0.18" />

      {/* moving shimmer, clipped to the glass */}
      <g clipPath={`url(#clip-${id})`}>
        <g transform="skewX(-16)">
          <rect className={reduce ? undefined : 'sv-sheen'} x="-60" y={body.y - 10}
            width="40" height={body.h + 20} fill={`url(#sheen-${id})`} />
        </g>
      </g>

      {/* cap (drawn last, on top of neck) */}
      <g dangerouslySetInnerHTML={{ __html: v.cap(id) }} />
    </motion.svg>
  )
}
