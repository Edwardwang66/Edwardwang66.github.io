# Live Product Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Easy-A Radar and Multi-Market Stock Research Dashboard as the first two Selected Work entries, move the c12.ai laboratory robotic arm to third, and preserve restrained archive evidence, independent live/source links, complete product narratives, and mobile scroll activation.

**Architecture:** Keep `src/data/portfolio.js` as the project source of truth and extend existing records with optional `storySections` and `status`. Reuse `ProjectArchive`, `ProjectPage`, `ProjectMedia`, `SafeImage`, the hash-based project navigation, `useDisclosureSpring`, and `useMobileProjectActivation`; add no runtime data fetch or new dependency.

**Tech Stack:** React 18, Vite 7, Vitest 4, Testing Library, Playwright, existing CSS, local PNG assets.

## Global Constraints

- Project order begins `easy-a-radar`, `stock-research-dashboard`, `lab-robotic-arm`, `planning-control`.
- Easy-A Radar timestamp is exactly `Jul 2026 — Present`.
- Stock dashboard timestamp is exactly `Jun 2026 — Present`.
- Live URLs and GitHub URLs must exactly match the approved spec.
- Product screenshots are local `1440 × 1000` PNG assets; do not iframe or fetch live applications at runtime.
- Archive screenshots use a `13 / 7` frame, top crop, `saturate(0.9) contrast(0.98)`, blue hairline, narrow side fade, and no heavy shadow.
- Product-page lead screenshots remain unfiltered.
- Exactly one archive item is open; desktop activation is click-driven and mobile activation follows the existing reading-line hook.
- Reduced motion is immediate; normal disclosure motion uses existing height/opacity/crop behavior.
- Existing course, robotics, internship, hero, navigation, and portrait content remains unchanged.
- Do not modify the Easy-A Radar or stock-analysis repositories.
- Do not stage `docs/superpowers/plans/2026-07-25-ece276a-gif-showcase.md` or `ece276b/`.
- Do not push, merge, or deploy before the user reviews desktop and mobile output.

## File Structure

- Create `public/products/easy-a-radar.png`: approved Easy-A Radar interface evidence.
- Create `public/products/stock-research-dashboard.png`: approved stock dashboard evidence.
- Create `test/live-product-media.test.mjs`: validates PNG signatures, dimensions, bounds, and exact portfolio asset URLs.
- Modify `src/data/portfolio.js`: add both product records, optional `storySections`/`status`, exact links, and the new order.
- Modify `src/data/portfolio.test.js`: lock content, order, timestamps, links, section labels, and evidence.
- Modify `src/pages/ProjectPage.jsx`: render optional product story sections and product-specific Stack/Links sections while preserving legacy pages.
- Modify `src/pages/ProjectPage.test.jsx`: verify both product pages and legacy fallback.
- Modify `src/components/ProjectArchive.jsx`: add live status, outbound actions, local media frame hooks, disclosure spring, and mobile activation.
- Modify `src/components/ProjectArchive.test.jsx`: verify eight rows, outbound action isolation, disclosure state, and failure fallback.
- Modify `src/index.css`: add archive product status/actions/frame treatment and responsive behavior.
- Modify `src/pages/HomePage.test.jsx`: update first-project expectations.
- Modify `e2e/home-project-index.spec.js`: update desktop order and assert mobile progression.
- Modify `e2e/responsive.spec.js`: update the first expanded project and product frame constraints.
- Modify `e2e/project-media.spec.js`: verify both product pages, local screenshots, stories, and failure fallback.

---

### Task 1: Add Verified Product Assets and Data Records

**Files:**
- Create: `public/products/easy-a-radar.png`
- Create: `public/products/stock-research-dashboard.png`
- Create: `test/live-product-media.test.mjs`
- Modify: `src/data/portfolio.js`
- Modify: `src/data/portfolio.test.js`

