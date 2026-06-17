# Svāya · Hero "lid sealing" video prompt

Goal: a short clip of the **brushed-gold Svāya lid lowering and twisting (screwing) onto the open
Kumud Night Balm jar**, to **frame-scrub on scroll** in the hero (replaces the vector medallion seat).

## Must-haves for it to scrub cleanly
- **Locked-off (static) camera.** No pan/zoom/cuts — one continuous motion start→end.
- **Single linear action:** lid enters from top → descends → rotates clockwise as it seats → settles. No re-frames.
- **Seamless warm-ivory background `#F6F1E7`** (NOT transparent — video alpha is unreliable; ivory matches the hero stage so it composites invisibly).
- **Jar centred, same size start→end.** Generous margin so nothing clips.
- **~4–6 s, 24–30 fps, ≥1080p, square 1:1 or 4:5 portrait.**

## Recommended: image-to-video (best product consistency)
First frame = `public/images/campaign/hero-kumud-open.png` (the open jar). Motion prompt:

> Cinematic luxury skincare product shot, locked static camera. A round brushed-gold jar lid —
> engraved with the Svāya emblem (a thin ring, a small dot at the top, an elegant serif letter "S") —
> descends slowly from above and rotates clockwise as it screws onto the open frosted-glass Kumud
> Night Balm jar, seating with a gentle weighted settle until sealed. Soft diffused daylight from the
> upper-left, one gentle grounding shadow, seamless warm-ivory background. Slow, calm, expensive,
> photoreal. The lid locks upright with the emblem centred; hold on the finished sealed jar at the end.
> No hands, no other objects, no text or captions, no camera movement.

## Text-to-video fallback (if no image-to-video)
> Award-winning luxury skincare commercial, locked static camera, photoreal. A frosted-glass Svāya
> Kumud Night Balm jar with warm rose-gold balm sits centred on a seamless warm-ivory background
> (#F6F1E7), soft daylight from upper-left, one gentle shadow. A round brushed-gold lid engraved with
> the Svāya emblem (thin ring + dot at top + serif "S") lowers from the top of frame and rotates
> clockwise, screwing onto the jar and settling until sealed. Slow, weighted, premium motion; ends
> holding on the sealed jar. No hands, no text, no camera movement, no extra objects.

**Negative / avoid:** camera movement, zoom, hands, fingers, multiple jars, text or captions,
watermark, logos other than the engraved emblem, busy or non-ivory background, fast or jittery motion.

## After you generate it
Drop the file at `public/hero-seal.mp4` and tell me. I'll extract frames and wire a scroll-driven
frame-scrub (canvas) at the payoff, so the lid seals in perfect sync with scroll — and it degrades to
the final sealed frame under reduced-motion.
