# Curry Companion Design

Status: approved

Date: 2026-07-26

## 1. Objective

Add Edward's published Curry Dog Winter Codex pet to the portfolio as a
restrained homepage companion.

The companion is a small decorative presence fixed to the browser's lower-right
corner. It does not patrol the page or bounce between edges. Most of the time it
remains in its native Idle state, occasionally looks around, and waves once
when the pointer first approaches it during a homepage visit.

The feature must preserve the Original+ editorial hierarchy. It may add
personality, but it must not behave like a floating support widget, obscure the
portfolio's content, or compete with the portrait, project archive, social
links, and calls to action.

## 2. Approved direction

Use a **fixed quiet companion**:

- Position: browser viewport lower-right corner.
- Route scope: homepage only.
- Desktop motion: Idle, occasional Look around, and one pointer-triggered Wave.
- Mobile motion: static Idle.
- Reduced motion: static Idle on every viewport.
- No walking, running, jumping, clicking, sound, speech bubble, label, platform
  badge, or external-link behavior.

This supersedes the earlier exploratory walking-track concepts. No horizontal
or vertical pet movement remains in scope.

## 3. Source identity and asset provenance

The source pet is Edward's published package:

- Stable slug: `curry-dog-winter`
- Display name: `咖喱狗 Curry`
- Package format: Codex pet v2
- Source atlas: `1536 × 2288`
- Geometry: 8 columns × 11 rows
- Cell size: `192 × 208`
- Source states include Idle, Run right, Run left, Waving, Jumping, Failed,
  Waiting, Running, Review, Look around right, and Look around left.

Implementation must acquire the approved package through its stable published
download or asset endpoint and verify the atlas contract before producing the
portfolio derivative. The website must not depend on that remote endpoint at
runtime.

The derivative must use only these approved source rows:

1. Idle
2. Waving
3. Look around — right side
4. Look around — left side

Resize each `192 × 208` frame to `96 × 104` with alpha-preserving,
high-quality downsampling, then compose the four retained rows into one
`768 × 416` WebP atlas:

- Production path: `public/pet/curry-companion.webp`
- Columns: 8
- Rows: 4
- Cell size: `96 × 104`
- Color mode: RGBA
- Transparent pixels must not contain visible matte or halo residue.

Record the source package URL/version and source/derivative SHA-256 hashes in a
small repository-owned provenance file:

- Production metadata path: `public/pet/curry-companion.provenance.json`

The provenance file is build evidence only and is not fetched by the browser.
Do not ship the complete source package, `pet.json`, unused animation rows, or
the full 2 MB atlas to portfolio visitors.

## 4. Visual treatment

### 4.1 Desktop

- Rendered width: `76px`; derive height from the `96 / 104` source-frame
  ratio.
- Offset: `20px` from the right edge and `20px` from the bottom edge.
- Respect `env(safe-area-inset-right)` and
  `env(safe-area-inset-bottom)` in addition to those offsets.
- Use the transparent character pixels directly.
- Apply no container, border, card, glow, blur, drop shadow, background,
  caption, tooltip, or brand color.
- Preserve the character's natural white and soft neutral palette.
- Do not recolor the pet blue or gold.
- Use a z-index below the sticky navigation and above the homepage document
  surface.

The companion does not reserve layout space. Its fixed layer must not change
the hero dimensions, project positions, page width, or scroll height.

### 4.2 Mobile

At widths below `640px`:

- Rendered width: `52px`; derive height from the `96 / 104` source-frame
  ratio.
- Offset: `12px` plus the relevant safe-area inset from the right and bottom.
- Show only the first Idle frame.
- Disable pointer handling and every frame animation.

The mobile companion remains homepage-only. It must not add a close button or
expand into a larger interaction.

## 5. Motion behavior

### 5.1 State model

`CurryCompanion` has four visual states:

- `idle`
- `look-right`
- `look-left`
- `wave`

It also tracks:

