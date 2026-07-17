# Edward Wang Portfolio Redesign

Status: superseded on 2026-07-17

Do not implement this direction. It is superseded by
`docs/superpowers/specs/2026-07-17-portfolio-original-plus-design.md` after
visual review of the live original site.

Date: 2026-07-16

## 1. Objective

Redesign the existing robotics and controls portfolio so it feels quiet, credible, and thoughtful. The site should communicate technical range and growth potential without presenting Edward as a polished consumer brand or using conspicuous visual effects.

The primary audience is split between:

- Robotics and autonomous-systems hiring managers
- Professors, laboratories, and research collaborators

The desired first impression is: Edward has worked across several technical domains, learns quickly, and can explain how algorithms behave once they meet real hardware.

## 2. Design read

Reading this as: an existing engineering portfolio for hiring managers and researchers, with a restrained personal-site language, leaning toward content hierarchy, real project evidence, and native layout rather than decorative styling.

Design parameters:

- Design variance: 4/10
- Motion intensity: 2/10
- Visual density: 5/10
- Redesign mode: visual overhaul with existing content and information architecture preserved

The approved direction is **Quiet Personal A+**.

## 3. Principles

1. Content creates depth. Layout should reveal project hierarchy, contribution, and results.
2. Real images carry the visual interest. Interface decoration stays minimal.
3. Edward speaks as a person, not as a brand. Copy remains factual and specific.
4. Projects do not receive equal weight. Real-system work leads; coursework proves breadth.
5. The site stays visually consistent. One light neutral theme, one steel-blue accent, one square-corner system.

## 4. Non-goals

The redesign will not introduce:

- Oversized manifesto headlines
- Full-screen cinematic photography
- Dark control-room styling
- Warm beige and display-serif styling
- Bento cards, glass effects, gradients, or drop shadows
- Decorative status dots, numbered section labels, badges, pills, or scroll cues
- Fake dashboards, terminals, diagrams, or invented technical metrics
- Large marketing CTAs or exaggerated recruiting language
- Changes to the current primary navigation or URL behavior

## 5. Information architecture

Keep the current three-view structure:

1. Work homepage
2. Project detail view
3. About view

Keep the existing `profile` and `projects` data as the source of truth. Preserve every project entry, its media, and its reports. The homepage uses the approved hierarchy below; project-detail navigation continues to follow the existing project-array order. Preserve the current state-based navigation unless a separate routing change is explicitly approved later.

## 6. Homepage design

### 6.1 Navigation

- Height: 64px
- Left: Edward Wang
- Right: Work and About
- Email, GitHub, and LinkedIn appear as ordinary text links in the introduction, not as a filled contact button
- Active navigation uses text color or underline only

### 6.2 Personal introduction

Use a two-column layout with text on the left and a compact profile summary on the right.

Left content:

- Heading: `Hi, I’m Edward Wang.`
- Maximum heading size: 42px on desktop
- One paragraph covering UC San Diego ECE and the Fall 2026 M.S. program
- One paragraph explaining the practical work: perception-to-motion systems, calibration, latency, drift, and integration failures on real hardware
- Plain Email, GitHub, and LinkedIn links

Right content:

- Small portrait, approximately 106 by 132px
- Four concise facts: Study, Focus, Work, and Next
- Facts use simple rows and hairlines, not cards or badges

### 6.3 Featured project

The 1/5 Scale Autonomous Off-Road Vehicle is the lead case study.

- Use `/ece191/2.png` as the main image because it shows real hardware integration rather than an isolated product cutout
- Desktop composition: approximately 42% image and 58% text
- Show context, a short project summary, Problem, My contribution, and Outcome
- Contribution must describe Edward's work across sensing, planning, control, ROS integration, and hardware debugging
- Outcome must remain factual: repeatable path following and a documented bring-up process

### 6.4 Remaining projects

Create two levels below the featured project.

Core projects with images:

- Vision-Guided Robotic Arm for Automated Lab Operations
- Sensing and State Estimation in Robotics

Compact text index:

- Planning and Learning in Robotics
- ML-Supported Nanoparticle & Cell-Membrane Selection
- Embedded and Digital Control Systems

Each compact entry gets one concrete sentence describing the implemented work. Do not repeat the full technology stack or use tag pills.

### 6.5 Experience and education

End the homepage with a concise two-column record:

