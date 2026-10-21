export const ENTRY_KINDS = new Set([
  "verse",
  "note",
  "intention",
  "novena",
  "reading",
]);
export function normalizeEntries(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const output = {};
  for (const [id, entry] of Object.entries(input).slice(0, 5000)) {
    if (
      !/^[a-zA-Z0-9:._-]{1,160}$/.test(id) ||
      !entry ||
      !ENTRY_KINDS.has(entry.kind) ||
      !Number.isFinite(Date.parse(entry.updatedAt))
    )
      continue;
    const raw =
      entry.payload && typeof entry.payload === "object" ? entry.payload : {};
    const text = (key, max) =>
      typeof raw[key] === "string" ? raw[key].slice(0, max) : "";
    const number = (key, max) =>
      Math.min(max, Math.max(1, Math.trunc(Number(raw[key]) || 1)));
    let payload = {};
    if (entry.kind === "note")
      payload = {
        title: text("title", 160),
        body: text("body", 30000),
        pinned: !!raw.pinned,
      };
    if (entry.kind === "intention")
      payload = { text: text("text", 2000), answered: !!raw.answered };
    if (entry.kind === "verse")
      payload = {
        language: raw.language === "pt" ? "pt" : "it",
        book: text("book", 16),
        chapter: number("chapter", 150),
        verse: number("verse", 200),
        note: text("note", 10000),
        color: ["gold", "sage", "rose"].includes(raw.color) ? raw.color : "",
        bookmarked: !!raw.bookmarked,
      };
    if (entry.kind === "reading")
      payload = {
        date: text("date", 10),
        book: text("book", 16),
        chapter: number("chapter", 150),
      };
    if (entry.kind === "novena")
      payload = {
        lastDay: /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDay) ? raw.lastDay : null,
      };
    output[id] = {
      id,
      kind: entry.kind,
      updatedAt: entry.updatedAt,
      deleted: !!entry.deleted,
      payload: entry.deleted ? {} : payload,
    };
  }
  return output;
}
export function mergeEntries(local, remote) {
  const merged = { ...normalizeEntries(remote) };
  for (const [id, entry] of Object.entries(normalizeEntries(local))) {
    if (
      !merged[id] ||
      Date.parse(entry.updatedAt) > Date.parse(merged[id].updatedAt)
    )
      merged[id] = entry;
  }
  return merged;
}
export function searchBible(bible, query, limit = 100) {
  const needle = query
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  if (needle.length < 3 || !bible) return [];
  const results = [];
  for (const book of bible.books)
    for (const chapter of book.chapters)
      for (const verse of chapter.verses) {
        if (
          verse.text
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase()
            .includes(needle)
        ) {
          results.push({
            book: book.book,
            chapter: chapter.chapter,
            verse: verse.number,
            text: verse.text,
            bookId: book.bookId,
          });
          if (results.length >= limit) return results;
        }
      }
  return results;
}
