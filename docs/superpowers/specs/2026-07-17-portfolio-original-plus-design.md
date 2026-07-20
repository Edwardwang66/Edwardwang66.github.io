# Edward Wang Portfolio — Original+ Design Specification

Status: approved for implementation

Date: 2026-07-17

Revised: 2026-07-20

## 1. Supersession and implementation foundation

This specification supersedes both:

- `docs/superpowers/specs/2026-07-16-portfolio-redesign-design.md`
- `docs/superpowers/plans/2026-07-16-portfolio-redesign.md`

The implementation foundation is the original portfolio on `main`, matching
the visual language of <https://edwardwang66.github.io/>. The rejected
`codex/portfolio-redesign` visual system must not be used as the page shell.
Style-neutral work from that branch—tests, accessible media controls, asset
optimization, or content extraction—may be selectively ported only when it
does not change the Original+ design described here.

## 2. Objective

Evolve the existing portfolio without redesigning away the qualities that make
it feel personal and premium. The result should read as an authored engineering
portfolio: editorial typography, confident whitespace, a restrained project
index, and carefully selected technical evidence.

The site must communicate Edward's expanded practice across:

- Robotics
- Agentic AI
- AI for Science

Primary audiences remain robotics and AI hiring managers, professors,
laboratories, and research collaborators.

## 3. Approved direction

The approved direction is **Original+**:

- Approximately 80% of the original visual language is preserved.
- Approximately 20% is a functional upgrade drawn from the approved B3/M1
  exploration.
- The B3 archive aesthetic itself is rejected.

The Original+ prototype established the approved design read:

- White page, narrow editorial measure, Source Serif Pro headings, and Inter
  body copy
- Original black circular EW mark and translucent navigation
- Compact, rounded portrait with a natural crop
- Text-led project index with only one controlled image expanded at a time
- Blue and gold used as small markers, not as a full theme
- Bioyond Robotics presented as the current practice
- An invisible Apple craft layer for response, motion, material, and typography
  precision without adopting an Apple product-page aesthetic

## 4. Design principles

1. Preserve the original voice before adding new structure.
2. Typography carries the hierarchy; decoration stays secondary.
3. Project images are evidence, not wallpaper.
4. One active image is enough to orient the reader.
5. Technical depth is created through selection, captions, and outcomes—not
   through displaying every asset at once.
6. Edward should feel like a person with an evolving practice, not a packaged
   product or a résumé template.
7. Motion explains state changes and never competes with the content.

## 5. Explicit non-goals

Do not introduce:

- The B3 vertical archive rail, folio frame, or gray paper-on-paper background
- A fully sans-serif visual system
- Dark control-room styling
- Large blue or gold surfaces
- Bento grids, dashboard cards, decorative glass cards, or dense fact panels;
  functional translucency is reserved for the existing navigation only
- Crop marks, numbered portrait labels, offset backing plates, or theatrical
  photo treatments
- Full-width image walls or equal visual weight for every project
- Scanning lines, continuous drift, parallax, marquee, cursor effects, or
  decorative entrance sequences
- SF Pro or another Apple-identifying font replacement, device mockups,
  hardware silhouettes, or product-launch-style scroll storytelling
- Invented technical metrics, fake interface diagrams, or exaggerated claims
- Framework migration or a new routing system

## 6. Information architecture

Preserve the original three-view structure and existing in-memory navigation:

1. Work homepage
2. Project detail
3. About

Preserve all six project records and their current order. Existing reports,
videos, GIFs, and galleries remain reachable, but they no longer need to be
mounted or displayed simultaneously.

The content model must add the Bioyond Robotics experience and the Agentic AI
skill group while keeping existing education, experience, and project data.

## 7. Homepage

### 7.1 Navigation

Keep the original navigation composition and give only this structural layer a
restrained Apple-style material treatment:

- Sticky header using approximately 76–86% white, `18–22px` backdrop blur, and
  restrained saturation no higher than approximately 140%
- Black circular `EW` mark and `Edward Wang` label on desktop
- `Work` and `About` controls on the right
- Active view shown with the original restrained outlined pill treatment
- Header height approximately 64–66px
- A 10–14px scroll-edge fade appears only while content passes beneath the
  header after approximately 4px of page scroll, replacing a permanently
  visible hard divider

