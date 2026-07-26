# Click-Only Project Archive Interaction

Status: approved

Date: 2026-07-26

## 1. Objective

Make the Selected Work archive predictable on every viewport. Desktop and
mobile use the same interaction: one project is open, and only an explicit
click or keyboard action changes which project is open.

This specification supersedes only the project-archive interaction and motion
details in `2026-07-24-original-plus-static-interaction-design.md`. It does not
change the approved layout, content, project order, or visual styling.

## 2. Approved behavior

- Open the first project, Easy-A Radar, on initial render.
- Keep exactly one project open at all times.
- Clicking or tapping a different project opens it and closes the previously
  open project.
- Activating a project with the keyboard behaves the same as clicking it.
- Clicking or activating the currently open project leaves it open.
- Scrolling never changes the active project on mobile, tablet, or desktop.
- Changing projects never changes the browser scroll position.

## 3. Implementation boundary

- `ProjectArchive` remains the sole owner of the active project ID.
- Remove the mobile scroll-activation hook from the archive component.
- Remove the now-unused scroll-selection hook, helper, and their dedicated
  tests if repository-wide search confirms they have no other consumers.
- Keep the existing disclosure controller for the restrained panel
  open-and-close transition.
- Keep the current project markup, project ordering, media, links, captions,
  and desktop/mobile CSS unchanged.
- Do not add a replacement scroll observer, timer, breakpoint-specific state,
  or animation dependency.

## 4. State flow

1. Initialize `activeId` from the first project.
2. A project trigger sends its project ID to the archive activation handler.
3. The handler sets `activeId` only when the selected ID differs from the
   current ID.
4. The disclosure controller opens the matching panel and closes every other
   panel.
5. Scroll and resize events do not participate in project selection.

If the project collection changes during a future render, behavior outside the
existing non-empty project contract remains out of scope for this change.

## 5. Accessibility

- Preserve the native button trigger for each archive row.
- Preserve `aria-expanded`, `aria-controls`, panel `role="region"`, and
  `aria-labelledby`.
- Preserve visible keyboard focus.
- Preserve Enter and Space activation through native button behavior.
- Closed panels remain hidden and non-interactive according to the existing
  disclosure controller.
- With `prefers-reduced-motion: reduce`, state changes remain immediate.

## 6. Verification

### Component tests

- The first project is open by default.
- Clicking the second project opens only the second project.
- Clicking a third project closes the second and opens only the third.
- Clicking the active project does not close it.
- Pointer and keyboard paths produce the same single-open result.
- Reduced-motion panel visibility remains correct.

### Browser tests

At `390×844`:

- Scrolling through Selected Work does not change the initially open project.
- Tapping Stock Dashboard opens only Stock Dashboard.
- Tapping the robotic-arm project opens only the robotic-arm project.
- No programmatic scroll occurs during selection.

At `1440×900`:

- The existing desktop single-open click behavior remains unchanged.

Run the complete unit suite, production build, and browser suite before
presenting the updated preview.

## 7. Out of scope

- Changing project order, copy, timestamps, media, or destinations.
- Changing the archive layout, spacing, typography, colors, or breakpoints.
- Changing project-detail navigation.
- Adding analytics or deploying to production as part of this interaction
  change.
