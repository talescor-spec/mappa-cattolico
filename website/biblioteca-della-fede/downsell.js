
(function(){
  'use strict';
  var localPreview=location.protocol==='file:'||['terminal.local','localhost','127.0.0.1'].includes(location.hostname);
  if(localPreview)return;
  window.pixelId='6aa571799e8af496b986a464';
  var pixel=document.createElement('script');pixel.src='https://cdn.utmify.com.br/scripts/pixel/pixel.js';pixel.async=true;pixel.defer=true;document.head.appendChild(pixel);
  var utms=document.createElement('script');utms.src='https://cdn.utmify.com.br/scripts/utms/latest.js';utms.async=true;utms.defer=true;utms.setAttribute('data-utmify-prevent-xcod-sck','');utms.setAttribute('data-utmify-prevent-subids','');document.head.appendChild(utms);
  (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:6850260,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
})();
