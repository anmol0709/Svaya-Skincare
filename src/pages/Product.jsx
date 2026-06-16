import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ProductImage from '../components/ProductImage.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getProduct, products, formatINR } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { add, setOpen } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <section className="section center">
        <div className="container">
          <h2>Product not found</h2>
          <Link to="/shop" className="btn" style={{ marginTop: 16 }}>Back to Shop</Link>
        </div>
      </section>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.sku !== product.sku).slice(0, 3)
  const facts = [
    ['Hero Korean', product.korean],
    ['Hero Ayurvedic', product.ayurvedic],
    ['Skin type', product.skinType],
    ['Dosha', product.dosha],
    ['Ritual step', product.step],
    ['Size', `${product.sizeMl} ml`],
    ['Price', formatINR(product.price)]
  ]

  const buyNow = () => {
    add(product.sku, qty)
    setOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      <section className="section">
        <div className="container" style={layout}>
          <div style={visualWrap}>
            <ProductImage product={product} size={460} fill />
          </div>

          <div>
            <span className="eyebrow">{product.category}{product.hero ? ' . Hero Product' : ''}</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', margin: '10px 0 6px' }}>{product.name}</h1>
            <p className="muted" style={{ fontSize: '1.05rem' }}>{product.blurb}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '20px 0' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 500 }}>{formatINR(product.price)}</span>
              {product.mrp > product.price && (
                <span className="muted" style={{ textDecoration: 'line-through', fontSize: '1rem' }}>{formatINR(product.mrp)}</span>
              )}
            </div>

            <p className="muted" style={{ marginBottom: 24 }}>{product.description}</p>

            <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              {product.benefits.map((b) => (
                <span key={b} style={benefitChip}>{b}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
              <div style={qtyBox}>
                <button style={qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span style={{ minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button style={qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn--ghost" onClick={() => add(product.sku, qty)}>Add to Cart</button>
              <button className="btn" onClick={buyNow}>Buy Now</button>
            </div>

            <table style={table}>
              <tbody>
                {facts.map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid var(--sv-line-soft)' }}>
                    <td style={tdKey}>{k}</td>
                    <td style={tdVal}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--sv-ivory-deep)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.8rem', marginBottom: 28 }}>Complete the ritual</h2>
            <div className="grid grid--products">
              {related.map((p) => <ProductCard key={p.sku} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const layout = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }
const visualWrap = { background: 'var(--sv-ivory-deep)', borderRadius: 'var(--sv-radius)', border: '1px solid var(--sv-line)', overflow: 'hidden', position: 'sticky', top: 90 }
const benefitChip = { fontSize: '0.72rem', letterSpacing: '0.05em', padding: '6px 14px', borderRadius: 999, background: 'var(--sv-sand)', color: 'var(--sv-taupe)' }
const qtyBox = { display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--sv-line)', borderRadius: 999, padding: '6px 12px' }
const qtyBtn = { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--sv-line)', background: '#fff', cursor: 'pointer', fontSize: '1.05rem' }
const table = { width: '100%', marginTop: 32, borderCollapse: 'collapse', borderTop: '1px solid var(--sv-line-soft)' }
const tdKey = { padding: '12px 0', color: 'var(--sv-saffron)', fontSize: '0.82rem', letterSpacing: '0.04em', width: '40%', verticalAlign: 'top' }
const tdVal = { padding: '12px 0', color: 'var(--sv-taupe)', fontSize: '0.9rem' }
