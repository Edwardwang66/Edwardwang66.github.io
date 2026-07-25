import { readFileSync } from "node:fs";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQuery } from "../test/setup.js";
import CurryCompanion from "./CurryCompanion.jsx";

const stylesheet = readFileSync("src/index.css", "utf8");

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function loadCompanion(container) {
  fireEvent.load(container.querySelector(".curry-companion-preload"));
  return container.querySelector(".curry-companion");
}

describe("CurryCompanion", () => {
  it("renders one decorative local sprite after it loads", () => {
    const { container } = render(<CurryCompanion random={() => 0} />);
    const companion = loadCompanion(container);

    expect(companion).toHaveAttribute("aria-hidden", "true");
    expect(companion).toHaveAttribute("data-state", "idle");
    expect(companion).toHaveAttribute("data-motion", "eligible");
    expect(companion).not.toHaveAttribute("role");
    expect(companion).not.toHaveAttribute("tabindex");
    expect(container.querySelector(".curry-companion-preload")).toHaveAttribute(
      "src",
      "/pet/curry-companion.webp"
    );
  });

  it("forwards the first pointer wave and one-shot completion", () => {
    const { container } = render(<CurryCompanion random={() => 0} />);
    const companion = loadCompanion(container);

    fireEvent.pointerEnter(companion);
    expect(companion).toHaveAttribute("data-state", "wave");
    fireEvent.animationEnd(companion, { animationName: "curry-wave" });
    expect(companion).toHaveAttribute("data-state", "idle");

    fireEvent.pointerEnter(companion);
    expect(companion).toHaveAttribute("data-state", "idle");
  });

  it.each([
    ["(max-width: 639px)", true],
    ["(prefers-reduced-motion: reduce)", true],
  ])("stays static when %s matches", (query, matches) => {
    setMediaQuery(query, matches);
    const { container } = render(<CurryCompanion random={() => 0} />);
    const companion = loadCompanion(container);

    expect(companion).toHaveAttribute("data-state", "idle");
    expect(companion).toHaveAttribute("data-motion", "static");
    act(() => vi.advanceTimersByTime(24_000));
    expect(companion).toHaveAttribute("data-state", "idle");
    fireEvent.pointerEnter(companion);
    expect(companion).toHaveAttribute("data-state", "idle");
  });

  it("renders nothing after the local atlas fails", () => {
    const { container } = render(<CurryCompanion random={() => 0} />);

    fireEvent.error(container.querySelector(".curry-companion-preload"));

    expect(container.querySelector(".curry-companion")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("animates Wave through only its four populated frames", () => {
    expect(stylesheet).toMatch(
      /\.curry-companion\[data-state="wave"\]\s*\{[^}]*animation:\s*curry-wave 880ms steps\(4, end\) 1;/s
    );
    expect(stylesheet).toMatch(
      /@keyframes curry-wave\s*\{\s*to\s*\{\s*background-position-x:\s*-304px;\s*\}\s*\}/s
    );
  });
});
