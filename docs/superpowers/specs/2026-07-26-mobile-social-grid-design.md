# Mobile Social Grid Alignment Design

**Date:** 2026-07-26  
**Status:** Approved direction, awaiting written-spec review

## Goal

Make the six homepage social controls align cleanly on mobile without changing
their approved order, content, interactions, or restrained editorial treatment.

## Approved layout

At viewport widths up to `639px`, the social rail becomes an equal-width
three-column grid with two rows:

| Column 1 | Column 2 | Column 3 |
| --- | --- | --- |
| GitHub | LinkedIn | Email |
| Instagram | Douyin | RedNote |

Both rows share the same three column starts. Each control remains left-aligned
inside its cell. Icons keep the existing `20px` visual box, and icon-to-label
spacing, text size, color, focus styling, and active styling remain unchanged.

Above `639px`, the current flexible desktop/tablet layout remains unchanged.

## Implementation boundary

The change is limited to the mobile `.hero-socials` layout in
`src/index.css`. It must not modify:

- social order, labels, URLs, identities, or icon choices;
- link/button semantics;
- Douyin and RedNote profile-card positioning or interaction ownership;
- the hero copy, portrait, navigation, projects, About page, or footer;
- Curry sizing, placement, or animation.

## Responsive behavior

- Use three equal tracks with `minmax(0, 1fr)`.
- Keep the existing vertical rhythm between the two rows.
- Use a compact column gap that fits the longest label without horizontal
  overflow at the supported `375px` and `390px` mobile widths.
- Preserve the existing full-width social root so profile cards continue to
  measure and clamp against the same container.

## Verification

Browser coverage will verify at `390px` and `375px` that:

- all six controls remain in the approved order;
- row one and row two share the same three x-coordinate starts;
- each control is left-aligned within its equal-width grid cell;
- no horizontal page overflow is introduced;
- Douyin and RedNote still open, close, and remain viewport-safe;
- Curry does not overlap the social controls or an open profile card.

The full unit, production-build, and system-Chrome E2E suites must remain green.

