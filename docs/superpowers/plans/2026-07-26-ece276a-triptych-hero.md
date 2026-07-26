# ECE 276A Editorial Triptych Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reproducible `1560×840px` blue-and-gold triptych from the three authored ECE 276A posters and use it as both the homepage and project-detail lead image.

**Architecture:** A focused Node/Sharp build script composes the existing poster files into one checked-in PNG with fixed geometry, crop focal points, colors, and sequence marks. Portfolio data points both image surfaces at that asset while retaining the existing `SafeImage`, disclosure, GIF, and responsive media systems. Asset, data, and browser contracts prevent dimension, reference, crop, fallback, or evidence regressions.

**Tech Stack:** Node.js ESM, Sharp 0.35.3, React 18 portfolio data, Vitest, Playwright, Vite

## Global Constraints

- Output exactly `public/ece276a/ece276a-editorial-triptych.png` at `1560×840px` (`13:7`) and under `2 MB`.
- Use only the three existing poster sources in PR1 → PR2 → PR3 order; do not use AI generation or redraw scientific data.
- Use `#17364c` background, `36px` outer padding, `9px` gutters, three `490×768px` panels, `12px` panel radius, and `#f4f1e9` panel backing.
- Use fixed focal points: PR1 `32% 55%`, PR2 `50% 48%`, PR3 `48% 50%`.
- Add only `36px` `#a78032` circular `01`, `02`, and `03` marks inset `18px` from each panel's lower-right.
- Do not add marketing copy, chart labels, gradients, glass, glow, decorative grids, fake sensor rays, generic robotics imagery, or remote assets.
- Point both `state-estimation.homeEvidence` and `state-estimation.leadEvidence` to the new asset at `width: 1560`, `height: 840`, preserving the complete plate.
- Keep all three existing GIF/poster pairs, project copy, dates, ordering, links, detail sections, layout, typography, colors, archive behavior, and failure fallback unchanged.
- Do not replace any other project image.
- Do not merge, push, or deploy before the finished preview is reviewed.

---

## File Map

- Create `scripts/build-ece276a-triptych.mjs`: deterministic Sharp composition with fixed geometry and focal crops.
- Create `public/ece276a/ece276a-editorial-triptych.png`: generated, checked-in homepage/detail asset.
- Modify `package.json`: expose the focused asset-build command.
- Modify `test/ece276a-media.test.mjs`: verify source presence and output signature, dimensions, format, and size.
- Modify `src/data/portfolio.js`: reference the triptych from `homeEvidence` and `leadEvidence`.
- Modify `src/data/portfolio.test.js`: lock both references, dimensions, fit, and unchanged GIF evidence.
- Modify `e2e/project-media.spec.js`: verify decoded archive/detail image geometry, responsive rendering, fallback, and clean console.

### Task 1: Build and validate the deterministic triptych asset

**Files:**
- Create: `scripts/build-ece276a-triptych.mjs`
- Create: `public/ece276a/ece276a-editorial-triptych.png`
- Modify: `package.json:8-15`
- Modify: `test/ece276a-media.test.mjs:1-52`

**Interfaces:**
- Consumes: the three exact PNG source paths under `public/ece276a/posters/`.
- Produces: `npm run build:ece276a-triptych` and a valid `1560×840px` PNG at `public/ece276a/ece276a-editorial-triptych.png`.

- [ ] **Step 1: Write the failing asset contract**

Add `sharp` to the imports in `test/ece276a-media.test.mjs`:

```js
import sharp from "sharp";
```

Add these constants after `expectedMedia`:

```js
const triptychPath = "public/ece276a/ece276a-editorial-triptych.png";
const triptychMaxBytes = 2 * 1024 * 1024;
```

Add this test inside `describe("ECE 276A visualization contract", ...)`:

```js
it("keeps the editorial triptych at its exact production contract", async () => {
  const bytes = await readFile(triptychPath);
  const file = await stat(triptychPath);
  const metadata = await sharp(triptychPath).metadata();

  expect([...bytes.subarray(0, 8)]).toEqual([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  expect(metadata).toMatchObject({
    format: "png",
    width: 1560,
    height: 840,
  });
  expect(file.size).toBeLessThanOrEqual(triptychMaxBytes);
});
```

