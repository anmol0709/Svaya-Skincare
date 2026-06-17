#!/usr/bin/env node
// Builds the Gemini generation manifest from the live product catalog, so on-bottle label
// text (SVAYA + the actives pairing) stays in sync with the InfoRing copy.
//   node scripts/build-manifest.mjs  ->  scripts/svaya-image-manifest.json
import { writeFileSync } from 'node:fs'
import { products } from '../src/data/products.js'

const DNA =
  "Award-winning studio product photograph for Svaya, a premium beauty and wellness brand " +
  "blending Korean fermentation science with Indian Ayurvedic ritual. Single product centered on " +
  "a seamless warm-ivory background, soft diffused daylight from the upper left, one gentle " +
  "grounding shadow, no clutter. Brushed-gold cap and collar. Photoreal, calm, expensive, editorial."

// Per-slug subject: the vessel + liquid + the one permitted ingredient cue.
const SUBJECT = {
  'saffron-radiance-serum': 'a frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a glowing golden saffron serum with a few saffron threads suspended inside, a small pinch of saffron at its base',
  'ferment-renewal-serum': 'a frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a deep amber serum, a single dried ginseng root beside its base',
  'centella-calm-serum': 'a frosted clear-glass dropper serum bottle with a brushed-gold pipette cap, filled with a pale green-tinted clear gel serum, one fresh centella cica leaf beside its base',
  'ojas-vitamin-c-serum': 'a frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a pale citrus-gold serum, one small fresh amla fruit beside its base',
  'abhyanga-day-cream': 'a frosted glass jar with a round brushed-gold screw lid, holding a soft beige cream, a few sandalwood shavings beside its base',
  'kumud-night-balm': 'a frosted glass jar with a round brushed-gold screw lid, holding a warm rose-gold balm, a few saffron threads and a single rose petal beside its base',
  'tulsi-gel-moisturizer': 'a frosted green-tinted glass jar with a round brushed-gold screw lid, holding a clear green gel, a few fresh tulsi holy basil leaves beside its base',
  'suraksha-mineral-sunscreen': 'a soft-touch squeeze tube standing upright with a brushed-gold flip cap, a small warm light-cream swatch and a pinch of turmeric at its base',
  'dewdrop-invisible-sunscreen': 'a frosted slim squeeze tube standing upright with a brushed-gold flip cap, a dewy clear fluid swatch with a single water dewdrop at its base',
  'rasa-gel-cleanser': 'a tall frosted pump bottle with a brushed-gold pump head, holding a clear pale-green gel, a few rice grains and one neem leaf beside its base',
  'ubtan-cleansing-balm': 'a frosted glass jar with a round brushed-gold screw lid, holding a golden balm, a few saffron threads and sandalwood shavings beside its base',
  'first-ritual-ferment-essence': 'a tall slim frosted glass bottle with a brushed-gold cap, holding a watery clear essence with a faint rose tint, a single rose petal beside its base',
  'kumkumadi-facial-oil': 'a frosted amber-glass dropper bottle with a brushed-gold pipette cap, holding a rich glowing golden oil with saffron threads suspended inside, saffron threads and sandalwood shavings beside its base, looking especially precious',
  'marisa-overnight-mask': 'a frosted glass jar with a round brushed-gold screw lid, holding a golden gel-cream, a delicate honey drizzle and a trace of turmeric beside its base',
  'drishti-eye-renewal-cream': 'a small frosted glass jar with a slim round brushed-gold lid, holding a light warm cream, a sliver of ginseng root and one saffron thread beside its base'
}

const manifest = []

for (const p of products) {
  const label = (p.actives || '').replace('×', '+').toUpperCase() // e.g. "NIACINAMIDE + KUMKUMADI"
  manifest.push({
    aspectRatio: '4:5',
    out: [`public/images/${p.slug}.jpg`, `public/images/campaign/clean-${p.slug}.jpg`],
    prompt:
      `${DNA} The subject is ${SUBJECT[p.slug]}, shown at a three-quarter angle. ` +
      `The label is warm ivory and shows three lines stacked and centered: the brand wordmark "Svāya" ` +
      `(spelled S-v-a-y-a, with a small horizontal macron bar over the first letter a) in an elegant thin serif at the top, ` +
      `the product name "${p.name}" in a smaller serif beneath it, ` +
      `and the ingredient line "${label}" in small letter-spaced capitals at the bottom. ` +
      `Keep all label text crisp, correctly spelled and well-spaced. Do not add any other text or logos beyond this label.`
  })
}

// Hero assets for the scroll cap rework (transparent PNGs so they can be layered & animated).
// Hero cap = the Kumud Night Balm jar LID, FLAT top-down on transparent bg. BLANK center: our real
// Svaya emblem (favicon.svg) is overlaid in code so it's pixel-exact and spins/tilts with the lid.
// Flat is required: the descent tilt/screw/seat is done in CSS from this one asset.
manifest.push({
  aspectRatio: '1:1',
  out: ['public/images/campaign/hero-cap.png'],
  prompt:
    `${DNA.replace('Single product centered on a seamless warm-ivory background', 'A single object centered on a fully transparent background')} ` +
    `The object is a round brushed-gold jar lid (the screw lid of the Kumud Night Balm jar) photographed perfectly straight-on from directly above — a flat, top-down view, circular gold top face fully facing the camera, perfectly circular outline. ` +
    `The top face is plain and clean with a subtle concentric brushed-metal texture and a soft specular highlight, leaving the centre empty. ` +
    `Fully transparent background, no drop shadow, even soft light, brushed-gold metal. ` +
    `Leave even margin around the lid so nothing is cropped. Absolutely no engraving, no emblem, no letters, no text, no logo on the lid. Output PNG with transparency.`
})
// The Kumud jar OPEN (no lid) — the surface the cap screws onto. Slight high angle so the round
// mouth reads as an ellipse and the lid visibly seats into it.
manifest.push({
  aspectRatio: '4:5',
  out: ['public/images/campaign/hero-kumud-open.png'],
  prompt:
    `${DNA.replace('Single product centered on a seamless warm-ivory background', 'A single object centered on a fully transparent background')} ` +
    `The object is the Svaya Kumud Night Balm jar WITHOUT its lid — an open frosted-glass jar base only, viewed from slightly above so the round mouth reads as a soft ellipse, revealing a warm rose-gold balm inside and a ring of brushed-gold screw threads at the mouth where the lid seats. ` +
    `The warm-ivory label shows three crisp lines: "Svāya", "Kumud Night Balm", and "RICE FERMENT + SAFFRON". A few saffron threads and a single rose petal rest beside the base. ` +
    `Fully transparent background, soft top-left light, gentle grounding shadow. Keep label text crisp; no other text. Output PNG with transparency.`
})

writeFileSync('scripts/svaya-image-manifest.json', JSON.stringify(manifest, null, 2))
console.log(`Wrote scripts/svaya-image-manifest.json with ${manifest.length} images.`)
