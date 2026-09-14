import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  normalizeNovenaProgress,
  normalizeRosaryProgress,
  safeGet,
  safeGetJSON,
  safeSet,
  safeSetJSON,
  sanitizeDisplayName,
} from '../utils/storage';
import { clearPurchasesUser, syncPurchasesUser } from '../services/purchases';

const AuthContext = createContext(null);
const VALID_LOCALES = new Set(['it', 'fr', 'es', 'pt', 'en', 'de']);
const PERSONAL_LOCAL_KEYS = [
  'fideoraUserName',
  'rosaryProgress',
  'novenaProgress',
  'fideoraStreak',
  'fideoraLastVisit',
];

function normalizeLocale(value) {
  return VALID_LOCALES.has(value) ? value : 'pt';
}

function mergeRosaryProgress(localValue, remoteValue) {
  const local = normalizeRosaryProgress(localValue);
  const remote = normalizeRosaryProgress(remoteValue);
  const merged = { ...remote };

  for (const [dateKey, day] of Object.entries(local)) {
    merged[dateKey] = { ...(merged[dateKey] || {}) };
    for (const [mysteryId, step] of Object.entries(day)) {
      merged[dateKey][mysteryId] = Math.max(Number(merged[dateKey][mysteryId] || 0), Number(step || 0));
    }
  }

  return normalizeRosaryProgress(merged);
}

function mergeNovenaProgress(localValue, remoteValue) {
  const local = normalizeNovenaProgress(localValue);
  const remote = normalizeNovenaProgress(remoteValue);
  const merged = { ...remote };

  for (const [novenaId, day] of Object.entries(local)) {
    merged[novenaId] = Math.max(Number(merged[novenaId] || 0), Number(day || 0));
  }

  return normalizeNovenaProgress(merged);
}

function readLocalSnapshot() {
  return {
    displayName: sanitizeDisplayName(safeGet('fideoraUserName', '')),
    locale: normalizeLocale(safeGet('fideoraLanguage', 'pt')),
    rosaryProgress: normalizeRosaryProgress(safeGetJSON('rosaryProgress', {})),
    novenaProgress: normalizeNovenaProgress(safeGetJSON('novenaProgress', {})),
  };
}

function snapshotsDiffer(local, merged) {
  return (
    local.displayName !== merged.displayName ||
    local.locale !== merged.locale ||
    JSON.stringify(local.rosaryProgress) !== JSON.stringify(merged.rosaryProgress) ||
    JSON.stringify(local.novenaProgress) !== JSON.stringify(merged.novenaProgress)
  );
}

