// Retirement worker for the former public web app. Personal localStorage is untouched.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('fideora-')).map(key=>caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();
    const pages=await self.clients.matchAll({type:'window'});
    // Do not keep activation open while waiting for a navigation that may itself
    // wait for activation to finish. Unregister before scheduling each refresh.
    for(const page of pages) void page.navigate(page.url).catch(()=>{});
  })());
});