- [ ] **Step 2: Run the focused contract and verify RED**

Run:

```bash
npm test -- test/ece276a-media.test.mjs
```

Expected: FAIL with `ENOENT` for
`public/ece276a/ece276a-editorial-triptych.png`, proving the new contract
detects the missing production asset.

- [ ] **Step 3: Create the deterministic Sharp builder**

Create `scripts/build-ece276a-triptych.mjs` with:

```js
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(
  root,
  "public/ece276a/ece276a-editorial-triptych.png"
);

const width = 1560;
const height = 840;
const padding = 36;
const gutter = 9;
const panelWidth = 490;
const panelHeight = 768;
const radius = 12;
const markSize = 36;
const markInset = 18;

const panels = [
  {
    source: "public/ece276a/posters/pr1-orientation.png",
    label: "01",
    focalX: 0.32,
    focalY: 0.55,
  },
  {
    source: "public/ece276a/posters/pr2-lidar-slam.png",
    label: "02",
    focalX: 0.5,
    focalY: 0.48,
  },
  {
    source: "public/ece276a/posters/pr3-visual-inertial-slam.png",
    label: "03",
    focalX: 0.48,
    focalY: 0.5,
  },
];

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

function roundedMask() {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${panelWidth}" height="${panelHeight}">
      <rect width="${panelWidth}" height="${panelHeight}"
        rx="${radius}" fill="#ffffff"/>
    </svg>
  `);
}

function sequenceMark(label) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${markSize}" height="${markSize}">
      <circle cx="18" cy="18" r="18" fill="#a78032"/>
      <text x="18" y="18" text-anchor="middle" dominant-baseline="central"
        fill="#ffffff" font-family="Arial, sans-serif" font-size="12"
        font-weight="700">${label}</text>
    </svg>
  `);
}

async function cropPanel({ source, focalX, focalY }) {
  const sourcePath = path.join(root, source);
  const metadata = await sharp(sourcePath).metadata();
  const scale = Math.max(
    panelWidth / metadata.width,
    panelHeight / metadata.height
  );
  const resizedWidth = Math.ceil(metadata.width * scale);
  const resizedHeight = Math.ceil(metadata.height * scale);
  const left = clamp(
    Math.round((resizedWidth - panelWidth) * focalX),
    0,
    resizedWidth - panelWidth
  );
  const top = clamp(
    Math.round((resizedHeight - panelHeight) * focalY),
    0,
    resizedHeight - panelHeight
  );

  return sharp(sourcePath)
    .resize(resizedWidth, resizedHeight, { fit: "fill" })
    .extract({
      left,
      top,
      width: panelWidth,
      height: panelHeight,
    })
    .composite([{ input: roundedMask(), blend: "dest-in" }])
    .png()
    .toBuffer();
}

await mkdir(path.dirname(output), { recursive: true });

const composites = [];
for (const [index, panel] of panels.entries()) {
  const left = padding + index * (panelWidth + gutter);
  const top = padding;
  composites.push({
    input: await cropPanel(panel),
    left,
    top,
  });
  composites.push({
    input: sequenceMark(panel.label),
    left: left + panelWidth - markSize - markInset,
    top: top + panelHeight - markSize - markInset,
  });
}

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: "#17364c",
  },
})
  .composite(composites)
  .png({
    compressionLevel: 9,
    adaptiveFiltering: true,
  })
  .toFile(output);

const result = await sharp(output).metadata();
if (result.width !== width || result.height !== height || result.format !== "png") {
  throw new Error(
    `Unexpected ECE 276A triptych output: ${result.width}x${result.height} ${result.format}`
  );
}

console.log(
  `Built ${path.relative(root, output)} (${result.width}x${result.height})`
);
```

- [ ] **Step 4: Add the focused package command**

Add this entry to `package.json` immediately after `build`:

```json
"build:ece276a-triptych": "node scripts/build-ece276a-triptych.mjs",
```

- [ ] **Step 5: Generate the production asset**

Run:

```bash
npm run build:ece276a-triptych
```

Expected:

