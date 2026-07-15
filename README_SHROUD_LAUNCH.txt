NO VANITY 33 — SHROUD FLAGSHIP UPDATE

This package merges the matched core storefront with the working Stripe checkout files and adds The Shroud Tee as the featured $37 flagship product.

DEPLOYMENT
1. Back up the current live repository.
2. Upload/replace the contents of this ZIP at the root of the existing website repository.
3. Keep all existing assets already in the repository. This ZIP includes the three new Shroud images.
4. Commit changes and allow Cloudflare Pages to redeploy.
5. Test adding The Shroud Tee in size S and one other size, then confirm Stripe checkout displays $37.00.

CHECKOUT NOTE
The Shroud Tee price is validated server-side at $37.00 in functions/api/create-checkout-session.js. This prevents a customer from changing the price in the browser and does not require a separate Stripe Price ID. Existing products continue using their current Stripe Price IDs.
