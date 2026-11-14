// Local QA only: serves exactly the production output and the same API handlers.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import access from '../api/web-access.js';
import bible from '../api/web-bible.js';
const root = path.resolve('web-dist');
const server = http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  res.json = data => { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(data)); };
  try {
    const url = new URL(req.url,'http://localhost:4173');
    if (url.pathname === '/api/web-access') {
      let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)return res.status(413).end();}
      try { req.body=JSON.parse(body); } catch { return res.status(400).end(); }
      return await access(req,res);
    }
    if (url.pathname === '/api/web-bible') return await bible(req,res);
    if(url.pathname === '/app'){res.statusCode=302;res.setHeader('Location','/app/');return res.end();}
    const name = decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':'');
    const file=path.resolve(root,'.'+name);
    if(!file.startsWith(root+path.sep))return res.status(403).end();
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-cache');res.end(await fs.readFile(file));
  } catch { res.status(404).end(); }
});
server.listen(Number(process.env.FIDEORA_PREVIEW_PORT || 4173),'0.0.0.0',()=>console.log(`Fideora local review: http://127.0.0.1:${server.address().port}/app/`));
