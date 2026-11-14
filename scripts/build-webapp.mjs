import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'vite';
fs.mkdirSync('web-public', { recursive: true });
for (const file of ['icon.svg', 'icon-192.png', 'icon-512.png']) fs.copyFileSync(`public/${file}`, `web-public/${file}`);
const manifest = { id: '/app/', name: 'Fideora · Mappa della Bibbia', short_name: 'Fideora', lang: 'it',
  start_url: '/app/', scope: '/app/', display: 'standalone', background_color: '#f7f8f5', theme_color: '#294e40',
  icons: [192, 512].map(size => ({ src: `/app/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })) };
fs.writeFileSync('web-public/manifest.webmanifest', JSON.stringify(manifest));
await build({ configFile: 'vite.web.config.js' });
// Vite's root is webapp, while this entry deliberately lives with the shared native UI.
const out = 'web-dist/app';
const files = fs.readdirSync(out, { recursive: true }).filter(f => fs.statSync(path.join(out, f)).isFile());
if (files.some(f => /bible\//.test(f))) throw new Error('Bible corpus must only be served by the authenticated API');
const hash = crypto.createHash('sha256'); files.forEach(f => hash.update(fs.readFileSync(path.join(out, f))));
const version = `fideora-web-${hash.digest('hex').slice(0, 12)}`;
const urls = ['/app/', ...files.map(f => `/app/${f}`)];
fs.writeFileSync(`${out}/sw.js`, `const CACHE=${JSON.stringify(version)};const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fideora-web-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.search||!ASSETS.includes(u.pathname))return;e.respondWith(caches.match(u.pathname).then(c=>c||fetch(e.request)));});`);
console.log(`Web app built at /app/: ${files.length} public assets. API, tokens and Bible responses never enter the service worker cache.`);
