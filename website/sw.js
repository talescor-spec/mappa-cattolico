// Retirement worker for the former public web app. Personal localStorage is untouched.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('fideora-')).map(key=>caches.delete(key)));
    await self.clients.claim();
    const pages=await self.clients.matchAll({type:'window'});
    await Promise.all(pages.map(page=>page.navigate(page.url).catch(()=>{})));
    await self.registration.unregister();
  })());
});
