import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { App as NativeApp } from "@capacitor/app";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";
import { billing, ENTITLEMENT_ID } from "../services/purchases";
import { canUseFeature, hasEntitlement } from "../utils/access";
const PremiumContext = createContext(null);
export function PremiumProvider({ children }) {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const owner = user?.id || null;
  const identity = useRef(owner);
  identity.current = owner;
  const [snapshot, setSnapshot] = useState({
    owner: undefined,
    customerInfo: null,
  });
  const [checking, setChecking] = useState(true),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [offer, setOffer] = useState(null);
  const activeOperation = useRef(false);
  const accept = useCallback((result, id) => {
    if (identity.current === id)
      setSnapshot({ owner: id, customerInfo: result.customerInfo || null });
  }, []);
  const refresh = useCallback(async () => {
    if (loading) return;
    const id = owner;
    try {
      accept(await billing.refresh(id, language), id);
    } catch {
      /* Keep SDK-verified, unexpired cache on transient network failure. */
    } finally {
      if (identity.current === id) setChecking(false);
    }
  }, [owner, language, loading, accept]);
  useEffect(() => {
    let alive = true,
      unsubscribe;
    setChecking(true);
    refresh()
      .then(async () => {
        if (!alive || loading) return;
        const dispose = await billing.subscribe(() => {
          if (alive) refresh();
        });
        if (alive) unsubscribe = dispose;
        else dispose();
      })
      .catch(() => {});
    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, [refresh, loading]);
  useEffect(() => {
    let dispose,
      alive = true;
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("online", refresh);
    NativeApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) refresh();
    })
      .then((handle) => {
        if (alive) dispose = handle;
        else handle.remove();
      })
      .catch(() => {});
    const timer = setInterval(refresh, 60000);
    return () => {
      alive = false;
      dispose?.remove();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("online", refresh);
    };
  }, [refresh]);
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const isPremium =
    snapshot.owner === owner &&
    hasEntitlement(snapshot.customerInfo, ENTITLEMENT_ID, clock);
  const can = (feature, options) =>
    canUseFeature(
      feature,
      snapshot.owner === owner &&
        hasEntitlement(snapshot.customerInfo, ENTITLEMENT_ID),
      options,
    );
  const request = (feature = "bible") => {
    setMessage("");
    setOffer(feature);
  };
  const run = async (action) => {
    if (activeOperation.current || loading) return false;
    activeOperation.current = true;
    setBusy(true);
    setMessage("");
    const id = owner;
    try {
      const result = await billing[action](id, language);
      if (identity.current !== id) return false;
      accept(result, id);
      if (!result.available) {
        setMessage(result.reason === "platform" ? "platform" : "unavailable");
        return false;
      }
      const unlocked = hasEntitlement(result.customerInfo, ENTITLEMENT_ID);
      if (unlocked) {
        setOffer(null);
        setMessage("active");
      } else if (action === "restore") setMessage("nothing-restored");
      else if (result.result === "ERROR") setMessage("error");
      return unlocked;
    } catch (error) {
      if (
        identity.current === id &&
        !error?.userCancelled &&
        String(error?.code) !== "1"
      )
        setMessage("error");
      return false;
    } finally {
      activeOperation.current = false;
      setBusy(false);
    }
  };
  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        checking,
        busy,
        message,
        offer,
        request,
        close: () => {
          if (!busy) setOffer(null);
        },
        can,
        refresh,
        subscribe: () => run("present"),
        restore: () => run("restore"),
        manage: () => run("manage"),
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}
export const usePremium = () => useContext(PremiumContext);