```text
Built public/ece276a/ece276a-editorial-triptych.png (1560x840)
```

- [ ] **Step 6: Verify deterministic output**

Run:

```bash
shasum -a 256 public/ece276a/ece276a-editorial-triptych.png
npm run build:ece276a-triptych
shasum -a 256 public/ece276a/ece276a-editorial-triptych.png
```

Expected: both SHA-256 lines are identical.

- [ ] **Step 7: Run the focused asset contract and verify GREEN**

Run:

```bash
npm test -- test/ece276a-media.test.mjs
```

Expected: PASS with all ECE 276A media tests green and pristine output.

- [ ] **Step 8: Visually inspect the generated plate**

Open:

```text
public/ece276a/ece276a-editorial-triptych.png
```

Verify:

- three rounded panels are visible in PR1 → PR2 → PR3 order;
- the plots are not stretched;
- `01`, `02`, and `03` are legible and inset consistently;
- no source label or result is accidentally clipped into an unreadable sliver;
- the navy field and gold marks match the approved visual companion.

- [ ] **Step 9: Commit the reproducible asset**

```bash
git add package.json scripts/build-ece276a-triptych.mjs test/ece276a-media.test.mjs public/ece276a/ece276a-editorial-triptych.png
git commit -m "feat: build ECE 276A editorial triptych"
```

### Task 2: Integrate the triptych into homepage and project detail

**Files:**
- Modify: `src/data/portfolio.js:499-575`
- Modify: `src/data/portfolio.test.js:150-175`
- Modify: `e2e/project-media.spec.js:1-225`

**Interfaces:**
- Consumes: `/ece276a/ece276a-editorial-triptych.png` from Task 1.
- Produces: matching `homeEvidence` and `leadEvidence` records with exact path, dimensions, alt text, `technical` role, and `contain` fit.

- [ ] **Step 1: Write the failing portfolio-data contract**

In `src/data/portfolio.test.js`, replace the old one-line
`state-estimation.homeEvidence.src` assertion with:

```js
const estimation = projects.find(
  ({ id }) => id === "state-estimation"
);
for (const evidence of [
  estimation.homeEvidence,
  estimation.leadEvidence,
]) {
  expect(evidence).toMatchObject({
    kind: "image",
    src: "/ece276a/ece276a-editorial-triptych.png",
    width: 1560,
    height: 840,
    role: "technical",
    fit: "contain",
  });
  expect(evidence.alt).toMatch(
    /orientation.*LiDAR mapping.*visual-inertial SLAM/i
  );
}
```

- [ ] **Step 2: Run the data contract and verify RED**

Run:

```bash
npm test -- src/data/portfolio.test.js
```

Expected: FAIL because both evidence records still reference
`/ece276a/1.png` at `1866×2266`.

- [ ] **Step 3: Add the failing responsive browser contract**

Add `expectNoHorizontalOverflow` to the helper imports in
`e2e/project-media.spec.js`:

```js
import {
  expectNoHorizontalOverflow,
  mediaBox,
  openProject,
} from "./helpers.js";
```

Add:

```js
for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`ECE 276A triptych stays complete in archive and detail on ${viewport.name}`, async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page
      .locator('[data-project-trigger][data-project-id="state-estimation"]')
      .click();

    const archiveImage = page.locator(
      '#project-panel-state-estimation img[src="/ece276a/ece276a-editorial-triptych.png"]'
    );
    await expect(archiveImage).toBeVisible();
    expect(
      await archiveImage.evaluate((image) => ({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: getComputedStyle(image).objectFit,
      }))
    ).toEqual({
      naturalWidth: 1560,
      naturalHeight: 840,
      objectFit: "contain",
    });
    const archiveBox = await mediaBox(archiveImage);
    expect(archiveBox.width / archiveBox.height).toBeCloseTo(13 / 7, 2);
    await expectNoHorizontalOverflow(page);

    await openProject(page, "state-estimation");
    const leadImage = page.locator(
      '.lead-evidence img[src="/ece276a/ece276a-editorial-triptych.png"]'
    );
    await expect(leadImage).toBeVisible();
    expect(
      await leadImage.evaluate((image) => ({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: getComputedStyle(image).objectFit,
      }))
    ).toEqual({
      naturalWidth: 1560,
      naturalHeight: 840,
      objectFit: "contain",
    });
    const leadBox = await mediaBox(leadImage);
    expect(leadBox.width / leadBox.height).toBeCloseTo(13 / 7, 2);
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
}

test("a failed ECE 276A triptych keeps a descriptive fallback", async ({
  page,
}) => {
  await page.route("**/ece276a/ece276a-editorial-triptych.png", (route) =>
    route.abort()
  );
  await page.goto("/");
  await page
    .locator('[data-project-trigger][data-project-id="state-estimation"]')
    .click();
  await expect(
    page.getByRole("img", {
      name: /orientation.*LiDAR mapping.*visual-inertial SLAM.*image unavailable/i,
    })
  ).toBeVisible();
});
```

