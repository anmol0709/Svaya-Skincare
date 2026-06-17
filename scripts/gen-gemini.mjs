#!/usr/bin/env node
// Svaya image generator — Gemini 2.5 Flash Image ("Nano Banana").
// Usage: GEMINI_API_KEY=xxx node scripts/gen-gemini.mjs <manifest.json>
// Manifest: [{ "prompt": "...", "aspectRatio": "4:5", "out": ["public/images/a.jpg", ...] }]
// Writes images straight to disk; never prints base64. Key comes from env only.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const KEY = process.env.GEMINI_API_KEY
if (!KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1) }
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const manifestPath = process.argv[2]
if (!manifestPath) { console.error('Usage: node gen-gemini.mjs <manifest.json>'); process.exit(1) }
const items = JSON.parse(await (await import('node:fs/promises')).readFile(manifestPath, 'utf8'))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function gen(item, attempt = 1) {
  const body = {
    contents: [{ parts: [{ text: item.prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      ...(item.aspectRatio ? { imageConfig: { aspectRatio: item.aspectRatio } } : {})
    }
  }
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const txt = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt <= 4) {
      const wait = 4000 * attempt
      console.warn(`  ${res.status} — retry ${attempt} in ${wait}ms`)
      await sleep(wait)
      return gen(item, attempt + 1)
    }
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 400)}`)
  }
  const json = await res.json()
  const parts = json?.candidates?.[0]?.content?.parts || []
  const img = parts.find((p) => p.inlineData?.data)
  if (!img) throw new Error('No image in response: ' + JSON.stringify(json).slice(0, 400))
  const buf = Buffer.from(img.inlineData.data, 'base64')
  for (const out of item.out) {
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, buf)
    console.log(`  ✓ ${out} (${(buf.length / 1024).toFixed(0)} KB)`)
  }
}

let ok = 0, fail = 0
for (const item of items) {
  const label = item.out[0]
  try {
    console.log(`→ ${label}`)
    await gen(item)
    ok++
    await sleep(1500) // be gentle on rate limits
  } catch (e) {
    console.error(`  ✗ ${label}: ${e.message}`)
    fail++
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`)
