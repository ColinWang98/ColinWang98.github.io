# Homepage Poetry Drafts

Status: **Pending author approval** for all three English translations. These are
excerpt translations, not existing English originals or complete-poem translations.
The public label is `POETRY / NOTES`, as requested; no translation/draft wording is
shown or announced. This document remains the approval record for the English
drafts. The original Chinese title stays linked to `/others/#poetry`.

## Source And Approval Record

Source: the existing `poems` array in `assets/js/site.js`. The source lines below
are verbatim, including spaces and the quotation marks around the first excerpt.
No source poem has been changed.

| Original title | Exact original excerpt | English draft | Approval |
| --- | --- | --- | --- |
| 空悬 | `"我们取一些风晾晒在阳台"` | We hang a little wind out on the balcony. | Pending author approval |
| 低语 | `钢铁森林 迷雾笼罩着金属的声音` | A forest of steel; mist shrouds the sound of metal. | Pending author approval |
| 一场游戏 | `霓虹聚又散 世界化作一场狂欢` | Neon gathers, then dissolves; the world becomes a carnival. | Pending author approval |

The first and third English drafts were supplied in the implementation request.
The proposed second draft preserves the steel forest, obscuring mist, and metal's
sound. It does not substitute silence or add a speaker. Its semicolon expresses
the break represented by the original space. The first draft omits the original
quotation marks for display; the exact Chinese punctuation is retained above.

The first excerpt has one authored English line. The second and third break into
two lines at the semicolon. Lines may wrap further on narrow screens or at enlarged
text sizes rather than clipping or shrinking. The English wording remains pending
approval despite the requested public label; Chinese titles stay untranslated.

## Parent Integration

The component does not edit or automatically load from homepage/shared files.
The parent integrator should place this include inside the large `.hero-display`,
below the name, role, and motto. It is a compact poetry footer, not a separate hero
column or outer card:

```liquid
{% include hero-poem.html %}
```

Load the stylesheet after shared styles and load the independent script once on
the homepage (with `defer` if placed in the head):

```html
<link rel="stylesheet" href="{{ '/assets/css/hero-poem.css' | relative_url }}">
<script src="{{ '/assets/js/hero-poem.js' | relative_url }}" defer></script>
```

The parent loads Pixelify Sans via its homepage-only Google Fonts link. This
component does not load fonts; its pixel text falls back to local Consolas and
monospace. Source text, labels, and controls retain the global sans-serif font.

`docs` is already excluded in `_config.yml`. This approval document has no Jekyll
front matter and is not public page content.

## Component Contract

- Root: `.hero-poem`, borderless and transparent, with compact 6px gaps. It inherits
  the global sans-serif stack and shared material tokens. The former serif modifier
  is removed. No shared styles or hero markup are changed by this component.
- Text: `.hero-poem__label`, `__verses`, `__entry`, `__quote`, `__text`, `__line`,
  and `__source`, all with the `hero-poem` prefix. Selectable native HTML verse text
  uses Pixelify Sans at 18px, or 16px at viewport widths up to 600px, in one graphite
  color on a faint e-ink plate. Label and normal-font source text are 13px. There
  is no canvas, texture over the text, fixed text height, clamping, or clipping.
- Stable slot: enhanced entries share grid cell `1 / 1`. All three contribute
  their intrinsic height, even when invisible, so the longest wrapped verse sets
  the slot size. Inactive entries use `visibility: hidden`, `inert`, and
  `aria-hidden="true"`; only `[data-poem-entry][aria-hidden="false"]` is active.
  The slot grows naturally with longer text, responsive width, or text scaling.
- Footer: `.hero-poem__footer`, `.hero-poem__decoration`, `.hero-poem__next`,
  `.hero-poem__pause`. Both quiet controls are at least 44px tall. Pause/Resume
  reserves the same width. The tiny 12px-high decorative area is separate from
  the text, noninteractive, and hidden from assistive technology.
