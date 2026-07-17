# Quiet Personal Portfolio Redesign Implementation Plan

Status: superseded on 2026-07-17. Do not execute this plan. The approved
direction is now defined in
`docs/superpowers/specs/2026-07-17-portfolio-original-plus-design.md`; a new
implementation plan must be written from that specification after user review.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Rebuild Edward Wang's portfolio in the approved Quiet Personal A+ direction while preserving its content, three-view state navigation, and complete project media.

**Architecture:** Keep profile and project content in src/Portfolio.jsx as the single source of truth, and reduce that file to data plus application state. Move site chrome and each view into focused React modules that receive data and an onNavigate callback. Add component tests for behavior, Playwright coverage for responsive layout, and browser review for visual fidelity.

**Tech Stack:** React 18.3.1, Vite 7.3.3, Tailwind CSS 3.4.7, Vitest, React Testing Library, Playwright, GitHub Pages

## Global Constraints

- Preserve the Work, Project Detail, and About views with the existing in-memory state navigation; do not add React Router or URL routing.
- Keep every profile entry, all six projects, their current array order, all reports, and all media content.
- Homepage hierarchy is one featured project, two image-led core projects, then three compact project entries.
- Page color is #F7F8F8, paper surface is #FFFFFF, primary text is #20252A, secondary text is #626C74, tertiary text is #889198, rules are #D6DCDF, and accent is #345D78.
- Use Helvetica Neue, Helvetica, Arial, sans-serif; remove remote font requests.
- Desktop content width is 1120px, navigation height is 64px, and homepage H1 stays between 34px and 42px.
- Use square corners, no shadows, no gradients, no glass effects, no card pile, no pills, and no decorative status indicators.
- Use only 120ms to 160ms link and underline transitions; disable nonessential transitions for prefers-reduced-motion.
- Treat #889198 as decorative or nonessential metadata only. Required 11px to 17px text uses #626C74 or darker so WCAG AA contrast is retained.
- At widths below 900px, featured media moves above its copy and evidence grids use no more than two columns.
- At widths below 720px, every view is single-column with 16px horizontal padding.
- Images use descriptive alt text, explicit intrinsic dimensions, and a neutral bordered failure state containing the project name.
- Videos never autoplay, use native controls and preload="metadata", and ship an H.264/AAC MP4 source.
- GIF animations are not mounted until the visitor explicitly presses Play; the same control unmounts them on Pause.
- Every PDF has both a titled lazy iframe and a normal descriptive open link.
- Empty project link collections render nothing; never render "Available on request".
- Work, About, every project, Back to Work, Next project, media controls, and document links remain keyboard reachable.
- Navigation changes scroll to the top, update document.title, and focus the destination H1 without moving focus on the initial page load.
- Do not edit generated top-level assets/ or root media copies. GitHub Pages continues to deploy Vite dist through .github/workflows/static.yml.

---

## File Structure

**Create**

- src/test/setup.js — shared Testing Library cleanup plus browser API mocks
- src/components/SiteChrome.jsx — navigation and footer
- src/components/SafeImage.jsx — intrinsic image rendering and neutral failure state
- src/pages/HomePage.jsx — A+ introduction, project hierarchy, and concise record
- src/pages/ProjectPage.jsx — journal layout and all four media schemas
- src/pages/AboutPage.jsx — complete biography, experience, education, skills, coursework, languages, and contact
- src/Portfolio.smoke.test.jsx — shell and state-navigation coverage
- src/pages/HomePage.test.jsx — homepage hierarchy and image fallback coverage
- src/pages/ProjectPage.test.jsx — journal order and media accessibility coverage
- src/pages/AboutPage.test.jsx — complete About content coverage
- playwright.config.js — local responsive test server
- e2e/portfolio.spec.js — breakpoint, overflow, keyboard, and navigation checks
- public/c12.ai/IMG_1671.mp4 — compatible version of the first lab video
- public/c12.ai/IMG_1672.mp4 — compatible version of the second lab video
- public/c12.ai/1.webp — optimized metadata-free preview
- public/ece276b/pr1/doorkey-poster.png — still cover for the animated planning project

**Modify**

- package.json — test scripts, Node requirement, and development dependencies
- package-lock.json — locked dependency graph
- vite.config.js — Vitest environment
- index.html — remove Google Fonts connections
- tailwind.config.js — make the Tailwind sans family match the approved system stack and remove the unused serif family
- src/index.css — approved tokens, system typography, focus treatment, and reduced-motion behavior
- src/Portfolio.jsx — retain data/state, add navigation lifecycle, and compose extracted views
- .github/workflows/static.yml — run unit tests before the production build
- public media references inside the projects data — use compatible optimized files

**Remove after verified transcoding**

- public/c12.ai/IMG_1671.mov
- public/c12.ai/IMG_1672.mov

---

### Task 1: Establish the Test and CI Baseline

**Files:**

- Modify: package.json
- Modify: package-lock.json
- Modify: vite.config.js
- Create: src/test/setup.js
- Create: src/Portfolio.smoke.test.jsx
- Modify: .github/workflows/static.yml

**Interfaces:**

- Consumes: the existing default export from src/Portfolio.jsx
- Produces: npm test, npm run test:watch, and a jsdom environment shared by every later component task

- [ ] **Step 1: Write the smoke test before the test runner exists**

Create src/Portfolio.smoke.test.jsx:

~~~jsx
import { render, screen } from "@testing-library/react";
import Portfolio from "./Portfolio.jsx";

describe("Portfolio shell", () => {
  it("renders the current Work view and both primary navigation controls", () => {
    render(<Portfolio />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /ECE student building responsive, expressive robots/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "About" })).toBeInTheDocument();
  });
});
~~~

- [ ] **Step 2: Run the test command and verify the missing runner failure**

Run: npm test

Expected: FAIL with npm reporting a missing "test" script.

- [ ] **Step 3: Install the unit-test dependencies**

Run:

~~~bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
~~~

Expected: package.json and package-lock.json update without dependency-resolution errors.

- [ ] **Step 4: Add deterministic test scripts and the supported Node floor**

Merge these exact fields into package.json:

~~~json
{
  "engines": {
    "node": ">=20.19.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
~~~

Replace vite.config.js with:

~~~js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    globals: true,
  },
});
~~~

Create src/test/setup.js:

~~~js
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window, "requestAnimationFrame", {
  configurable: true,
  value: (callback) => callback(),
});
~~~

- [ ] **Step 5: Run the smoke test and production build**

Run: npm test

Expected: PASS, 1 test passed.

Run: npm run build

Expected: PASS and dist/index.html is emitted.

- [ ] **Step 6: Put the unit gate into GitHub Pages deployment**

In .github/workflows/static.yml, set Node to 22 and insert the test step between install and build:

