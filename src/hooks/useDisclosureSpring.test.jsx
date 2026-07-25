import { useMemo } from "react";
import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";
import { createRafClock } from "../test/rafClock.js";
import { useDisclosureSpring } from "./useDisclosureSpring.js";

function Harness({ activeId, reducedMotion = false }) {
  const ids = useMemo(() => ["a", "b"], []);
  const { registerPanel, registerPanelContent } = useDisclosureSpring({
    ids,
    activeId,
    reducedMotion,
  });

  return ids.map((id) => (
    <div key={id} data-testid={`panel-${id}`} ref={registerPanel(id)}>
      <div
        data-height={id === "a" ? "120" : "180"}
        ref={registerPanelContent(id)}
      >
        {id}
      </div>
    </div>
  ));
}

describe("useDisclosureSpring", () => {
  it("uses one interruptible frame loop and settles semantic visibility", () => {
    const height = vi
      .spyOn(HTMLElement.prototype, "scrollHeight", "get")
      .mockImplementation(function readHeight() {
        return Number(this.dataset.height || 0);
      });
    const clock = createRafClock();
    clock.install();
    const { getByTestId, rerender } = render(<Harness activeId="a" />);
    const panelA = getByTestId("panel-a");
    const panelB = getByTestId("panel-b");

    expect(panelA.style.height).toBe("auto");
    expect(panelB).toHaveAttribute("hidden");
    rerender(<Harness activeId="b" />);

    expect(clock.pending()).toBe(1);
    expect(panelB).not.toHaveAttribute("hidden");
    expect(panelA).not.toHaveAttribute("hidden");
    clock.advance(16);
    expect(clock.pending()).toBe(1);

    rerender(<Harness activeId="a" />);
    expect(clock.pending()).toBe(1);
    expect(Number.parseFloat(panelA.style.height)).toBeGreaterThanOrEqual(0);

    for (let frame = 0; frame < 120 && clock.pending(); frame += 1) {
      clock.advance(16);
    }
    expect(clock.pending()).toBe(0);
    expect(panelA.style.height).toBe("auto");
    expect(panelA).not.toHaveAttribute("hidden");
    expect(panelB).toHaveAttribute("hidden");
    expect(panelB).toHaveAttribute("aria-hidden", "true");
    expect(panelB).toHaveAttribute("inert");

    height.mockRestore();
    clock.restore();
  });

  it("jumps immediately for reduced motion and on resize recovery", () => {
    const height = vi
      .spyOn(HTMLElement.prototype, "scrollHeight", "get")
      .mockImplementation(function readHeight() {
        return Number(this.dataset.height || 0);
      });
    const clock = createRafClock();
    clock.install();
    const { getByTestId, rerender } = render(
      <Harness activeId="a" reducedMotion />
    );

    rerender(<Harness activeId="b" reducedMotion />);
    expect(clock.pending()).toBe(0);
    expect(getByTestId("panel-b").style.height).toBe("auto");
    expect(getByTestId("panel-a")).toHaveAttribute("hidden");

    rerender(<Harness activeId="a" reducedMotion={false} />);
    expect(clock.pending()).toBe(1);
    fireEvent(window, new Event("orientationchange"));
    expect(clock.pending()).toBe(0);
    expect(getByTestId("panel-a").style.height).toBe("auto");
    expect(getByTestId("panel-b")).toHaveAttribute("hidden");

    height.mockRestore();
    clock.restore();
  });
});
