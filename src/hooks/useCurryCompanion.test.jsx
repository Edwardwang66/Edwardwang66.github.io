import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCurryCompanion } from "./useCurryCompanion.js";

let visibility = "visible";
let visibilityDescriptor;

beforeEach(() => {
  vi.useFakeTimers();
  visibility = "visible";
  visibilityDescriptor = Object.getOwnPropertyDescriptor(
    document,
    "visibilityState"
  );
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => visibility,
  });
});

afterEach(() => {
  vi.useRealTimers();
  if (visibilityDescriptor) {
    Object.defineProperty(
      document,
      "visibilityState",
      visibilityDescriptor
    );
  } else {
    delete document.visibilityState;
  }
});

describe("useCurryCompanion", () => {
  it("alternates one-shot looks after the exact delay", () => {
    const { result } = renderHook(() =>
      useCurryCompanion({
        motionEligible: true,
        random: () => 0,
      })
    );

    expect(result.current.state).toBe("idle");
    act(() => vi.advanceTimersByTime(13_999));
    expect(result.current.state).toBe("idle");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.state).toBe("look-right");
    expect(vi.getTimerCount()).toBe(0);

    act(() => result.current.onActionEnd());
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(1);

    act(() => vi.advanceTimersByTime(14_000));
    expect(result.current.state).toBe("look-left");
    act(() => result.current.onActionEnd());
    expect(result.current.state).toBe("idle");
  });

  it("waves once per mount and interrupts an active look", () => {
    const { result } = renderHook(() =>
      useCurryCompanion({
        motionEligible: true,
        random: () => 0,
      })
    );

    act(() => vi.advanceTimersByTime(14_000));
    expect(result.current.state).toBe("look-right");
    act(() => result.current.onPointerEnter());
    expect(result.current.state).toBe("wave");
    expect(vi.getTimerCount()).toBe(0);

    act(() => result.current.onActionEnd());
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(1);
    act(() => result.current.onPointerEnter());
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(1);
  });

  it("remounting restores one available wave", () => {
    const first = renderHook(() =>
      useCurryCompanion({ motionEligible: true, random: () => 0 })
    );
    act(() => first.result.current.onPointerEnter());
    expect(first.result.current.state).toBe("wave");
    first.unmount();

    const second = renderHook(() =>
      useCurryCompanion({ motionEligible: true, random: () => 0 })
    );
    act(() => second.result.current.onPointerEnter());
    expect(second.result.current.state).toBe("wave");
    second.unmount();
  });

  it("pauses while hidden and schedules fresh work when visible", () => {
    const { result } = renderHook(() =>
      useCurryCompanion({
        motionEligible: true,
        random: () => 1,
      })
    );
    expect(vi.getTimerCount()).toBe(1);

    visibility = "hidden";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(0);

    act(() => vi.advanceTimersByTime(24_000));
    expect(result.current.state).toBe("idle");

    visibility = "visible";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(24_000));
    expect(result.current.state).toBe("look-right");
  });

  it("stays static when motion is ineligible", () => {
    const { result } = renderHook(() =>
      useCurryCompanion({
        motionEligible: false,
        random: () => 0,
      })
    );
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(0);
    act(() => result.current.onPointerEnter());
    expect(result.current.state).toBe("idle");
  });

  it("returns an active Wave to Idle when motion becomes ineligible", () => {
    const { result, rerender } = renderHook(
      ({ motionEligible }) =>
        useCurryCompanion({
          motionEligible,
          random: () => 0,
        }),
      { initialProps: { motionEligible: true } }
    );

    act(() => result.current.onPointerEnter());
    expect(result.current.state).toBe("wave");
    expect(vi.getTimerCount()).toBe(0);

    rerender({ motionEligible: false });

    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels an active Wave while hidden and schedules once when visible", () => {
    const { result } = renderHook(() =>
      useCurryCompanion({
        motionEligible: true,
        random: () => 0,
      })
    );

    act(() => result.current.onPointerEnter());
    expect(result.current.state).toBe("wave");
    expect(vi.getTimerCount()).toBe(0);

    visibility = "hidden";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(0);

    visibility = "visible";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.state).toBe("idle");
    expect(vi.getTimerCount()).toBe(1);
  });

  it("clears timers and listeners on unmount", () => {
    const remove = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() =>
      useCurryCompanion({
        motionEligible: true,
        random: () => 0,
      })
    );
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(remove).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
  });
});
