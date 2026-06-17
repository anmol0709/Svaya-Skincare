# Svāya · Pollinations Image Prompt Pack (legibility-tuned)

Replaces the Higgsfield pack. Tuned for the **Pollinations MCP** with the hard goal of
**legible text wrapped around the bottle** (the "information ring" effect).

## Why these choices

AI image models garble curved text. Two non-negotiables fix that here:

1. **Model = `gptimage-large` (GPT Image 1.5).** It is the only Pollinations model that renders
   art-directed, legible typography. `flux` / `zimage` are cheaper and prettier but mangle text —
   use them only for text-free shots.
2. **Ruthless text economy.** Max 2–3 short strings per image, each in quotes, with explicit
   hierarchy. Paragraphs = gibberish. A few short arcs read as a premium information ring and stay
   sharp.

> **Cost / balance:** `gptimage-large` at `quality=hd` ≈ **0.057 pollen (~$0.057) per image**.
> `flux` ≈ 0.00175, `zimage` ≈ 0.002. Check balance first; top up if low (1 pollen = $0.001).

---

## How to generate (Pollinations MCP)

**Option A — URL + download (keeps context clean, recommended):**
1. Call `generateImageUrl` with the prompt, `model: "gptimage-large"`, size, `quality: "hd"`.
2. The returned `gen.pollinations.ai` URL needs auth — append `&key=<POLLINATIONS_API_KEY>` and
   `curl` it to disk. (401 = no key, 402 = insufficient balance.)
3. Save to `svaya-site/public/images/campaign/<slug>.jpg`.

**Option B — `generateImage`** returns base64 inline (authenticates server-side, but floods
context — avoid for batches).

**Sizes (gptimage native):** hero/landscape `1536×1024`, product/portrait `1024×1536`, square `1024×1024`.

> Catalog cards in `public/images/*.jpg` are intentionally **text-free**. These wrapped-text
> campaign images live in `public/images/campaign/` so they don't clash with the card design.

---

## SHARED STYLE DNA (prepend to every prompt)

> Award-winning luxury skincare campaign, Behance showcase quality, art-directed commercial product
> photography, photoreal. Warm-ivory seamless background hex F6F1E7, soft diffused daylight from
> upper-left, one gentle grounding shadow, no clutter, no props beyond the named ingredient cue.
> Frosted or amber glass with a brushed-gold cap and collar (hex C9A86A). Minimal warm-ivory label
> with a thin serif wordmark reading exactly "SVAYA". Editorial, calm, expensive, heritage-credible.

## LEGIBILITY / INFORMATION-RING BLOCK (append to every prompt)

> A premium information ring orbits the bottle: short text on curved arcs that follow the
> cylindrical glass in true 3D perspective, each phrase on its own non-overlapping arc, engraved-
> into-the-scene look (not pasted on top), saffron-gold lettering hex C0822E, generous letter-
> spacing, perfectly legible. Negative: blurry text, clipped or overflowing letters, duplicated or
> overlapping letters, gibberish, watermark, extra logos.

**Rules of thumb:** ≤3 quoted strings · ALL-CAPS reads cleaner than mixed case · numbers like
"30 ML" are reliable · put the longest phrase on the gentlest curve · quote every word you want
rendered verbatim.

---

## ASSET 0 · Hero (generate first) — `campaign/hero-svaya.jpg` · 1536×1024

> [SHARED DNA] LEFT: a tall elegant serif wordmark reading exactly "SVAYA" in deep ink-brown hex
> 2C2A22, small macron accent over the A; a circular brushed-gold cap engraved with a tiny svaya
> emblem sits TILTED, balanced on the apex of the letter S, as if about to launch. RIGHT: a frosted
> ivory moisturizer bottle, brushed-gold collar, cap removed and waiting, soft beige cream inside.
> Ring text on separate arcs: "ABHYANGA DAY CREAM" and "50 ML". [LEGIBILITY BLOCK]

---

## PRODUCT PROMPTS · `campaign/<slug>.jpg` · 1024×1536

Build each as: **[SHARED DNA] + vessel/liquid/cue + ring text + [LEGIBILITY BLOCK]**.
Ring text = product name arc + size arc (+ optional one ingredient arc). Keep to ≤3.

| slug | vessel · liquid · cue | ring arcs (quoted verbatim) |
|---|---|---|
| `saffron-radiance-serum` | amber dropper · golden saffron serum · suspended saffron threads | "SAFFRON RADIANCE SERUM" · "KUMKUMADI x NIACINAMIDE" · "30 ML" |
| `ferment-renewal-serum` | amber dropper · deep amber serum · ginseng root at base | "FERMENT RENEWAL SERUM" · "30 ML" |
| `centella-calm-serum` | frosted clear dropper · pale green gel · one cica leaf | "CENTELLA CALM SERUM" · "30 ML" |
| `ojas-vitamin-c-serum` | amber dropper · pale citrus-gold serum · amla fruit at base | "OJAS VITAMIN C SERUM" · "30 ML" |
| `abhyanga-day-cream` | frosted jar, gold lid · soft beige cream · sandalwood shavings | "ABHYANGA DAY CREAM" · "50 ML" |
| `kumud-night-balm` | frosted jar, gold lid · rose-gold balm · saffron threads + rose petal | "KUMUD NIGHT BALM" · "50 ML" |
| `tulsi-gel-moisturizer` | frosted green-tint jar · clear green gel · tulsi leaves | "TULSI GEL MOISTURIZER" · "50 ML" |
| `suraksha-mineral-sunscreen` | soft-gold squeeze tube · light cream swatch · pinch of turmeric | "MINERAL SUNSCREEN" · "SPF 50" |
| `dewdrop-invisible-sunscreen` | frosted slim tube · dewy clear fluid · single dewdrop | "DEWDROP SUNSCREEN" · "SPF 50 PA++++" |
| `rasa-gel-cleanser` | tall frosted pump · clear gel · rice grains + neem leaf | "RASA GEL CLEANSER" · "120 ML" |
| `ubtan-cleansing-balm` | frosted jar, gold lid · golden balm · saffron + sandalwood | "UBTAN CLEANSING BALM" · "90 ML" |
| `first-ritual-ferment-essence` | tall frosted bottle · watery clear essence · rose petal | "FERMENT ESSENCE" · "150 ML" |
| `kumkumadi-facial-oil` | amber dropper · rich golden oil · saffron threads + sandalwood | "KUMKUMADI FACIAL OIL" · "30 ML" |
| `marisa-overnight-mask` | frosted jar, gold lid · golden gel-cream · honey drizzle + turmeric | "MARISA OVERNIGHT MASK" · "60 ML" |
| `drishti-eye-renewal-cream` | small frosted jar, gold accent · light cream · ginseng + saffron thread | "DRISHTI EYE CREAM" · "15 ML" |

---

## Troubleshooting

- **401 Unauthorized** → append `&key=<POLLINATIONS_API_KEY>` to the URL (or use `generateImage`).
- **402 Payment Required** → balance too low for `gptimage-large`; top up or switch to a text-free
  shot on `flux`/`zimage`.
- **Garbled text** → cut to 2 strings, switch to ALL-CAPS, raise `quality` to `hd`, regenerate with
  a new `seed`. If still bad, render the bottle text-free and add the ring as an HTML/SVG overlay.
