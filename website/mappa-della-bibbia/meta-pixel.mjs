export const META_PIXEL_ID = '2184650478741381';
const allowedParams = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','fbclid','gclid','ttclid','ct','lang','fm_test']);
const offers = Object.freeze({book:'mappa_del_cattolico_bundle',apple:'premium_ios',android:'premium_web'});

// The vendor must never receive personalized prefills or signed recovery links.
export function metaPageURL(value) {
 const url = new URL(value);
 for (const [key,val] of [...url.searchParams]) {
  if (!allowedParams.has(key) || /[@<>\x00-\x1f]|%40/i.test(val) || val.length > 200) url.searchParams.delete(key);
 }
 if (!/^#[a-z][a-z0-9-]*$/i.test(url.hash)) url.hash = '';
 return url.href;
}

export function createMetaTracker({win,doc,nav,storage} = {}) {
 const none = {enabled:false,lead:()=>false,outbound:()=>false};
 if (!win || !doc || !nav || !['https://fideora.app','https://www.fideora.app'].includes(win.location.origin)) return none;
 const params = new URLSearchParams(win.location.search);
 const cleanURL = metaPageURL(win.location.href);
 if (cleanURL !== win.location.href) {
  try { win.history.replaceState(null,'',cleanURL); } catch { return none; }
 }
 let prefs;
 try { prefs = JSON.parse(storage?.getItem('fm-app-thanks-privacy-v2') || 'null'); } catch {}
 const disabled = params.get('fm_test') === '1' || nav.doNotTrack === '1' || nav.globalPrivacyControl === true || prefs?.meta === false;
 doc.documentElement.dataset.metaPixelId = META_PIXEL_ID;
 doc.documentElement.dataset.metaPixelStatus = disabled ? 'disabled' : 'queued';
 if (disabled) return none;
 if (!win.fbq) {
  const queue = win.fbq = function() { if (queue.callMethod) queue.callMethod.apply(queue,arguments); else queue.queue.push([...arguments]); };
  win._fbq = queue; queue.push = queue; queue.loaded = true; queue.version = '2.0'; queue.queue = [];
 }
 const fbq = win.fbq;
 fbq('set','autoConfig',false,META_PIXEL_ID);
 fbq('init',META_PIXEL_ID);
 const seen = new Set();
 function send(name,data={},key=name,custom=false) {
  if (seen.has(key)) return false;
  seen.add(key);
  const eventID = 'studio_' + (win.crypto?.randomUUID?.() || key.replace(/[^a-z0-9_-]/ig,'').slice(0,70));
  try { fbq(custom?'trackSingleCustom':'trackSingle',META_PIXEL_ID,name,data,{eventID}); return true; }
  catch { return false; } // A blocked marketing vendor must not block checkout.
 }
 send('PageView');
 if (!win.location.pathname.includes('/grazie/')) send('ViewContent',{content_ids:['mappa_del_cattolico_bundle'],content_type:'product'});
 if (!doc.querySelector('script[data-mdb-meta-pixel]')) {
  const script = doc.createElement('script'); script.async = true; script.referrerPolicy = 'no-referrer';
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'; script.dataset.mdbMetaPixel = META_PIXEL_ID;
  script.onload = () => { doc.documentElement.dataset.metaPixelStatus = 'loaded'; };
  script.onerror = () => { doc.documentElement.dataset.metaPixelStatus = 'blocked'; };
  doc.head.append(script);
 }
 return {enabled:true,
  lead(kind,journeyID) {
   if (!offers[kind] || !/^[a-f0-9-]{36}$/i.test(journeyID || '')) return false;
   return send('Lead',{content_ids:[offers[kind]],content_type:'product'},'lead:'+journeyID);
  },
  outbound(kind) {
   if (!offers[kind]) return false;
   // Checkouts own InitiateCheckout and Purchase. A store click is not a purchase.
   return send(kind==='apple'?'AppStoreClick':'CheckoutRedirect',{content_ids:[offers[kind]]},'outbound:'+kind,true);
  },
 };
}

let tracker;
export function initMetaPixel() {
 if (tracker) return tracker;
 let storage; try { storage = window.localStorage; } catch {}
 try { tracker = createMetaTracker({win:window,doc:document,nav:navigator,storage}); }
 catch { tracker = {enabled:false,lead:()=>false,outbound:()=>false}; }
 return tracker;
}
