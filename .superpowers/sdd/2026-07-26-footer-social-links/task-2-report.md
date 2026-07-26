# Task 2 — Responsive footer social links report

## Scope

- Implemented the approved footer presentation only in `src/index.css`.
- Added footer browser coverage and scoped existing homepage assertions in
  `e2e/social-links.spec.js` so the now-duplicated accessible names resolve to
  their intended component.
- Preserved the copyright copy, homepage layout, social destinations,
  focus/state behavior, analytics surface, dependencies, and unrelated media.
- No push, merge, deploy, or runtime service change was performed.

## RED

1. Added desktop footer semantics/upward-card coverage and the 390px geometry
   probe before changing presentation code.
2. The first direct Playwright invocation previewed an older `dist` artifact;
   after building current source, the focused test failed as intended:
   `Expected: "grid"; Received: "flex"` for the phone footer list.
3. After adding the specified footer rules, the same assertion still failed.
   Root cause: `.site-footer ul` (`0,1,1`) outranked `.footer-socials`
   (`0,1,0`). The mobile grid selector was therefore made footer-specific as
   `.site-footer .footer-socials`.
4. The first full E2E run exposed ambiguous old global role locators because
   footer and homepage controls intentionally share accessible names. The
   existing homepage tests were scoped to the `.hero-socials` component root;
   their order, geometry, overflow, focus, and profile-card assertions remain
   unchanged.

## GREEN

- Focused footer browser coverage: `2 passed`.
- Complete social-links browser suite: `15 passed`.
- Desktop assertion verifies six controls, four links/two buttons, upward
  placement, single active profile card, Escape close/focus restoration, and
  no browser/page errors.
- Phone assertion verifies `display: grid`, equal item widths, aligned columns
  across exactly two rows, and no horizontal overflow.

## Release checks

| Check | Result |
| --- | --- |
| `npm test` | Pass — 21 files, 94 tests |
| `npm run build` | Pass — Vite production build |
| `npm run test:e2e` | Pass — 55 Chromium tests |
| `git diff --check` | Pass — no whitespace errors |

## Browser verification and manual visual inspection

- Desktop screenshot (1440×1000, footer Douyin hover card open):
  `/private/tmp/footer-socials-desktop-open-1440x1000.png`
- Phone screenshot (390×844):
  `/private/tmp/footer-socials-phone-390x844.png`
- Manual inspection: desktop preserves a right-aligned wrapped footer row and
  exposes the card above its active control; the 390px footer is a balanced
  equal-width 3×2 grid. Copyright copy, footer spacing, and the Curry companion
  remain visible without overlap or horizontal scrolling.
- Browser cleanliness: the new desktop footer interaction asserts an empty
  captured console/page-error list; the complete E2E suite passed.

## Final local state

- Commit only Task 2 files: `src/index.css`, `e2e/social-links.spec.js`, and
  this report.
- The work remains local on `codex/social-profile-links`; it has not been
  pushed, merged, or deployed.

## Final-review correction — 2026-07-27

The earlier visual-inspection statement that Curry remained visible without
overlap was inaccurate. Read-only hit testing after Task 2 showed the fixed
`.curry-companion` intercepting the footer RedNote control at 640, 768, and
1024px, with visible phone overlap and potential overlap with an open card.

The final fix keeps Curry's ordinary homepage behavior but observes the footer
with `IntersectionObserver`; while any part of the footer intersects the
viewport, Curry receives `data-footer-in-view="true"` and becomes hidden with
pointer events disabled. It becomes visible again after the footer leaves the
viewport. `SocialLinks` also now emits a bubbling instance-open event so a
profile opened by focus, pointer hover, or touch closes any card owned by the
other homepage/footer instance.

Final browser coverage verifies real RedNote hit ownership and activation,
card/control separation, one open card across instances, Curry hiding and
restoration at 768 and 1024px, and phone footer visibility without Curry
overlap. Fresh inspected previews:

- `/private/tmp/footer-social-final-desktop-1440x1000.png`
- `/private/tmp/footer-social-final-tablet-768x900.png`
- `/private/tmp/footer-social-final-phone-390x844.png`
