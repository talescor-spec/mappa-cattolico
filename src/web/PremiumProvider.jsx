import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PremiumContext } from '../contexts/PremiumContext';
import { useAuth } from '../contexts/AuthContext';
import { webRequest } from './api';
export default function WebPremiumProvider({ children }) {
  const { user, loading } = useAuth();
  const owner = user?.id || null, identity = useRef(owner); identity.current = owner;
  const [snapshot, setSnapshot] = useState(null), [checking, setChecking] = useState(true);
  const [error, setError] = useState(false), [clock, setClock] = useState(Date.now());
  const refresh = useCallback(async () => {
    if (loading) return false;
    const id = owner;
    if (!id) { setSnapshot(null); setChecking(false); setError(false); return false; }
    try {
      const value = await webRequest('status');
      if (identity.current !== id || value.userId !== id) return false;
      setSnapshot({ ...value, owner: id }); setError(false);
      return value.isPremium;
    } catch { if (identity.current === id) { setSnapshot(null); setError(true); } return false; }
    finally { if (identity.current === id) setChecking(false); }
  }, [owner, loading]);
  useEffect(() => { setChecking(true); setSnapshot(null); void refresh(); }, [refresh]);
  useEffect(() => {
    const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
    const timer = setInterval(() => { setClock(Date.now()); void refresh(); }, 45000);
    window.addEventListener('online', refresh); document.addEventListener('visibilitychange', visible);
    return () => { clearInterval(timer); window.removeEventListener('online', refresh); document.removeEventListener('visibilitychange', visible); };
  }, [refresh]);
  const isPremium = Boolean(snapshot?.owner === owner && snapshot?.isPremium && Date.parse(snapshot.expiresAt) > clock);
  return <PremiumContext.Provider value={{ isPremium, checking: loading || checking,
    busy: false, message: error ? 'error' : '', offer: null, preparing: false, refresh, billingProvider: 'hotmart',
    can: (_feature, { existing = false } = {}) => existing || isPremium,
    request: () => { window.location.assign('/app/?plans=1'); }, close: () => {},
    subscribe: () => { window.location.assign('/app/?plans=1'); }, restore: refresh,
    manage: () => { window.location.assign('https://consumer.hotmart.com/'); },
    expiresAt: snapshot?.expiresAt, webError: error,
  }}>{children}</PremiumContext.Provider>;
}
