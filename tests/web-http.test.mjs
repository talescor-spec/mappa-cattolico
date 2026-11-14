import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
let server, base;
before(async () => {
  server=spawn(process.execPath,['scripts/preview-web.mjs'],{env:{...process.env,FIDEORA_PREVIEW_PORT:'0'}});
  base=await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('preview_start_timeout')),10000);
    server.once('error',reject);server.stdout.on('data',chunk=>{
      const url=String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];if(url){clearTimeout(timeout);resolve(url);}
    });
  });
});
after(()=>server?.kill());
test('production PWA has a separate app scope and install manifest without publishing the Bible files',async()=>{
  const response=await fetch(base+'/app/');assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/\/app\/manifest.webmanifest/);
  const manifest=await(await fetch(base+'/app/manifest.webmanifest')).json();assert.equal(manifest.scope,'/app/');assert.equal(manifest.start_url,'/app/');
  const worker=await(await fetch(base+'/app/sw.js')).text();assert.equal(worker.includes('bible/'),false);assert.equal(worker.includes('/api/'),false);
  assert.equal((await fetch(base+'/app/bible/it.json')).status,404);assert.equal((await fetch(base+'/bible/it.json')).status,404);
});
test('HTTP access endpoints reject anonymous content access, invalid languages, unsupported methods and unrecognized actions',async()=>{
  const bible=await fetch(base+'/api/web-bible?lang=it');assert.equal(bible.status,401);assert.match(bible.headers.get('cache-control'),/no-store/);
  assert.equal((await fetch(base+'/api/web-bible?lang=../../private')).status,400);
  assert.equal((await fetch(base+'/api/web-access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'status'})})).status,401);
  assert.equal((await fetch(base+'/api/web-access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'grant',premium:true})})).status,400);
});
