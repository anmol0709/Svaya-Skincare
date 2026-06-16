Product visuals are now rendered by src/components/ProductRender.jsx — a studio-lit,
animated vector render (refracted glass, moving specular shimmer, tinted liquid, brushed
-gold cap) driven by each SKU's vessel + tint. No binary assets are required.

To override a single product with a photoreal Higgsfield render:
  1. Drop the export here as <slug>.jpg
  2. Set `photo: true` on that product in src/data/products.js
ProductImage will then use the photo and fall back to the animated render if it 404s.
