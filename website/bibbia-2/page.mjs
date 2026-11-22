import { initReviewCarousel } from './reviews-carousel.mjs';
import { initCapture } from './capture.mjs';
import { release } from './release.mjs';
import { attributionFor, checkoutFor, variantForPath, experiment } from './experiment.mjs';
import { createMetaTracker, metaPageURL } from '../mappa-della-bibbia/meta-pixel.mjs';
import { initUtmifyUTMs } from '../mappa-della-bibbia/utmify.mjs';
import { detectDevice } from '../mappa-della-bibbia/social-core.mjs';

const variant=variantForPath(location.pathname);
if(!variant)throw new Error('Unknown offer route');
const incomingURL=new URL(location.href);
// Clean the address before third-party attribution can read it.
const cleaned=metaPageURL(location.href);
if(cleaned!==location.href)history.replaceState(null,'',cleaned);
const safe=attributionFor(location.href,variant,release.campaign);
let local;try{local=localStorage;}catch{}
const trackingAllowed=navigator.doNotTrack!=='1'&&window.doNotTrack!=='1'&&navigator.globalPrivacyControl!==true;
const tracker=release.fulfillmentVerified&&trackingAllowed?createMetaTracker({win:window,doc:document,nav:navigator,storage:local,contentID:`${experiment}_${variant.id}`}):null;
if(release.fulfillmentVerified&&trackingAllowed)initUtmifyUTMs();

let sessionID;
try{sessionID=sessionStorage.getItem('fideoraMdb2Session');if(!/^[a-f0-9-]{36}$/i.test(sessionID||'')){sessionID=crypto.randomUUID();sessionStorage.setItem('fideoraMdb2Session',sessionID);}}catch{sessionID=crypto.randomUUID();}
function collect(event_name){
  if(!trackingAllowed||!sessionID||!['https://fideora.app','https://www.fideora.app'].includes(location.origin))return;
  const body={id:crypto.randomUUID(),session_id:sessionID,event_name,platform:detectDevice(navigator),offer:'book',attribution:safe,is_test:new URLSearchParams(location.search).get('fm_test')==='1'};
  void fetch('/api/study-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),keepalive:true}).catch(()=>{});
}
const dialog=document.querySelector('.preview-dialog');
const image=dialog.querySelector('img');
const zoom=dialog.querySelector('.preview-zoom');
let opener;
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;
  dialog.classList.remove('zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Ingrandisci dettagli +';
  image.src=button.dataset.preview;image.alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;
  dialog.querySelector('.preview-surface').scrollTo(0,0);dialog.showModal();document.body.classList.add('dialog-open');collect('preview_open');
}));
zoom.addEventListener('click',()=>{const expanded=dialog.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(expanded));zoom.textContent=expanded?'Riduci tavola −':'Ingrandisci dettagli +';});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

initCapture({variant,attribution:safe,sessionID,platform:detectDevice(navigator),tracker,collect,storage:local,incomingURL});
collect('page_view');
const offer=document.querySelector('#offerta');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){collect('offer_view');observer.disconnect();}},{threshold:.25});observer.observe(offer);}

initReviewCarousel();
