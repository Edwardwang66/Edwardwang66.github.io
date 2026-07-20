import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";
import { setMediaQuery } from "../test/setup.js";
import { createRafClock } from "../test/rafClock.js";
import { useMobileProjectActivation } from "./useMobileProjectActivation.js";

const Harness = forwardRef(function Harness(
  { activeId, onActivate, triggers, panels },
  ref
) {
  const ids = useMemo(() => ["01", "02"], []);
  const triggerNodes = useRef(triggers);
  const panelNodes = useRef(panels);
  const api = useMobileProjectActivation({
    ids,
    activeId,
    onActivate,
    triggerNodes,
    panelNodes,
  });
  useImperativeHandle(ref, () => api, [api]);
  return null;
});

function nodeAt(center) {
  const node = document.createElement("button");
  node.getBoundingClientRect = vi.fn(() => ({
    top: center - 20,
    height: 40,
  }));
  return node;
}

describe("useMobileProjectActivation", () => {
  it("coalesces passive mobile scroll work into one reading-line frame", () => {
    setMediaQuery("(max-width: 639px)", true);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    const clock = createRafClock();
    clock.install();
    const addListener = vi.spyOn(window, "addEventListener");
    const onActivate = vi.fn();
    const triggers = new Map([
      ["01", nodeAt(485)],
      ["02", nodeAt(421)],
    ]);

    const { unmount } = render(
      <Harness
        activeId="01"
        onActivate={onActivate}
        triggers={triggers}
        panels={new Map()}
      />
    );

    expect(addListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    expect(clock.pending()).toBe(1);
    clock.advance(16);
    expect(onActivate).toHaveBeenCalledWith("02");
    expect(window.scrollTo).not.toHaveBeenCalled();

    fireEvent.scroll(window);
    expect(clock.pending()).toBe(1);
    unmount();
    expect(clock.pending()).toBe(0);
    addListener.mockRestore();
    clock.restore();
  });

  it("honors manual lock distance and active-panel focus hold", () => {
    setMediaQuery("(max-width: 639px)", true);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    const now = vi.spyOn(performance, "now").mockReturnValue(100);
    const clock = createRafClock();
    clock.install();
    const onActivate = vi.fn();
    const activePanel = document.createElement("div");
    const link = document.createElement("a");
    link.href = "#project";
    activePanel.append(link);
    document.body.append(activePanel);
    const apiRef = { current: null };

    render(
      <Harness
        ref={apiRef}
        activeId="01"
        onActivate={onActivate}
        triggers={new Map([
          ["01", nodeAt(520)],
          ["02", nodeAt(421)],
        ])}
        panels={new Map([["01", activePanel]])}
      />
    );

    apiRef.current.noteManualActivation();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 96 });
    fireEvent.scroll(window);
    clock.advance(16);
    expect(onActivate).not.toHaveBeenCalled();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 97 });
    link.focus();
    fireEvent.scroll(window);
    clock.advance(16);
    expect(onActivate).not.toHaveBeenCalled();

    link.blur();
    fireEvent.scroll(window);
    clock.advance(16);
    expect(onActivate).toHaveBeenCalledWith("02");
    expect(window.scrollTo).not.toHaveBeenCalled();

    activePanel.remove();
    now.mockRestore();
    clock.restore();
  });

  it("does nothing above the mobile breakpoint", () => {
    const clock = createRafClock();
    clock.install();
    const onActivate = vi.fn();
    render(
      <Harness
        activeId="01"
        onActivate={onActivate}
        triggers={new Map([
          ["01", nodeAt(520)],
          ["02", nodeAt(421)],
        ])}
        panels={new Map()}
      />
    );
    fireEvent.scroll(window);
    expect(clock.pending()).toBe(0);
    expect(onActivate).not.toHaveBeenCalled();
    clock.restore();
  });
});
