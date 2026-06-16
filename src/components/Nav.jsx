import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Nav() {
  const { count, setOpen } = useCart()
  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand} aria-label="Svaya home">Sv&#257;ya</Link>
        <nav style={styles.links}>
          <NavLink to="/" end style={navStyle}>Home</NavLink>
          <NavLink to="/story" style={navStyle}>Our Story</NavLink>
          <NavLink to="/shop" style={navStyle}>Shop</NavLink>
        </nav>
        <button onClick={() => setOpen(true)} style={styles.cartBtn} aria-label="Open cart">
          Cart {count > 0 && <span style={styles.badge}>{count}</span>}
        </button>
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

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(246,241,231,0.86)', backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--sv-line)'
  },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 },
  brand: { fontFamily: 'var(--sv-font-display)', fontSize: '1.5rem', letterSpacing: '0.04em' },
  links: { display: 'flex', gap: 28 },
  cartBtn: {
    background: 'transparent', border: '1px solid var(--sv-line)', borderRadius: 999,
    padding: '8px 18px', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--sv-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
  },
  badge: {
    background: 'var(--sv-saffron)', color: 'var(--sv-on-accent)', borderRadius: 999,
    minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', padding: '0 5px'
  }
}
