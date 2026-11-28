(function(){'use strict';
const checkout='https://pay.hotmart.com/X108495940M?off=t8i2l9ha';
const attributionKeys=['utm_source','utm_campaign','utm_medium','utm_content','utm_term','utm_id','src','sck','xcod','fbclid','gclid','ttclid'];
const utmOrder=['utm_source','utm_campaign','utm_medium','utm_content','utm_term'];
const valid=v=>typeof v==='string'&&v.length>0&&v.length<=500&&!/[@<>\x00-\x1f\x7f]|%40/i.test(v);
const query=new URLSearchParams(location.search);let stored={};
try{const prior=JSON.parse(sessionStorage.getItem('fideora-attribution-v1')||'{}');for(const k of attributionKeys)if(valid(prior[k]))stored[k]=prior[k]}catch(e){}
// A new tagged campaign replaces the previous session campaign rather than mixing sources.
if(utmOrder.some(k=>query.has(k)))stored={};
for(const k of attributionKeys){const value=query.get(k);if(valid(value))stored[k]=value}
try{sessionStorage.setItem('fideora-attribution-v1',JSON.stringify(stored))}catch(e){}
const consentKey='fideora-measurement-consent-v1';let analytics=false;

function destination(placement){const url=new URL(checkout);url.searchParams.set('checkoutMode','10');url.searchParams.set('language','it');url.searchParams.set('utm_source','don_luca');url.searchParams.set('utm_medium','landing');url.searchParams.set('utm_campaign','fideora_netflix_it_eur1');url.searchParams.set('utm_content',placement);
for(const k of attributionKeys)if(valid(stored[k]))url.searchParams.set(k,stored[k]);
// Hotmart xcod uses UTMify's documented field order and separator, as in the current Fideora page.
if(!url.searchParams.has('xcod')){const encoded=utmOrder.map(k=>url.searchParams.get(k)||'').join('hQwK21wXxR');url.searchParams.set('xcod',encoded)}
return url.href}
for(const a of document.querySelectorAll('[data-buy]')){a.href=destination(a.dataset.buy);a.addEventListener('click',()=>{if(analytics&&typeof window.fbq==='function')window.fbq('trackSingleCustom','2184650478741381','CheckoutRedirect',{content_ids:['fideora_premium_eur1_web'],currency:'EUR',value:1,placement:a.dataset.buy});})}
// Measurement honors existing privacy choices and browser opt-out signals.
function startMeasurement(){let rejected=false;try{rejected=localStorage.getItem(consentKey)==='rejected'||JSON.parse(localStorage.getItem('fm-app-thanks-privacy-v2')||'null')?.meta===false}catch(e){}if(rejected||query.get('fm_test')==='1'||navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true){document.documentElement.dataset.utmifyStatus='disabled';return}analytics=true;
if(!document.querySelector('[data-study-utmify]')){const s=document.createElement('script');s.src='https://cdn.utmify.com.br/scripts/utms/latest.js';s.async=true;s.defer=true;s.setAttribute('data-study-utmify','utms');s.setAttribute('data-utmify-prevent-xcod-sck','');s.setAttribute('data-utmify-prevent-subids','');s.setAttribute('data-utmify-ignore-iframe','');s.onload=()=>document.documentElement.dataset.utmifyStatus='loaded';s.onerror=()=>document.documentElement.dataset.utmifyStatus='blocked';document.head.append(s)}
if(!window.fbq){const n=window.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};window._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.append(s);n('set','autoConfig',false,'2184650478741381');n('init','2184650478741381');n('trackSingle','2184650478741381','PageView');n('trackSingle','2184650478741381','ViewContent',{content_ids:['fideora_premium_eur1_web'],content_type:'product',currency:'EUR',value:1})}}
startMeasurement();
})();
