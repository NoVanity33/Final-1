NO VANITY 33 — URGENT STRIPE ORDER DETAILS FIX

WHAT THIS FIX DOES
1. Stripe now shows the product name, COLOR and SIZE directly in each line item.
2. Stripe Payments receives a readable order description and metadata.
3. Every checkout receives an NV33 order number.
4. Existing Stripe webhook logic remains included and creates a Printful DRAFT only after Stripe reports the payment as paid.

FILES TO REPLACE IN GITHUB
Replace these files in your existing functions/api folder:
- create-checkout-session.js
- stripe-webhook.js
- _printful.js

IMPORTANT
- Do not replace your product images, products.json, app.js or checkout page with this ZIP.
- This is a small backend patch only.
- Cloudflare must still have these environment variables:
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  PRINTFUL_API_KEY
  PRINTFUL_STORE_ID (optional if auto-detection works)
  SITE_URL

AFTER DEPLOYMENT
Run one real or test checkout and then open Stripe > Payments > payment.
You should see a description similar to:
No Vanity 33 NV33-...: Crown 33 Tee (Black, XL) x1

Open the Checkout Session / line items and you should see:
Crown 33 Tee — Black • XL
Color: Black | Size: XL | NV33 Order: NV33-...

PRINTFUL
The existing webhook creates the matching Printful order with confirm=false after successful payment. That means the order appears as a draft for review instead of being charged/fulfilled immediately.
