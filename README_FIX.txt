NO VANITY 33 — SWATCH CACHE + COLOR MATCH FIX

Why the last patch appeared unchanged:
- The black variant filenames stayed the same, so the browser/CDN could keep serving the old cached artwork-only images.
- The page also marked the first swatch as selected even when the curated main mockup was a different color.

This patch fixes both problems:
1. Adds NEW uniquely named black mockup files for all affected products.
2. Updates data/products.json to point Black swatches to those new filenames.
3. Uses clickable swatches for the Lion of Judah Hoodie.
4. Does NOT preselect a color when the main mockup is shown.
5. Requires a customer to choose a color before adding a multi-color product to cart.
6. Adds cache-busting to swatch image changes.

INSTALL:
- Extract the ZIP.
- From the ROOT of Final-1, upload the CONTENTS of this patch.
- Merge assets/ into assets/.
- Replace data/products.json and js/app.js.
- Do not create another nested patch folder.
