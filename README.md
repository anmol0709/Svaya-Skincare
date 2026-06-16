# Svaya Storefront

A deploy-light e-commerce site for Svaya. Korean fermentation science married to Ayurvedic ritual.
Vite + React frontend, a small Express server for Razorpay test-mode payments. One Node process
serves both the API and the built site.

## Features
- Scroll-driven hero on the home page (the Saffron Radiance Serum deconstructs into its ingredients).
- Brand story page (meaning, heritage, the ritual).
- Catalog of 15 products with category filter, each with brand-rendered visuals (no binary assets).
- Cart with localStorage persistence and a slide-in drawer.
- Checkout with shipping form and end-to-end Razorpay test payment, then an order confirmation.
- Mock payment fallback so the full flow works before you add any keys.

## Run locally (development)
Two terminals:

```bash
npm install
npm run server      # terminal 1: API on http://localhost:5174
npm run dev         # terminal 2: site on http://localhost:5173 (proxies /api to the server)
```

Open http://localhost:5173

Without Razorpay keys the server runs in MOCK mode: the checkout simulates a successful payment so
you can test the whole flow. To use real test payments, copy `.env.example` to `.env` and add your
TEST keys from the Razorpay dashboard (Settings > API Keys):

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

Restart `npm run server`. Use Razorpay test card 4111 1111 1111 1111, any future expiry, any CVV.

## Build and serve (single process, simplest deploy)
```bash
npm install
npm run build       # outputs dist/
npm start           # serves dist/ AND the API on http://localhost:5174
```

## Deploy
Any Node host (Render, Railway, Fly, a VPS) works with `npm install && npm run build && npm start`.
Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `PORT` as environment variables. For a static-only
host (Netlify, Vercel, GitHub Pages) deploy `dist/` and move `server/index.js` to a serverless function.

## Validate before a real launch
Prices, GST/HSN, INCI lists, SPF/PA testing, and all ferment and provenance claims need sign-off.
See `../Svaya_Product_Catalog.md` and `../Svaya_BrandKit.md`.
