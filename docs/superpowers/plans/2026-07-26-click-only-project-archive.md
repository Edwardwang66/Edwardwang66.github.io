# Click-Only Project Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Selected Work archive use the same explicit, single-open click and keyboard interaction on mobile and desktop, with the first project open by default and no scroll-driven selection.

**Architecture:** `ProjectArchive` remains the only owner of `activeId` and sends that ID to the existing disclosure controller. The mobile scroll hook is first disconnected behind a browser-level regression test, then its now-unreferenced hook, helper, and dedicated tests are deleted. No layout, content, ordering, breakpoint, or motion-controller changes are included.

**Tech Stack:** React 18, Vitest, Testing Library, Playwright, Vite

## Global Constraints

- Open the first project, Easy-A Radar, on initial render.
- Keep exactly one project open at all times.
- Clicking, tapping, Enter, or Space on another project opens it and closes the previous project.
- Clicking or activating the current project leaves it open.
- Scrolling never changes the active project on mobile, tablet, or desktop.
- Changing projects never changes the browser scroll position.
- Keep the existing disclosure controller and reduced-motion behavior.
- Keep project markup, order, media, links, captions, layout, typography, colors, and breakpoints unchanged.
- Add no scroll observer, timer, breakpoint-specific selection state, or animation dependency.
- Do not add analytics or deploy to production as part of this change.

---

## File Map

- Modify `src/components/ProjectArchive.jsx`: remove mobile scroll ownership and keep explicit activation as the only state transition.
- Modify `src/components/ProjectArchive.test.jsx`: strengthen the mobile single-open click contract.
- Modify `e2e/home-project-index.spec.js`: replace scroll-advance coverage with scroll-inert and sequential-tap coverage.
- Delete `src/hooks/useMobileProjectActivation.js`: obsolete mobile scroll listener and reading-line activation.
- Delete `src/hooks/useMobileProjectActivation.test.jsx`: tests for the removed hook.
- Delete `src/lib/projectActivation.js`: obsolete scroll candidate and tap-lock helpers.
- Delete `src/lib/projectActivation.test.js`: tests for the removed helpers.

### Task 1: Unify project selection behind explicit activation

**Files:**
- Modify: `e2e/home-project-index.spec.js:119`
- Modify: `src/components/ProjectArchive.test.jsx:65`
- Modify: `src/components/ProjectArchive.jsx:1-57`

**Interfaces:**
- Consumes: `useDisclosureSpring({ ids, activeId, reducedMotion })`, returning stable `registerPanel(id)` and `registerPanelContent(id)` ref callbacks.
- Produces: `activate(id: string): void`, which preserves the current ID or selects exactly one new ID.

- [ ] **Step 1: Replace the mobile scroll-advance browser test with the approved contract**

Replace the current test named
`mobile scrolling advances one project at a time without programmatic scroll`
in `e2e/home-project-index.spec.js` with:

```js
test("mobile scrolling is inert while taps switch exactly one project", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await installProgrammaticScrollSpy(page);
  await expect.poll(() => expandedProjectIds(page)).toEqual(["easy-a-radar"]);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
  }

  await expect.poll(() => expandedProjectIds(page)).toEqual(["easy-a-radar"]);

  await page
    .locator(
      '[data-project-trigger][data-project-id="stock-research-dashboard"]'
    )
    .click();
  await expect
    .poll(() => expandedProjectIds(page))
    .toEqual(["stock-research-dashboard"]);

  await page
    .locator('[data-project-trigger][data-project-id="lab-robotic-arm"]')
    .click();
  await expect
    .poll(() => expandedProjectIds(page))
    .toEqual(["lab-robotic-arm"]);

  expect(await page.evaluate(() => window.__programmaticScrollCalls)).toEqual(
    []
  );
});
```

- [ ] **Step 2: Run the new browser contract and verify the current implementation fails**

Run:

```bash
npx playwright test e2e/home-project-index.spec.js --grep "mobile scrolling is inert"
```

Expected: FAIL because the current mobile scroll hook changes
`expandedProjectIds(page)` away from `["easy-a-radar"]` during the wheel loop.

- [ ] **Step 3: Strengthen the component-level mobile click assertion**

Rename `registers every trigger and panel while reduced motion stays immediate`
in `src/components/ProjectArchive.test.jsx` to
`keeps mobile selection single-open across sequential taps`.

After the existing Stock Dashboard assertions, append:

```js
const roboticArm = container.querySelector(
  '[data-project-trigger][data-project-id="lab-robotic-arm"]'
);
await user.click(roboticArm);

expect(roboticArm).toHaveAttribute("aria-expanded", "true");
expect(stock).toHaveAttribute("aria-expanded", "false");
expect(
  [...container.querySelectorAll("[data-project-trigger]")].filter(
    (trigger) => trigger.getAttribute("aria-expanded") === "true"
  )
).toHaveLength(1);
expect(
  container.querySelector("#project-panel-stock-research-dashboard")
).toHaveAttribute("hidden");
expect(
  container.querySelector("#project-panel-lab-robotic-arm")
).not.toHaveAttribute("hidden");
```

