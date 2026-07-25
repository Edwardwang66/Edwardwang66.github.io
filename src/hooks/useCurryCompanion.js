import { useCallback, useEffect, useRef, useState } from "react";
import {
  nextLookState,
  randomLookDelayMs,
} from "../lib/curryCompanion.js";

export function useCurryCompanion({ motionEligible, random = Math.random }) {
  const [state, setState] = useState("idle");
  const timerRef = useRef(null);
  const wavedRef = useRef(false);
  const lastLookRef = useRef(null);
  const mountedRef = useRef(true);
  const motionEligibleRef = useRef(motionEligible);
  const randomRef = useRef(random);

  motionEligibleRef.current = motionEligible;
  randomRef.current = random;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleLook = useCallback(() => {
    clearTimer();
    if (
      !motionEligibleRef.current ||
      document.visibilityState === "hidden"
    ) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (!mountedRef.current || !motionEligibleRef.current) return;
      const next = nextLookState(lastLookRef.current);
      lastLookRef.current = next;
      setState(next);
    }, randomLookDelayMs(randomRef.current));
  }, [clearTimer]);

  useEffect(() => {
    mountedRef.current = true;
    if (!motionEligible) {
      clearTimer();
      setState("idle");
      return undefined;
    }
    scheduleLook();
    return clearTimer;
  }, [clearTimer, motionEligible, scheduleLook]);

  useEffect(() => {
    const handleVisibility = () => {
      clearTimer();
      setState("idle");
      if (document.visibilityState !== "hidden") scheduleLook();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clearTimer, scheduleLook]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimer();
    },
    [clearTimer]
  );

  const onPointerEnter = useCallback(() => {
    if (
      !motionEligibleRef.current ||
      wavedRef.current ||
      state === "wave"
    ) {
      return;
    }
    wavedRef.current = true;
    clearTimer();
    setState("wave");
  }, [clearTimer, state]);

  const onActionEnd = useCallback(() => {
    if (state === "idle") return;
    setState("idle");
    scheduleLook();
  }, [scheduleLook, state]);

  return { state, onPointerEnter, onActionEnd };
}
