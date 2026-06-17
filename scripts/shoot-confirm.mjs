import { chromium } from 'playwright'
const b = await chromium.launch()
const pg = await b.newPage({ viewport: { width: 900, height: 800 } })
await pg.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await pg.evaluate(() => sessionStorage.setItem('svaya_last_order', JSON.stringify({
  orderId: 'order_TEST123', total: 2450, name: 'Aanya Sharma',
  items: [{ name: 'Saffron Radiance Serum', qty: 1, lineTotal: 2450 }]
})))
await pg.goto('http://localhost:5173/confirmation', { waitUntil: 'networkidle' })
await pg.waitForTimeout(600)
await pg.screenshot({ path: '/tmp/confirm.png' })
console.log('shot'); await b.close()
