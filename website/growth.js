// Aggregate funnel measurement; no email, Apple identity, IP or persistent cookie.
(() => {
 const current=new URL(location.href);
 if(current.searchParams.has('code')||/access_token=|refresh_token=/.test(current.hash))return;
 const endpoint='https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?growth=1&action=collect';
 const safe=v=>String(v||'').replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,100);
 const locale=document.documentElement.lang.startsWith('pt')?'pt':'it';
 const platform=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'ios':/Android/.test(navigator.userAgent)?'android':'desktop';
 const campaign=safe(current.searchParams.get('ct')||current.searchParams.get('utm_campaign')||'fd2_site_'+locale);
 const trackingAllowed=navigator.doNotTrack!=='1'&&navigator.globalPrivacyControl!==true;
 let session;
 try{session=sessionStorage.getItem('fideoraGrowthSession');if(!session){session=crypto.randomUUID();sessionStorage.setItem('fideoraGrowthSession',session);}}catch{session=crypto.randomUUID();}
 const sent=new Set();
 function track(event_name,content=''){
  const key=event_name+':'+content;if(sent.has(key)||!trackingAllowed)return;sent.add(key);
  const body=JSON.stringify({event_name,content:safe(content),session_id:session,campaign,platform,locale,page_path:location.pathname,is_test:current.searchParams.get('fm_test')==='1'});
  fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true,credentials:'omit',referrerPolicy:'no-referrer'}).catch(()=>{});
 }
 // Only Apple-bound visits are store clicks. Android access is not an install.
 document.querySelectorAll('[data-store], [data-platform-link]').forEach(link=>{
  link.addEventListener('click',()=>{
   const target=new URL(link.href);
   if(target.hostname==='apps.apple.com') track('store_click',link.dataset.store||link.dataset.platformLink||'cta');
  });
 });
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){track('demo_view',e.target.id||'demo');observer.unobserve(e.target);}},{threshold:.4}):null;
 document.querySelectorAll('#mappa,#app,.growth-demo').forEach(el=>observer?.observe(el));
 track('page_view',safe(current.searchParams.get('utm_content')));
})();