Do not add a contact CTA, theme switcher, archive label, or secondary nav row.
Do not apply the translucent material to project panels, cards, images, or page
sections, and do not stack translucent surfaces.
When `backdrop-filter` is unavailable, fall back to an approximately 96% opaque
white header with a subtle neutral lower border; navigation legibility may not
depend on blur support.

### 7.2 Hero

Use the approved content hierarchy:

1. Status line: `Pudong, Shanghai · Agentic AI Engineer Intern at Bioyond Robotics`
2. Positioning label: `Robotics · Agentic AI · AI for Science`
3. Heading: `I build intelligent systems that carry intent into reliable execution.`
4. Supporting copy: `Working across agentic scientific workflows, perception, planning, control and real hardware—where reliability, traceability and human oversight matter.`
5. Primary action: `Selected work`
6. Secondary action: `Current practice`

Preserve the original green status dot and its quiet pulse. The positioning
label may use deep blue; it must remain much smaller than the heading.

The heading remains Source Serif Pro, regular weight, and editorial rather than
marketing-heavy. Target approximately 56–64px on wide desktop, 42–48px on
tablet, and 36–44px on mobile.

### 7.3 Portrait

The portrait remains part of the hero, not a separate identity card.

- Desktop width: approximately 184–220px
- Mobile width: approximately 112–144px
- Rounded corners: approximately 15–20px
- Natural crop with Edward clearly visible
- One very light shadow, a low-contrast gold inner line, and at most one short
  deep-blue edge detail
- No glow, gradient halo, heavy `shadow-2xl`, label plate, crop marks, or offset
  color block

The portrait must stay visually smaller than the heading and may not dominate
the first mobile viewport.

Use the approved prototype treatment as the upper limit: a 1px gold inner line
at approximately 28% opacity, one 28px bottom-right blue rule at approximately
42% opacity, and a soft two-layer shadow no stronger than
`0 20px 38px rgba(23,42,54,.13), 0 3px 9px rgba(24,24,23,.06)`. Do not add a
second corner, a label, or any other edge ornament.

### 7.4 Current practice

Place a concise editorial record between the hero and selected work:

- Date: `Jul 2026 — Present`
- Location: `Pudong, Shanghai, China · On-site`
- Company: `Bioyond Robotics`
- Role: `Agentic AI Engineer Intern · AI for Science`
- Summary: designing and developing an agentic AI platform for scientific
  workflow automation; building modular planning, orchestration, validation,
  and feedback mechanisms for executable, adaptive, auditable laboratory
  processes

This is a structured text row, not a résumé card. It should introduce the new
work without competing with the project index.

### 7.5 Selected work index

Keep the original text-led numbered list for all six projects. Each collapsed
row contains:

- Two-digit index
- Source Serif Pro project title
- Concise role or domain
- Year
- Directional state icon

Rows retain thin neutral dividers and a quiet hover response. Do not show six
simultaneous thumbnails.

The first project is expanded by default. Exactly one project is active at any
time.

#### Desktop interaction

- Clicking a project row expands its image and evidence note.
- The previously active project closes in the same state transition.
- Clicking the already active row leaves it open; the list never reaches a
  zero-open state.
- Keyboard activation with Enter or Space has the same behavior.
- Focus remains on the activated row.

#### Mobile interaction

- The first project begins open.
- As the reader scrolls naturally and the next project header enters the middle
  reading band of the viewport, the previous image closes and the next image
  opens.
- Scrolling upward reverses the sequence.
- The page must not snap, hijack momentum, or programmatically move the scroll
  position.
- Tapping a row still activates it. A short interaction lock prevents the
  scroll observer from immediately undoing the tap.
- Use a reading line at 42% of the viewport height. Compare project trigger
  centers—not expanding panel bounds—to that line.
- Keep the current item until another trigger is at least 64px closer to the
  reading line, preventing drawer-height changes from causing oscillation.
- When distances tie, choose the next project in the current scroll direction.
- After a tap, pause automatic activation for 900ms; continuing to scroll more
  than 96px may release the lock early.
- Exactly one item remains active.

#### Interaction semantics

Each row consists of an independent trigger button followed by a sibling panel.
The trigger owns `aria-expanded` and `aria-controls`; the panel has the matching
`id`. `Open project` is a normal link inside the sibling panel and is never
nested inside the trigger. Inactive panels must be removed from the tab order
and accessibility tree after their closing transition.

