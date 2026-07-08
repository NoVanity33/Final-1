NO VANITY 33 - STRIPE CHECKOUT V1

Built using:
- prices (2).csv

WHAT THIS ADDS:
- data/products.json with Stripe Price IDs
- js/app.js with Secure Checkout button
- functions/api/create-checkout-session.js
- functions/api/health.js
- success.html
- cancel.html

INSTALL:
1. Extract this ZIP.
2. Copy these into Final-1:
   - data/products.json
   - js/app.js
   - functions folder
   - success.html
   - cancel.html
3. Commit:
   Stripe checkout v1
4. Push origin.
5. In Cloudflare Pages:
   Project > Settings > Environment variables
6. Add:
   STRIPE_SECRET_KEY = your Stripe LIVE secret key
   SITE_URL = https://novanity33.com
7. Redeploy.
8. Test this URL:
   https://novanity33.com/api/health
   It should say ok true.
9. Add a product to cart and click Secure Checkout.

SECURITY:
Never put your Stripe secret key in GitHub, products.json, app.js, or HTML.
Only put it in Cloudflare Pages environment variables.

MATCHED PRODUCTS:
- Crown 33 Tee => Crown 33 Tee
- Crown 33 Sweatpants - Black => Logo Sweats In Black
- Prayer Cross Tee => Praying Tee
- Crimson Worm Tee => Crimson Worm Brand Launch Tee
- YAHWEH Tee => Yahweh Tee
- Armor of God Tee => AOG Tee
- Lamb of God Tee => Lamb Of God Tee
- Parting the Sea Tee => Parting the Sea
- The Living Word Tee => psalms Tee
- Burning Bush Tee => Burning bush Tee
- Crown 33 Sweatpants - Tan => Logo Sweats In Tan
- Crown 33 Sweatpants - Charcoal => Sweat Pants Charcoal
- Crown 33 Basketball Shorts - Black => Logo Shorts Black
- Crown 33 Basketball Shorts - Red => Logo Shorts Red
- Crown 33 Basketball Shorts - White => Logo Shorts White
- Cross Socks - Black / Red => NV33 socks Black and Red
- Cross Socks - Olive => NV33 Olive
- Cross Socks - Carolina Blue => Blue NV33 Socks
- 40oz Scripture Bottle => NV33 Water Bottle
- No Vanity 33 Duffle Bag => NV33 Duffle Bag

MISSING STRIPE PRICE IDS:
- Lion of Judah Hoodie
- Cross Socks - Black
- Lion of Judah Tee
- Cross Socks - Gray
- Scripture Wristband
- Daily Walk Bible Kit

SUBSCRIPTION WARNINGS:
- None
