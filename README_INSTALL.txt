NV33 DUPLICATE CLEANUP PATCH

This patch fixes the issue where new corrected products were added but legacy cards remained.

It:
- Deduplicates by design name/alias, not only exact product ID.
- Prefers the corrected mockup set with the full color selector.
- Removes the old standalone Crown 33 Maroon card.
- Keeps one Parting the Sea, one Living Word, one Prayer Cross, etc.
- Forces a new browser cache version for products.json and app.js.

INSTALL
1. Extract the ZIP.
2. Copy index.html, data, and js into the root of Final-1.
3. Choose Replace/Merge.
4. Commit and push.
5. Wait for Cloudflare deployment.
6. Open the site and press Ctrl+Shift+R.
