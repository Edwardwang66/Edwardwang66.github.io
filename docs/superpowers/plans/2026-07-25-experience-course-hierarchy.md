# Experience and Course-Project Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the two CV-aligned internships before the project archive, correct and reorder ECE 276B/ECE 276A, remove course PDFs from the UI, and complete the approved hero social/portrait refinement.

**Architecture:** Keep `profile.experience` as the single experience source and add a `featured` flag plus official website URL for homepage selection. Keep the existing project-detail schema and click-only archive, but replace inaccurate course copy and evidence arrays in `portfolio.js`. Extend `HomePage` with a semantic two-record experience section and existing social icons; responsive behavior remains CSS-only.

**Tech Stack:** React 18, Vite 7, Vitest, Testing Library, Playwright, CSS

## Global Constraints

- Bioyond is first and c12.ai second.
- Use exact CV timestamps: `Jul 2026 — Present` and `Jun 2024 — Aug 2024`.
- ECE 276B is `Spring 2026`; ECE 276A is `Winter 2026`.
- Course PDFs inform copy but are never rendered or linked.
- ECE 276B project evidence is GIF-only and playback is user initiated.
- Preserve Original+ typography, colors, click-only disclosure, and stable scroll.
- Do not add dependencies, a router, animation library, CMS, or fabricated visualization.
- Do not merge, push, or deploy before the finished previews are reviewed.

---

### Task 1: Lock the CV-aligned data contract

**Files:**
- Modify: `src/data/portfolio.test.js`
- Modify: `src/data/portfolio.js`

**Interfaces:**
- Consumes: current `profile.experience` and `projects` exports
- Produces: `profile.experience[].featured`, `profile.experience[].website`, and projects ordered `planning-control`, `state-estimation`, then the remaining four

- [ ] **Step 1: Write failing data tests**

Add assertions that:

```js
expect(
  profile.experience.filter((record) => record.featured).map(
    ({ org, role, year, location, website }) => ({
      org,
      role,
      year,
      location,
      website,
    })
  )
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
```

Assert the first two projects and their timestamps:

```js
expect(projects.slice(0, 2).map(({ id, no, year }) => ({ id, no, year }))).toEqual([
  { id: "planning-control", no: "01", year: "Spring 2026" },
  { id: "state-estimation", no: "02", year: "Winter 2026" },
]);
```

Assert both course projects contain no PDF records and ECE 276B contains only
GIF records across `leadEvidence`, `selectedEvidence`, and `moreEvidence`.
Assert its serialized copy does not contain `reinforcement learning`,
`policy gradient`, or `value iteration`.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/data/portfolio.test.js
```

Expected: FAIL because homepage feature flags and official URLs are absent,
course order and timestamps are stale, and PDF/inaccurate planning content
remain.

- [ ] **Step 3: Implement minimal data changes**

Update the two internship records with the approved fields and CV-grounded
copy. Reorder and renumber all six projects. Replace ECE 276B with report-backed
dynamic-programming and Weighted A* copy, keep a GIF lead plus three selected
GIFs and additional GIFs, and remove both PDFs. Replace ECE 276A with the
three-project WI26 arc, keep `/ece276a/1.png`, and set `moreEvidence: []`.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- src/data/portfolio.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/portfolio.js src/data/portfolio.test.js
git commit -m "feat: align experience and course project content"
```

---

### Task 2: Replace current practice with selected experience

**Files:**
- Modify: `src/pages/HomePage.test.jsx`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/AboutPage.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `profile.experience.filter(record => record.featured)`
- Produces: `#selected-experience` with two `.featured-experience-record` articles and official external links

- [ ] **Step 1: Write failing page tests**

Update `HomePage.test.jsx` to assert:

```jsx
const experience = container.querySelector("#selected-experience");
const records = experience.querySelectorAll(".featured-experience-record");
expect(records).toHaveLength(2);
expect(records[0]).toHaveTextContent("Bioyond Robotics");
expect(records[0]).toHaveTextContent("Jul 2026 — Present");
expect(records[1]).toHaveTextContent("c12.ai");
expect(records[1]).toHaveTextContent("Jun 2024 — Aug 2024");
expect(within(experience).getByRole("link", { name: /Bioyond Robotics/ })).toHaveAttribute(
  "href",
  "https://www.bioyond.com/en/"
);
expect(within(experience).getByRole("link", { name: /c12.ai/ })).toHaveAttribute(
  "href",
  "https://www.c12.ai/en"
);
```

