import {detectDevice,sessionContext} from './social-core.mjs';
let storage;try{storage=sessionStorage;}catch{}
export const journeySession=sessionContext(storage,new URLSearchParams(location.search),document.referrer);
export const detectedDevice=detectDevice(navigator);
const test=new URLSearchParams(location.search).get('fm_test')==='1';
const pending=[];let sending=false;
export function track(event_name,offer){
 const body={id:crypto.randomUUID(),session_id:journeySession.id,event_name,platform:detectedDevice,offer,attribution:journeySession.attribution,is_test:test};
 pending.push(body);void flush();
}
async function flush(){
 if(sending)return;sending=true;
 try{while(pending.length){const body=pending[0];try{const r=await fetch('/api/study-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),keepalive:true,signal:AbortSignal.timeout(7000)});if(!r.ok)break;pending.shift();}catch{break;}}}finally{sending=false;}
}
window.addEventListener('online',()=>void flush());
window.addEventListener('pagehide',()=>{for(const item of pending.slice(0,8))navigator.sendBeacon?.('/api/study-events',new Blob([JSON.stringify(item)],{type:'application/json'}));});
track('page_view');
if('IntersectionObserver' in window){const seen=new Set();const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting||seen.has(entry.target.id))continue;seen.add(entry.target.id);track('offer_view',entry.target.id==='offerta-libro'?'book':detectedDevice==='ios'?'apple':'android');}},{threshold:.4});for(const card of document.querySelectorAll('.offer-card'))observer.observe(card);}