- [ ] **Step 4: Run the browser contract and verify RED**

Run:

```bash
npm run build
npx playwright test e2e/project-media.spec.js --grep "ECE 276A triptych"
```

Expected: FAIL because no rendered image yet references
`/ece276a/ece276a-editorial-triptych.png`.

- [ ] **Step 5: Update the two ECE 276A image records**

In `src/data/portfolio.js`, update `state-estimation.homeEvidence` to:

```js
homeEvidence: {
  kind: "image",
  src: "/ece276a/ece276a-editorial-triptych.png",
  alt: "Triptych of orientation tracking, LiDAR mapping, and visual-inertial SLAM results",
  caption: "Orientation tracking, LiDAR mapping, and visual-inertial SLAM across the WI26 sequence.",
  heading: "Three estimation systems, from inertial orientation to visual-inertial SLAM.",
  width: 1560,
  height: 840,
  role: "technical",
  fit: "contain",
},
```

Update `state-estimation.leadEvidence` to:

```js
leadEvidence: {
  kind: "image",
  src: "/ece276a/ece276a-editorial-triptych.png",
  alt: "Triptych of orientation tracking, LiDAR mapping, and visual-inertial SLAM results",
  caption: "Representative orientation, mapping, and visual-inertial results across the WI26 course sequence.",
  width: 1560,
  height: 840,
  role: "technical",
  fit: "contain",
},
```

Do not change `selectedEvidence` or `moreEvidence`.

- [ ] **Step 6: Run the focused data and media contracts**

Run:

```bash
npm test -- src/data/portfolio.test.js test/ece276a-media.test.mjs
```

Expected: PASS with the new path/dimensions locked and all three existing
GIF/poster pairs unchanged.

- [ ] **Step 7: Run the focused responsive browser contract**

Run:

```bash
npm run build
npx playwright test e2e/project-media.spec.js --grep "ECE 276A triptych"
```

Expected: three tests pass: desktop archive/detail, mobile archive/detail, and
descriptive failure fallback.

- [ ] **Step 8: Run the complete verification gate**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected:

- all unit test files and tests pass with pristine output;
- production Vite build exits 0;
- every Playwright test passes, including existing GIF lifecycle, responsive,
  accessibility, social-link, Curry, and click-only archive coverage;
- `git diff --check` produces no output.

- [ ] **Step 9: Capture and inspect finished previews**

Capture the homepage archive and `state-estimation` project page at:

```text
1440×900
390×844
```

Inspect all four captures for:

- all three panels and marks visible;
- no distorted plot geometry;
- no horizontal overflow;
- unchanged surrounding typography, spacing, and copy;
- sufficient legibility at the mobile rendered size.

Present the four finished previews to the user before any push, merge, or
deployment.

- [ ] **Step 10: Commit the integration**

```bash
git add src/data/portfolio.js src/data/portfolio.test.js e2e/project-media.spec.js
git commit -m "feat: use ECE 276A triptych artwork"
```

- [ ] **Step 11: Record final local evidence**

Run:

```bash
git status --short --branch
git log -4 --oneline --decorate
```

Expected: the worktree is clean; the latest commits are
`feat: use ECE 276A triptych artwork`,
`feat: build ECE 276A editorial triptych`, and the approved design/plan
documentation commits. Keep the branch and preview local until the user
explicitly authorizes push, merge, or deployment.