**Interfaces:**
- Consumes: verified screenshots at `.superpowers/brainstorm/13793-1784992839/content/assets/easy-a.png` and `.superpowers/brainstorm/13793-1784992839/content/assets/stock.png`
- Produces: project records with IDs `easy-a-radar` and `stock-research-dashboard`, optional `status: "Live product"`, `storySections: Array<{ label: string, body: string }>`, exact `links`, and local evidence paths

- [ ] **Step 1: Write the failing project-data assertions**

Replace the existing order assertion in `src/data/portfolio.test.js` and add a product contract:

```js
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
```

- [ ] **Step 2: Create the failing media-contract test**

Create `test/live-product-media.test.mjs`:

```js
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { projects } from "../src/data/portfolio.js";

const records = [
  {
    id: "easy-a-radar",
    file: "public/products/easy-a-radar.png",
    url: "/products/easy-a-radar.png",
  },
  {
    id: "stock-research-dashboard",
    file: "public/products/stock-research-dashboard.png",
    url: "/products/stock-research-dashboard.png",
  },
];

function pngDimensions(bytes) {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("live product media contract", () => {
  it("keeps both verified screenshots local, bounded, and exact", async () => {
    for (const { id, file, url } of records) {
      const bytes = await readFile(file);
      expect([...bytes.subarray(0, 8)]).toEqual([
        137, 80, 78, 71, 13, 10, 26, 10,
      ]);
      expect(pngDimensions(bytes)).toEqual({ width: 1440, height: 1000 });
      expect(bytes.length).toBeLessThanOrEqual(3 * 1024 * 1024);

      const project = projects.find((record) => record.id === id);
      expect(project.homeEvidence.src).toBe(url);
      expect(project.leadEvidence.src).toBe(url);
      expect(project.homeEvidence).not.toBe(project.leadEvidence);
    }
  });
});
```

- [ ] **Step 3: Run the focused tests and verify failure**

Run:

```bash
npm test -- src/data/portfolio.test.js test/live-product-media.test.mjs
```

Expected: FAIL because the two IDs, asset files, and product records do not exist.

- [ ] **Step 4: Copy the approved screenshots into production paths**

Run:

```bash
mkdir -p public/products
cp .superpowers/brainstorm/13793-1784992839/content/assets/easy-a.png \
  public/products/easy-a-radar.png
cp .superpowers/brainstorm/13793-1784992839/content/assets/stock.png \
  public/products/stock-research-dashboard.png
```

Do not resize or recolor the source pixels. Presentation filtering belongs in CSS.

- [ ] **Step 5: Add the exact Easy-A Radar record**

Insert this record in `projectRecords`:

