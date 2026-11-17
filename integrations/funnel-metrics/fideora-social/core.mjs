export const PAGE='https://fideora.app/mappa-della-bibbia/';
export const CHILDREN={book:'mdb-studio-libro-it',ios:'fideora-social-ios-it',android:'fideora-social-android-it'};
const uid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const validSession=v=>typeof v==='string'&&uid.test(v);
export const validEmail=v=>typeof v==='string'&&v.length<=254&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v);
export const email=v=>String(v||'').trim().toLowerCase();
export const kind=v=>v==='apple'?'ios':Object.hasOwn(CHILDREN,v)?v:null;
export function attribution(v={}){
 const out={};for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','ct','fbclid','gclid','ttclid','fm_delivery']){
  const x=v[k];if(typeof x==='string'&&x.length<=200&&!/[<>\x00-\x1f\x7f]/.test(x))out[k]=x;
 }return out;
}
export function collectEvent(body){
 if(!validSession(body.session_id)||!validSession(body.id))throw Error('invalid_event_id');
 if(!['page_view','offer_view','capture_started','checkout_click','store_click','preview_open','resume_open','capture_error'].includes(body.event_name))throw Error('invalid_event_name');
 if(!['ios','android','desktop','other'].includes(body.platform))throw Error('invalid_platform');
 const offer=body.offer?kind(body.offer):null;if(body.offer&&!offer)throw Error('invalid_offer');
 return {event_key:'web:'+body.id,session_id:body.session_id,event_name:body.event_name,platform:body.platform,
  offer,attribution:attribution(body.attribution),is_test:body.is_test===true};
}
export function captureContact(body){
 const e=email(body.email),name=String(body.name||'').trim().replace(/\s+/g,' '),offer=kind(body.offer);
 if(!validEmail(e)||name.length<2||name.length>120||/[<>\x00-\x1f\x7f]/.test(name))throw Error('invalid_contact');
 if(!offer||!validSession(body.session_id)||!['ios','android','desktop','other'].includes(body.platform))throw Error('invalid_capture');
 return {email:e,name,offer,session_id:body.session_id,platform:body.platform,attribution:attribution(body.attribution),is_test:body.is_test===true,
  marketing_consent:body.followup_requested===true,consent_source:'study_order_submit_v1',consent_text:'Continuando richiedi le istruzioni e fino a tre promemoria via email per completare questo ordine. Puoi interromperli in ogni email.'};
}
export const successful=name=>['purchase_confirmed','trial_started','subscription_started','subscription_renewed'].includes(name);
export function safeResumeTarget(offer){return Object.hasOwn(CHILDREN,offer)?PAGE:null;}
