# Fideora — Don Luca introductory offer

New, separate Italian route: `/inizia/`. Existing book pages, bio redirects and the main app landing are preserved.

## Brief

Audience: Italian readers arriving from Don Luca, interested in understanding Scripture and forming a personal reading habit.

| Sale | Reason |
| --- | --- |
| Content | Curiosity about a passage deserves context and a clear next step. |
| Hope | Isolated passages become easier to follow through context, comparison and notes. |
| Value | Demonstrate actual app screens, Matthew map, four Gospels, notebook, eight lexical cards, four guides and prayer tools. |
| Impulse | A paid €1 first month lowers the initial commitment; state automatic €19.90 monthly renewal beside the offer. No invented deadline. |

The reference provided was the full HTML and URL of Bíblia Raízes. The new page follows its broad sequence (promise, product demonstration, tools, original-language introduction, guides, device access, project face, evidence, offer, FAQ). Copy, screenshots, brand and visual components are specific to Fideora. No competitor assets or testimonials are repurposed as Fideora customer evidence.

Don Luca uses the user-supplied portrait and is presented as the project's digital character. No clerical credentials, employment history, personal counseling or invented endorsements are attributed to him.

The public Italian App Store review feed returned no customer reviews on 26 November. Customer testimonial blocks are replaced with actual product demonstrations, with the example notebook reflection identified. Real approved customer feedback can be added later.

## Payment evidence

Public `/api/web-access` plans response on 26 November confirmed the monthly offer: `introAmount: 1`, `introMonths: 1`, `amount: 19.9`, `currency: EUR`, `trialDays: 0`, Hotmart offer `t8i2l9ha` for product `X108495940M`. The Italian checkout visibly showed €1.00 including VAT, followed after one month by €19.90/month. No payment was submitted.

All CTA URLs are real Hotmart links in the static HTML. Scripts only preserve safe attribution and add progressive UI. Purchase navigation has no dependency on capture, analytics, backend requests, image downloads or a popup. Existing Meta pixel and UTMify tagging are reused, with no fabricated purchase events. Test traffic uses `fm_test=1`.

The offer is explicitly for web access on supported browsers; Apple subscriptions remain separate. Billing follows one calendar month and the next charge date in checkout, without an invented exact 30-day promise. Content limitations are described in FAQ: Diodati 1649, current Matthew/Gospel map coverage, introductory rather than full interlinear lexical cards.

## Validation

Build with `npm run build:website`; test `tests/euro1-landing.test.mjs` and the existing Bible-offer/capture regression tests. Check responsive rendering, screen and lexical tabs, keyboard access, FAQs, actual image loading, static purchase targets and live checkout price/renewal before concluding delivery.
