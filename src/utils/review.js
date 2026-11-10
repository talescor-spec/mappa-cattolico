const DAY = 86_400_000;

export function recordCompletion(state, day) {
  const days = [...new Set([...(state.days || []), day])].sort().slice(-3);
  return { ...state, days };
}

export function reviewAttempts(state, now) {
  return (state.attempts || []).filter((at) => Number.isFinite(at) && at > now - 365 * DAY);
}

export function canRequestReview(state, now) {
  const attempts = reviewAttempts(state, now);
  return state.days?.length >= 3 &&
    attempts.length < 2 &&
    attempts.every((at) => now - at >= 90 * DAY);
}
