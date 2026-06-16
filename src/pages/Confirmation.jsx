import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatINR } from '../data/products.js'

export default function Confirmation() {
  let order = null
  try { order = JSON.parse(sessionStorage.getItem('svaya_last_order')) } catch { order = null }

  return (
    <section className="section center">
      <div className="container" style={{ maxWidth: 560 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: '0 auto 20px' }} aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#C0822E" strokeWidth="2" />
            <path d="M20 33 L29 42 L45 24" fill="none" stroke="#C0822E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="eyebrow">Order Confirmed</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '12px 0 10px' }}>
            {order?.name ? `Thank you, ${order.name.split(' ')[0]}.` : 'Thank you.'}
          </h1>
          <p className="muted">
            Your ritual is on its way. Radiance is not made overnight, it is earned, gently, day after day.
          </p>

          {order && (
            <div style={box}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="muted">Order</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.orderId}</span>
              </div>
              {order.items?.map((i, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem' }}>
                  <span>{i.name} <span className="muted">x{i.qty}</span></span>
                  <span>{formatINR(i.lineTotal)}</span>
                </div>
              ))}
              <hr className="divider" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                <span>Total paid</span><span>{formatINR(order.total)}</span>
              </div>
            </div>
          )}

          <Link to="/shop" className="btn" style={{ marginTop: 28 }}>Continue the Ritual</Link>
        </motion.div>
      </div>
    </section>
  )
}

const box = { background: 'var(--sv-ivory-deep)', border: '1px solid var(--sv-line)', borderRadius: 'var(--sv-radius)', padding: 24, margin: '28px 0 0', textAlign: 'left' }
