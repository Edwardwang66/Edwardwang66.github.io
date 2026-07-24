import { fireEvent, render, screen, within } from "@testing-library/react";
import { projects } from "../data/portfolio.js";
import ProjectMedia, { MoreEvidence } from "./ProjectMedia.jsx";

describe("ProjectMedia", () => {
  it("renders intrinsic image evidence with an authored caption and fallback", () => {
    const project = projects.find((item) => item.id === "off-road-vehicle");
    const evidence = project.selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={project.title} />
    );
    const image = screen.getByRole("img", { name: evidence.alt });
    expect(image).toHaveAttribute("width", String(evidence.width));
    expect(image).toHaveAttribute("height", String(evidence.height));
    expect(screen.getByText(evidence.caption)).toBeInTheDocument();
    expect(container.querySelector("figure")).toHaveAttribute(
      "data-media-role",
      evidence.role
    );
    fireEvent.error(image);
    expect(
      screen.getByRole("img", {
        name: `${evidence.alt} — ${project.title} image unavailable`,
      })
    ).toBeInTheDocument();
  });

  it("keeps video native, stable, and paused by default", () => {
    const project = projects.find((item) => item.id === "lab-robotic-arm");
    const evidence = project.selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={project.title} />
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute("width", String(evidence.width));
    expect(video).toHaveAttribute("height", String(evidence.height));
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).not.toHaveAttribute("muted");
  });

  it("mounts and unmounts GIF animation only after user action", () => {
    const project = projects.find((item) => item.id === "planning-control");
    const evidence = project.selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={project.title} />
    );
    expect(container.querySelector(`img[src="${evidence.src}"]`)).toBeNull();
    expect(container.querySelector(`img[src="${evidence.poster}"]`)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
    expect(container.querySelector(`img[src="${evidence.src}"]`)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Stop animation" }));
    expect(container.querySelector(`img[src="${evidence.src}"]`)).toBeNull();
  });

  it("keeps PDF links normal and previews lazy", () => {
    const evidence = {
      kind: "pdf",
      src: "/example-report.pdf",
      name: "Example report",
      caption: "A test-only report fixture for the reusable PDF renderer.",
    };
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle="Example project" />
    );
    expect(screen.getByRole("link", { name: evidence.name })).toHaveAttribute(
      "target",
      "_blank"
    );
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Preview report" }));
    expect(container.querySelector("iframe")).toHaveAttribute(
      "title",
      `${evidence.name} preview`
    );
    fireEvent.click(screen.getByRole("button", { name: "Hide preview" }));
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("indexes all-PDF evidence immediately and lazily mounts mixed archives", () => {
    const reports = [
      {
        kind: "pdf",
        src: "/report-1.pdf",
        name: "Report one",
        caption: "The first test-only report fixture.",
      },
      {
        kind: "pdf",
        src: "/report-2.pdf",
        name: "Report two",
        caption: "The second test-only report fixture.",
      },
    ];
    const planning = projects.find((item) => item.id === "planning-control");
    const { container, rerender } = render(
      <MoreEvidence
        evidence={reports}
        projectTitle="Example project"
      />
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(container.querySelector("iframe")).toBeNull();

    rerender(
      <MoreEvidence
        evidence={planning.moreEvidence}
        projectTitle={planning.title}
      />
    );
    expect(container.querySelector("img, iframe, video")).toBeNull();
    const toggle = screen.getByRole("button", {
      name: `More evidence (${planning.moreEvidence.length})`,
    });
    fireEvent.click(toggle);
    const archive = container.querySelector(".more-evidence-body");
    expect(within(archive).getAllByRole("button", { name: "Play animation" })).toHaveLength(
      planning.moreEvidence.length
    );
    fireEvent.click(toggle);
    expect(container.querySelector(".more-evidence-body")).toBeNull();
  });
});
