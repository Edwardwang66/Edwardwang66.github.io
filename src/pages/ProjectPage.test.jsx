import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { projects } from "../data/portfolio.js";
import ProjectPage from "./ProjectPage.jsx";

function renderProject(index) {
  const onBack = vi.fn();
  const onOpenProject = vi.fn();
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];
  const result = render(
    <ProjectPage
      project={project}
      nextProject={nextProject}
      onBack={onBack}
      onOpenProject={onOpenProject}
    />
  );
  return { ...result, onBack, onOpenProject, project, nextProject };
}

function renderProjectById(id) {
  return renderProject(projects.findIndex((project) => project.id === id));
}

describe("ProjectPage", () => {
  it("uses the approved technical-journal order and complete stack", () => {
    const { container, onBack, onOpenProject, nextProject, project } =
      renderProject(0);
    const title = screen.getByRole("heading", { level: 1, name: project.title });
    expect(title).toHaveAttribute("id", "project-title");
    expect(title).toHaveAttribute("tabindex", "-1");
    for (const heading of ["Context", "Challenge", "Contribution", "Outcome"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(textOrder(container, ["Context", "Challenge", "Contribution", "Outcome"])).toBe(true);
    expect(screen.getByText(project.approach)).toBeInTheDocument();
    expect(screen.getByText(project.stack.join(" · "))).toBeInTheDocument();
    expect(container.querySelectorAll(".selected-evidence > figure").length).toBeLessThanOrEqual(3);

    fireEvent.click(screen.getByRole("button", { name: "Back to Work" }));
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("link", { name: new RegExp(nextProject.title) }));
    expect(onOpenProject).toHaveBeenCalledWith(nextProject);
  });

  it("keeps both course projects report-free", () => {
    for (const id of ["planning-control", "state-estimation"]) {
      const { container, unmount } = renderProjectById(id);
      expect(screen.queryByRole("link", { name: /PR[123] —/ })).toBeNull();
      expect(container.querySelector("iframe")).toBeNull();
      expect(container.querySelector('[data-media-kind="pdf"]')).toBeNull();
      unmount();
    }
  });

  it("omits every media surface for intentionally text-only projects", () => {
    for (const id of ["drug-delivery-ml", "embedded-digital"]) {
      const { container, unmount } = renderProjectById(id);
      expect(
        container.querySelector(
          "[data-media-kind], .selected-evidence, .more-evidence, .media-fallback, img, video, iframe"
        )
      ).toBeNull();
      expect(screen.queryByRole("heading", { name: "Selected evidence" })).not.toBeInTheDocument();
      unmount();
    }
  });

  it("shows only controlled GIF evidence for ECE 276B", () => {
    const planning = projects.find(
      (project) => project.id === "planning-control"
    );
    const { container } = renderProjectById("planning-control");
    expect(container.querySelectorAll(".selected-evidence > figure")).toHaveLength(3);
    expect(container.querySelectorAll('[data-media-kind="gif"]')).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: "Play animation" })).toHaveLength(
      4
    );
    expect(container.querySelector('[data-media-kind="pdf"]')).toBeNull();
    expect(
      screen.getByRole("button", {
        name: `More evidence (${planning.moreEvidence.length})`,
      })
    ).toBeInTheDocument();
    expect(container.querySelector(".more-evidence-body")).toBeNull();
  });

  it("wraps the next project from 06 to 01", () => {
    const { nextProject } = renderProject(5);
    expect(nextProject).toBe(projects[0]);
    expect(
      screen.getByRole("link", { name: new RegExp(projects[0].title) })
    ).toBeInTheDocument();
  });
});

function textOrder(container, labels) {
  const positions = labels.map((label) => container.textContent.indexOf(label));
  return positions.every(
    (position, index) => position >= 0 && (index === 0 || position > positions[index - 1])
  );
}
