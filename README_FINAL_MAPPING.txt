NO VANITY 33 - FINAL STRIPE PRODUCT MAPPING

This package updates checkout mapping using:
- LOJ Hoodie => Lion of Judah Hoodie
- Grey Socks => Cross Socks - Gray
- Black Wristband => Scripture Wristband
- Daily Walk Bible Kit intentionally left out

COPY INTO FINAL-1:
- data/products.json
- js/app.js
- checkout.html
- success.html
- cancel.html
- functions folder

DO NOT replace:
- css/style.css
- assets

Matched products: 23
Missing products for sale: 2

MISSING:
- Cross Socks - Gray
- Scripture Wristband

REMINDER:
If Stripe still says Invalid API Key, fix STRIPE_SECRET_KEY in Cloudflare:
It must be the full sk_live_... key, with no spaces, then redeploy.
