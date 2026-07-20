import { profile, projects } from "./portfolio.js";

describe("Original+ portfolio content", () => {
  it("puts Bioyond first and preserves the approved positioning", () => {
    expect(profile.positioning).toBe("Robotics · Agentic AI · AI for Science");
    expect(profile.aboutHeading).toBe(
      "I'm Edward Wang. I work across robotics, Agentic AI, and AI for Science."
    );
    expect(profile.experience[0]).toMatchObject({
      org: "Bioyond Robotics",
      role: "Agentic AI Engineer Intern · AI for Science",
      year: "Jul 2026 — Present",
      location: "Pudong, Shanghai, China · On-site",
    });
    expect(profile.socials.map((social) => social.icon)).toEqual([
      "github",
      "linkedin",
      "mail",
    ]);
  });

  it("keeps six projects in order with authentic homepage evidence only", () => {
    expect(projects.map((project) => project.id)).toEqual([
      "off-road-vehicle",
      "lab-robotic-arm",
      "state-estimation",
      "drug-delivery-ml",
      "planning-control",
      "embedded-digital",
    ]);
    expect(projects[0].homeEvidence.src).toBe("/ece191/2.png");
    expect(projects[3].homeEvidence).toBeNull();
    expect(projects[4].homeEvidence.src).toBe(
      "/ece276b/pr1/doorkey-poster.png"
    );
    expect(projects[5].homeEvidence).toBeNull();
  });

  it("caps selected evidence and normalizes every legacy media record", () => {
    for (const project of projects) {
      expect(project.selectedEvidence.length).toBeLessThanOrEqual(3);
      for (const evidence of [
        ...project.selectedEvidence,
        ...project.moreEvidence,
      ]) {
        expect(evidence.caption.length).toBeGreaterThan(12);
        if (evidence.kind === "gif") {
          expect(evidence.poster).toMatch(/\.(png|jpe?g)$/i);
        }
      }
      expect(project).not.toHaveProperty("media");
      expect(project).not.toHaveProperty("cover");
      expect(project).not.toHaveProperty("gallery");
    }
  });
});
