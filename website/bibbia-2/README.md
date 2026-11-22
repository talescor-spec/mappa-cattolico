# Italian Bible offer: shared title and cover experiment

One template.html, stylesheet, price, checkout, gallery, testimonials and bonus stack render two static pages:

| Variant | Route | Selected cover/title |
| --- | --- | --- |
| A | /mappa-della-bibbia-2/ | Mappa della Bibbia |
| B | /panorama-biblico/ | Panorama Biblico |

The cover images are optimized derivatives of the two images supplied by the user on 22 November 2026. Their illustrations and typography have not been regenerated. Five public portrait samples use the approved revised internal format. Additional landscape previews are real excerpts from the existing 98-page revised manuscript; the full paid PDFs and editable editorial sources stay outside this public repository.

Both pages include the same two additional digital books: La Mappa del Catechismo and La Mappa della Messa, with their existing Cattolico covers and descriptions. The €27 offer is one payment for the principal book plus both bonus books. The 24-reading path, reflection sheet and seven follow-up readings are sections of the main book. The page restores the validated original MDB blocks and uses the Cattolico cream, green, gold and editorial bonus presentation.

The three testimonial quotations and their original product names come unchanged from the user-supplied validated first-edition page. Both variants identify them as historical experiences with the first edition. No new testimonials, Google ratings, buyer counts, stock limits, sale timer or invented price anchors are created.

## Measurement

Route-derived variants prevent a URL query from showing a different title from the selected cover. Funnel Metrics receives ct=mdb20_name_cover_v1_a or _b; the checkout receives an appended sck token, fdb_mdb20_a or _b. Existing UTMs and creative IDs remain unchanged. Existing ct is reserved for the experiment on these two routes; ad identities belong in utm_content. A pre-existing sck longer than the space available is preserved without shortening it; ct still identifies the variant. No personal query parameters are forwarded. DNT and Global Privacy Control suppress analytics. Review deployments do not collect production funnel events.

Page view, offer view, preview open and outbound checkout are measured separately. A click never emits Purchase; actual purchase/revenue attribution depends on the checkout/webhook retaining the variant token and must be verified before declaring a winner. Do not compare these variants against different prices, bonuses, traffic sources or checkout configurations.

## Release

release.fulfillmentVerified stays false until the final selected-cover principal PDFs in the approved reader format and both bonus PDFs are attached to the correct delivery product and verified. The checkout was verified for Italian buyers at €27 one-time with a seven-day guarantee on 22 November 2026. An earlier upload from another device produced an empty file and was discarded without saving; the old paid delivery remains intact.

Until delivery is verified, the bottom CTA opens the real gallery. These are review pages, not active sales tests. Existing Cattolico routes, the organic profile aliases, automations, app billing and delivery are unchanged. Launch requires verified delivery, enabling the shared release, and a controlled traffic split. The shared render parity and attribution tests run after node scripts/build-website.mjs with node --test tests/bible-offer.test.mjs.
