NO VANITY 33 - STRIPE CHECKOUT STARTER

WHAT THIS ADDS:
- data/products.json updated with Stripe Price IDs from prices.csv
- js/app.js updated so cart checkout starts a real Stripe Checkout Session
- functions/api/create-checkout-session.js for Cloudflare Pages Functions
- success.html and cancel.html

INSTALL:
1. Extract this ZIP.
2. Copy these into Final-1:
   - data/products.json
   - js/app.js
   - functions folder
   - success.html
   - cancel.html
3. Commit in GitHub Desktop:
   Add Stripe checkout
4. Push origin.
5. In Cloudflare Pages, open your project settings.
6. Add environment variables:
   STRIPE_SECRET_KEY = your Stripe secret key
   SITE_URL = https://novanity33.com
7. Redeploy.
8. Test the checkout.

VERY IMPORTANT:
Use your LIVE Stripe secret key only in Cloudflare environment variables.
Do NOT paste it into index.html, app.js, products.json, or GitHub.

PRICE ID WARNINGS:
The following Stripe prices appear to be subscriptions because Interval is set:
- Crown 33 Tee: price_1Tr1e3RQ7M5gXs0AWsn5NoAp (month)
- Burning Bush Tee: price_1Tr1hqRQ7M5gXs0AjFGpCWQP (month)

For normal clothing purchases, these should be one-time prices in Stripe, not monthly subscriptions.

PRODUCTS MISSING STRIPE PRICE IDS:
- Lion of Judah Hoodie
- Cross Socks - Black
- Lion of Judah Tee
- Cross Socks - Gray
- Scripture Wristband
- Daily Walk Bible Kit

Missing items can still display on the site, but checkout will warn if a customer adds them.