- whether the asset loaded successfully;
- whether the current environment allows motion;
- whether the first pointer-triggered wave has already occurred;
- the scheduled look timer;
- the most recent look direction, so consecutive look events alternate.

There is no position, velocity, path, drag, click, or persistence state.

### 5.2 Idle

Idle is the default state after mount and after every one-shot action. On
motion-capable desktop, the native eight-frame Idle row loops at its authored
rhythm.

On mobile and under `prefers-reduced-motion: reduce`, show the first Idle frame
only. Do not substitute a CSS transform or reduced frame loop.

### 5.3 Automatic Look around

On motion-capable desktop:

- Schedule the first look after a randomized delay from `14` through `24`
  seconds.
- Play one full Look around row exactly once.
- Alternate right-side and left-side source rows on subsequent events.
- Return to Idle after the row completes.
- Schedule the next randomized delay only after returning to Idle.

The delay range is inclusive. Do not run overlapping timers or queue multiple
looks.

When the document becomes hidden:

- cancel the outstanding timer;
- finish no background action;
- return the logical state to Idle.

When the document becomes visible again, schedule a fresh `14–24` second
delay. Do not attempt to replay missed actions.

### 5.4 First pointer Wave

On motion-capable desktop, the first `pointerenter` during a homepage mount:

- cancels the pending look timer;
- plays the Waving row exactly once;
- marks the wave as consumed for that mount;
- returns to Idle;
- schedules a fresh look delay.

Later pointer entries during that same mount do nothing. Leaving and
re-entering the homepage creates a new mount and restores one available wave.

Pointer entry during an active Look around action interrupts it and plays the
one available Wave. No other action interrupts Wave.

The companion does not respond to click, double-click, drag, touch, keyboard,
or long press.

### 5.5 Timing and transitions

Frame stepping uses the atlas rows and CSS `steps(8)`. JavaScript changes only
the current logical state and schedules one-shot completion.

- Do not animate `left`, `right`, `bottom`, `transform`, scale, opacity, or
  rotation during pet actions.
- Do not use a continuous JavaScript animation loop.
- Do not add an animation library.
- Do not introduce random movement, random scale, or random action selection.

Use the published package's authored per-state timing when `pet.json` provides
it. If the manifest provides no usable timing, use these exact full-row
durations and lock them in unit tests:

- Idle: `1040ms`, looping.
- Waving: `880ms`, one iteration.
- Look around right: `1120ms`, one iteration.
- Look around left: `1120ms`, one iteration.

## 6. Component and data boundaries

Create a focused component and hook:

- `src/components/CurryCompanion.jsx`
- `src/hooks/useCurryCompanion.js`

`HomePage` renders `<CurryCompanion />` once. `AboutPage`, `ProjectPage`, and
`SiteChrome` do not know about the companion.

Because the component lives under `HomePage`, the existing view switch unmounts
it automatically when the user opens About or a project. No global route
listener, URL listener, persistent store, or cross-page context is required.

`useCurryCompanion` owns:

- motion eligibility from viewport and `prefers-reduced-motion`;
- active state;
- one-wave-per-mount state;
- visibility-change handling;
- timer scheduling and cleanup;
- action completion;
- alternating look direction.

`CurryCompanion` owns:

- the fixed decorative element;
- atlas CSS variables and `data-state`;
- image preloading and failure state;
- pointer entry forwarding;
- `animationend` forwarding.

Keep random-delay generation behind a small injected or pure helper so tests
can prove both `14` and `24` second boundaries without using nondeterministic
timers.

## 7. Accessibility and interaction boundaries

The companion is decorative:

- Set `aria-hidden="true"`.
- Do not add `role`, accessible name, `tabIndex`, focus ring, button semantics,
  or keyboard handlers.
- Do not announce state changes.
- Do not create an invisible focus target.

On desktop, only the rendered pet pixels' rectangular element receives
`pointerenter` for the one-time Wave. It must not intercept click or touch
actions:

- no `onClick`;
- `pointer-events: auto` only when desktop motion is eligible;
- the element itself has no default browser action.

