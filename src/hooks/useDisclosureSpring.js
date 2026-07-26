import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { createDisclosureSpring } from "../motion/disclosureSpring.js";

function setPanelVisibility(panel, hidden) {
  panel.hidden = hidden;
  panel.inert = hidden;
  if (hidden) {
    panel.setAttribute("hidden", "");
    panel.setAttribute("inert", "");
    panel.setAttribute("aria-hidden", "true");
  } else {
    panel.removeAttribute("hidden");
    panel.removeAttribute("inert");
    panel.removeAttribute("aria-hidden");
  }
}

export function useDisclosureSpring({ ids, activeId, reducedMotion }) {
  const key = ids.join("\u0000");
  const controllerRecordRef = useRef(null);
  if (controllerRecordRef.current?.key !== key) {
    controllerRecordRef.current = {
      key,
      controller: createDisclosureSpring(ids, activeId, {
        responseSeconds: 0.4,
      }),
    };
  }

  const panelsRef = useRef(new Map());
  const contentsRef = useRef(new Map());
  const panelCallbacksRef = useRef(new Map());
  const contentCallbacksRef = useRef(new Map());
  const frameRef = useRef(null);
  const initialRef = useRef(true);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const registerPanel = useCallback((id) => {
    if (!panelCallbacksRef.current.has(id)) {
      panelCallbacksRef.current.set(id, (node) => {
        if (node) panelsRef.current.set(id, node);
        else panelsRef.current.delete(id);
      });
    }
    return panelCallbacksRef.current.get(id);
  }, []);

  const registerPanelContent = useCallback((id) => {
    if (!contentCallbacksRef.current.has(id)) {
      contentCallbacksRef.current.set(id, (node) => {
        if (node) contentsRef.current.set(id, node);
        else contentsRef.current.delete(id);
      });
    }
    return contentCallbacksRef.current.get(id);
  }, []);

  useLayoutEffect(() => {
    const controller = controllerRecordRef.current.controller;

    const cancelFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const applySettledState = () => {
      for (const id of ids) {
        const panel = panelsRef.current.get(id);
        if (!panel) continue;
        const active = id === activeId;
        setPanelVisibility(panel, !active);
        panel.style.height = active ? "auto" : "0px";
        panel.style.opacity = active ? "1" : "0";
        panel.style.transform = "";
        panel.style.overflow = active ? "" : "hidden";
      }
    };

    if (initialRef.current || reducedMotion) {
      initialRef.current = false;
      cancelFrame();
      controller.jumpTo(activeId);
      applySettledState();
      return cancelFrame;
    }

    cancelFrame();
    const activePanel = panelsRef.current.get(activeId);
    if (activePanel) setPanelVisibility(activePanel, false);

    const heights = new Map();
    for (const id of ids) {
      heights.set(id, contentsRef.current.get(id)?.scrollHeight ?? 0);
    }

    controller.retarget(activeId);

    for (const id of ids) {
      const panel = panelsRef.current.get(id);
      if (!panel) continue;
      const state = controller.get(id);
      setPanelVisibility(panel, id !== activeId && state.value <= 0);
      panel.style.overflow = "hidden";
      panel.style.height = `${heights.get(id) * state.value}px`;
      panel.style.opacity = String(state.value);
      panel.style.transform = `translateY(${(1 - state.value) * 2}px)`;
    }

    let lastTimestamp = null;
    const advance = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      } else {
        const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
        lastTimestamp = timestamp;
        controller.advance(deltaSeconds);
      }

      for (const id of ids) {
        const panel = panelsRef.current.get(id);
        if (!panel) continue;
        const { value } = controller.get(id);
        setPanelVisibility(panel, id !== activeId && value <= 0);
        panel.style.height = `${heights.get(id) * value}px`;
        panel.style.opacity = String(value);
        panel.style.transform = `translateY(${(1 - value) * 2}px)`;
      }

      if (controller.isSettled()) {
        frameRef.current = null;
        applySettledState();
        return;
      }
      frameRef.current = window.requestAnimationFrame(advance);
    };

    frameRef.current = window.requestAnimationFrame(advance);
    return cancelFrame;
  }, [activeId, ids, key, reducedMotion]);

  useEffect(() => {
    const settleAfterResize = () => {
      if (frameRef.current === null) return;
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      const controller = controllerRecordRef.current.controller;
      controller.jumpTo(activeIdRef.current);
      for (const id of ids) {
        const panel = panelsRef.current.get(id);
        if (!panel) continue;
        const active = id === activeIdRef.current;
        setPanelVisibility(panel, !active);
        panel.style.height = active ? "auto" : "0px";
        panel.style.opacity = active ? "1" : "0";
        panel.style.transform = "";
        panel.style.overflow = active ? "" : "hidden";
      }
    };

    window.addEventListener("resize", settleAfterResize);
    window.addEventListener("orientationchange", settleAfterResize);
    return () => {
      window.removeEventListener("resize", settleAfterResize);
      window.removeEventListener("orientationchange", settleAfterResize);
    };
  }, [ids, key]);

  return { registerPanel, registerPanelContent };
}
