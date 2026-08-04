NO VANITY 33 — LAUNCH CATALOG PATCH

Replace these files in Final-1:
- data/products.json
- js/app.js
- css/style.css
- index.html
- checkout.html

What this fixes:
- Removes duplicate product IDs.
- Preserves Stripe IDs from duplicate records where possible.
- Applies approved default colors.
- Removes approved unwanted colors.
- Moves each default color to the first swatch position.
- Makes the selected swatch match the displayed default image.
- Darkens product mockup backgrounds.
- Keeps hero size and ribbon badges unchanged.
- Uses cache-busting version strings so Cloudflare/browser loads the new files.

Commit message:
Launch candidate catalog cleanup and approved color defaults
