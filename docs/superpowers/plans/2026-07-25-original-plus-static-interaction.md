# Original+ Static Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original portfolio's stable editorial header and hero, replace scroll-driven project drawers with click-only disclosure, and deliver verified desktop and mobile production previews.

**Architecture:** Keep the existing React view and data structure. Simplify `ProjectArchive` to one local `activeId` state with native `hidden` panel semantics, make `SiteChrome` a static navigation shell with a mail CTA, and implement responsive composition entirely in CSS so scroll position never drives layout state.

**Tech Stack:** React 18, Vite 7, Vitest, Testing Library, Playwright, CSS

## Global Constraints

- Keep the current Agentic AI, AI for Science, current-practice, project-detail, and media content.
- Do not add a router, animation library, theme system, CMS, or new dependency.
- The status dot, navigation, and hero must have no continuous or scroll-driven animation.
- Exactly one project remains expanded; scrolling alone must never change it.
- Validate 1440×900, 1280×800, 768×1024, 632×661, 390×844, and 375×667.
- Present desktop and mobile production screenshots before merge, push, or deployment.

---

### Task 1: Replace the project spring and scroll observer with click-only disclosure

**Files:**
- Modify: `src/components/ProjectArchive.jsx`
- Modify: `src/components/ProjectArchive.test.jsx`
- Modify: `e2e/home-project-index.spec.js`
- Modify: `e2e/accessibility-preferences.spec.js`

**Interfaces:**
- Consumes: `projects: Project[]`, `onOpenProject(project): void`
- Produces: `[data-project-trigger]` buttons with one `aria-expanded="true"` and sibling panels hidden natively when inactive

- [ ] **Step 1: Write failing component tests for immediate inactive-panel semantics**

Replace the spring-specific test in `src/components/ProjectArchive.test.jsx`:

```jsx
it("hides the previous panel immediately without scheduling animation frames", () => {
  const raf = vi.spyOn(window, "requestAnimationFrame");
  const { container } = render(
    <ProjectArchive projects={projects} onOpenProject={vi.fn()} />
  );
  const trigger02 = container.querySelector(
    '[data-project-id="lab-robotic-arm"][data-project-trigger]'
  );
  const panel01 = container.querySelector("#project-panel-off-road-vehicle");
  const panel02 = container.querySelector("#project-panel-lab-robotic-arm");

  fireEvent.click(trigger02);

  expect(panel01).toHaveAttribute("hidden");
  expect(panel01).toHaveAttribute("aria-hidden", "true");
  expect(panel02).not.toHaveAttribute("hidden");
  expect(raf).not.toHaveBeenCalled();
  raf.mockRestore();
});
```

Remove the unused `createRafClock` import.

- [ ] **Step 2: Run the component test and verify it fails**

Run:

```bash
npm test -- src/components/ProjectArchive.test.jsx
```

Expected: FAIL because the spring keeps the closing panel mounted and schedules animation frames.

- [ ] **Step 3: Implement direct disclosure state**

In `src/components/ProjectArchive.jsx`, use these imports and state:

```jsx
import { useCallback, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SafeImage from "./SafeImage.jsx";

export default function ProjectArchive({ projects, onOpenProject }) {
  const [activeId, setActiveId] = useState(projects[0].id);
  const activate = useCallback((id) => {
    setActiveId((current) => (current === id ? current : id));
  }, []);
```

Use a plain archive wrapper:

```jsx
<div className="project-archive">
```

Remove trigger and panel ref callbacks and set the trigger handler to:

```jsx
onClick={() => activate(project.id)}
```

Give each panel direct state semantics:

```jsx
<div
  id={`project-panel-${project.id}`}
  className="project-archive-panel"
  role="region"
  aria-labelledby={`project-trigger-${project.id}`}
  aria-hidden={expanded ? undefined : "true"}
  hidden={!expanded}
>
  <div className="project-panel-content">
```

- [ ] **Step 4: Update browser tests to assert scrolling preserves the active project**

