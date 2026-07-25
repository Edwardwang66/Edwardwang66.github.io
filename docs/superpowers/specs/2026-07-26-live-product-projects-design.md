# Live Product Projects

Status: approved

Date: 2026-07-26

## 1. Objective

Add Edward's two current live products to the portfolio as the first two
Selected Work entries while preserving the restrained Original+ editorial
system:

1. Easy-A Radar — `Jul 2026 — Present`
2. Multi-Market Stock Research Dashboard — `Jun 2026 — Present`

Both entries must have complete project pages, accurate product boundaries,
real interface evidence, and direct links to the live product and source
repository. The change must not turn the homepage into a card grid or a
separate product showcase.

## 2. Approved direction

Use **A: Editorial product proof**.

The two products join the existing archive rather than appearing in a new
featured-products section. Their additional weight comes from their position,
real interface evidence, complete project pages, and live links—not from larger
cards, louder colors, or decorative animation.

## 3. Homepage hierarchy

The Selected Work order is:

1. Easy-A Radar
2. Multi-Market Stock Research Dashboard
3. ECE 276B
4. ECE 276A
5. Autonomous Off-Road Vehicle
6. Laboratory Robotic Arm
7. AI-Assisted Drug Delivery
8. Embedded and Digital Systems

The existing Selected Experience order remains unchanged:

1. Bioyond Robotics
2. c12.ai

Project numbering is generated from this order and must remain contiguous.

## 4. Archive presentation and interaction

### 4.1 Visual treatment

- Both products use real interface screenshots as their primary evidence.
- The archive presents each screenshot in the existing restrained evidence
  frame, not as a full-width promotional hero.
- The archive frame uses a `13 / 7` aspect ratio, is capped at `520px` wide on
  desktop, and becomes full-column width on mobile.
- Screenshots are cropped from the top of the interface so the product identity
  and primary controls remain legible.
- Edge treatment consists of a narrow inner fade at the left and right edges
  and the existing blue hairline. A `4px` gold dot precedes a `Live product`
  label beside the timestamp. Do not add heavy shadows, glass effects,
  gradients over the full image, or device mockups.
- Archive screenshots use `saturate(0.9) contrast(0.98)` to sit naturally
  beside the existing photography and course evidence. Project-page lead
  screenshots remain unfiltered. The interface itself must not be altered.

### 4.2 Disclosure behavior

- Desktop remains click-driven.
- Exactly one archive item is expanded at a time.
- Opening a second project closes the first.
- On mobile, the existing viewport-driven activation advances the expanded
  item as the user scrolls: the preceding item closes and the current item
  opens.
- Expansion uses restrained height, opacity, and crop transitions only.
- Reduced-motion users receive immediate state changes without spring motion.
- Live Site and GitHub are independent link targets. Activating either link
  must not toggle the disclosure or open the internal project page.
- Activating the project detail action opens the existing hash-based project
  view.

## 5. Easy-A Radar

### 5.1 Identity and links

- Stable project ID: `easy-a-radar`
- Title: `Easy-A Radar`
- Role: `Product design, data integration, and front-end engineering`
- Timestamp: `Jul 2026 — Present`
- Live site: `https://easy-a-radar.vercel.app/`
- Source: `https://github.com/Edwardwang66/ucsd-easy-a-radar`

### 5.2 Positioning

Present Easy-A Radar as a practical UCSD course-intelligence and academic
planning tool. Its value is the workflow it creates from fragmented information,
not a claim that it replaces official academic systems.

### 5.3 Project-page narrative

The page follows this order:

1. **Overview** — a live student tool that combines course history, current
   teaching information, scheduling, and degree planning.
2. **Problem** — students must compare historical grade outcomes, instructors,
   current offerings, time conflicts, and program requirements across multiple
   sources.
3. **System** — static interface and structured datasets with current-term
   instructor mapping and local planning workflows.
4. **What shipped** — course ranking, professor context, current-term filters,
   schedule building, conflict detection, calendar and ICS export, campus map,
   undergraduate requirements, and graduate degree planning.
5. **Reliability and limits** — data is a planning aid; current offerings and
   academic requirements can change and must be confirmed with UCSD and an
   advisor.
6. **Stack** — static HTML/CSS/JavaScript, structured JSON data, optional Vercel
   feedback function, and the documented collection/processing scripts.
7. **Links** — Live Site and GitHub.

The copy states that the interface uses real 2015–2026 course-grade
distributions and RateMyProfessors context. It must not imply official UCSD
endorsement, guaranteed course availability, or guaranteed academic outcomes.

## 6. Multi-Market Stock Research Dashboard

### 6.1 Identity and links

- Stable project ID: `stock-research-dashboard`
- Title: `Multi-Market Stock Research Dashboard`
- Role: `Full-stack product engineering and research automation`
- Timestamp: `Jun 2026 — Present`
- Live site: `https://stock-analysis-ten-phi.vercel.app/`
- Source: `https://github.com/Edwardwang66/stock-analysis`

### 6.2 Positioning

