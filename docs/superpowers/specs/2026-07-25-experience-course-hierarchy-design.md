# Experience and Course-Project Hierarchy

Status: approved

Date: 2026-07-25

## 1. Objective

Make the homepage communicate Edward's current professional trajectory before
showing coursework: Bioyond first, c12.ai second, ECE 276B third, and ECE 276A
fourth. Every displayed timestamp and project claim must agree with the supplied
CV or the corresponding course report.

## 2. Homepage hierarchy

The homepage reading order is:

1. Hero
2. Selected experience
   - Bioyond Robotics
   - c12.ai
3. Selected work
   - ECE 276B
   - ECE 276A
   - remaining projects

The two internships are editorial experience records, not project cards.
Bioyond remains first even though c12.ai has richer media.

## 3. Experience records

### Bioyond Robotics

- Role: `Agentic AI Engineer Intern · AI for Science`
- Timestamp: `Jul 2026 — Present`
- Location: `Pudong, Shanghai, China · On-site`
- Website: `https://www.bioyond.com/en/`
- Copy must stay within the CV's claims about agentic scientific workflows,
  planning, orchestration, validation, feedback, traceability, human oversight,
  and error recovery.

### c12.ai

- Role: `Engineering Intern`
- Timestamp: `Jun 2024 — Aug 2024`
- Location: `Pudong, Shanghai, China`
- Website: `https://www.c12.ai/en`
- Copy must stay within the CV's claims about liquid-level measurement,
  dual-camera localization, ROS manipulation, workcell simulation, and
  sim-to-hardware debugging.

Company names act as restrained external links. The timestamp remains visible
without hover and uses tabular numerals.

## 4. ECE 276B

- Timestamp: `Spring 2026`
- Present the course as dynamic programming and 3-D motion planning.
- PR1 is a weighted-cost Door-Key state-space problem solved with Dijkstra on
  the induced graph, not value iteration.
- PR2 is collision-free 3-D motion planning with Weighted A*, AABB collision
  checks, line-of-sight shortcutting, and dynamic replanning, not reinforcement
  learning.
- Report-backed outcomes may include 7/7 known maps, 36/36 random maps, all
  seven 3-D environments solved, and measured dynamic replanning latency.
- The project detail presents GIF evidence only. PDFs are research inputs for
  the copy and never appear as links, previews, iframes, or evidence records.
- GIF playback remains user initiated.

## 5. ECE 276A

- Timestamp: `Winter 2026`.
- Describe the three-project arc accurately:
  orientation tracking and panorama reconstruction, LiDAR SLAM, and
  visual-inertial SLAM with an EKF.
- Keep the current restrained static composite for now.
- Remove report links and previews. The reports inform the copy.
- Do not fabricate a visualization placeholder. Preserve the evidence model so
  a real interactive visualization can be added later.

## 6. Remaining work

After ECE 276B and ECE 276A, retain the autonomous vehicle, c12.ai robotic-arm
project, drug-delivery research, and embedded-systems work. Renumber project
rows to match their new display order.

## 7. Original+ continuity

- Preserve the white editorial layout, serif display type, blue/gold accents,
  click-only archive, and absence of scroll-driven motion.
- Complete the already approved hero amendment: show GitHub, LinkedIn, and
  Email in the hero and use the original portrait measurements at the 520px
  responsive boundary.
- Do not introduce cards, badges, a timeline graphic, automatic media, or
  decorative animation.

## 8. Acceptance criteria

- The homepage contains exactly two featured experience records in the approved
  order.
- Both company links open their official websites in a new tab.
- Dates match the approved source values.
- ECE 276B is the first project and ECE 276A is the second.
- ECE 276B contains no reinforcement-learning or value-iteration claims.
- Neither course project exposes a PDF.
- ECE 276B media on the project page are GIFs with explicit play controls.
- The hero contains GitHub, LinkedIn, and Email.
- At 520px the portrait remains beside the copy at 160px; at 519px and below it
  moves below the social links, remains 160px, and is centered.
- Unit tests, production build, and browser tests pass before screenshots are
  presented.
- No merge, push, or deployment occurs before visual review.