In `e2e/home-project-index.spec.js`, remove
`waitForDisclosureSettled` from the imports and replace the rapid-retarget test
with:

```js
test("rapid project selection remains immediate and single-open", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]').click();
  await page.locator('[data-project-trigger][data-project-id="off-road-vehicle"]').click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["off-road-vehicle"]);
  await expect(page.locator("#project-panel-off-road-vehicle")).not.toHaveAttribute(
    "hidden",
    ""
  );
  await expect(page.locator("#project-panel-lab-robotic-arm")).toHaveAttribute(
    "hidden",
    ""
  );
});
```

Replace the mobile wheel test body after installing the scroll spy:

```js
expect(await expandedProjectIds(page)).toEqual(["off-road-vehicle"]);
await page.mouse.wheel(0, 900);
await page.waitForTimeout(150);
expect(await expandedProjectIds(page)).toEqual(["off-road-vehicle"]);
await page.mouse.wheel(0, -400);
await page.waitForTimeout(150);
expect(await expandedProjectIds(page)).toEqual(["off-road-vehicle"]);
expect(await page.evaluate(() => window.__programmaticScrollCalls)).toEqual([]);
```

In `e2e/accessibility-preferences.spec.js`, replace the reduced-motion test
with:

```js
test("reduced motion keeps disclosure immediate and the status dot static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]').click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["lab-robotic-arm"]);
  await expect(page.locator("#project-panel-off-road-vehicle")).toHaveAttribute(
    "hidden",
    ""
  );
  await expect(page.locator(".status-dot")).toHaveCSS("animation-name", "none");
});
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- src/components/ProjectArchive.test.jsx
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/accessibility-preferences.spec.js
```

Expected: all focused tests PASS.

- [ ] **Step 6: Commit the click-only archive**

```bash
git add src/components/ProjectArchive.jsx src/components/ProjectArchive.test.jsx e2e/home-project-index.spec.js e2e/accessibility-preferences.spec.js
git commit -m "fix: make project archive click only"
```

---

### Task 2: Restore the stable original navigation

**Files:**
- Modify: `src/components/SiteChrome.jsx`
- Modify: `src/components/SiteChrome.test.jsx`
- Modify: `src/index.css`
- Modify: `e2e/accessibility-preferences.spec.js`

**Interfaces:**
- Consumes: `profile.name`, `profile.initials`, `profile.email`, `view`, and `onNavigate(page)`
- Produces: a static `.site-nav` containing brand, `Work`, `About`, and a mail link `.contact-control`

- [ ] **Step 1: Write failing navigation tests**

Replace the no-contact assertion in `src/components/SiteChrome.test.jsx` with:

```jsx
expect(screen.getByRole("link", { name: /Get in touch/ })).toHaveAttribute(
  "href",
  "mailto:wanghanqing66@gmail.com"
);
```

Replace the scroll-edge test with:

```jsx
it("keeps a stable navigation shell independent of scroll position", () => {
  renderChrome();
  const header = screen.getByRole("banner");
  expect(header).not.toHaveAttribute("data-scrolled");

  Object.defineProperty(window, "scrollY", { configurable: true, value: 200 });
  fireEvent.scroll(window);

  expect(header).not.toHaveAttribute("data-scrolled");
  expect(header).toHaveClass("site-nav");
});
```

- [ ] **Step 2: Run the navigation test and verify it fails**

Run:

```bash
npm test -- src/components/SiteChrome.test.jsx
```

Expected: FAIL because `Get in touch` is absent and `data-scrolled` is present.

- [ ] **Step 3: Implement a static navigation shell**

Use this `SiteChrome.jsx` import header:

```jsx
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/portfolio.js";
import { socialIcons } from "./socialIcons.js";
```

Remove scroll state, media-preference state, the effect, and all
`data-scrolled`, `data-reduced-transparency`, and `data-increased-contrast`
attributes. Add the mail link after `About`:

```jsx
<a className="contact-control" href={`mailto:${profile.email}`}>
  Get in touch <ArrowUpRight aria-hidden="true" />
</a>
```

