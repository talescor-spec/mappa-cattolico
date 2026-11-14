import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { normalizeHotmart, validHottok } from '../_shared/hotmart.mjs';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
Deno.serve(async req => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  if (!await validHottok(req.headers.get('X-HOTMART-HOTTOK'), Deno.env.get('HOTMART_HOTTOK'))) return json({ error: 'unauthorized' }, 401);
  try {
    const body = await req.text(); if (body.length > 131072) return json({ error: 'payload_too_large' }, 413);
    const event = normalizeHotmart(JSON.parse(body));
    if (!event) return json({ ignored: true });
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const { data, error } = await db.rpc('fideora_process_hotmart_event', { p_event: event });
    if (error) { console.error('hotmart_processing_failed', error.code); return json({ error: 'processing_failed' }, 500); }
    return json(data);
  } catch { return json({ error: 'invalid_event' }, 400); }
});
