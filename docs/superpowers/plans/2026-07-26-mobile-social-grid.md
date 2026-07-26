# Mobile Social Grid Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the six homepage social controls into an equal-width three-column, two-row grid on phone layouts only.

**Architecture:** Keep the existing social data, React component, and card interaction model unchanged. Add a phone-only CSS layout override inside the existing `max-width: 519px` breakpoint, then lock the visual geometry with system-Chrome E2E assertions at `375px` and `390px` while explicitly proving `520px`, `640px`, and `1440px` retain the current flex layout.

**Tech Stack:** React 19, CSS media queries, Playwright with system Chrome, Vitest, Vite

## Global Constraints

- At `519px` and below, the social rail is exactly three equal columns and two rows.
- Row one is GitHub, LinkedIn, Email; row two is Instagram, Douyin, RedNote.
- Controls are left-aligned; both rows share identical three column starts.
- Existing `20px` icon size, `7px` icon-label gap, typography, colors, focus, hover, and active styles remain unchanged.
- At `520px` and above, the current tablet and desktop flex layout is unchanged.
- Social order, content, URLs, control semantics, profile cards, hero, portrait, navigation, projects, About, footer, and Curry remain unchanged.
- No new dependency is allowed.

---

### Task 1: Phone-only equal-column social grid

**Files:**
- Modify: `e2e/social-links.spec.js:1-285`
- Modify: `src/index.css:937-947`

**Interfaces:**
- Consumes: `.hero-socials > li > :is(a, button)` in the existing approved order and the existing `max-width: 519px` single-column hero breakpoint.
- Produces: phone-only `.hero-socials` grid geometry; no JavaScript or data interface changes.

- [ ] **Step 1: Add the failing phone-grid browser contract**

Add this helper near the top of `e2e/social-links.spec.js`, after
`watchBrowserErrors`:

```js
async function socialLayout(page) {
  return page.locator(".hero-socials").evaluate((list) => {
    const items = [...list.children].map((item) => item.getBoundingClientRect());
    const controls = [
      ...list.querySelectorAll(":scope > li > :is(a, button)"),
    ].map((control) => control.getBoundingClientRect());
    const style = getComputedStyle(list);

    return {
      display: style.display,
      itemWidths: items.map(({ width }) => width),
      controlLefts: controls.map(({ left }) => left),
      controlTops: controls.map(({ top }) => top),
    };
  });
}
```

Add these tests after the existing native-semantics test:

```js
for (const viewport of [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
]) {
  test(`${viewport.width}px phone socials use an aligned three-column grid`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await socialLayout(page);
    expect(layout.display).toBe("grid");
    expect(
      Math.max(...layout.itemWidths) - Math.min(...layout.itemWidths)
    ).toBeLessThan(1);

    for (let column = 0; column < 3; column += 1) {
      expect(
        Math.abs(
          layout.controlLefts[column] - layout.controlLefts[column + 3]
        )
      ).toBeLessThan(1);
    }

    expect(new Set(layout.controlTops.map(Math.round)).size).toBe(2);
    await expectNoHorizontalOverflow(page);
  });
}

for (const width of [520, 640, 1440]) {
  test(`${width}px keeps the existing non-phone social layout`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect((await socialLayout(page)).display).toBe("flex");
  });
}
```

- [ ] **Step 2: Run the focused contract and verify the phone cases fail**

Run:

```bash
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/social-links.spec.js --grep "phone socials|non-phone social layout"
```

Expected: the `375px` and `390px` cases fail because `.hero-socials` is still
`display: flex`; the `520px`, `640px`, and `1440px` safeguards pass.

- [ ] **Step 3: Add the minimal phone-only CSS**

Inside the existing `@media (max-width: 519px)` block in `src/index.css`, add:

```css
  .hero-socials {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 8px;
  }
```

Do not add selectors for the controls, icons, cards, or any non-phone
breakpoint. Grid items stretch to equal tracks by default while their existing
inline-flex controls remain left-aligned.

- [ ] **Step 4: Run the focused browser contract and verify it passes**

Run:

```bash
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/social-links.spec.js --grep "phone socials|non-phone social layout"
```

Expected: 5 tests pass.

- [ ] **Step 5: Run all automated verification**

Run:

```bash
npm test -- --run
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
git diff --check
```

Expected: all Vitest tests, the production build, and all Playwright tests pass;
the worktree has no whitespace errors.

- [ ] **Step 6: Capture and inspect the updated phone output**

Start the production preview:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

In a second terminal, capture a full-page system-Chrome screenshot outside Git:

```bash
npx playwright screenshot --channel chrome --viewport-size "390,844" --full-page http://127.0.0.1:4173 /Users/edwardwang/Desktop/Edwardwang66.github.io/.superpowers/review/social-profile-links/mobile-social-grid-390.png
```

Inspect the screenshot and confirm:

- the two rows share the same three left edges;
- Instagram, Douyin, and RedNote are not clipped;
- the portrait remains below the social rail;
- Curry does not cover a control;
- desktop screenshots are not regenerated because desktop CSS is unchanged.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/index.css e2e/social-links.spec.js
git commit -m "fix: align phone social controls"
```
