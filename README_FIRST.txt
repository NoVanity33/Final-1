NO VANITY 33 — VERSION 4
Prepared July 18, 2026

WHY VERSION 4
This is a catalog restructure, not a small patch:
- All final approved storefront images are included.
- Three new live $30 shirts were added.
- The Coming Soon area was rebuilt as six consolidated Founder's Preview cards.
- Existing Stripe mappings were preserved.
- New shirt Stripe mappings were added.
- Old duplicate socks, shorts and sweatpants listings were removed from the storefront.
- Browser and Cloudflare cache versions were refreshed.

NEW LIVE SHIRTS
1. Philippians 4:13 Cross Tee — $30
   Stripe: price_1Tr2iwRQ7M5gXs0AnNpgoFA0

2. Worthy Is the Lamb Tee — $30
   Stripe: price_1Tr2g9RQ7M5gXs0A5icFrGWK

3. Crown 33 Maroon Tee — $30
   Stripe: price_1Tr2eeRQ7M5gXs0AcYulj7vX

FOUNDER'S PREVIEW CARDS
- Cross Crew Socks Collection
- Performance Shorts Collection
- Premium Sweatpants Collection
- Duffle Bag
- 40oz Scripture Water Bottle
- Scripture Wristbands

AVAILABLE PRODUCTS MISSING STRIPE IDS
- None

UPLOAD
Replace these items in the website project:
- index.html
- checkout.html
- data/products.json
- js/app.js
- css/style.css
- assets/products/  (copy all included files and replace matching files)

DEPLOYMENT
1. Copy the files into the matching folders.
2. Commit: Launch No Vanity 33 Version 4
3. Push/deploy through GitHub and Cloudflare.
4. Wait for deployment to complete.
5. Press Ctrl+Shift+R on novanity33.com.
6. Clear the old cart before testing.
7. Test the three new shirts individually.
8. Confirm the correct product name and $30 amount on Stripe.

IMPORTANT
The preview products are not purchasable. Their Notify Me buttons open an email waitlist message.
