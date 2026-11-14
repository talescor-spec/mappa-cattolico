import { useEffect, useRef, useState } from "react";
import { App as NativeApp } from "@capacitor/app";
import { localDateKey } from "../data/content";
import { engagement, flushReviewMetrics, hasEngagement, recordReviewMetric } from "../services/engagement";
import { canRequestReview, recordCompletion, reviewAttempts } from "../utils/review";
import { safeGetJSON, safeSetJSON } from "../utils/storage";

const REVIEW_KEY = "fideoraReviewMoments:v1";
const SESSION_GAP = 30 * 60_000;

export default function useReviewMoments({ ready, blocked, atHome, locale }) {
  const [pending, setPending] = useState(null);
  const [sessionBlocked, setSessionBlocked] = useState(false);
  const backgroundAt = useRef(0);

  useEffect(() => {
    if (!blocked || !hasEngagement()) return;
    setSessionBlocked(true);
    setPending(null);
  }, [blocked]);

  useEffect(() => {
    if (!hasEngagement()) return;
    let disposed = false;
    const subscription = NativeApp.addListener("appStateChange", ({ isActive }) => {
      if (!isActive) {
        backgroundAt.current = Date.now();
        setPending(null);
      } else {
        if (backgroundAt.current && Date.now() - backgroundAt.current >= SESSION_GAP)
          setSessionBlocked(false);
        void flushReviewMetrics();
      }
    });
    const online = () => void flushReviewMetrics();
    window.addEventListener("online", online);
    online();
    return () => {
      disposed = true;
      window.removeEventListener("online", online);
      subscription.then(handle => disposed && handle.remove()).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!pending || !atHome || !ready || blocked || sessionBlocked) return;
    const timer = setTimeout(async () => {
      setPending(null);
      if (document.visibilityState !== "visible" || pending.day !== localDateKey()) return;
      const state = safeGetJSON(REVIEW_KEY);
      const now = Date.now();
      if (!canRequestReview(state, now)) return;
      const attempts = [...reviewAttempts(state, now), now];
      if (!safeSetJSON(REVIEW_KEY, { ...state, attempts })) return;
      try {
        const { requested } = await engagement.requestReview();
        if (requested) recordReviewMetric("review_requested", locale);
        else {
          const current = safeGetJSON(REVIEW_KEY);
          safeSetJSON(REVIEW_KEY, { ...current, attempts: current.attempts.filter(at => at !== now) });
        }
      } catch {
        // Preserve the cooldown if the bridge result is ambiguous.
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [pending, ready, atHome, blocked, sessionBlocked, locale]);

  return () => {
    if (!hasEngagement()) return;
    const day = localDateKey();
    const state = recordCompletion(safeGetJSON(REVIEW_KEY), day);
    const reached = state.days.length >= 3 && !state.milestone;
    if (reached) state.milestone = true;
    if (!safeSetJSON(REVIEW_KEY, state)) return;
    if (reached) recordReviewMetric("review_milestone", locale);
    if (!blocked && !sessionBlocked && canRequestReview(state, Date.now())) setPending({ day });
  };
}