- [ ] **Step 4: Replace scroll-reactive navigation CSS**

Replace the `.site-nav` material and pseudo-element rules with:

```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 65px;
  border-bottom: 1px solid #e9e9e5;
  background: #fff;
}
```

Add:

```css
.contact-control {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  padding: 0 16px;
  font-size: 13px;
  transition: background-color 90ms ease-out, transform 90ms ease-out;
}

.contact-control svg {
  width: 13px;
  height: 13px;
}

.contact-control:hover,
.contact-control:focus-visible {
  background: #30302e;
}

.contact-control:active {
  transform: scale(0.985);
}

@media (max-width: 767px) {
  .contact-control {
    display: none;
  }
}
```

Remove obsolete transparency, contrast-data-attribute, and backdrop-filter
fallback rules. Change the brand-name hiding breakpoint to:

```css
@media (max-width: 359px) {
  .brand-name {
    display: none;
  }
}
```

- [ ] **Step 5: Replace obsolete navigation-material preference tests**

Remove the `reduced transparency removes blur without borrowing reduced
motion` and `increased contrast adds a defined edge independently` tests from
`e2e/accessibility-preferences.spec.js`. Add:

```js
test("navigation remains opaque and unblurred", async ({ page }) => {
  await page.goto("/");
  const material = await page.locator(".site-nav").evaluate((node) => ({
    backdrop: getComputedStyle(node).backdropFilter,
    background: getComputedStyle(node).backgroundColor,
    border: getComputedStyle(node).borderBottomStyle,
  }));
  expect(material.backdrop).toBe("none");
  expect(material.background).toBe("rgb(255, 255, 255)");
  expect(material.border).toBe("solid");
});
```

- [ ] **Step 6: Run navigation tests**

Run:

```bash
npm test -- src/components/SiteChrome.test.jsx
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/accessibility-preferences.spec.js
```

Expected: PASS.

- [ ] **Step 7: Commit the navigation**

```bash
git add src/components/SiteChrome.jsx src/components/SiteChrome.test.jsx src/index.css e2e/accessibility-preferences.spec.js
git commit -m "fix: restore stable portfolio navigation"
```

---

### Task 3: Restore desktop composition and stabilize mobile hero flow

**Files:**
- Modify: `src/index.css`
- Modify: `e2e/responsive.spec.js`

**Interfaces:**
- Consumes: existing `.home-hero`, `.hero-copy`, `.hero-actions`, and `.portrait[data-size="hero"]` markup
- Produces: two columns at widths of 900px and above; a normal-flow single column below 900px

- [ ] **Step 1: Add failing responsive end-to-end assertions**

Replace the viewport list in `e2e/responsive.spec.js` with:

```js
const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 632, height: 661 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
];
```

Inside the responsive test, after locating the portrait, add:

```js
const heroCopy = await page.locator(".hero-copy").boundingBox();
const actions = await page.locator(".hero-actions").boundingBox();
const brand = await page.locator(".brand-control").boundingBox();
const primaryNav = await page.locator(".primary-nav").boundingBox();
expect(Math.abs(brand.y - primaryNav.y)).toBeLessThan(12);

if (viewport.width >= 900) {
  expect(portrait.x).toBeGreaterThan(heroCopy.x + heroCopy.width);
  await expect(page.locator(".contact-control")).toBeVisible();
} else {
  expect(portrait.y).toBeGreaterThan(actions.y + actions.height);
  expect(Math.abs(portrait.x - heroCopy.x)).toBeLessThan(4);
  if (viewport.width < 768) {
    await expect(page.locator(".contact-control")).toBeHidden();
  }
}
```

Add an assertion that the brand label remains visible for supported widths:

```js
await expect(page.locator(".brand-name")).toBeVisible();
```

- [ ] **Step 2: Run responsive tests and verify they fail**

Run:

```bash
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/responsive.spec.js
```

Expected: FAIL at narrow widths because the portrait is right-aligned and at
desktop because the navigation lacks the contact control until Task 2 is
complete.

