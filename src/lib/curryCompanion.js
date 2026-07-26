export const CURRY_STATE_CONFIG = Object.freeze({
  idle: Object.freeze({
    row: 0,
    populatedFrames: 7,
    durationMs: 1040,
    iterations: "infinite",
  }),
  wave: Object.freeze({
    row: 1,
    populatedFrames: 4,
    durationMs: 880,
    iterations: 1,
  }),
  "look-right": Object.freeze({
    row: 2,
    populatedFrames: 8,
    durationMs: 1120,
    iterations: 1,
  }),
  "look-left": Object.freeze({
    row: 3,
    populatedFrames: 8,
    durationMs: 1120,
    iterations: 1,
  }),
});

export function randomLookDelayMs(random = Math.random) {
  const value = Math.max(0, Math.min(1, random()));
  return 14_000 + Math.round(value * 10_000);
}

export function nextLookState(previous) {
  return previous === "look-right" ? "look-left" : "look-right";
}
