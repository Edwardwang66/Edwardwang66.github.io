import { render, screen } from "@testing-library/react";
import { profile } from "../data/portfolio.js";
import AboutPage from "./AboutPage.jsx";

describe("AboutPage", () => {
  it("renders the approved opening, shared portrait, and complete biography", () => {
    const { container } = render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: profile.aboutHeading })
    ).toHaveAttribute("tabindex", "-1");
    const portrait = screen.getByRole("img", { name: profile.portrait.alt });
    expect(portrait).toHaveAttribute("src", profile.portrait.src);
    expect(portrait.closest('[data-size="about"]')).toBeInTheDocument();
    for (const paragraph of profile.bio) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(
      container.querySelector(
        ".portrait-glow, .resume-card, .contact-cta, [class*='gradient']"
      )
    ).toBeNull();
  });

  it("keeps Bioyond first and preserves every approved record", () => {
    const { container } = render(<AboutPage />);
    const experience = container.querySelector("#about-experience");
    const text = experience.textContent;
    expect(text.indexOf("Bioyond Robotics")).toBeLessThan(
      text.indexOf("Liangfang Zhang's Lab")
    );
    expect(text.indexOf("Liangfang Zhang's Lab")).toBeLessThan(
      text.indexOf("c12.ai")
    );
    for (const value of [
      "Agentic AI Engineer Intern · AI for Science",
      "Jul 2026 — Present",
      "Pudong, Shanghai, China · On-site",
      profile.experience[0].note,
    ]) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("link", { name: /Bioyond Robotics/ })
    ).toHaveAttribute("href", "https://www.bioyond.com/en/");
    expect(screen.getByRole("link", { name: /c12.ai/ })).toHaveAttribute(
      "href",
      "https://www.c12.ai/en"
    );

    for (const record of profile.education) {
      expect(screen.getByText(record.note)).toBeInTheDocument();
    }
    for (const courseList of Object.values(profile.coursework)) {
      expect(screen.getByText(courseList)).toBeInTheDocument();
    }
    for (const language of profile.languages) {
      expect(screen.getByText(language.name)).toBeInTheDocument();
      expect(screen.getAllByText(language.level).length).toBeGreaterThan(0);
    }
  });

  it("renders capabilities as semantic editorial text and keeps contact reachable", () => {
    const { container } = render(<AboutPage />);
    const capabilities = container.querySelector("#about-capabilities");
    const agentic = [...capabilities.querySelectorAll("section")].find(
      (section) => section.querySelector("h3")?.textContent === "Agentic AI & Workflow Systems"
    );
    expect(agentic).toBeDefined();
    expect(agentic.querySelectorAll("li")).toHaveLength(5);
    expect(capabilities.textContent.indexOf("Agentic AI & Workflow Systems")).toBeLessThan(
      capabilities.textContent.indexOf("Robotics & Controls")
    );
    expect(agentic.querySelector("li").className).not.toMatch(/pill|tag|chip/);

    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`
    );
    expect(screen.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      "tel:+16505377182"
    );
    for (const social of profile.socials) {
      const link = screen.getByRole("link", { name: social.label });
      expect(link).toHaveAttribute("href", social.href);
      if (social.href.startsWith("http")) {
        expect(link).toHaveAttribute("rel", "noreferrer");
      }
    }
  });
});
