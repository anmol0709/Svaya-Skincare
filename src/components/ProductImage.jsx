import { useState } from 'react'
import ProductRender from './ProductRender.jsx'

// Product visual resolver.
//   1. /images/<slug>.jpg  - photoreal studio render (Z-Image / Higgsfield export).
//                            Tried first for every SKU; drop a file in to light it up.
//   2. <ProductRender>     - studio-lit animated vector render, used until a photo exists
//                            or if the photo 404s.
// The photo sits inside a fixed 7:9 frame (matching the generated assets) so every card
// and grid cell lines up edge to edge - no gaps, no overlaps, no layout shift.
//
// fill=true  -> frame spans 100% of its parent's width (used in product cards / detail).
// fill=false -> frame is `size` px wide (used where an explicit width is needed).
export default function ProductImage({ product, size = 180, float = true, fill = false }) {
  const [usePhoto, setUsePhoto] = useState(true)

  if (usePhoto) {
    const frame = fill
      ? { width: '100%', aspectRatio: '7 / 9' }
      : { width: size, height: Math.round(size * (9 / 7)), maxWidth: '100%' }
    return (
      <div style={{ ...frame, overflow: 'hidden', background: 'var(--sv-ivory)', display: 'block' }}>
        <img
          src={`/images/${product.slug}.jpg`}
          alt={product.name}
          loading="lazy"
          onError={() => setUsePhoto(false)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  // Vector fallback, centered in a matching frame so the grid never shifts.
  const frame = fill
    ? { width: '100%', aspectRatio: '7 / 9' }
    : { width: size, height: Math.round(size * (9 / 7)), maxWidth: '100%' }
  return (
    <div style={{ ...frame, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ProductRender product={product} size={fill ? size : Math.round(size * 0.82)} float={float} />
    </div>
  )
}
