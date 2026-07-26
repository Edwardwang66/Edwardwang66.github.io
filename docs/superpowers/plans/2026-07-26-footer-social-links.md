# Footer Social Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reuse the homepage six-platform social component in the site footer, with Douyin and RedNote profile cards opening upward and a stable phone grid.

**Architecture:** `SocialLinks` remains the single owner of social-link rendering and profile-card interaction. It gains one optional `profileCardPlacement` input whose default preserves homepage auto-placement, while `SiteChrome` requests `"above"` for the footer. Footer-specific CSS controls only layout and presentation; it does not duplicate interaction state.

**Tech Stack:** React 18, Vitest, Testing Library, Playwright, Vite, CSS

## Global Constraints

- Show GitHub, LinkedIn, Email, Instagram, Douyin, and RedNote in the footer.
- Keep GitHub, LinkedIn, Email, and Instagram as direct links.
- Keep Douyin and RedNote as profile-card buttons.
- Open footer profile cards above the social row.
- Keep exactly one profile card open at a time.
- Preserve the existing monochrome icons, labels, typography, hover color, accessibility semantics, and 44px interaction height.
- Keep the existing automatic profile-card placement as the homepage default.
- Keep the footer copyright copy unchanged.
- At 519px and below, use an equal three-column, two-row footer grid.
- Do not change social destinations, account identifiers, profile images, homepage layout, analytics, or dependencies.
- Do not push, merge, or deploy as part of implementation.

---

## File Map

- Modify `src/components/SocialLinks.jsx`: accept an optional placement preference while preserving automatic homepage placement.
- Modify `src/components/SocialLinks.test.jsx`: prove explicit upward placement overrides the automatic fallback.
- Modify `src/components/SiteChrome.jsx`: replace the separate three-link footer renderer with the shared six-platform component.
- Modify `src/components/SiteChrome.test.jsx`: verify footer order and native link/button semantics.
- Modify `src/index.css`: style footer links and buttons consistently, support wrapping, and provide the phone-only 3×2 grid.
- Modify `e2e/social-links.spec.js`: verify footer order, upward cards, responsive layout, overflow, and browser cleanliness.

### Task 1: Reuse `SocialLinks` in the footer with explicit upward placement

**Files:**
- Modify: `src/components/SocialLinks.jsx:24-89`
- Modify: `src/components/SocialLinks.test.jsx:11-14,284-309`
- Modify: `src/components/SiteChrome.jsx:1-12,57-81`
- Modify: `src/components/SiteChrome.test.jsx:71-79`

**Interfaces:**
- Consumes: `profile.socials`, containing four `kind: "link"` entries and two `kind: "profile-card"` entries.
- Produces: `SocialLinks({ socials, listClassName = "hero-socials", profileCardPlacement = "auto" })`; supported placement values for this change are `"auto"` and `"above"`.

- [ ] **Step 1: Write the failing explicit-placement component test**

Change the helper in `src/components/SocialLinks.test.jsx` to:

```jsx
function renderSocials(props = {}) {
  return render(<SocialLinks socials={profile.socials} {...props} />);
}
```

Add:

```jsx
it("honors an explicit upward placement without changing auto placement", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  const { container } = renderSocials({
    profileCardPlacement: "above",
    listClassName: "footer-socials",
  });
  const root = container.querySelector(".social-links");
  const douyin = screen.getByRole("button", { name: "Douyin" });
  const card = container.querySelector("#social-profile-card-douyin");

  vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
    x: 40, left: 40, right: 304, width: 264,
    y: 120, top: 120, bottom: 164, height: 44, toJSON() {},
  });
  vi.spyOn(douyin, "getBoundingClientRect").mockReturnValue({
    x: 184, left: 184, right: 252, width: 68,
    y: 120, top: 120, bottom: 164, height: 44, toJSON() {},
  });
  Object.defineProperties(card, {
    offsetHeight: { configurable: true, value: 500 },
    offsetWidth: { configurable: true, value: 264 },
  });

  await user.click(douyin);
  expect(card).toHaveAttribute("data-placement", "above");
  expect(card.style.getPropertyValue("--social-card-left")).toBe("0px");
});
```

