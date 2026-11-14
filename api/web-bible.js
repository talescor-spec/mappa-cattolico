import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const SUPABASE_URL = 'https://sysuottboucultzzaagv.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_VhLP3-YOdwoU6-hCZa4-QQ_tDmsJE4H';
const compressed = new Map();
export async function authorizeBible(authorization, request = fetch) {
  if (!/^Bearer [A-Za-z0-9_.-]+$/.test(authorization || '')) return 401;
  const response = await request(`${SUPABASE_URL}/functions/v1/fideora-web-access`, {
    method: 'POST', headers: { Authorization: authorization, apikey: PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'status' }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return response.status === 401 ? 401 : 503;
  const status = await response.json();
  return status.isPremium === true && status.userId && Date.parse(status.expiresAt) > Date.now() ? 200 : 403;
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store'); res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'GET') return res.status(405).end();
  const lang = new URL(req.url, 'https://fideora.app').searchParams.get('lang');
  if (!['it', 'pt'].includes(lang)) return res.status(400).json({ error: 'invalid_language' });
  try {
    const allowed = await authorizeBible(req.headers.authorization);
    if (allowed !== 200) return res.status(allowed).json({ error: allowed === 503 ? 'verification_unavailable' : 'premium_required' });
    // Files are included in this server function only, never in web-dist or the PWA cache.
    if (!compressed.has(lang)) compressed.set(lang, gzipSync(await readFile(new URL(`../public/bible/${lang}.json`, import.meta.url))));
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Content-Encoding', 'gzip');
    return res.status(200).end(compressed.get(lang));
  } catch { return res.status(503).json({ error: 'verification_unavailable' }); }
}
