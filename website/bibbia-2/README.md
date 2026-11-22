# Italian Bible offer: shared title and cover experiment

One template.html, stylesheet, price, checkout, gallery, testimonials and bonus stack render two static pages:

| Variant | Route | Selected cover/title |
| --- | --- | --- |
| A | /mappa-della-bibbia-2/ | Mappa della Bibbia |
| B | /panorama-biblico/ | Panorama Biblico |

The cover images are optimized derivatives of the two images supplied by the user on 22 November 2026. Their illustrations and typography have not been regenerated. The front covers now use lossless WebP sources, with no perspective transform or image filter that can soften small text. Five public portrait samples use the approved revised internal format. The five content rows and the three practical tools also use portrait pages. All obsolete landscape preview assets have been removed from this offer. The full paid PDFs and editable editorial sources stay outside this public repository.

Both pages include the same two additional digital books: La Mappa del Catechismo and La Mappa della Messa, with their existing Cattolico covers and descriptions. The €27 offer is one payment for the principal book plus both bonus books. The 24-reading path, reflection sheet and seven follow-up readings are sections of the main book. The page restores the validated original MDB blocks and uses the Cattolico cream, green, gold and editorial bonus presentation.

The three testimonial quotations and their original product names come unchanged from the user-supplied validated first-edition page. Both variants identify them as historical experiences with the first edition. No new testimonials, aggregate Google ratings, buyer counts, stock limits, sale timer or invented price anchors are created.

## Measurement

Route-derived variants prevent a URL query from showing a different title from the selected cover. Funnel Metrics receives ct=mdb20_name_cover_v1_a or _b; the checkout receives an appended sck token, fdb_mdb20_a or _b. Existing UTMs and creative IDs remain unchanged. Existing ct is reserved for the experiment on these two routes; ad identities belong in utm_content. A pre-existing sck longer than the space available is preserved without shortening it; ct still identifies the variant. No personal query parameters are forwarded. DNT and Global Privacy Control suppress analytics. Review deployments do not collect production funnel events.

Page view, offer view, preview open and outbound checkout are measured separately. A click never emits Purchase; actual purchase/revenue attribution depends on the checkout/webhook retaining the variant token and must be verified before declaring a winner. Do not compare these variants against different prices, bonuses, traffic sources or checkout configurations.

## Release

release.fulfillmentVerified stays false until the final selected-cover principal PDFs in the approved reader format and both bonus PDFs are attached to the correct delivery product and verified. The checkout price was verified for Italian buyers at €27 one-time on 22 November 2026. The merchant explicitly extended the new offer to a 60-day Fideora guarantee on the same date. The page explains the merchant refund request via support@fideora.app and does not claim that the processor setting was changed. Align the provider settings and fulfillment before enabling the shared release. An earlier upload from another device produced an empty file and was discarded without saving; the old paid delivery remains intact.

Until delivery is verified, the bottom CTA opens the real gallery. These are review pages, not active sales tests. Existing Cattolico routes, the organic profile aliases, automations, app billing and delivery are unchanged. Launch requires verified delivery, enabling the shared release, and a controlled traffic split. The shared render parity and attribution tests run after node scripts/build-website.mjs with node --test tests/bible-offer.test.mjs.

The merchant-authorized reference values are €37 for the principal book and €19 for each bonus, €75 total against the €27 package price. These are content reference values; no prior €75 transaction price or standalone sale history is claimed. Both bonus descriptions and all three offer rows show the matching struck-through values.

Content blocks now use the semantic and visual order heading, portrait preview, explanation on every screen size; practical-tool cards use the same sequence. The first preview is a new six-scene illustrated overview (creation, promise, exodus, kingdom/exile, Easter, Spirit/hope), with exact Italian labels and Bible references typeset separately from decorative AI-generated artwork. Its public asset is assets/pagina-01-illustrata.webp. The illustration brief requested six separate biblical vignettes in muted forest green, ochre, terracotta and dusty blue, with no generated words; a built-in image-generation tool created the decorative art, then the editorial page was typeset as a precise portrait layout.

The three practical-tool previews now have distinct visual layouts: a 24-stage Advent reading calendar with an illustrated promise-to-Bethlehem scene, a four-area reflection notebook, and a seven-stage Gospel journey with illustrated scenes. All calendar numbers, Italian labels and Bible references are typeset separately from the decorative generated imagery. Tool previews are expandable, and the same new assets replace matching images in the primary content rows. Both variants share these layouts and contents.

The review section now uses an automatic, accessible carousel inspired by familiar retail review layouts. Each of the three five-star ratings was already displayed alongside the same quote in the supplied original MDB HTML. Editorial summary headings are not presented as original customer titles. No verified-purchase badges, customer dates or public helpful-vote totals are added. The Utile button stores only this visitor’s choice in local browser storage, shared across the two presentations; it does not claim a public aggregate vote. Rotation runs every six seconds only while the carousel is visible and the page is active, pauses during hover/focus, supports explicit pause and manual navigation, and starts paused for reduced-motion preferences.
