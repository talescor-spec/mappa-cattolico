import { release } from './release.mjs';
import { createMetaTracker, metaPageURL } from '../mappa-della-bibbia/meta-pixel.mjs';
import { initUtmifyUTMs } from '../mappa-della-bibbia/utmify.mjs';
import { detectDevice } from '../mappa-della-bibbia/social-core.mjs';
// Remove personal query parameters before loading any third-party attribution.
const cleaned=metaPageURL(location.href);
if(cleaned!==location.href)history.replaceState(null,'',cleaned);
let local;try{local=localStorage;}catch{}
const tracker=release.fulfillmentVerified?createMetaTracker({win:window,doc:document,nav:navigator,storage:local,contentID:'mdb_edizione_approfondita_2'}):null;
if(release.fulfillmentVerified)initUtmifyUTMs();
const dialog=document.querySelector('.preview-dialog');
const image=dialog.querySelector('img');
const zoom=dialog.querySelector('.preview-zoom');
const close=()=>dialog.close();
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  dialog.classList.remove('zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Ingrandisci dettagli +';
  image.src=button.dataset.preview;image.alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;
  dialog.querySelector('.preview-surface').scrollTo(0,0);dialog.showModal();document.body.classList.add('dialog-open');collect('preview_open');
}));
zoom.addEventListener('click',()=>{const expanded=dialog.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(expanded));zoom.textContent=expanded?'Riduci tavola −':'Ingrandisci dettagli +';});
dialog.querySelector('.dialog-close').addEventListener('click',close);
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
const safeKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','ttclid','gclid','sck','src'];
const current=new URL(location.href);
const safe=Object.fromEntries(safeKeys.map(key=>[key,current.searchParams.get(key)]).filter(([,value])=>value&&value.length<=200&&!/[@<>\x00-\x1f\x7f]|%40/i.test(value)));
// New edition uses only its own campaign; it does not silently inherit a former offer's stored identity.
if(!safe.utm_campaign)safe.utm_campaign=release.campaign;
if(release.fulfillmentVerified){
  const target=new URL(release.checkoutURL);
  if(target.protocol==='https:'&&target.hostname==='pay.mycheckoutt.com'&&!target.username&&!target.password){
    for(const [key,value] of Object.entries(safe))target.searchParams.set(key,value);
    const button=document.querySelector('[data-checkout]');button.href=target.href;button.innerHTML='Scelgo la nuova Mappa della Bibbia <span aria-hidden="true">→</span>';
    button.addEventListener('click',()=>{collect('checkout_click');tracker?.outbound('book');});
    document.querySelector('[data-release-note]').textContent='Pagamento sicuro con Mundpay. Ricevi le istruzioni di accesso dopo la conferma del pagamento.';
  }
}
let sessionID;
try{sessionID=sessionStorage.getItem('fideoraMdb2Session');if(!/^[a-f0-9-]{36}$/i.test(sessionID||'')){sessionID=crypto.randomUUID();sessionStorage.setItem('fideoraMdb2Session',sessionID);}}catch{sessionID=crypto.randomUUID();}
function collect(event_name){
 if(!sessionID||!['https://fideora.app','https://www.fideora.app'].includes(location.origin))return;
 const body={id:crypto.randomUUID(),session_id:sessionID,event_name,platform:detectDevice(navigator),offer:'book',attribution:safe,is_test:new URLSearchParams(location.search).get('fm_test')==='1'};
 void fetch('/api/study-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),keepalive:true}).catch(()=>{});
}
collect('page_view');
