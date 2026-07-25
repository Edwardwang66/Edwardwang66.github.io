# Original+ Static Interaction Refinement

Status: approved, revised with original responsive measurements

Date: 2026-07-24

## 1. Objective

Restore the compositional stability of Edward's original portfolio header and
hero while retaining the new Agentic AI, AI for Science, current-practice, and
project-evidence content.

The finished site must feel calm in both desktop and mobile browsers. Scrolling
must never trigger a content drawer, move the reader's position, or cause the
portrait and hero copy to trade places.

## 2. Approved direction

Use the selected **Original return+** direction:

- Restore the original wide, editorial navigation and hero composition.
- Retain the current blue and gold accents only as small details.
- Restore a clear `Get in touch` action in the desktop navigation.
- Restore `GitHub`, `LinkedIn`, and `Email` links inside the hero.
- Keep the current content model and project detail pages.
- Remove continuous and scroll-driven motion from the homepage.
- Preserve only immediate hover, focus, and short state feedback.

## 3. Navigation

### Desktop

- Keep the black circular `EW` mark followed by `Edward Wang`.
- Keep `Work` and `About` on the right.
- Add a black `Get in touch ↗` mail link after `About`.
- Use a stable white header with one subtle lower divider.
- Do not animate a shadow, blur, or divider in response to scrolling.

### Mobile

- Keep the `EW` mark and `Edward Wang` label when space permits.
- Keep `Work` and `About` as compact text controls.
- Move the contact action out of the navigation when it cannot fit without
  crowding; the hero and footer retain clear email access.
- Neither the brand nor the navigation may wrap onto a second line.

## 4. Hero

### Desktop

- Use the original two-column editorial composition.
- The copy occupies the dominant left column.
- The portrait is anchored to the top of the right column and remains visually
  subordinate to the heading.
- At widths of 640px and above, render the portrait at `256×256px`, matching
  the published original.
- Keep the updated positioning:
  `Robotics · Agentic AI · AI for Science`.
- Keep the updated heading:
  `I build intelligent systems that carry intent into reliable execution.`
- Keep the updated supporting copy and the `Selected work` and
  `Current practice` actions.
- Place `GitHub`, `LinkedIn`, and `Email` directly below the hero actions,
  using the existing social destinations and 20px line icons.
- Remove the continuous status-dot pulse; retain one static green dot.

### Mobile

- Between 520px and 639px, preserve the published original's two-column
  composition: flexible copy on the left and a `160×160px` portrait on the
  right.
- At 519px and below, use a stable single-column reading order:
  status, positioning, heading, supporting copy, actions, social links,
  portrait.
- At 519px and below, render the portrait at `160×160px` in normal document
  flow and center it below the social links, matching the published original.
- Do not position the portrait independently at the lower-right corner or
  reduce it below 160px.
- Apply the breakpoint change immediately; do not animate it or relocate hero
  elements in response to scrolling.

## 5. Project archive interaction

- Keep the first project expanded by default.
- Remove mobile scroll-driven project activation.
- Clicking or keyboard-activating a row opens that row and closes the previous
  row.
- Clicking the active row leaves it open, preserving exactly one open project.
- Remove the spring-based height animation.
- Panel state changes may use only a short opacity response, no longer than
  120ms, and only when motion is allowed.
- The browser scroll position must not be adjusted when a project changes.
- Existing media controls, captions, project links, and accessibility
  relationships remain intact.

## 6. Motion policy

Allowed:

- Hover and focus color changes between 80ms and 120ms.
- A subtle project-panel opacity response no longer than 120ms.
- Existing explicit media playback started by the user.

Removed:

- Status-dot pulse.
- Scroll-triggered project activation.
- Spring height animation.
- Scroll-reactive navigation material or shadow.
- Page entrance sequences, parallax, marquee, drift, or automatic media.

With `prefers-reduced-motion: reduce`, project state changes are immediate.

## 7. Responsive acceptance criteria

Validate at minimum:

- Desktop: 1440×900 and 1280×800.
- Tablet/narrow browser: 768×1024 and 632×661.
- Responsive boundary: 520×844 and 519×844.
- Mobile: 390×844 and 375×667.

At every width:

- No horizontal overflow.
- Navigation remains on one line.
- The hero social row contains `GitHub`, `LinkedIn`, and `Email`.
- At 520px the portrait remains beside the copy; at 519px it moves below the
  social links and centers.
- Portrait never overlaps or becomes visually detached from the hero.
- Scrolling alone never changes the active project.
- Clicking each project produces exactly one expanded panel.
- Focus remains visible and keyboard behavior matches pointer behavior.

## 8. Testing and handoff

- Update component tests to remove scroll-activation expectations and assert
  click-only archive behavior.
- Add responsive end-to-end assertions for navigation, portrait placement, and
  absence of horizontal overflow.
- Verify reduced-motion behavior.
- Run the unit suite, production build, and end-to-end suite.
- Present finished desktop and mobile screenshots from the production preview
  before any merge, push, or deployment.

## 9. Out of scope

- Rewriting project content or changing project order.
- Replacing the portrait.
- Redesigning project detail pages or the About page.
- Adding a new router, animation library, theme system, or CMS.
- Merging to `main`, pushing, or deploying before the finished previews are
  reviewed.
