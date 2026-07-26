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

## Authorized second fix wave

Authorization: explicit user-approved follow-up for exactly two residual
Important findings.

Baseline verified: `7fd394627bdda3f58f9da0e16555b9eda63c7879`

Fix commit: `9cbf0ee84890eef40e3ab9204c07eb85a7f771db`

### Residual 1 — rapid-retarget accessibility semantics

Changed:

- `src/hooks/useDisclosureSpring.js`
- `src/hooks/useDisclosureSpring.test.jsx`

The animation setup and every animation frame now reconcile semantic
visibility from the current target and spring value. The active/incoming panel
and non-active panels with a positive value remain exposed. A superseded
non-active panel at zero is immediately given `hidden`, `inert`, and
`aria-hidden="true"` without waiting for the controller-wide settled state.
Outgoing panels still animate while their value remains positive, and the
existing reduced-motion and settled paths are unchanged.

The regression rapidly retargets `easy-a-radar` to `lab-robotic-arm` and then
to `planning-control` before the intermediate panel gains height. It advances
the frame loop, confirms Laboratory Robotic Arm is at `0px` while Planning is
still animating, and asserts all three closed-panel accessibility attributes.

RED command:

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx
```

RED result on `7fd3946` production behavior: exit 1; 1 failed and 3 passed.
The superseded Laboratory Robotic Arm panel was at `0px` but had no `hidden`
attribute before global settlement.

GREEN command:

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx src/components/ProjectArchive.test.jsx
```

GREEN result: exit 0; 2 files and 11 tests passed.

### Residual 2 — successful short-mobile live-product aspect

Changed:

- `src/index.css`
- `e2e/project-media.spec.js`

Within the existing mobile media query, a later live-product lead-image
selector now removes only the inherited `50vh` cap. Non-live lead images and
videos retain the legacy cap. The shared `1440 / 1000` success/fallback
contract and the separate archive `13 / 7` contract remain unchanged.

The browser regression uses a `390 × 440` short viewport. For both Easy-A
Radar and Stock Research Dashboard it first loads the real lead image and
checks the rendered ratio, then aborts that product asset and checks the
fallback at the same ratio.

RED commands:

```sh
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/project-media.spec.js --grep "successful and failed product leads keep one aspect"
```

RED result on `7fd3946` production behavior: build exit 0; browser exit 1.
The loaded Easy-A lead rendered at `1.6273` instead of approximately `1.44`.

GREEN commands:

```sh
npm run build
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/project-media.spec.js --grep "successful and failed product leads keep one aspect"
```

GREEN result: build exit 0; 1 browser test passed, covering both loaded product
images and both aborted-image fallbacks.

### Integrated and final verification

```sh
npm test -- src/hooks/useDisclosureSpring.test.jsx src/components/ProjectArchive.test.jsx src/components/SafeImage.test.jsx src/components/ProjectMedia.test.jsx
```

Result: exit 0; 4 files and 18 tests passed.

```sh
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npx playwright test e2e/home-project-index.spec.js e2e/project-media.spec.js e2e/accessibility-preferences.spec.js
```

Result: exit 0; all 20 integrated disclosure, media, and accessibility browser
tests passed.

```sh
npm test
```

Result: exit 0; 23 files and 106 tests passed.

```sh
npm run build
```

Result: exit 0; Vite transformed 1,541 modules and produced the production
bundle.

```sh
PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e
```

Result: exit 0; the command rebuilt the second-wave exact code head and all 50
Playwright tests passed in system Chrome.

### Second-wave self-review and concerns

- Per-frame reconciliation uses the exact spring zero boundary and never hides
  a positive-valued outgoing panel.
- The incoming active panel remains exposed even when its initial value is
  zero, preserving measurable content and the fixed height animation.
- Reduced motion still applies immediate settled semantics with no animation
  frame.
- The CSS override is mobile-only, lead-only, image-only, and
  live-product-only. Archive and legacy media sizing are not broadened.
- The full suite retains single-open behavior, mobile sequential activation,
  no programmatic scroll, social profile behavior, and Curry behavior.
- No refreshed screenshots were needed because the normal long-viewport
  editorial layout is unchanged; the visible fixes affect rapid transition
  semantics and a short-viewport media cap.

Concerns: none. The Playwright run emitted only the existing
`NO_COLOR`/`FORCE_COLOR` startup warning.
