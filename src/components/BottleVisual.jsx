// Renders a brand-consistent product vessel as inline SVG, so the catalog
// needs zero binary image assets and stays deploy light. Shape varies by vessel,
// liquid color by tint.
export default function BottleVisual({ vessel = 'dropper', tint = '#C0822E', size = 220 }) {
  const w = size
  const h = Math.round(size * 1.25)
  const fadeId = `g-${tint.replace('#', '')}-${vessel}`

  const grad = (
    <defs>
      <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
        <stop offset="100%" stopColor={tint} stopOpacity="0.7" />
      </linearGradient>
    </defs>
  )

  const wordmark = (y) => (
    <text x="120" y={y} textAnchor="middle" fontFamily="Georgia, 'Playfair Display', serif"
      fontSize="13" fill="#2C2A22" letterSpacing="1">Svaya</text>
  )

  const shapes = {
    dropper: (
      <>
        <rect x="98" y="22" width="44" height="14" rx="3" fill="#C9A86A" />
        <rect x="110" y="6" width="20" height="20" rx="4" fill="#C9A86A" />
        <rect x="92" y="34" width="56" height="10" rx="3" fill="#E7DCC7" />
        <rect x="84" y="44" width="72" height="180" rx="16" fill="#fff" stroke="#E7DCC7" strokeWidth="2" />
        <rect x="92" y="120" width="56" height="96" rx="12" fill={`url(#${fadeId})`} />
        <rect x="92" y="150" width="56" height="40" rx="8" fill="#F6F1E7" opacity="0.85" />
        {wordmark(176)}
      </>
    ),
    tall: (
      <>
        <rect x="106" y="8" width="28" height="22" rx="4" fill="#C9A86A" />
        <rect x="98" y="28" width="44" height="12" rx="3" fill="#E7DCC7" />
        <rect x="90" y="40" width="60" height="195" rx="14" fill="#fff" stroke="#E7DCC7" strokeWidth="2" />
        <rect x="98" y="130" width="44" height="98" rx="10" fill={`url(#${fadeId})`} />
        <rect x="98" y="150" width="44" height="44" rx="8" fill="#F6F1E7" opacity="0.85" />
        {wordmark(178)}
      </>
    ),
    tube: (
      <>
        <rect x="104" y="8" width="32" height="20" rx="6" fill="#C9A86A" />
        <path d="M82 40 q38 -14 76 0 l-8 196 q-30 8 -60 0 z" fill={`url(#${fadeId})`} stroke="#E7DCC7" strokeWidth="2" />
        <rect x="92" y="120" width="56" height="56" rx="10" fill="#F6F1E7" opacity="0.9" />
        {wordmark(154)}
      </>
    ),
    jar: (
      <>
        <rect x="76" y="48" width="88" height="22" rx="6" fill="#C9A86A" />
        <rect x="72" y="66" width="96" height="120" rx="14" fill="#fff" stroke="#E7DCC7" strokeWidth="2" />
        <rect x="84" y="92" width="72" height="80" rx="10" fill={`url(#${fadeId})`} />
        <rect x="84" y="118" width="72" height="34" rx="8" fill="#F6F1E7" opacity="0.85" />
        {wordmark(142)}
      </>
    ),
    jarSmall: (
      <>
        <rect x="86" y="78" width="68" height="18" rx="5" fill="#C9A86A" />
        <rect x="84" y="92" width="72" height="86" rx="12" fill="#fff" stroke="#E7DCC7" strokeWidth="2" />
        <rect x="94" y="112" width="52" height="56" rx="9" fill={`url(#${fadeId})`} />
        <rect x="94" y="130" width="52" height="24" rx="6" fill="#F6F1E7" opacity="0.85" />
        {wordmark(150)}
      </>
    )
  }

  return (
    <svg width={w} height={h} viewBox="0 0 240 300" role="img" aria-label="Svaya product">
      {grad}
      {shapes[vessel] || shapes.dropper}
    </svg>
  )
}
