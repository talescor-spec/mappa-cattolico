import fs from 'node:fs';
import { variants } from './experiment.mjs';
import { offer, referenceTotal } from './offer.mjs';
import { release } from './release.mjs';
import { attributionFor, checkoutFor } from './experiment.mjs';
import { responsiveImages } from './media.mjs';
import { createHash } from 'node:crypto';

const version = createHash('sha256');
for (const folder of ['./','../mappa-della-bibbia/']) for (const file of fs.readdirSync(new URL(folder, import.meta.url)).filter(f=>/\.(mjs|css)$/.test(f)).sort()) version.update(fs.readFileSync(new URL(folder+file, import.meta.url)));
const assetVersion = version.digest('hex').slice(0,12);

const template = fs.readFileSync(new URL('./template.html', import.meta.url), 'utf8');
export function renderBibleOffer(id) {
  const variant = variants[id];
  if (!variant) throw new Error('Unknown offer variant');
  const fields = {
    BOOK_NAME: variant.name,
    ROUTE: variant.route,
    VARIANT: variant.id,
    COVER_WEBP: `/bibbia-2/assets/copertina-${variant.cover}-hd.webp`,
    COVER_JPG: `/bibbia-2/assets/copertina-${variant.cover}.jpg`,
    BOOK_VALUE: offer.referenceValues.book,
    CATECHISMO_VALUE: offer.referenceValues.catechismo,
    MESSA_VALUE: offer.referenceValues.messa,
    REFERENCE_TOTAL: referenceTotal,
    PRICE: offer.price,
    SAVING: referenceTotal - offer.price,
    GUARANTEE_DAYS: offer.guaranteeDays,
    CHECKOUT_URL: checkoutFor(release.checkoutURL, attributionFor('https://fideora.app'+variant.route, variant, release.campaign)).replaceAll('&','&amp;'),
    ASSET_VERSION: assetVersion,
  };
  const rendered = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in fields)) throw new Error(`Unknown template field: ${key}`);
    return fields[key];
  });
  if (/\{\{/.test(rendered)) throw new Error('Unresolved template field');
  return responsiveImages(rendered);
}
