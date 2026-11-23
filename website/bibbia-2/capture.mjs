import { release } from './release.mjs';
import { editionCheckout } from './order-core.mjs';
import { countryCodes,normalizeAddress } from './address.mjs';
import { cleanName,cleanEmail,prefillContact,rememberContact,contactKey } from '../mappa-della-bibbia/order-core.mjs';

export function initCapture({variant,attribution,sessionID,platform,tracker,collect,storage,incomingURL}){
 const dialog=document.querySelector('.capture-dialog'),contactForm=dialog.querySelector('[data-contact-form]'),addressForm=dialog.querySelector('[data-address-form]');
 const name=contactForm.elements.name,email=contactForm.elements.email;
 const error=dialog.querySelector('[data-capture-error]'),submit=dialog.querySelector('[data-capture-submit]'),payment=dialog.querySelector('[data-payment-link]'),reset=dialog.querySelector('[data-capture-reset]');
 const isTest=incomingURL.searchParams.get('fm_test')==='1';
 const saved=prefillContact(incomingURL.search,storage);name.value=saved.name||'';email.value=saved.email||'';reset.hidden=!(saved.name||saved.email);
 let step=1,opener,request=0,redirectTimer,redirectTarget=null;
 const fields=['street','number','complement','postal_code','city','state','country'];
 let regionNames;try{regionNames=new Intl.DisplayNames(['it'],{type:'region'});}catch{}
 for(const code of countryCodes.filter(c=>c!=='IT').sort((a,b)=>(regionNames?.of(a)||a).localeCompare(regionNames?.of(b)||b,'it'))){const option=document.createElement('option');option.value=code;option.textContent=regionNames?.of(code)||code;addressForm.elements.country.append(option);}
 function postalRules(){const italy=addressForm.elements.country.value==='IT',postal=addressForm.elements.postal_code;postal.required=italy;postal.inputMode=italy?'numeric':'text';postal.pattern=italy?'[0-9]{5}':'[\\p{L}\\p{N} \\-]{2,16}';postal.setCustomValidity('');}
 addressForm.elements.country.addEventListener('change',postalRules);postalRules();
 function keepFocusVisible(){const el=document.activeElement;if(!dialog.contains(el)||!['INPUT','SELECT','BUTTON'].includes(el.tagName))return;const box=el.getBoundingClientRect(),frame=dialog.getBoundingClientRect();if(box.bottom>frame.bottom-18)dialog.scrollTop+=box.bottom-frame.bottom+24;else if(box.top<frame.top+18)dialog.scrollTop-=frame.top+18-box.top;}
 function syncViewport(){if(!dialog.open)return;const v=window.visualViewport;if(matchMedia('(max-width:540px)').matches){dialog.style.setProperty('--capture-visible-height',Math.max(220,Math.round((v?.height||innerHeight)-24))+'px');dialog.style.setProperty('--capture-visible-top',Math.max(0,Math.round(v?.offsetTop||0))+'px');}requestAnimationFrame(keepFocusVisible);}
 window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);window.addEventListener('resize',syncViewport);dialog.addEventListener('focusin',syncViewport);
 const show=next=>{clearTimeout(redirectTimer);step=next;dialog.dataset.captureStage=String(step);dialog.querySelectorAll('[data-capture-step]').forEach(el=>el.hidden=Number(el.dataset.captureStep)!==step);dialog.querySelectorAll('[data-capture-indicator]').forEach(el=>{if(Number(el.dataset.captureIndicator)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});dialog.setAttribute('aria-labelledby',step===1?'capture-heading':step===2?'capture-address-heading':'capture-payment-heading');error.hidden=true;dialog.scrollTop=0;dialog.querySelector('[data-capture-current]').textContent=`Passaggio ${step} di 3`;syncViewport();};
 const open=source=>{opener=source;request++;submit.disabled=false;submit.textContent='Continua al pagamento';show(1);dialog.showModal();document.body.classList.add('dialog-open');collect('capture_started');syncViewport();};
 document.querySelectorAll('[data-checkout]').forEach(button=>{button.href='#ordine';button.textContent=`Voglio ${variant.name} e i due bonus`;button.addEventListener('click',event=>{event.preventDefault();open(button);});});
 document.querySelector('[data-release-note]').textContent='I tuoi dati, indirizzo e pagamento sicuro. Libro e due bonus inclusi · €27, una sola volta.';
 dialog.querySelector('[data-capture-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{request++;clearTimeout(redirectTimer);document.body.classList.remove('dialog-open');opener?.focus({preventScroll:true});});
 reset.addEventListener('click',()=>{request++;try{storage?.removeItem(contactKey);}catch{}contactForm.reset();addressForm.reset();postalRules();reset.hidden=true;redirectTarget=null;show(1);name.focus({preventScroll:true});});
 contactForm.addEventListener('submit',event=>{event.preventDefault();if(!contactForm.reportValidity())return;const n=cleanName(name.value),e=cleanEmail(email.value);if(!n){name.setCustomValidity('Inserisci nome e cognome (almeno 2 caratteri).');name.reportValidity();return;}if(!e){email.setCustomValidity('Controlla il tuo indirizzo email.');email.reportValidity();return;}name.value=n;email.value=e;show(2);});
 for(const field of [name,email])field.addEventListener('input',()=>field.setCustomValidity(''));
 addressForm.elements.postal_code.addEventListener('input',()=>addressForm.elements.postal_code.setCustomValidity(''));
 dialog.querySelector('[data-capture-back]').addEventListener('click',()=>{request++;submit.disabled=false;show(1);});
 dialog.querySelector('[data-capture-edit]').addEventListener('click',()=>{request++;submit.disabled=false;show(2);});
 const checkoutEvent=()=>{collect('checkout_click');if(!isTest)tracker?.outbound('book');};
 payment.addEventListener('click',event=>{if(!release.checkoutConfigured||!redirectTarget){event.preventDefault();return;}clearTimeout(redirectTimer);checkoutEvent();});
 addressForm.addEventListener('submit',async event=>{
  event.preventDefault();if(submit.disabled||!addressForm.reportValidity())return;
  const current=++request;let address;
  try{address=normalizeAddress(Object.fromEntries(fields.map(key=>[key,addressForm.elements[key].value])));}catch(e){const invalid=e.message==='invalid_postal_code'?addressForm.elements.postal_code:null;if(invalid){invalid.setCustomValidity('Inserisci un CAP valido (5 cifre per l’Italia).');invalid.reportValidity();}else{error.textContent='Controlla i dati del tuo indirizzo.';error.hidden=false;}return;}
  submit.disabled=true;submit.textContent='Un momento…';error.hidden=true;
  try{
   if(!release.checkoutConfigured)throw Error('preparing');
   const contact={name:cleanName(name.value),email:cleanEmail(email.value)};
   const response=await fetch('/api/bible-capture',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({...contact,address,offer:'book',variant:variant.id,attribution,session_id:sessionID,platform,is_test:isTest,followup_requested:true,company:contactForm.elements.company.value}),signal:AbortSignal.timeout(22000)});
   const data=await response.json();if(!response.ok||data.ok!==true||data.offer!=='book')throw Error('capture_failed');
   if(!isTest)tracker?.lead('book',data.journeyId);
   if(current!==request||!dialog.open)return;
   if(!isTest){rememberContact(storage,contact);reset.hidden=false;}
   redirectTarget=editionCheckout(release.checkoutURL,contact,attribution,address);payment.href=redirectTarget;
   dialog.querySelector('[data-contact-summary]').textContent=`${contact.name} · ${contact.email}`;show(3);
   redirectTimer=setTimeout(()=>{if(current!==request||!dialog.open||step!==3)return;checkoutEvent();location.assign(redirectTarget);},300);
  }catch(e){if(current!==request||!dialog.open)return;collect('capture_error');error.textContent=e.message==='preparing'?'Stiamo completando la nuova edizione. Torna a breve per proseguire con l’ordine.':'Non siamo riusciti a salvare i tuoi dati. Controlla la connessione e riprova. Nessun addebito è stato effettuato.';error.hidden=false;}
  finally{if(current===request){submit.disabled=false;submit.textContent='Continua al pagamento';}}
 });
 const resume=incomingURL.searchParams.get('resume');
 if(resume){const cleaned=new URL(location.href);cleaned.searchParams.delete('resume');history.replaceState(null,'',cleaned);void fetch('/api/study-resume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:resume}),signal:AbortSignal.timeout(12000)}).then(r=>r.ok?r.json():null).then(data=>{if(!data?.ok||data.offer!=='book')return;const n=cleanName(data.name),e=cleanEmail(data.email);if(!n||!e)return;name.value=n;email.value=e;if(data.address)try{const address=normalizeAddress(data.address);for(const key of fields)addressForm.elements[key].value=address[key];postalRules();}catch{}open();collect('resume_open');}).catch(()=>{});}
}
