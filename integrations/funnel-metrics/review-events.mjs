const EVENTS = ["review_milestone", "review_requested", "review_link_clicked"];
const MAX_BYTES = 1024;

export async function collectReviewEvent(request, db, respond) {
  if (request.method !== "POST") return respond({ ok: false }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== "capacitor://localhost") return respond({ ok: false }, 403);
  if (Number(request.headers.get("content-length")) > MAX_BYTES) return respond({ ok: false }, 413);
  if (!request.body) return respond({ ok: false }, 400);

  const reader = request.body.getReader();
  const bytes = new Uint8Array(MAX_BYTES);
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.length > MAX_BYTES) {
        await reader.cancel();
        return respond({ ok: false }, 413);
      }
      bytes.set(value, length);
      length += value.length;
    }
  } finally {
    reader.releaseLock();
  }

  let event;
  try {
    event = JSON.parse(new TextDecoder().decode(bytes.subarray(0, length)));
  } catch {
    return respond({ ok: false }, 400);
  }
  if (!event || typeof event.id !== "string" || !EVENTS.includes(event.event_name) ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(event.id) ||
      !["it", "pt"].includes(event.locale)) {
    return respond({ ok: false }, 400);
  }

  const { error } = await db.from("fm_fideora_events_v1").upsert({
    event_key: "review:" + event.id.toLowerCase(),
    event_name: event.event_name,
    source: "app",
    platform: "ios",
    is_test: event.is_test === true,
    properties: { locale: event.locale },
  }, { onConflict: "event_key", ignoreDuplicates: true });
  return respond({ ok: !error }, error ? 500 : 200);
}

export async function reviewCounts(db) {
  const { data, error } = await db.rpc("fm_fideora_review_counts_v1");
  if (error) return null;
  return data;
}