Assert the hero action now links to `#selected-experience`, the experience
section precedes `#selected-work`, and the work count remains six.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/pages/HomePage.test.jsx
```

Expected: FAIL because only the single current-practice block exists.

- [ ] **Step 3: Implement the semantic experience section**

In `HomePage.jsx`, select featured records, rename the secondary hero action to
`Experience`, and render two articles with timestamp, linked company name,
role, location, and note. Use `ArrowUpRight` for the external-link indicator.

In `AboutPage.jsx`, render `record.org` as the same external link when
`record.website` exists.

Replace `.current-practice`/`.practice-record` rules with a border-separated
`.selected-experience` and `.featured-experience-record` grid. Use tabular
dates, modest 13–15px metadata, and no card background or shadow.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- src/pages/HomePage.test.jsx src/pages/AboutPage.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/HomePage.test.jsx src/pages/AboutPage.jsx src/index.css
git commit -m "feat: feature cv aligned internships"
```

---

### Task 3: Complete hero socials and original portrait breakpoints

**Files:**
- Modify: `src/pages/HomePage.test.jsx`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/index.css`
- Modify: `e2e/responsive.spec.js`

**Interfaces:**
- Consumes: `profile.socials` and `socialIcons`
- Produces: `.hero-socials` containing three accessible links and CSS-only 640px/520px hero composition

- [ ] **Step 1: Write failing component and browser assertions**

Assert `HomePage` exposes GitHub, LinkedIn, and Email in `.hero-socials`.
Extend responsive viewports with `520×844` and `519×844`. Assert:

```js
expect(await page.locator(".hero-socials a").allTextContents()).toEqual([
  "GitHub",
  "LinkedIn",
  "Email",
]);
```

At widths `>= 640`, require a 256px portrait in the right column. At exactly
520px, require a 160px portrait to the right of the copy. At 519px and below,
require a 160px centered portrait below `.hero-socials`.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/pages/HomePage.test.jsx
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/responsive.spec.js
```

Expected: FAIL because the hero social row is absent and the existing portrait
is 112–128px below 900px.

- [ ] **Step 3: Implement social markup and responsive CSS**

Render the three links after `.hero-actions` using existing icons and
destinations. Set the desktop portrait to 256px. From 520px through 639px, use
`grid-template-columns: minmax(0, 1fr) 160px`; at 519px and below, use one
column and center the 160px portrait below the social row. Keep all state
changes immediate and preserve the DOM reading order.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- src/pages/HomePage.test.jsx
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/responsive.spec.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/HomePage.test.jsx src/index.css e2e/responsive.spec.js
git commit -m "feat: restore original hero social rhythm"
```

---

### Task 4: Verify course-media behavior and the new reading order

**Files:**
- Modify: `src/pages/ProjectPage.test.jsx`
- Modify: `e2e/home-project-index.spec.js`
- Modify: `e2e/project-media.spec.js`

**Interfaces:**
- Consumes: reordered `projects` and course evidence arrays
- Produces: regression coverage for GIF-only ECE 276B and report-free course pages

- [ ] **Step 1: Write failing integration assertions**

Assert the default expanded project is `planning-control`, keyboard selection
targets the new IDs/order, ECE 276B has no PDF link/iframe and exposes GIF play
controls, and ECE 276A has no report link/iframe.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/pages/ProjectPage.test.jsx
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js
```

Expected: FAIL because current tests and selectors encode the old order and
course-report behavior.

- [ ] **Step 3: Update tests to the approved behavior**

Use project IDs rather than numeric indexes wherever possible. Preserve the
existing click-to-play checks and assert `img[src$=".gif"]` mounts only after
the corresponding play control is activated.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- src/pages/ProjectPage.test.jsx
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProjectPage.test.jsx e2e/home-project-index.spec.js e2e/project-media.spec.js
git commit -m "test: verify course project presentation"
```

---

### Task 5: Full verification and preview handoff

**Files:**
- Verify only unless a failing check identifies a scoped correction

**Interfaces:**
- Consumes: completed production build
- Produces: fresh desktop and mobile screenshots from the same local branch

- [ ] **Step 1: Run full verification**

```bash
npm test
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
git diff --check
```

Expected: all commands exit zero.

- [ ] **Step 2: Start or refresh the production preview**

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Expected: `http://127.0.0.1:4173/` serves the current production build.

- [ ] **Step 3: Capture and inspect**

Capture the homepage at 1440×900 and 390×844 plus the ECE 276B project page.
Confirm hierarchy, exact timestamps, company links, hero socials, portrait
scale, GIF controls, and absence of PDFs.

- [ ] **Step 4: Present without publishing**

Show the desktop and mobile screenshots and report the verified branch/commit.
Do not merge, push, or deploy until Edward approves the visual result.

