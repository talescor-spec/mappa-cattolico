import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
const files = walk("dist").filter((f) => !f.endsWith("/sw.js"));
const version = crypto.createHash("sha256");
files.forEach((f) => version.update(fs.readFileSync(f)));
const name = `fideora-${version.digest("hex").slice(0, 12)}`;
const urls = files.map((f) => "/" + f.slice(5));
urls.push("/");
fs.writeFileSync(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(name)};const FILES=${JSON.stringify(urls)};self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('fideora-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!FILES.includes(url.pathname))return;event.respondWith(caches.match(url.pathname).then(cached=>cached||fetch(event.request)));});`,
);
console.log(
  `Offline cache: ${files.length} static files, ${(files.reduce((n, f) => n + fs.statSync(f).size, 0) / 1024 / 1024).toFixed(1)} MB`,
);
