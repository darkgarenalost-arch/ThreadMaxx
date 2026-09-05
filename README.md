# ThreadMaxx

Premium static ecommerce website for ThreadMaxx, built around a minimal black, white and off-white brand system.

## Included

- Editorial homepage with rotating banners
- Category cards, new arrivals, best sellers, reviews and featured campaign sections
- Product listing and product detail pages
- Local cart with mobile-first checkout and preserved cart storage
- COD order flow
- Razorpay Checkout test integration
- Firebase Auth admin login
- Firestore product, order, coupon, banner and settings management
- Firebase Storage uploads for product images, banners, logo and favicon
- Firestore and Storage security rules
- SEO tags, sitemap and robots
- Vercel and Netlify static deploy config

## Start locally

Use any static server from inside this folder:

```bash
python -m http.server 5500
```

If Python is not installed, VS Code Live Server, Netlify Dev, Vercel static preview, or any simple static-file server will work.

Then open:

- Storefront: `http://localhost:5500/`
- Admin: `http://localhost:5500/admin/login.html`

Opening files directly from disk may block JavaScript modules in some browsers, so a static server is recommended.

## Configure

Edit:

- `firebase/firebase-config.js`
- `firebase/firestore.rules`
- `firebase/storage.rules`
- `docs/SETUP.md`

The site has fallback demo data, so it looks complete before Firebase is connected.
