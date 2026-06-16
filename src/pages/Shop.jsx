import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { products, categories } from '../data/products.js'

export default function Shop() {
  const [active, setActive] = useState('All')
  const list = active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <section className="section">
      <div className="container">
        <div className="center" style={{ maxWidth: 560, margin: '0 auto 36px' }}>
          <span className="eyebrow">The Collection</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', margin: '12px 0 10px' }}>Shop Svaya</h1>
          <p className="muted">Fifteen formulations, each marrying a Korean ferment to an Ayurvedic ritual. All prices in INR.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          {categories.map((c) => (
            <button key={c} className={`pill ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>{c}</button>
          ))}
        </div>

        <div className="grid grid--products">
          {list.map((p) => <ProductCard key={p.sku} product={p} />)}
        </div>
      </div>
    </section>
  )
}
