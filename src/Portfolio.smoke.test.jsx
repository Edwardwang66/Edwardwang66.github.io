import { StrictMode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Portfolio from "./Portfolio.jsx";
import { createRafClock } from "./test/rafClock.js";
import { setMediaQuery } from "./test/setup.js";

describe("portfolio baseline", () => {
  it("renders the current editorial shell before Original+ changes", () => {
    render(<Portfolio />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "About" })).toBeInTheDocument();
    expect(screen.getAllByText("Edward Wang").length).toBeGreaterThan(0);
  });

  it("keeps normalized text-only projects reachable during extraction", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const { container } = render(<Portfolio />);

    fireEvent.click(
      container.querySelector(
        '[data-project-id="drug-delivery-ml"][data-project-trigger]'
      )
    );
    fireEvent.click(
      container.querySelector(
        '#project-panel-drug-delivery-ml a[href="#project-drug-delivery-ml"]'
      )
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "ML-Supported Nanoparticle & Cell-Membrane Selection",
      })
    ).toBeInTheDocument();
  });

  it("keeps the initial StrictMode mount inert and manages genuine view changes", () => {
    const clock = createRafClock();
    clock.install();
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    document.title = "Edward Wang — Robotics, Agentic AI & AI for Science";

    render(
      <StrictMode>
        <Portfolio />
      </StrictMode>
    );

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "About" }));
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
    expect(document.title).toBe("About — Edward Wang");

    clock.advance(16);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    focus.mockRestore();
    clock.restore();
  });

  it("treats project ID changes as distinct view lifecycles", () => {
    const clock = createRafClock();
    clock.install();
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const { container } = render(<Portfolio />);

    fireEvent.click(
      container.querySelector(
        '#project-panel-off-road-vehicle a[href="#project-off-road-vehicle"]'
      )
    );
    expect(document.title).toBe(
      "1/5 Scale Autonomous Off-Road Vehicle — Edward Wang"
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    clock.advance(16);

    fireEvent.click(screen.getByRole("button", { name: /Next project/ }));
    expect(document.title).toBe(
      "Vision-Guided Robotic Arm for Automated Lab Operations — Edward Wang"
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    clock.restore();
  });
});
