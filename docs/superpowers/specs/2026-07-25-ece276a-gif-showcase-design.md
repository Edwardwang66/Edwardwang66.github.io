# ECE 276A GIF Showcase Design

Date: 2026-07-25
Status: Approved for implementation planning
Owner: Edward Wang

## 1. Goal

Turn the three ECE 276A assignments into data-driven, animated portfolio
showcases. Each assignment will gain one command-line GIF exporter and one
representative GIF will be displayed on the existing ECE 276A portfolio detail
page.

The GIFs must visualize real assignment outputs. They must not be decorative
transitions made from static screenshots, and the visualization layer must not
change the meaning or numerical behavior of the assignment algorithms.

## 2. Scope

### Included

- Add one self-contained `visualize_gif.py` entry point to each assignment.
- Use representative datasets:
  - PR1: dataset `1`
  - PR2: dataset `20`
  - PR3: dataset `00`
- Support dataset overrides through a consistent command-line interface.
- Generate one 12–18 second looping GIF per assignment.
- Generate one representative final-frame PNG per assignment for reduced-motion
  presentation.
- Copy the three verified GIFs into `public/ece276a/gifs/`.
- Add the GIFs to the ECE 276A portfolio detail page.
- Preserve the three existing PDF reports below the new GIF showcase.
- Verify the assignment exporters and the React/Vite portfolio locally.

### Excluded

- Algorithm redesign, retuning, or numerical-result changes.
- A GIF for every dataset or every intermediate milestone.
- A dark monitoring-dashboard visual language.
- Screen recording or ffmpeg as a required dependency.
- Push, deployment, or modification of the unrelated untracked `ece276b/`
  workspace content.

## 3. Source Projects

The assignment sources remain independent:

- PR1:
  `/Users/edwardwang/Library/Mobile Documents/com~apple~CloudDocs/Documents/WI26/ece276a/pr1`
- PR2:
  `/Users/edwardwang/Library/Mobile Documents/com~apple~CloudDocs/Documents/WI26/ece276a/pr2`
- PR3:
  `/Users/edwardwang/Library/Mobile Documents/com~apple~CloudDocs/Documents/WI26/ece276a/pr3/pr3_code`
- Portfolio:
  `/Users/edwardwang/Desktop/Edwardwang66.github.io`

No assignment may import code from another assignment or from the portfolio.
The three exporters share a command convention and visual language, not a
runtime package.

## 4. User Interface

Each assignment exporter will use the following command shape:

```bash
python visualize_gif.py \
  --dataset <id> \
  --output <path> \
  --poster-output <path> \
  --fps <frames-per-second> \
  --frames <unique-frame-count>
```

Defaults will select the representative dataset, a project-local GIF output
path, a sibling poster PNG, 12 fps, and 120 sampled data frames. Ten opening
hold frames and fourteen closing hold frames produce 144 encoded frames and a
12-second default loop.

Additional behavior:

- `--force` is required to replace an existing output GIF.
- Invalid datasets, frame counts, and FPS values fail before expensive work.
- Progress output distinguishes computation, frame rendering, encoding, and
  final validation.
- Paths are resolved relative to the script, so the command works when invoked
  from the documented project root without depending on the caller's current
  directory.

## 5. Shared Visual Direction

The three GIFs use a restrained, light editorial style compatible with the
portfolio:

- warm neutral background;
- charcoal labels and axes;
- muted blue for estimates or corrected paths;
- sage green for reference data, maps, or landmarks;
- restrained vermilion for the current state;
- small, legible dataset/time/frame annotations;
- no dense control panels, glowing effects, or ornamental animation.

The target canvas is 960 by 540 pixels and the default frame rate is 12 fps.
The preferred file size is at or below 12 MB and the publication cap is 15 MB.
If an initial render exceeds 15 MB, reduce palette colors first, then sampled
frames, and finally canvas width until the result is within the cap without
making the motion visibly discontinuous.

Each GIF uses the same rhythm:

1. title and dataset hold for roughly 0.8 seconds;
2. time-sampled state progression;
3. completed result hold for roughly 1.2 seconds;
4. seamless restart.

## 6. PR1 Visualization

### Inputs

- IMU data for the selected dataset;
- VICON rotations and timestamps when available;
- quaternion propagation output, computed through existing PR1 source modules
  or loaded from a compatible cached result.

### Composition

- Left panel: a simple rigid body with body-frame axes, rotated from the
  estimated quaternion at the current sampled time.
- Right panel: roll, pitch, and yaw traces revealed over time.
- Estimated orientation is shown as a solid line.
- VICON reference is shown as a dashed line after timestamp alignment.
- Current time and yaw are shown as compact annotations.

### Data rules

- Timestamp alignment and coordinate conversions must reuse the existing PR1
  conventions.
- When VICON data is unavailable for a selected dataset, the exporter still
  renders the estimate and clearly labels the reference as unavailable.
- Cached output is accepted only if its dataset and dimensions match.

## 7. PR2 Visualization

### Inputs

