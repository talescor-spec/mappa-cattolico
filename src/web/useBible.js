import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
export async function loadBible(language) {
  if (!['it', 'pt'].includes(language)) throw new Error('invalid_language');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('authentication_required');
  const result = await fetch(`/api/web-bible?lang=${language}`, { cache: 'no-store', headers: { Authorization: `Bearer ${session.access_token}` } });
  if (!result.ok) throw new Error('bible_unavailable');
  return result.json();
}
export default function useBible(language) {
  const [bible, setBible] = useState(null), [error, setError] = useState(false), [attempt, setAttempt] = useState(0);
  useEffect(() => { let alive = true; setBible(null); setError(false);
    loadBible(language).then(value => { if (alive) setBible(value); }).catch(() => { if (alive) setError(true); });
    return () => { alive = false; }; }, [language, attempt]);
  return { bible, error, retry: () => setAttempt(value => value + 1) };
}