~~~yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
~~~

Run: npm test

Expected: PASS, 1 test passed.

- [ ] **Step 7: Commit the baseline**

~~~bash
git add package.json package-lock.json vite.config.js src/test/setup.js src/Portfolio.smoke.test.jsx .github/workflows/static.yml
git commit -m "test: add portfolio verification baseline"
~~~

---

### Task 2: Build the Quiet Site Shell and Navigation Lifecycle

**Files:**

- Create: src/components/SiteChrome.jsx
- Modify: src/index.css
- Modify: index.html
- Modify: tailwind.config.js
- Modify: src/Portfolio.jsx
- Modify: src/Portfolio.smoke.test.jsx

**Interfaces:**

- Consumes: profile, view, and the existing state setter through onNavigate(nextView)
- Produces: SiteNav({ profile, view, onNavigate }), SiteFooter({ profile }), one skip link, document-title updates, scroll reset, and destination-heading focus

- [ ] **Step 1: Replace the smoke expectation with the approved shell contract**

Replace src/Portfolio.smoke.test.jsx with:

~~~jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio.jsx";

describe("Portfolio shell", () => {
  it("renders restrained navigation with Work marked current", () => {
    render(<Portfolio />);

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content"
    );
    expect(screen.getByRole("button", { name: "Edward Wang" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "About" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.queryByText("Get in touch")).not.toBeInTheDocument();
  });

  it("scrolls, updates the title, and focuses the H1 after navigation", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole("button", { name: "About" }));

    const heading = screen.getByRole("heading", { level: 1 });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
    expect(document.title).toBe("About — Edward Wang");
  });
});
~~~

- [ ] **Step 2: Run the shell tests and verify the visual-shell failure**

Run: npm test -- src/Portfolio.smoke.test.jsx

Expected: FAIL because the skip link and aria-current attributes do not exist and the destination H1 is not focused.

- [ ] **Step 3: Install the global visual tokens and accessibility behavior**

Replace src/index.css with:

~~~css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #20252a;
  background: #f7f8f8;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-synthesis: none;
  --page: #f7f8f8;
  --paper: #ffffff;
  --ink: #20252a;
  --muted: #626c74;
  --faint: #889198;
  --line: #d6dcdf;
  --accent: #345d78;
}

html {
  min-width: 320px;
  background: var(--page);
  scroll-padding-top: 1rem;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background: var(--page);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  font: inherit;
}

a,
button {
  transition:
    color 140ms ease,
    border-color 140ms ease,
    text-decoration-color 140ms ease;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

::selection {
  color: var(--ink);
  background: #dbe7ee;
}

.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 100;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--accent);
  background: var(--paper);
  color: var(--ink);
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
~~~

Remove all three Google Fonts link elements from index.html. Keep the existing title and description.

Replace the theme section in tailwind.config.js with:

~~~js
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
~~~

- [ ] **Step 4: Create the site chrome**

Create src/components/SiteChrome.jsx:

~~~jsx
export function SiteNav({ profile, view, onNavigate }) {
  const workIsCurrent = view.page === "home" || view.page === "project";

  return (
    <header className="h-16 border-b border-[var(--line)] bg-[var(--page)]">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-4 min-[720px]:px-8">
        <button
          type="button"
          onClick={() => onNavigate({ page: "home" })}
          className="min-h-11 text-sm font-medium tracking-[-0.01em] text-[var(--ink)]"
        >
          {profile.name}
        </button>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <button
            type="button"
            aria-current={workIsCurrent ? "page" : undefined}
            onClick={() => onNavigate({ page: "home" })}
            className="min-h-11 px-3 text-sm text-[var(--muted)] aria-[current=page]:text-[var(--ink)] aria-[current=page]:underline aria-[current=page]:decoration-[var(--accent)] aria-[current=page]:underline-offset-4"
          >
            Work
          </button>
          <button
            type="button"
            aria-current={view.page === "about" ? "page" : undefined}
            onClick={() => onNavigate({ page: "about" })}
            className="min-h-11 px-3 text-sm text-[var(--muted)] aria-[current=page]:text-[var(--ink)] aria-[current=page]:underline aria-[current=page]:decoration-[var(--accent)] aria-[current=page]:underline-offset-4"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ profile }) {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="inline-flex min-h-11 items-center hover:text-[var(--accent)]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
~~~

- [ ] **Step 5: Wire the shell and lifecycle into Portfolio**

Add useRef and the chrome imports:

~~~jsx
import { useEffect, useRef, useState } from "react";
import { SiteFooter, SiteNav } from "./components/SiteChrome.jsx";
~~~

Delete the existing Nav, NavLink, and Footer function blocks. In the three existing page H1 elements, add:

~~~jsx
data-page-heading
tabIndex={-1}
~~~

Replace the default Portfolio function with:

~~~jsx
export default function Portfolio() {
  const [view, setView] = useState({ page: "home" });
  const hasMounted = useRef(false);
  const activeProject =
    view.page === "project"
      ? projects.find((project) => project.id === view.id) ?? projects[0]
      : null;

  useEffect(() => {
    if (view.page === "about") {
      document.title = "About — Edward Wang";
    } else if (activeProject) {
      document.title = activeProject.title + " — Edward Wang";
    } else {
      document.title = "Edward Wang — Robotics & Controls";
    }
  }, [view.page, activeProject]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => {
      document.querySelector("[data-page-heading]")?.focus();
    });
  }, [view]);

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteNav profile={profile} view={view} onNavigate={setView} />
      {view.page === "home" && <Home go={setView} />}
      {view.page === "project" && (
        <ProjectDetail id={view.id} go={setView} />
      )}
      {view.page === "about" && <About />}
      <SiteFooter profile={profile} />
    </div>
  );
}
~~~

Give each existing main element id="main-content" and tabIndex={-1}.

- [ ] **Step 6: Run shell tests, the whole unit suite, and build**

Run: npm test -- src/Portfolio.smoke.test.jsx

Expected: PASS, 2 tests passed.

Run: npm test

Expected: PASS, 2 tests passed.

Run: npm run build

Expected: PASS.

- [ ] **Step 7: Commit the shell**

~~~bash
git add src/components/SiteChrome.jsx src/index.css index.html tailwind.config.js src/Portfolio.jsx src/Portfolio.smoke.test.jsx
git commit -m "feat: add quiet portfolio shell"
~~~

---

### Task 3: Rebuild the Homepage Hierarchy

**Files:**

- Create: src/components/SafeImage.jsx
- Create: src/pages/HomePage.jsx
- Create: src/pages/HomePage.test.jsx
- Modify: src/Portfolio.jsx

**Interfaces:**

- Consumes: profile, projects, and onNavigate(nextView)
- Produces: SafeImage({ src, alt, width, height, className, fallbackLabel }) and HomePage({ profile, projects, onNavigate })

