# Local UI Verification

The production site remains Jekyll. These optional development helpers do not
change its build or add browser-side dependencies. Underscore-prefixed tool and
test directories are not published by Jekyll.

- `node --test _tests/project-instruments.test.cjs`: dependency-free controller
  and integration-contract tests.
- `node --test _tests/mechanical-materials.test.cjs`: shared neutral materials
  and profile-housing contract checks.
- `node --test _tests/hero-poem.test.cjs`: non-repeating verse selection,
  15-second rotation, pause conditions and accessible e-ink display checks.
- `node --test _tests/hero-device*.test.cjs _tests/compact-hero.test.cjs`:
  directional screens, on-demand video playback and compact typography contracts.
- `node _tests/video-browser.cjs`: video decoding, seeking, responsive layout
  and verification that initial homepage loading does not request video bytes.
- `node _tools/preview.cjs`: a visual-only server on `http://127.0.0.1:4173`,
  using an already installed `marked` package (resolved via `NODE_PATH` if needed).
  It handles only this site's current Liquid subset and HTML blocks. It is not
  a substitute for Jekyll, SEO, feed or sitemap verification.
- `node _tests/browser.cjs`: uses an installed `playwright` package and Microsoft
  Edge to check all eight pages, scrolling, controls and responsive layouts.
  Start the preview first. Screenshots go into ignored `_site/verification/`.
  Network access is needed to verify the site's existing fonts and embeds.
- `node _tests/mechanical-browser.cjs`: checks mobile housing bounds, Contact
  expansion/focus isolation, physical button travel and reduced-motion behavior.

The 200% check exercises the equivalent 720 CSS-pixel desktop reflow, not actual
browser zoom controls. Run `bundle exec jekyll build` in a Ruby/Bundler environment
before release; preview success does not establish a successful Jekyll build.

## Shared Materials

The surface palette follows Neumorphism.io's `#e0e0e0` reference, with `#bebebe`
and white opposing shadows. Shadow distances scale with the control, rather
than applying the generator's large demonstration shadow everywhere. Button
states retain matching outset and inset layers so presses interpolate smoothly.

## Project Frame

Keep project IDs stable because they are public fragment links. Each existing
project element carries `data-project`, `data-category`, `data-year` and
`data-period`. The controller reads the heading from that element, not a second
copy of the project content. Categories are AI, XR, Heritage and UI-UX. Dates
describe the project, not its publication.

The frame's six real anchors are in the shared project include; the compact
mobile menu reuses them. Projects scroll with the document through the sticky
viewing frame, without an inner scrollbar or scroll snapping. Header height
measurements use `--header-height`, separate from `--nav-height`, to avoid
ResizeObserver feedback.

The homepage retains the green iPod screen and shortcut wheel. Its poetry display
uses real HTML and readable body type, with pixel lettering for the name and labels.
There are no visible poetry controls; keyboard focus or hovering pauses rotation.
Verse changes use newly shuffled tile masks for disappearance and appearance;
interruptions clear the masks immediately. Visible source captions are omitted,
while accessible figure labels and the translation document retain attribution.
Rotation pauses while hovered, focused, hidden or out of view, and is disabled
for reduced-motion users. Translation sources are recorded in
`docs/poetry-translations.md`; they still await the author's wording approval.

The wheel's up/right/down/left buttons open Profile, Research, Projects and
Contact. START loads and plays `assets/videos/jizura.mp4` on demand; subsequent
presses pause or resume playback. The native video controls provide seeking and
fullscreen. Escape returns to the profile. Switching screens, hiding the page or
scrolling the device out of view pauses playback without automatically resuming.
Inactive device pages do not reserve height, keeping the profile compact.
