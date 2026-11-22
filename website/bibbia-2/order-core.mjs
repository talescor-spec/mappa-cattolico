import { normalizeContact, cleanAttribution } from '../mappa-della-bibbia/order-core.mjs';
import { attributionFor, variants, checkoutFor } from './experiment.mjs';
import { offer } from './offer.mjs';

export function editionCapture(value={}) {
  if(value.offer!=='book'||!Object.hasOwn(variants,value.variant))throw Error('invalid_offer');
  const variant=variants[value.variant],contact=normalizeContact(value);
  const page=new URL('https://fideora.app'+variant.route);
  for(const [key,val] of Object.entries(cleanAttribution(value.attribution)))page.searchParams.set(key,val);
  const attribution=attributionFor(page.href,variant,'mdb_approfondita_natale_2026');
  for(const [key,val] of Object.entries(attribution))page.searchParams.set(key,val);
  return {...contact,funnel:'mdb-studio-it',selected_offer:'book',offer_reference:'mdb20_bundle_27_eur',offer_price:offer.price,currency:'EUR',page_url:page.href,attribution,session_id:value.session_id,platform:value.platform,followup_requested:value.followup_requested===true};
}
export function editionCheckout(base,contact,attribution){
  const target=checkoutFor(base,cleanAttribution(attribution));
  if(!target)throw Error('invalid_checkout');
  const url=new URL(target),details=normalizeContact(contact);
  url.searchParams.set('name',details.name);url.searchParams.set('email',details.email);
  return url.href;
}