- [ ] **Step 1: Write the homepage hierarchy tests**

Create src/pages/HomePage.test.jsx:

~~~jsx
import { fireEvent, render, screen, within } from "@testing-library/react";
import Portfolio from "../Portfolio.jsx";

describe("Quiet Personal homepage", () => {
  it("renders the approved introduction and project hierarchy", () => {
    render(<Portfolio />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Hi, I’m Edward Wang." })
    ).toBeInTheDocument();
    expect(screen.getByText("UC San Diego ECE")).toBeInTheDocument();

    const featured = screen.getByRole("region", { name: "Featured project" });
    expect(
      within(featured).getByRole("heading", {
        level: 3,
        name: "1/5 Scale Autonomous Off-Road Vehicle",
      })
    ).toBeInTheDocument();
    expect(within(featured).getByText("Problem")).toBeInTheDocument();
    expect(within(featured).getByText("My contribution")).toBeInTheDocument();
    expect(within(featured).getByText("Outcome")).toBeInTheDocument();
    expect(
      within(featured).getByRole("img", {
        name: "1/5 scale autonomous vehicle during hardware integration",
      })
    ).toHaveAttribute("src", "/ece191/2.png");

    const core = screen.getByRole("region", { name: "Core projects" });
    expect(
      within(core).getByText("Vision-Guided Robotic Arm for Automated Lab Operations")
    ).toBeInTheDocument();
    expect(
      within(core).getByText("Sensing and State Estimation in Robotics")
    ).toBeInTheDocument();

    const index = screen.getByRole("region", { name: "Project index" });
    expect(
      within(index).getAllByRole("button").map((button) => button.textContent)
    ).toEqual([
      expect.stringContaining("Planning and Learning in Robotics"),
      expect.stringContaining("ML-Supported Nanoparticle & Cell-Membrane Selection"),
      expect.stringContaining("Embedded & Digital Control Systems"),
    ]);
  });

  it("replaces a broken featured image with the neutral named fallback", () => {
    render(<Portfolio />);

    fireEvent.error(
      screen.getByRole("img", {
        name: "1/5 scale autonomous vehicle during hardware integration",
      })
    );

    expect(
      screen.getByRole("img", {
        name: "1/5 Scale Autonomous Off-Road Vehicle image unavailable",
      })
    ).toBeInTheDocument();
  });
});
~~~

- [ ] **Step 2: Run the homepage tests and verify the old-home failure**

Run: npm test -- src/pages/HomePage.test.jsx

Expected: FAIL because the greeting, hierarchy regions, and named fallback do not exist.

- [ ] **Step 3: Add homepage-specific profile content**

Add these fields inside the existing profile object in src/Portfolio.jsx:

~~~jsx
  homeIntro: {
    education:
      "I’m an Electrical and Computer Engineering student at UC San Diego, continuing into the M.S. program in Intelligent Systems, Robotics & Control in Fall 2026.",
    practice:
      "I build perception-to-motion systems and work through calibration, latency, drift, and integration failures when algorithms meet real hardware.",
  },
  facts: [
    { label: "Study", value: "UC San Diego ECE" },
    { label: "Focus", value: "Robotics & controls" },
    { label: "Work", value: "Research + real systems" },
    { label: "Next", value: "M.S. ISRC · Fall 2026" },
  ],
~~~

- [ ] **Step 4: Create the shared safe image**

Create src/components/SafeImage.jsx:

~~~jsx
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackLabel,
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={fallbackLabel + " image unavailable"}
        className={
          "grid min-h-40 place-items-center border border-[var(--line)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--muted)] " +
          className
        }
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
~~~

- [ ] **Step 5: Create the A+ homepage**

Create src/pages/HomePage.jsx with these exact exported and private component signatures:

~~~jsx
import { SafeImage } from "../components/SafeImage.jsx";

const FEATURED_ID = "off-road-vehicle";
const CORE_IDS = ["lab-robotic-arm", "state-estimation"];
const INDEX_IDS = ["planning-control", "drug-delivery-ml", "embedded-digital"];

const PREVIEW_MEDIA = {
  "lab-robotic-arm": {
    src: "/c12.ai/1.JPG",
    alt: "Robotic arm workstation used for automated lab operations",
    width: 3213,
    height: 5712,
  },
  "state-estimation": {
    src: "/ece276a/1.png",
    alt: "State-estimation project results and trajectory visualization",
    width: 1866,
    height: 2266,
  },
};

function openProject(onNavigate, id) {
  onNavigate({ page: "project", id });
}