- [ ] **Step 4: Remove mobile scroll activation from `ProjectArchive`**

Change the React import to:

```js
import { useCallback, useMemo, useState } from "react";
```

Delete the `useMobileProjectActivation` import. Delete `triggerNodes`,
`panelNodes`, `triggerCallbacks`, `archivePanelCallbacks`,
`registerTrigger`, and `registerArchivePanel`.

Keep the disclosure registration direct:

```js
const { registerPanel, registerPanelContent } = useDisclosureSpring({
  ids,
  activeId,
  reducedMotion,
});
```

Replace `activate` with:

```js
const activate = useCallback((id) => {
  setActiveId((current) => (current === id ? current : id));
}, []);
```

Remove the trigger's `ref={registerTrigger(project.id)}` prop. Change the
panel ref to:

```jsx
ref={registerPanel(project.id)}
```

- [ ] **Step 5: Run focused component tests**

Run:

```bash
npm test -- src/components/ProjectArchive.test.jsx src/hooks/useDisclosureSpring.test.jsx
```

Expected: PASS with zero failed tests. The first row stays open initially,
sequential clicks keep one row open, and disclosure accessibility state remains
correct.

- [ ] **Step 6: Run the focused browser test again**

Run:

```bash
npx playwright test e2e/home-project-index.spec.js --grep "mobile scrolling is inert"
```

Expected: PASS. The wheel loop leaves Easy-A Radar open, then the two taps
select Stock Dashboard and the robotic-arm project one at a time, with no
recorded programmatic scroll.

- [ ] **Step 7: Commit the interaction change**

```bash
git add src/components/ProjectArchive.jsx src/components/ProjectArchive.test.jsx e2e/home-project-index.spec.js
git commit -m "fix: make project archive click only"
```

### Task 2: Remove obsolete scroll-selection infrastructure and verify the site

**Files:**
- Delete: `src/hooks/useMobileProjectActivation.js`
- Delete: `src/hooks/useMobileProjectActivation.test.jsx`
- Delete: `src/lib/projectActivation.js`
- Delete: `src/lib/projectActivation.test.js`
- Verify: `src/components/ProjectArchive.jsx`
- Verify: `src/components/ProjectArchive.test.jsx`
- Verify: `e2e/home-project-index.spec.js`

**Interfaces:**
- Consumes: the click-only `ProjectArchive` delivered by Task 1.
- Produces: a repository with no `useMobileProjectActivation`,
  `chooseActiveProject`, or `isTapLockActive` symbols and a fully verified
  click-only archive.

- [ ] **Step 1: Prove the scroll-selection modules have no remaining production consumers**

Run:

```bash
rg -n "useMobileProjectActivation|chooseActiveProject|isTapLockActive" src
```

Expected: matches only in the four obsolete source and test files listed in
this task; `src/components/ProjectArchive.jsx` has no match.

- [ ] **Step 2: Delete the obsolete hook, helper, and dedicated tests**

Delete these exact files:

```text
src/hooks/useMobileProjectActivation.js
src/hooks/useMobileProjectActivation.test.jsx
src/lib/projectActivation.js
src/lib/projectActivation.test.js
```

- [ ] **Step 3: Confirm the obsolete symbols are gone**

Run:

```bash
rg -n "useMobileProjectActivation|chooseActiveProject|isTapLockActive" src
```

Expected: exit code 1 with no matches.

- [ ] **Step 4: Run the complete unit suite**

Run:

```bash
npm test
```

Expected: PASS with zero failed test files and zero failed tests.

- [ ] **Step 5: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 and a production bundle written to `dist/`.

- [ ] **Step 6: Run the complete browser suite**

Run:

```bash
npm run test:e2e
```

Expected: the build and every Playwright test pass, including desktop
pointer/keyboard behavior, mobile scroll inertia, sequential mobile taps,
responsive layout, project media, social links, and Curry companion behavior.

- [ ] **Step 7: Check the final diff and worktree scope**

Run:

```bash
git diff --check
git status --short
git diff --stat
```

Expected: no whitespace errors; only the four deletions remain unstaged after
Task 1's commit; generated `dist/` output is not tracked.

- [ ] **Step 8: Commit the dead-code cleanup**

```bash
git add src/hooks/useMobileProjectActivation.js src/hooks/useMobileProjectActivation.test.jsx src/lib/projectActivation.js src/lib/projectActivation.test.js
git commit -m "refactor: remove mobile scroll activation"
```

- [ ] **Step 9: Record final evidence**

Run:

```bash
git status --short --branch
git log -3 --oneline --decorate
```

Expected: the worktree is clean; the latest two commits are
`refactor: remove mobile scroll activation` and
`fix: make project archive click only`. Do not push, merge, or deploy until
the user reviews the finished local preview and explicitly authorizes the next
boundary.