Compact controls such as navigation pills and hero actions respond on
pointer-down with a scale of approximately `0.98–0.99`, settling within
approximately 80–100ms. Keyboard activation preserves the visible focus ring
and receives an equivalent immediate color response without requiring scale.
Full-width project triggers do not scale; they respond immediately
through background tone, active number, and at most a 2px arrow movement so the
document never appears to jump.

#### Expanded content

Each active row contains:

- One selected image when authentic project media exists
- A small evidence label
- One outcome-led sentence or short heading
- A concise supporting paragraph
- `Open project` link

Projects without authentic media expand the same outcome-led text treatment
without an image. Do not generate a decorative gradient, stock image, or fake
technical figure merely to fill the media slot. They remain part of the same
single-active sequence.

Target media size:

- Desktop: approximately 420–520px wide and 220–280px high
- Tablet: approximately 260–420px wide and 180–230px high
- Mobile: available content width and approximately 180–220px high

Small or technical images remain near natural scale and use `object-fit:
contain`; photographic evidence may use a controlled crop. Images use a subtle
12–16px radius and only a low-opacity border or shadow.

Approved homepage media selection:

| Project | Expanded evidence |
| --- | --- |
| 01 · Autonomous Off-Road Vehicle | `/ece191/2.png`, controlled photographic crop |
| 02 · Vision-Guided Lab Robotics | Optimized version of `/c12.ai/1.JPG`, with the workcell kept visible |
| 03 · Sensing & State Estimation | `/ece276a/1.png`, contained rather than cropped |
| 04 · ML-Supported Nanoparticle Selection | Text-only until authentic project media is supplied |
| 05 · Planning & Learning | A still DoorKey poster near native scale; do not autoplay the GIF |
| 06 · Embedded & Digital Control | Text-only until authentic project media is supplied |

## 8. Project detail

Project pages retain the original editorial typography but replace the current
full-width media wall with a curated technical-journal structure.

Order:

1. Back to Work
2. Project number, year, and context
3. Project title
4. One-sentence summary
5. Compact facts row or rail: Role, Year, Stack, and Links when present
6. Controlled lead image when authentic media exists
7. Context
8. Challenge
9. Contribution
10. Outcome
11. Up to three selected evidence plates when authentic media exists
12. Collapsed `More evidence` archive when additional media exists
13. Tools and technologies as restrained text
14. Next project

Media rules:

- Landscape lead image: maximum approximately 680–720px wide and 360–440px
  high
- Portrait media: maximum approximately 320–360px wide and 520px high
- Technical plots and diagrams: maximum approximately 680–720px wide, with
  `object-fit: contain`
- Mobile lead media: no taller than approximately 50vh
- Low-resolution images: do not enlarge beyond natural size or approximately
  1.25× natural dimensions
- GIFs: show a still cover until the visitor chooses Play
- Videos: native controls, no autoplay, and a stable reserved frame
- PDFs: descriptive open link first; lazy preview only on request

Every evidence item needs a short caption explaining what it proves. File names
alone are not acceptable captions.

Text-only projects omit both the selected-evidence and `More evidence` sections
instead of displaying an empty container or invented placeholder.

Approved detail-media map:

| Project | Lead | Selected evidence and caption intent | More evidence |
| --- | --- | --- | --- |
| 01 · Autonomous Off-Road Vehicle | `/ece191/2.png` | `/ece191/1.png`: completed platform; `/ece191/3.png`: camera calibration and feature validation; `/ece191/4.png`: LiDAR point-cloud evidence | None unless authentic new media is supplied |
| 02 · Vision-Guided Lab Robotics | Optimized `/c12.ai/1.JPG` | Compatible versions of `IMG_1671` and `IMG_1672`: automated lab operation and arm-execution runs | None |
| 03 · Sensing & State Estimation | `/ece276a/1.png`, contained | Lead figure plus a concise report index; do not render three full PDF previews as evidence plates | Three PDF open links, with lazy preview on request |
| 04 · ML-Supported Nanoparticle Selection | No media | No evidence plates | None |
| 05 · Planning & Learning | Still poster derived from the DoorKey overview, near native scale | User-initiated playback for 5×5 Normal, 10×10 Episode 15, and E4 Single Cube to represent discrete planning, scale, and continuous control | Remaining runs and both reports, collapsed |
| 06 · Embedded & Digital Control | No media | No evidence plates | None |

Outcome must appear before the optional evidence archive so the project story
is complete without scrolling through every asset.

## 9. About

Preserve the original About page's Source Serif Pro heading, readable body
measure, and personal tone.

