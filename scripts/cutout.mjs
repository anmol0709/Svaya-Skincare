#!/usr/bin/env node
// Strip Gemini's fake "transparency" (an opaque grey/white checkerboard, sometimes mixed with real
// alpha) from a hero PNG and emit a true cut-out. Flood-fills from the borders so interior
// highlights are never removed, feathers the matte 1px, auto-crops, optional square pad. No deps.
//   node scripts/cutout.mjs <in.png> <out.png> [--square] [--pad=0.06]
import { readFileSync, writeFileSync } from 'node:fs'
import zlib from 'node:zlib'

const [, , inPath, outPath, ...flags] = process.argv
if (!inPath || !outPath) { console.error('usage: cutout.mjs <in> <out> [--square] [--pad=0.06]'); process.exit(1) }
const square = flags.includes('--square')
const pad = parseFloat((flags.find((f) => f.startsWith('--pad=')) || '--pad=0.06').split('=')[1])

// --- decode ---
const buf = readFileSync(inPath)
let i = 8, idat = [], ih
while (i < buf.length) {
  const len = buf.readUInt32BE(i), type = buf.toString('ascii', i + 4, i + 8), d = buf.slice(i + 8, i + 8 + len)
  if (type === 'IHDR') ih = { w: d.readUInt32BE(0), h: d.readUInt32BE(4), color: d[9] }
  if (type === 'IDAT') idat.push(d); if (type === 'IEND') break; i += 12 + len
}
if (ih.color !== 6) { console.error('need RGBA (colorType 6), got', ih.color); process.exit(1) }
const W = ih.w, H = ih.h, bpp = 4, stride = 1 + W * bpp
const inf = zlib.inflateSync(Buffer.concat(idat))
// un-filter into a flat RGBA buffer
const px = Buffer.alloc(W * H * 4)
for (let y = 0; y < H; y++) {
  const ft = inf[y * stride]
  for (let x = 0; x < W * bpp; x++) {
    const raw = inf[y * stride + 1 + x]
    const a = x >= bpp ? px[y * W * 4 + x - bpp] : 0
    const b = y > 0 ? px[(y - 1) * W * 4 + x] : 0
    const c = x >= bpp && y > 0 ? px[(y - 1) * W * 4 + x - bpp] : 0
    let v
    if (ft === 0) v = raw
    else if (ft === 1) v = raw + a
    else if (ft === 2) v = raw + b
    else if (ft === 3) v = raw + ((a + b) >> 1)
    else { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v = raw + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c) }
    px[y * W * 4 + x] = v & 255
  }
}
const at = (x, y) => (y * W + x) * 4
// background = already transparent, OR a near-neutral light pixel (the grey/white checker)
const isBg = (o) => {
  if (px[o + 3] < 16) return true
  const r = px[o], g = px[o + 1], b = px[o + 2]
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
  return mn > 182 && mx - mn < 16            // light-ish + low-saturation (neutral grey/white checker)
}
// flood fill seeded from the border AND from every already-transparent pixel, so enclosed
// checkerboard pockets (walled off from the border by the subject) also get cleared.
const bgMask = new Uint8Array(W * H)
const stack = []
const push = (x, y) => { if (x >= 0 && x < W && y >= 0 && y < H) { const idx = y * W + x; if (!bgMask[idx] && isBg(at(x, y))) { bgMask[idx] = 1; stack.push(idx) } } }
for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1) }
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y) }
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[at(x, y) + 3] < 16) push(x, y)
while (stack.length) { const idx = stack.pop(), x = idx % W, y = (idx / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1) }
// apply: bg -> alpha 0
for (let k = 0; k < W * H; k++) if (bgMask[k]) px[k * 4 + 3] = 0
// 1px feather: any kept pixel touching a removed one gets softened
const soft = px.slice()
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const o = at(x, y); if (px[o + 3] === 0) continue
  let edge = false
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H || px[at(nx, ny) + 3] === 0) edge = true }
  if (edge) soft[o + 3] = Math.round(px[o + 3] * 0.5)
}
soft.copy(px)
// --- auto-crop to content bbox ---
let x0 = W, y0 = H, x1 = 0, y1 = 0
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[at(x, y) + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
let cw = x1 - x0 + 1, ch = y1 - y0 + 1
let OW = cw, OH = ch, ox = 0, oy = 0
const margin = Math.round(Math.max(cw, ch) * pad)
if (square) { const s = Math.max(cw, ch) + margin * 2; OW = OH = s; ox = ((s - cw) >> 1); oy = ((s - ch) >> 1) }
else { OW = cw + margin * 2; OH = ch + margin * 2; ox = margin; oy = margin }
const out = Buffer.alloc(OW * OH * 4) // zero = transparent
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
  const s = at(x0 + x, y0 + y), d = ((oy + y) * OW + (ox + x)) * 4
  out[d] = px[s]; out[d + 1] = px[s + 1]; out[d + 2] = px[s + 2]; out[d + 3] = px[s + 3]
}
// --- encode ---
const crc = (b) => zlib.crc32(b) >>> 0
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const t = Buffer.from(type, 'ascii'); const c = Buffer.alloc(4); c.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, c]) }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(OW, 0); ihdr.writeUInt32BE(OH, 4); ihdr[8] = 8; ihdr[9] = 6
const rows = Buffer.alloc(OH * (1 + OW * 4))
for (let y = 0; y < OH; y++) { rows[y * (1 + OW * 4)] = 0; out.copy(rows, y * (1 + OW * 4) + 1, y * OW * 4, (y + 1) * OW * 4) }
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
writeFileSync(outPath, png)
console.log(`✓ ${outPath}  ${OW}×${OH}  (cropped from ${W}×${H})`)
