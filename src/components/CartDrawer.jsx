import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { formatINR } from '../data/products.js'
import ProductRender from './ProductRender.jsx'

export default function CartDrawer() {
  const { open, setOpen, detailed, subtotal, setQty, remove, count } = useCart()
  const navigate = useNavigate()

  const goCheckout = () => {
    setOpen(false)
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            style={styles.scrim}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            style={styles.panel}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 0, 0, 1], duration: 0.4 }}
          >
            <div style={styles.head}>
              <span className="eyebrow">Your Ritual ({count})</span>
              <button onClick={() => setOpen(false)} style={styles.close} aria-label="Close cart">&times;</button>
            </div>

            {detailed.length === 0 ? (
              <div style={styles.empty}>
                <p className="muted">Your cart is quiet for now.</p>
                <button className="btn" style={{ marginTop: 16 }} onClick={() => { setOpen(false); navigate('/shop') }}>
                  Explore the Ritual
                </button>
              </div>
            ) : (
              <>
                <div style={styles.list}>
                  {detailed.map((item) => (
                    <div key={item.sku} style={styles.item}>
                      <div style={styles.thumb}>
                        <ProductRender product={item} size={64} float={false} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div className="muted" style={{ fontSize: '0.78rem' }}>{formatINR(item.price)} . {item.sizeMl} ml</div>
                        <div style={styles.qtyRow}>
                          <button style={styles.qtyBtn} onClick={() => setQty(item.sku, item.qty - 1)}>-</button>
                          <span>{item.qty}</span>
                          <button style={styles.qtyBtn} onClick={() => setQty(item.sku, item.qty + 1)}>+</button>
                          <button style={styles.removeBtn} onClick={() => remove(item.sku)}>Remove</button>
                        </div>
                      </div>
                      <div style={{ fontWeight: 500 }}>{formatINR(item.lineTotal)}</div>
                    </div>
                  ))}
                </div>
                <div style={styles.foot}>
                  <div style={styles.subtotal}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 500 }}>{formatINR(subtotal)}</span>
                  </div>
                  <p className="muted" style={{ fontSize: '0.72rem', margin: '6px 0 14px' }}>
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button className="btn" style={{ width: '100%' }} onClick={goCheckout}>Checkout</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

const styles = {
  scrim: { position: 'fixed', inset: 0, background: 'rgba(44,42,34,0.4)', zIndex: 90 },
  panel: {
    position: 'fixed', top: 0, right: 0, height: '100%', width: 'min(420px, 100%)', zIndex: 100,
    background: 'var(--sv-ivory)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(44,42,34,0.12)'
  },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderBottom: '1px solid var(--sv-line)' },
  close: { background: 'none', border: 'none', fontSize: '1.6rem', lineHeight: 1, cursor: 'pointer', color: 'var(--sv-ink)' },
  empty: { padding: 40, textAlign: 'center' },
  list: { flex: 1, overflowY: 'auto', padding: '8px 24px' },
  item: { display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--sv-line)' },
  thumb: { width: 64, height: 80, background: 'var(--sv-ivory-deep)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemName: { fontFamily: 'var(--sv-font-display)', fontSize: '1rem' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 6, border: '1px solid var(--sv-line)', background: '#fff', cursor: 'pointer', fontSize: '1rem' },
  removeBtn: { marginLeft: 6, background: 'none', border: 'none', color: 'var(--sv-dim)', fontSize: '0.72rem', textDecoration: 'underline', cursor: 'pointer' },
  foot: { padding: '20px 24px', borderTop: '1px solid var(--sv-line)' },
  subtotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }
}
