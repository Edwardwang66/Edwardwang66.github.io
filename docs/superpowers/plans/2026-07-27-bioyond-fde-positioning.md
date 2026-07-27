# Bioyond FDE Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bioyond Robotics internship wording with the approved Forward Deployed Engineering and Physical AI positioning across the homepage and About page.

**Architecture:** Keep `src/data/portfolio.js` as the single content source. Update only the shared Bioyond fields, then lock the exact wording and unchanged surrounding metadata through existing data and page tests.

**Tech Stack:** React 18, Vitest, Testing Library, Vite, Playwright

## Global Constraints

- Use `Forward Deployed Engineer Intern · Physical AI & Laboratory Automation` everywhere the Bioyond role appears.
- Keep `Intern` explicit.
- Use `Pudong, Shanghai · Forward Deployed Engineer Intern at Bioyond Robotics` as the homepage status line.
- Keep the global positioning, biography, document title, Bioyond company name, website, location, and `Jul 2026 — Present` date unchanged.
- Keep every non-Bioyond experience, project, social, media, layout, interaction, dependency, analytics, and deployment setting unchanged.
- Do not push, merge, or deploy as part of implementation.

---

## File Map

- Modify `src/data/portfolio.js`: update the shared status, Current Practice role/note, and first About experience role/note.
- Modify `src/data/portfolio.test.js`: lock the exact approved shared data contract and unchanged Bioyond metadata.
- Modify `src/pages/HomePage.test.jsx`: verify the new status, Current Practice role, and shorter description.
- Modify `src/pages/AboutPage.test.jsx`: verify the new role and detailed description while preserving order, date, location, and website.

### Task 1: Update and verify the Bioyond FDE content contract

**Files:**
- Modify: `src/data/portfolio.js:1-20,101-113`
- Modify: `src/data/portfolio.test.js:3-35`
- Modify: `src/pages/HomePage.test.jsx:15-93`
- Modify: `src/pages/AboutPage.test.jsx:22-49`

**Interfaces:**
- Consumes: the existing `profile` object rendered by `HomePage` and `AboutPage`.
- Produces: one exact Bioyond content contract shared across the homepage status, Current Practice, and About experience.

- [ ] **Step 1: Write the failing data-contract assertions**

In `src/data/portfolio.test.js`, add constants near the import:

```js
const bioyondRole =
  "Forward Deployed Engineer Intern · Physical AI & Laboratory Automation";
const currentPracticeNote =
  "Deploying agentic AI, digital-twin, and laboratory automation systems into real-world scientific environments—from experimental intent and resource binding through simulation validation and physical execution.";
const experienceNote =
  "Deploying agentic AI, digital-twin, and laboratory automation systems into real-world scientific environments. Taking end-to-end responsibility for the path from experimental intent and resource binding through simulation validation and physical execution, with emphasis on reliability, traceability, and human oversight.";
```

Inside `features the two cv-aligned internships in the approved order`, add:

```js
expect(profile.location).toBe(
  "Pudong, Shanghai · Forward Deployed Engineer Intern at Bioyond Robotics"
);
expect(profile.currentPractice).toMatchObject({
  year: "Jul 2026 — Present",
  location: "Pudong, Shanghai, China · On-site",
  org: "Bioyond Robotics",
  role: bioyondRole,
  note: currentPracticeNote,
});
expect(profile.experience[0]).toMatchObject({
  year: "Jul 2026 — Present",
  role: bioyondRole,
  org: "Bioyond Robotics",
  location: "Pudong, Shanghai, China · On-site",
  website: "https://www.bioyond.com/en/",
  featured: true,
  note: experienceNote,
});
```

Replace the stale Bioyond role inside the featured-experience equality with:

```js
role: bioyondRole,
```

- [ ] **Step 2: Write the failing page assertions**

In `src/pages/HomePage.test.jsx`, define the same approved role and Current
Practice note as file constants. Replace the stale status assertion with:

```jsx
expect(
  screen.getByText(
    "Pudong, Shanghai · Forward Deployed Engineer Intern at Bioyond Robotics"
  )
).toBeInTheDocument();
```

In `features the two internships with exact timestamps and official links`,
add:

```jsx
expect(records[0]).toHaveTextContent(bioyondRole);
expect(records[0]).toHaveTextContent(currentPracticeNote);
```

In `src/pages/AboutPage.test.jsx`, define the approved role and detailed
experience note as file constants. Replace the stale role and
`profile.experience[0].note` values in the Bioyond assertion list with:

```js
bioyondRole,
experienceNote,
```

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```bash
npm test -- src/data/portfolio.test.js src/pages/HomePage.test.jsx src/pages/AboutPage.test.jsx
```

Expected: FAIL because the shared profile data still contains the old Agentic
AI Engineer role and descriptions.

- [ ] **Step 4: Update the shared Bioyond data**

In `src/data/portfolio.js`, replace only the approved fields:

```js
location:
  "Pudong, Shanghai · Forward Deployed Engineer Intern at Bioyond Robotics",
```

```js
currentPractice: {
  year: "Jul 2026 — Present",
  location: "Pudong, Shanghai, China · On-site",
  org: "Bioyond Robotics",
  role:
    "Forward Deployed Engineer Intern · Physical AI & Laboratory Automation",
  note:
    "Deploying agentic AI, digital-twin, and laboratory automation systems into real-world scientific environments—from experimental intent and resource binding through simulation validation and physical execution.",
},
```

```js
{
  year: "Jul 2026 — Present",
  role:
    "Forward Deployed Engineer Intern · Physical AI & Laboratory Automation",
  org: "Bioyond Robotics",
  location: "Pudong, Shanghai, China · On-site",
  website: "https://www.bioyond.com/en/",
  featured: true,
  note:
    "Deploying agentic AI, digital-twin, and laboratory automation systems into real-world scientific environments. Taking end-to-end responsibility for the path from experimental intent and resource binding through simulation validation and physical execution, with emphasis on reliability, traceability, and human oversight.",
},
```

Do not edit `profile.role`, `profile.positioning`, `profile.aboutHeading`,
`profile.heroCopy`, or any later experience record.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run:

```bash
npm test -- src/data/portfolio.test.js src/pages/HomePage.test.jsx src/pages/AboutPage.test.jsx
```

Expected: PASS with zero failed tests.

- [ ] **Step 6: Run complete verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests pass, the production build exits 0, all Playwright
tests pass, and no whitespace errors are reported.

- [ ] **Step 7: Check responsive presentation**

Capture the homepage Current Practice section and About Bioyond record at
1440 × 1000 and 390 × 844. Verify the longer role wraps naturally, produces no
horizontal overflow, and leaves the current hierarchy, typography, footer,
social controls, and Curry behavior unchanged.

- [ ] **Step 8: Commit the content update**

```bash
git add src/data/portfolio.js src/data/portfolio.test.js src/pages/HomePage.test.jsx src/pages/AboutPage.test.jsx
git commit -m "content: position Bioyond work as FDE"
```

- [ ] **Step 9: Record final local state**

Run:

```bash
git status --short --branch
git log -5 --oneline --decorate
```

Expected: the worktree is clean. Do not push, merge, or deploy until the user
reviews the finished local preview and explicitly authorizes the next boundary.
