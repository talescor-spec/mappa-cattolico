import { metaPageURL } from './meta-pixel.mjs';

export const UTMIFY_UTMS_SCRIPT = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
const separator = 'hQwK21wXxR';
const fields = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'];

// This is the Hotmart format supplied by UTMify's Facebook code generator.
// Preserve each slot, including an absent placement, so ad IDs keep their position.
export function hotmartAttributionCode(attribution = {}) {
 const read = key => attribution instanceof URLSearchParams ? attribution.get(key) : attribution[key];
 const safe = value => typeof value === 'string' && value.length <= 1024 && !/[@<>\x00-\x1f\x7f]|%40/i.test(value);
 const existing = read('xcod');
 if (safe(existing) && existing) return existing;
 const parts = fields.map(key => { const value = read(key); return safe(value) && value.length <= 200 ? value : ''; });
 return parts.some(Boolean) ? parts.join(separator) : '';
}

// Attribution only: this loader never installs UTMify's separate optimization
// pixel, initializes another Meta pixel, or emits a financial conversion.
export function loadUtmifyUTMs({win, doc, nav, storage} = {}) {
 if (!win || !doc || !nav || !['https://fideora.app', 'https://www.fideora.app'].includes(win.location.origin)) return false;
 const params = new URLSearchParams(win.location.search);
 const clean = metaPageURL(win.location.href);
 if (clean !== win.location.href) {
  try { win.history.replaceState(null, '', clean); } catch { return false; }
 }
 let prefs;
 try { prefs = JSON.parse(storage?.getItem('fm-app-thanks-privacy-v2') || 'null'); } catch {}
 const disabled = params.get('fm_test') === '1' || nav.doNotTrack === '1' || nav.globalPrivacyControl === true || prefs?.meta === false;
 doc.documentElement.dataset.utmifyStatus = disabled ? 'disabled' : 'queued';
 if (disabled) return false;
 if (doc.querySelector('script[data-study-utmify]')) return true;
 const script = doc.createElement('script');
 script.src = UTMIFY_UTMS_SCRIPT; script.async = true; script.defer = true; script.referrerPolicy = 'no-referrer';
 script.setAttribute('data-study-utmify', 'utms');
 // The page serves Mundpay and Apple too. Hotmart's xcod is generated explicitly
 // in checkoutContactURL, including for the immediate JavaScript redirect.
 script.setAttribute('data-utmify-prevent-xcod-sck', '');
 script.setAttribute('data-utmify-prevent-subids', '');
 script.setAttribute('data-utmify-ignore-iframe', '');
 script.onload = () => { doc.documentElement.dataset.utmifyStatus = 'loaded'; };
 script.onerror = () => { doc.documentElement.dataset.utmifyStatus = 'blocked'; };
 try { doc.head.append(script); return true; } catch { doc.documentElement.dataset.utmifyStatus = 'blocked'; return false; }
}

export function initUtmifyUTMs() {
 let storage; try { storage = window.localStorage; } catch {}
 try { return loadUtmifyUTMs({win:window, doc:document, nav:navigator, storage}); } catch { return false; }
}
