# Chronova Watches (frontend-only demo)
Run: `npm install` then `npm run dev`. Build: `npm run build`.
- Products: `src/data/products.js` (images go in `public/images/products/<id>.jpg`; missing images fall back to a placeholder).
- Store name, shipping, coupons, contact: `src/config.js`. Currency formatter: `src/utils/format.js`.
- Payments (COD/Easypaisa/JazzCash) are MOCK only. Replace `placeOrder` in `src/context/Store.jsx` with API calls to your backend/gateway.
- Data persists in localStorage (keys start with `chr_`). Admin is at `/admin` (no auth in this demo).
- Deploy: `npm run build`, upload `dist/` to Netlify/Vercel (add SPA fallback to index.html).
