# Skills

Third-party Claude Code skills vendored into this repo.

| Skill | Source | License |
|---|---|---|
| `landing-page-design` | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | MIT |
| `figma-designer` | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | MIT |

Installed from commit `456d9e0` of that repo. To refresh:

```bash
npx skills add elayadesign/ai-design-skills
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
