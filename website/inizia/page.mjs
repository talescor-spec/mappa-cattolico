import {checkoutURL} from './offer.mjs';
import {createMetaTracker,metaPageURL} from '../mappa-della-bibbia/meta-pixel.mjs';
import {hotmartAttributionCode,initUtmifyUTMs} from '../mappa-della-bibbia/utmify.mjs';
import {detectDevice} from '../mappa-della-bibbia/social-core.mjs';
const source=new URL(location.href);
const screenCopy={mappa:['Il contesto prima di tutto.','La Mappa di Matteo mette in ordine temi, persone e passaggi del Vangelo.'],vangeli:['Quattro sguardi. Un unico racconto.','Confronta gli accenti di Matteo, Marco, Luca e Giovanni.'],versetto:['Una parola che resta.','Evidenzia, salva e aggiungi una nota ai versetti che vuoi ritrovare.'],quaderno:['Le tue scoperte, custodite.','Raccogli riflessioni e studi in uno spazio personale.']};
// Reading and checkout remain native links if enhancement or analytics fail.
function tabs(selector,attribute,after=()=>{}) {
 const items=[...document.querySelectorAll(selector)];
 function select(item,focus=false){for(const button of items){const active=button===item;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=!active;}after(item.getAttribute(attribute));if(focus)item.focus({preventScroll:true});}
 items.forEach((item,i)=>{item.addEventListener('click',()=>select(item));item.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%items.length;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+items.length-1)%items.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=items.length-1;else return;event.preventDefault();select(items[next],true);});});
}
tabs('[data-screen]','data-screen',id=>{document.querySelector('[data-demo-title]').textContent=screenCopy[id][0];document.querySelector('[data-demo-text]').textContent=screenCopy[id][1];});
tabs('[data-word]','data-word');
let storage;try{storage=window.localStorage;}catch{}
const clean=metaPageURL(location.href);try{if(clean!==location.href)history.replaceState(null,'',clean);}catch{}
let tracker;try{tracker=createMetaTracker({win:window,doc:document,nav:navigator,storage,contentID:'fideora_premium_eur1_web'});}catch{}
const attribution=Object.fromEntries(new URL(checkoutURL(source.href)).searchParams);delete attribution.off;
let session;try{session=sessionStorage.getItem('fideoraEur1Session');if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session||'')){session=crypto.randomUUID();sessionStorage.setItem('fideoraEur1Session',session);}}catch{}
function collect(event_name){try{if(!session||navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true||!['https://fideora.app','https://www.fideora.app'].includes(location.origin))return;void fetch('/api/study-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),session_id:session,event_name,platform:detectDevice(navigator),offer:'android',attribution,is_test:source.searchParams.get('fm_test')==='1'}),keepalive:true}).catch(()=>{});}catch{}}
for(const link of document.querySelectorAll('[data-buy]')) {
 try{const target=new URL(checkoutURL(source.href,link.dataset.buy));const code=hotmartAttributionCode(Object.fromEntries(target.searchParams));if(code)target.searchParams.set('xcod',code);link.href=target.href;}catch{}
 link.addEventListener('click',()=>{collect('checkout_click');try{tracker?.outbound('android');}catch{}});
}
collect('page_view');try{initUtmifyUTMs();}catch{}