The opening should position Edward across robotics, Agentic AI, and AI for
Science without copying the homepage verbatim.

Portrait behavior:

- Use a compact editorial portrait aligned with the opening copy.
- Keep it approximately 180–240px on desktop and 128–160px on mobile.
- Remove the current mobile 310px treatment, gradient glow, and heavy shadow.
- Reuse the same restrained edge treatment as the homepage.

Experience order:

1. Bioyond Robotics — Agentic AI Engineer Intern · AI for Science — Jul 2026 to
   Present — Pudong, Shanghai, China · On-site
2. Liangfang Zhang Lab, UC San Diego — Undergraduate Researcher
3. c12.ai — Engineering Intern

Approved Bioyond summary:

`Designing and developing an agentic AI platform for scientific workflow automation. Building modular planning, orchestration, validation and feedback workflows that translate scientific intent into executable, verifiable and adaptive laboratory processes—with emphasis on reliability, traceability and human oversight.`

Add an `Agentic AI & Workflow Systems` skill group containing:

- Agent workflows
- Planning and orchestration
- Validation and feedback loops
- Traceability
- Human oversight

Keep the other skills, education, selected coursework, languages, and contact
content, but render dense skill collections as editorial text lists rather than
a large field of pills.

## 10. Visual system

### 10.1 Color

Neutral colors remain dominant:

- Page: `#FFFFFF`
- Optional soft support band: `#F7F7F3`
- Primary ink: `#181817`
- Secondary text: `#71716D`
- Rule: `#E7E6E0`
- Deep blue: `#274D66`
- Antique gold: `#A48645`
- Availability green: preserve the original muted green

Blue and gold together should occupy no more than approximately 5–8% of the
visible interface. Gold is reserved for active numbers, current-state markers,
short rules, and very small labels. Deep blue is reserved for positioning copy,
active titles, links, and focus treatment.

Do not tint the page blue or beige. Do not convert the whole interface into a
blue-and-gold theme.

### 10.2 Typography

- Display and project titles: Source Serif Pro
- Body, metadata, controls, and captions: Inter
- Wide desktop hero: approximately 56–64px / 1.0–1.05
- Body: 16–18px / approximately 1.55–1.7
- Project index titles: approximately 24–32px
- Labels and metadata: approximately 9–12px
- Normal body measure: approximately 60–70 characters
- Enable `font-optical-sizing: auto` where the loaded font supports it
- Hero tracking: approximately `-0.02em` to `-0.03em`
- Project-title tracking: approximately `-0.012em` to `-0.018em`
- Body tracking: approximately `0`; small uppercase labels may use
  approximately `0.08em` to `0.14em`
- Type and related spacing use responsive `rem`, `em`, and `clamp()` values so
  browser text-size changes do not break the layout

Do not replace this pairing with Helvetica-only typography.

### 10.3 Layout and surfaces

- Maximum main width: approximately 1024px
- Typical net content width on wide desktop: approximately 944px
- Major vertical intervals: approximately 88–128px on desktop
- White space is structural and should not be filled with decorative modules
- Use hairlines for grouping
- Rounded corners are reserved for the portrait, compact media, and the
  original pill controls
- Ordinary content is not wrapped in cards
- The navigation is the only translucent material; content surfaces remain
  opaque white or the approved soft support color

## 11. Motion

The approved motion language remains M1 archive unfold, but its behavior follows
the invisible Apple craft layer rather than a fixed cinematic timeline.

### 11.1 Immediate response

- Visual feedback begins on pointer-down, not after click release.
- Compact controls use the 80–100ms press treatment defined above.
- Project triggers remain fully operable while a previous disclosure is moving.
- The 900ms mobile observer pause suppresses automatic scroll activation only;
  it never blocks direct tap, keyboard, or pointer input.

### 11.2 Interruptible disclosure spring

- Project geometry uses a critically damped spring with damping ratio `1.0`,
  response approximately `0.36–0.42s`, and no overshoot.
- A new project selection retargets the current on-screen presentation value;
  it does not wait for the previous open or close animation to finish.
- Rapid A → B → A switching must preserve continuity without a jump, delayed
  input, or velocity brick wall.
- The image reveal may combine the spring-driven disclosure with a restrained
  clip or mask and opacity change, but it may not bounce, zoom, or drift.
- Entry and exit use the same anchored path: evidence opens from its project row
  and returns to that row.

