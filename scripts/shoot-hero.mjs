// Capture the scroll hero at several progress points so we can eyeball the animation.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const URL = process.env.URL || 'http://localhost:5173/'
const points = (process.env.PTS || '0.06,0.22,0.36,0.5,0.62,0.74,0.9').split(',').map(Number)
mkdirSync('/tmp/hero', { recursive: true })
const b = await chromium.launch()
const pg = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
await pg.goto(URL, { waitUntil: 'networkidle' })
const range = await pg.evaluate(() => {
  const sec = document.querySelector('section'); return sec.offsetHeight - window.innerHeight
})
for (const p of points) {
  await pg.evaluate((y) => window.scrollTo(0, y), Math.round(p * range))
  await pg.waitForTimeout(1100) // let the eased rAF settle
  const f = `/tmp/hero/p${String(Math.round(p * 100)).padStart(2, '0')}.png`
  await pg.screenshot({ path: f })
  console.log('shot', f)
}
await b.close()
