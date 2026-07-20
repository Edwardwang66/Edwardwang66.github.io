import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { projects } from "../data/portfolio.js";
import { setMediaQuery } from "../test/setup.js";
import HomePage from "./HomePage.jsx";

describe("HomePage", () => {
  it("renders the approved positioning and current-practice hierarchy", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const { container } = render(<HomePage onOpenProject={vi.fn()} />);

    expect(
      screen.getByText(
        "Pudong, Shanghai · Agentic AI Engineer Intern at Bioyond Robotics"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Robotics · Agentic AI · AI for Science")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build intelligent systems that carry intent into reliable execution.",
      })
    ).toHaveAttribute("tabindex", "-1");
    expect(
      screen.getByText(
        "Working across agentic scientific workflows, perception, planning, control and real hardware—where reliability, traceability and human oversight matter."
      )
    ).toBeInTheDocument();

    expect(container.querySelector(".status-dot")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(screen.getByRole("link", { name: "Selected work" })).toHaveAttribute(
      "href",
      "#selected-work"
    );
    expect(screen.getByRole("link", { name: "Current practice" })).toHaveAttribute(
      "href",
      "#current-practice"
    );
    expect(
      container.querySelector("#current-practice").compareDocumentPosition(
        container.querySelector("#selected-work")
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("embeds the portrait naturally and opens a complete project record", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const onOpenProject = vi.fn();
    const { container } = render(
      <HomePage onOpenProject={onOpenProject} />
    );
    const portrait = screen.getByRole("img", { name: "Portrait of Edward Wang" });
    expect(portrait).toHaveAttribute("src", "/IMG_9036.JPG");
    expect(portrait.closest("[data-size='hero']")).toBeInTheDocument();
    expect(portrait.closest(".card, .identity-panel")).toBeNull();

    const practice = container.querySelector("#current-practice");
    for (const text of [
      "Jul 2026 — Present",
      "Pudong, Shanghai, China · On-site",
      "Bioyond Robotics",
      "Agentic AI Engineer Intern · AI for Science",
      "Designing and developing an agentic AI platform for scientific workflow automation. Building modular planning, orchestration, validation and feedback mechanisms for executable, adaptive and auditable laboratory processes.",
    ]) {
      expect(withinSection(practice, text)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByRole("link", { name: /Open project/ }));
    expect(onOpenProject).toHaveBeenCalledWith(projects[0]);
  });
});

function withinSection(section, text) {
  return [...section.querySelectorAll("*")].find(
    (node) => node.children.length === 0 && node.textContent === text
  );
}
