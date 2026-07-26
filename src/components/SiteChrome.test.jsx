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
    expect(screen.getByRole("link", { name: /Get in touch/ })).toHaveAttribute(
      "href",
      "mailto:wanghanqing66@gmail.com"
    );
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

  it("keeps a stable navigation shell independent of scroll position", () => {
    renderChrome();
    const header = screen.getByRole("banner");
    expect(header).not.toHaveAttribute("data-scrolled");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 200 });
    fireEvent.scroll(window);

    expect(header).not.toHaveAttribute("data-scrolled");
    expect(header).toHaveClass("site-nav");
  });

  it("keeps the footer to direct social links", () => {
    renderChrome();
    for (const label of ["GitHub", "LinkedIn", "Email"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByRole("link", { name: "Instagram" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Douyin" })).toBeNull();
    expect(screen.queryByRole("button", { name: "RedNote" })).toBeNull();
  });
});
