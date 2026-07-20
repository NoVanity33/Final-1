NO VANITY 33 — VERSION 6 AUTOMATION
====================================

WHAT THIS BUILD ADDS
--------------------
1. Automatic Printful catalog/variant sync through the Printful API.
2. Printful live shipping quotes before Stripe Checkout.
3. Customer-paid shipping added to Stripe Checkout.
4. International address support using two-letter country codes.
5. Stripe webhook fulfillment: successful payments create DRAFT orders in Printful.
6. Draft orders are not automatically charged/confirmed; Luke reviews and confirms them in Printful.
7. Private admin sync page: /admin/printful-sync.html

EXISTING SECRETS USED
---------------------
- STRIPE_SECRET_KEY
- PRINTFUL_API_KEY

NEW CLOUDFLARE VARIABLES REQUIRED
---------------------------------
1. STRIPE_WEBHOOK_SECRET (Secret)
   This begins with whsec_. It comes from the Stripe webhook endpoint you create.

2. ADMIN_SYNC_TOKEN (Secret)
   Create your own long random password. It protects /api/printful-catalog.

RECOMMENDED OPTIONAL VARIABLES
------------------------------
3. PRINTFUL_STORE_ID (Plain text)
   Recommended if your Printful token can access multiple stores. If your token is store-level and only sees one store, it may work without this.

4. SITE_URL (Plain text)
   https://novanity33.com

STRIPE WEBHOOK SETUP
--------------------
1. Stripe Dashboard -> Developers -> Webhooks.
2. Add endpoint:
   https://novanity33.com/api/stripe-webhook
3. Select event:
   checkout.session.completed
4. Copy the signing secret (whsec_...).
5. Add it to Cloudflare Pages as the secret STRIPE_WEBHOOK_SECRET for Production and Preview.
6. Redeploy the site after adding variables.

PRINTFUL SYNC TEST
------------------
1. Open:
   https://novanity33.com/admin/printful-sync.html
2. Enter your ADMIN_SYNC_TOKEN.
3. Click Sync Products.
4. Confirm that all published products and sizes appear.
5. Download JSON if you want a backup of the variant mapping.

CHECKOUT TEST
-------------
1. Add one product to the cart.
2. Enter a complete delivery address.
3. Click Calculate Shipping.
4. Select a Printful shipping option.
5. Continue to Stripe Checkout.
6. Use Stripe test mode first if possible.
7. After a successful payment, verify a DRAFT order appears in Printful.
8. Verify the item, size, address, and shipping before confirming the draft.

IMPORTANT
---------
- This build intentionally creates Printful DRAFT orders. Printful should not begin fulfillment until you confirm the order.
- The customer enters an address on the website for the shipping quote and Stripe may ask them to confirm the address again.
- International customers may be charged customs duties or import fees by their destination country.
- Do not place secret keys inside source files or products.json.
- Keep enough Stripe proceeds available to cover Printful's fulfillment charge.

FILES ADDED
-----------
functions/api/_printful.js
functions/api/printful-catalog.js
functions/api/printful-shipping-rates.js
functions/api/create-checkout-session.js
functions/api/stripe-webhook.js
admin/printful-sync.html

PRODUCT NAME MATCHING
---------------------
The integration matches website product names to published Printful product names, then matches the selected size. Test every product before enabling unattended fulfillment.
