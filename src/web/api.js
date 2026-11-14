import { supabase } from '../lib/supabase';
export const WEB_API = '/api/web-access';
export async function webRequest(action, authenticated = true) {
  const { data: { session } } = await supabase.auth.getSession();
  if (authenticated && !session?.access_token) throw new Error('authentication_required');
  const response = await fetch(WEB_API, {
    method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error(`web_access_${response.status}`);
  return response.json();
}
export function validCheckout(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'pay.hotmart.com' && !u.username && !u.password; }
  catch { return false; }
}
