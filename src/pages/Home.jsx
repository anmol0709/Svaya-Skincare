import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollHero from '../components/ScrollHero.jsx'
import ProductCard from '../components/ProductCard.jsx'
import InfoRing from '../components/InfoRing.jsx'
import { products, getProduct } from '../data/products.js'

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.25, 0, 0, 1] }
}

export default function Home() {
  const featured = products.filter((p) => ['SVA-SER-01', 'SVA-OIL-13', 'SVA-SER-04', 'SVA-MOI-06'].includes(p.sku))
  const ringProducts = ['saffron-radiance-serum', 'kumkumadi-facial-oil', 'abhyanga-day-cream'].map(getProduct)
  const values = [
    { t: 'Heritage with Proof', d: 'Ancient wisdom and clinical evidence, never one without the other.' },
    { t: 'Slow Beauty', d: 'Cumulative results over quick fixes. Care compounds.' },
    { t: 'Skin as Health', d: 'Skin tied to sleep, stress and balance. Dosha aware, always.' },
    { t: 'Ingredient Integrity', d: 'Fermented Korean botanicals and traceable Ayurvedic actives.' }
  ]

  return (
    <>
      <ScrollHero />

      <section className="section">
        <div className="container">
          <motion.div {...fadeIn} className="center" style={{ maxWidth: 620, margin: '0 auto' }}>
            <span className="eyebrow">The Svaya Belief</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', margin: '14px 0 16px' }}>
              Radiance is not made overnight. It is earned, gently, day after day.
            </h2>
            <p className="muted">
              Svaya means self, belonging to oneself. We bring together two living traditions, Korean
              fermentation and Indian Ayurveda, into one quiet daily practice.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div {...fadeIn} className="center" style={{ marginBottom: 48 }}>
            <span className="eyebrow">The Ritual, Rendered</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '14px 0 14px' }}>
              Everything you need, around the bottle.
            </h2>
            <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>
              Korean actives, Ayurvedic roots and the ritual itself — held in a single ring of light.
            </p>
          </motion.div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, justifyItems: 'center' }}>
            {ringProducts.map((p, i) => (
              <motion.div key={p.sku} {...fadeIn}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0, 0, 1] }}>
                <Link to={`/product/${p.slug}`} aria-label={p.name}>
                  <InfoRing product={p} size={320} image={`/images/campaign/clean-${p.slug}.png`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--sv-ivory-deep)' }}>
        <div className="container">
          <motion.div {...fadeIn} style={{ marginBottom: 36 }}>
            <span className="eyebrow">The Ritual Edit</span>
            <h2 style={{ fontSize: '2rem', marginTop: 8 }}>Begin with these</h2>
          </motion.div>
          <div className="grid grid--products">
            {featured.map((p) => <ProductCard key={p.sku} product={p} />)}
          </div>
          <div className="center" style={{ marginTop: 40 }}>
            <Link to="/shop" className="btn btn--ghost">Shop All 15</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div {...fadeIn}>
            <span className="eyebrow">Why Svaya</span>
            <h2 style={{ fontSize: '2rem', margin: '8px 0 36px' }}>East meets East</h2>
          </motion.div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {values.map((v, i) => (
              <motion.div key={i} {...fadeIn} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0, 0, 1] }}
                style={{ paddingTop: 20, borderTop: '1px solid var(--sv-line)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{v.t}</h3>
                <p className="muted" style={{ fontSize: '0.9rem' }}>{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section center" style={{ background: 'var(--sv-neem)', color: 'var(--sv-ivory)' }}>
        <div className="container">
          <motion.div {...fadeIn} style={{ maxWidth: 560, margin: '0 auto' }}>
            <span className="eyebrow" style={{ color: 'var(--sv-marigold)' }}>Begin Your Ritual</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', margin: '14px 0 20px', color: 'var(--sv-ivory)' }}>
              A daily return to yourself.
            </h2>
            <Link to="/shop" className="btn">Discover the Collection</Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
