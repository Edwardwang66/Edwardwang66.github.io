import { describe, expect, it } from "vitest";
import {
  CURRY_STATE_CONFIG,
  nextLookState,
  randomLookDelayMs,
} from "./curryCompanion.js";

describe("Curry companion state helpers", () => {
  it("locks derivative rows and fallback durations", () => {
    expect(CURRY_STATE_CONFIG).toEqual({
      idle: {
        row: 0,
        populatedFrames: 7,
        durationMs: 1040,
        iterations: "infinite",
      },
      wave: {
        row: 1,
        populatedFrames: 4,
        durationMs: 880,
        iterations: 1,
      },
      "look-right": {
        row: 2,
        populatedFrames: 8,
        durationMs: 1120,
        iterations: 1,
      },
      "look-left": {
        row: 3,
        populatedFrames: 8,
        durationMs: 1120,
        iterations: 1,
      },
    });
  });

  it("maps random boundaries to the inclusive 14–24 second range", () => {
    expect(randomLookDelayMs(() => 0)).toBe(14_000);
    expect(randomLookDelayMs(() => 0.5)).toBe(19_000);
    expect(randomLookDelayMs(() => 1)).toBe(24_000);
    expect(randomLookDelayMs(() => -1)).toBe(14_000);
    expect(randomLookDelayMs(() => 2)).toBe(24_000);
  });

  it("alternates look direction", () => {
    expect(nextLookState(null)).toBe("look-right");
    expect(nextLookState("look-right")).toBe("look-left");
    expect(nextLookState("look-left")).toBe("look-right");
  });
});
