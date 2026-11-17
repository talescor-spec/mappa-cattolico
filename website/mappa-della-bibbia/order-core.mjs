import { campaignToken } from './social-core.mjs';
import { hotmartAttributionCode } from './utmify.mjs';
export const contactKey = 'fideoraStudyContact:v1';
export const contactMaxAge = 30 * 86400000;
export const captureFunnel = 'mdb-studio-it';
const nameKeys = ['name', 'nome', 'full_name', 'fullname', 'buyer_name', 'first_name', 'firstname', 'NOME', 'FIRSTNAME'];
const emailKeys = ['email', 'Email', 'EMAIL', 'buyer_email', 'contact_email'];
const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'ct', 'fbclid', 'gclid', 'ttclid','fm_delivery','xcod'];
export function cleanName(value) {
  const name = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  return name.length >= 2 && name.length <= 120 && !/[<>\x00-\x1f\x7f]/.test(name) ? name : '';
}
export function cleanEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : '';
}
export function normalizeContact(value = {}) {
  const name = cleanName(value.name), email = cleanEmail(value.email);
  if (!name) throw new Error('invalid_name');
  if (!email) throw new Error('invalid_email');
  return { name, email };
}
export function prefillContact(search, storage, now = Date.now()) {
  const params = new URLSearchParams(search);
  let saved = {};
  try {
    const item = JSON.parse(storage?.getItem(contactKey) || '{}');
    if (Number.isFinite(item.savedAt) && now >= item.savedAt && now - item.savedAt < contactMaxAge) saved = item;
  } catch { /* Browser storage can be unavailable. URL/native autofill still work. */ }
  const firstValid = (keys, cleaner) => keys.map(key => cleaner(params.get(key))).find(Boolean);
  return { name: firstValid(nameKeys, cleanName) || cleanName(saved.name), email: firstValid(emailKeys, cleanEmail) || cleanEmail(saved.email) };
}
export function rememberContact(storage, contact, now = Date.now()) {
  const normalized = normalizeContact(contact);
  try { storage?.setItem(contactKey, JSON.stringify({ ...normalized, savedAt: now })); } catch { /* No storage is required for checkout. */ }
  return normalized;
}
export function cleanAttribution(source) {
  const read = source instanceof URLSearchParams ? key => source.get(key) : key => source?.[key];
  const result = {};
  for (const key of attributionKeys) {
    const value = read(key);
    if (typeof value === 'string' && value.length <= (key === 'xcod' ? 1024 : 200) && !/[@<>\x00-\x1f\x7f]|%40/i.test(value)) result[key] = value;
  }
  return result;
}
export function capturePayload(value = {}) {
  const contact = normalizeContact(value);
  if (!['book', 'apple', 'android'].includes(value.offer)) throw new Error('invalid_offer');
  const attribution = cleanAttribution(value.attribution);
  const page = new URL('https://fideora.app/mappa-della-bibbia/');
  for (const [key, val] of Object.entries(attribution)) page.searchParams.set(key, val);
  return {
    ...contact, ...attribution, funnel: captureFunnel, page_url: page.href,
    session_id: value.session_id, platform: value.platform, followup_requested: value.followup_requested === true,
    selected_offer: value.offer, offer_reference: value.offer === 'book' ? 'mdb_studio_library_39_eur' : value.offer === 'apple' ? 'com.fideora.premium.monthly' : 'hotmart_fideora_monthly_e792z6va',
    offer_price: value.offer === 'book' ? 39 : 7.99, currency: 'EUR',
    ...(value.is_test === true ? { test_type: 'qa_study_order' } : {}),
  };
}
export function checkoutContactURL(target, kind, contact, attribution = {}) {
  if (!target) return null;
  const url = new URL(target);
  const host = kind === 'book' ? 'checkout.mundpay.com' : kind === 'apple' ? 'apps.apple.com' : kind === 'android' ? 'pay.hotmart.com' : '';
  if (url.protocol !== 'https:' || !host || url.hostname !== host) throw new Error('invalid_checkout');
  const tracking = cleanAttribution(attribution);
  for (const [key, value] of Object.entries(tracking)) if (key !== 'xcod' || kind === 'android') url.searchParams.set(key, value);
  if (kind === 'apple') {
    url.searchParams.set('pt','129505215'); url.searchParams.set('mt','8');
    url.searchParams.set('ct',campaignToken(url.searchParams.get('utm_source'),url.searchParams.get('utm_medium')));
  }
  if (kind === 'android') {
    const xcod = hotmartAttributionCode(tracking);
    if (xcod) url.searchParams.set('xcod', xcod);
    const details = normalizeContact(contact); url.searchParams.set('name', details.name); url.searchParams.set('email',details.email);
  }
  if (kind === 'book') {
    const details = normalizeContact(contact);
    // Mundpay's public checkout reads these exact search parameters.
    url.searchParams.set('name', details.name);
    url.searchParams.set('email', details.email);
  }
  return url.href;
}