- [ ] **Step 2: Replace the stale footer test with the six-platform contract**

Replace `keeps the footer to direct social links` in
`src/components/SiteChrome.test.jsx` with:

```jsx
it("renders the six approved footer socials with native semantics", () => {
  const { container } = renderChrome();
  const footer = container.querySelector(".site-footer");
  const controls = [
    ...footer.querySelectorAll(".footer-socials > li > :is(a, button)"),
  ];

  expect(controls.map((control) => control.textContent)).toEqual([
    "GitHub",
    "LinkedIn",
    "Email",
    "Instagram",
    "Douyin",
    "RedNote",
  ]);
  expect(controls.slice(0, 4).every((node) => node.tagName === "A")).toBe(true);
  expect(controls.slice(4).every((node) => node.tagName === "BUTTON")).toBe(
    true
  );
  expect(
    footer.querySelector("#social-profile-card-douyin")
  ).toHaveAttribute("data-placement", "above");
  expect(
    footer.querySelector("#social-profile-card-rednote")
  ).toHaveAttribute("data-placement", "above");
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npm test -- src/components/SocialLinks.test.jsx src/components/SiteChrome.test.jsx
```

Expected: FAIL because `SocialLinks` does not accept an explicit placement
preference and `SiteChrome` still renders only three direct footer links.

- [ ] **Step 4: Add the placement preference to `SocialLinks`**

Change the component signature to:

```jsx
export default function SocialLinks({
  socials,
  listClassName = "hero-socials",
  profileCardPlacement = "auto",
}) {
```

Inside `measure`, replace the placement calculation with:

```js
const aboveTop = rootRect.top - CARD_GAP - card.offsetHeight;
const automaticPlacement = aboveTop >= visibleTop ? "above" : "below";
const placement =
  profileCardPlacement === "above" ? "above" : automaticPlacement;
```

Add `profileCardPlacement` to the `useLayoutEffect` dependency list:

```js
}, [activeLabel, profileCardPlacement]);
```

Do not change card state, focus ownership, horizontal clamping, or the default
`"auto"` behavior.

- [ ] **Step 5: Replace the footer's custom renderer with `SocialLinks`**

In `src/components/SiteChrome.jsx`, remove the `socialIcons` import,
`existingSocialLabels`, and `existingSocials`.

Add:

```js
import SocialLinks from "./SocialLinks.jsx";
```

Replace the footer `<ul>` block with:

```jsx
<SocialLinks
  socials={profile.socials}
  listClassName="footer-socials"
  profileCardPlacement="above"
/>
```

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run:

```bash
npm test -- src/components/SocialLinks.test.jsx src/components/SiteChrome.test.jsx
```

Expected: PASS with zero failed tests. The homepage default still chooses
`"below"` when the card cannot clear the visible top, while the footer request
stays `"above"`.

- [ ] **Step 7: Run the complete unit suite**

Run:

```bash
npm test
```

Expected: PASS with zero failed test files and zero failed tests.

- [ ] **Step 8: Commit the shared component integration**

```bash
git add src/components/SocialLinks.jsx src/components/SocialLinks.test.jsx src/components/SiteChrome.jsx src/components/SiteChrome.test.jsx
git commit -m "feat: add social profiles to footer"
```

### Task 2: Add responsive footer layout and browser verification

**Files:**
- Modify: `src/index.css:76-95,185-251,400-450`
- Modify: `e2e/social-links.spec.js:1-70`

**Interfaces:**
- Consumes: `.footer-socials`, `.social-links`, and
  `[data-placement="above"]` from Task 1.
- Produces: a desktop flex/wrap footer row and a phone-only equal 3×2 grid
  whose profile cards remain above the active trigger.

- [ ] **Step 1: Add a footer layout probe to the browser test**

After `socialLayout`, add:

