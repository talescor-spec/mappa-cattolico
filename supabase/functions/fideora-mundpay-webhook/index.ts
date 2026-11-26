import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { mundpayAccess } from '../_shared/mundpay-access.ts';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const billing = mundpayAccess(db, 'fideora', name => Deno.env.get(name));
Deno.serve(req => billing.webhook(req));
