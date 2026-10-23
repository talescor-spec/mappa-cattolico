// This website has no account, checkout, marketing pixel or app entitlement state.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if(event.key==='ArrowRight') next=(i+1)%tabs.length;
    if(event.key==='ArrowLeft') next=(i+tabs.length-1)%tabs.length;
    if(event.key==='Home') next=0;
    if(event.key==='End') next=tabs.length-1;
    if(next!==undefined) { event.preventDefault(); selectTab(tabs[next], true); }
  });
});
// Keep campaign identifiers through the store visit. This is not install attribution.
const current = new URL(window.location.href);
const campaignKeys = ['utm_source','utm_medium','utm_campaign','utm_term'];
document.querySelectorAll('[data-store]').forEach(link => {
  const target = new URL(link.href);
  for(const key of campaignKeys) {
    const value=current.searchParams.get(key);
    if(value && value.length<=150 && /^[\p{L}\p{N}_. -]+$/u.test(value)) target.searchParams.set(key,value);
  }
  link.href=target.href;
});
// Preserve campaign query strings when switching language; never forward auth data.
document.querySelectorAll('.languages a').forEach(link => {
  const target = new URL(link.href);
  for(const key of campaignKeys) if(current.searchParams.has(key)) target.searchParams.set(key,current.searchParams.get(key).slice(0,150));
  link.href=target.href;
});
if(current.searchParams.get('lang')==='pt' && current.pathname==='/') {
  current.pathname='/pt/'; current.searchParams.delete('lang');
  window.location.replace(current.pathname+current.search+current.hash);
}
// An email return must not look like a logged-in web app or expose a session token.
if(/access_token=|refresh_token=|error_description=/.test(current.hash) || current.searchParams.has('code')) {
  const message=document.querySelector('.auth-message');
  if(message) message.hidden=false;
  history.replaceState(null,'',window.location.pathname);
}
// Update the old offline worker in place, without deleting any personal local data.
if('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async registrations => {
    for(const registration of registrations) {
      if(new URL(registration.active?.scriptURL || registration.waiting?.scriptURL || location.origin).pathname==='/sw.js') await registration.update();
    }
  }).catch(()=>{});
}
