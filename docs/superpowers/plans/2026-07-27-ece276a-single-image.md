# ECE 276A Single-Image Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected ECE 276A triptych with the complete, unmodified PR2 LiDAR SLAM poster on both archive and detail surfaces.

**Architecture:** Point both shared evidence records directly at the existing authored PR2 poster and remove the obsolete derived-image pipeline. Keep the existing media renderer, `SafeImage`, technical-media role, and `contain` behavior unchanged.

**Tech Stack:** React 18, Vitest, Sharp metadata inspection, Playwright, Vite

## Global Constraints

- Use `/ece276a/posters/pr2-lidar-slam.png` at its natural 960 × 540 dimensions.
- Use `object-fit: contain`; do not crop, enlarge a subsection, recolor, redraw, frame, overlay, or generate a derivative.
- Use the exact approved alt text, captions, and homepage heading from the design spec.
- Keep the three existing GIF/poster pairs, their order, captions, dimensions, and course narrative unchanged.
- Remove the rejected generated PNG, builder script, package script, and triptych-only runtime tests.
- Keep `sharp` and every other dependency unchanged.
- Do not change shared layout, typography, social interactions, Curry behavior, analytics, or deployment state.
- Do not push, merge, or deploy as part of implementation.

---

## File Map

- Modify `src/data/portfolio.js`: point `homeEvidence` and `leadEvidence` at the complete PR2 poster with approved copy.
- Modify `src/data/portfolio.test.js`: lock the exact single-image contract.
- Modify `test/ece276a-media.test.mjs`: remove triptych tests and verify the authored PR2 PNG's exact dimensions.
- Modify `e2e/project-media.spec.js`: verify complete single-image rendering and failure fallback on desktop/mobile.
- Modify `package.json`: remove the obsolete triptych build script.
- Delete `scripts/build-ece276a-triptych.mjs`: remove rejected derived-image generation.
- Delete `public/ece276a/ece276a-editorial-triptych.png`: remove rejected generated asset.

### Task 1: Replace the triptych with the complete PR2 poster

**Files:**
- Modify: `src/data/portfolio.js:518-544`
- Modify: `src/data/portfolio.test.js:180-198`
- Modify: `test/ece276a-media.test.mjs:1-85`
- Modify: `e2e/project-media.spec.js:235-310`
- Modify: `package.json:8-15`
- Delete: `scripts/build-ece276a-triptych.mjs`
- Delete: `public/ece276a/ece276a-editorial-triptych.png`

**Interfaces:**
- Consumes: the existing authored `/ece276a/posters/pr2-lidar-slam.png` asset and the existing `SafeImage`/technical-media rendering path.
- Produces: identical homepage and detail evidence records using the complete 960 × 540 PR2 poster.

- [ ] **Step 1: Write the failing shared-data contract**

In `src/data/portfolio.test.js`, replace the triptych expectation with:

```js
const estimation = projects.find(({ id }) => id === "state-estimation");
for (const evidence of [estimation.homeEvidence, estimation.leadEvidence]) {
  expect(evidence).toMatchObject({
    kind: "image",
    src: "/ece276a/posters/pr2-lidar-slam.png",
    alt: "LiDAR SLAM occupancy map with corrected robot trajectory",
    width: 960,
    height: 540,
    role: "technical",
    fit: "contain",
  });
}
expect(estimation.homeEvidence).toMatchObject({
  caption: "PR2 · Submap ICP trajectory correction and occupancy-grid mapping.",
  heading: "LiDAR mapping refined through scan-to-submap alignment.",
});
expect(estimation.leadEvidence.caption).toBe(
  "Submap ICP trajectory correction while sampled LiDAR scans build the occupancy grid."
);
```

Keep the existing exact three-GIF assertions unchanged.

- [ ] **Step 2: Replace the generated-asset test with an authored-poster contract**

In `test/ece276a-media.test.mjs`, remove `triptychPath`,
`triptychMaxBytes`, `formerTopStripGlyphs`, and both triptych-only tests.

Add:

```js
it("keeps the selected PR2 poster at its authored dimensions", async () => {
  const metadata = await sharp(
    "public/ece276a/posters/pr2-lidar-slam.png"
  ).metadata();

  expect(metadata).toMatchObject({
    format: "png",
    width: 960,
    height: 540,
  });
});
```

