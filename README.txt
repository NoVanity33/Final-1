NO VANITY 33 — EMERGENCY CHECKOUT FIX

Replace only:
checkout.html

Do not replace products.json, app.js, style.css, images, or any catalog files.

What changed:
- Removed the live /api/printful-shipping-rates call.
- Eligible $24.99 shirt-only U.S. orders remain free shipping.
- Mixed carts and other U.S. orders use $4.75 flat shipping.
- Checkout still sends one request to /api/create-checkout-session.
- Ambassador program and catalog are untouched.
- International checkout is temporarily paused rather than quoting a wrong rate.

Commit message:
Emergency checkout fix - bypass Printful shipping rate limit