- Experience: Liangfang Zhang Lab and c12.ai
- Education: UC San Diego B.S. and expected M.S.

The full skills matrix, coursework, languages, phone number, and earlier DVC degree remain on the About view.

## 7. Project detail design

Project detail pages inherit the same quiet visual system and use a project-journal structure.

Order:

1. Back to Work
2. Project title and context
3. One short summary
4. Primary image or media
5. Context
6. Challenge
7. Edward's contribution
8. Outcome
9. Reports, videos, galleries, or GIFs
10. Tools and technologies as plain text
11. Next project

Media should keep natural aspect ratios wherever practical. Reports need both an embedded view and a normal open link so the content remains reachable when browser PDF embedding fails.

## 8. About design

The About view keeps the same typography, line system, and content width as the homepage.

Prioritize:

- A short biography
- Research and internship experience
- Education
- Skills grouped by domain
- Selected coursework
- Contact links

Avoid repeating the homepage introduction verbatim. The About view may provide the fuller personal and academic context.

## 9. Visual system

### Color

- Page: `#F7F8F8`
- Paper surface: `#FFFFFF`
- Primary text: `#20252A`
- Secondary text: `#626C74`
- Tertiary text: `#889198`
- Rules: `#D6DCDF`
- Accent: `#345D78`

Use the accent only for links, focus treatment, and small structural labels such as Problem or Outcome. Project images retain their natural color.

### Typography

- Primary stack: `Helvetica Neue`, Helvetica, Arial, sans-serif
- Body: 16 to 17px
- Homepage H1: 34 to 42px
- Section headings: 19 to 24px
- Project titles: 18 to 27px depending on hierarchy
- Supporting labels: 11 to 12px
- Body line length: approximately 60 to 70 characters

### Shape and surfaces

- Square corners throughout
- No drop shadows
- No gradients
- Use whitespace and single hairlines for grouping
- Do not wrap ordinary content in cards

### Motion

- Link color and underline transitions: 120 to 160ms
- No automatic entrance animations
- No image zoom, parallax, marquee, cursor effects, or scroll hijacking
- Respect `prefers-reduced-motion`

## 10. Responsive behavior

Desktop target width is 1120px inside the viewport.

At widths below 900px:

- Reduce the portrait and fact-column width
- Collapse featured-project media above its text when necessary
- Reduce multi-column project evidence to two columns

At widths below 720px:

- Use a single-column layout
- Keep 16px horizontal page padding
- Place the portrait before the introduction text or directly after the heading
- Convert Problem, Contribution, and Outcome into a vertical definition list
- Preserve natural reading order and touch targets

No page element may require horizontal scrolling.

## 11. Component boundaries and data flow

Keep the existing React and Vite stack. Do not migrate frameworks or replace Tailwind during this redesign.

Recommended visual units:

- `Nav`
- `HomeIntro`
- `ProfileFacts`
- `FeaturedProject`
- `ProjectPreview`
- `ProjectIndex`
- `ExperienceEducation`
- `ProjectDetail`
- `About`
- `Footer`

`profile` and `projects` remain the only content data sources. Components receive the relevant object and navigation callback as props. User actions continue to update the current view through the existing root state.

## 12. Error and fallback behavior

- Missing project images show a neutral bordered area with the project title, not a gradient placeholder
- Videos do not autoplay with sound and always expose native controls
- PDF sections provide an open-document link in addition to the embed
- Empty link collections should render nothing; do not display `Available on request`
- External links use descriptive accessible labels
- Every meaningful image receives specific alt text
- Keyboard focus is always visible in the steel-blue accent

## 13. Validation

Implementation is acceptable when all of the following pass:

- `npm run build`
- Desktop checks at 1440px and 1024px
- Mobile checks at 390px and 320px
- Keyboard navigation through navigation, social links, projects, media, and next-project controls
- Focus contrast and body-text contrast meet WCAG AA
- Featured and secondary images crop correctly
- Videos, GIFs, and embedded PDFs remain usable
- Reduced-motion preference removes nonessential transitions
- No layout shift from images with missing dimensions
- No visible decorative patterns from the non-goals list appear

## 14. Acceptance summary

The finished homepage should feel like a well-maintained engineer's personal site: modest at first glance, increasingly substantial as the visitor reads, and specific enough that each claim is supported by a project, contribution, or outcome.