Keep the existing asset-signature/size and exact GIF/poster-pair tests.

- [ ] **Step 3: Update the browser contract and verify RED**

Rename the responsive test to:

```js
test(`ECE 276A PR2 poster stays complete in archive and detail on ${viewport.name}`, ...)
```

Change both image selectors to
`/ece276a/posters/pr2-lidar-slam.png`, and change expected natural dimensions
to:

```js
{
  naturalWidth: 960,
  naturalHeight: 540,
  objectFit: "contain",
}
```

Keep the 13:7 shared-container ratio and horizontal-overflow assertions.

Rename the failure test to
`a failed ECE 276A PR2 poster keeps a descriptive fallback`, abort
`**/ece276a/posters/pr2-lidar-slam.png`, and assert:

```js
await expect(
  page.getByRole("img", {
    name: /LiDAR SLAM occupancy map with corrected robot trajectory.*image unavailable/i,
  })
).toBeVisible();
```

Run:

```bash
npm test -- src/data/portfolio.test.js test/ece276a-media.test.mjs
npm run build
npx playwright test e2e/project-media.spec.js --grep "ECE 276A"
```

Expected: FAIL because runtime data still points at the generated triptych and
the obsolete asset pipeline still exists.

- [ ] **Step 4: Update the two runtime evidence records**

In `src/data/portfolio.js`, use:

```js
homeEvidence: {
  kind: "image",
  src: "/ece276a/posters/pr2-lidar-slam.png",
  alt: "LiDAR SLAM occupancy map with corrected robot trajectory",
  caption: "PR2 · Submap ICP trajectory correction and occupancy-grid mapping.",
  heading: "LiDAR mapping refined through scan-to-submap alignment.",
  width: 960,
  height: 540,
  role: "technical",
  fit: "contain",
},
leadEvidence: {
  kind: "image",
  src: "/ece276a/posters/pr2-lidar-slam.png",
  alt: "LiDAR SLAM occupancy map with corrected robot trajectory",
  caption:
    "Submap ICP trajectory correction while sampled LiDAR scans build the occupancy grid.",
  width: 960,
  height: 540,
  role: "technical",
  fit: "contain",
},
```

Do not change `selectedEvidence`, `moreEvidence`, or project narrative fields.

- [ ] **Step 5: Remove the rejected derived-image pipeline**

Remove this entry from `package.json`:

```json
"build:ece276a-triptych": "node scripts/build-ece276a-triptych.mjs",
```

Delete:

```text
scripts/build-ece276a-triptych.mjs
public/ece276a/ece276a-editorial-triptych.png
```

Do not remove `sharp` or edit historical specs/plans.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/data/portfolio.test.js test/ece276a-media.test.mjs
npm run build
npx playwright test e2e/project-media.spec.js --grep "ECE 276A"
```

Expected: PASS with the exact authored-poster contract.

- [ ] **Step 7: Run complete release checks**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests pass, production build exits 0, all Playwright tests
pass, and no whitespace errors are reported.

- [ ] **Step 8: Capture and inspect responsive previews**

Capture:

- homepage archive at 1440 × 1000;
- homepage archive at 390 × 844;
- ECE 276A detail page at 1440 × 1000;
- ECE 276A detail page at 390 × 844.

Verify the full PR2 title, axes, map, status badge, and margins remain visible;
the source is not cropped or distorted; there is no decorative triptych frame,
horizontal overflow, Vite error overlay, or console error.

- [ ] **Step 9: Commit the single-image replacement**

```bash
git add package.json src/data/portfolio.js src/data/portfolio.test.js test/ece276a-media.test.mjs e2e/project-media.spec.js scripts/build-ece276a-triptych.mjs public/ece276a/ece276a-editorial-triptych.png
git commit -m "fix: show complete ECE 276A PR2 result"
```

- [ ] **Step 10: Record final local state**

Run:

```bash
git status --short --branch
git log -5 --oneline --decorate
```

Expected: the worktree is clean. Do not push, merge, or deploy until the user
reviews the finished local previews and explicitly authorizes the next
boundary.
