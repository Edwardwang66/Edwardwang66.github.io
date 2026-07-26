# ECE 276A Single-Image Hero Design

## Goal

Replace the rejected three-panel ECE 276A composite with one complete,
unaltered PR2 LiDAR SLAM image on both the homepage archive and project detail
page.

## Approved Direction

- Use the existing authored image
  `/ece276a/posters/pr2-lidar-slam.png`.
- Render the full 960 × 540 source image with `object-fit: contain`.
- Do not crop, enlarge a subsection, recolor, redraw, or generate a derivative.
- Do not add a navy mat, gold index, overlay, badge, gradient, decorative
  border, or other visual treatment.
- Keep the existing site media container and responsive spacing. “Zero
  decoration” applies to the ECE image treatment; it does not redesign shared
  site chrome.

## Content Contract

The homepage `homeEvidence` and project-detail `leadEvidence` must reference
the same PR2 poster, dimensions, technical-media role, and contain behavior.

Use descriptive copy focused on the visible result:

- Alt text: `LiDAR SLAM occupancy map with corrected robot trajectory`
- Homepage caption:
  `PR2 · Submap ICP trajectory correction and occupancy-grid mapping.`
- Homepage heading:
  `LiDAR mapping refined through scan-to-submap alignment.`
- Detail caption:
  `Submap ICP trajectory correction while sampled LiDAR scans build the occupancy grid.`

The three existing GIF evidence records, their posters, captions, order, and
dimensions remain unchanged. The project narrative continues to describe the
full three-project ECE 276A sequence.

## Cleanup

Remove the rejected derived-artwork path completely:

- `public/ece276a/ece276a-editorial-triptych.png`
- `scripts/build-ece276a-triptych.mjs`
- the `build:ece276a-triptych` package script
- triptych-only asset tests and browser selectors

Keep `sharp` because the repository already uses it for media-contract tests;
do not change dependencies.

## Responsive and Failure Behavior

- Desktop and mobile must show the entire PR2 image without distortion or
  horizontal overflow.
- The image's natural dimensions must remain 960 × 540.
- Shared archive/detail containers may retain their existing geometry; `contain`
  must prevent any source-image crop.
- `SafeImage` retains the descriptive fallback when the PR2 poster fails to
  load.

## Verification

- Unit/data tests assert that both evidence surfaces use the exact PR2 poster
  contract and that all three GIF/poster pairs remain unchanged.
- Asset tests assert the authored PR2 PNG remains valid, 960 × 540, and within
  its existing size bound; no generated triptych contract remains.
- Playwright verifies the exact source, natural dimensions, `contain` behavior,
  no overflow, clean console, and descriptive fallback on desktop and mobile.
- Capture and inspect homepage archive and detail-page screenshots at 1440px
  and 390px widths before presenting the result.

## Boundaries

Do not change ECE course dates, narrative sections, GIF content, other project
media, site typography, social interactions, Curry behavior, analytics,
dependencies, or deployment state.
