import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Nav() {
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // close the mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand} aria-label="Svaya home">Sv&#257;ya</Link>

        <nav className="sv-nav-links">
          <NavLink to="/" end style={navStyle}>Home</NavLink>
          <NavLink to="/story" style={navStyle}>Our Story</NavLink>
          <NavLink to="/shop" style={navStyle}>Shop</NavLink>
        </nav>

        <div style={styles.right}>
          <button onClick={() => setOpen(true)} style={styles.cartBtn} aria-label="Open cart">
            Cart {count > 0 && <span style={styles.badge}>{count}</span>}
          </button>
          <button
            className="sv-nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span style={{ ...bar, transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none' }} />
            <span style={{ ...bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...bar, transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      <div className="sv-mobile-menu" data-open={menuOpen}>
        <NavLink to="/" end style={mobileLink} onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/story" style={mobileLink} onClick={() => setMenuOpen(false)}>Our Story</NavLink>
        <NavLink to="/shop" style={mobileLink} onClick={() => setMenuOpen(false)}>Shop</NavLink>
      </div>
    </header>
  )
}

const navStyle = ({ isActive }) => ({
  fontSize: '0.78rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: isActive ? 'var(--sv-saffron)' : 'var(--sv-ink)',
  paddingBottom: 2,
  borderBottom: isActive ? '1px solid var(--sv-saffron)' : '1px solid transparent'
})

const mobileLink = ({ isActive }) => ({
  display: 'block', padding: '14px 0', fontSize: '0.92rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: isActive ? 'var(--sv-saffron)' : 'var(--sv-ink)',
  borderBottom: '1px solid var(--sv-line)'
})

const bar = {
  display: 'block', width: 22, height: 2, background: 'var(--sv-ink)', borderRadius: 2,
  transition: 'transform 0.3s var(--sv-ease), opacity 0.2s var(--sv-ease)'
}

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(246,241,231,0.86)', backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--sv-line)'
  },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66, gap: 12 },
  brand: { fontFamily: 'var(--sv-font-display)', fontSize: '1.5rem', letterSpacing: '0.04em' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  cartBtn: {
    background: 'transparent', border: '1px solid var(--sv-line)', borderRadius: 999,
    padding: '8px 18px', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--sv-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
  },
  badge: {
    background: 'var(--sv-saffron)', color: 'var(--sv-on-accent)', borderRadius: 999,
    minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', padding: '0 5px'
  }
}
