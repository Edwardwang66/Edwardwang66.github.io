import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { projects } from "../data/portfolio.js";
import { setMediaQuery } from "../test/setup.js";
import ProjectArchive from "./ProjectArchive.jsx";

describe("ProjectArchive", () => {
  it("renders eight sibling trigger/panel pairs with exactly one open", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
    );
    const triggers = container.querySelectorAll("[data-project-trigger]");
    expect(triggers).toHaveLength(8);
    expect(
      [...triggers].filter(
        (trigger) => trigger.getAttribute("aria-expanded") === "true"
      )
    ).toHaveLength(1);
    expect(
      container.querySelector(
        '[data-project-trigger][data-project-id="easy-a-radar"]'
      )
    ).toHaveAttribute("aria-expanded", "true");

    for (const trigger of triggers) {
      const panel = container.querySelector(`#${trigger.getAttribute("aria-controls")}`);
      expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
      const projectLink = panel.querySelector("a[href^='#project-']");
      expect(projectLink).not.toBeNull();
      expect(trigger.contains(projectLink)).toBe(false);
    }
  });

  it("keeps product actions outside the disclosure trigger", async () => {
    const onOpenProject = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={onOpenProject} />
    );
    const panel = container.querySelector("#project-panel-easy-a-radar");
    const trigger = container.querySelector(
      '[data-project-trigger][data-project-id="easy-a-radar"]'
    );

    expect(within(trigger).getByText("Live product")).toBeInTheDocument();
    const live = within(panel).getByRole("link", { name: "Live Site" });
    const github = within(panel).getByRole("link", { name: "GitHub" });
    expect(trigger.contains(live)).toBe(false);
    expect(trigger.contains(github)).toBe(false);
    expect(live).toHaveAttribute(
      "href",
      "https://easy-a-radar.vercel.app/"
    );
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noreferrer");

    await user.click(live);
    expect(onOpenProject).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("switches by pointer and keyboard without closing the active row", async () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const user = userEvent.setup();
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
    );
    const trigger02 = container.querySelector('[data-project-id="lab-robotic-arm"][data-project-trigger]');
    trigger02.focus();
    await user.click(trigger02);
    expect(trigger02).toHaveFocus();
    expect(trigger02).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger02);
    expect(trigger02).toHaveAttribute("aria-expanded", "true");

    const trigger03 = container.querySelector('[data-project-id="state-estimation"][data-project-trigger]');
    trigger03.focus();
    await user.keyboard("{Enter}");
    expect(trigger03).toHaveAttribute("aria-expanded", "true");
    expect(
      [...container.querySelectorAll("[data-project-trigger]")].filter(
        (trigger) => trigger.getAttribute("aria-expanded") === "true"
      )
    ).toHaveLength(1);
  });

  it("registers every trigger and panel while reduced motion stays immediate", async () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    setMediaQuery("(max-width: 639px)", true);
    const user = userEvent.setup();
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
    );

    const stock = container.querySelector(
      '[data-project-trigger][data-project-id="stock-research-dashboard"]'
    );
    await user.click(stock);

    expect(stock).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("#project-panel-easy-a-radar")).toHaveAttribute(
      "hidden"
    );
    expect(
      container.querySelector("#project-panel-stock-research-dashboard")
    ).not.toHaveAttribute("hidden");
  });

  it("hides the previous panel immediately without scheduling animation frames under reduced motion", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const raf = vi.spyOn(window, "requestAnimationFrame");
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
    );
    const trigger02 = container.querySelector(
      '[data-project-id="lab-robotic-arm"][data-project-trigger]'
    );
    const panel01 = container.querySelector("#project-panel-planning-control");
    const panel02 = container.querySelector("#project-panel-lab-robotic-arm");

    fireEvent.click(trigger02);

    expect(panel01).toHaveAttribute("hidden");
    expect(panel01).toHaveAttribute("aria-hidden", "true");
    expect(panel02).not.toHaveAttribute("hidden");
    expect(raf).not.toHaveBeenCalled();
    raf.mockRestore();
  });

  it("keeps text-only projects intentional and names failed evidence", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const { container } = render(
      <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
    );
    fireEvent.error(screen.getByRole("img", { name: projects[0].homeEvidence.alt }));
    expect(
      screen.getByRole("img", {
        name: `${projects[0].homeEvidence.alt} — ${projects[0].title} image unavailable`,
      })
    ).toBeInTheDocument();

    fireEvent.click(
      container.querySelector('[data-project-id="drug-delivery-ml"][data-project-trigger]')
    );
    const textPanel = container.querySelector("#project-panel-drug-delivery-ml");
    expect(textPanel.querySelector("img, video, [data-media-role]")).toBeNull();
    expect(within(textPanel).getByText("Project note")).toBeInTheDocument();
    expect(within(textPanel).getByRole("link", { name: /Open project/ })).toBeInTheDocument();
    expect(
      container.querySelector('[data-project-trigger].compact-control')
    ).toBeNull();
  });

  it("passes the complete project object through the normal project link", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    const onOpenProject = vi.fn();
    render(<ProjectArchive projects={projects} onOpenProject={onOpenProject} />);
    fireEvent.click(screen.getByRole("link", { name: /Open project/ }));
    expect(onOpenProject).toHaveBeenCalledWith(
      projects.find((project) => project.id === "easy-a-radar")
    );
  });
});
