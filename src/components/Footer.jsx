import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div>
          <div style={styles.brand}>Sv&#257;ya</div>
          <p className="muted" style={{ maxWidth: 280, fontSize: '0.85rem', marginTop: 8 }}>
            Korean fermentation science, married to Ayurvedic ritual. Radiance, earned gently, day after day.
          </p>
        </div>
        <div style={styles.col}>
          <span className="eyebrow">Explore</span>
          <Link to="/story" style={styles.link}>Our Story</Link>
          <Link to="/shop" style={styles.link}>Shop All</Link>
          <Link to="/shop" style={styles.link}>Serums</Link>
        </div>
        <div style={styles.col}>
          <span className="eyebrow">Ritual</span>
          <span style={styles.link}>Heritage with Proof</span>
          <span style={styles.link}>Slow Beauty</span>
          <span style={styles.link}>Ingredient Integrity</span>
        </div>
      </div>
      <div className="container" style={styles.base}>
        <span>&copy; {new Date().getFullYear()} Sv&#257;ya. All prices in INR.</span>
        <span>Demo store. Payments run in Razorpay test mode.</span>
      </div>
    </footer>
  )
}

const styles = {
  footer: { borderTop: '1px solid var(--sv-line)', background: 'var(--sv-ivory-deep)', marginTop: 40 },
  inner: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, padding: '56px 24px 32px' },
  brand: { fontFamily: 'var(--sv-font-display)', fontSize: '1.6rem' },
  col: { display: 'flex', flexDirection: 'column', gap: 10 },
  link: { fontSize: '0.85rem', color: 'var(--sv-taupe)' },
  base: {
    display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
    padding: '18px 24px', borderTop: '1px solid var(--sv-line)',
    fontSize: '0.72rem', color: 'var(--sv-dim)', letterSpacing: '0.05em'
  }
}
