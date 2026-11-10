import { Capacitor, CapacitorHttp, registerPlugin } from "@capacitor/core";
import { safeGetJSON, safeSetJSON } from "../utils/storage";

export const engagement = registerPlugin("FideoraEngagement");
export const hasEngagement = () =>
  Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("FideoraEngagement");
export const REMINDERS_KEY = "fideoraReminders:v1";
const METRICS_KEY = "fideoraReviewMetrics:v1";
const METRICS_URL = "https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?growth=1&action=app-review";
let reminderUpdate = Promise.resolve();
let sending = false;
let production = false;

export function configureReminders(settings, locale, askPermission = false) {
  const update = reminderUpdate.then(() => engagement.configureReminders({
    reading: settings.reading || null,
    prayer: settings.prayer || null,
    locale,
    askPermission,
  }));
  reminderUpdate = update.catch(() => {});
  return update;
}

export async function recordReviewMetric(event_name, locale) {
  const id = globalThis.crypto?.randomUUID?.();
  if (!id || !hasEngagement()) return;
  try {
    if (!production) production = (await engagement.allowsReviewMetrics()).allowed;
    if (!production) return;
  } catch {
    return;
  }
  const events = safeGetJSON(METRICS_KEY).events || [];
  safeSetJSON(METRICS_KEY, { events: [...events, { id, event_name, locale }].slice(-12) });
  void flushReviewMetrics();
}

export async function flushReviewMetrics() {
  if (sending || !hasEngagement() || !navigator.onLine || !safeGetJSON(METRICS_KEY).events?.length)
    return;
  sending = true;
  try {
    if (!production) {
      production = (await engagement.allowsReviewMetrics()).allowed;
      if (!production) return;
    }
    let event = safeGetJSON(METRICS_KEY).events?.[0];
    while (event) {
      const result = await CapacitorHttp.post({
        url: METRICS_URL,
        headers: { "Content-Type": "application/json" },
        data: event,
        responseType: "json",
        connectTimeout: 5000,
        readTimeout: 5000,
      });
      if (result.status !== 200 || !result.data?.ok) break;
      const events = safeGetJSON(METRICS_KEY).events.filter(({ id }) => id !== event.id);
      if (!safeSetJSON(METRICS_KEY, { events })) break;
      event = events[0];
    }
  } catch {
    // The next foreground or online event retries without interrupting the app.
  } finally {
    sending = false;
  }
}
