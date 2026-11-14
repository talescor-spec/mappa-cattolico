import { test } from "node:test";
import assert from "node:assert/strict";
import { canRequestReview, recordCompletion } from "../src/utils/review.js";

const DAY = 86_400_000;
const now = Date.parse("2026-11-09T18:00:00Z");

test("repeating activities on one day does not unlock the review request", () => {
  const completions = ["2026-11-07", "2026-11-07", "2026-11-08", "2026-11-08"];
  const state = completions.reduce(recordCompletion, {});
  assert.equal(canRequestReview(state, now), false);
  assert.equal(canRequestReview(recordCompletion(state, "2026-11-09"), now), true);
});

test("requests stay at least 90 days apart and at most twice in 365 days", () => {
  const state = { days: ["2026-11-07", "2026-11-08", "2026-11-09"] };
  assert.equal(canRequestReview({ ...state, attempts: [now - 90 * DAY + 1] }, now), false);
  assert.equal(canRequestReview({ ...state, attempts: [now - 90 * DAY] }, now), true);
  assert.equal(canRequestReview({ ...state, attempts: [now - 364 * DAY, now - 90 * DAY] }, now), false);
  assert.equal(canRequestReview({ ...state, attempts: [now - 365 * DAY, now - 90 * DAY] }, now), true);
});
