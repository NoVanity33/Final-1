NO VANITY 33 CHECKOUT PAGE STRIPE FIX

This removes the old disconnected PayPal checkout page and replaces it with a Stripe checkout page.

INSTALL:
1. Extract this ZIP.
2. Copy these into Final-1:
   - checkout.html
   - success.html
   - cancel.html
   - functions folder
3. Replace files when asked.
4. Commit: Fix checkout page for Stripe
5. Push origin.
6. In Cloudflare Pages environment variables, make sure these exist:
   STRIPE_SECRET_KEY = your Stripe LIVE secret key
   SITE_URL = https://novanity33.com
7. Redeploy.
8. Test:
   - Add product to cart
   - Click Checkout
   - Click Pay Securely with Stripe

If it says Missing STRIPE_SECRET_KEY, add that variable in Cloudflare Pages and redeploy.