```js
{
  id: "easy-a-radar",
  year: "Jul 2026 — Present",
  status: "Live product",
  title: "Easy-A Radar",
  role: "Product design, data integration, and front-end engineering",
  tags: ["Course intelligence", "Scheduling", "Academic planning"],
  summary:
    "A UCSD course-intelligence and planning tool that connects historical outcomes, current instructors, schedules, and degree requirements.",
  context: "Independent product · UC San Diego",
  overview:
    "A live student tool for turning fragmented course, instructor, schedule, and degree information into one practical planning workflow.",
  challenge:
    "Students have to compare historical grade outcomes, instructors, current offerings, time conflicts, and program requirements across disconnected sources.",
  approach:
    "Built a static, data-backed interface with current-term instructor mapping, ranking and filtering, schedule construction, conflict detection, calendar export, campus context, and degree-planning views.",
  outcome:
    "A usable planning surface for course discovery through schedule and degree decisions, with clear boundaries around official academic advice.",
  storySections: [
    {
      label: "Overview",
      body:
        "Easy-A Radar brings course history, current teaching information, scheduling, and degree planning into one live student tool.",
    },
    {
      label: "Problem",
      body:
        "UCSD students otherwise compare grade distributions, instructor history, live offerings, time conflicts, and program requirements across multiple systems.",
    },
    {
      label: "System",
      body:
        "The product combines a static HTML/CSS/JavaScript interface with structured datasets, current-term instructor mapping, and local planning workflows.",
    },
    {
      label: "What shipped",
      body:
        "Course ranking, professor context, current-term filters, schedule building, conflict detection, calendar and ICS export, campus map, undergraduate requirements, and graduate degree planning.",
    },
    {
      label: "Reliability and limits",
      body:
        "The interface uses real 2015–2026 course-grade distributions and RateMyProfessors context, but it is not an official UCSD system. Current offerings and academic requirements must be confirmed with UCSD and an advisor.",
    },
  ],
  stack: [
    "HTML",
    "CSS",
    "JavaScript",
    "Structured JSON",
    "Vercel Functions",
    "Collection/processing scripts",
  ],
  links: [
    { label: "Live Site", href: "https://easy-a-radar.vercel.app/" },
    {
      label: "GitHub",
      href: "https://github.com/Edwardwang66/ucsd-easy-a-radar",
    },
  ],
  homeEvidence: {
    kind: "image",
    src: "/products/easy-a-radar.png",
    alt: "Easy-A Radar course-ranking and planning interface",
    caption:
      "Course rankings, current instructors, schedule tools, and degree planning in one live UCSD workflow.",
    heading: "From fragmented course data to an actionable student workflow.",
    width: 1440,
    height: 1000,
    role: "live-product",
    fit: "cover",
    position: "center top",
  },
  leadEvidence: {
    kind: "image",
    src: "/products/easy-a-radar.png",
    alt: "Easy-A Radar course-ranking and planning interface",
    caption:
      "The live product surface combines ranking, filtering, schedule, and degree-planning entry points.",
    width: 1440,
    height: 1000,
    role: "live-product",
    fit: "contain",
    position: "center top",
  },
  selectedEvidence: [],
  moreEvidence: [],
},
```

- [ ] **Step 6: Add the exact stock dashboard record**

Insert this record in `projectRecords`:

```js
{
  id: "stock-research-dashboard",
  year: "Jun 2026 — Present",
  status: "Live product",
  title: "Multi-Market Stock Research Dashboard",
  role: "Full-stack product engineering and research automation",
  tags: ["Market data", "Research tooling", "Automation"],
  summary:
    "A personal multi-market research workbench for monitoring, analysis, tracking, and durable research records.",
  context: "Independent product · Personal research infrastructure",
  overview:
    "One research surface for US, Hong Kong, A-share, crypto, and index monitoring.",
  challenge:
    "Market data, technical context, watchlists, alerts, paper positions, and research notes otherwise live in disconnected tools.",
  approach:
    "Combined a Next.js interface with quote and OHLCV adapters, optional FastAPI services, Git-backed feeds, and Python research automation.",
  outcome:
    "A self-hostable research workbench that centralizes monitoring and analysis without presenting itself as a brokerage or execution system.",
  storySections: [
    {
      label: "Overview",
      body:
        "The dashboard provides one research surface for US, Hong Kong, A-share, crypto, and index monitoring.",
    },
    {
      label: "Problem",
      body:
        "Quotes, technical context, watchlists, alerts, paper positions, intelligence views, and research notes otherwise live in disconnected tools.",
    },
    {
      label: "System",
      body:
        "A Next.js interface works with quote and OHLCV adapters, optional FastAPI services, Git-backed feeds, and Python research automation.",
    },
    {
      label: "What shipped",
      body:
        "Multi-market dashboards, technical panels, screener, tracker, watchlist, alerts, paper portfolio, intelligence views, reports, and automated data-refresh paths.",
    },
    {
      label: "Reliability and limits",
      body:
        "Public providers can delay, throttle, or fail. The product does not execute trades, does not provide multi-user authentication, and is not investment advice.",
    },
  ],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "lightweight-charts",
    "Optional FastAPI",
    "Python",
  ],
  links: [
    {
      label: "Live Site",
      href: "https://stock-analysis-ten-phi.vercel.app/",
    },
    {
      label: "GitHub",
      href: "https://github.com/Edwardwang66/stock-analysis",
    },
  ],
  homeEvidence: {
    kind: "image",
    src: "/products/stock-research-dashboard.png",
    alt: "Multi-market stock research dashboard interface",
    caption:
      "Multi-market monitoring, technical context, and research tools in one dashboard.",
    heading: "A personal research workbench across markets and data sources.",
    width: 1440,
    height: 1000,
    role: "live-product",
    fit: "cover",
    position: "center top",
  },
  leadEvidence: {
    kind: "image",
    src: "/products/stock-research-dashboard.png",
    alt: "Multi-market stock research dashboard interface",
    caption:
      "The live workbench joins market monitoring, analysis, tracking, and research records.",
    width: 1440,
    height: 1000,
    role: "live-product",
    fit: "contain",
    position: "center top",
  },
  selectedEvidence: [],
  moreEvidence: [],
},
```