- Paired patterns: the panel's `data-poem-index` is `0`, `1`, or `2` for the current
  verse. CSS pairs these with horizontal lines/dots (空悬), upright strokes (低语),
  and staggered dot dither (一场游戏). All use shared muted ink at 25% opacity. A selection
  changes both the poem and its pattern and never immediately repeats the pair.
- Material tokens: ink follows `--text-strong`, plate follows `--surface-soft`,
  dither/disabled text follow `--text-muted`, and controls follow `--border` and
  `--accent`. Neutral fallbacks match the parent's `#e0e0e0` material direction;
  parent-owned shadows stay outside this borderless component. Pattern opacity
  applies only to the decorative area, never to the reading surface or text.
- JS hooks: `[data-hero-poem]`, `[data-poem-entry]`, `[data-poem-text]`,
  `[data-poem-next]`, `[data-poem-pause]`, `[data-poem-announcement]`; initialization sets
  `data-hero-poem-ready`. There are no IDs or global browser exports.
- Rotation: select once on load without announcement or animation, then change
  every 15 seconds while eligible. One interval per instance is managed centrally;
  repeated initialization cannot double it. Manual next restarts the countdown.
  No network, shared-controller, scroll handler, or animation-loop dependency.
- Pause/Resume: the label and `aria-pressed` reflect the user's explicit pause
  preference, not temporary suspension. Hover, focus anywhere inside the component,
  a hidden document, or being outside the viewport independently stop the timer.
  Resuming waits until all blockers clear and starts a fresh 15-second countdown.
  IntersectionObserver supplies viewport visibility when supported.
- Reduced motion: starts paused and disables Resume while the preference is active.
  Manual next remains available. Enabling reduced motion stops an existing timer;
  disabling that preference leaves explicit pause on until the user selects Resume.
- Refresh: `.hero-poem__entry--changed` applies a single local 200ms stepped opacity
  refresh on manual or automatic changes. Opacity varies only from 0.65 to 1; there
  is no full-plate white/black flash or continuous motion. Reduced motion removes
  the refresh immediately in CSS.
- Accessibility: `.hero-poem__announcement` is an initially empty, visually hidden
  polite status region, updated only after manual changes. Focus stays on the
  native button; normal keyboard activation and visible focus outlines apply.
- Without JS: the first English draft and Chinese source link remain ordinary
  readable HTML. Other entries and both inactive controls stay natively `hidden`.
- Node export: `nextPoemIndex(count, currentIndex, randomValue)`, with `-1` for no
  prior selection and a random sample in `[0, 1)`. This pure helper is the same one
  used in the browser. Empty pools return `-1`; single-entry pools return `0`.

## Verification

```sh
node --test _tests/hero-poem.test.cjs
```

Tests were written first and observed failing on the missing component files.
The revised tests were also observed failing before implementation. They cover
paired selection, interval uniqueness, every automatic-pause condition, explicit
pause/resume, reduced-motion changes, manual-only announcements, native fallback,
the intrinsic grid-slot/accessibility contract, e-ink styling, shared neutral
material tokens, and draft sources.
Controller tests execute the real script with a minimal DOM and interval double.

No browser sessions were launched for this revision, per the parent's request.
Earlier standalone browser results apply to the superseded static card, not this
e-ink footer. The parent is responsible for current integrated-browser verification:

1. At desktop and 320px widths, compare the verse-slot and footer bounds across all
   three selections, and check no overflow. Repeat with enlarged text; the slot
   may grow but must not clip or change height solely because the selection changes.
2. Confirm only one verse and source link is exposed to assistive technology, and
   that only manual next announces text. Test keyboard focus across both controls.
3. Verify 15-second rotation changes the pair, every pause condition stops it, and
   Resume does not start rotation while focus/hover is still inside the component.
4. Verify the local stepped refresh, no flash, no rotation/refresh under reduced
   motion, and a readable default verse with both controls hidden without JS.
