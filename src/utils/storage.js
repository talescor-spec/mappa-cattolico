const ROSARY_IDS = new Set(['joyful', 'luminous', 'sorrowful', 'glorious']);
const NOVENA_IDS = new Set(['novena1', 'novena2', 'novena3', 'novena4', 'novena5']);

export function safeGet(key, fallback = '') {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function safeGetJSON(key, fallback = {}) {
  const raw = safeGet(key, null);
  if (raw === null) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function safeSetJSON(key, value) {
  try {
    return safeSet(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function clampInt(value, min, max, fallback = min) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(number)));
}

export function sanitizeDisplayName(value, maxLength = 60) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function normalizeRosaryProgress(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const output = {};

  for (const [dateKey, dayValue] of Object.entries(input)) {
    if (typeof dateKey !== 'string' || dateKey.length > 64) continue;
    if (!dayValue || typeof dayValue !== 'object' || Array.isArray(dayValue)) continue;

    const dayOutput = {};
    for (const [mysteryId, step] of Object.entries(dayValue)) {
      if (!ROSARY_IDS.has(mysteryId)) continue;
      dayOutput[mysteryId] = clampInt(step, 0, 53, 0);
    }

    if (Object.keys(dayOutput).length) output[dateKey] = dayOutput;
  }

  return output;
}

export function normalizeNovenaProgress(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const output = {};

  for (const [novenaId, day] of Object.entries(input)) {
    if (!NOVENA_IDS.has(novenaId)) continue;
    output[novenaId] = clampInt(day, 0, 9, 0);
  }

  return output;
}
