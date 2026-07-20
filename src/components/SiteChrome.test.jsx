import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SiteChrome from "./SiteChrome.jsx";

function renderChrome(view = "home") {
  const onNavigate = vi.fn();
  const result = render(
    <SiteChrome view={view} onNavigate={onNavigate}>
      <main aria-labelledby="test-title">
        <h1 id="test-title">Test page</h1>
      </main>
    </SiteChrome>
  );
  return { ...result, onNavigate };
}

describe("SiteChrome", () => {
  it("keeps one main landmark and exposes the skip link first", () => {
    const { container } = renderChrome();

    const firstFocusable = container.querySelector("a, button");
    expect(firstFocusable).toHaveTextContent("Skip to content");
    expect(firstFocusable).toHaveAttribute("href", "#main-content");
    expect(container.querySelector("#main-content")?.tagName).toBe("DIV");
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("uses semantic current-section controls and preserves the EW identity", () => {
    const { onNavigate, rerender } = renderChrome("project");

    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "About" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.queryByText("Get in touch")).not.toBeInTheDocument();
    expect(screen.getByText("EW")).toBeInTheDocument();
    expect(screen.getByText("Edward Wang")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edward Wang — Work" }));
    expect(onNavigate).toHaveBeenCalledWith("home");

    rerender(
      <SiteChrome view="about" onNavigate={onNavigate}>
        <main><h1>About page</h1></main>
      </SiteChrome>
    );
    expect(screen.getByRole("button", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("adds the nav edge only after four pixels of scroll", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    renderChrome();
    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-scrolled", "false");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 4 });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "false");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 5 });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "true");
  });
});
