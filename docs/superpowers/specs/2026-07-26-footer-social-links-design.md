# Footer Social Links Design

Status: approved

Date: 2026-07-26

## 1. Objective

Extend the site footer from three direct links to the same six social
destinations shown in the homepage hero, while keeping the footer restrained
and ensuring the Douyin and RedNote profile cards open upward.

## 2. Approved direction

- Show GitHub, LinkedIn, Email, Instagram, Douyin, and RedNote in the footer.
- Keep GitHub, LinkedIn, Email, and Instagram as direct links.
- Keep Douyin and RedNote as profile-card buttons.
- Open footer profile cards above the social row.
- Keep exactly one profile card open at a time.
- Preserve the existing monochrome icons, labels, typography, and hover color.
- Do not change the homepage social rail.

## 3. Component design

- Reuse the existing `SocialLinks` component in `SiteChrome`.
- Add a small placement preference to `SocialLinks` so a caller can request
  upward profile-card placement.
- Keep the current automatic placement behavior as the default for the
  homepage.
- Set the footer instance to upward placement explicitly.
- Use a footer-specific list class for layout without duplicating interaction
  logic.
- Remove the footer's separate three-link filtering and rendering code once
  `SocialLinks` owns the footer social row.

The placement preference controls only the vertical card direction. Existing
horizontal clamping remains responsible for keeping cards inside the social
row width.

## 4. Responsive behavior

### Desktop and tablet

- Keep the copyright on the left and the six social controls on the right.
- Keep the social controls on one line when space permits.
- Profile cards appear directly above their Douyin or RedNote trigger.

### Mobile

- Keep the existing stacked footer: copyright first, social controls below.
- Lay out the six controls as an equal three-column, two-row grid, matching the
  homepage phone treatment.
- Profile cards open upward and remain within the viewport width.
- The card may overlap the empty area above the footer but must not create
  horizontal overflow.

## 5. Interaction and accessibility

- Preserve native links for direct destinations and native buttons for profile
  cards.
- Preserve hover, focus, tap, click, Escape, outside-click, and focus-restoration
  behavior from the existing component.
- Preserve `aria-expanded`, `aria-controls`, `aria-labelledby`, and region
  semantics.
- Opening RedNote closes Douyin, and opening Douyin closes RedNote.
- With reduced motion enabled, card state changes remain immediate according
  to the existing motion policy.
- Footer controls retain a minimum 44px interaction height.

## 6. Verification

- Component tests verify all six footer labels.
- Footer tests verify Instagram remains a direct external link.
- Footer tests verify Douyin and RedNote are buttons with upward cards.
- Interaction tests verify only one footer card is open and Escape restores
  focus.
- Regression tests verify the homepage keeps its existing placement behavior.
- Browser tests cover desktop and mobile footer layouts, upward placement,
  no horizontal overflow, and clean console output.
- Run the complete unit suite, production build, and browser suite before
  presenting the updated preview.

## 7. Out of scope

- Changing social destinations, account identifiers, or QR/profile-card images.
- Redesigning the footer copyright copy.
- Changing the homepage social layout or its automatic placement behavior.
- Adding a modal, portal, animation dependency, analytics, or new social
  platform.
- Pushing, merging, or deploying as part of the implementation itself.
