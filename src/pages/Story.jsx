import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.25, 0, 0, 1] }
}

// Decorative inline graphics keep the page asset free and on palette.
function ArcGraphic() {
  return (
    <svg viewBox="0 0 200 120" width="200" height="120" aria-hidden="true">
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#C0822E" strokeWidth="2" />
      <path d="M40 100 A60 60 0 0 1 160 100" fill="none" stroke="#C9A86A" strokeWidth="1.4" opacity="0.7" />
      <circle cx="100" cy="26" r="6" fill="#E0A126" />
    </svg>
  )
}
function LeafGraphic() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
      <path d="M60 16 C90 40 90 80 60 104 C30 80 30 40 60 16 Z" fill="none" stroke="#2E3326" strokeWidth="2" />
      <path d="M60 22 L60 100" stroke="#2E3326" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="3" fill="#C0822E" />
    </svg>
  )
}

export default function Story() {
  return (
    <>
      {/* Intro */}
      <section className="section center">
        <div className="container">
          <motion.div {...fade} style={{ maxWidth: 680, margin: '0 auto' }}>
            <span className="eyebrow">Our Story</span>
            <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', margin: '14px 0 8px' }}>Sv&#257;ya</h1>
            <p className="muted" style={{ fontSize: '1.05rem' }}>
              From the Sanskrit root meaning <i>self</i>, <i>belonging to oneself</i>. A name for skincare
              practiced as a daily return to who you are.
            </p>
            <div style={{ marginTop: 28 }}><ArcGraphic /></div>
          </motion.div>
        </div>
      </section>

      {/* Meaning */}
      <section className="section" style={{ background: 'var(--sv-ivory-deep)' }}>
        <div className="container" style={grid2}>
          <motion.div {...fade}>
            <span className="eyebrow">The Meaning</span>
            <h2 style={h2}>Skincare as belonging, not vanity</h2>
            <p className="muted">
              Svaya was built on a single idea. The care you give your skin is care you give yourself.
              Not a chase for an overnight result, but a slow, deliberate practice that compounds. We hold
              two beliefs at the center. Roots matter, and care compounds.
            </p>
          </motion.div>
          <motion.div {...fade} className="center"><LeafGraphic /></motion.div>
        </div>
      </section>

      {/* History / heritage */}
      <section className="section">
        <div className="container">
          <motion.div {...fade} className="center" style={{ maxWidth: 560, margin: '0 auto 48px' }}>
            <span className="eyebrow">The Heritage</span>
            <h2 style={h2}>Two traditions, one ritual</h2>
            <p className="muted">An East-meets-East practice, drawn from two of the world oldest living approaches to skin.</p>
          </motion.div>
          <div className="container" style={grid2}>
            <motion.div {...fade} style={card}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Korean fermentation</h3>
              <p className="muted">
                Fermentation breaks botanicals into smaller, more bioavailable molecules. Ginseng, rice,
                galactomyces and centella, refined by science into actives the skin can truly use.
              </p>
            </motion.div>
            <motion.div {...fade} style={card}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Ayurvedic ritual</h3>
              <p className="muted">
                Kumkumadi saffron, turmeric, sandalwood, neem and ashwagandha. Dosha aware formulations that
                treat skin as part of a whole, tied to sleep, stress and balance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline of the ritual idea */}
      <section className="section" style={{ background: 'var(--sv-neem)', color: 'var(--sv-ivory)' }}>
        <div className="container">
          <motion.div {...fade}>
            <span className="eyebrow" style={{ color: 'var(--sv-marigold)' }}>The Practice</span>
            <h2 style={{ ...h2, color: 'var(--sv-ivory)' }}>How a Svaya ritual unfolds</h2>
          </motion.div>
          <div style={{ marginTop: 32, display: 'grid', gap: 0 }}>
            {[
              ['Cleanse', 'Rasa or Ubtan. Lift the day without stripping the barrier.'],
              ['Prep', 'First Ritual Essence. Galactomyces ferment and rose ready the skin.'],
              ['Treat', 'Saffron Radiance or Ferment Renewal. The active heart of the ritual.'],
              ['Seal', 'Abhyanga, Kumud or Tulsi. Lock in what came before.'],
              ['Protect', 'Suraksha or Dewdrop by day. Kumkumadi oil by night.']
            ].map(([step, desc], i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.6, delay: i * 0.06 }}
                style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, padding: '20px 0', borderTop: '1px solid rgba(246,241,231,0.18)' }}>
                <span style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-marigold)', fontSize: '1.2rem' }}>0{i + 1}</span>
                <div>
                  <div style={{ fontFamily: 'var(--sv-font-display)', fontSize: '1.25rem' }}>{step}</div>
                  <p style={{ color: 'rgba(246,241,231,0.75)', fontSize: '0.92rem' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section center">
        <div className="container">
          <motion.div {...fade}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 20 }}>Earn your radiance, gently.</h2>
            <Link to="/shop" className="btn">Shop the Collection</Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }
const h2 = { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '10px 0 16px' }
const card = { paddingTop: 22, borderTop: '1px solid var(--sv-line)' }
