import { useEffect, useState } from "react";
const cache = new Map();
export function loadBible(language) {
  if (!cache.has(language))
    cache.set(
      language,
      fetch(`/bible/${language}.json`)
        .then((r) => {
          if (!r.ok) throw new Error("bible_unavailable");
          return r.json();
        })
        .catch((e) => {
          cache.delete(language);
          throw e;
        }),
    );
  return cache.get(language);
}
export default function useBible(language) {
  const [data, setData] = useState(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setError(false);
    loadBible(language)
      .then((value) => {
        if (active) setData(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [language, attempt]);
  return { bible: data, error, retry: () => setAttempt((v) => v + 1) };
}
