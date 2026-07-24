import { profile, projects } from "./portfolio.js";

describe("Original+ portfolio content", () => {
  it("features the two cv-aligned internships in the approved order", () => {
    expect(profile.positioning).toBe("Robotics · Agentic AI · AI for Science");
    expect(profile.aboutHeading).toBe(
      "I'm Edward Wang. I work across robotics, Agentic AI, and AI for Science."
    );
    expect(
      profile.experience
        .filter((record) => record.featured)
        .map(({ org, role, year, location, website }) => ({
          org,
          role,
          year,
          location,
          website,
        }))
    ).toEqual([
      {
        org: "Bioyond Robotics",
        role: "Agentic AI Engineer Intern · AI for Science",
        year: "Jul 2026 — Present",
        location: "Pudong, Shanghai, China · On-site",
        website: "https://www.bioyond.com/en/",
      },
      {
        org: "c12.ai",
        role: "Engineering Intern",
        year: "Jun 2024 — Aug 2024",
        location: "Pudong, Shanghai, China",
        website: "https://www.c12.ai/en",
      },
    ]);
    expect(profile.socials.map((social) => social.icon)).toEqual([
      "github",
      "linkedin",
      "mail",
    ]);
  });

  it("puts ECE 276B and ECE 276A first with approved course timestamps", () => {
    expect(projects.map((project) => project.id)).toEqual([
      "planning-control",
      "state-estimation",
      "off-road-vehicle",
      "lab-robotic-arm",
      "drug-delivery-ml",
      "embedded-digital",
    ]);
    expect(
      projects.slice(0, 2).map(({ id, no, year }) => ({ id, no, year }))
    ).toEqual([
      { id: "planning-control", no: "01", year: "Spring 2026" },
      { id: "state-estimation", no: "02", year: "Winter 2026" },
    ]);
    expect(projects[0].homeEvidence.src).toBe(
      "/ece276b/pr1/doorkey-poster.png"
    );
    expect(projects[1].homeEvidence.src).toBe("/ece276a/1.png");
    expect(projects[4].homeEvidence).toBeNull();
    expect(projects[5].homeEvidence).toBeNull();
  });

  it("uses report-grounded course copy without exposing course PDFs", () => {
    const planning = projects.find((project) => project.id === "planning-control");
    const estimation = projects.find(
      (project) => project.id === "state-estimation"
    );
    const planningCopy = JSON.stringify(planning).toLowerCase();

    expect(planningCopy).toContain("dijkstra");
    expect(planningCopy).toContain("weighted a*");
    expect(planningCopy).not.toContain("reinforcement learning");
    expect(planningCopy).not.toContain("policy gradient");
    expect(planningCopy).not.toContain("value iteration");

    for (const project of [planning, estimation]) {
      expect(
        [project.leadEvidence, ...project.selectedEvidence, ...project.moreEvidence]
          .filter(Boolean)
          .some((evidence) => evidence.kind === "pdf")
      ).toBe(false);
    }

    expect(
      [planning.leadEvidence, ...planning.selectedEvidence, ...planning.moreEvidence]
        .filter(Boolean)
        .every((evidence) => evidence.kind === "gif")
    ).toBe(true);
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