Present the dashboard as a personal, self-hostable multi-market research
workbench. It organizes data acquisition, analysis, tracking, and research
records; it is not a brokerage or automated trading system.

### 6.3 Project-page narrative

The page follows this order:

1. **Overview** — one research surface for US, Hong Kong, A-share, crypto, and
   index monitoring.
2. **Problem** — market data, technical context, watchlists, alerts, paper
   positions, and research notes otherwise live in disconnected tools.
3. **System** — a Next.js interface backed by quote/OHLCV adapters, optional
   FastAPI services, Git-backed feeds, and Python research automation.
4. **What shipped** — multi-market dashboards, technical panels, screener,
   tracker, watchlist, alerts, paper portfolio, intelligence views, reports, and
   automated data refresh paths.
5. **Reliability and limits** — public providers may delay, throttle, or fail;
   the product does not execute trades, does not provide multi-user
   authentication, and is not investment advice.
6. **Stack** — Next.js, React, TypeScript, lightweight-charts, optional FastAPI,
   and Python automation.
7. **Links** — Live Site and GitHub.

The page must not publish fabricated returns, user counts, latency claims, or
data-coverage guarantees.

## 7. Evidence and media

- Store portfolio-owned screenshots as local static assets. Do not iframe the
  live applications or request their screenshots at runtime.
- Use one verified lead screenshot per product initially.
- Do not manufacture secondary evidence merely to fill a gallery.
- Each screenshot requires useful alternative text naming the visible product
  interface.
- If an image fails to load, its frame preserves the intended aspect ratio and
  retains the alternative text and surrounding project description.
- Temporary brainstorming assets under `.superpowers/` are research inputs,
  not production paths. Implementation must copy approved images into a normal
  portfolio asset directory with stable names.

## 8. Data and component boundaries

- `src/data/portfolio.js` remains the single source of truth for project
  records, ordering, dates, evidence, copy, and links.
- Reuse `ProjectArchive`, `ProjectPage`, and `ProjectMedia`.
- Add an optional `storySections` array to project records. Each item contains
  a stable section label and body copy. `ProjectPage` renders this array when
  present and retains the existing Context/Challenge/Contribution/Outcome
  fallback for all current projects.
- The two product records use `storySections` to implement the approved
  Overview/Problem/System/What shipped/Reliability and limits sequence.
- `ProjectArchive` derives Live Site and GitHub actions from the existing
  project `links` data and renders them inside the expanded panel, outside the
  disclosure button.
- Reuse the existing hash navigation and mobile activation system.
- Add no runtime dependency on either live product.
- Add no new animation library, content service, analytics service, or remote
  data fetch.
- Do not modify the Easy-A Radar or stock-analysis repositories as part of this
  portfolio change.
- Avoid unrelated refactoring. A focused helper or small component adjustment
  is allowed only when needed to keep outbound links independent from the
  disclosure trigger.

## 9. Failure handling and accessibility

- External links open in a new tab with appropriate opener isolation.
- A live product outage must not prevent the portfolio route, copy, or local
  screenshot from rendering.
- Keyboard users can open each archive item and reach Live Site, GitHub, and
  project-detail actions in a predictable order.
- Disclosure state is exposed through the existing accessible expanded-state
  semantics.
- Focus styling remains visible against the white editorial background.
- The implementation honors `prefers-reduced-motion` and the portfolio's
  reduced-transparency treatment.
- Core project identity and dates render without a remote request. Descriptions
  and links render as soon as their local disclosure or project view opens.

## 10. Testing and acceptance criteria

### 10.1 Data and unit coverage

- Project data contains both approved stable IDs, timestamps, live URLs, and
  GitHub URLs.
- The first four project IDs are exactly:
  `easy-a-radar`, `stock-research-dashboard`, `planning-control`,
  `state-estimation`.
- Numbering remains contiguous after the two insertions.
- Both complete project pages render the approved section sequence and boundary
  statements.
- Clicking Live Site or GitHub does not toggle the archive item or invoke the
  internal project navigation callback.
- Clicking the internal detail action opens the correct project route.
- At most one archive item is expanded after any desktop interaction.
- Mobile activation advances in project order and closes the prior item.
- Missing media preserves a stable evidence frame and accessible fallback.

### 10.2 Browser acceptance

- Verify the homepage and both project pages at representative desktop and
  mobile widths.
- Verify desktop click disclosure and mobile scroll activation.
- Verify keyboard navigation, visible focus, reduced motion, and alternative
  text.
- Verify outbound `href` values without making third-party availability a hard
  automated-test dependency.
- Confirm no new browser-console errors.
- Run the complete unit suite, production build, and existing browser suite.

### 10.3 Release boundary

- Present desktop and mobile results for visual review after implementation and
  local verification.
- Do not push, merge, or deploy until the user explicitly approves the
  implemented result.

## 11. Non-goals

- Redesigning the hero, Selected Experience, navigation, or global type system.
- Redesigning either live product.
- Embedding either product in the portfolio.
- Adding product analytics, a CMS, authentication, live market data, or UCSD
  data collection to the portfolio.
- Creating fictional metrics, testimonials, awards, or additional screenshots.
