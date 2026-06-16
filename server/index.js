import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Razorpay from 'razorpay'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const LIVE = Boolean(KEY_ID && KEY_SECRET)

const razorpay = LIVE ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET }) : null

if (!LIVE) {
  console.log('[svaya] No Razorpay keys found. Running in MOCK mode (simulated payments).')
} else {
  console.log('[svaya] Razorpay test mode active.')
}

app.get('/api/health', (_req, res) => res.json({ ok: true, mode: LIVE ? 'razorpay' : 'mock' }))

// Create an order. amount is in INR (rupees); Razorpay expects paise.
app.post('/api/orders', async (req, res) => {
  const { amount } = req.body
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
  const paise = Math.round(amount * 100)

  if (!LIVE) {
    return res.json({ id: 'mock_order_' + crypto.randomBytes(6).toString('hex'), amount: paise, currency: 'INR', mock: true })
  }

  try {
    const order = await razorpay.orders.create({ amount: paise, currency: 'INR', receipt: 'svaya_' + Date.now() })
    res.json({ id: order.id, amount: order.amount, currency: order.currency, keyId: KEY_ID })
  } catch (e) {
    console.error('[svaya] order error', e?.error || e)
    res.status(500).json({ error: 'Could not create order' })
  }
})

// Verify the payment signature returned by Razorpay checkout.
app.post('/api/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body

  if (mock || !LIVE) return res.json({ verified: true, mock: true })

  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  res.json({ verified: expected === razorpay_signature })
})

// Serve the built site in production (single deploy: node server/index.js).
const dist = path.join(__dirname, '..', 'dist')
app.use(express.static(dist))
app.get('*', (req, res) => {
  // Asset-like paths (.jpg, .mp4, etc.) that were not found stay 404 so the
  // frontend image fallback can trigger. Everything else gets the SPA shell.
  if (path.extname(req.path)) return res.status(404).end()
  res.sendFile(path.join(dist, 'index.html'))
})

const PORT = process.env.PORT || 5174
app.listen(PORT, () => console.log(`[svaya] server on http://localhost:${PORT}`))
