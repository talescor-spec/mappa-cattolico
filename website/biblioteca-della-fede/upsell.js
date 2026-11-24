document.querySelectorAll('[data-embedded-copy]').forEach(function(img){img.src=document.querySelector('[data-embedded="'+img.dataset.embeddedCopy+'"]').src;});

/* CONFIGURAZIONE DELL’OFFERTA. Inserire soltanto l’ID Mundpay di QUESTA biblioteca. */
window.BIBLIOTECA_CONFIG = Object.freeze({
  price:37,
  mundpayUpsellId:"01a20e7a-0fab-717a-af27-c4d73e8a9f03",
  pixelId:"6aa571799e8af496b986a464",
  hotjarId:6850260,
  analyticsEnabled:true
});


(function(){
  'use strict';
  const books=JSON.parse(document.getElementById('collection-data').textContent);
  const cfg=window.BIBLIOTECA_CONFIG;
  const total=books.reduce((sum,b)=>sum+b.price,0);
  document.querySelectorAll('[data-total]').forEach(n=>n.textContent=total+' €');
  document.querySelectorAll('[data-price]').forEach(n=>n.textContent=cfg.price);
  const paths={capire:['donne','salomone','atlante'],pregare:['salmi','preghiere','cammino'],famiglia:['natale','parabole'],coltivare:['segnalibri','cammino','germoglio']};
  let activePath='';
  document.querySelectorAll('[data-path]').forEach(button=>button.addEventListener('click',()=>{
    activePath=activePath===button.dataset.path?'':button.dataset.path;
    document.querySelectorAll('[data-path]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.path===activePath)));
    const selected=paths[activePath]||[];
    document.querySelectorAll('.book-card').forEach(card=>card.classList.toggle('is-picked',selected.includes(card.dataset.book)));
    document.getElementById('path-note').textContent=activePath?'Il percorso scelto è evidenziato nella collezione. Tutti e dieci i titoli restano inclusi.':'Tutti e dieci i titoli sono inclusi nella biblioteca.';
  }));
  const dialog=document.getElementById('cover-dialog');
  document.querySelectorAll('[data-cover]').forEach(button=>button.addEventListener('click',()=>{
    const b=books.find(v=>v.id===button.dataset.cover);
    const img=button.querySelector('img');
    document.getElementById('dialog-image').src=img.currentSrc||img.src;
    document.getElementById('dialog-image').alt='Copertina del libro '+b.title;
    document.getElementById('dialog-title').textContent=b.title;
    document.getElementById('dialog-sub').textContent=b.subtitle;
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  const localPreview=location.protocol==='file:'||['terminal.local','localhost','127.0.0.1'].includes(location.hostname);
  if(cfg.analyticsEnabled&&!localPreview){
    window.pixelId=cfg.pixelId;
    const pixel=document.createElement('script');pixel.src='https://cdn.utmify.com.br/scripts/pixel/pixel.js';pixel.async=true;pixel.defer=true;document.head.appendChild(pixel);
    const utms=document.createElement('script');utms.src='https://cdn.utmify.com.br/scripts/utms/latest.js';utms.async=true;utms.defer=true;utms.setAttribute('data-utmify-prevent-xcod-sck','');utms.setAttribute('data-utmify-prevent-subids','');document.head.appendChild(utms);
    (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:cfg.hotjarId,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
})();