- [ ] **Step 7: Update project order and legacy index expectations**

Set:

```js
const projectOrder = [
  "easy-a-radar",
  "stock-research-dashboard",
  "lab-robotic-arm",
  "planning-control",
  "state-estimation",
  "off-road-vehicle",
  "drug-delivery-ml",
  "embedded-digital",
];
```

Rename the existing course-order test so it describes the two live products
followed by the c12.ai robotic arm and ECE 276B. Update every old numeric
project lookup to resolve by ID instead.

In the existing course-order test, replace numeric media/null lookups with:

```js
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
```

- [ ] **Step 8: Run focused tests**

Run:

```bash
npm test -- src/data/portfolio.test.js test/live-product-media.test.mjs
```

Expected: PASS.

- [ ] **Step 9: Commit the data and assets**

```bash
git add \
  public/products/easy-a-radar.png \
  public/products/stock-research-dashboard.png \
  test/live-product-media.test.mjs \
  src/data/portfolio.js \
  src/data/portfolio.test.js
git commit -m "feat: add live product portfolio records"
```

---

### Task 2: Render Complete Product Narratives

**Files:**
- Modify: `src/pages/ProjectPage.jsx`
- Modify: `src/pages/ProjectPage.test.jsx`

**Interfaces:**
- Consumes: optional `project.storySections`
- Produces: `ProjectStory({ project })`, a legacy four-section fallback, and product-only `Stack`/`Links` sections

- [ ] **Step 1: Write failing product-story tests**

Add to `src/pages/ProjectPage.test.jsx`:

```jsx
it.each(["easy-a-radar", "stock-research-dashboard"])(
  "renders the complete product story for %s",
  (id) => {
    const { container, project } = renderProjectById(id);
    const labels = [
      "Overview",
      "Problem",
      "System",
      "What shipped",
      "Reliability and limits",
      "Stack",
      "Links",
    ];

    for (const label of labels) {
      expect(
        screen.getByRole("heading", { name: label })
      ).toBeInTheDocument();
    }
    expect(textOrder(container, labels)).toBe(true);
    expect(screen.getByRole("link", { name: /Live Site/ })).toHaveAttribute(
      "href",
      project.links[0].href
    );
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      project.links[1].href
    );
    expect(screen.queryByRole("heading", { name: "Context" })).toBeNull();
  }
);

it("keeps the legacy four-section story for existing projects", () => {
  renderProjectById("planning-control");
  for (const heading of [
    "Context",
    "Challenge",
    "Contribution",
    "Outcome",
  ]) {
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  }
expect(screen.queryByRole("heading", { name: "Problem" })).toBeNull();
});
```

Update the setup line in the existing
`"uses the approved technical-journal order and complete stack"` test from
`renderProject(0)` to `renderProjectById("planning-control")`. Keep every
existing assertion in that test.

