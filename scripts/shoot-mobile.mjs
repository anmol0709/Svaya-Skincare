import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
mkdirSync('/tmp/m', { recursive: true })
const b = await chromium.launch()
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const base = 'http://localhost:4173'
const shots = [
  ['home-top', '/', 0],
  ['shop', '/shop', 0],
  ['product', '/product/kumud-night-balm', 0],
  ['story', '/story', 0],
  ['checkout', '/checkout', 0],
]
for (const [name, path] of shots) {
  await pg.goto(base + path, { waitUntil: 'networkidle' })
  await pg.waitForTimeout(900)
  await pg.screenshot({ path: `/tmp/m/${name}.png` })
  console.log('shot', name)
}
await b.close()