function ProfileFacts({ facts }) {
  return (
    <dl className="border-t border-[var(--line)]">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[var(--line)] py-2.5 text-sm"
        >
          <dt className="text-[var(--muted)]">{fact.label}</dt>
          <dd className="text-[var(--ink)]">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function HomeIntro({ profile }) {
  return (
    <section className="border-b border-[var(--line)] py-14 min-[720px]:py-20">
      <div className="grid gap-x-10 min-[720px]:grid-cols-[minmax(0,1fr)_13rem] min-[900px]:grid-cols-[minmax(0,1fr)_15rem] min-[900px]:gap-x-16">
        <h1
          data-page-heading
          tabIndex={-1}
          className="max-w-2xl text-[34px] font-medium leading-[1.08] tracking-[-0.035em] min-[720px]:col-start-1 min-[720px]:row-start-1 min-[720px]:text-[42px]"
        >
          Hi, I’m Edward Wang.
        </h1>
        <SafeImage
          src="/IMG_9036.JPG"
          alt="Portrait of Edward Wang"
          width={106}
          height={132}
          fallbackLabel="Edward Wang portrait"
          className="mt-6 h-[132px] w-[106px] object-cover min-[720px]:col-start-2 min-[720px]:row-start-1 min-[720px]:mt-0"
        />
        <div className="mt-7 min-[720px]:col-start-1 min-[720px]:row-start-2">
          <div className="max-w-[68ch] space-y-4 text-[17px] leading-7 text-[var(--muted)]">
            <p>{profile.homeIntro.education}</p>
            <p>{profile.homeIntro.practice}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="inline-flex min-h-11 items-center text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 min-[720px]:col-start-2 min-[720px]:row-start-2 min-[720px]:mt-7">
          <ProfileFacts facts={profile.facts} />
        </div>
      </div>
    </section>
  );
}

function FeaturedProject({ project, onNavigate }) {
  return (
    <section
      aria-labelledby="featured-section-heading"
      className="border-b border-[var(--line)] py-14 min-[720px]:py-20"
    >
      <h2
        id="featured-section-heading"
        className="mb-6 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]"
      >
        Featured project
      </h2>
      <article className="grid gap-8 min-[900px]:grid-cols-[42%_minmax(0,1fr)] min-[900px]:gap-12">
        <SafeImage
          src="/ece191/2.png"
          alt="1/5 scale autonomous vehicle during hardware integration"
          width={1086}
          height={764}
          fallbackLabel={project.title}
          className="h-auto w-full object-cover"
        />
        <div>
          <p className="text-sm text-[var(--muted)]">{project.context}</p>
          <h3 className="mt-2 text-[27px] font-medium leading-tight tracking-[-0.02em]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[65ch] leading-7 text-[var(--muted)]">
            {project.summary}
          </p>
          <dl className="mt-7 border-t border-[var(--line)]">
            {[
              ["Problem", project.challenge],
              ["My contribution", project.approach],
              ["Outcome", project.outcome],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-[var(--line)] py-4 min-[720px]:grid-cols-[8rem_1fr]"
              >
                <dt className="text-sm font-medium text-[var(--accent)]">{label}</dt>
                <dd className="leading-6 text-[var(--muted)]">{value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={() => openProject(onNavigate, project.id)}
            className="mt-6 min-h-11 text-sm font-medium text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
          >
            Open project: {project.title}
          </button>
        </div>
      </article>
    </section>
  );
}

function ProjectPreview({ project, onNavigate }) {
  const media = PREVIEW_MEDIA[project.id];

  return (
    <article className="border-t border-[var(--line)] pt-5">
      <SafeImage
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        fallbackLabel={project.title}
        className="aspect-[16/10] w-full object-cover"
      />
      <p className="mt-5 text-sm text-[var(--muted)]">{project.context}</p>
      <h3 className="mt-2 text-xl font-medium leading-snug">{project.title}</h3>
      <p className="mt-3 leading-6 text-[var(--muted)]">{project.summary}</p>
      <button
        type="button"
        onClick={() => openProject(onNavigate, project.id)}
        className="mt-4 min-h-11 text-sm font-medium text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
      >
        Open project: {project.title}
      </button>
    </article>
  );
}

function ProjectIndex({ projects, onNavigate }) {
  return (
    <section aria-label="Project index" className="border-t border-[var(--line)]">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => openProject(onNavigate, project.id)}
          className="grid min-h-16 w-full gap-1 border-b border-[var(--line)] py-4 text-left min-[720px]:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] min-[720px]:items-baseline min-[720px]:gap-8"
        >
          <span className="font-medium">{project.title}</span>
          <span className="text-sm leading-6 text-[var(--muted)]">{project.summary}</span>
        </button>
      ))}
    </section>
  );
}

function ExperienceEducation({ profile }) {
  const records = [
    ["Experience", profile.experience],
    ["Education", profile.education.slice(0, 2)],
  ];

  return (
    <section className="grid gap-12 border-t border-[var(--line)] py-14 min-[720px]:grid-cols-2 min-[720px]:py-20">
      {records.map(([heading, items]) => (
        <div key={heading}>
          <h2 className="text-xl font-medium">{heading}</h2>
          <ul className="mt-5 border-t border-[var(--line)]">
            {items.map((item) => (
              <li
                key={(item.role || item.note) + item.year}
                className="border-b border-[var(--line)] py-4"
              >
                <p className="font-medium">{item.role || item.note}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.org}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.year}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function HomePage({ profile, projects, onNavigate }) {
  const byId = new Map(projects.map((project) => [project.id, project]));
  const featured = byId.get(FEATURED_ID);
  const core = CORE_IDS.map((id) => byId.get(id));
  const index = INDEX_IDS.map((id) => byId.get(id));

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-[1120px] px-4 min-[720px]:px-8"
    >
      <HomeIntro profile={profile} />
      <FeaturedProject project={featured} onNavigate={onNavigate} />
      <section aria-label="Core projects" className="py-14 min-[720px]:py-20">
        <h2 className="mb-7 text-2xl font-medium tracking-[-0.02em]">More work</h2>
        <div className="grid gap-10 min-[720px]:grid-cols-2">
          {core.map((project) => (
            <ProjectPreview
              key={project.id}
              project={project}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>
      <ProjectIndex projects={index} onNavigate={onNavigate} />
      <ExperienceEducation profile={profile} />
    </main>
  );
}
~~~

- [ ] **Step 6: Replace the old Home function**

Import the new page:

~~~jsx
import { HomePage } from "./pages/HomePage.jsx";
~~~

Delete the existing Home function block and replace the home branch with:

~~~jsx
{view.page === "home" && (
  <HomePage profile={profile} projects={projects} onNavigate={setView} />
)}
~~~

Remove lucide imports that were used only by the deleted Home function.

- [ ] **Step 7: Run homepage tests, all unit tests, and build**

Run: npm test -- src/pages/HomePage.test.jsx

Expected: PASS, 2 tests passed.

Run: npm test

Expected: PASS, 4 tests passed.

Run: npm run build

Expected: PASS.

- [ ] **Step 8: Commit the homepage**

~~~bash
git add src/components/SafeImage.jsx src/pages/HomePage.jsx src/pages/HomePage.test.jsx src/Portfolio.jsx
git commit -m "feat: rebuild portfolio homepage hierarchy"
~~~

---

### Task 4: Rebuild Project Journals and Media Delivery

**Files:**

- Create: src/pages/ProjectPage.jsx
- Create: src/pages/ProjectPage.test.jsx
- Modify: src/Portfolio.jsx
- Create: public/c12.ai/IMG_1671.mp4
- Create: public/c12.ai/IMG_1672.mp4
- Create: public/c12.ai/1.webp
- Create: public/ece276b/pr1/doorkey-poster.png
- Remove: public/c12.ai/IMG_1671.mov
- Remove: public/c12.ai/IMG_1672.mov

**Interfaces:**

- Consumes: project, nextProject, and onNavigate(nextView); the existing images, PDF records, GIF records, and mixed-media records
- Produces: ProjectPage({ project, nextProject, onNavigate }), titled lazy PDF frames, controlled GIF playback, and compatible user-initiated video

- [ ] **Step 1: Write journal and media tests**

Create src/pages/ProjectPage.test.jsx:

~~~jsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "../Portfolio.jsx";

async function openProject(name) {
  const user = userEvent.setup();
  render(<Portfolio />);
  await user.click(screen.getByRole("button", { name: "Open project: " + name }));
  return user;
}

describe("Project journal", () => {
  it("uses the approved journal order and plain technology text", async () => {
    await openProject("1/5 Scale Autonomous Off-Road Vehicle");

    const journal = screen.getByRole("region", { name: "Project journal" });
    expect(
      within(journal).getAllByRole("term").map((term) => term.textContent)
    ).toEqual(["Context", "Challenge", "My contribution", "Outcome"]);
    expect(screen.getByText(/ROS, DonkeyCar, Python/)).toBeInTheDocument();
    expect(screen.queryByText("Available on request")).not.toBeInTheDocument();
  });

  it("provides a titled PDF preview and a normal open link", async () => {
    await openProject("Sensing and State Estimation in Robotics");

    expect(
      screen.getByTitle("Preview PR1 - Pose Estimation")
    ).toHaveAttribute("loading", "lazy");
    expect(
      screen.getByRole("link", { name: "Open PR1 - Pose Estimation" })
    ).toHaveAttribute("href", "/ece276a/ece276_pr1.pdf");
  });

  it("does not mount a GIF until Play is pressed", async () => {
    const user = await openProject("Planning and Learning in Robotics");

    expect(screen.queryByAltText("DoorKey overview")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Play DoorKey overview" }));
    expect(screen.getByAltText("DoorKey overview")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Pause DoorKey overview" }));
    expect(screen.queryByAltText("DoorKey overview")).not.toBeInTheDocument();
  });

  it("keeps the existing project order and loops the final project to the first", async () => {
    const user = await openProject("Embedded & Digital Control Systems");

    await user.click(
      screen.getByRole("button", {
        name: "1/5 Scale Autonomous Off-Road Vehicle",
      })
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "1/5 Scale Autonomous Off-Road Vehicle",
      })
    ).toBeInTheDocument();
  });
});
~~~

- [ ] **Step 2: Run the project tests and verify the old-detail failure**

Run: npm test -- src/pages/ProjectPage.test.jsx

Expected: FAIL because the journal region, PDF open links, and GIF controls do not exist.

- [ ] **Step 3: Transcode the lab videos and create still/optimized imagery**

Run each command separately:

~~~bash
ffmpeg -i public/c12.ai/IMG_1671.mov -map_metadata -1 -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/c12.ai/IMG_1671.mp4
~~~

~~~bash
ffmpeg -i public/c12.ai/IMG_1672.mov -map_metadata -1 -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/c12.ai/IMG_1672.mp4
~~~

~~~bash
ffmpeg -i public/c12.ai/1.JPG -map_metadata -1 -vf "scale=1600:1600:force_original_aspect_ratio=decrease" -c:v libwebp -quality 82 public/c12.ai/1.webp
~~~

~~~bash
ffmpeg -i public/ece276b/pr1/gif/partA/doorkey.gif -frames:v 1 public/ece276b/pr1/doorkey-poster.png
~~~

Run:

~~~bash
ffprobe -v error -show_entries stream=codec_name,pix_fmt -show_entries format=duration -of default=noprint_wrappers=1 public/c12.ai/IMG_1671.mp4
~~~

Expected: codec_name=h264, codec_name=aac, pix_fmt=yuv420p, and duration close to 54 seconds.

Run:

~~~bash
ffprobe -v error -show_entries stream=codec_name,pix_fmt -show_entries format=duration -of default=noprint_wrappers=1 public/c12.ai/IMG_1672.mp4
~~~

Expected: codec_name=h264, codec_name=aac, pix_fmt=yuv420p, and duration close to 66 seconds.

After both probes pass:

~~~bash
git rm public/c12.ai/IMG_1671.mov public/c12.ai/IMG_1672.mov
~~~

- [ ] **Step 4: Update project media references**

Change the lab project coverImage and video items to:

~~~jsx
      coverImage: "/c12.ai/1.webp",
      items: [
        {
          type: "video",
          src: "/c12.ai/IMG_1671.mp4",
          label: "Lab operations demo",
        },
        {
          type: "video",
          src: "/c12.ai/IMG_1672.mp4",
          label: "Robotic arm in action",
        },
      ],
~~~

Change the planning project coverImage to:

~~~jsx
      coverImage: "/ece276b/pr1/doorkey-poster.png",
~~~

Change PREVIEW_MEDIA in src/pages/HomePage.jsx to:

~~~jsx
  "lab-robotic-arm": {
    src: "/c12.ai/1.webp",
    alt: "Robotic arm workstation used for automated lab operations",
    width: 900,
    height: 1600,
  },
~~~

- [ ] **Step 5: Create the project journal components**

Create src/pages/ProjectPage.jsx. Use these exact media behaviors and exported interface:

~~~jsx
import { useState } from "react";
import { SafeImage } from "../components/SafeImage.jsx";

const IMAGE_DIMENSIONS = {
  "/ece191/1.png": [804, 482],
  "/ece191/2.png": [1086, 764],
  "/ece191/3.png": [954, 702],
  "/ece191/4.png": [548, 326],
  "/c12.ai/1.webp": [900, 1600],
  "/ece276a/1.png": [1866, 2266],
  "/ece276b/pr1/doorkey-poster.png": [256, 256],
};

const COVER_ALT = {
  "/ece191/1.png":
    "Completed 1/5 scale autonomous off-road vehicle with LiDAR and onboard enclosure",
  "/c12.ai/1.webp":
    "Multiple robotic arms arranged around the automated laboratory workcell",
  "/ece276a/1.png":
    "Comparison plots for IMU-only tracking, landmark mapping, and visual-inertial SLAM",
  "/ece276b/pr1/doorkey-poster.png":
    "DoorKey grid environment used for discrete planning experiments",
};

const GALLERY_ALT = {
  "/ece191/2.png":
    "Autonomous vehicle chassis with LiDAR and onboard enclosure during hardware integration",
  "/ece191/3.png":
    "Camera calibration feature tracks on a checkerboard display in the vehicle lab",
  "/ece191/4.png":
    "LiDAR point-cloud visualization captured from the autonomous vehicle",
};

function imageSize(src) {
  return IMAGE_DIMENSIONS[src] || [1200, 900];
}

function coverAlt(src, project) {
  return COVER_ALT[src] || project.title + " project evidence";
}

function CaseStudyRow({ label, children }) {
  return (
    <div className="grid gap-2 border-b border-[var(--line)] py-6 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-8">
      <dt className="text-sm font-medium text-[var(--accent)]">{label}</dt>
      <dd className="max-w-[70ch] leading-7 text-[var(--muted)]">{children}</dd>
    </div>
  );
}

function PdfViewer({ file }) {
  return (
    <section className="border-t border-[var(--line)] pt-5">
      <div className="flex flex-col gap-3 min-[720px]:flex-row min-[720px]:items-baseline min-[720px]:justify-between">
        <h4 className="font-medium">{file.name}</h4>
        <a
          href={file.src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center text-sm text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
        >
          Open {file.name}
        </a>
      </div>
      <iframe
        src={file.src + "#toolbar=1&navpanes=0"}
        title={"Preview " + file.name}
        loading="lazy"
        className="mt-4 h-[420px] w-full border border-[var(--line)] bg-[var(--paper)] min-[720px]:h-[640px]"
      />
    </section>
  );
}

function GifPreview({ gif }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="border-t border-[var(--line)] pt-4">
      <div className="grid min-h-44 place-items-center bg-[var(--paper)]">
        {playing ? (
          <img
            src={gif.src}
            alt={gif.label}
            loading="lazy"
            decoding="async"
            className="h-auto max-h-[28rem] w-full object-contain"
          />
        ) : (
          <p className="px-4 text-sm text-[var(--muted)]">Animation paused</p>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-4 py-3 text-sm text-[var(--muted)]">
        <span>{gif.label}</span>
        <button
          type="button"
          onClick={() => setPlaying((current) => !current)}
          className="min-h-11 text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
        >
          {playing ? "Pause " : "Play "}
          {gif.label}
        </button>
      </figcaption>
    </figure>
  );
}

function ImageGallery({ project }) {
  return (
    <div className="grid gap-6 min-[720px]:grid-cols-2 min-[900px]:grid-cols-3">
      {project.media.files.map((src, index) => {
        const [width, height] = imageSize(src);
        return (
          <figure key={src}>
            <SafeImage
              src={src}
              alt={
                GALLERY_ALT[src] ||
                project.title + " project evidence image " + (index + 1)
              }
              width={width}
              height={height}
              fallbackLabel={project.title}
              className="h-auto w-full object-contain"
            />
          </figure>
        );
      })}
    </div>
  );
}

function ProjectMedia({ project }) {
  const media = project.media;

  if (!media) {
    return (
      <div
        role="img"
        aria-label={project.title + " media unavailable"}
        className="grid min-h-56 place-items-center border border-[var(--line)] bg-[var(--paper)] p-6 text-center text-[var(--muted)]"
      >
        {project.title}
      </div>
    );
  }

  if (media.type === "images") {
    return <ImageGallery project={project} />;
  }

  if (media.type === "mixed") {
    return (
      <div className="grid gap-8 min-[900px]:grid-cols-2">
        {media.items.map((item) => (
          <figure key={item.src} className="border-t border-[var(--line)] pt-4">
            <video
              controls
              playsInline
              preload="metadata"
              poster={media.coverImage}
              width={854}
              height={480}
              className="aspect-video w-full bg-[var(--paper)] object-contain"
            >
              <source src={item.src} type="video/mp4" />
              <a href={item.src}>Open {item.label}</a>
            </video>
            <figcaption className="py-3 text-sm text-[var(--muted)]">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  if (media.type === "pdfs") {
    return (
      <div className="space-y-10">
        {media.files.map((file) => (
          <PdfViewer key={file.src} file={file} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {media.reports.map((report) => (
        <section key={report.name}>
          <h3 className="text-xl font-medium">{report.name}</h3>
          {report.sections.map((section) => (
            <section key={section.label} className="mt-7">
              <h4 className="text-sm font-medium text-[var(--muted)]">
                {section.label}
              </h4>
              <div className="mt-3 grid gap-6 min-[720px]:grid-cols-2 min-[900px]:grid-cols-3">
                {section.gifs.map((gif) => (
                  <GifPreview key={gif.src} gif={gif} />
                ))}
              </div>
            </section>
          ))}
          <div className="mt-9">
            <PdfViewer file={report.pdf} />
          </div>
        </section>
      ))}
    </div>
  );
}

export function ProjectPage({ project, nextProject, onNavigate }) {
  const cover = project.media?.coverImage;
  const [coverWidth, coverHeight] = imageSize(cover);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-[1120px] px-4 pb-20 min-[720px]:px-8"
    >
      <button
        type="button"
        onClick={() => onNavigate({ page: "home" })}
        className="mt-7 min-h-11 text-sm text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
      >
        Back to Work
      </button>

      <header className="border-b border-[var(--line)] pb-10 pt-8 min-[720px]:pb-14">
        <p className="text-sm leading-6 text-[var(--muted)]">{project.context}</p>
        <h1
          data-page-heading
          tabIndex={-1}
          className="mt-3 max-w-4xl text-[34px] font-medium leading-[1.08] tracking-[-0.035em] min-[720px]:text-[42px]"
        >
          {project.title}
        </h1>
        <p className="mt-5 max-w-[68ch] text-[17px] leading-7 text-[var(--muted)]">
          {project.summary}
        </p>
      </header>

      <section className="py-10 min-[720px]:py-14">
        <SafeImage
          src={cover}
          alt={coverAlt(cover, project)}
          width={coverWidth}
          height={coverHeight}
          fallbackLabel={project.title}
          className="mx-auto h-auto max-h-[46rem] w-full object-contain"
        />
      </section>

      <section aria-label="Project journal">
        <dl className="border-t border-[var(--line)]">
          <CaseStudyRow label="Context">{project.overview}</CaseStudyRow>
          <CaseStudyRow label="Challenge">{project.challenge}</CaseStudyRow>
          <CaseStudyRow label="My contribution">{project.approach}</CaseStudyRow>
          <CaseStudyRow label="Outcome">{project.outcome}</CaseStudyRow>
        </dl>
      </section>

      <section aria-labelledby="project-media-heading" className="py-14 min-[720px]:py-20">
        <h2 id="project-media-heading" className="mb-7 text-2xl font-medium">
          Project evidence
        </h2>
        <ProjectMedia project={project} />
      </section>

      <section className="border-t border-[var(--line)] py-8">
        <h2 className="text-sm font-medium text-[var(--muted)]">
          Tools and technologies
        </h2>
        <p className="mt-3 leading-7">{project.stack.join(", ")}</p>
        {project.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-5">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[var(--line)] py-10">
        <p className="text-sm text-[var(--muted)]">Next project</p>
        <button
          type="button"
          onClick={() => onNavigate({ page: "project", id: nextProject.id })}
          className="mt-3 min-h-11 text-left text-2xl font-medium text-[var(--ink)] hover:text-[var(--accent)]"
        >
          {nextProject.title}
        </button>
      </section>
    </main>
  );
}
~~~

- [ ] **Step 6: Replace the old project detail function**

Import ProjectPage:

~~~jsx
import { ProjectPage } from "./pages/ProjectPage.jsx";
~~~

Delete ProjectDetail and Meta. Replace the Task 2 activeProject declaration with the selected and next project derivation:

~~~jsx
  const selectedProject =
    view.page === "project"
      ? projects.find((project) => project.id === view.id) ?? projects[0]
      : null;
  const selectedIndex = selectedProject
    ? projects.findIndex((project) => project.id === selectedProject.id)
    : -1;
  const nextProject =
    selectedIndex >= 0 ? projects[(selectedIndex + 1) % projects.length] : null;
~~~

Replace the document-title effect with:

~~~jsx
  useEffect(() => {
    if (view.page === "about") {
      document.title = "About — Edward Wang";
    } else if (selectedProject) {
      document.title = selectedProject.title + " — Edward Wang";
    } else {
      document.title = "Edward Wang — Robotics & Controls";
    }
  }, [view.page, selectedProject]);
~~~

Replace the project branch with:

~~~jsx
{view.page === "project" && (
  <ProjectPage
    project={selectedProject}
    nextProject={nextProject}
    onNavigate={setView}
  />
)}
~~~

Remove the deleted ProjectDetail effect block and lucide imports that no remaining component uses. Keep the app-level useEffect, useRef, and useState imports.

- [ ] **Step 7: Run project tests, all unit tests, and build**

Run: npm test -- src/pages/ProjectPage.test.jsx

Expected: PASS, 4 tests passed.

Run: npm test

Expected: PASS, 8 tests passed.

Run: npm run build

Expected: PASS.

- [ ] **Step 8: Commit project journals and compatible media**

~~~bash
git add src/pages/ProjectPage.jsx src/pages/ProjectPage.test.jsx src/pages/HomePage.jsx src/Portfolio.jsx public/c12.ai/1.webp public/c12.ai/IMG_1671.mp4 public/c12.ai/IMG_1672.mp4 public/ece276b/pr1/doorkey-poster.png
git commit -m "feat: rebuild project journals and media"
~~~

---

### Task 5: Rebuild the Complete About View

**Files:**

- Create: src/pages/AboutPage.jsx
- Create: src/pages/AboutPage.test.jsx
- Modify: src/Portfolio.jsx

**Interfaces:**

- Consumes: profile
- Produces: AboutPage({ profile }) with all approved biography and record sections

- [ ] **Step 1: Write the About content test**

Create src/pages/AboutPage.test.jsx:

~~~jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "../Portfolio.jsx";

describe("About page", () => {
  it("keeps the complete academic and professional record without pill styling", async () => {
    const user = userEvent.setup();
    const { container } = render(<Portfolio />);

    await user.click(screen.getByRole("button", { name: "About" }));

    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected coursework" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Languages" })).toBeInTheDocument();
    expect(screen.getByText("Diablo Valley College")).toBeInTheDocument();
    expect(screen.getByText("+1 (650) 537-7182")).toBeInTheDocument();
    expect(container.innerHTML).not.toContain("rounded-full");
  });
});
~~~

- [ ] **Step 2: Run the About test and verify the old-view failure**

Run: npm test -- src/pages/AboutPage.test.jsx

Expected: FAIL because the approved heading names and square, non-pill skill treatment are not present.

- [ ] **Step 3: Create the About page**

Create src/pages/AboutPage.jsx:

~~~jsx
import { SafeImage } from "../components/SafeImage.jsx";

function RecordSection({ heading, items }) {
  return (
    <section className="grid gap-6 border-t border-[var(--line)] py-10 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-10">
      <h2 className="text-xl font-medium">{heading}</h2>
      <ul className="border-t border-[var(--line)]">
        {items.map((item) => (
          <li
            key={(item.role || item.note) + item.year}
            className="grid gap-2 border-b border-[var(--line)] py-5 min-[900px]:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <p className="text-sm text-[var(--muted)]">{item.year}</p>
            <div>
              <p className="font-medium">{item.role || item.org}</p>
              {item.role && <p className="mt-1 text-sm text-[var(--muted)]">{item.org}</p>}
              <p className="mt-2 max-w-[68ch] leading-7 text-[var(--muted)]">
                {item.note}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AboutPage({ profile }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-[1120px] px-4 pb-16 min-[720px]:px-8"
    >
      <section className="grid gap-8 py-14 min-[720px]:grid-cols-[13rem_minmax(0,1fr)] min-[720px]:py-20 min-[900px]:gap-14">
        <SafeImage
          src="/IMG_9036.JPG"
          alt="Portrait of Edward Wang"
          width={1080}
          height={1080}
          fallbackLabel="Edward Wang portrait"
          className="aspect-square w-full max-w-[13rem] object-cover"
        />
        <div>
          <h1
            data-page-heading
            tabIndex={-1}
            className="text-[34px] font-medium leading-[1.08] tracking-[-0.035em] min-[720px]:text-[42px]"
          >
            About
          </h1>
          <div className="mt-7 max-w-[70ch] space-y-5 text-[17px] leading-7 text-[var(--muted)]">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <RecordSection heading="Experience" items={profile.experience} />
      <RecordSection heading="Education" items={profile.education} />

      <section className="grid gap-6 border-t border-[var(--line)] py-10 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-10">
        <h2 className="text-xl font-medium">Skills</h2>
        <dl className="border-t border-[var(--line)]">
          {Object.entries(profile.skills).map(([group, items]) => (
            <div
              key={group}
              className="grid gap-2 border-b border-[var(--line)] py-4 min-[900px]:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt className="font-medium">{group}</dt>
              <dd className="leading-7 text-[var(--muted)]">{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6 border-t border-[var(--line)] py-10 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-10">
        <h2 className="text-xl font-medium">Selected coursework</h2>
        <dl className="border-t border-[var(--line)]">
          {Object.entries(profile.coursework).map(([group, list]) => (
            <div key={group} className="border-b border-[var(--line)] py-4">
              <dt className="font-medium">{group}</dt>
              <dd className="mt-2 leading-7 text-[var(--muted)]">{list}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6 border-t border-[var(--line)] py-10 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-10">
        <h2 className="text-xl font-medium">Languages</h2>
        <ul className="border-t border-[var(--line)]">
          {profile.languages.map((language) => (
            <li
              key={language.name}
              className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-4"
            >
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-[var(--muted)]">{language.level}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 border-t border-[var(--line)] py-10 min-[720px]:grid-cols-[10rem_minmax(0,1fr)] min-[720px]:gap-10">
        <h2 className="text-xl font-medium">Contact</h2>
        <div>
          <a
            href={"mailto:" + profile.email}
            className="inline-flex min-h-11 items-center text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
          >
            {profile.email}
          </a>
          <p className="mt-3 text-sm text-[var(--muted)]">{profile.phone}</p>
          <div className="mt-4 flex flex-wrap gap-5">
            {profile.socials
              .filter((social) => social.label !== "Email")
              .map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex min-h-11 items-center text-sm text-[var(--accent)] underline decoration-transparent underline-offset-4 hover:decoration-current"
                >
                  {social.label}
                </a>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
~~~

- [ ] **Step 4: Replace the old About function**

Import AboutPage:

~~~jsx
import { AboutPage } from "./pages/AboutPage.jsx";
~~~

Delete the existing About function and replace the About branch with:

~~~jsx
{view.page === "about" && <AboutPage profile={profile} />}
~~~

Remove lucide imports and helper functions that no remaining code uses. At this point src/Portfolio.jsx should contain imports, profile, projects, and the Portfolio state shell only.

- [ ] **Step 5: Run About tests, all unit tests, and build**

Run: npm test -- src/pages/AboutPage.test.jsx

Expected: PASS, 1 test passed.

Run: npm test

Expected: PASS, 9 tests passed.

Run: npm run build

Expected: PASS.

- [ ] **Step 6: Commit the About view**

~~~bash
git add src/pages/AboutPage.jsx src/pages/AboutPage.test.jsx src/Portfolio.jsx
git commit -m "feat: rebuild complete about view"
~~~

---

### Task 6: Lock Responsive, Keyboard, and Visual Acceptance

**Files:**

- Modify: package.json
- Modify: package-lock.json
- Create: playwright.config.js
- Create: e2e/portfolio.spec.js
- Modify: any source file that fails a listed acceptance check

**Interfaces:**

- Consumes: the completed three-view site and all navigation labels
- Produces: npm run test:e2e plus a verified desktop/mobile handoff

- [ ] **Step 1: Install Playwright and add the e2e script**

Run:

~~~bash
npm install --save-dev @playwright/test
~~~

Run:

~~~bash
npx playwright install chromium
~~~

Add this script to package.json:

~~~json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
~~~

- [ ] **Step 2: Configure a deterministic local server**

Create playwright.config.js:

~~~js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
});
~~~

- [ ] **Step 3: Write breakpoint, overflow, and navigation coverage**

Create e2e/portfolio.spec.js:

~~~js
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "feature-above", width: 901, height: 800 },
  { name: "feature-below", width: 899, height: 800 },
  { name: "column-above", width: 721, height: 800 },
  { name: "column-below", width: 719, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 568 },
];

const projects = [
  "1/5 Scale Autonomous Off-Road Vehicle",
  "Vision-Guided Robotic Arm for Automated Lab Operations",
  "Sensing and State Estimation in Robotics",
  "Planning and Learning in Robotics",
  "ML-Supported Nanoparticle & Cell-Membrane Selection",
  "Embedded & Digital Control Systems",
];

async function expectNoHorizontalOverflow(page) {
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
  );
  expect(fits).toBe(true);
}

for (const viewport of viewports) {
  test("homepage fits " + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Hi, I’m Edward Wang." })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}

test("all views remain reachable and fit at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });

  await page.goto("/");
  await page.getByRole("button", { name: "About" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeFocused();
  await expectNoHorizontalOverflow(page);

  for (const project of projects) {
    await page.goto("/");
    await page.getByRole("button", { name: "Open project: " + project }).click();
    await expect(page.getByRole("heading", { level: 1, name: project })).toBeFocused();
    await expectNoHorizontalOverflow(page);
  }
});

test("keyboard users can skip, navigate, return, and continue to the next project", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await page.getByRole("button", {
    name: "Open project: 1/5 Scale Autonomous Off-Road Vehicle",
  }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "1/5 Scale Autonomous Off-Road Vehicle",
    })
  ).toBeFocused();

  await page.getByRole("button", { name: "Vision-Guided Robotic Arm for Automated Lab Operations" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Vision-Guided Robotic Arm for Automated Lab Operations",
    })
  ).toBeFocused();

  await page.getByRole("button", { name: "Back to Work" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { level: 1, name: "Hi, I’m Edward Wang." })
  ).toBeFocused();
});

test("project media is user initiated and documents have fallback links", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", {
    name: "Open project: Planning and Learning in Robotics",
  }).click();

  await expect(page.getByAltText("DoorKey overview")).toHaveCount(0);
  await page.getByRole("button", { name: "Play DoorKey overview" }).click();
  await expect(page.getByAltText("DoorKey overview")).toBeVisible();
  await page.getByRole("button", { name: "Pause DoorKey overview" }).click();
  await expect(page.getByAltText("DoorKey overview")).toHaveCount(0);

  await page.goto("/");
  await page.getByRole("button", {
    name: "Open project: Sensing and State Estimation in Robotics",
  }).click();
  await expect(page.getByRole("link", { name: "Open PR1 - Pose Estimation" })).toHaveAttribute(
    "href",
    "/ece276a/ece276_pr1.pdf"
  );
});
~~~

- [ ] **Step 4: Run e2e first and fix every concrete failure**

Run: npm run test:e2e

Expected: PASS, 11 tests passed.

If a test fails, change only the source tied to that assertion, rerun the failing Playwright test by its printed title, then rerun the full e2e command.

- [ ] **Step 5: Enforce the approved anti-pattern contract**

Run:

~~~bash
rg -n "rounded-|shadow-|bg-gradient|font-serif|animate-|backdrop-blur|Available on request|autoPlay" src index.html
~~~

Expected: no matches and rg exits with status 1.

Run:

~~~bash
rg -n "fonts.googleapis.com|fonts.gstatic.com" index.html
~~~

Expected: no matches and rg exits with status 1.

- [ ] **Step 6: Run the complete automated verification**

Run: npm test

Expected: PASS, 9 tests passed.

Run: npm run test:e2e

Expected: PASS, 11 tests passed.

Run: npm run build

Expected: PASS.

- [ ] **Step 7: Perform the visual acceptance pass**

Start:

~~~bash
npm run dev -- --host 127.0.0.1 --port 5173
~~~

Use the browser verification workflow to capture the homepage, one PDF project, the mixed-video project, the planning/GIF project, and About at 1440x900, 1024x768, 390x844, and 320x568.

For every capture, verify:

- The first impression is quiet, personal, and technically specific.
- H1 never exceeds 42px.
- The 1/5 scale vehicle is visually dominant without becoming cinematic.
- Project hierarchy reads as 1 featured, 2 core, and 3 compact.
- No content appears inside rounded cards.
- The c12.ai and state-estimation portrait images crop without losing their subject.
- At 899px the featured image precedes its copy.
- At 719px every section is one column with 16px page padding.
- Problem, My contribution, and Outcome become a vertical definition list on mobile.
- Focus rings are visible and are not clipped.
- PDF, video, and GIF controls remain usable without preloading all large media.

- [ ] **Step 8: Commit the acceptance suite and final corrections**

~~~bash
git add package.json package-lock.json playwright.config.js e2e/portfolio.spec.js src index.html
git commit -m "test: verify responsive portfolio redesign"
~~~

---

## Completion Gate

Before presenting the redesign as complete:

1. Run git status --short and confirm only intentional files remain.
2. Run npm test and report the exact passed-test count.
3. Run npm run test:e2e and report the exact passed-test count.
4. Run npm run build and report the emitted bundle summary.
5. Confirm all four visual review widths and all three views were inspected.
6. Confirm the two MP4 files report H.264/AAC and the old MOV files are absent.
7. Confirm the final diff contains no generated dist, top-level assets, or temporary .superpowers preview files.
