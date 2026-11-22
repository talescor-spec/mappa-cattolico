import { release } from './release.mjs';
import { editionCheckout } from './order-core.mjs';
import { cleanName,cleanEmail,prefillContact,rememberContact } from '../mappa-della-bibbia/order-core.mjs';

export function initCapture({variant,attribution,sessionID,platform,tracker,collect,storage,incomingURL}){
  const dialog=document.querySelector('.capture-dialog');
  const name=dialog.querySelector('[name="name"]'),email=dialog.querySelector('[name="email"]');
  const error=dialog.querySelector('[data-capture-error]'),submit=dialog.querySelector('[data-capture-submit]');
  const payment=dialog.querySelector('[data-payment-link]');
  const isTest=incomingURL.searchParams.get('fm_test')==='1';
  const saved=prefillContact(incomingURL.search,storage);name.value=saved.name||'';email.value=saved.email||'';
  let step=1,opener,request=0;
  const show=(next)=>{
    step=next;
    dialog.querySelectorAll('[data-capture-step]').forEach(el=>el.hidden=Number(el.dataset.captureStep)!==step);
    dialog.querySelectorAll('[data-capture-indicator]').forEach(el=>{if(Number(el.dataset.captureIndicator)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    error.hidden=true;dialog.scrollTop=0;
    dialog.querySelector('[data-capture-current]').textContent=`Passaggio ${step} di 3`;
  };
  const open=(source)=>{opener=source;request++;submit.disabled=false;submit.textContent='Continua';show(1);dialog.showModal();document.body.classList.add('dialog-open');collect('capture_started');};
  document.querySelectorAll('[data-checkout]').forEach(button=>{button.href='#ordine';button.textContent=`Voglio ${variant.name} e i due bonus`;button.addEventListener('click',e=>{e.preventDefault();open(button);});});
  document.querySelector('[data-release-note]').textContent='Nome, email e pagamento sicuro. Libro e due bonus inclusi · €27, una sola volta.';
  dialog.querySelector('[data-capture-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{request++;document.body.classList.remove('dialog-open');opener?.focus({preventScroll:true});});
  dialog.querySelector('[data-name-form]').addEventListener('submit',event=>{
    event.preventDefault();if(!name.reportValidity())return;
    if(!cleanName(name.value)){name.setCustomValidity('Inserisci il tuo nome (almeno 2 caratteri).');name.reportValidity();return;}
    name.value=cleanName(name.value);show(2);email.focus({preventScroll:true});
  });
  name.addEventListener('input',()=>name.setCustomValidity(''));
  dialog.querySelector('[data-capture-back]').addEventListener('click',()=>{show(1);name.focus({preventScroll:true});});
  dialog.querySelector('[data-capture-edit]').addEventListener('click',()=>{show(2);email.focus({preventScroll:true});});
  dialog.querySelector('[data-email-form]').addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled||!email.reportValidity())return;
    if(!cleanEmail(email.value)){email.setCustomValidity('Controlla il tuo indirizzo email.');email.reportValidity();return;}
    const current=++request;submit.disabled=true;submit.textContent='Un momento…';error.hidden=true;
    try{
      if(!release.fulfillmentVerified&&!isTest)throw Error('preparing');
      const contact={name:cleanName(name.value),email:cleanEmail(email.value)};
      const response=await fetch('/api/bible-capture',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({...contact,offer:'book',variant:variant.id,attribution,session_id:sessionID,platform,is_test:isTest,followup_requested:true,company:dialog.querySelector('[name="company"]').value}),signal:AbortSignal.timeout(22000)});
      const data=await response.json();if(!response.ok||data.ok!==true||data.offer!=='book')throw Error('capture_failed');
      rememberContact(storage,contact);
      if(!isTest)tracker?.lead('book',data.journeyId);
      if(current!==request||!dialog.open)return;
      payment.href=editionCheckout(release.checkoutURL,contact,attribution);
      dialog.querySelector('[data-contact-summary]').textContent=`${contact.name} · ${contact.email}`;
      show(3);payment.focus({preventScroll:true});
    }catch(e){
      if(current!==request||!dialog.open)return;
      collect('capture_error');error.textContent=e.message==='preparing'?'Stiamo completando la nuova edizione. Torna a breve per proseguire con l’ordine.':'Non siamo riusciti a salvare i tuoi dati. Controlla la connessione e riprova. Nessun addebito è stato effettuato.';error.hidden=false;
    }finally{if(current===request){submit.disabled=false;submit.textContent='Continua';}}
  });
  email.addEventListener('input',()=>email.setCustomValidity(''));
  payment.addEventListener('click',event=>{if(!release.fulfillmentVerified){event.preventDefault();error.textContent='Il nuovo checkout è in preparazione.';error.hidden=false;return;}collect('checkout_click');tracker?.outbound('book');});
  const resume=incomingURL.searchParams.get('resume');
  if(resume){
    const cleaned=new URL(location.href);cleaned.searchParams.delete('resume');history.replaceState(null,'',cleaned);
    void fetch('/api/study-resume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:resume}),signal:AbortSignal.timeout(12000)}).then(r=>r.ok?r.json():null).then(data=>{if(!data?.ok||data.offer!=='book')return;const n=cleanName(data.name),e=cleanEmail(data.email);if(!n||!e)return;name.value=n;email.value=e;open();collect('resume_open');}).catch(()=>{});
  }
}
