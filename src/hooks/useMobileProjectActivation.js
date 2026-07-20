import { useCallback, useEffect, useRef } from "react";
import {
  chooseActiveProject,
  isTapLockActive,
} from "../lib/projectActivation.js";
import { useMediaPreference } from "./useMediaPreference.js";

function nodeMap(source) {
  return source?.current ?? source ?? new Map();
}

export function useMobileProjectActivation({
  ids,
  activeId,
  onActivate,
  triggerNodes,
  panelNodes,
}) {
  const mobile = useMediaPreference("(max-width: 639px)");
  const activeIdRef = useRef(activeId);
  const onActivateRef = useRef(onActivate);
  const lastScrollYRef = useRef(
    typeof window === "undefined" ? 0 : window.scrollY
  );
  const directionRef = useRef(0);
  const lockRef = useRef(null);
  const frameRef = useRef(null);

  activeIdRef.current = activeId;
  onActivateRef.current = onActivate;

  const noteManualActivation = useCallback(() => {
    lockRef.current = {
      startedAt: performance.now(),
      scrollY: window.scrollY,
    };
  }, []);

  useEffect(() => {
    if (!mobile) return undefined;

    const measure = () => {
      frameRef.current = null;
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;
      if (delta !== 0) directionRef.current = delta > 0 ? 1 : -1;
      lastScrollYRef.current = scrollY;

      if (
        isTapLockActive(lockRef.current, {
          now: performance.now(),
          scrollY,
        })
      ) {
        return;
      }
      lockRef.current = null;

      const activePanel = nodeMap(panelNodes).get(activeIdRef.current);
      if (
        activePanel &&
        document.activeElement &&
        activePanel.contains(document.activeElement)
      ) {
        return;
      }

      const centersById = new Map();
      for (const id of ids) {
        const node = nodeMap(triggerNodes).get(id);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        centersById.set(id, rect.top + rect.height / 2);
      }

      const nextId = chooseActiveProject({
        ids,
        activeId: activeIdRef.current,
        centersById,
        readingLine: window.innerHeight * 0.42,
        direction: directionRef.current,
        hysteresisPx: 64,
      });

      if (nextId && nextId !== activeIdRef.current) {
        activeIdRef.current = nextId;
        onActivateRef.current(nextId);
      }
    };

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [ids, mobile, panelNodes, triggerNodes]);

  return { noteManualActivation };
}
