# Original+ Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the live original portfolio into the approved Original+ design with updated Bioyond content, a single-open project archive, controlled project evidence, and an invisible Apple craft layer while preserving the original editorial identity.

**Architecture:** Start from the original `main` UI, not the rejected `codex/portfolio-redesign` visual branch. Move content data into one module, keep `Portfolio.jsx` as the three-view state shell, and isolate Home, Project, About, chrome, archive interaction, spring motion, and media rendering into focused modules. One active project ID drives both desktop and mobile behavior; one shared rAF spring controller owns all disclosure presentation values.

**Tech Stack:** React 18.3.1, Vite 7.3.6, Tailwind CSS 3.4.7, Source Serif Pro, Inter, Vitest 4.1.10, React Testing Library 16.3.2 + DOM Testing Library 10.4.1, Playwright 1.61.1, GitHub Pages

## Global Constraints

- Execute from a fresh worktree created from current `main` with `superpowers:using-git-worktrees`; do not implement inside `.worktrees/portfolio-redesign`.
- Do not cherry-pick any visual feature commit from `codex/portfolio-redesign`. Port only style-neutral tests, behavior, and the four approved optimized assets.
- Preserve the original black EW mark, Source Serif Pro + Inter pairing, white page, approximately 1024px main width, approximately 944px net content width, and 88–128px desktop rhythm.
- Keep the existing in-memory Work / Project / About navigation. Do not add React Router, hash routing, or URL persistence.
- Homepage copy is exactly the approved status, positioning, heading, supporting copy, and Bioyond current-practice record from the design spec.
- Keep all six projects in their existing order. Project 01 is expanded initially, and exactly one project is active at all times.
- Desktop click, Enter, and Space switch the active project; clicking the current project never produces a zero-open state and never moves focus.
- Mobile activation begins below 640px and uses a 42% viewport reading line, 64px hysteresis, direction-aware ties, a 900ms tap lock, and early unlock only after more than 96px of user scroll.
- The mobile project-activation observer must never call `scrollTo`, `scrollIntoView`, set scroll snap, or prevent native scrolling. Work / Project / About view changes still use the explicit root lifecycle scroll reset.
- The disclosure spring uses damping ratio `1.0`, response `0.36–0.42s`, no overshoot, one shared rAF loop, and retargeting from current position and velocity.
- Do not add Framer Motion or another animation framework. The local spring controller uses the critically damped analytic solution.
- Navigation is the only translucent material: 76–86% white, 18–22px blur, saturation no higher than 140%, with a 10–14px edge fade after approximately 4px of scroll.
- Blue `#274D66` and gold `#A48645` together occupy no more than approximately 5–8% of the interface. Keep the original muted green status indicator.
- Compact controls respond on pointer-down at scale `0.98–0.99` within 80–100ms. Full-width project rows never scale.
- Do not introduce SF Pro, decorative glass cards, device mockups, hardware silhouettes, bouncing motion, gradients, parallax, product-launch scrolling, sound, vibration, or simulated haptics.
- Homepage media maximums: desktop 520×280px, tablet 420×230px, mobile available width × 220px. Technical and low-resolution media use `object-fit: contain` and remain near natural size.
- Detail media maximums: landscape 720×440px, portrait 360×520px, technical 720px wide, mobile lead no more than 50vh, low-resolution assets no more than 1.25× natural dimensions.
- Projects 04 and 06 are intentionally text-only; never invent a gradient, stock image, fake diagram, or fallback container for them.
- Outcome appears before optional evidence. Selected evidence is capped at three items; extra media is collapsed and mounted only on request.
- Videos use H.264/AAC MP4, `controls`, `playsInline`, `preload="metadata"`, a stable frame, and no autoplay. GIFs and PDF previews mount only after user action.
- A declared image that fails to load gets a neutral named fallback. Changing its `src` clears the failure state.
- `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast` are independent. Reduced motion uses an immediate state change; reduced transparency removes blur; increased contrast adds a defined border and darker text.
- All interactive controls remain keyboard reachable with visible deep-blue focus. Touch targets are at least 44px high.
- Preserve or improve the original page title, meta description, skip link, view-change scroll/focus lifecycle, and descriptive alt/caption text.
- Use Node `^20.19.0 || ^22.13.0 || >=24.0.0`; CI uses Node 22.
- Every task follows red → green → refactor, ends with focused verification, and commits only its own files.

---

## File Structure

**Create**

- `src/data/portfolio.js` — profile, six projects, normalized homepage/detail evidence metadata
- `src/data/portfolio.test.js` — normalized content and media contracts
- `src/components/SiteChrome.jsx` — material navigation, skip-link target relationship, footer
- `src/components/SiteChrome.test.jsx` — navigation current state, scroll material, independent preference states
- `src/components/socialIcons.js` — maps serializable social icon names to Lucide components
- `src/components/Portrait.jsx` — shared restrained portrait treatment
- `src/components/SafeImage.jsx` — intrinsic image rendering and named failure fallback
- `src/components/SafeImage.test.jsx` — failure and source-reset behavior
- `src/components/ProjectArchive.jsx` — semantic trigger + sibling panel archive
- `src/components/ProjectArchive.test.jsx` — one-open semantics, focus, text-only rows, presence
- `src/components/ProjectMedia.jsx` — controlled images, video, GIF, PDF, and on-demand archive
- `src/components/ProjectMedia.test.jsx` — media lifecycle and user-initiation behavior
- `src/hooks/useMediaPreference.js` — reactive matchMedia wrapper
- `src/hooks/useMediaPreference.test.jsx` — independent preference updates
- `src/hooks/useDisclosureSpring.js` — one shared rAF loop and direct disclosure DOM writes
- `src/hooks/useDisclosureSpring.test.jsx` — rAF, DOM presence, interruption, and reduced-motion behavior
- `src/hooks/useMobileProjectActivation.js` — passive scroll observer and tap lock
- `src/hooks/useMobileProjectActivation.test.jsx` — hook scheduling, focus hold, and no-scroll guarantees
- `src/lib/projectActivation.js` — pure reading-line, hysteresis, tie, and lock functions
- `src/lib/projectActivation.test.js` — exact boundary tests
- `src/motion/disclosureSpring.js` — critically damped vector controller
- `src/motion/disclosureSpring.test.js` — frame-rate, interruption, and no-overshoot tests
- `src/pages/HomePage.jsx` — approved hero, current practice, and project archive
- `src/pages/HomePage.test.jsx` — approved content and homepage hierarchy
- `src/pages/ProjectPage.jsx` — curated technical-journal detail view
- `src/pages/ProjectPage.test.jsx` — journal order and media lifecycle
- `src/pages/AboutPage.jsx` — complete updated About view
- `src/pages/AboutPage.test.jsx` — Bioyond, education, skills, and contact coverage
- `src/test/setup.js` — Testing Library cleanup, matchMedia registry, and browser API mocks
- `src/test/rafClock.js` — deterministic requestAnimationFrame clock for hook tests
- `src/Portfolio.smoke.test.jsx` — shell, navigation lifecycle, title, and StrictMode behavior
- `public/ece276b/pr2/posters/E1_Flappy_Bird.png` through `E7_Room.png` — authentic first-frame stills for user-initiated PR2 GIF playback
- `playwright.config.js` — production-preview browser test configuration
- `e2e/helpers.js` — overflow, font, active-project, and media-size helpers
- `e2e/home-project-index.spec.js` — desktop, mobile, press, and interruption behavior
- `e2e/project-media.spec.js` — media limits, fallback, and user-initiation behavior
- `e2e/accessibility-preferences.spec.js` — keyboard and three independent preference paths
- `e2e/responsive.spec.js` — 1440, 1024, 390, and 320 layout verification

**Modify**

- `package.json` / `package-lock.json` — Node floor, Vitest/RTL/Playwright, test scripts
- `vite.config.js` — Vitest jsdom configuration
- `.github/workflows/static.yml` — pull-request verification and main-only deploy
- `.gitignore` — Playwright artifacts
- `index.html` — updated title/description while preserving Google font requests
- `src/index.css` — Original+ tokens, material nav, press response, typography, preference fallbacks
- `src/Portfolio.jsx` — data imports, three-view state shell, page lifecycle, extracted page composition

**Verify unchanged**

- `tailwind.config.js` — retain the existing Source Serif Pro and Inter families; add no replacement font

**Port from `codex/portfolio-redesign` only**

- `public/c12.ai/1-optimized.jpg`
- `public/c12.ai/IMG_1671.mp4`
- `public/c12.ai/IMG_1672.mp4`
- `public/ece276b/pr1/doorkey-poster.png`

**Remove after new references and media tests pass**

- `public/c12.ai/1.JPG`
- `public/c12.ai/IMG_1671.mov`
- `public/c12.ai/IMG_1672.mov`

---

## Execution Setup

Before Task 1, invoke `superpowers:using-git-worktrees`, audit the remote baseline, and create a clean implementation worktree from the commit containing this plan:

```bash
git status --short --branch
git cat-file -e HEAD:docs/superpowers/plans/2026-07-20-portfolio-original-plus.md
git cat-file -e HEAD:docs/superpowers/specs/2026-07-17-portfolio-original-plus-design.md
git fetch origin
git merge-base --is-ancestor origin/main main
git rev-parse --verify codex/portfolio-redesign
git check-ignore -q .worktrees
git worktree add .worktrees/portfolio-original-plus -b codex/portfolio-original-plus main
cd .worktrees/portfolio-original-plus
git status --short --branch
```

Expected: the source checkout is clean, the current commit contains both the approved spec and this implementation plan, `origin/main` is an ancestor of current `main`, the style-neutral asset source branch exists, `.worktrees` is ignored, the new branch is `codex/portfolio-original-plus`, and the worktree is clean. If either `cat-file` check fails, commit the approved documents before worktree creation. If ancestry fails, stop and inspect divergence before implementation. If the branch or path already exists, inspect it rather than deleting or overwriting it. Do not use the rejected `.worktrees/portfolio-redesign` checkout for implementation.

---

### Task 1: Establish the Verification Baseline

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.js`
- Modify: `.github/workflows/static.yml`
- Create: `src/test/setup.js`
- Create: `src/test/rafClock.js`
- Create: `src/Portfolio.smoke.test.jsx`

**Interfaces:**

- Consumes: existing default export `Portfolio` from `src/Portfolio.jsx`
- Produces: `npm test`, `npm run test:watch`, `setMediaQuery(query, matches)`, and deterministic `createRafClock()`

- [ ] **Step 1: Write the smoke test before the runner exists**

Create `src/Portfolio.smoke.test.jsx`:

```jsx
import { render, screen } from "@testing-library/react";
import Portfolio from "./Portfolio.jsx";

