import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { projects } from "../data/portfolio.js";
import { setMediaQuery } from "../test/setup.js";
import HomePage from "./HomePage.jsx";

describe("HomePage", () => {
  it("mounts one Curry companion inside the homepage boundary", () => {
    const { container } = render(<HomePage onOpenProject={vi.fn()} />);

    expect(container.querySelectorAll(".curry-companion")).toHaveLength(1);
    expect(
      container.querySelector(".curry-companion-preload")
    ).toHaveAttribute("src", "/pet/curry-companion.webp");
  });

  it("renders the approved positioning and selected-experience hierarchy", () => {
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
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "href",
      "#selected-experience"
    );
    const heroSocials = container.querySelector(".hero-socials");
    expect(
      within(heroSocials).getAllByRole("link").map((link) => link.textContent)
    ).toEqual(["GitHub", "LinkedIn", "Email"]);
    expect(
      container.querySelector("#selected-experience").compareDocumentPosition(
        container.querySelector("#selected-work")
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("features the two internships with exact timestamps and official links", () => {
    const { container } = render(<HomePage onOpenProject={vi.fn()} />);
    const experience = container.querySelector("#selected-experience");
    const records = experience.querySelectorAll(".featured-experience-record");

    expect(records).toHaveLength(2);
    expect(records[0]).toHaveTextContent("Bioyond Robotics");
    expect(records[0]).toHaveTextContent("Jul 2026 — Present");
    expect(records[1]).toHaveTextContent("c12.ai");
    expect(records[1]).toHaveTextContent("Jun 2024 — Aug 2024");
    expect(
      within(experience).getByRole("link", { name: /Bioyond Robotics/ })
    ).toHaveAttribute("href", "https://www.bioyond.com/en/");
    expect(within(experience).getByRole("link", { name: /c12.ai/ })).toHaveAttribute(
      "href",
      "https://www.c12.ai/en"
    );
  });

  it("embeds the portrait naturally and opens the first project record", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const onOpenProject = vi.fn();
    const { container } = render(
      <HomePage onOpenProject={onOpenProject} />
    );
    const portrait = screen.getByRole("img", { name: "Portrait of Edward Wang" });
    expect(portrait).toHaveAttribute("src", "/IMG_9036.JPG");
    expect(portrait.closest("[data-size='hero']")).toBeInTheDocument();
    expect(portrait.closest(".card, .identity-panel")).toBeNull();

    fireEvent.click(screen.getByRole("link", { name: /Open project/ }));
    expect(onOpenProject).toHaveBeenCalledWith(projects[0]);
  });
});
