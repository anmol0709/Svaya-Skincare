# Svāya · Master Image Prompt Pack (text-free, zimage)

The site renders every label/ring/spec line as **crisp SVG** (`InfoRing.jsx`, `ProductCard`).
So **no image needs AI typography** → use the cheap, photoreal model and never fight garbled text.

- **Model:** `zimage` (`quality: "hd"`) ≈ **0.002 pollen (~$0.002)/image**. (Reserve `gptimage-large`
  only if you ever want a standalone hero with real lettering — see `svaya-pollinations.md`.)
- **Each prompt below is self-contained** — paste the whole line; the shared DNA + product
  description is already wrapped in. No prepending needed.
- **One shot per product serves both uses:** the catalog card and the ring center are the same
  text-free bottle. Save the same JPG to **both** paths (see workflow).

---

## Where each file goes (filenames matter — the site loads these exact paths)

| use | path | who reads it |
|---|---|---|
| catalog card | `public/images/<slug>.jpg` | `ProductCard` (shop, featured, PDP) |
| ring center | `public/images/campaign/clean-<slug>.jpg` | `InfoRing` (home "Ritual, Rendered") |
| hero | `public/images/campaign/hero-svaya.jpg` | landing hero |

The home ring currently uses 3 slugs (`saffron-radiance-serum`, `kumkumadi-facial-oil`,
`abhyanga-day-cream`); generating all 15 `clean-` copies future-proofs reusing the ring anywhere.
Missing card shots needed now: everything except the 6 already in `public/images/`.

---

## How to generate (Pollinations MCP)

1. `generateImageUrl` → prompt, `model: "zimage"`, size, `quality: "hd"`, a fixed `seed` per slug
   (so re-runs are reproducible / variants are deliberate).
2. The `gen.pollinations.ai` URL needs auth → append `&key=<POLLINATIONS_API_KEY>` and `curl` to disk.
   (401 = missing key · 402 = top up balance · 1 pollen = $0.001.)
3. Save to **both** `public/images/<slug>.jpg` **and** `public/images/campaign/clean-<slug>.jpg`.

**Sizes (zimage):** portrait product `1024×1280` (4:5, matches card) · hero `1536×1024`.

---

## SHARED STYLE DNA (already baked into every line below — here for reference)

> Studio product photograph for a premium beauty & wellness brand. Single product centered on a
> seamless warm-ivory background hex F6F1E7, soft diffused daylight from the upper-left, one gentle
> grounding shadow, no harsh reflections, **no clutter, no props beyond the named ingredient cue,
> absolutely no text, no labels with writing, no logos, no lettering anywhere.** Brushed-gold cap
> and collar hex C9A86A. Blank warm-ivory label (texture only, no characters). Generous headroom and
> side margin so the bottle floats clear of the frame edges. Editorial, calm, expensive,
> heritage-credible, photoreal, 4:5 portrait.

> **Negative (append mentally):** text, words, letters, typography, watermark, logo, brand name,
> numbers, busy background, multiple bottles, hands, harsh studio glare.

---

## ASSET 0 · Hero — `campaign/hero-svaya.jpg` · 1536×1024

> Studio hero photograph for a premium Ayurveda-meets-Korean beauty brand. A single frosted
> amber-glass dropper serum bottle with a brushed-gold pipette cap and collar, filled with a glowing
> golden saffron serum with a few real saffron threads suspended inside, stands just off-center-right
> on a seamless warm-ivory background hex F6F1E7. Soft diffused daylight from upper-left, one gentle
> grounding shadow, vast calm negative space on the left for a headline. Blank ivory label, no text,
> no logo, no lettering. Editorial, expensive, heritage-credible, photoreal.

---

## PRODUCT SHOTS · save to `images/<slug>.jpg` + `campaign/clean-<slug>.jpg` · 1024×1280

Each line is the complete prompt. Liquid color follows the product's brand tint; ingredient cue is
the single permitted prop.

**1 · saffron-radiance-serum**
> Studio product photograph, single frosted amber-glass dropper serum bottle with brushed-gold
> pipette cap and collar, filled with a glowing golden saffron serum (hex C0822E) with a few real
> saffron threads suspended inside, a small pinch of dried saffron threads resting at the base, three-
> quarter angle, centered on seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one
> gentle shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial,
> expensive, photoreal, 4:5.

**2 · ferment-renewal-serum**
> Studio product photograph, single frosted amber-glass dropper serum bottle, brushed-gold pipette
> cap and collar, filled with a deep amber serum (hex 9C6B3F), a single dried ginseng root beside the
> base, three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one
> gentle shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial,
> photoreal, 4:5.

**3 · centella-calm-serum**
> Studio product photograph, single frosted clear-glass dropper serum bottle, brushed-gold pipette
> cap and collar, filled with a pale green-clear gel serum (hex 5E6B4A tint), one fresh centella (cica)
> leaf beside the base, three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left
> daylight, one gentle shadow, blank ivory label, no text no logo no lettering, generous headroom,
> editorial, photoreal, 4:5.

