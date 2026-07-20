import { fireEvent, render, screen, within } from "@testing-library/react";
import { projects } from "../data/portfolio.js";
import ProjectMedia, { MoreEvidence } from "./ProjectMedia.jsx";

describe("ProjectMedia", () => {
  it("renders intrinsic image evidence with an authored caption and fallback", () => {
    const evidence = projects[0].selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={projects[0].title} />
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
        name: `${evidence.alt} — ${projects[0].title} image unavailable`,
      })
    ).toBeInTheDocument();
  });

  it("keeps video native, stable, and paused by default", () => {
    const evidence = projects[1].selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={projects[1].title} />
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
    const evidence = projects[4].selectedEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={projects[4].title} />
    );
    expect(container.querySelector(`img[src="${evidence.src}"]`)).toBeNull();
    expect(container.querySelector(`img[src="${evidence.poster}"]`)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
    expect(container.querySelector(`img[src="${evidence.src}"]`)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Stop animation" }));
    expect(container.querySelector(`img[src="${evidence.src}"]`)).toBeNull();
  });

  it("keeps PDF links normal and previews lazy", () => {
    const evidence = projects[2].moreEvidence[0];
    const { container } = render(
      <ProjectMedia evidence={evidence} projectTitle={projects[2].title} />
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
    const { container, rerender } = render(
      <MoreEvidence
        evidence={projects[2].moreEvidence}
        projectTitle={projects[2].title}
      />
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(container.querySelector("iframe")).toBeNull();

    rerender(
      <MoreEvidence
        evidence={projects[4].moreEvidence}
        projectTitle={projects[4].title}
      />
    );
    expect(container.querySelector("img, iframe, video")).toBeNull();
    const toggle = screen.getByRole("button", {
      name: `More evidence (${projects[4].moreEvidence.length})`,
    });
    fireEvent.click(toggle);
    const archive = container.querySelector(".more-evidence-body");
    expect(within(archive).getAllByRole("link").length).toBeGreaterThan(0);
    fireEvent.click(toggle);
    expect(container.querySelector(".more-evidence-body")).toBeNull();
  });
});
