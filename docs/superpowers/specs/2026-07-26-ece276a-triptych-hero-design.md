# ECE 276A Editorial Triptych Hero

Status: approved

Date: 2026-07-26

## 1. Objective

Replace the vertically stacked ECE 276A results sheet with a restrained,
portfolio-grade horizontal image that remains faithful to Edward's authored
course work.

The new image must improve hierarchy and legibility without inventing a robot,
laboratory scene, sensor output, or result that was not part of the project.
It will appear both in the homepage project archive and as the project-detail
lead image.

This specification supersedes only the `state-estimation` homepage and lead
image choices in `2026-07-25-ece276a-gif-showcase-design.md`. The three selected
GIFs and their posters remain unchanged.

## 2. Approved direction

Use the selected **editorial triptych** direction:

- Compose the existing PR1, PR2, and PR3 poster images into one horizontal
  plate.
- Present the sequence from left to right:
  `Orientation → LiDAR Mapping → Visual–Inertial SLAM`.
- Use the site's existing restrained blue-and-gold visual language.
- Keep the treatment editorial and archival, not cinematic or decorative.
- Use only real project outputs; do not use AI image generation or redraw the
  plotted data.

## 3. Composition

- Output one PNG at exactly `1560×840px`, matching a `13:7` aspect ratio.
- Use a `#17364c` deep navy field.
- Use `36px` outer padding and `9px` gutters, producing three
  `490×768px` panels.
- Give each panel a `12px` corner radius, a `#f4f1e9` backing, and no floating
  shadow.
- Crop the authored `960×540px` posters to emphasize their primary result:
  - PR1: body orientation and estimate/reference traces.
  - PR2: occupancy grid, corrected trajectory, and robot pose.
  - PR3: SLAM trajectory, IMU-only baseline, and mapped landmarks.
- Use cover crops with these fixed focal points, matching the approved visual
  companion: PR1 `32% 55%`, PR2 `50% 48%`, and PR3 `48% 50%`. Do not stretch
  or distort any source.
- Add only `36px` circular sequence marks in `#a78032`, inset `18px` from the
  lower-right of each panel: `01`, `02`, and `03`.
- Do not add chart labels, marketing copy, gradients, glass effects, glow,
  decorative grids, fake sensor rays, or generic robotics imagery.

## 4. Source and output contract

Source assets:

```text
public/ece276a/posters/pr1-orientation.png
public/ece276a/posters/pr2-lidar-slam.png
public/ece276a/posters/pr3-visual-inertial-slam.png
```

Output asset:

```text
public/ece276a/ece276a-editorial-triptych.png
```

Generate the image deterministically with the repository's existing `sharp`
dependency. Keep the build logic in a focused script so the plate can be
reproduced from the source posters without manual image editing.

The generated PNG must:

- be exactly `1560×840px`;
- remain under `2 MB`;
- contain a valid PNG signature;
- preserve all three source stages visibly;
- have no transparency requirement;
- contain no remote asset or generated-AI dependency.

## 5. Portfolio integration

For the `state-estimation` project:

- Point both `homeEvidence.src` and `leadEvidence.src` to
  `/ece276a/ece276a-editorial-triptych.png`.
- Set both media records to `width: 1560` and `height: 840`.
- Keep the existing alt text, captions, evidence headings, and `technical`
  role unless a wording change is required to describe the triptych
  accurately.
- Use a fit mode that preserves the complete `13:7` plate without cutting off
  a panel or sequence mark.
- Leave all three GIF entries, poster pairs, project copy, dates, ordering,
  links, and detail-page sections unchanged.

## 6. Fallback and accessibility

- Continue using the existing `SafeImage` failure path.
- Preserve a descriptive alt name identifying orientation, mapping, and
  visual-inertial SLAM results.
- A missing triptych must show the existing accessible image-unavailable
  fallback without changing archive disclosure behavior.
- The sequence marks are decorative; the alt text communicates the sequence
  without depending on visual numbering.

## 7. Verification

### Asset contract

- Run the deterministic build and verify the exact dimensions, PNG signature,
  and size ceiling.
- Verify the three source files exist before composition.
- Verify the output can be decoded by `sharp`.

### Data contract

- Assert both homepage and lead evidence reference the new asset and exact
  dimensions.
- Assert the selected evidence remains exactly the existing three GIF/poster
  pairs.
- Assert no PDF is added to visible evidence.

### Browser checks

At minimum, inspect:

- desktop archive at `1440×900`;
- mobile archive at `390×844`;
- desktop project page at `1440×900`;
- mobile project page at `390×844`.

At every viewport:

- all three panels remain visible and undistorted;
- the image is legible at the rendered size;
- no horizontal overflow appears;
- the surrounding typography and archive layout remain unchanged;
- loading failure produces the accessible fallback;
- browser console output remains clean.

Run the complete unit suite, production build, and browser suite before
presenting the finished preview.

## 8. Out of scope

- Redesigning the ECE 276A project page.
- Editing or regenerating the three animated GIFs or their posters.
- Changing project copy, order, dates, links, typography, or archive behavior.
- AI-generating or retouching scientific results.
- Replacing any other project image.
- Merging, pushing, or deploying before the finished preview is reviewed.