```js
async function footerSocialLayout(page) {
  return page.locator(".footer-socials").evaluate((list) => {
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

Add:

```js
test("footer exposes six socials and opens profile cards upward", async ({
  page,
}) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();

  const controls = page.locator(
    ".footer-socials > li > :is(a, button)"
  );
  await expect(controls).toHaveText(labels);
  await expect(page.locator(".footer-socials > li > a")).toHaveCount(4);
  await expect(page.locator(".footer-socials > li > button")).toHaveCount(2);

  const douyin = page
    .locator(".site-footer")
    .getByRole("button", { name: "Douyin" });
  const douyinCard = page
    .locator(".site-footer")
    .getByRole("region", { name: "Douyin" });
  await douyin.click();
  await expect(douyinCard).toHaveAttribute("data-placement", "above");

  const [triggerBox, cardBox] = await Promise.all([
    douyin.boundingBox(),
    douyinCard.boundingBox(),
  ]);
  expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(triggerBox.y);

  const redNote = page
    .locator(".site-footer")
    .getByRole("button", { name: "RedNote" });
  await redNote.click();
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".site-footer").getByRole("region", { name: "RedNote" })
  ).toHaveAttribute("data-placement", "above");

  await page.keyboard.press("Escape");
  await expect(redNote).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toBeFocused();
  expect(errors).toEqual([]);
});

test("phone footer socials use an aligned three-column grid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();

  const layout = await footerSocialLayout(page);
  expect(layout.display).toBe("grid");
  expect(
    Math.max(...layout.itemWidths) - Math.min(...layout.itemWidths)
  ).toBeLessThan(1);
  for (let column = 0; column < 3; column += 1) {
    expect(
      Math.abs(layout.controlLefts[column] - layout.controlLefts[column + 3])
    ).toBeLessThan(1);
  }
  expect(new Set(layout.controlTops.map(Math.round)).size).toBe(2);
  await expectNoHorizontalOverflow(page);
});
```

- [ ] **Step 2: Run the new browser tests and verify RED**

Run:

```bash
npx playwright test e2e/social-links.spec.js --grep "footer"
```

Expected: FAIL because the footer social list has no footer-specific responsive
grid/button styling yet.

- [ ] **Step 3: Extend footer control styling to buttons**

Change both selector groups near the top of `src/index.css` from footer anchors
to footer anchors and buttons:

```css
.brand-control,
.primary-nav,
.nav-control,
.site-footer ul,
.site-footer :is(a, button) {
  display: flex;
  align-items: center;
}
```

```css
.site-footer :is(a, button) {
  min-height: 44px;
  gap: 6px;
  color: inherit;
}
```

```css
.site-footer :is(a, button):hover,
.site-footer :is(a, button):focus-visible,
.site-footer button[aria-expanded="true"] {
  color: var(--blue);
}
```

- [ ] **Step 4: Add footer list layout rules**

After the existing `.site-footer ul` rule, add:

```css
.footer-socials {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.footer-socials > li {
  min-width: 0;
}
```

Inside `@media (max-width: 639px)`, add:

```css
.site-footer .social-links {
  width: 100%;
}
```

Add a phone-only rule after the footer mobile block:

```css
@media (max-width: 519px) {
  .footer-socials {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px 12px;
  }

  .footer-socials > li,
  .footer-socials :is(a, button) {
    width: 100%;
  }

  .footer-socials :is(a, button) {
    justify-content: flex-start;
  }
}
```

Preserve the existing `.social-profile-card` positioning. The explicit
`data-placement="above"` contract keeps `bottom: calc(100% + 8px)` active.

- [ ] **Step 5: Run the focused browser tests and verify GREEN**

Run:

```bash
npx playwright test e2e/social-links.spec.js --grep "footer"
```

Expected: PASS. Desktop has six controls and an upward card; 390px has equal
three-column alignment, two rows, and no horizontal overflow.

- [ ] **Step 6: Run the complete release checks**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests pass, production build exits 0, all Playwright tests
pass, and `git diff --check` reports no whitespace errors.

- [ ] **Step 7: Commit the responsive footer and browser coverage**

```bash
git add src/index.css e2e/social-links.spec.js
git commit -m "test: verify responsive footer socials"
```

- [ ] **Step 8: Record final local state**

Run:

```bash
git status --short --branch
git log -5 --oneline --decorate
```

Expected: the worktree is clean. Do not push, merge, or deploy until the user
reviews the finished local preview and explicitly authorizes the next boundary.
