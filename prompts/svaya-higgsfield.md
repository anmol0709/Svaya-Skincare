# Svaya . Higgsfield Image Prompt Pack

> **Superseded for Pollinations.** For legible wrapped-text generation via the Pollinations MCP,
> use [`svaya-pollinations.md`](./svaya-pollinations.md) instead. This Higgsfield pack is kept for
> reference only.

How to use this with Higgsfield (higgsfield.ai):
1. Generate ASSET 0 first (the hero bottle). Keep it.
2. For every product, use ASSET 0 as a reference image in Higgsfield so the bottle shape,
   label and lighting stay consistent across the whole catalog.
3. Export each as JPG, then save into the site at the exact path shown (filename matters):
   `svaya-site/public/images/<slug>.jpg`
4. The site shows the SVG placeholder until the file exists, then switches to your image
   automatically. No code changes needed on your side.

Export settings: 4:5 portrait (e.g. 1024 x 1280), warm-ivory background `#F6F1E7`,
single centered bottle, soft daylight, gentle shadow. Streamlined, no props, no text overlays.

---

## SHARED STYLE DNA (paste at the top of every prompt)

"Studio product photograph for a premium beauty brand. Single product centered on a seamless
warm-ivory background (#F6F1E7). Soft, diffused natural daylight from the upper left, one gentle
grounding shadow, no harsh reflections, no clutter, no props, no text overlays. Frosted or amber
glass with a brushed-gold cap and collar. Minimal warm-ivory label with a thin serif Svaya wordmark.
Editorial, calm, expensive, heritage-credible. Clinical precision, photoreal, 4:5 portrait."

---

## ASSET 0 . Hero bottle (generate first, reuse as reference)
File: `public/images/saffron-radiance-serum.jpg`
"[SHARED STYLE DNA] A frosted amber-glass dropper serum bottle with a brushed-gold pipette cap and
collar, filled with a glowing golden saffron serum, a few real saffron threads suspended inside.
Three-quarter angle. Warm-ivory label reading Svaya in a thin serif."

---

## PRODUCT PROMPTS (one image each)

Format per line: filename . vessel . glass . liquid . hero ingredient cue.
Build each prompt as: [SHARED STYLE DNA] + the line below.

1. `saffron-radiance-serum.jpg` . amber dropper bottle . golden saffron serum . suspended saffron threads.
2. `ferment-renewal-serum.jpg` . amber dropper bottle . deep amber serum . a single ginseng root beside the base.
3. `centella-calm-serum.jpg` . frosted clear dropper bottle . pale green-clear gel serum . one centella (cica) leaf.
4. `ojas-vitamin-c-serum.jpg` . amber dropper bottle . pale citrus-gold serum . a small amla fruit beside the base.
5. `abhyanga-day-cream.jpg` . frosted glass jar with brushed-gold lid . soft beige cream . sandalwood shavings.
6. `kumud-night-balm.jpg` . frosted glass jar with brushed-gold lid . warm rose-gold balm . saffron threads and a rose petal.
7. `tulsi-gel-moisturizer.jpg` . frosted green-tinted jar . clear green gel . tulsi (holy basil) leaves.
8. `suraksha-mineral-sunscreen.jpg` . soft-gold squeeze tube . light cream swatch at base . a pinch of turmeric.
9. `dewdrop-invisible-sunscreen.jpg` . frosted slim tube . dewy clear fluid swatch . a single water dewdrop.
10. `rasa-gel-cleanser.jpg` . tall frosted pump bottle . clear gel . rice grains and a neem leaf.
11. `ubtan-cleansing-balm.jpg` . frosted glass jar with brushed-gold lid . golden balm . saffron and sandalwood.
12. `first-ritual-ferment-essence.jpg` . tall frosted glass bottle . watery clear essence . a rose petal.
13. `kumkumadi-facial-oil.jpg` . amber dropper bottle . rich golden oil . saffron threads and sandalwood.
14. `marisa-overnight-mask.jpg` . frosted glass jar with brushed-gold lid . golden gel-cream . a honey drizzle and turmeric trace.
15. `drishti-eye-renewal-cream.jpg` . small frosted jar with gold accent . light cream . fermented ginseng and a saffron thread.

---

## HERO CAP JOURNEY (optional video upgrade for the landing page)
The landing page already animates a cap descending in code. If you want a photoreal version,
generate this in Higgsfield video, export as `hero.mp4`, and tell me. I will switch the hero to a
frame-scrub (canvas + extracted JPEG frames) like the original 8-step approach.

Video prompt:
"[SHARED STYLE DNA, as a moving scene] A brushed-gold Svaya dropper cap floats high in a warm-ivory
void and slowly descends, rotating gently as if being screwed on, until it seats perfectly onto a
frosted amber serum bottle below. The motion is slow, weighted and cinematic. Once seated, the
camera holds on the finished bottle, still and centered. Pure warm-ivory background throughout, no
environment, no reflections."
Save as `svaya-site/public/hero.mp4`.
