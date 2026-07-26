# Live Product Projects Final Fix Report

Date: 2026-07-26

Branch: `codex/live-product-projects`

Baseline reviewed: `79bda18`

Fix commit: `babf881e454551b2253d0dfdfbb670eeb9f2bee0`

## Outcome

All two important and three minor final-review findings are fixed and verified
on the exact fix commit. No push, merge, deployment, or other repository was
touched.

## Finding-by-finding changes

### Important 1 — disclosure height pop

Changed:

- `src/hooks/useDisclosureSpring.js`
- `src/hooks/useDisclosureSpring.test.jsx`
- `e2e/home-project-index.spec.js`

The incoming panel now has native `hidden`, `inert`, and `aria-hidden` removed
before its content height is sampled. Its opening spring therefore receives a
real content height and animates from zero to that height. Settling still
restores `height: auto` on the active panel and `hidden`/`inert`/`aria-hidden`
on the closed panel.

Coverage includes a unit assertion that height measurement occurs only after
the incoming panel is revealed and a browser assertion that observes a real
nonzero intermediate inline height before the panel settles.

### Important 2 — product-page fallback aspect

Changed:

- `src/index.css`
- `e2e/project-media.spec.js`

Product-page success images and fallback surfaces now share a `1440 / 1000`
frame contract with no inherited page-media max-height cap. Browser tests abort
both product lead images at `1440 × 1000` and `390 × 844` and verify the
rendered fallback ratio. The separate archive fallback remains `13 / 7` and is
still covered by its existing browser assertion.

### Minor 1 — breakpoint manual lock

Changed:

- `src/hooks/useMobileProjectActivation.js`
- `src/hooks/useMobileProjectActivation.test.jsx`

Every mobile breakpoint-mode change now clears `lockRef` at the same effect
boundary that rebases scroll geometry. The regression creates a recent manual
lock, crosses desktop and back to mobile, and verifies post-entry scroll
activation is not suppressed.

### Minor 2 — stale reduced-motion assertion

Changed:

- `src/components/ProjectArchive.test.jsx`

The reduced-motion test now asserts that the actual previously open Easy-A
panel closes when Laboratory Robotic Arm opens.

### Minor 3 — complete archive order

Changed:

- `e2e/home-project-index.spec.js`

The desktop browser contract directly asserts all eight stable project IDs in
their approved order.

## TDD evidence

### RED

Command:

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx src/hooks/useMobileProjectActivation.test.jsx src/components/ProjectArchive.test.jsx
```

Result on baseline behavior with the new tests: exit 1; 2 failed and 17 passed.
The disclosure test read the incoming panel while `hidden` was true instead of
false. The breakpoint regression received zero activations instead of `02`.

Command:

```sh
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js --grep "disclosure gains real height|failed product-page leads"
```

Result on baseline behavior after allowing the local preview server: exit 1;
3 failed. The disclosure collected no nonzero intermediate height. Product
fallback ratios were `2.5714` on desktop and `1.6273` on mobile instead of
approximately `1.44`.

### GREEN

Command:

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx src/hooks/useMobileProjectActivation.test.jsx src/components/ProjectArchive.test.jsx
```

Result: exit 0; 3 files and 19 tests passed.

Command:

```sh
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js --grep "disclosure gains real height|failed product-page leads"
```

Result: build exit 0 and 3 browser tests passed. A prior browser rerun before
rebuilding exercised the stale pre-fix `dist`; the required rebuilt run above
is the relevant exact-source GREEN evidence.

Command:

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx src/hooks/useMobileProjectActivation.test.jsx src/components/ProjectArchive.test.jsx src/components/SafeImage.test.jsx src/components/ProjectMedia.test.jsx
```

Result: exit 0; 5 files and 26 tests passed.

Command:

```sh
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js
```

Result: build exit 0 and all 15 integrated archive/media browser tests passed.

## Final exact-head verification

```sh
npm test
```

Result: exit 0; 23 files and 105 tests passed.

```sh
npm run build
```

Result: exit 0; Vite transformed 1,541 modules and produced the production
bundle.

```sh
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
```

Result: exit 0; the command rebuilt the exact head and all 49 Playwright tests
passed in system Chrome.

## Self-review

- Accessibility semantics remain state-driven: the incoming active panel is
  exposed while opening, while the outgoing panel is hidden and made inert only
  after it reaches the closed state.
- Reduced motion still bypasses animation frames and immediately applies final
  visibility.
- Single-open behavior, rapid retargeting, mobile sequential activation,
  focus-hold behavior, social interactions, Curry behavior, and the
  no-programmatic-scroll contract all passed the full browser suite.
- Product-page sizing is scoped to `.project-media[data-media-role="live-product"]`;
  archive `13 / 7`, legacy technical, portrait, low-resolution, GIF, video, and
  text-only media behavior remain independently covered.
- The changes are limited to the reviewed hooks, CSS contract, and regression
  tests. No production data or project ordering implementation changed.
- No refreshed screenshots were captured because the visible changes are
  transition continuity and error-state geometry rather than a normal-state
  editorial redesign.

## Concerns

None. Test output contains only the existing `NO_COLOR`/`FORCE_COLOR` Node
warning during Playwright startup; it does not affect execution or results.