- dataset LiDAR, encoder, and IMU data;
- the existing scan-to-submap ICP pipeline;
- the existing occupancy-grid implementation and transforms.

### Composition

- Primary canvas: an occupancy grid built progressively from sampled scans.
- Overlay: corrected ICP trajectory, current robot pose, heading, and a
  restrained subset of current LiDAR rays.
- Compact annotation: current scan, total scans, and mapped percentage.

### Data rules

- Run the existing submap ICP trajectory computation first.
- Replay sampled scans in chronological order into a fresh occupancy grid using
  the computed poses.
- Render frames sequentially to keep memory bounded; do not retain a full
  occupancy-grid copy for every animation frame.
- Do not rerun ICP inside each render callback.

## 8. PR3 Visualization

### Inputs

- IMU-only poses;
- visual-inertial SLAM poses;
- selected landmark estimates and feature-observation history.

### Composition

- Primary canvas: the SLAM trajectory revealed over time.
- Comparison: the IMU-only trajectory as a muted dashed line.
- Landmarks appear when their selected feature has been observed by the current
  sampled time.
- Current pose and heading are emphasized.
- Side annotation: frame, elapsed time, visible feature count, and mapped
  landmark count.

### Data rules

- Reuse the existing PR3 localization, mapping, feature-selection, and SLAM
  functions.
- Landmark coordinates come from the completed assignment estimate, while
  reveal timing comes from actual feature-observation history. The visual must
  be labeled as mapped landmarks, not as a recording of every intermediate EKF
  landmark state.
- Filtering used for the existing static plots remains unchanged.

## 9. GIF Encoding

- Use Matplotlib for figures and Pillow for GIF encoding.
- Avoid an ffmpeg requirement.
- Render sequentially so PR2 remains memory bounded.
- Write to a temporary sibling file first.
- Validate the temporary GIF before atomically replacing the requested output.
- Validation checks:
  - Pillow can reopen the GIF;
  - format is GIF;
  - frame count is greater than one;
  - all frames have the expected dimensions;
  - looping metadata is present.
- Existing output is preserved unless `--force` is supplied.
- Temporary files are removed after success or failure.

## 10. Portfolio Integration

Assets:

```text
public/ece276a/gifs/pr1-orientation.gif
public/ece276a/gifs/pr2-lidar-slam.gif
public/ece276a/gifs/pr3-visual-inertial-slam.gif
public/ece276a/posters/pr1-orientation.png
public/ece276a/posters/pr2-lidar-slam.png
public/ece276a/posters/pr3-visual-inertial-slam.png
```

The ECE 276A project media model will be extended to contain an ordered GIF
showcase and the existing PDF files. The detail page will render:

1. the existing project introduction;
2. three full-width or responsive two-column GIF cards;
3. a short descriptive caption for each GIF;
4. the three existing embedded PDF reports.

The project cover remains static so the work index does not become a wall of
simultaneously animated thumbnails.

GIF images receive meaningful alternative text. Each GIF card contains both
the animated GIF and its final-frame poster. Under
`prefers-reduced-motion: reduce`, CSS hides the GIF and displays the poster.
The layout does not depend on motion to communicate the project title or
description.

No generic changes are made to unrelated portfolio projects.

## 11. Error Handling

Exporters fail with actionable messages for:

- missing dataset files;
- unsupported dataset identifiers;
- missing required Python packages;
- incompatible cached results;
- empty trajectories or scans;
- invalid output suffix, FPS, or frame count;
- an existing output without `--force`;
- an unreadable or single-frame encoded result.

An exporter failure must not leave a partial final GIF.

PR1 may continue without VICON using an explicitly labeled estimate-only
visualization. PR2 and PR3 must fail if the core data needed for their
representative visualization is missing.

## 12. Verification

### Assignment smoke tests

For each exporter:

- run an inexpensive render with 8 unique frames and low FPS;
- validate GIF format, dimensions, loop metadata, and multiple frames;
- verify `--help`, invalid argument handling, overwrite protection, and
  `--force`;
- run the existing assignment entry point or focused numerical checks to
  confirm the visualization work did not alter algorithm results.

### Full renders

- generate all three representative GIFs;
- inspect the first, middle, and final frame;
- confirm labels match the actual dataset and time/frame values;
- confirm motion is understandable and the final hold is present;
- record final dimensions, frame counts, durations, and file sizes.

### Portfolio

- run the existing unit test suite;
- run the production build;
- run browser verification at desktop and mobile widths;
- confirm the three GIFs load, the PDFs remain accessible, and no unrelated
  project changes;
- check that reduced-motion replaces each GIF with its poster PNG;
- run `git diff --check`.

## 13. Completion Boundary

Completion means:

- all three assignment exporters work for their representative datasets;
- all three verified GIFs exist in the portfolio;
- the ECE 276A project page presents them and preserves the PDFs;
- assignment and portfolio verification passes, with any limitations reported.

Completion does not include pushing or deploying the portfolio, committing or
publishing the iCloud assignment directories, or changing unrelated work.