describe("portfolio baseline", () => {
  it("renders the current editorial shell before Original+ changes", () => {
    render(<Portfolio />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "About" })).toBeInTheDocument();
    expect(screen.getAllByText("Edward Wang").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the missing test command**

Run: `npm test -- src/Portfolio.smoke.test.jsx`

Expected: FAIL because `package.json` has no `test` script.

- [ ] **Step 3: Install exact test dependencies and update scripts**

Run:

```bash
npm install --save-dev vite@7.3.6 vitest@4.1.10 jsdom@29.1.1 @testing-library/react@16.3.2 @testing-library/dom@10.4.1 @testing-library/jest-dom@6.9.1 @testing-library/user-event@14.6.1 @playwright/test@1.61.1
```

Merge these exact fields into `package.json`:

```json
{
  "engines": {
    "node": "^20.19.0 || ^22.13.0 || >=24.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "npm run build && playwright test"
  }
}
```

- [ ] **Step 4: Configure Vitest and shared browser mocks**

Replace `vite.config.js` with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { pretendToBeVisual: true } },
    setupFiles: "./src/test/setup.js",
    css: true,
    globals: true,
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
```

Create `src/test/setup.js`:

```js
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const mediaState = new Map();
const mediaListeners = new Map();

export function setMediaQuery(query, matches) {
  mediaState.set(query, matches);
  for (const listener of mediaListeners.get(query) || []) {
    listener({ matches, media: query });
  }
}

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn((query) => ({
    media: query,
    get matches() {
      return mediaState.get(query) ?? false;
    },
    onchange: null,
    addEventListener: (_type, listener) => {
      const listeners = mediaListeners.get(query) || new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeEventListener: (_type, listener) => {
      mediaListeners.get(query)?.delete(listener);
    },
    addListener: (listener) => {
      const listeners = mediaListeners.get(query) || new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeListener: (listener) => mediaListeners.get(query)?.delete(listener),
    dispatchEvent: () => true,
  })),
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: vi.fn(),
});

afterEach(() => {
  cleanup();
  mediaState.clear();
  mediaListeners.clear();
  vi.clearAllMocks();
});
```

Create `src/test/rafClock.js`:

```js
export function createRafClock(start = 0) {
  let now = start;
  let nextId = 1;
  const callbacks = new Map();
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  return {
    install() {
      window.requestAnimationFrame = (callback) => {
        const id = nextId++;
        callbacks.set(id, callback);
        return id;
      };
      window.cancelAnimationFrame = (id) => callbacks.delete(id);
    },
    advance(milliseconds) {
      now += milliseconds;
      const frame = [...callbacks.values()];
      callbacks.clear();
      frame.forEach((callback) => callback(now));
    },
    pending() {
      return callbacks.size;
    },
    restore() {
      callbacks.clear();
      window.requestAnimationFrame = originalRequestAnimationFrame;
      window.cancelAnimationFrame = originalCancelAnimationFrame;
    },
  };
}
```

- [ ] **Step 5: Run the baseline unit test and production build**

Run: `npm test -- src/Portfolio.smoke.test.jsx`

Expected: PASS, 1 test.

Run: `npm run build`

Expected: PASS and `dist/index.html` exists.

- [ ] **Step 6: Add the unit gate to the existing deploy job**

In `.github/workflows/static.yml`, change Node to 22 and insert this step between `npm ci` and `npm run build`:

```yaml
      - name: Test
        run: npm test
```

The complete PR/E2E job split happens in Task 8 after browser tests exist.

- [ ] **Step 7: Commit the verification baseline**

```bash
git add package.json package-lock.json vite.config.js .github/workflows/static.yml src/test/setup.js src/test/rafClock.js src/Portfolio.smoke.test.jsx
git commit -m "test: add original plus verification baseline"
```

---

### Task 2: Normalize Content and Port Approved Media

**Files:**

- Create: `src/data/portfolio.js`
- Create: `src/data/portfolio.test.js`
- Create: `src/components/socialIcons.js`
- Modify: `src/Portfolio.jsx` (baseline lines 23–350)
- Modify: `index.html` (baseline lines 6–15)
- Create: `public/c12.ai/1-optimized.jpg`
- Create: `public/c12.ai/IMG_1671.mp4`
- Create: `public/c12.ai/IMG_1672.mp4`
- Create: `public/ece276b/pr1/doorkey-poster.png`
- Create: `public/ece276b/pr2/posters/E1_Flappy_Bird.png`
- Create: `public/ece276b/pr2/posters/E2_Maze.png`
- Create: `public/ece276b/pr2/posters/E3_Monza.png`
- Create: `public/ece276b/pr2/posters/E4_Single_Cube.png`
- Create: `public/ece276b/pr2/posters/E5_Tower.png`
- Create: `public/ece276b/pr2/posters/E6_Window.png`
- Create: `public/ece276b/pr2/posters/E7_Room.png`

**Interfaces:**

- Produces: named exports `profile` and `projects`
- Project media fields: `homeEvidence`, `leadEvidence`, `selectedEvidence`, and `moreEvidence`
- Image descriptor: `{ kind: "image", src, alt, caption, width, height, role, fit?, position?, group? }`
- Video descriptor: `{ kind: "video", src, poster?, caption, width, height, role, group? }`
- GIF descriptor: `{ kind: "gif", src, poster, alt, caption, width, height, role, group? }`
- PDF descriptor: `{ kind: "pdf", src, name, caption, group }`

- [ ] **Step 1: Write the content contract test**

Create `src/data/portfolio.test.js`:

```js
import { profile, projects } from "./portfolio.js";

describe("Original+ portfolio content", () => {
  it("puts Bioyond first and preserves the approved positioning", () => {
    expect(profile.positioning).toBe("Robotics · Agentic AI · AI for Science");
    expect(profile.aboutHeading).toBe(
      "I'm Edward Wang. I work across robotics, Agentic AI, and AI for Science."
    );
    expect(profile.experience[0]).toMatchObject({
      org: "Bioyond Robotics",
      role: "Agentic AI Engineer Intern · AI for Science",
      year: "Jul 2026 — Present",
      location: "Pudong, Shanghai, China · On-site",
    });
    expect(profile.socials.map((social) => social.icon)).toEqual([
      "github",
      "linkedin",
      "mail",
    ]);
  });

  it("keeps six projects in order with authentic homepage evidence only", () => {
    expect(projects.map((project) => project.id)).toEqual([
      "off-road-vehicle",
      "lab-robotic-arm",
      "state-estimation",
      "drug-delivery-ml",
      "planning-control",
      "embedded-digital",
    ]);
    expect(projects[0].homeEvidence.src).toBe("/ece191/2.png");
    expect(projects[3].homeEvidence).toBeNull();
    expect(projects[4].homeEvidence.src).toBe(
      "/ece276b/pr1/doorkey-poster.png"
    );
    expect(projects[5].homeEvidence).toBeNull();
  });

  it("caps selected evidence and normalizes every legacy media record", () => {
    for (const project of projects) {
      expect(project.selectedEvidence.length).toBeLessThanOrEqual(3);
      for (const evidence of [
        ...project.selectedEvidence,
        ...project.moreEvidence,
      ]) {
        expect(evidence.caption.length).toBeGreaterThan(12);
        if (evidence.kind === "gif") {
          expect(evidence.poster).toMatch(/\.(png|jpe?g)$/i);
        }
      }
      expect(project).not.toHaveProperty("media");
      expect(project).not.toHaveProperty("cover");
      expect(project).not.toHaveProperty("gallery");
    }
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npm test -- src/data/portfolio.test.js`

Expected: FAIL because `src/data/portfolio.js` does not exist.

- [ ] **Step 3: Move the existing data declarations into a data module**

Using `apply_patch`, move the complete current `profile` declaration from `src/Portfolio.jsx:23-115` and the complete current `projects` array from `src/Portfolio.jsx:117-350` into `src/data/portfolio.js`. Keep every existing project narrative, stack, report, GIF, link, education, coursework, language, and social record during the move. The only declaration changes in the moved blocks are `const profile` to `export const profile` and `const projects` to `export const projects`; do not abbreviate or reconstruct either object. Step 5 then replaces the presentation-only `cover`, `gallery`, and heterogeneous `media` fields with the normalized evidence fields.

At the top of `src/Portfolio.jsx`, add:

```js
import { profile, projects } from "./data/portfolio.js";
```

Delete the moved declarations from `src/Portfolio.jsx`; do not change UI markup in this step.

- [ ] **Step 4: Apply the approved profile updates**

Replace the profile's positioning fields with:

```js
role: "Robotics, Agentic AI & AI for Science",
location: "Pudong, Shanghai · Agentic AI Engineer Intern at Bioyond Robotics",
positioning: "Robotics · Agentic AI · AI for Science",
tagline: "I build intelligent systems that carry intent into reliable execution.",
aboutHeading:
  "I'm Edward Wang. I work across robotics, Agentic AI, and AI for Science.",
heroCopy:
  "Working across agentic scientific workflows, perception, planning, control and real hardware—where reliability, traceability and human oversight matter.",
currentPractice: {
  year: "Jul 2026 — Present",
  location: "Pudong, Shanghai, China · On-site",
  org: "Bioyond Robotics",
  role: "Agentic AI Engineer Intern · AI for Science",
  note:
    "Designing and developing an agentic AI platform for scientific workflow automation. Building modular planning, orchestration, validation and feedback mechanisms for executable, adaptive and auditable laboratory processes.",
},
bio: [
  "I'm an Electrical and Computer Engineering graduate from UC San Diego, continuing into the M.S. program in Intelligent Systems, Robotics & Control in Fall 2026.",
  "My work spans agentic scientific workflows, perception, planning, control, and the long tail of failures that appear when software meets physical systems—calibration, latency, drift, execution mismatch, and traceability.",
  "I care about systems that are reliable enough to inspect, adapt, and hand to another person.",
],
```

Insert this experience as the first `profile.experience` item:

```js
{
  year: "Jul 2026 — Present",
  role: "Agentic AI Engineer Intern · AI for Science",
  org: "Bioyond Robotics",
  location: "Pudong, Shanghai, China · On-site",
  note:
    "Designing and developing an agentic AI platform for scientific workflow automation. Building modular planning, orchestration, validation and feedback workflows that translate scientific intent into executable, verifiable and adaptive laboratory processes—with emphasis on reliability, traceability and human oversight.",
},
```

Insert this skill group before `Robotics & Controls`:

```js
"Agentic AI & Workflow Systems": [
  "Agent workflows",
  "Planning and orchestration",
  "Validation and feedback loops",
  "Traceability",
  "Human oversight",
],
```

Convert the three `profile.socials` icon fields from imported React components to serializable names while keeping labels and URLs unchanged:

```js
socials: [
  { label: "GitHub", href: "https://github.com/Edwardwang66", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edwardwang123/",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:wanghanqing66@gmail.com", icon: "mail" },
],
```

Create `src/components/socialIcons.js` immediately so the still-monolithic Home/About views can render the serialized names:

```js
import { Github, Linkedin, Mail } from "lucide-react";

export const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};
```

Import `socialIcons` in `src/Portfolio.jsx`. At both existing social-icon render sites, resolve `const Icon = socialIcons[s.icon]` and render it only when defined. Remove the now-unused top-level `Github` and `Linkedin` imports; retain `Mail` because the current About contact row still uses it directly. This keeps the Task 2 smoke test renderable before SiteChrome/About extraction.

- [ ] **Step 5: Add normalized evidence metadata to each project**

Add these fields to project 01:

```js
homeEvidence: {
  kind: "image",
  src: "/ece191/2.png",
  alt: "Autonomous off-road vehicle during camera, GNSS, and actuation integration",
  caption: "Hardware integration for repeatable path following on recorded outdoor routes.",
  heading: "Perception, GNSS and actuation working as one loop.",
  width: 1086,
  height: 764,
  role: "landscape",
  fit: "cover",
},
leadEvidence: {
  kind: "image",
  src: "/ece191/2.png",
  alt: "Autonomous off-road vehicle during hardware integration",
  caption: "Camera, GNSS, onboard compute, and actuation integrated on the field platform.",
  width: 1086,
  height: 764,
  role: "landscape",
  fit: "contain",
},
selectedEvidence: [
  {
    kind: "image",
    src: "/ece191/1.png",
    alt: "Completed autonomous off-road vehicle with LiDAR and onboard enclosure",
    caption: "Completed platform with LiDAR and the onboard compute enclosure.",
    width: 804,
    height: 482,
    role: "landscape",
  },
  {
    kind: "image",
    src: "/ece191/3.png",
    alt: "Camera calibration feature tracks on a checkerboard display",
    caption: "Camera calibration and feature-track validation before field testing.",
    width: 954,
    height: 702,
    role: "technical",
  },
  {
    kind: "image",
    src: "/ece191/4.png",
    alt: "LiDAR point-cloud visualization captured from the vehicle",
    caption: "LiDAR point-cloud evidence captured from the moving platform.",
    width: 548,
    height: 326,
    role: "technical",
  },
],
moreEvidence: [],
```

Add these fields to project 02 and update its existing media sources to MP4:

```js
homeEvidence: {
  kind: "image",
  src: "/c12.ai/1-optimized.jpg",
  alt: "Robotic arms arranged around the automated laboratory workcell",
  caption: "Dual-camera localization and liquid measurement in a physical lab workflow.",
  heading: "Vision translated into reliable arm motion.",
  width: 900,
  height: 1600,
  role: "portrait",
  fit: "cover",
  position: "center 22%",
},
leadEvidence: {
  kind: "image",
  src: "/c12.ai/1-optimized.jpg",
  alt: "Automated laboratory workcell with multiple robotic arms",
  caption: "The physical workcell used for perception-to-motion integration.",
  width: 900,
  height: 1600,
  role: "portrait",
  fit: "cover",
  position: "center 20%",
},
selectedEvidence: [
  {
    kind: "video",
    src: "/c12.ai/IMG_1671.mp4",
    poster: "/c12.ai/1-optimized.jpg",
    caption: "Automated laboratory operation executed in the physical workcell.",
    width: 854,
    height: 480,
    role: "landscape",
  },
  {
    kind: "video",
    src: "/c12.ai/IMG_1672.mp4",
    poster: "/c12.ai/1-optimized.jpg",
    caption: "Robotic-arm execution after dual-camera pose refinement.",
    width: 854,
    height: 480,
    role: "landscape",
  },
],
moreEvidence: [],
```

Add these fields to project 03:

```js
homeEvidence: {
  kind: "image",
  src: "/ece276a/1.png",
  alt: "State-estimation trajectory and comparison plots",
  caption: "Representative comparisons across IMU tracking, mapping, and visual-inertial SLAM.",
  heading: "A readable result instead of three full report embeds.",
  width: 1866,
  height: 2266,
  role: "technical",
  fit: "contain",
},
leadEvidence: {
  kind: "image",
  src: "/ece276a/1.png",
  alt: "Comparison plots for state-estimation experiments",
  caption: "Representative estimation and mapping results across the course sequence.",
  width: 1866,
  height: 2266,
  role: "technical",
  fit: "contain",
},
selectedEvidence: [],
moreEvidence: [
  {
    kind: "pdf",
    src: "/ece276a/ece276_pr1.pdf",
    name: "PR1 — Pose Estimation",
    caption: "Full project report for the pose-estimation implementation and evaluation.",
    group: "Course reports",
  },
  {
    kind: "pdf",
    src: "/ece276a/pr2.pdf",
    name: "PR2 — Sensor Fusion",
    caption: "Full project report for the sensor-fusion experiments and comparisons.",
    group: "Course reports",
  },
  {
    kind: "pdf",
    src: "/ece276a/pr3_report.pdf",
    name: "PR3 — State Estimation",
    caption: "Full project report for the final state-estimation pipeline.",
    group: "Course reports",
  },
],
```

Add `homeEvidence: null`, `leadEvidence: null`, `selectedEvidence: []`, and `moreEvidence: []` to projects 04 and 06.

Add these fields to project 05:

```js
homeEvidence: {
  kind: "image",
  src: "/ece276b/pr1/doorkey-poster.png",
  alt: "DoorKey grid environment used for discrete planning",
  caption: "A selected DoorKey policy held near its native scale.",
  heading: "Planning evidence without an autoplay wall.",
  width: 256,
  height: 256,
  role: "low-resolution",
  fit: "contain",
},
leadEvidence: {
  kind: "image",
  src: "/ece276b/pr1/doorkey-poster.png",
  alt: "DoorKey planning environment poster",
  caption: "DoorKey environment used for discrete policy planning experiments.",
  width: 256,
  height: 256,
  role: "low-resolution",
  fit: "contain",
},
selectedEvidence: [
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partA/doorkey-5x5-normal.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "5 by 5 DoorKey policy animation",
    caption: "Value-iteration policy solving the 5×5 DoorKey environment.",
    width: 160,
    height: 160,
    role: "low-resolution",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partB/DoorKey-10x10-15.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "10 by 10 DoorKey episode 15 animation",
    caption: "A larger 10×10 run demonstrating planning behavior at increased scale.",
    width: 320,
    height: 320,
    role: "low-resolution",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E4_Single_Cube.gif",
    poster: "/ece276b/pr2/posters/E4_Single_Cube.png",
    alt: "Single Cube reinforcement-learning animation",
    caption: "A continuous-control run representing the reinforcement-learning project.",
    width: 600,
    height: 500,
    role: "low-resolution",
  },
],
moreEvidence: [
  {
    kind: "pdf",
    src: "/ece276b/pr1/report.pdf",
    name: "PR1 — Discrete Planning & MDPs",
    caption: "Complete report for value iteration and policy extraction in DoorKey.",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partA/doorkey.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "DoorKey planning environment overview animation",
    caption: "Overview run for the DoorKey planning environment.",
    width: 256,
    height: 256,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partA/doorkey-6x6-shortcut.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "6 by 6 DoorKey shortcut policy animation",
    caption: "Shortcut policy in the 6×6 DoorKey environment.",
    width: 192,
    height: 192,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partA/doorkey-8x8-direct.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "8 by 8 DoorKey direct-route policy animation",
    caption: "Direct-route policy in the 8×8 DoorKey environment.",
    width: 256,
    height: 256,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partA/doorkey-8x8-shortcut.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "8 by 8 DoorKey shortcut policy animation",
    caption: "Shortcut policy in the 8×8 DoorKey environment.",
    width: 256,
    height: 256,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partB/DoorKey-10x10-1.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "10 by 10 DoorKey episode 1 animation",
    caption: "Early policy behavior at episode 1 in the 10×10 environment.",
    width: 320,
    height: 320,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr1/gif/partB/DoorKey-10x10-5.gif",
    poster: "/ece276b/pr1/doorkey-poster.png",
    alt: "10 by 10 DoorKey episode 5 animation",
    caption: "Intermediate policy behavior at episode 5 in the 10×10 environment.",
    width: 320,
    height: 320,
    role: "low-resolution",
    group: "PR1 — Discrete planning",
  },
  {
    kind: "pdf",
    src: "/ece276b/pr2/ECE276B_PR2_report.pdf",
    name: "PR2 — Reinforcement Learning Across Environments",
    caption: "Complete report for policy-gradient experiments across seven environments.",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E1_Flappy_Bird.gif",
    poster: "/ece276b/pr2/posters/E1_Flappy_Bird.png",
    alt: "Flappy Bird reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Flappy Bird environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E2_Maze.gif",
    poster: "/ece276b/pr2/posters/E2_Maze.png",
    alt: "Maze reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Maze environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E3_Monza.gif",
    poster: "/ece276b/pr2/posters/E3_Monza.png",
    alt: "Monza reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Monza environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E5_Tower.gif",
    poster: "/ece276b/pr2/posters/E5_Tower.png",
    alt: "Tower reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Tower environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E6_Window.gif",
    poster: "/ece276b/pr2/posters/E6_Window.png",
    alt: "Window reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Window environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
  {
    kind: "gif",
    src: "/ece276b/pr2/gifs/E7_Room.gif",
    poster: "/ece276b/pr2/posters/E7_Room.png",
    alt: "Room reinforcement-learning animation",
    caption: "Policy-gradient behavior in the Room environment.",
    width: 600,
    height: 500,
    role: "low-resolution",
    group: "PR2 — Reinforcement learning",
  },
],
```

After all six projects have normalized evidence, remove every `cover`, `gallery`, and legacy `media` field. Preserve `links`, even when empty. The normalized arrays are the only media source read by Tasks 5 and 6.

- [ ] **Step 6: Port approved optimized assets and extract authentic GIF stills**

Run:

```bash
git restore --source=codex/portfolio-redesign -- public/c12.ai/1-optimized.jpg public/c12.ai/IMG_1671.mp4 public/c12.ai/IMG_1672.mp4 public/ece276b/pr1/doorkey-poster.png
```

Verify:

```bash
file public/c12.ai/1-optimized.jpg public/c12.ai/IMG_1671.mp4 public/c12.ai/IMG_1672.mp4 public/ece276b/pr1/doorkey-poster.png
```

Expected: JPEG, two ISO Media MP4 files, and PNG. Do not restore any JSX, CSS, Tailwind, or HTML file from the old branch.

Verify `ffmpeg` is available, then extract one non-animated first frame for every PR2 GIF so the player never substitutes an unrelated DoorKey image:

```bash
command -v ffmpeg
mkdir -p public/ece276b/pr2/posters
ffmpeg -y -i public/ece276b/pr2/gifs/E1_Flappy_Bird.gif -frames:v 1 public/ece276b/pr2/posters/E1_Flappy_Bird.png
ffmpeg -y -i public/ece276b/pr2/gifs/E2_Maze.gif -frames:v 1 public/ece276b/pr2/posters/E2_Maze.png
ffmpeg -y -i public/ece276b/pr2/gifs/E3_Monza.gif -frames:v 1 public/ece276b/pr2/posters/E3_Monza.png
ffmpeg -y -i public/ece276b/pr2/gifs/E4_Single_Cube.gif -frames:v 1 public/ece276b/pr2/posters/E4_Single_Cube.png
ffmpeg -y -i public/ece276b/pr2/gifs/E5_Tower.gif -frames:v 1 public/ece276b/pr2/posters/E5_Tower.png
ffmpeg -y -i public/ece276b/pr2/gifs/E6_Window.gif -frames:v 1 public/ece276b/pr2/posters/E6_Window.png
ffmpeg -y -i public/ece276b/pr2/gifs/E7_Room.gif -frames:v 1 public/ece276b/pr2/posters/E7_Room.png
file public/ece276b/pr2/posters/*.png
```

Expected: seven static 600×500 PNG files. These are mechanical first-frame extractions from authentic project media, not generated illustrations. If `ffmpeg` is unavailable, pause this step and install/locate the real binary; do not render the animated GIF to obtain a "poster" and do not reuse the DoorKey still for PR2.

- [ ] **Step 7: Update document metadata without changing font loading**

In `index.html`, set:

```html
<title>Edward Wang — Robotics, Agentic AI & AI for Science</title>
<meta
  name="description"
  content="Edward Wang builds intelligent systems across robotics, agentic scientific workflows, perception, planning, control, and real hardware."
/>
```

Keep the existing Google Fonts preconnects and Source Serif Pro + Inter request unchanged.

- [ ] **Step 8: Run content tests and build**

Run: `npm test -- src/data/portfolio.test.js src/Portfolio.smoke.test.jsx`

Expected: PASS, 4 tests total.

Run: `npm run build`

Expected: PASS. Because Vite copies `public/` files instead of adding them to the module graph, verify the copied outputs explicitly:

```bash
test -f dist/c12.ai/1-optimized.jpg
test -f dist/c12.ai/IMG_1671.mp4
test -f dist/c12.ai/IMG_1672.mp4
test -f dist/ece276b/pr1/doorkey-poster.png
test -f dist/ece276b/pr2/posters/E4_Single_Cube.png
```

Expected: all four commands exit 0.

- [ ] **Step 9: Commit content and approved assets**

```bash
git add src/data/portfolio.js src/data/portfolio.test.js src/components/socialIcons.js src/Portfolio.jsx index.html public/c12.ai/1-optimized.jpg public/c12.ai/IMG_1671.mp4 public/c12.ai/IMG_1672.mp4 public/ece276b/pr1/doorkey-poster.png public/ece276b/pr2/posters
git commit -m "content: add Bioyond and curated project evidence"
```

---

### Task 3: Extract the Original Shell and Add the Navigation Craft Layer

**Files:**

- Create: `src/hooks/useMediaPreference.js`
- Create: `src/hooks/useMediaPreference.test.jsx`
- Create: `src/components/SiteChrome.jsx`
- Create: `src/components/SiteChrome.test.jsx`
- Modify: `src/Portfolio.jsx` (baseline lines 1–22, 360–408, and 1099–1138)
- Modify: `src/Portfolio.smoke.test.jsx`
- Modify: `src/index.css`

**Interfaces:**

- `useMediaPreference(query) -> boolean`
- `socialIcons[name] -> Lucide component`, for `github | linkedin | mail`
- `<SiteChrome view onNavigate children />`, where `view` is `"home" | "project" | "about"`
- `onNavigate(nextView)` never accepts a URL and preserves the existing in-memory navigation model
- Root navigation remains `{ page: "home" | "about" | "project", id? }`; a lifecycle key of page plus project ID updates title, resets scroll once, and focuses the next view's `h1` without scrolling it

- [ ] **Step 1: Write independent media-preference tests**

Create `src/hooks/useMediaPreference.test.jsx` with a small probe component and these cases:

```jsx
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { setMediaQuery } from "../test/setup.js";
import { useMediaPreference } from "./useMediaPreference.js";

function Probe() {
  const motion = useMediaPreference("(prefers-reduced-motion: reduce)");
  const transparency = useMediaPreference(
    "(prefers-reduced-transparency: reduce)"
  );
  const contrast = useMediaPreference("(prefers-contrast: more)");
  return (
    <output>
      {String(motion)}:{String(transparency)}:{String(contrast)}
    </output>
  );
}

it("updates motion, transparency, and contrast independently", () => {
  render(<Probe />);

  act(() => setMediaQuery("(prefers-reduced-transparency: reduce)", true));
  expect(screen.getByText("false:true:false")).toBeInTheDocument();

  act(() => setMediaQuery("(prefers-contrast: more)", true));
  expect(screen.getByText("false:true:true")).toBeInTheDocument();

  act(() => setMediaQuery("(prefers-reduced-motion: reduce)", true));
  expect(screen.getByText("true:true:true")).toBeInTheDocument();
});
```

- [ ] **Step 2: Write the shell behavior tests**

Create `src/components/SiteChrome.test.jsx` and extend `src/Portfolio.smoke.test.jsx` to prove:

- the first focusable element is `Skip to content`, targeting `#main-content`;
- the shell wrapper is not a `<main>` and the mounted baseline page contributes exactly one `<main>` landmark;
- `Work` and `About` are buttons, the current section has `aria-current="page"`, and there is no `Get in touch` navigation control;
- the original circular `EW` mark and desktop `Edward Wang` label remain;
- the navigation changes from `data-scrolled="false"` to `data-scrolled="true"` only after `window.scrollY > 4`;
- Work remains current while a project detail is open;
- the initial StrictMode mount does not call `scrollTo` or move focus;
- a genuine page or project-ID change calls `window.scrollTo({ top: 0, left: 0, behavior: "auto" })` once, sets the correct document title, and focuses the new `h1` with `preventScroll`;
- pressing the EW mark returns to Work through `onNavigate("home")`.

Run: `npm test -- src/hooks/useMediaPreference.test.jsx src/components/SiteChrome.test.jsx src/Portfolio.smoke.test.jsx`

Expected: FAIL because the hook and extracted shell do not exist.

- [ ] **Step 3: Implement the reactive preference hook**

Create `src/hooks/useMediaPreference.js`:

```js
import { useEffect, useState } from "react";

function readPreference(query) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function useMediaPreference(query) {
  const [matches, setMatches] = useState(() => readPreference(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    if (media.addEventListener) media.addEventListener("change", update);
    else media.addListener(update);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", update);
      else media.removeListener(update);
    };
  }, [query]);

  return matches;
}
```

Do not combine the three preferences into one fallback flag.

Reuse `src/components/socialIcons.js` from Task 2. Both the footer and About page resolve the serializable `profile.socials[].icon` through this map; unknown keys render no icon but retain the descriptive link text.

- [ ] **Step 4: Extract `SiteChrome` without importing rejected visual code**

Move the original navigation and footer markup from `src/Portfolio.jsx` into `src/components/SiteChrome.jsx`. Preserve the original EW mark, desktop name, footer copy, social links, and legal line. Implement this structure and passive threshold listener:

```jsx
export default function SiteChrome({ view, onNavigate, children }) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 4);
  const reducedTransparency = useMediaPreference(
    "(prefers-reduced-transparency: reduce)"
  );
  const increasedContrast = useMediaPreference("(prefers-contrast: more)");
  const workIsCurrent = view === "home" || view === "project";

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 4;
      setScrolled((current) => (current === next ? current : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header
        className="site-nav"
        data-scrolled={scrolled}
        data-reduced-transparency={reducedTransparency}
        data-increased-contrast={increasedContrast}
      >
        <div className="site-nav-inner">
          <button
            type="button"
            className="brand-control compact-control"
            aria-label="Edward Wang — Work"
            onClick={() => onNavigate("home")}
          >
            <span className="brand-mark" aria-hidden="true">EW</span>
            <span className="brand-name">Edward Wang</span>
          </button>
          <nav aria-label="Primary" className="primary-nav">
            <button
              type="button"
              className="nav-control compact-control"
              aria-current={workIsCurrent ? "page" : undefined}
              onClick={() => onNavigate("home")}
            >Work</button>
            <button
              type="button"
              className="nav-control compact-control"
              aria-current={view === "about" ? "page" : undefined}
              onClick={() => onNavigate("about")}
            >About</button>
          </nav>
        </div>
      </header>
      <div id="main-content" tabIndex="-1">{children}</div>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {profile.name}. Built with care.</p>
        <ul aria-label="Social links">
          {profile.socials.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <li key={social.label}>
                <a href={social.href} aria-label={social.label}>
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  <span>{social.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </footer>
    </>
  );
}
```

Use semantic buttons for EW, Work, and About. Set `aria-current="page"` only on the current section. Do not copy `SiteChrome`, `HomePage`, CSS, or Tailwind code from `codex/portfolio-redesign`.

Keep the skip target as a neutral wrapper because the baseline Home, Project, and About functions already render their own `<main>` landmarks. Every extracted page continues to own exactly one `<main>`; never nest a page `<main>` inside a shell `<main>`.

- [ ] **Step 5: Make the root view lifecycle StrictMode-safe**

In `src/Portfolio.jsx`, keep the existing object state `{ page, id? }`, derive `selectedProject` from `view.id`, pass `view.page` to `SiteChrome`, and add a project-aware lifecycle key:

```jsx
const selectedProject =
  view.page === "project"
    ? projects.find((project) => project.id === view.id) ?? projects[0]
    : null;
const navigate = (page) => setView({ page });
const openProject = (project) =>
  setView({ page: "project", id: project.id });
const viewKey = selectedProject ? `project:${selectedProject.id}` : view.page;
const previousViewKeyRef = useRef(viewKey);

useEffect(() => {
  if (previousViewKeyRef.current === viewKey) return;
  previousViewKeyRef.current = viewKey;

  document.title = selectedProject
    ? `${selectedProject.title} — Edward Wang`
    : view.page === "about"
      ? "About — Edward Wang"
      : "Edward Wang — Robotics, Agentic AI & AI for Science";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const frame = window.requestAnimationFrame(() => {
    document.querySelector("#main-content h1")?.focus({ preventScroll: true });
  });
  return () => window.cancelAnimationFrame(frame);
}, [viewKey, view.page, selectedProject]);
```

Pass `navigate` to `SiteChrome` as `onNavigate`. The internal baseline Home/Project functions may keep their existing `go={setView}` adapter until Tasks 5 and 6 replace them; after those extractions, pass `openProject`/`navigate` and remove every raw `setView` prop from the component tree.

Every page `h1` added in later tasks gets `tabIndex="-1"`. On the current monolith, add it to the existing Home, Project, and About headings now. Preserve the initial document metadata from `index.html`; the effect must be inert on initial mount, including React StrictMode's development double invocation.

- [ ] **Step 6: Add the Original+ tokens and nav-only material**

Replace the minimal reset in `src/index.css` with a small token layer while keeping Tailwind utilities available:

```css
:root {
  color: #181817;
  background: #fff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-synthesis: none;
  --ink: #181817;
  --muted: #6f716d;
  --line: #dedfd9;
  --blue: #274d66;
  --gold: #a48645;
  --green: #58725d;
}

html { scroll-behavior: auto; }
body { margin: 0; min-width: 320px; background: #fff; }
button, a { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--blue); outline-offset: 4px; }
.font-serif { font-optical-sizing: auto; font-kerning: normal; }
```

Add component classes for:

- `.site-nav`: sticky 64–66px header, `background: rgba(255,255,255,.82)`, `backdrop-filter: blur(20px) saturate(1.35)`, and no permanent divider;
- `.site-nav[data-scrolled="true"]::after`: 12px lower edge fade after the 4px threshold;
- `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`: 96% opaque white and a subtle neutral lower border;
- `[data-reduced-transparency="true"]`: no blur, 96% white, and the same border, independent of motion;
- `[data-increased-contrast="true"]`: solid white, `#8b8d86` lower border, darker muted text;
- `.compact-control`: 44px minimum target and an 80–100ms transform/color transition;
- `.compact-control:active`: `transform: scale(.985)`; never apply it to project-row buttons;
- `.compact-control:focus-visible`: retains the deep-blue ring and applies the same immediate tonal response without scale, covering Enter/Space access;
- Source Serif Pro headings with `font-optical-sizing: auto`, `font-kerning: normal`, and restrained negative tracking only at display sizes.

Do not add global blur, gradients, cards, or a font-family replacement.

- [ ] **Step 7: Run focused and regression verification**

Run: `npm test -- src/hooks/useMediaPreference.test.jsx src/components/SiteChrome.test.jsx src/Portfolio.smoke.test.jsx`

Expected: PASS.

Run: `npm test && npm run build`

Expected: all tests and production build PASS; the current monolithic page still renders inside the extracted shell.

- [ ] **Step 8: Commit the shell**

```bash
git add src/hooks/useMediaPreference.js src/hooks/useMediaPreference.test.jsx src/components/SiteChrome.jsx src/components/SiteChrome.test.jsx src/Portfolio.jsx src/Portfolio.smoke.test.jsx src/index.css
git commit -m "feat: add original plus site shell"
```

---

### Task 4: Implement the Activation and Disclosure Motion Models

**Files:**

- Create: `src/lib/projectActivation.js`
- Create: `src/lib/projectActivation.test.js`
- Create: `src/motion/disclosureSpring.js`
- Create: `src/motion/disclosureSpring.test.js`
- Create: `src/hooks/useMobileProjectActivation.js`
- Create: `src/hooks/useMobileProjectActivation.test.jsx`
- Create: `src/hooks/useDisclosureSpring.js`
- Create: `src/hooks/useDisclosureSpring.test.jsx`

**Interfaces:**

- `chooseActiveProject({ ids, activeId, centersById, readingLine, direction, hysteresisPx }) -> id`
- `isTapLockActive({ startedAt, scrollY }, { now, scrollY, durationMs, releaseDistancePx }) -> boolean`
- `createDisclosureSpring(ids, initialActiveId, { responseSeconds }) -> { retarget, jumpTo, advance, get, isSettled }`
- `useMobileProjectActivation({ ids, activeId, onActivate, triggerNodes, panelNodes }) -> { noteManualActivation }`
- `useDisclosureSpring({ ids, activeId, reducedMotion }) -> { registerPanel, registerPanelContent }`

- [ ] **Step 1: Write exact mobile-selection boundary tests**

Create `src/lib/projectActivation.test.js` with fixtures whose trigger centers surround a `readingLine` of 320. Cover:

```js
expect(chooseActiveProject({
  ids: ["01", "02"],
  activeId: "01",
  centersById: new Map([["01", 384], ["02", 321]]),
  readingLine: 320,
  direction: 1,
  hysteresisPx: 64,
})).toBe("01"); // 63px closer is not enough

expect(chooseActiveProject({
  ids: ["01", "02"],
  activeId: "01",
  centersById: new Map([["01", 385], ["02", 321]]),
  readingLine: 320,
  direction: 1,
  hysteresisPx: 64,
})).toBe("02"); // exactly 64px closer switches
```

Also test missing centers, active trigger missing, equidistant candidates resolving down/up by direction, zero direction preserving document order, and never returning an ID outside `ids`.

For the tap lock, assert:

- 899ms is locked and 900ms is unlocked;
- 96px of scroll remains locked and 97px unlocks early;
- reverse-direction scroll uses absolute distance;
- a missing lock is inactive.

- [ ] **Step 2: Write deterministic spring tests before implementation**

Create `src/motion/disclosureSpring.test.js`. Prove:

- initial active value is 1 and every other value is 0;
- a 0.4s response moves the new target toward 1 and old target toward 0 without leaving `[0, 1]`;
- 18 irregular frame intervals totaling 300ms match one 300ms analytic advance within `1e-6`;
- retargeting midway preserves the current value and velocity, then converges to the new target;
- no target overshoots 0 or 1 after an interruption;
- `jumpTo` immediately yields one active value and zero inactive values;
- `isSettled()` becomes true only when position error is below `.001` and velocity magnitude below `.01`.

Run: `npm test -- src/lib/projectActivation.test.js src/motion/disclosureSpring.test.js`

Expected: FAIL because both modules are missing.

- [ ] **Step 3: Implement the pure activation model**

Create `src/lib/projectActivation.js` with `hysteresisPx = 64` in the destructured options. `chooseActiveProject` must:

1. discard non-finite or missing centers;
2. preserve `activeId` if there is no valid alternative;
3. find minimum absolute distance from trigger center to reading line;
4. resolve equal candidate distances using the adjacent item in `direction` (`1` down, `-1` up), then document order;
5. switch only when `currentDistance - candidateDistance >= hysteresisPx`;
6. if the current trigger is no longer measurable, select the nearest valid candidate immediately.

Implement the lock exactly:

```js
export function isTapLockActive(
  lock,
  { now, scrollY, durationMs = 900, releaseDistancePx = 96 }
) {
  if (!lock) return false;
  const withinTime = now - lock.startedAt < durationMs;
  const withinDistance = Math.abs(scrollY - lock.scrollY) <= releaseDistancePx;
  return withinTime && withinDistance;
}
```

- [ ] **Step 4: Implement the critically damped vector controller**

Create `src/motion/disclosureSpring.js` with public signature `createDisclosureSpring(ids, initialActiveId, { responseSeconds = 0.4 } = {})`. Reject a non-positive response with a descriptive `RangeError`. Store `{ value, velocity, target }` for every ID and use one controller for the whole archive. `advance(deltaSeconds)` accepts the complete elapsed interval so the analytic solution remains frame-rate independent and applies this critical-damping update to each unsettled state:

```js
const omega = (2 * Math.PI) / responseSeconds;
const displacement = value - target;
const coefficient = velocity + omega * displacement;
const decay = Math.exp(-omega * deltaSeconds);
let nextValue =
  target + (displacement + coefficient * deltaSeconds) * decay;
let nextVelocity =
  (velocity - omega * coefficient * deltaSeconds) * decay;

if ((target === 1 && nextValue >= 1) || (target === 0 && nextValue <= 0)) {
  nextValue = target;
  nextVelocity = 0;
}
```

`retarget(nextActiveId)` changes only targets and retains live value/velocity. `jumpTo(nextActiveId)` resets value/velocity synchronously. `get(id)` returns a copy, not the mutable record. Reject an unknown active ID with a descriptive `RangeError`.

- [ ] **Step 5: Write hook-level scheduling and no-scroll tests**

Create hook harnesses using `createRafClock()` and node maps. In `src/hooks/useMobileProjectActivation.test.jsx`, verify:

- the scroll listener is passive and coalesces multiple scroll events into one rAF measurement;
- the reading line passed to the pure model is `window.innerHeight * 0.42`;
- scroll direction is calculated from consecutive `scrollY` values;
- `noteManualActivation()` records current time and scroll position and blocks observer changes for 900ms or until more than 96px of scroll;
- the hook is inactive when `(max-width: 639px)` is false;
- if focus is inside the active panel, observer activation is held until focus leaves;
- unmount cancels the scheduled frame and removes listeners;
- neither hook calls `window.scrollTo`, `Element.prototype.scrollIntoView`, nor `preventDefault`.

In `src/hooks/useDisclosureSpring.test.jsx`, verify:

- one rAF is pending for the entire vector, not one per project;
- rapid A → B → A retargeting begins from the current inline height/opacity and preserves the model's live value and velocity;
- reduced motion calls `jumpTo`, leaves no rAF pending, and reaches the final hidden/visible state immediately;
- changing reduced motion from false to true while a spring is active cancels that rAF and settles immediately;
- a closing panel remains mounted and exposed for the visual transition, then receives `aria-hidden="true"`, `inert`, and `hidden` together after settling;
- activation removes `hidden`, `aria-hidden`, and `inert` before the first opening frame;
- settled active content uses `height: auto` so later responsive content changes are not clipped;
- resize or orientation change during motion cancels the frame, calls `jumpTo(activeId)`, restores the active panel to `height: auto`, and never briefly reveals a second panel;
- spies on `scrollHeight`/`getBoundingClientRect` show no layout read during frame advancement and a React probe shows no render per frame.

- [ ] **Step 6: Implement the two orchestration hooks**

`useMobileProjectActivation` must register one passive `scroll` listener and one `resize` listener while mobile. The scheduled frame reads each trigger's `getBoundingClientRect().top + height / 2`, calls the pure selector, and invokes `onActivate` only for a different ID. Store active ID, last scroll position, direction, and tap lock in refs so scroll frames do not cause React renders. Update the active-ID ref synchronously before calling `onActivate` so another scroll event cannot dispatch the same change before React commits. Do not observe expanding panel bounds.

`useDisclosureSpring` must:

- create exactly one `createDisclosureSpring` instance for `ids`;
- expose stable callback refs for each panel and its content wrapper;
- on target change, read each content wrapper's `scrollHeight` once, before starting the shared rAF;
- write only `height`, `opacity`, and an optional 2px `translateY` during animation;
- never read layout inside the frame loop;
- keep closing content mounted through the short visual transition and apply `aria-hidden`, `inert`, and `hidden` only after its value settles at 0;
- restore the active panel to `height: auto`, `opacity: 1`, and no transform after settling at 1;
- cancel the shared rAF on unmount;
- use `jumpTo(activeId)` when reduced motion is true;
- use the same immediate `jumpTo(activeId)` recovery for resize/orientation changes during an active spring, then return the active panel to `height: auto`.

The hook may cap a single browser-frame delta at `0.05s` before passing it to the controller after background-tab suspension; the pure controller itself must not truncate elapsed time.

Use the native `HTMLElement.inert` property and mirror it with an `inert` attribute for jsdom/browser consistency. The archive component in Task 5 remains responsible for `aria-expanded` and `aria-controls` on triggers.

- [ ] **Step 7: Run model and hook tests**

Run:

```bash
npm test -- src/lib/projectActivation.test.js src/motion/disclosureSpring.test.js src/hooks/useMobileProjectActivation.test.jsx src/hooks/useDisclosureSpring.test.jsx
```

Expected: PASS with no pending rAF callbacks after cleanup.

Run: `npm test && npm run build`

Expected: all tests and production build PASS.

- [ ] **Step 8: Commit the interaction foundation**

```bash
git add src/lib/projectActivation.js src/lib/projectActivation.test.js src/motion/disclosureSpring.js src/motion/disclosureSpring.test.js src/hooks/useMobileProjectActivation.js src/hooks/useMobileProjectActivation.test.jsx src/hooks/useDisclosureSpring.js src/hooks/useDisclosureSpring.test.jsx
git commit -m "feat: add interruptible project archive motion"
```

---

### Task 5: Build the Approved Homepage and Single-Open Project Archive

**Files:**

- Create: `src/components/Portrait.jsx`
- Create: `src/components/SafeImage.jsx`
- Create: `src/components/SafeImage.test.jsx`
- Create: `src/components/ProjectArchive.jsx`
- Create: `src/components/ProjectArchive.test.jsx`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/HomePage.test.jsx`
- Modify: `src/data/portfolio.js`
- Modify: `src/Portfolio.jsx` (baseline lines 412–544 and 1124–1138)
- Modify: `src/index.css`

**Interfaces:**

- `<SafeImage src alt width height className? style? fallbackLabel? loading? onError? />`
- `<Portrait size="hero" | "about" />`
- `<ProjectArchive projects onOpenProject />`
- `<HomePage onOpenProject />`
- `onOpenProject(project)` changes the existing root view to `{ page: "project", id: project.id }`

- [ ] **Step 1: Add the portrait record to the content contract**

Extend `profile` in `src/data/portfolio.js`:

```js
portrait: {
  src: "/IMG_9036.JPG",
  alt: "Portrait of Edward Wang",
  width: 1080,
  height: 1080,
},
```

Confirm the intrinsic dimensions with:

```bash
sips -g pixelWidth -g pixelHeight public/IMG_9036.JPG
```

Expected: `pixelWidth: 1080` and `pixelHeight: 1080`. If the checked-in file changes before execution, use the newly reported intrinsic values in data and tests; do not resize or replace the portrait in this task.

- [ ] **Step 2: Write `SafeImage` failure/reset tests**

Create `src/components/SafeImage.test.jsx` and prove:

- intrinsic `width`, `height`, `alt`, `loading`, and `decoding="async"` reach the image;
- `error` replaces the broken image with a neutral named fallback carrying `role="img"` and an accessible label;
- rerendering the same component with a different `src` clears the failure state and renders a real image again;
- rerendering back to the original `src` retries it rather than retaining stale failure state;
- `loading="eager"` is supported for the hero portrait and first expanded project image.

Run: `npm test -- src/components/SafeImage.test.jsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `SafeImage` with source-keyed state**

Create a source-keyed child so every source starts with clean error state:

```jsx
function ImageAttempt({
  fallbackLabel = "Image unavailable",
  className = "",
  style,
  onError,
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`media-fallback ${className}`.trim()}
        role="img"
        aria-label={`${imageProps.alt} — ${fallbackLabel}`}
        style={{ aspectRatio: `${imageProps.width} / ${imageProps.height}`, ...style }}
      >
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      {...imageProps}
      className={className}
      style={style}
      decoding="async"
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
    />
  );
}

export default function SafeImage(props) {
  return <ImageAttempt key={props.src} {...props} />;
}
```

Never replace a missing authentic asset with a decorative gradient or unrelated image.

- [ ] **Step 4: Write archive semantics and behavior tests**

Create `src/components/ProjectArchive.test.jsx` using the real normalized project data. Prove:

- six project trigger buttons render in approved order;
- only project 01 starts with `aria-expanded="true"`;
- every trigger's `aria-controls` equals its sibling panel ID and every panel's `aria-labelledby` points back to its trigger;
- `Open project` is an anchor inside the panel and never a descendant of the trigger button;
- clicking project 02 makes only 02 expanded and leaves focus on its trigger;
- clicking active project 02 again leaves it open;
- Enter and Space activate a different row without creating a zero-open state;
- the deactivated panel remains mounted during its close spring, then becomes `aria-hidden`, inert, and hidden after settling;
- project 04 and 06 active panels contain no `img`, `video`, fake media region, or gradient class, but retain outcome text and `Open project`;
- a declared failed homepage image renders its named fallback without changing active state;
- full-width triggers do not carry `.compact-control` or a transform style.

Add a mobile harness that enables `(max-width: 639px)`, supplies trigger rectangles, and proves downward and upward scroll activation, the 64px hysteresis, and the 900ms/96px tap-lock contract through the real archive.

- [ ] **Step 5: Write homepage hierarchy tests**

Create `src/pages/HomePage.test.jsx`. Assert the exact approved strings:

```jsx
expect(screen.getByText(
  "Pudong, Shanghai · Agentic AI Engineer Intern at Bioyond Robotics"
)).toBeInTheDocument();
expect(screen.getByText("Robotics · Agentic AI · AI for Science")).toBeInTheDocument();
expect(screen.getByRole("heading", {
  level: 1,
  name: "I build intelligent systems that carry intent into reliable execution.",
})).toBeInTheDocument();
expect(screen.getByText(
  "Working across agentic scientific workflows, perception, planning, control and real hardware—where reliability, traceability and human oversight matter."
)).toBeInTheDocument();
```

Also assert:

- the green status dot is present but `aria-hidden`;
- `Selected work` and `Current practice` are anchors to real section IDs;
- the hero portrait uses the approved source/alt and is not inside a card or separate identity panel;
- current practice contains the exact date, location, company, role, and summary;
- current practice precedes the selected-work section in DOM order;
- the homepage contains one `h1` with `id="home-title"` and `tabIndex="-1"`;
- opening a project calls `onOpenProject` with that complete project object.

Run: `npm test -- src/components/ProjectArchive.test.jsx src/pages/HomePage.test.jsx`

Expected: FAIL because the extracted homepage does not exist.

- [ ] **Step 6: Implement the portrait edge treatment**

Create `src/components/Portrait.jsx` around `SafeImage` and `profile.portrait`. Render one semantic `<figure>` with no caption plate. The figure gets only:

- `data-size="hero"` or `data-size="about"`;
- one image with `object-position: center 32%` unless visual QA proves the face crop requires a small adjustment;
- one `aria-hidden` 28px bottom-right blue edge rule;
- the gold 1px inner line through CSS, not a second DOM ornament.

Use the same portrait component on Home and About. Do not create crop marks, backing plates, labels, glow, or multiple corners.

- [ ] **Step 7: Implement the semantic archive with one active ID**

In `ProjectArchive.jsx`:

```jsx
const [activeId, setActiveId] = useState(projects[0].id);
const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");
```

Keep trigger and panel nodes in `Map` refs. Connect them to `useDisclosureSpring` and `useMobileProjectActivation`. Use separate callbacks:

- `activateFromTrigger(id)`: set the ID only when different, call `noteManualActivation()`, and never blur or move focus;
- `activateFromObserver(id)`: set the ID only when different and never create a tap lock.

Render each item as:

```jsx
<article className="project-archive-item" data-project-id={project.id}>
  <button
    id={`project-trigger-${project.id}`}
    type="button"
    className="project-archive-trigger"
    data-project-trigger
    data-project-id={project.id}
    aria-expanded={activeId === project.id}
    aria-controls={`project-panel-${project.id}`}
    onClick={() => activateFromTrigger(project.id)}
  >
    <span className="project-index">{project.no}</span>
    <span className="project-trigger-copy">
      <span className="project-title font-serif">{project.title}</span>
      <span className="project-role">{project.role}</span>
    </span>
    <span className="project-year">{project.year}</span>
    <ArrowRight className="project-state-arrow" aria-hidden="true" />
  </button>
  <div
    id={`project-panel-${project.id}`}
    role="region"
    aria-labelledby={`project-trigger-${project.id}`}
  >
    <div className="project-panel-content">
      {project.homeEvidence ? (
        <figure data-media-role={project.homeEvidence.role}>
          <SafeImage
            src={project.homeEvidence.src}
            alt={project.homeEvidence.alt}
            width={project.homeEvidence.width}
            height={project.homeEvidence.height}
            loading={project.no === "01" ? "eager" : "lazy"}
            style={{
              objectFit: project.homeEvidence.fit,
              objectPosition: project.homeEvidence.position,
            }}
            fallbackLabel={`${project.title} image unavailable`}
          />
          <figcaption>{project.homeEvidence.caption}</figcaption>
        </figure>
      ) : null}
      <p className="evidence-label">
        {project.homeEvidence ? "Selected evidence" : "Project note"}
      </p>
      <h3 className="font-serif">
        {project.homeEvidence?.heading ?? project.outcome}
      </h3>
      <p>{project.summary}</p>
      <a
        href={`#project-${project.id}`}
        onClick={(event) => {
          event.preventDefault();
          onOpenProject(project);
        }}
      >
        Open project <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  </div>
</article>
```

Use `homeEvidence.heading` when present and `project.outcome` for text-only projects. `Open project` uses `href={`#project-${project.id}`}` and prevents the default hash change before calling `onOpenProject(project)`; it remains a genuine anchor for keyboard and assistive semantics. Do not nest it in the trigger.

- [ ] **Step 8: Implement the approved Home page**

Create `src/pages/HomePage.jsx` with one root `<main aria-labelledby="home-title">` in this DOM order:

1. hero status, positioning, `h1`, supporting copy, two anchor actions, and hero `Portrait`;
2. `<section id="current-practice">` as a ruled editorial record, not a card;
3. `<section id="selected-work">` containing the archive.

Use the exact copy in the content contract. Preserve the quiet green status pulse, but stop it under reduced motion using a CSS media query. The Home page must not contain a large contact CTA; the original footer retains contact access.

Replace the internal `Home` function in `src/Portfolio.jsx` with the imported page. Keep Project and About internal until their extraction tasks.

- [ ] **Step 9: Add the responsive Original+ homepage styling**

In `src/index.css`, add focused component classes with these hard limits:

- main shell max width 1024px with 16px gutters below 640px, 24px at intermediate widths, and 40px on desktop;
- hero desktop rhythm 96–128px, serif `h1` 56–64px wide, 42–48px tablet, 36–44px mobile;
- hero portrait 184–220px desktop and 112–144px mobile, 15–20px radius;
- portrait shadow no stronger than `0 20px 38px rgba(23,42,54,.13), 0 3px 9px rgba(24,24,23,.06)`;
- gold inner line at 28% opacity and one blue 28px rule at 42% opacity;
- current practice as a two-column text record with thin neutral rules, collapsing to one column on mobile;
- archive trigger minimum 64px desktop / 72px mobile, neutral dividers, a 90ms tonal/active-number response, and no scale transform;
- `.project-state-arrow` moves at most 2px on the expanded row and never changes row geometry;
- expanded homepage media maximum 520×280px desktop, 420×230px tablet, and available width × 220px mobile;
- portrait and technical evidence use their `role`/`fit` metadata; low-resolution media uses an inline `max-width` capped at `width * 1.25`;
- blue/gold limited to small labels, active index, focus, the portrait line, and dividers; no large colored surfaces.

Do not set scroll snap, smooth scrolling, fixed drawer heights, or a transition on `all`.

- [ ] **Step 10: Verify the complete homepage**

Run:

```bash
npm test -- src/components/SafeImage.test.jsx src/components/ProjectArchive.test.jsx src/pages/HomePage.test.jsx src/Portfolio.smoke.test.jsx
npm test
npm run build
```

Expected: all tests and the production build PASS. In the rendered DOM, exactly one trigger reports `aria-expanded="true"` at every tested state.

- [ ] **Step 11: Commit the homepage**

```bash
git add src/components/Portrait.jsx src/components/SafeImage.jsx src/components/SafeImage.test.jsx src/components/ProjectArchive.jsx src/components/ProjectArchive.test.jsx src/pages/HomePage.jsx src/pages/HomePage.test.jsx src/data/portfolio.js src/Portfolio.jsx src/index.css
git commit -m "feat: build the original plus project archive"
```

---

### Task 6: Rebuild Project Details as Curated Technical Journals

**Files:**

- Create: `src/components/ProjectMedia.jsx`
- Create: `src/components/ProjectMedia.test.jsx`
- Create: `src/pages/ProjectPage.jsx`
- Create: `src/pages/ProjectPage.test.jsx`
- Modify: `src/Portfolio.jsx` (baseline lines 548–883 and 1124–1138)
- Modify: `src/index.css`
- Remove: `public/c12.ai/1.JPG`
- Remove: `public/c12.ai/IMG_1671.mov`
- Remove: `public/c12.ai/IMG_1672.mov`

**Interfaces:**

- `<ProjectMedia evidence projectTitle priority? />` dispatches normalized `image | video | gif | pdf` and names any failed-media fallback with the project title
- `<MoreEvidence evidence projectTitle />` groups descriptors by `group`; an all-PDF archive exposes normal links immediately while every preview remains lazy
- `<ProjectPage project nextProject onBack onOpenProject />`
- `onBack()` returns to Work; project switching remains a root-state concern

- [ ] **Step 1: Write media lifecycle tests**

Create `src/components/ProjectMedia.test.jsx` and prove:

- image evidence delegates to `SafeImage` with intrinsic dimensions, alt, caption, role, and fit;
- a failed image or GIF poster fallback includes the owning project title and never appears for an intentionally text-only project;
- video evidence renders `controls`, `playsInline`, `preload="metadata"`, width/height, and poster but never `autoPlay`, `muted`, or a play-on-mount effect;
- GIF evidence initially has no DOM node whose `src` is the `.gif`; it shows the descriptor's authentic static poster in the declared aspect ratio, with a named fallback only if that poster fails;
- clicking `Play animation` mounts the GIF exactly once and changes the control to `Stop animation`; stopping unmounts the GIF and restores the static state;
- a PDF always exposes a normal `<a target="_blank" rel="noreferrer">` open link;
- `Preview report` mounts a titled `<iframe loading="lazy">` only after activation, and `Hide preview` unmounts it;
- an all-PDF `More evidence` index exposes normal report links immediately but initially renders no iframe;
- a mixed/GIF `More evidence (N)` archive initially renders no GIF, iframe, video, or extra image evidence nodes, then mounts the grouped archive on request;
- a second close unmounts the archive instead of only hiding it with CSS.

Run: `npm test -- src/components/ProjectMedia.test.jsx`

Expected: FAIL because the media dispatcher does not exist.

- [ ] **Step 2: Write the project-journal order tests**

Create `src/pages/ProjectPage.test.jsx` and test representative projects 01, 03, 04, and 05. Assert:

- `Back to Work` and the project number/context/year/tags eyebrow precede one focusable project-title `h1` with `id="project-title"`; summary and compact facts follow the `h1`;
- when authentic media exists, lead evidence appears before the prose sections;
- section headings are exactly `Context`, `Challenge`, `Contribution`, and `Outcome`, in that DOM order;
- `Contribution` renders the existing `project.approach` copy without rewriting claims;
- `Outcome` precedes `Selected evidence` and `More evidence`;
- selected evidence never exceeds three plates and each has a visible caption;
- project 03 shows the lead figure plus three always-visible report links, but zero iframes until preview is requested;
- project 04 contains no lead, selected-evidence, more-evidence, image, video, iframe, or fake placeholder section;
- project 05 exposes three selected evidence items and a collapsed archive containing the remaining reports/GIFs;
- `Tools and technologies` follows all evidence and renders the complete stack as editorial text;
- `Next project` is always present, wraps from 06 to 01, and calls `onOpenProject(nextProject)` without leaving the state-navigation model;
- `Back to Work` calls `onBack` and uses the existing state-navigation contract.

- [ ] **Step 3: Implement the normalized media dispatcher**

Create `ProjectMedia.jsx` with focused internal components:

- `ImageEvidence` wraps `SafeImage` in a `<figure>`, passes `${projectTitle} image unavailable` as the fallback label, and always renders `<figcaption>`;
- `VideoEvidence` renders a stable intrinsic-ratio frame and native controls only;
- `GifEvidence` reserves the declared width/height, renders the required authentic poster through `SafeImage`, and sets `.gif` `src` only after the play button is activated;
- `PdfEvidence` renders the open link first and keeps preview state local;
- `MoreEvidence` groups by descriptor `group`, passes `projectTitle` into every media dispatcher, and names fallback states consistently. If every descriptor is a PDF, render the descriptive open links and local preview controls immediately while leaving every iframe unmounted. Otherwise render the count in `More evidence (N)` and conditionally mount the entire mixed/GIF archive body.

Apply `data-media-role={evidence.role}` and `data-media-kind={evidence.kind}` to the figure. Do not infer a different crop from file extension. A failed GIF poster gets the neutral named fallback and must never be replaced with the DoorKey poster for unrelated reinforcement-learning media.

- [ ] **Step 4: Implement the technical-journal Project page**

Create `src/pages/ProjectPage.jsx` with one root `<main aria-labelledby="project-title">` in this exact order:

1. `Back to Work` compact control;
2. two-digit project number, context, year, and tags;
3. focusable serif `h1`;
4. project summary;
5. compact facts row with Role, Year, a primary Stack value using the first three items plus `+N` when needed, and external Links when present;
6. `leadEvidence` when non-null, passed to `ProjectMedia` with `project.title`;
7. `Context` using `overview`;
8. `Challenge` using `challenge`;
9. `Contribution` using `approach`;
10. `Outcome` using `outcome`;
11. `Selected evidence` when the array is non-empty, with `project.title` passed to every `ProjectMedia`;
12. `MoreEvidence` when the array is non-empty, with `project.title` passed as `projectTitle`;
13. `Tools and technologies` as the one restrained list of the complete stack;
14. `Next project` as a normal anchor wired to `onOpenProject(nextProject)`.

Text-only projects omit steps 6, 11, and 12 entirely. Preserve every existing project claim and link from normalized data; do not invent metrics. In `src/Portfolio.jsx`, derive `nextProject` from the selected project's index with modulo wraparound and replace the internal `ProjectDetail` function with this page.

- [ ] **Step 5: Add role-specific media and journal styling**

In `src/index.css`, enforce:

- prose measure approximately 680–720px;
- landscape lead/evidence maximum 720×440px;
- portrait media maximum 360×520px;
- technical media maximum 720px wide using `object-fit: contain`;
- mobile lead media maximum 50vh;
- low-resolution media inline maximum supplied by JSX as `Math.round(evidence.width * 1.25)` pixels and never stretched to the prose width;
- selected evidence as a vertical sequence with 56–72px gaps, not a dense gallery grid;
- captions 12–13px with readable contrast and no overlay;
- PDF preview at a bounded 680×720px desktop and 70vh mobile, mounted only on demand;
- the same `.compact-control` pointer-down treatment for Back, play, preview, and archive triggers;
- no autoplay indicators, glass surfaces, gradients, full-bleed imagery, or sticky story panels.

Set `style={{ "--media-max": `${Math.round(evidence.width * 1.25)}px` }}` on low-resolution figures and use `max-width: min(100%, var(--media-max))`; keep the declared width/height attributes unchanged.

- [ ] **Step 6: Verify references before removing superseded files**

Run:

```bash
rg -n "1\\.JPG|IMG_1671\\.mov|IMG_1672\\.mov|coverImage|project\.media|project\.gallery" src public --glob '!public/c12.ai/1.JPG'
```

Expected: no source reference to old MOV/JPG paths or legacy media fields. Then remove only the three superseded files:

```bash
git rm public/c12.ai/1.JPG public/c12.ai/IMG_1671.mov public/c12.ai/IMG_1672.mov
```

Do not remove `public/IMG_9036.JPG`, any report, GIF, or original ECE evidence asset.

- [ ] **Step 7: Run media and project regression tests**

Run:

```bash
npm test -- src/components/ProjectMedia.test.jsx src/pages/ProjectPage.test.jsx src/components/SafeImage.test.jsx src/data/portfolio.test.js
npm test
npm run build
test -f dist/c12.ai/1-optimized.jpg
test -f dist/c12.ai/IMG_1671.mp4
test -f dist/c12.ai/IMG_1672.mp4
```

Expected: all tests/build/checks PASS and the old MOV/JPG files are absent from `dist/c12.ai`.

- [ ] **Step 8: Commit the project journals and media migration**

```bash
git add src/components/ProjectMedia.jsx src/components/ProjectMedia.test.jsx src/pages/ProjectPage.jsx src/pages/ProjectPage.test.jsx src/Portfolio.jsx src/index.css public/c12.ai
git commit -m "feat: curate project journals and media"
```

---

### Task 7: Rebuild About Around the Expanded Practice

**Files:**

- Create: `src/pages/AboutPage.jsx`
- Create: `src/pages/AboutPage.test.jsx`
- Modify: `src/Portfolio.jsx` (baseline lines 898–1095 and 1124–1138)
- Modify: `src/index.css`

**Interfaces:**

- `<AboutPage />` consumes `profile`, `Portrait`, and maps the serializable profile icon names through `socialIcons`
- The root renders `<AboutPage />` when `view === "about"`; the page has no private copy of profile data

- [ ] **Step 1: Write the About content and structure test**

Create `src/pages/AboutPage.test.jsx`. Assert:

- one focusable Source Serif Pro `h1` with `id="about-title"`, using `profile.aboutHeading`, with exact text `I'm Edward Wang. I work across robotics, Agentic AI, and AI for Science.`;
- the compact shared portrait uses `/IMG_9036.JPG`, the approved alt, and `data-size="about"`;
- all three approved bio paragraphs render in their stored order;
- Bioyond is the first experience and includes exact role, date, location, and this approved summary:

```text
Designing and developing an agentic AI platform for scientific workflow automation. Building modular planning, orchestration, validation and feedback workflows that translate scientific intent into executable, verifiable and adaptive laboratory processes—with emphasis on reliability, traceability and human oversight.
```

- Liangfang Zhang Lab and c12.ai follow Bioyond in that order;
- all three education records, all coursework groups, both languages, phone, email, and three social links remain reachable;
- `Agentic AI & Workflow Systems` precedes `Robotics & Controls` and contains its five exact approved items;
- skill items render as semantic text lists, with no pill/tag class on the list items;
- external social links have descriptive accessible names and `rel="noreferrer"` where they open a new tab;
- there is no portrait glow, gradient class, résumé-card wrapper, or large contact CTA.

Run: `npm test -- src/pages/AboutPage.test.jsx`

Expected: FAIL because the extracted page does not exist.

- [ ] **Step 2: Implement the editorial About page**

Create `src/pages/AboutPage.jsx` with one root `<main aria-labelledby="about-title">` in this order:

1. opening copy and `<Portrait size="about" />`;
2. `Education`;
3. `Experience`;
4. `Capabilities` from `profile.skills`;
5. `Selected coursework`;
6. `Languages`;
7. `Contact`.

Use ruled editorial rows and readable text measure rather than cards. Render each skill group as a heading plus comma-separated semantic `<ul>`/`<li>` text list. Resolve social icons through `socialIcons`; visible text remains even if an icon is unavailable. Keep the original email and phone as `mailto:`/`tel:` links.

Replace the internal `About` function in `src/Portfolio.jsx` with the imported page. Delete the now-unused `classNames` helper and all Lucide imports from `Portfolio.jsx`. After this extraction, `Portfolio.jsx` should contain only React lifecycle/state imports, data/page/chrome imports, root state, navigation callbacks, selected/next-project derivation, view lifecycle, and page composition.

- [ ] **Step 3: Add controlled About styling**

In `src/index.css`, enforce:

- opening copy maximum 60–70 characters per line;
- About portrait 180–240px desktop and 128–160px mobile;
- the exact shared gold inner line, single blue edge rule, and shadow ceiling from Home;
- 88–112px major desktop section gaps and responsive `clamp()` spacing;
- experience and education rows as hairline-separated text, never floating cards;
- skills as editorial text lists without colored chips or dense tag fields;
- body text 16–18px at approximately 1.55–1.7 line height;
- contact links with deep-blue focus/hover only, preserving neutral page dominance;
- no mobile portrait wider than 160px and no horizontal overflow at 320px.

- [ ] **Step 4: Verify the final three-view component structure**

Run:

```bash
npm test -- src/pages/AboutPage.test.jsx src/Portfolio.smoke.test.jsx src/components/SiteChrome.test.jsx
npm test
npm run build
```

Expected: all tests and production build PASS. `rg -n "function (Home|ProjectDetail|About)|classNames|lucide-react" src/Portfolio.jsx` returns no matches, and `Portfolio.jsx` has no JSX for project media or About sections.

- [ ] **Step 5: Commit About and root composition**

```bash
git add src/pages/AboutPage.jsx src/pages/AboutPage.test.jsx src/Portfolio.jsx src/index.css
git commit -m "feat: update about for agentic ai practice"
```

---

### Task 8: Add Production-Preview Browser Verification and Gate Deployment

**Files:**

- Create: `playwright.config.js`
- Create: `e2e/helpers.js`
- Create: `e2e/home-project-index.spec.js`
- Create: `e2e/project-media.spec.js`
- Create: `e2e/accessibility-preferences.spec.js`
- Create: `e2e/responsive.spec.js`
- Modify: `.gitignore`
- Modify: `.github/workflows/static.yml`
- Modify: `src/components/ProjectArchive.jsx`

**Interfaces:**

- Playwright always starts a fresh production preview at `http://127.0.0.1:4173`
- Browser helpers produce assertions, not application mutations
- CI `verify` runs for pull requests, `main` pushes, and manual dispatch; `deploy` runs only after `verify` for a `main` push or a manual dispatch whose selected ref is `main`

- [ ] **Step 1: Create a non-reusing production-preview configuration**

Create `playwright.config.js`:

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

Append to `.gitignore`:

```gitignore
playwright-report/
test-results/
```

Run: `npm run test:e2e -- --list`

Expected: FAIL or report zero tests because the E2E files do not exist yet; the preview command must not attach to an existing server.

- [ ] **Step 2: Add reusable browser assertions**

Create `e2e/helpers.js` with named exports:

```js
export async function expandedProjectIds(page) {
  return page.locator("[data-project-trigger]").evaluateAll((triggers) =>
    triggers
      .filter((trigger) => trigger.getAttribute("aria-expanded") === "true")
      .map((trigger) => trigger.dataset.projectId)
  );
}

export async function expectNoHorizontalOverflow(page, expect) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

export async function expectEditorialFonts(page, expect) {
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      serif: document.fonts.check('32px "Source Serif Pro"'),
      sans: document.fonts.check('16px "Inter"'),
    };
  });
  expect(loaded).toEqual({ serif: true, sans: true });
}
```

Also export:

- `installProgrammaticScrollSpy(page)`, which wraps `window.scrollTo` and `Element.prototype.scrollIntoView`, records application calls in `window.__programmaticScrollCalls`, and preserves originals;
- `projectTriggerCenter(page, id)` and `readingLine(page)` for user-wheel positioning;
- `mediaBox(locator)` for role-specific width/height assertions;
- `waitForDisclosureSettled(page, id)` which polls the panel's inline height/hidden state rather than using an arbitrary long sleep.

Tests may use `page.mouse.wheel` and real clicks after installing the spy. They may not call the wrapped programmatic-scroll APIs after the spy is installed, so any recorded call belongs to application behavior.

- [ ] **Step 3: Write desktop and mobile archive E2E tests**

Create `e2e/home-project-index.spec.js` with four tests:

1. **Desktop click and keyboard:** at 1440×1000, assert project 01 is the sole active ID; click 02; click 02 again; focus 03 and press Enter; focus 04 and press Space. After every input, assert exactly one active ID and focus remains on the activated trigger.
2. **Immediate press and stable row geometry:** hold pointer-down on Work and verify by the next rAF that computed transform is scaled below 1; release and verify it settles. Hold pointer-down on a project row and assert its bounding box does not change and transform remains `none`; verify its background/active-number tone changes instead. Focus Work and press Space to confirm the deep-blue focus/tonal feedback without geometric scale.
3. **Interruptible A → B → A:** activate 02, wait 80ms, reactivate 01, and sample both panels until settled. Assert input is accepted immediately, values remain finite, neither panel exceeds its measured content height, no bounce crosses the `[0, contentHeight]` bounds, and 01 finishes as the sole open panel.
4. **Natural mobile sequence and tap lock:** at 390×844, position the archive before installing the scroll spy, then use only `page.mouse.wheel` to move trigger centers through the 42% reading line. Assert sequential downward and upward activation, focus-hold behavior while `Open project` is focused, a manual tap surviving the short lock, and no recorded `scrollTo`/`scrollIntoView` call. Exact 63/64px, 96/97px, and 899/900ms boundaries remain covered by unit tests; E2E proves the integrated behavior under native scroll.

Give every archive trigger `data-project-trigger` and `data-project-id`; give the archive root `data-reduced-motion={reducedMotion}` so preference E2E can observe the actual hook input without inferring it from animation timing.

- [ ] **Step 4: Write media behavior and size E2E tests**

Create `e2e/project-media.spec.js` with these cases:

- intercept `/ece191/2.png` before navigation and verify the named neutral failure fallback, then remove the route and reload to prove the real image can recover;
- open project 02 and assert both MP4 elements have native controls, `playsInline`, `preload="metadata"`, stable `width`/`height`, `autoplay === false`, and `paused === true` after load;
- open project 05 and assert no selected `.gif` URL exists in an image `src` before activation, then Play/Stop one item and verify mount/unmount;
- assert project 05 low-resolution DoorKey media is no wider than 320px (`256 × 1.25`) and its 160×160 selected GIF is no wider than 200px at desktop size;
- open project 03 and assert three report links exist while zero iframes exist, then preview one report and assert exactly one titled iframe mounts;
- expand project 05 `More evidence`, verify the remaining runs and two reports become reachable, collapse it, and verify the dynamic media nodes unmount;
- inspect landscape, portrait, technical, and mobile lead boxes against the 720×440, 360×520, 720px, and 50vh limits;
- open projects 04 and 06 and assert no media/fallback container is rendered.

- [ ] **Step 5: Write accessibility and independent preference E2E tests**

Create `e2e/accessibility-preferences.spec.js`:

- keyboard from the skip link through nav, hero actions, project triggers, panel link, footer, About content, and Back/Next controls; every focused control has a visible outline and no focus is stolen on disclosure change;
- semantic relationship checks for `aria-expanded`, `aria-controls`, `aria-labelledby`, post-settle inert/hidden content, and the normal PDF/open-project links;
- a reduced-motion context via `page.emulateMedia({ reducedMotion: "reduce" })`: archive reports `data-reduced-motion="true"`, switching is immediate, and transparency/contrast data attributes remain false;
- a reduced-transparency context using Chromium CDP before navigation:

```js
const session = await context.newCDPSession(page);
await session.send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-reduced-transparency", value: "reduce" },
  ],
});
```

  Assert nav `data-reduced-transparency="true"`, computed backdrop filter is `none`, background is opaque/near-opaque white, and contrast remains false.
- an increased-contrast context via `page.emulateMedia({ contrast: "more" })`: assert `data-increased-contrast="true"`, a defined lower border and dark muted text, while reduced transparency remains false.

Create a fresh browser context for each preference so no emulation state leaks. The reduced-transparency test is mandatory. If pinned Chromium rejects that CDP media feature, create a new context and install this deterministic matchMedia override before the page is created, then run the same computed-style assertions:

```js
await context.addInitScript(() => {
  const nativeMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query) => {
    if (query !== "(prefers-reduced-transparency: reduce)") {
      return nativeMatchMedia(query);
    }
    return {
      media: query,
      matches: true,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => true,
    };
  };
});
```

Do not skip the E2E case and do not substitute reduced motion as a proxy; record whether CDP or the deterministic initialization path supplied the preference.

- [ ] **Step 6: Write four-viewport responsive E2E tests**

Create `e2e/responsive.spec.js` with a table for:

```js
[
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
]
```

At every size, verify no horizontal overflow, Source Serif Pro + Inter loaded, one visible `h1`, one active project, touch targets at least 44px where applicable, and the portrait/image limits. At mobile sizes additionally verify the portrait is at most 160px on About, homepage evidence is at most 220px high, and the hero portrait does not dominate the first viewport. At desktop sizes verify net content width is approximately 944px inside a 1024px shell and major media remains intentionally narrower than the shell.

- [ ] **Step 7: Run the browser suite locally**

Run:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected: production build PASS, a fresh preview starts on strict port 4173, and all Chromium tests PASS. If port 4173 is occupied, stop and identify the owning process; do not set `reuseExistingServer: true`.

- [ ] **Step 8: Split verification from deployment**

Replace `.github/workflows/static.yml` with:

```yaml
name: Verify and deploy portfolio

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: "pages-${{ github.ref }}"
  cancel-in-progress: false

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Unit tests
        run: npm test
      - name: Install Chromium
        run: npx playwright install --with-deps chromium
      - name: Production browser tests
        run: npm run test:e2e
      - name: Upload Pages artifact
        if: github.event_name == 'push' || (github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main')
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - name: Upload browser failures
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
          if-no-files-found: ignore

  deploy:
    if: github.event_name == 'push' || (github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main')
    needs: verify
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

This keeps write permissions out of pull-request verification, prevents manual runs from a non-main ref from deploying, and prevents deployment after any unit/build/browser failure.

- [ ] **Step 9: Re-run all gates and commit browser verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: all commands PASS with no whitespace errors.

```bash
git add playwright.config.js e2e .gitignore .github/workflows/static.yml src/components/ProjectArchive.jsx
git commit -m "test: verify original plus in production preview"
```

---

### Task 9: Perform Final Visual Acceptance and Contract Audit

**Files:**

- Verify: every file in this plan
- Modify only if acceptance reveals a defect: `src/index.css`, affected component/page, and its focused test

- [ ] **Step 1: Run the complete automated acceptance suite from clean dependencies**

Run:

```bash
npm ci
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Audit forbidden remnants and media references**

Run each query separately and inspect every match:

```bash
rg -n "B3|folio-frame|archive-rail|shadow-2xl|from-.*to-|autoPlay|scroll-snap|scrollIntoView|Framer Motion|framer-motion" src
rg -n "1\\.JPG|IMG_1671\\.mov|IMG_1672\\.mov|coverImage|project\.media|project\.gallery" src index.html
rg -n "backdrop-filter|backdrop-blur" src
rg -n "TODO|FIXME|TBD|placeholder" src e2e --glob '!*.test.*' --glob '!*.spec.*'
```

Expected:

- first and second queries return no rejected visual, autoplay, programmatic-observer-scroll, old-media, or legacy-field matches;
- the only permitted `scrollIntoView` text is the E2E spy and unit assertion, never application code;
- every application `backdrop-filter`/blur match belongs to `.site-nav` or its explicit fallbacks;
- the placeholder query returns no unfinished implementation marker;
- no project 04/06 fake media container exists.

- [ ] **Step 3: Verify the plan's acceptance matrix**

Create a temporary checklist in the task notes, not a repository file, mapping each specification contract to evidence:

| Contract | Evidence |
| --- | --- |
| Original editorial identity | manual 1440/1024 inspection + responsive E2E |
| Exact Bioyond content | data/Home/About unit tests |
| One active project | archive unit + desktop/mobile E2E |
| 42% / 64px / 900ms / 96px | pure boundary tests + mobile integration E2E |
| Interruptible critical spring | model/hook tests + A→B→A E2E |
| Nav-only Apple material | shell unit + preference E2E + manual inspection |
| Curated media lifecycle | media unit + media E2E |
| Detail story order | ProjectPage DOM-order tests |
| Accessibility/preferences | unit + independent-context E2E |
| Four responsive sizes | responsive E2E + manual inspection |

Do not mark a row complete from visual intuition when a named automated proof is required.

- [ ] **Step 4: Perform manual visual acceptance in a fresh browser session**

Invoke `vercel:agent-browser-verify` for automated browser setup, then use the in-app browser for human visual judgment. Start a strict local server:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Inspect Work, every Project detail, and About at 1440×1000, 1024×900, 390×844, and 320×700. Check:

- the page reads as the original portfolio first, with Source Serif Pro, Inter, white space, and the EW mark intact;
- blue/gold stay below the approved visual emphasis and never become large surfaces;
- images feel controlled, captions feel authored, and portrait crops remain natural;
- nav fade appears only under scrolled content and no other surface uses blur;
- project open/close motion feels continuous under rapid input and has no bounce;
- mobile scrolling remains native and the first viewport is not dominated by the portrait;
- text-only projects feel intentional rather than empty;
- no overflow, clipped focus ring, orphan heading, layout jump, autoplay, or unexpected PDF/GIF load occurs.

Initial screenshots may assist comparison but do not replace this four-viewport, three-view visual inspection.

- [ ] **Step 5: Fix only observed acceptance defects and re-prove them**

For each defect, add or tighten a focused test first, make the smallest CSS/component correction, then rerun that focused test plus:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
```

If files changed, commit only the proven corrections:

```bash
git add src e2e
git commit -m "fix: finish original plus visual polish"
```

If no files changed, do not create an empty commit.

- [ ] **Step 6: Confirm final repository state**

Run:

```bash
git status --short --branch
git log --oneline --decorate -10
```

Expected: clean `codex/portfolio-original-plus` worktree with the plan's focused commits and no unrelated user files. Report automated results, manual viewport results, which mandatory reduced-transparency emulation path ran, and the exact branch/commit range; do not push or deploy unless the user separately authorizes publication.
