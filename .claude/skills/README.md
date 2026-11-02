# Skills

Third-party Claude Code skills vendored into this repo.

| Skill | Source | License | Role |
|---|---|---|---|
| `landing-page-design` | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | MIT | The rules: type scale, spacing tokens, radius, motion, ship list |
| `taste-skill` (`design-taste-frontend`) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | The directions: a researched library of styles, palettes, type pairings and blueprints |
| `redesign-existing-projects` | [elayadesign/redesign-skill](https://github.com/elayadesign/redesign-skill) | MIT | The diagnostic: audits an existing interface and fixes in place |
| `logo-design` | [kaankiziltug/logo-design-skill](https://github.com/kaankiziltug/logo-design-skill) | MIT | Marks and logotypes: brief, concepts, SVG construction, testing at 16px, export variants |
| `figma-designer` | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | MIT | Figma work, needs the Figma MCP (not connected in cloud sessions) |

Installed from commit `456d9e0` of `ai-design-skills`, `12af471` of `taste-skill` and
`7df13f6` of `redesign-skill`. To refresh:

```bash
npx skills add elayadesign/ai-design-skills
npx skills add Leonxlnx/taste-skill
```

## How they fit together

`landing-page-design` is the constraint layer and the one the app is currently
built on; its values are enforced by the Playwright compliance suite. `taste-skill`
is the creative layer: it deals a researched direction rather than letting a model
reach for the category default. They conflict hardest at type — the first permits
four families, the second deals from forty four pairings, and the two sets do not
overlap at all. Decide precedence before combining them, and prefer `--keep palette,type`
on a taste-skill draw so it deals composition only.

Note that `taste-skill` routes app screens (dashboards, settings, anything worked
in rather than read) through `references/app-screens.md`, which has its own run and
its own house rules. This timer is an app screen, not a page.

`taste-skill/scripts/assets.mjs` makes outbound calls to Openverse, Wikimedia
Commons and the Art Institute of Chicago to fetch openly licensed photography. The
other scripts are local only.

## logo-design is installed slim

Upstream (commit `7340903`) ships a 14MB library of 1,432 classified real-world SVG
logos under `assets/library/`. It was left out to keep this repository small, which
costs two things: the category research in Phase 2 (`search_library.py --industry
... --summary`) and the peer test in the Phase 5 craft pass, which compares a mark
against exemplary files at the same size. Everything else — the brief, concepts,
SVG construction rules, the audit, the test sheet, export variants and the
presentation board — works as shipped. Its nine scripts are stdlib-only Python 3
with no network calls; rendering shells out to whichever of rsvg-convert, Inkscape
or headless Chromium is present.

To restore the library:

```bash
git clone --depth 1 https://github.com/kaankiziltug/logo-design-skill /tmp/lds
cp -r /tmp/lds/skills/logo-design/assets .claude/skills/logo-design/
python3 .claude/skills/logo-design/scripts/build_catalog.py
```

## Note on this app

`landing-page-design` claims scope over "all web UI work", and some of its rules
conflict with deliberate choices in this timer:

- It bans Inter; the Swiss layout here uses Inter on purpose (a grotesque is the
  canonical choice for the International Typographic Style).
- It mandates a scroll-reveal tagline section, a nav bar, a 404 page and
  marketing-page furniture that a single-screen focus timer has no use for.

Its own scope note settles this: "When the user's explicit prompt conflicts with
a rule, the user wins." Treat it as a reference for new marketing pages, not as
a mandate to restyle the timer.
