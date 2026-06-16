// Svaya product catalog. 15 SKUs. Prices in INR.
// vessel drives the BottleVisual shape. tint is the brand-safe liquid color.

export const products = [
  {
    sku: 'SVA-SER-01', slug: 'saffron-radiance-serum', name: 'Saffron Radiance Serum',
    category: 'Serum', concern: 'Radiance', vessel: 'dropper', tint: '#C0822E',
    sizeMl: 30, price: 2450, mrp: 2750, hero: true,
    korean: 'Niacinamide, fermented rice peptides', ayurvedic: 'Kumkumadi saffron, licorice',
    blurb: 'Kumkumadi saffron meets niacinamide. Earned radiance, day after day.',
    description: 'A lightweight golden serum that pairs Korean niacinamide with Ayurveda most revered brightening ritual, kumkumadi saffron. Cultivates a visibly even, luminous tone while reinforcing the moisture barrier.',
    benefits: ['Brightens dullness', 'Evens tone', 'Supports the barrier'],
    skinType: 'All, especially dull or uneven', dosha: 'All, Pitta soothing', step: 'AM and PM, after essence'
  },
  {
    sku: 'SVA-SER-02', slug: 'ferment-renewal-serum', name: 'Ferment Renewal Serum',
    category: 'Serum', concern: 'Firming', vessel: 'dropper', tint: '#9C6B3F',
    sizeMl: 30, price: 2650, mrp: 2950,
    korean: 'Fermented ginseng, peptides', ayurvedic: 'Bakuchiol (babchi), gotu kola',
    blurb: 'Fermented ginseng and bakuchiol. Firmness, restored slowly.',
    description: 'A nightly renewal serum uniting fermented ginseng, a Korean resilience botanical, with bakuchiol, the gentle Ayurvedic rooted retinol alternative from babchi. Cultivates bounce and smooths the look of fine lines without the sting of retinoids.',
    benefits: ['Firms', 'Smooths fine lines', 'Renews overnight'],
    skinType: 'Mature, firming', dosha: 'Vata balancing', step: 'PM, after essence'
  },
  {
    sku: 'SVA-SER-03', slug: 'centella-calm-serum', name: 'Centella Calm Serum',
    category: 'Serum', concern: 'Calm', vessel: 'dropper', tint: '#5E6B4A',
    sizeMl: 30, price: 1950, mrp: 2150,
    korean: 'Centella asiatica (cica), panthenol', ayurvedic: 'Neem, aloe',
    blurb: 'Cica and neem. Quiet relief for reactive skin.',
    description: 'A barrier first serum led by Korean centella (cica) and Ayurvedic neem, with panthenol to restore comfort. Calms visible redness and strengthens skin that flares easily.',
    benefits: ['Calms redness', 'Restores the barrier', 'Soothes'],
    skinType: 'Sensitive, reactive', dosha: 'Pitta pacifying', step: 'AM and PM'
  },
  {
    sku: 'SVA-SER-04', slug: 'ojas-vitamin-c-serum', name: 'Ojas Vitamin C Serum',
    category: 'Serum', concern: 'Brightening', vessel: 'dropper', tint: '#D89A2B',
    sizeMl: 30, price: 2250, mrp: 2500,
    korean: 'Fermented vitamin C derivative', ayurvedic: 'Amla, vetiver',
    blurb: 'Fermented vitamin C and amla. A steadier glow.',
    description: 'A morning brightening serum pairing stabilized fermented vitamin C with amla, Ayurveda vitamin C rich fruit. Builds ojas, that lit from within vitality, while defending against daily dullness.',
    benefits: ['Brightens', 'Antioxidant defense', 'Evens tone'],
    skinType: 'Dull, uneven', dosha: 'All', step: 'AM, before sunscreen'
  },
  {
    sku: 'SVA-MOI-05', slug: 'abhyanga-day-cream', name: 'Abhyanga Day Cream',
    category: 'Moisturizer', concern: 'Hydration', vessel: 'jar', tint: '#C9A86A',
    sizeMl: 50, price: 2150, mrp: 2400,
    korean: 'Signal peptides, squalane', ayurvedic: 'Sandalwood, ashwagandha',
    blurb: 'Peptides and sandalwood. The daily seal of an abhyanga ritual.',
    description: 'A cushioned day cream that translates the warmth of abhyanga self massage into a wearable ritual. Korean peptides for resilience, Ayurvedic sandalwood and ashwagandha for calm, grounded skin.',
    benefits: ['Hydrates', 'Strengthens', 'Grounds'],
    skinType: 'Normal, dry', dosha: 'Vata', step: 'AM, before SPF'
  },
  {
    sku: 'SVA-MOI-06', slug: 'kumud-night-balm', name: 'Kumud Night Balm',
    category: 'Moisturizer', concern: 'Hydration', vessel: 'jar', tint: '#B5654D',
    sizeMl: 50, price: 2350, mrp: 2600,
    korean: 'Fermented rice (sake) extract, ceramides', ayurvedic: 'Saffron, shea, rose',
    blurb: 'Fermented rice and saffron. Replenishment while you rest.',
    description: 'A rich night balm where Korean fermented rice meets Ayurvedic saffron and shea to restore depleted, dry skin overnight. Wake to softness that compounds with each night ritual.',
    benefits: ['Deep replenishment', 'Barrier repair', 'Softening'],
    skinType: 'Dry, depleted', dosha: 'Vata', step: 'PM, final step'
  },
  {
    sku: 'SVA-MOI-07', slug: 'tulsi-gel-moisturizer', name: 'Tulsi Gel Moisturizer',
    category: 'Moisturizer', concern: 'Hydration', vessel: 'jar', tint: '#6E7A55',
    sizeMl: 50, price: 1650, mrp: 1850,
    korean: 'Multi weight hyaluronic, centella', ayurvedic: 'Tulsi, mint',
    blurb: 'Hyaluronic and tulsi. Weightless balance for oily skin.',
    description: 'An oil free gel pairing Korean hyaluronic acid with Ayurvedic tulsi (holy basil) and centella. Hydrates and balances without heaviness, for skin that wants moisture, not shine.',
    benefits: ['Lightweight hydration', 'Balances oil', 'Refreshes'],
    skinType: 'Oily, combination', dosha: 'Kapha', step: 'AM and PM'
  },
  {
    sku: 'SVA-SUN-08', slug: 'suraksha-mineral-sunscreen', name: 'Suraksha Mineral Sunscreen SPF 50',
    category: 'Sunscreen', concern: 'Protection', vessel: 'tube', tint: '#D9A441',
    sizeMl: 50, price: 1450, mrp: 1650,
    korean: 'Niacinamide, ceramide', ayurvedic: 'Turmeric, aloe',
    blurb: 'Mineral SPF 50 with turmeric. Protection, the gentle way.',
    description: 'A one hundred percent mineral (zinc oxide) sunscreen buffered with Korean niacinamide and Ayurvedic turmeric to protect, even tone, and avoid the sting of chemical filters. Broad spectrum SPF 50.',
    benefits: ['UV protection', 'Soothes', 'Subtly brightens'],
    skinType: 'Sensitive, all', dosha: 'Pitta', step: 'AM, last skincare step'
  },
  {
    sku: 'SVA-SUN-09', slug: 'dewdrop-invisible-sunscreen', name: 'Dewdrop Invisible Sunscreen SPF 50 PA++++',
    category: 'Sunscreen', concern: 'Protection', vessel: 'tube', tint: '#8FA39B',
    sizeMl: 50, price: 1550, mrp: 1750,
    korean: 'Advanced fluid UV filters, hyaluronic', ayurvedic: 'Ashwagandha, green tea',
    blurb: 'Invisible Korean fluid SPF 50 PA++++. Dewy, no white cast.',
    description: 'A weightless Korean style fluid sunscreen, SPF 50 PA++++, with ashwagandha to fortify against daily stress. Melts in invisibly to a dewy finish under makeup or alone.',
    benefits: ['High UVA and UVB protection', 'Invisible', 'Dewy finish'],
    skinType: 'All, oily friendly', dosha: 'All', step: 'AM, last step'
  },
  {
    sku: 'SVA-CLE-10', slug: 'rasa-gel-cleanser', name: 'Rasa Gentle Gel Cleanser',
    category: 'Cleanser', concern: 'Calm', vessel: 'tube', tint: '#A8B38C',
    sizeMl: 120, price: 1150, mrp: 1300,
    korean: 'Rice ferment, amino acid surfactants', ayurvedic: 'Neem, aloe',
    blurb: 'Rice ferment and neem. A clean that never strips.',
    description: 'A daily gel cleanser with Korean rice ferment and Ayurvedic neem that lifts impurities while respecting the barrier. Rasa, essence, preserved, not stripped.',
    benefits: ['Gentle cleanse', 'Barrier safe', 'Refreshes'],
    skinType: 'All, daily', dosha: 'All', step: 'AM and PM, first step'
  },
  {
    sku: 'SVA-CLE-11', slug: 'ubtan-cleansing-balm', name: 'Ubtan Cleansing Balm',
    category: 'Cleanser', concern: 'Hydration', vessel: 'jar', tint: '#B98A3E',
    sizeMl: 90, price: 1350, mrp: 1500,
    korean: 'Camellia (tsubaki) oil, fermented oils', ayurvedic: 'Saffron, sandalwood, chickpea',
    blurb: 'Saffron ubtan and camellia oil. A melting first cleanse.',
    description: 'A balm to oil first cleanse inspired by the Ayurvedic ubtan ritual, saffron, sandalwood and chickpea, carried in Korean camellia oil. Melts away sunscreen and makeup, leaving skin cushioned.',
    benefits: ['Dissolves makeup and SPF', 'Nourishes', 'Softens'],
    skinType: 'Dry, makeup wearers', dosha: 'Vata', step: 'PM, first cleanse'
  },
  {
    sku: 'SVA-ESS-12', slug: 'first-ritual-ferment-essence', name: 'First Ritual Ferment Essence',
    category: 'Essence', concern: 'Radiance', vessel: 'tall', tint: '#C58A7A',
    sizeMl: 150, price: 1850, mrp: 2100,
    korean: 'Galactomyces ferment filtrate', ayurvedic: 'Rose, vetiver',
    blurb: 'Galactomyces ferment and rose. The first step that primes radiance.',
    description: 'A hydrating ferment essence (Korean galactomyces) infused with Ayurvedic rose, the first ritual that preps skin to receive everything after. Boosts glow and absorption.',
    benefits: ['Hydrates', 'Primes', 'Boosts radiance'],
    skinType: 'All, dull', dosha: 'All', step: 'AM and PM, after cleanse, before serum'
  },
  {
    sku: 'SVA-OIL-13', slug: 'kumkumadi-facial-oil', name: 'Kumkumadi Facial Oil',
    category: 'Face Oil', concern: 'Radiance', vessel: 'dropper', tint: '#B5792A',
    sizeMl: 30, price: 2950, mrp: 3300,
    korean: 'Camellia oil, squalane', ayurvedic: 'Kumkumadi saffron blend, sandalwood',
    blurb: 'Kumkumadi saffron and camellia. The heritage glow oil, refined.',
    description: 'Svaya most precious ritual, a true kumkumadi saffron oil, the ancient Ayurvedic glow elixir, refined with Korean camellia for a modern, non greasy finish. A few drops at night for cumulative luminosity.',
    benefits: ['Deep nourishment', 'Radiance', 'Suppleness'],
    skinType: 'Dry, mature', dosha: 'Vata', step: 'PM, after serum or final step'
  },
  {
    sku: 'SVA-MSK-14', slug: 'marisa-overnight-mask', name: 'Marisa Overnight Mask',
    category: 'Mask', concern: 'Hydration', vessel: 'jar', tint: '#C99A4E',
    sizeMl: 60, price: 1750, mrp: 1950,
    korean: 'Fermented honey, niacinamide', ayurvedic: 'Turmeric, manjishtha',
    blurb: 'Fermented honey and turmeric. Wake to replenished skin.',
    description: 'A leave on overnight mask with Korean fermented honey and Ayurvedic turmeric and niacinamide, used two to three nights a week to flood dehydrated skin with moisture and quiet glow.',
    benefits: ['Overnight hydration', 'Radiance', 'Soothing'],
    skinType: 'All, dehydrated', dosha: 'All', step: 'PM, two to three times a week, final step'
  },
  {
    sku: 'SVA-EYE-15', slug: 'drishti-eye-renewal-cream', name: 'Drishti Eye Renewal Cream',
    category: 'Eye Care', concern: 'Brightening', vessel: 'jarSmall', tint: '#9A7B53',
    sizeMl: 15, price: 1650, mrp: 1850,
    korean: 'Fermented ginseng, caffeine, peptides', ayurvedic: 'Saffron, almond',
    blurb: 'Ginseng, caffeine and saffron. Brighter, more rested eyes.',
    description: 'A targeted eye cream uniting Korean fermented ginseng, caffeine and peptides with Ayurvedic saffron to de puff, brighten dark circles, and smooth the look of fine lines around the eye.',
    benefits: ['Brightens circles', 'De puffs', 'Smooths'],
    skinType: 'All, fatigue', dosha: 'All', step: 'AM and PM, before moisturizer'
  }
]

export const categories = ['All', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser', 'Essence', 'Face Oil', 'Mask', 'Eye Care']

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const formatINR = (n) => '₹' + n.toLocaleString('en-IN')
