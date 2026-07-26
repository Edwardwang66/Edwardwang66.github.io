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
    expect(profile.socials.map(({ label, kind, icon }) => ({
      label,
      kind,
      icon,
    }))).toEqual([
      { label: "GitHub", kind: "link", icon: "github" },
      { label: "LinkedIn", kind: "link", icon: "linkedin" },
      { label: "Email", kind: "link", icon: "mail" },
      { label: "Instagram", kind: "link", icon: "instagram" },
      { label: "Douyin", kind: "profile-card", icon: "douyin" },
      { label: "RedNote", kind: "profile-card", icon: "rednote" },
    ]);

    expect(profile.socials.find(({ label }) => label === "Instagram")).toEqual({
      kind: "link",
      label: "Instagram",
      href: "https://www.instagram.com/edwardwang15/",
      icon: "instagram",
    });

    expect(profile.socials.filter(({ kind }) => kind === "profile-card")).toEqual([
      {
        kind: "profile-card",
        label: "Douyin",
        icon: "douyin",
        displayName: "@Edward",
        accountId: "891461075",
        image: {
          src: "/social/douyin-profile.jpg",
          alt: "Edward's Douyin profile card",
          width: 1125,
          height: 1680,
        },
      },
      {
        kind: "profile-card",
        label: "RedNote",
        icon: "rednote",
        displayName: "Edward",
        accountId: "943036106",
        image: {
          src: "/social/rednote-profile.jpg",
          alt: "Edward's RedNote profile card",
          width: 987,
          height: 1347,
        },
      },
    ]);
  });

  it("puts two live products ahead of the c12.ai robotic arm and ECE 276B", () => {
    expect(projects.map((project) => project.id)).toEqual([
      "easy-a-radar",
      "stock-research-dashboard",
      "lab-robotic-arm",
      "planning-control",
      "state-estimation",
      "off-road-vehicle",
      "drug-delivery-ml",
      "embedded-digital",
    ]);
    expect(
      projects.slice(0, 4).map(({ id, no, year }) => ({ id, no, year }))
    ).toEqual([
      { id: "easy-a-radar", no: "01", year: "Jul 2026 — Present" },
      {
        id: "stock-research-dashboard",
        no: "02",
        year: "Jun 2026 — Present",
      },
      { id: "lab-robotic-arm", no: "03", year: "2024" },
      { id: "planning-control", no: "04", year: "Spring 2026" },
    ]);
    expect(projects.map(({ no }) => no)).toEqual([
      "01", "02", "03", "04", "05", "06", "07", "08",
    ]);
    expect(
      projects.slice(0, 2).map(({ id, role }) => ({ id, role }))
    ).toEqual([
      {
        id: "easy-a-radar",
        role: "Product design, data integration, and front-end engineering",
      },
      {
        id: "stock-research-dashboard",
        role: "Full-stack product engineering and research automation",
      },
    ]);

    for (const [id, liveHref, githubHref] of [
      [
        "easy-a-radar",
        "https://easy-a-radar.vercel.app/",
        "https://github.com/Edwardwang66/ucsd-easy-a-radar",
      ],
      [
        "stock-research-dashboard",
        "https://stock-analysis-ten-phi.vercel.app/",
        "https://github.com/Edwardwang66/stock-analysis",
      ],
    ]) {
      const project = projects.find((record) => record.id === id);
      expect(project.status).toBe("Live product");
      expect(project.links).toEqual([
        { label: "Live Site", href: liveHref },
        { label: "GitHub", href: githubHref },
      ]);
      expect(project.storySections.map((section) => section.label)).toEqual([
        "Overview",
        "Problem",
        "System",
        "What shipped",
        "Reliability and limits",
      ]);
    }

    expect(
      projects.find(({ id }) => id === "planning-control").homeEvidence.src
    ).toBe("/ece276b/pr1/doorkey-poster.png");
    expect(
      projects.find(({ id }) => id === "state-estimation").homeEvidence.src
    ).toBe("/ece276a/1.png");
    expect(
      projects.find(({ id }) => id === "drug-delivery-ml").homeEvidence
    ).toBeNull();
    expect(
      projects.find(({ id }) => id === "embedded-digital").homeEvidence
    ).toBeNull();
  });

  it("uses report-grounded course copy without exposing course PDFs", () => {
    const planning = projects.find((project) => project.id === "planning-control");
    const estimation = projects.find(
      (project) => project.id === "state-estimation"
    );
    const planningCopy = JSON.stringify(planning).toLowerCase();

    expect(planning.title).toBe("Dynamic Programming & 3D Motion Planning");
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