### 11.3 Performance boundaries

- Use one shared, local `requestAnimationFrame` spring primitive for disclosure
  progress; do not add Framer Motion or another heavyweight animation framework
  solely for this interaction.
- Measure disclosure content only when its target changes. Do not read layout on
  every document scroll frame beyond the existing trigger-position calculation.
- Use transform and opacity for the visual layer where possible, reserve media
  dimensions, and remove `will-change` after motion settles.
- Only the single navigation layer uses backdrop blur.

### 11.4 Motion and material preferences

- `prefers-reduced-motion: reduce`: replace the spring and spatial reveal with a
  160–200ms opacity cross-fade or an immediate state change.
- `prefers-reduced-transparency: reduce`: use an opaque white navigation with no
  backdrop blur or saturation.
- `prefers-contrast: more`: use an opaque or near-opaque navigation, darker text,
  and a defined contrasting lower border instead of the soft edge fade.
- Do not add sound, vibration, simulated haptics, or looping ambient motion.

## 12. Responsive behavior

At widths below approximately 900px:

- Reduce hero and portrait scale
- Simplify project-row metadata
- Keep active project content in two columns while space allows
- Keep the project image smaller than the surrounding text block

At widths below approximately 640px:

- Use 16px page gutters
- Keep the hero heading and compact portrait in the first viewport where
  practical
- Stack expanded project image and note
- Activate the scroll-driven single-open behavior
- Keep every touch target at least 44px high
- Prevent all horizontal overflow

The mobile list may use additional vertical space to create a stable reading
band, but it must not force scroll snapping.

## 13. Technical boundaries

Keep the existing React, Vite, Tailwind, and GitHub Pages stack. Preserve the
current state-based Work, About, and project navigation unless a separate
routing change is approved later.

The new implementation plan should begin from the original `main` visual
foundation. Do not continue by restyling the rejected B3/Quiet Personal branch.

Content remains data-driven. The project active state is a single project ID or
index shared by click, keyboard, and mobile scroll activation. There must not be
independent booleans that allow multiple drawers to remain open.

Motion state is separate from content state: one shared disclosure primitive
receives the active project ID and retargets from its current presentation
value. Components must not create per-project timers or block interaction until
an animation callback finishes.

## 14. Accessibility and fallbacks

- Project rows are semantic buttons with `aria-expanded` and a controlled panel
- Active changes do not steal focus or announce decorative state excessively
- Keyboard focus is clearly visible in deep blue
- All meaningful images have project-specific alt text
- Captions remain visible text rather than `aria-label`-only content
- A declared media asset that fails to load shows a neutral bordered fallback
  with the project title; intentionally text-only projects do not render a
  fallback container
- External links have descriptive accessible names
- Videos never autoplay and retain native controls
- Every PDF remains accessible through a normal link
- Contrast for body text and controls meets WCAG AA
- The green availability indicator is accompanied by text and is not the sole
  carrier of status
- Reduced motion, reduced transparency, and increased contrast each have an
  independent fallback; one preference must not be used as a proxy for another

## 15. Validation and acceptance

The implementation is acceptable when all of the following pass:

- The rendered homepage is recognizably the original portfolio before it is
  recognized as a redesign.
- The Source Serif Pro and Inter hierarchy matches the original's editorial
  character.
- Bioyond Robotics appears on both the homepage and About view with the approved
  role, date, location, and concise description.
- All six projects remain reachable.
- Exactly one homepage project is expanded at all times.
- Desktop click and keyboard activation switch the active project correctly.
- Mobile scrolling opens projects sequentially in both directions without
  moving the user's scroll position.
- Compact controls visibly respond by the next rendered frame after
  pointer-down, while full-width project rows remain geometrically stable.
- Rapid A → B → A project changes remain interruptible, continuous, and free of
  bounce or input lockout.
- No homepage project image exceeds the approved controlled scale.
- Project detail Outcome appears before optional extra evidence.
- Project lead media and evidence obey role-specific size limits.
- Videos, GIFs, PDFs, and missing images use the specified controls and
  fallbacks.
- Desktop visual checks pass at 1440px and 1024px.
- Mobile visual checks pass at 390px and 320px.
- Keyboard navigation, focus visibility, and reduced motion are verified.
- Reduced-transparency and increased-contrast navigation fallbacks are verified.
- There is no horizontal overflow.
- `npm test`, the production build, and end-to-end tests pass.