function clearPersonalLocalData() {
  for (const key of PERSONAL_LOCAL_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore unavailable storage. Auth state remains server-authoritative.
    }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cloudProgress, setCloudProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastError, setLastError] = useState('');
  const userRef = useRef(null);
  const hydratingRef = useRef(false);
  const hydrationPromiseRef = useRef(null);

  const updateProfile = useCallback(async (changes = {}) => {
    const currentUser = userRef.current;
    if (!currentUser) return { skipped: true };

    const patch = { user_id: currentUser.id };
    if (Object.prototype.hasOwnProperty.call(changes, 'displayName')) {
      patch.display_name = sanitizeDisplayName(changes.displayName, 80);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'locale')) {
      patch.locale = normalizeLocale(changes.locale);
    }

    if (Object.keys(patch).length === 1) return { skipped: true };

    setSyncStatus('syncing');
    const { data, error } = await supabase
      .from('fideora_profiles')
      .upsert(patch, { onConflict: 'user_id' })
      .select('user_id, display_name, locale, updated_at')
      .single();

    if (error) {
      setSyncStatus('error');
      setLastError(error.message);
      throw error;
    }

    setProfile(data);
    setSyncStatus('synced');
    setLastError('');
    return { data };
  }, []);

  const syncProgress = useCallback(async (changes = {}) => {
    const currentUser = userRef.current;
    if (!currentUser) return { skipped: true };

    const patch = { user_id: currentUser.id };
    if (Object.prototype.hasOwnProperty.call(changes, 'rosaryProgress')) {
      patch.rosary_progress = normalizeRosaryProgress(changes.rosaryProgress);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'novenaProgress')) {
      patch.novena_progress = normalizeNovenaProgress(changes.novenaProgress);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'lastReadingKey')) {
      patch.last_reading_key = changes.lastReadingKey ? String(changes.lastReadingKey).slice(0, 120) : null;
      patch.last_reading_at = changes.lastReadingKey ? new Date().toISOString() : null;
    }

    if (Object.keys(patch).length === 1) return { skipped: true };

    setSyncStatus('syncing');
    const { data, error } = await supabase
      .from('fideora_progress')
      .upsert(patch, { onConflict: 'user_id' })
      .select('user_id, rosary_progress, novena_progress, last_reading_key, last_reading_at, updated_at')
      .single();

    if (error) {
      setSyncStatus('error');
      setLastError(error.message);
      throw error;
    }

    setCloudProgress(data);
    setSyncStatus('synced');
    setLastError('');
    return { data };
  }, []);

  const hydrateUser = useCallback(async (nextUser) => {
    if (!nextUser) return;
    if (hydrationPromiseRef.current?.userId === nextUser.id) return hydrationPromiseRef.current.promise;

    const promise = (async () => {
      setSyncStatus('syncing');
      setLastError('');
      const local = readLocalSnapshot();

      const [profileResult, progressResult] = await Promise.all([
        supabase
          .from('fideora_profiles')
          .select('user_id, display_name, locale, updated_at')
          .eq('user_id', nextUser.id)
          .maybeSingle(),
        supabase
          .from('fideora_progress')
          .select('user_id, rosary_progress, novena_progress, last_reading_key, last_reading_at, updated_at')
          .eq('user_id', nextUser.id)
          .maybeSingle(),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (progressResult.error) throw progressResult.error;

      const remoteProfile = profileResult.data;
      const remoteProgress = progressResult.data;
      const merged = {
        displayName: sanitizeDisplayName(remoteProfile?.display_name || local.displayName, 80),
        locale: normalizeLocale(remoteProfile?.locale || local.locale),
        rosaryProgress: mergeRosaryProgress(local.rosaryProgress, remoteProgress?.rosary_progress || {}),
        novenaProgress: mergeNovenaProgress(local.novenaProgress, remoteProgress?.novena_progress || {}),
      };

      await Promise.all([
        supabase.from('fideora_profiles').upsert({
          user_id: nextUser.id,
          display_name: merged.displayName,
          locale: merged.locale,
        }, { onConflict: 'user_id' }),
        supabase.from('fideora_progress').upsert({
          user_id: nextUser.id,
          rosary_progress: merged.rosaryProgress,
          novena_progress: merged.novenaProgress,
        }, { onConflict: 'user_id' }),
      ]);

      const shouldReload = snapshotsDiffer(local, merged);
      hydratingRef.current = true;
      safeSet('fideoraUserName', merged.displayName);
      safeSet('fideoraLanguage', merged.locale);
      safeSetJSON('rosaryProgress', merged.rosaryProgress);
      safeSetJSON('novenaProgress', merged.novenaProgress);
      hydratingRef.current = false;

      setProfile({
        user_id: nextUser.id,
        display_name: merged.displayName,
        locale: merged.locale,
      });
      setCloudProgress({
        user_id: nextUser.id,
        rosary_progress: merged.rosaryProgress,
        novena_progress: merged.novenaProgress,
        last_reading_key: remoteProgress?.last_reading_key || null,
        last_reading_at: remoteProgress?.last_reading_at || null,
      });

      await syncPurchasesUser(nextUser.id);
      setSyncStatus('synced');

      const markerKey = `fideoraCloudHydrated:${nextUser.id}`;
      let alreadyReloaded = false;
      try {
        alreadyReloaded = window.sessionStorage.getItem(markerKey) === '1';
        window.sessionStorage.setItem(markerKey, '1');
      } catch {
        // Session storage can be unavailable in restrictive browsers.
      }

      if (shouldReload && !alreadyReloaded) {
        window.location.reload();
      }
    })().catch((error) => {
      setSyncStatus('error');
      setLastError(error?.message || 'cloud_sync_failed');
      console.error('Fideora cloud hydration failed', error);
    }).finally(() => {
      hydrationPromiseRef.current = null;
    });

    hydrationPromiseRef.current = { userId: nextUser.id, promise };
    return promise;
  }, []);

  const applyUser = useCallback(async (nextUser) => {
    userRef.current = nextUser || null;
    setUser(nextUser || null);

    if (!nextUser) {
      setProfile(null);
      setCloudProgress(null);
      setSyncStatus('idle');
      setLoading(false);
      return;
    }

    await hydrateUser(nextUser);
    setLoading(false);
  }, [hydrateUser]);

  useEffect(() => {
    let alive = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!alive) return;
      if (error) {
        setLastError(error.message);
        setLoading(false);
        return;
      }
      applyUser(data?.user || null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        if (alive) applyUser(session?.user || null);
      }, 0);
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [applyUser]);

  useEffect(() => {
    const onLocalChange = (event) => {
      if (hydratingRef.current || !userRef.current) return;
      const key = event?.detail?.key;

      if (key === 'fideoraUserName') {
        updateProfile({ displayName: safeGet('fideoraUserName', '') }).catch(() => {});
      } else if (key === 'rosaryProgress') {
        syncProgress({ rosaryProgress: safeGetJSON('rosaryProgress', {}) }).catch(() => {});
      } else if (key === 'novenaProgress') {
        syncProgress({ novenaProgress: safeGetJSON('novenaProgress', {}) }).catch(() => {});
      }
    };

    window.addEventListener('fideora:local-change', onLocalChange);
    return () => window.removeEventListener('fideora:local-change', onLocalChange);
  }, [syncProgress, updateProfile]);

  const sendMagicLink = useCallback(async ({ email, displayName = '', locale = 'pt' }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error('invalid_email');
    }

    const redirectTo = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          display_name: sanitizeDisplayName(displayName, 80),
          locale: normalizeLocale(locale),
        },
      },
    });

    if (error) throw error;
    return { sent: true };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await clearPurchasesUser();
    } catch (error) {
      console.warn('RevenueCat logout failed', error);
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearPersonalLocalData();
    userRef.current = null;
    setUser(null);
    setProfile(null);
    setCloudProgress(null);
    window.location.reload();
  }, []);

  const deleteAccount = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser) throw new Error('authentication_required');

    setSyncStatus('syncing');
    const { error } = await supabase.rpc('fideora_delete_own_account');
    if (error) {
      setSyncStatus('error');
      setLastError(error.message);
      throw error;
    }

    try {
      await clearPurchasesUser();
    } catch (error) {
      console.warn('RevenueCat identity cleanup failed after account deletion', error);
    }

    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    clearPersonalLocalData();
    userRef.current = null;
    setUser(null);
    setProfile(null);
    setCloudProgress(null);
    setSyncStatus('idle');
    window.location.reload();
  }, []);

  const value = {
    user,
    profile,
    cloudProgress,
    loading,
    syncStatus,
    lastError,
    sendMagicLink,
    signOut,
    deleteAccount,
    updateProfile,
    syncProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
