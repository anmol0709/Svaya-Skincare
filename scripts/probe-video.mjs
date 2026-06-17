import { chromium } from 'playwright'
const b = await chromium.launch()
const pg = await b.newPage({ viewport: { width: 700, height: 700 } })
await pg.setContent(`<body style="margin:0;background:#F6F1E7;display:grid;place-items:center;height:100vh">
  <video id="v" src="http://localhost:5173/hero-seal.mp4" muted playsinline preload="auto" style="max-width:90vw;max-height:90vh"></video></body>`)
await pg.waitForFunction(() => { const v = document.getElementById('v'); return v && v.readyState >= 2 && v.duration > 0 })
const meta = await pg.evaluate(() => { const v = document.getElementById('v'); return { w: v.videoWidth, h: v.videoHeight, dur: v.duration } })
console.log('video', JSON.stringify(meta))
for (const f of [0, 0.5, 0.99]) {
  await pg.evaluate((t) => new Promise(r => { const v = document.getElementById('v'); v.onseeked = r; v.currentTime = t * v.duration }), f)
  await pg.waitForTimeout(250)
  await pg.screenshot({ path: `/tmp/vid-${Math.round(f * 100)}.png` })
}
console.log('frames captured')
await b.close()