On mobile and reduced-motion environments, set `pointer-events: none`.

The feature must not cover the skip link or sticky navigation. At representative
viewport sizes, verify that its fixed box does not overlap the browser-visible
primary call-to-action or social controls when the page first loads.

## 8. Performance and lifecycle

- Use one local WebP derivative and no runtime network request beyond that
  static portfolio asset.
- Preload the derivative only on the homepage.
- Do not decode or load the full source package.
- Use CSS sprite stepping rather than React frame-by-frame renders.
- Maintain at most one timeout and no standing `requestAnimationFrame` loop.
- Cancel timers on unmount, visibility loss, mobile transition, and
  reduced-motion transition.
- Avoid state writes after unmount.
- The companion must not change cumulative layout shift because it occupies a
  fixed, non-layout layer.

If the optimized atlas fails to load:

- render nothing;
- cancel pending actions;
- log no noisy retry loop;
- leave the homepage fully usable.

## 9. Testing and acceptance criteria

### 9.1 Asset contract

- The source package satisfies Codex pet v2 geometry before extraction.
- The derivative is WebP RGBA, exactly `768 × 416`, four rows, eight columns,
  and `96 × 104` per cell.
- The derivative contains only the four approved state rows in the documented
  order.
- Provenance includes the source location/version and both SHA-256 hashes.
- The derivative is no larger than `400 KiB`, verified by test.

### 9.2 Unit and component behavior

- Homepage renders one decorative companion; About and project views render
  none.
- Desktop motion-capable mode begins in Idle.
- Automatic look delay includes the exact `14s` and `24s` boundaries.
- Automatic looks alternate right and left.
- A look returns to Idle and schedules one new timer.
- First pointer entry interrupts a look when needed, plays Wave once, returns to
  Idle, and reschedules.
- Later pointer entries in the same mount do not replay Wave.
- Remounting the homepage restores one available Wave.
- Hidden-document handling cancels the timer and returns to Idle.
- Returning visible schedules a fresh delay without replaying a missed action.
- Mobile mode uses a static Idle frame and ignores pointer entry.
- Reduced-motion mode uses a static Idle frame on every viewport.
- Asset failure hides the companion and clears timers.
- Unmount clears all timers and listeners.

Use fake timers and an injected delay source for deterministic unit coverage.

### 9.3 Browser acceptance

Verify at minimum:

- desktop homepage at `1440 × 1000`;
- compact desktop at `1024 × 768`;
- mobile at `390 × 844`;
- a device with bottom/right safe-area inset simulation where supported.

For each applicable viewport:

- the companion is at the approved lower-right offset and size;
- it produces no horizontal overflow, vertical scroll extension, or layout
  shift;
- it remains below the sticky navigation layer;
- it does not obscure first-load hero actions or social links;
- it remains fixed during homepage scrolling;
- it disappears immediately on About and project views;
- desktop actions do not move the element's bounding box;
- mobile and reduced-motion states do not animate;
- no new console errors appear.

Run the complete Vitest suite, production build, and Playwright suite after
focused companion tests.

## 10. Release boundary

Implementation remains local until Edward reviews:

- one desktop homepage capture with the companion visible;
- one mobile homepage capture with static Idle;
- a short desktop recording showing one Look around and the first-hover Wave;
- confirmation that About and project views contain no companion.

Do not push, merge, or deploy until Edward explicitly approves the implemented
result.

## 11. Non-goals

- Turning the pet into a navigation control, chatbot, contact button, game, or
  settings panel.
- Walking, running, following the cursor, bouncing, dragging, jumping, or
  moving between screen edges.
- Persisting pet state across routes, reloads, or browser sessions.
- Reacting to scroll position, project state, Codex state, network data, or
  analytics.
- Displaying platform branding, install instructions, creator metadata, speech
  bubbles, sound, badges, or tooltips.
- Adding the companion to About, project pages, navigation, footer, or mobile
  interaction flows.
- Redrawing, recoloring, regenerating, or altering Curry's character identity.