Replace the existing wrap test with:

```jsx
it("wraps the last project back to the first", () => {
  const { nextProject } = renderProject(projects.length - 1);
  expect(nextProject).toBe(projects[0]);
  expect(
    screen.getByRole("link", { name: new RegExp(projects[0].title) })
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the page test and verify failure**

Run:

```bash
npm test -- src/pages/ProjectPage.test.jsx
```

Expected: FAIL because product pages still use the legacy headings and do not render final Stack/Links sections in the approved order.

- [ ] **Step 3: Extract `ProjectStory` and conditional product metadata**

In `src/pages/ProjectPage.jsx`, add:

```jsx
function ExternalLinks({ links }) {
  return links.map((link) => (
    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
      {link.label} <ExternalLink aria-hidden="true" />
    </a>
  ));
}

function ProjectStory({ project }) {
  if (project.storySections?.length) {
    return (
      <>
        <div className="project-story">
          {project.storySections.map((section) => (
            <section key={section.label}>
              <h2>{section.label}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <section className="project-tools" aria-labelledby="project-stack-title">
          <h2 id="project-stack-title">Stack</h2>
          <p>{project.stack.join(" · ")}</p>
        </section>
        <section className="project-links-section" aria-labelledby="project-links-title">
          <h2 id="project-links-title">Links</h2>
          <div className="project-links">
            <ExternalLinks links={project.links} />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="project-story">
        <section><h2>Context</h2><p>{project.overview}</p></section>
        <section><h2>Challenge</h2><p>{project.challenge}</p></section>
        <section><h2>Contribution</h2><p>{project.approach}</p></section>
        <section><h2>Outcome</h2><p>{project.outcome}</p></section>
      </div>
      <section className="project-tools" aria-labelledby="project-tools-title">
        <h2 id="project-tools-title">Tools and technologies</h2>
        <p>{project.stack.join(" · ")}</p>
      </section>
    </>
  );
}
```

For records with `storySections`, remove Stack and Links from the header facts:

```jsx
const productStory = Boolean(project.storySections?.length);
```

Render Role and Year for every project. Render header Stack and Links facts only when `!productStory`. Replace the old inline story/tools blocks with `<ProjectStory project={project} />`.

- [ ] **Step 4: Add focused CSS for the final Links section**

In `src/index.css`, share typography and spacing with `.project-tools`:

```css
.project-links-section {
  max-width: 720px;
  margin-top: clamp(64px, 8vw, 88px);
  border-top: 1px solid var(--line);
  padding-top: 20px;
}

.project-links-section h2 {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 12px;
}

.project-links a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 5px;
  color: var(--blue);
}
```

- [ ] **Step 5: Run page and data tests**

Run:

```bash
npm test -- src/pages/ProjectPage.test.jsx src/data/portfolio.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit the product narrative**

```bash
git add src/pages/ProjectPage.jsx src/pages/ProjectPage.test.jsx src/index.css
git commit -m "feat: render complete live product stories"
```

---

### Task 3: Add Archive Status, Outbound Actions, and Product Evidence Styling

**Files:**
- Modify: `src/components/ProjectArchive.jsx`
- Modify: `src/components/ProjectArchive.test.jsx`
- Modify: `src/index.css`
- Modify: `src/pages/HomePage.test.jsx`

**Interfaces:**
- Consumes: `project.status`, `project.links`, `homeEvidence.role === "live-product"`
- Produces: `.project-live-status`, `.project-panel-actions`, and isolated external anchors

- [ ] **Step 1: Write failing archive tests**

Update the row count to eight and add:

```jsx
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
```

Update first-project assumptions to `easy-a-radar` and resolve other triggers by ID rather than index.

- [ ] **Step 2: Run the component tests and verify failure**

Run:

```bash
npm test -- src/components/ProjectArchive.test.jsx src/pages/HomePage.test.jsx
```

Expected: FAIL because there are six rows, no live status, and no external panel actions.

- [ ] **Step 3: Add status and actions without nesting interactive controls**

In `ProjectArchive.jsx`, replace the year span with:

```jsx
<span className="project-meta">
  {project.status ? (
    <span className="project-live-status">
      <span aria-hidden="true" />
      {project.status}
    </span>
  ) : null}
  <span className="project-year">{project.year}</span>
</span>
```

Inside `.project-panel-copy`, before the internal project action, add:

```jsx
{project.links.length ? (
  <div className="project-panel-actions" aria-label={`${project.title} links`}>
    {project.links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        target="_blank"
        rel="noreferrer"
      >
        {link.label} <ArrowUpRight aria-hidden="true" />
      </a>
    ))}
  </div>
) : null}
```

Keep `Open project` as the only link that calls `onOpenProject`.

- [ ] **Step 4: Add exact archive styling**

Add to `src/index.css`:

```css
.project-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px 10px;
  flex-wrap: wrap;
}

.project-live-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.project-live-status > span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
}

.archive-evidence[data-media-role="live-product"] {
  position: relative;
  width: min(100%, 520px);
  aspect-ratio: 13 / 7;
  overflow: hidden;
  border: 1px solid rgba(39, 77, 102, 0.3);
  border-radius: 10px;
  background: #f1f1ee;
}

.archive-evidence[data-media-role="live-product"]::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(250, 250, 248, 0.2), transparent 12px),
    linear-gradient(270deg, rgba(250, 250, 248, 0.2), transparent 12px);
  content: "";
  pointer-events: none;
}

.archive-evidence[data-media-role="live-product"] img,
.archive-evidence[data-media-role="live-product"] .media-fallback {
  width: 100%;
  height: 100%;
  max-height: none;
  border-radius: 0;
  filter: saturate(0.9) contrast(0.98);
  object-fit: cover;
  object-position: center top;
}

.project-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 18px;
}

.project-panel-actions + a {
  margin-top: 10px;
}
```

At `max-width: 639px`, keep the frame at `width: min(100%, 100vw - 56px)` and retain `aspect-ratio: 13 / 7`.

- [ ] **Step 5: Update the HomePage first-project expectation**

In `HomePage.test.jsx`, keep the current portrait assertions and expect the
first `Open project` action to call `onOpenProject` with `projects[0]`, now
Easy-A Radar. Row-count coverage remains in `ProjectArchive.test.jsx`.

- [ ] **Step 6: Run component and smoke tests**

Run:

```bash
npm test -- \
  src/components/ProjectArchive.test.jsx \
  src/pages/HomePage.test.jsx
```

Expected: PASS.

- [ ] **Step 7: Commit archive presentation**

```bash
git add \
  src/components/ProjectArchive.jsx \
  src/components/ProjectArchive.test.jsx \
  src/pages/HomePage.test.jsx \
  src/index.css
git commit -m "feat: integrate live products into project archive"
```

---

### Task 4: Restore Mobile Activation and Restrained Disclosure Motion

**Files:**
- Modify: `src/components/ProjectArchive.jsx`
- Modify: `src/components/ProjectArchive.test.jsx`
- Modify: `e2e/home-project-index.spec.js`

**Interfaces:**
- Consumes: `useDisclosureSpring({ ids, activeId, reducedMotion })`, `useMobileProjectActivation({ ids, activeId, onActivate, triggerNodes, panelNodes })`, and `useMediaPreference("(prefers-reduced-motion: reduce)")`
- Produces: registered trigger/panel/content nodes and manual-tap locking

- [ ] **Step 1: Replace the stale mobile E2E expectation**

In `e2e/home-project-index.spec.js`, replace the test that expects scrolling to preserve `planning-control` with:

```js
test("mobile scrolling advances one project at a time without programmatic scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await installProgrammaticScrollSpy(page);
  await expect.poll(() => expandedProjectIds(page)).toEqual(["easy-a-radar"]);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (
      (await expandedProjectIds(page)).includes(
        "stock-research-dashboard"
      )
    ) {
      break;
    }
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
  }

  await expect
    .poll(() => expandedProjectIds(page))
    .toEqual(["stock-research-dashboard"]);
  expect(await page.evaluate(() => window.__programmaticScrollCalls)).toEqual(
    []
  );
});
```

- [ ] **Step 2: Write a component integration test for registered panels**

Add to `ProjectArchive.test.jsx`:

```jsx
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
```

- [ ] **Step 3: Run tests and verify the E2E failure**

Run:

```bash
npm test -- src/components/ProjectArchive.test.jsx
npm run build
npx playwright test e2e/home-project-index.spec.js
```

Expected: unit tests may pass with immediate state, but the new mobile E2E fails because `ProjectArchive` is not wired to the mobile activation hook.

- [ ] **Step 4: Wire the existing hooks into `ProjectArchive`**

Use:

```jsx
const ids = useMemo(() => projects.map((project) => project.id), [projects]);
const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");
const triggerNodes = useRef(new Map());
const panelNodes = useRef(new Map());
const triggerCallbacks = useRef(new Map());
const archivePanelCallbacks = useRef(new Map());

const { registerPanel, registerPanelContent } = useDisclosureSpring({
  ids,
  activeId,
  reducedMotion,
});

const { noteManualActivation } = useMobileProjectActivation({
  ids,
  activeId,
  onActivate: setActiveId,
  triggerNodes,
  panelNodes,
});
```

Create stable registration callbacks:

```jsx
const registerTrigger = useCallback((id) => {
  if (!triggerCallbacks.current.has(id)) {
    triggerCallbacks.current.set(id, (node) => {
      if (node) triggerNodes.current.set(id, node);
      else triggerNodes.current.delete(id);
    });
  }
  return triggerCallbacks.current.get(id);
}, []);

const registerArchivePanel = useCallback(
  (id) => {
    if (!archivePanelCallbacks.current.has(id)) {
      const registerDisclosurePanel = registerPanel(id);
      archivePanelCallbacks.current.set(id, (node) => {
        registerDisclosurePanel(node);
        if (node) panelNodes.current.set(id, node);
        else panelNodes.current.delete(id);
      });
    }
    return archivePanelCallbacks.current.get(id);
  },
  [registerPanel]
);
```

Use the `registerArchivePanel(id)` callback below to update both the
disclosure hook and `panelNodes` map. Do not create inline ref callbacks inside
`.map()`.

Change manual activation to:

```jsx
const activate = useCallback(
  (id) => {
    noteManualActivation();
    setActiveId((current) => (current === id ? current : id));
  },
  [noteManualActivation]
);
```

Attach `ref={registerTrigger(project.id)}` to each trigger,
`ref={registerArchivePanel(project.id)}` to each panel, and
`ref={registerPanelContent(project.id)}` to `.project-panel-content`. Remove
the JSX `hidden` and `aria-hidden` props; `useDisclosureSpring` owns `hidden`,
`inert`, `aria-hidden`, height, opacity, and transform from the initial layout
effect onward. Keep `aria-expanded` and `aria-controls` on the trigger.

- [ ] **Step 5: Run hook, component, and E2E tests**

Run:

```bash
npm test -- \
  src/components/ProjectArchive.test.jsx \
  src/hooks/useMobileProjectActivation.test.jsx \
  src/hooks/useDisclosureSpring.test.jsx
npm run build
npx playwright test e2e/home-project-index.spec.js
```

Expected: PASS. Mobile scroll activates the nearest project; manual activation keeps its temporary lock; reduced motion is immediate.

- [ ] **Step 6: Commit activation integration**

```bash
git add \
  src/components/ProjectArchive.jsx \
  src/components/ProjectArchive.test.jsx \
  e2e/home-project-index.spec.js
git commit -m "feat: activate archive projects while scrolling on mobile"
```

---

### Task 5: Complete Product Browser Coverage and Full Verification

**Files:**
- Modify: `e2e/responsive.spec.js`
- Modify: `e2e/project-media.spec.js`
- Modify: `e2e/home-project-index.spec.js`

**Interfaces:**
- Consumes: stable IDs, `.archive-evidence[data-media-role="live-product"]`, product story headings, and exact external links
- Produces: end-to-end release evidence for product pages and archive behavior

- [ ] **Step 1: Update responsive initial-state assertions**

In `e2e/responsive.spec.js`:

```js
expect(await expandedProjectIds(page)).toEqual(["easy-a-radar"]);
```

For live product evidence:

```js
const liveFrame = page.locator(
  '.archive-evidence[data-media-role="live-product"]'
).first();
const frameBox = await liveFrame.boundingBox();
expect(frameBox.width / frameBox.height).toBeCloseTo(13 / 7, 1);
expect(frameBox.width).toBeLessThanOrEqual(
  viewport.width < 640 ? viewport.width - 56 + 1 : 520.5
);
```

- [ ] **Step 2: Add product page E2E coverage**

Add to `e2e/project-media.spec.js`:

```js
for (const product of [
  {
    id: "easy-a-radar",
    live: "https://easy-a-radar.vercel.app/",
    asset: "/products/easy-a-radar.png",
  },
  {
    id: "stock-research-dashboard",
    live: "https://stock-analysis-ten-phi.vercel.app/",
    asset: "/products/stock-research-dashboard.png",
  },
]) {
  test(`${product.id} renders a local complete product story`, async ({ page }) => {
    await page.goto("/");
    await openProject(page, product.id);
    await expect(page.locator(`img[src="${product.asset}"]`)).toBeVisible();
    for (const heading of [
      "Overview",
      "Problem",
      "System",
      "What shipped",
      "Reliability and limits",
      "Stack",
      "Links",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Live Site" })).toHaveAttribute(
      "href",
      product.live
    );
  });
}
```

- [ ] **Step 3: Add product screenshot failure coverage**

Add:

```js
test("a failed live product screenshot keeps a named stable frame", async ({
  page,
}) => {
  await page.route("**/products/easy-a-radar.png", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByRole("img", {
      name: /Easy-A Radar course-ranking.*image unavailable/,
    })
  ).toBeVisible();
  const frame = await page
    .locator('.archive-evidence[data-media-role="live-product"]')
    .first()
    .boundingBox();
  expect(frame.width / frame.height).toBeCloseTo(13 / 7, 1);
});
```

- [ ] **Step 4: Run the complete automated verification**

Run:

```bash
npm test
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
```

Expected:

- all Vitest files pass;
- Vite production build exits `0`;
- every Playwright test passes in system Chrome;
- no new console errors are reported.

- [ ] **Step 5: Perform manual desktop and mobile review**

Start:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Review at `1440 × 1000` and `390 × 844`:

- Easy-A Radar and stock dashboard are first and second;
- the c12.ai laboratory robotic arm is third on desktop and mobile;
- first project is expanded;
- desktop click switches exactly one row;
- mobile scroll closes the previous row and opens the next;
- the two product screenshots remain restrained and top-cropped;
- live/source actions do not trigger disclosure or internal navigation;
- both product pages show complete stories and local lead screenshots;
- existing ECE 276B/ECE 276A media behavior remains intact;
- no horizontal overflow or console errors.

- [ ] **Step 6: Commit browser coverage**

```bash
git add \
  e2e/home-project-index.spec.js \
  e2e/responsive.spec.js \
  e2e/project-media.spec.js
git commit -m "test: cover live product portfolio flows"
```

- [ ] **Step 7: Stop at the visual-review gate**

Capture desktop and mobile screenshots for the user. Do not push, merge, or deploy. Record the exact test/build/E2E totals and current commit before requesting approval.