- [ ] **Step 3: Restore original-style hero actions**

Replace the shared underlined action rules with:

```css
.hero-actions a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  padding: 0 18px;
  font-size: 14px;
  transition:
    border-color 90ms ease-out,
    background-color 90ms ease-out,
    color 90ms ease-out,
    transform 90ms ease-out;
}

.hero-actions a:first-child {
  border-color: var(--ink);
  background: var(--ink);
  color: #fff;
}

.hero-actions a:hover,
.hero-actions a:focus-visible {
  border-color: var(--blue);
  color: var(--blue);
}

.hero-actions a:first-child:hover,
.hero-actions a:first-child:focus-visible {
  border-color: #30302e;
  background: #30302e;
  color: #fff;
}

.hero-actions a:active {
  transform: scale(0.985);
}
```

Keep `.project-panel-copy a` as the existing underlined text-link treatment in
its own selector.

- [ ] **Step 4: Implement stable desktop and mobile hero CSS**

Set the desktop hero to:

```css
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(184px, 18vw, 220px);
  gap: clamp(56px, 8vw, 104px);
  align-items: start;
  padding-block: clamp(88px, 10vw, 124px) clamp(96px, 11vw, 128px);
}

.portrait[data-size="hero"] {
  width: 100%;
  margin-top: 42px;
}
```

Remove the status pulse media query and `@keyframes status-pulse`.

Replace the existing 767px hero grid overrides with:

```css
@media (max-width: 899px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 34px;
    padding-block: 72px 96px;
  }

  .home-hero h1 {
    max-width: 700px;
    font-size: clamp(2.6rem, 7vw, 3.35rem);
  }

  .hero-supporting {
    font-size: 16px;
  }

  .portrait[data-size="hero"] {
    width: 128px;
    margin-top: 0;
    justify-self: start;
  }

  .practice-record,
  .project-panel-content {
    grid-template-columns: 1fr;
  }
}
```

At 639px and below, keep one column and set:

```css
.home-hero {
  gap: 30px;
  padding-block: 56px 84px;
}

.portrait[data-size="hero"] {
  width: 112px;
  justify-self: start;
}
```

- [ ] **Step 5: Run component, responsive, and accessibility tests**

Run:

```bash
npm test -- src/pages/HomePage.test.jsx src/components/SiteChrome.test.jsx src/components/ProjectArchive.test.jsx
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/responsive.spec.js e2e/home-project-index.spec.js e2e/accessibility-preferences.spec.js
```

Expected: all focused tests PASS.

- [ ] **Step 6: Commit the responsive hero**

```bash
git add src/index.css e2e/responsive.spec.js
git commit -m "fix: stabilize original plus hero"
```

---

### Task 4: Full verification and dual-device presentation

**Files:**
- Verify only unless a failing test identifies a scoped correction

**Interfaces:**
- Consumes: the completed production build
- Produces: verified desktop and mobile screenshots from the same commit

- [ ] **Step 1: Run the full unit suite**

Run:

```bash
npm test
```

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run production build and full browser suite**

Run:

```bash
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
```

Expected: build succeeds and all Playwright tests PASS.

- [ ] **Step 3: Run repository hygiene checks**

Run:

```bash
git diff --check
git status --short --branch
```

Expected: no whitespace errors; only intentional plan-progress edits remain.

- [ ] **Step 4: Start the production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Expected: preview is available at `http://127.0.0.1:4173/`.

- [ ] **Step 5: Capture the desktop result**

Open the production preview at 1440×900 and capture the visible homepage hero.
Confirm the contact CTA is visible, the portrait is in the right column, and
the status dot is static.

- [ ] **Step 6: Capture the mobile result**

Open the same production preview at 390×844 and capture the visible homepage
hero. Confirm the brand stays on one line, the contact CTA is hidden, and the
portrait follows the actions in left-aligned normal flow.

- [ ] **Step 7: Present both screenshots**

Show the desktop and mobile screenshots together, state the exact verified
commit, and wait for visual approval before merging to `main`, pushing, or
deploying.
