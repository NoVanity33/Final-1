NO VANITY 33 — VERSION 7.0

WHAT IS INCLUDED
- Stripe Automatic Tax during Checkout.
- Live Printful shipping quotes before Stripe Checkout.
- Stripe webhook verification and automatic Printful DRAFT order creation.
- Automatic Printful store detection through the Printful Stores API when PRINTFUL_STORE_ID is not provided.
- Automatic Printful product/size/variant sync.
- Private owner dashboard showing connection health, recent Stripe sales, recent Printful orders, and catalog counts.
- Improved webhook support for checkout.session.completed and checkout.session.async_payment_succeeded.

CLOUDFLARE VARIABLES — NAMES MUST MATCH EXACTLY
Secret: PRINTFUL_API_KEY
Secret: STRIPE_SECRET_KEY
Secret: STRIPE_WEBHOOK_SECRET
Secret: ADMIN_SYNC_TOKEN
Plaintext: SITE_URL = https://novanity33.com
Optional plaintext: PRINTFUL_STORE_ID

STRIPE WEBHOOK
Endpoint: https://novanity33.com/api/stripe-webhook
Events:
- checkout.session.completed
- checkout.session.async_payment_succeeded (recommended when delayed payment methods are enabled)

DEPLOYMENT
1. Keep a backup of the currently working deployment.
2. Upload the CONTENTS of this ZIP to Cloudflare Pages or commit the contents to the connected GitHub repository.
3. Preserve the functions/api folder structure.
4. Redeploy after confirming the environment variables above.
5. Open https://novanity33.com/admin/dashboard.html
6. Enter the ADMIN_SYNC_TOKEN you created in Cloudflare.
7. Confirm all System Health checks show Ready and Printful shows Connected.
8. Click Force Printful Sync.
9. Test one real product through address, shipping quote, Stripe Checkout, tax, and payment.
10. Confirm a DRAFT order appears in Printful. Review the first several draft orders before enabling automatic confirmation.

IMPORTANT
- Version 7 intentionally creates Printful DRAFT orders (confirm=false). It does not automatically charge your Printful billing method or submit production.
- The dashboard reads live data from Stripe and Printful; it does not yet use a database. Profit history, customer notes, and long-term analytics require a Cloudflare D1 database and are planned for a later expansion.
- Do not place any secret key inside HTML or JavaScript files.
