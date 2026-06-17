import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatINR } from '../data/products.js'

const SHIPPING_FREE_OVER = 1499
const SHIPPING_FEE = 79

export default function Checkout() {
  const { detailed, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const shipping = subtotal >= SHIPPING_FREE_OVER || subtotal === 0 ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const valid = form.name && form.email && form.phone.length >= 10 && form.address && form.city && form.state && form.pincode.length >= 6

  const handlePay = async () => {
    setError('')
    if (!valid) { setError('Please complete all fields before paying.'); return }
    setPaying(true)
    try {
      // 1. Create an order on the server (Razorpay test mode, or mock if no keys).
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, customer: form, items: detailed.map((i) => ({ sku: i.sku, qty: i.qty })) })
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error || 'Could not create order')

      // 2. Mock mode: no real Razorpay keys configured. Simulate success.
      if (order.mock || !window.Razorpay) {
        await fetch('/api/verify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ razorpay_order_id: order.id, mock: true })
        })
        finish(order.id)
        return
      }

      // 3. Real Razorpay test checkout.
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: 'INR',
        name: 'Svaya',
        description: 'East-meets-East skincare',
        order_id: order.id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#C0822E' },
        handler: async (response) => {
          const v = await fetch('/api/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          })
          const result = await v.json()
          if (result.verified) finish(order.id)
          else { setError('Payment could not be verified.'); setPaying(false) }
        },
        modal: { ondismiss: () => setPaying(false) }
      })
      rzp.on('payment.failed', () => { setError('Payment failed. Please try again.'); setPaying(false) })
      rzp.open()
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setPaying(false)
    }
  }

  const finish = (orderId) => {
    const summary = { orderId, total, items: detailed.map((i) => ({ name: i.name, qty: i.qty, lineTotal: i.lineTotal })), name: form.name }
    sessionStorage.setItem('svaya_last_order', JSON.stringify(summary))
    clear()
    navigate('/confirmation')
  }

  if (detailed.length === 0) {
    return (
      <section className="section center">
        <div className="container">
          <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Your cart is empty</h1>
          <p className="muted" style={{ marginBottom: 20 }}>Add a ritual to begin.</p>
          <Link to="/shop" className="btn">Explore the Ritual</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Checkout</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', margin: '8px 0 32px' }}>Complete your ritual</h1>

        <div style={layout}>
          {/* form */}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Shipping details</h3>
            <div className="field"><label>Full name</label><input name="name" value={form.name} onChange={onChange} placeholder="Aanya Sharma" /></div>
            <div style={two}>
              <div className="field"><label>Email</label><input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@email.com" /></div>
              <div className="field"><label>Phone</label><input name="phone" value={form.phone} onChange={onChange} placeholder="10 digit mobile" /></div>
            </div>
            <div className="field"><label>Address</label><textarea name="address" rows="2" value={form.address} onChange={onChange} placeholder="Flat, street, area" /></div>
            <div style={three}>
              <div className="field"><label>City</label><input name="city" value={form.city} onChange={onChange} /></div>
              <div className="field"><label>State</label><input name="state" value={form.state} onChange={onChange} /></div>
              <div className="field"><label>Pincode</label><input name="pincode" value={form.pincode} onChange={onChange} /></div>
            </div>
            {error && <p style={{ color: 'var(--sv-terracotta)', fontSize: '0.85rem', marginTop: 6 }}>{error}</p>}
          </div>

          {/* summary */}
          <aside style={summaryBox}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Order summary</h3>
            {detailed.map((i) => (
              <div key={i.sku} style={lineRow}>
                <span style={{ flex: 1 }}>{i.name} <span className="muted">x{i.qty}</span></span>
                <span>{formatINR(i.lineTotal)}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '14px 0' }} />
            <div style={lineRow}><span style={{ flex: 1 }}>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div style={lineRow}><span style={{ flex: 1 }}>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
            <hr className="divider" style={{ margin: '14px 0' }} />
            <div style={{ ...lineRow, fontSize: '1.15rem', fontWeight: 500 }}><span style={{ flex: 1 }}>Total</span><span>{formatINR(total)}</span></div>
            <button className="btn" style={{ width: '100%', marginTop: 20 }} onClick={handlePay} disabled={paying}>
              {paying ? 'Processing...' : `Pay ${formatINR(total)}`}
            </button>
            <div style={testNote}>
              <div style={{ fontWeight: 600, color: 'var(--sv-ink)', marginBottom: 6 }}>Test mode — no real charge</div>
              <div style={noteRow}><span>Card</span><span style={mono}>5267 3181 8797 5449</span></div>
              <div style={noteRow}><span>Expiry</span><span style={mono}>any future date</span></div>
              <div style={noteRow}><span>CVV</span><span style={mono}>any 3 digits</span></div>
              <div style={noteRow}><span>OTP</span><span style={mono}>1234</span></div>
              <div style={{ marginTop: 8, opacity: 0.8 }}>Use this domestic test card — Visa cards like 4111… are blocked as “international”.</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(260px, 1fr)', gap: 40, alignItems: 'start' }
const two = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
const three = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }
const summaryBox = { background: 'var(--sv-ivory-deep)', border: '1px solid var(--sv-line)', borderRadius: 'var(--sv-radius)', padding: 28, position: 'sticky', top: 90 }
const testNote = { marginTop: 14, padding: '12px 14px', background: 'var(--sv-ivory)', border: '1px dashed var(--sv-line)', borderRadius: 10, fontSize: '0.74rem', color: 'var(--sv-taupe)', lineHeight: 1.5 }
const noteRow = { display: 'flex', justifyContent: 'space-between', gap: 12 }
const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'var(--sv-ink)', letterSpacing: '0.02em' }
const lineRow = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', fontSize: '0.92rem' }
