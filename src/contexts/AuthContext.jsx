import { Capacitor } from "@capacitor/core";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase, supabaseUrl } from "../lib/supabase";
import {
  safeGet,
  safeGetJSON,
  safeSet,
  safeSetJSON,
  sanitizeDisplayName,
  normalizeRosaryProgress,
  normalizeNovenaProgress,
} from "../utils/storage";
const AuthContext = createContext(null);
const locale = (value) => (value === "pt" ? "pt" : "it");
const personalKeys = [
  "fideoraUserName",
  "rosaryProgress",
  "novenaProgress",
  "fideoraStreak",
  "fideoraLastVisit",
  "fideoraProgressOwner",
];
function clearProgress() {
  personalKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* unavailable */
    }
  });
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [profile, setProfile] = useState(null);
  const [cloudProgress, setCloudProgress] = useState(null);
  const [lastError, setLastError] = useState("");
  const userRef = useRef(null);
  const generation = useRef(0);
  const hydrating = useRef(false);
  const perform = useCallback(async (operation) => {
    setSyncStatus("syncing");
    const result = await operation;
    if (result.error) {
      setSyncStatus("error");
      setLastError("sync_failed");
      throw result.error;
    }
    setSyncStatus("synced");
    setLastError("");
    return result;
  }, []);
  const updateProfile = useCallback(
    async (changes = {}) => {
      const current = userRef.current;
      if (!current) return;
      const patch = { user_id: current.id };
      if ("displayName" in changes)
        patch.display_name = sanitizeDisplayName(changes.displayName);
      if ("locale" in changes) patch.locale = locale(changes.locale);
      const result = await perform(
        supabase
          .from("fideora_profiles")
          .upsert(patch, { onConflict: "user_id" })
          .select()
          .single(),
      );
      if (userRef.current?.id === current.id) setProfile(result.data);
    },
    [perform],
  );
  const syncProgress = useCallback(
    async (changes = {}) => {
      const current = userRef.current;
      if (!current) return;
      const patch = { user_id: current.id };
      if ("rosaryProgress" in changes)
        patch.rosary_progress = normalizeRosaryProgress(changes.rosaryProgress);
      if ("novenaProgress" in changes)
        patch.novena_progress = normalizeNovenaProgress(changes.novenaProgress);
      if ("lastReadingKey" in changes) {
        patch.last_reading_key = String(changes.lastReadingKey).slice(0, 120);
        patch.last_reading_at = new Date().toISOString();
      }
      const result = await perform(
        supabase
          .from("fideora_progress")
          .upsert(patch, { onConflict: "user_id" })
          .select()
          .single(),
      );
      if (userRef.current?.id === current.id) setCloudProgress(result.data);
    },
    [perform],
  );
  useEffect(() => {
    let alive = true;
    const apply = async (nextUser) => {
      if (!alive) return;
      if (userRef.current?.id === nextUser?.id && nextUser) {
        setLoading(false);
        return;
      }
      const request = ++generation.current;
      userRef.current = nextUser;
      setUser(nextUser);
      setLoading(false);
      if (!nextUser) {
        setProfile(null);
        setCloudProgress(null);
        setSyncStatus("idle");
        return;
      }
      try {
        setSyncStatus("syncing");
        const [p, r] = await Promise.all([
          supabase
            .from("fideora_profiles")
            .select()
            .eq("user_id", nextUser.id)
            .maybeSingle(),
          supabase
            .from("fideora_progress")
            .select()
            .eq("user_id", nextUser.id)
            .maybeSingle(),
        ]);
        if (p.error || r.error) throw p.error || r.error;
        if (!alive || request !== generation.current) return;
        const owner = safeGet("fideoraProgressOwner");
        // Never import a previous account's device data into a different account.
        if (owner && owner !== nextUser.id) clearProgress();
        hydrating.current = true;
        if (p.data?.display_name)
          safeSet("fideoraUserName", p.data.display_name);
        if (p.data?.locale) safeSet("fideoraLanguage", locale(p.data.locale));
        if (r.data) {
          safeSetJSON(
            "rosaryProgress",
            normalizeRosaryProgress(r.data.rosary_progress),
          );
          safeSetJSON(
            "novenaProgress",
            normalizeNovenaProgress(r.data.novena_progress),
          );
        }
        safeSet("fideoraProgressOwner", nextUser.id);
        hydrating.current = false;
        setProfile(p.data);
        setCloudProgress(r.data);
        window.dispatchEvent(new Event("fideora:hydrated"));
        if (alive && request === generation.current) setSyncStatus("synced");
      } catch {
        hydrating.current = false;
        if (alive && request === generation.current) {
          setSyncStatus("error");
          setLastError("sync_failed");
        }
      }
    };
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (alive) {
          if (error) setLastError("session_failed");
          apply(data?.session?.user || null);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => apply(session?.user || null), 0);
    });
    return () => {
      alive = false;
      generation.current++;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const changed = (event) => {
      if (hydrating.current || !userRef.current) return;
      const key = event.detail?.key;
      if (key === "fideoraUserName")
        updateProfile({ displayName: safeGet(key) }).catch(() => {});
      if (key === "fideoraLanguage")
        updateProfile({ locale: safeGet(key) }).catch(() => {});
      if (key === "rosaryProgress")
        syncProgress({ rosaryProgress: safeGetJSON(key) }).catch(() => {});
      if (key === "novenaProgress")
        syncProgress({ novenaProgress: safeGetJSON(key) }).catch(() => {});
    };
    window.addEventListener("fideora:local-change", changed);
    return () => window.removeEventListener("fideora:local-change", changed);
  }, [syncProgress, updateProfile]);
  const sendMagicLink = async ({
    email,
    displayName = "",
    locale: lang = "it",
  }) => {
    const normalized = String(email).trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error("invalid_email");
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo:
          import.meta.env.VITE_AUTH_REDIRECT_URL ||
          "https://fideora.app",
        data: {
          display_name: sanitizeDisplayName(displayName),
          locale: locale(lang),
        },
      },
    });
    if (error) throw error;
  };
  const verifyEmailCode = async (email, token) => {
    let response;
    if (token.trim().startsWith("https://")) {
      const link = new URL(token.trim());
      if (
        link.origin !== new URL(supabaseUrl).origin ||
        link.pathname !== "/auth/v1/verify" ||
        !link.searchParams.get("token")
      )
        throw new Error("invalid_link");
      response = await supabase.auth.verifyOtp({
        token_hash: link.searchParams.get("token"),
        type: "email",
      });
    } else {
      response = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: "email",
      });
    }
    const { error } = response;
    if (error) throw error;
  };
  const signOut = async () => {
    // Flush is handled by the study provider before this action is offered.
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearProgress();
    window.location.reload();
  };
  const deleteAccount = async () => {
    if (!userRef.current) throw new Error("authentication_required");
    const id = userRef.current.id;
    const { error } = await supabase.rpc("fideora_delete_own_account");
    if (error) throw error;
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    try {
      localStorage.removeItem(`fideoraStudy:${id}`);
      localStorage.removeItem(`fideoraStudyConsent:${id}`);
    } catch {
      /* unavailable */
    }
    clearProgress();
    window.location.reload();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        cloudProgress,
        loading,
        syncStatus,
        lastError,
        sendMagicLink,
        verifyEmailCode,
        signOut,
        deleteAccount,
        updateProfile,
        syncProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
