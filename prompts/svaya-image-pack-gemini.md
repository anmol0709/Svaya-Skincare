# Svāya · Master Image Prompt Pack — Gemini / Nano Banana

Tuned for **Gemini 2.5 Flash Image ("Nano Banana")** via the API (or the Gemini app / AI Studio).

> **Labels ON the bottle (updated).** Each bottle now carries the **"Svāya" wordmark + a short
> ingredient line** (the Korean × Ayurvedic pairing, e.g. `NIACINAMIDE + KUMKUMADI`). The decorative
> **ring + spec arcs around the bottle stay crisp SVG** (`InfoRing.jsx`) — so the *only* text inside
> the image is the small product label; no marketing copy, numbers, or second logo.

## Automated workflow (one command)

The prompts below are generated into a manifest straight from the live catalog, so the on-bottle
ingredient line always matches the `actives` field / ring copy:

```bash
node scripts/build-manifest.mjs                       # writes scripts/svaya-image-manifest.json (17 imgs)
GEMINI_API_KEY=<key> node scripts/gen-gemini.mjs scripts/svaya-image-manifest.json
```

`gen-gemini.mjs` saves each product shot to **both** `public/images/<slug>.jpg` and
`public/images/campaign/clean-<slug>.jpg`, plus the two hero assets (`hero-cap.png`, `hero-jar.png`).

### How Gemini differs from the Pollinations pack
- **Write in natural sentences,** not comma/hex keyword soup. Gemini follows described *scenes*.
- **Negatives go in plain English** ("Do not include any text, letters, or logos"), not a `negative:` field.
- **No key/curl/seed.** Generate in-app or via API, then **download the JPG** to the paths below.
- **Consistency = reference image.** Make the hero (Asset 0) first, then for every product attach it
  and say *"Match the bottle's glass, gold cap, lighting and ivory background to this reference."*
- **Aspect ratio:** type it in the prompt (Gemini app) — "Use a 4:5 vertical aspect ratio." In the API,
  set `imageConfig.aspectRatio: "4:5"` (hero: "16:9" / `"16:9"`).

---

## Where each file goes (filenames must match exactly — the site loads these paths)

| use | path | read by |
|---|---|---|
| catalog card | `public/images/<slug>.jpg` | `ProductCard` |
| ring center | `public/images/campaign/clean-<slug>.jpg` | `InfoRing` (home) |
| hero | `public/images/campaign/hero-svaya.jpg` | landing hero |

One shot per product serves **both** the card and the ring center — save the same JPG to both paths.

---

## SHARED STYLE DNA (reference — already woven into every prompt below)

> An award-winning studio product photograph for Svāya, a premium beauty and wellness brand that
> blends Korean fermentation science with Indian Ayurvedic ritual. A single product sits centered on a
> seamless warm-ivory backdrop (a soft cream tone). Light is gentle, diffused daylight coming from the
> upper left, casting one soft grounding shadow. The cap and collar are brushed gold. The label is a
> blank warm-ivory paper with subtle texture and Write the BRand name on it** Leave generous empty space
> around the bottle. The mood is calm, editorial, expensive and heritage-credible; fully photoreal.
> **Important: do not render any text, letters, words, numbers, logos or labels with writing anywhere
> in the image.**

---

## ASSET 0 · Hero — make this first, reuse as the reference · `campaign/hero-svaya.jpg`

> An award-winning studio hero photograph for Svāya, a premium beauty brand blending Korean
> fermentation and Indian Ayurveda. A single frosted amber-glass dropper serum bottle with a brushed-
> gold pipette cap and collar stands slightly right of center on a seamless warm-ivory backdrop. Inside
> glows a golden saffron serum with a few real saffron threads suspended in it. Soft diffused daylight
> from the upper left, one gentle grounding shadow, and wide calm empty space on the left side for a
> headline. The label is blank ivory paper with no writing. Photoreal, editorial, expensive. Do not
> render any text, letters, numbers or logos anywhere. Use a 16:9 horizontal aspect ratio.

---

## PRODUCT SHOTS · attach the hero as reference · save to `images/<slug>.jpg` + `campaign/clean-<slug>.jpg`

For each: *"Using the attached image as a style reference, match the glass, brushed-gold cap, lighting
and warm-ivory background. Use a 4:5 vertical aspect ratio. Give the bottle a warm-ivory label with
three centered lines — "Svāya", the product name, and the ingredient pairing — crisp and correctly
spelled, and no other text or logos."* then:

**1 · saffron-radiance-serum**
> A frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a glowing
> golden saffron serum with a few saffron threads suspended inside, a small pinch of dried saffron
> resting at its base, shown at a three-quarter angle on a seamless warm-ivory backdrop with soft
> upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**2 · ferment-renewal-serum**
> A frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a deep amber
> serum, a single dried ginseng root lying beside its base, three-quarter angle on a seamless warm-ivory
> backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**3 · centella-calm-serum**
> A frosted clear-glass dropper serum bottle with a brushed-gold pipette cap, filled with a pale
> green-tinted clear gel serum, one fresh centella (cica) leaf beside its base, three-quarter angle on a
> seamless warm-ivory backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**4 · ojas-vitamin-c-serum**
> A frosted amber-glass dropper serum bottle with a brushed-gold pipette cap, filled with a pale
> citrus-gold serum, one small fresh amla fruit beside its base, three-quarter angle on a seamless
> warm-ivory backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**5 · abhyanga-day-cream**
> A frosted glass jar with a brushed-gold screw lid, holding a soft beige cream visible at the rim, a
> few sandalwood shavings beside its base, three-quarter angle on a seamless warm-ivory backdrop with
> soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**6 · kumud-night-balm**
> A frosted glass jar with a brushed-gold screw lid, holding a warm rose-gold balm at the rim, a few
> saffron threads and a single rose petal beside its base, three-quarter angle on a seamless warm-ivory
> backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**7 · tulsi-gel-moisturizer**
> A frosted green-tinted glass jar with a brushed-gold screw lid, holding a clear green gel at the rim,
> a few fresh tulsi (holy basil) leaves beside its base, three-quarter angle on a seamless warm-ivory
> backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**8 · suraksha-mineral-sunscreen**
> A soft-touch squeeze tube standing upright with a brushed-gold flip cap, a small warm light-cream
> swatch and a pinch of turmeric at its base, three-quarter angle on a seamless warm-ivory backdrop with
> soft upper-left daylight. Warm-ivory tube with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**9 · dewdrop-invisible-sunscreen**
> A frosted slim squeeze tube standing upright with a brushed-gold flip cap, a dewy clear fluid swatch
> with a single water dewdrop at its base, three-quarter angle on a seamless warm-ivory backdrop with
> soft upper-left daylight. Warm-ivory tube with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**10 · rasa-gel-cleanser**
> A tall frosted pump bottle with a brushed-gold pump head, holding a clear pale-green gel, a few rice
> grains and one neem leaf beside its base, three-quarter angle on a seamless warm-ivory backdrop with
> soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**11 · ubtan-cleansing-balm**
> A frosted glass jar with a brushed-gold screw lid, holding a golden balm at the rim, a few saffron
> threads and sandalwood shavings beside its base, three-quarter angle on a seamless warm-ivory backdrop
> with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**12 · first-ritual-ferment-essence**
> A tall slim frosted glass bottle with a brushed-gold cap, holding a watery clear essence with a faint
> rose tint, a single rose petal beside its base, three-quarter angle on a seamless warm-ivory backdrop
> with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**13 · kumkumadi-facial-oil**
> A frosted amber-glass dropper bottle with a brushed-gold pipette cap, holding a rich glowing golden
> oil with saffron threads suspended inside, a few saffron threads and sandalwood shavings beside its
> base, three-quarter angle on a seamless warm-ivory backdrop with soft upper-left daylight. Blank ivory
>  backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.
> Make it look especially precious and luxurious.

**14 · marisa-overnight-mask**
> A frosted glass jar with a brushed-gold screw lid, holding a golden gel-cream at the rim, a delicate
> honey drizzle and a trace of turmeric beside its base, three-quarter angle on a seamless warm-ivory
> backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

**15 · drishti-eye-renewal-cream**
> A small frosted glass jar with a slim brushed-gold lid, holding a light warm cream at the rim, a
> sliver of ginseng root and one saffron thread beside its base, three-quarter angle on a seamless
> warm-ivory backdrop with soft upper-left daylight. Warm-ivory label with three crisp lines: "Svāya", the product name, and its ingredient pairing.

---

## Batch checklist

- [ ] Make the **hero** first and keep it as your reference image.
- [ ] Generate all 15, attaching the hero each time for a consistent bottle/lighting family.
- [ ] Save each shot to **both** `images/<slug>.jpg` and `campaign/clean-<slug>.jpg`.
- [ ] **Still missing card shots:** tulsi-gel-moisturizer, suraksha-mineral-sunscreen,
      dewdrop-invisible-sunscreen, rasa-gel-cleanser, ubtan-cleansing-balm,
      first-ritual-ferment-essence, kumkumadi-facial-oil, marisa-overnight-mask,
      drishti-eye-renewal-cream. (The other 6 + hero already exist.)

## Tips for Gemini specifically

- If a **stray label or letters** sneak in, reply in the same chat: *"Remove all text and writing from
  the label — keep it blank ivory."* Gemini edits the existing image in place.
- For **tighter consistency**, generate two or three bottles in one prompt as a set, then crop — Gemini
  keeps shared style well within a single generation.
- If the **bottle is cropped too tight** for the home ring (it's shown at ~58% height inside the circle),
  say *"zoom out, add more empty space around the product."*
- Downloaded Gemini images are PNG — convert to `.jpg` before saving to the paths above.
</content>