**4 · ojas-vitamin-c-serum**
> Studio product photograph, single frosted amber-glass dropper serum bottle, brushed-gold pipette
> cap and collar, filled with a pale citrus-gold serum (hex D89A2B), one small fresh amla fruit beside
> the base, three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight,
> one gentle shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial,
> photoreal, 4:5.

**5 · abhyanga-day-cream**
> Studio product photograph, single frosted glass jar with a brushed-gold screw lid, soft beige cream
> (hex C9A86A) visible at the rim, a few sandalwood shavings beside the base, three-quarter angle,
> seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank ivory
> label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**6 · kumud-night-balm**
> Studio product photograph, single frosted glass jar with a brushed-gold screw lid, warm rose-gold
> balm (hex B5654D) at the rim, a few saffron threads and a single rose petal beside the base, three-
> quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle
> shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**7 · tulsi-gel-moisturizer**
> Studio product photograph, single frosted green-tinted glass jar with a brushed-gold screw lid,
> clear green gel (hex 6E7A55 tint) at the rim, a few fresh tulsi (holy basil) leaves beside the base,
> three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle
> shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**8 · suraksha-mineral-sunscreen**
> Studio product photograph, single soft-touch squeeze tube with a brushed-gold flip cap standing
> upright, a small light-cream swatch (hex D9A441 warm tint) at the base, a pinch of turmeric beside
> it, three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one
> gentle shadow, blank ivory tube, no text no logo no lettering, generous headroom, editorial,
> photoreal, 4:5.

**9 · dewdrop-invisible-sunscreen**
> Studio product photograph, single frosted slim squeeze tube with a brushed-gold flip cap standing
> upright, a dewy clear fluid swatch with a single water dewdrop at the base, three-quarter angle,
> seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank ivory
> tube, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**10 · rasa-gel-cleanser**
> Studio product photograph, single tall frosted pump bottle with a brushed-gold pump head, clear gel
> (hex A8B38C tint) visible, a few rice grains and one neem leaf beside the base, three-quarter angle,
> seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank ivory
> label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**11 · ubtan-cleansing-balm**
> Studio product photograph, single frosted glass jar with a brushed-gold screw lid, golden balm (hex
> B98A3E) at the rim, a few saffron threads and sandalwood shavings beside the base, three-quarter
> angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank
> ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**12 · first-ritual-ferment-essence**
> Studio product photograph, single tall slim frosted glass bottle with a brushed-gold cap, watery
> clear essence (hex C58A7A faint tint) inside, a single rose petal beside the base, three-quarter
> angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank
> ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**13 · kumkumadi-facial-oil**
> Studio product photograph, single frosted amber-glass dropper bottle with a brushed-gold pipette
> cap and collar, rich glowing golden oil (hex B5792A) with saffron threads suspended inside, a few
> saffron threads and sandalwood shavings beside the base, three-quarter angle, seamless warm-ivory
> background hex F6F1E7, soft upper-left daylight, one gentle shadow, blank ivory label, no text no
> logo no lettering, generous headroom, editorial, expensive, photoreal, 4:5.

**14 · marisa-overnight-mask**
> Studio product photograph, single frosted glass jar with a brushed-gold screw lid, golden gel-cream
> (hex C99A4E) at the rim, a delicate honey drizzle and a trace of turmeric beside the base, three-
> quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle
> shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

**15 · drishti-eye-renewal-cream**
> Studio product photograph, single small frosted glass jar with a slim brushed-gold lid, light cream
> (hex 9A7B53 warm tint) at the rim, a sliver of ginseng root and one saffron thread beside the base,
> three-quarter angle, seamless warm-ivory background hex F6F1E7, soft upper-left daylight, one gentle
> shadow, blank ivory label, no text no logo no lettering, generous headroom, editorial, photoreal, 4:5.

---

## Quick batch checklist

- [ ] Hero (`hero-svaya.jpg`) — already present; regenerate only if you want a refresh.
- [ ] 15 product shots → save each to **both** `images/<slug>.jpg` and `campaign/clean-<slug>.jpg`.
- [ ] Already on disk (skip unless refreshing): `saffron-radiance-serum`, `ferment-renewal-serum`,
      `centella-calm-serum`, `ojas-vitamin-c-serum`, `abhyanga-day-cream`, `kumud-night-balm` cards;
      `clean-` for saffron / kumkumadi-oil / abhyanga.
- [ ] **Still missing card shots:** tulsi-gel-moisturizer, suraksha-mineral-sunscreen,
      dewdrop-invisible-sunscreen, rasa-gel-cleanser, ubtan-cleansing-balm,
      first-ritual-ferment-essence, kumkumadi-facial-oil, marisa-overnight-mask,
      drishti-eye-renewal-cream.

## Troubleshooting

- **401** → append `&key=<POLLINATIONS_API_KEY>`. **402** → top up balance.
- **A stray label/letters appear** → zimage occasionally invents glyphs; re-roll the `seed`, or keep
  the bottle but mask the label area in code (the SVG ring already covers it on the home page).
- **Bottle clipped by the ring arcs** → re-gen with "generous headroom" emphasized; the InfoRing
  shows the image at 58% height, so extra margin is your friend.
</content>
</invoke>
