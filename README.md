# MA · 間

A Pomodoro focus timer built around the Japanese concept of **間 (ma)** — the
meaningful interval, the pause that gives shape to the work around it.

**Live:** https://benafcode.github.io/maticha_timer/

![Swiss-Japanese focus timer](docs/preview.png)

## What it does

- **Three modes** — Focus, Short Break, Long Break, each with its own duration
- **Task list tied to the cycle** — pick the task you're working on and each
  completed focus session is credited to it; a task that reaches its estimate
  completes itself and focus moves to the next one
- **Auto-advance** between focus and breaks, independently toggleable
- **Session tracking** — a dot per session toward the long break
- **Today's stats** — sessions, minutes focused, and a seven-day bar chart
- **Day streak** across consecutive days of use
- **Stoic quotes** from Epictetus, Seneca and Marcus Aurelius, rotating
  every three minutes
- **Everything persists** in `localStorage`, including the remaining time, so
  a refresh keeps your place

## Design

Swiss typographic discipline applied to a Japanese idea: a strict grid, a
single grotesque at a few decisive sizes, and a palette of ink, paper and one
signal red. No ornament, no shadows. Structure carries the design, and the
empty space is the point.

The visual system follows Part B of the `landing-page-design` skill vendored in
[`.claude/skills`](.claude/skills), which fixes the values rather than leaving
them to taste:

| | |
|---|---|
| Type | Geist, with Geist Mono for the countdown, stats and streak. Every size lands on a step of the Tailwind type scale, and every text element wears one of the named styles (`heading-3`, `body-6`, `caption-5`, …) defined once in `styles.css`. |
| Spacing | The thirteen spacing tokens, `--space-0` through `--space-900`. Nothing between them. |
| Radius | Tailwind radius values. Cards sit at 12px; the nested formula (inner = outer − gap) lands below 2 at every inner gap here, so the controls inside stay square. |
| Surface | Flat fills, borders all the way around a card, row divisions drawn as 1px rectangles rather than one sided strokes. Dark mode draws only from the six approved backgrounds. |
| Colour | One gradient on the whole page: black to grey across the countdown, white to grey in dark mode. Backgrounds are never gradients. |
| Motion | One curve, `cubic-bezier(0.22, 1, 0.36, 1)`. Only `transform` and `opacity` animate, so the progress bar scales rather than growing in width and the chart bars scale rather than changing height. `prefers-reduced-motion` drops the movement. |
| Icons | Inline SVG drawn in Phosphor's idiom (256 grid, 16px round strokes) rather than pulled from the package, to keep the zero dependency rule. |

Both themes ship. The page follows the operating system until you press the
switch in the masthead, after which your choice is remembered.

### Verifying it

The system is enforced by test rather than by discipline. Two Playwright suites
cover it: one walks every rendered element and fails on a font size outside the
scale, a padding or margin outside the spacing tokens, an off scale radius, a
partial card border, a banned typeface, an animated `width` or `height`, or a
browser default easing curve; the other drives the timer, the task list and
persistence. The layout is audited across fourteen viewports for horizontal
overflow and for the primary action staying above the fold.

## Running it

There is no build step. It's three files of vanilla HTML, CSS and JavaScript.

```bash
git clone https://github.com/BenafCode/maticha_timer.git
cd maticha_timer
npx http-server -p 8000      # or: python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly over `file://` works too, though serving it is
closer to how it runs in production.

## Deployment

Every push to `main` is published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which uploads
the repository root as a Pages artifact. Authentication uses the workflow's
OIDC token, so there are no secrets to configure. Pages must be set to deploy
from **GitHub Actions** (Settings → Pages → Source).

## Layout

```
index.html    markup and structure
styles.css    design tokens, grid and components
script.js     timer engine, tasks, stats, persistence
```

State lives in a single `state` object serialised to `localStorage` under the
key `ma_timer_v1`, and `render()` reflects it into the DOM.

## Credits

Typefaces: [Geist and Geist Mono](https://vercel.com/font) by Vercel.

Visual system: the `landing-page-design` skill from
[elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills),
MIT licensed, vendored in [`.claude/skills`](.claude/skills).
