# boltwright — fastener engineering reference

Calculators, geometry, and standards. A working reference for engineers who specify,
analyze, or troubleshoot threaded fasteners and bolted joints.

**Start here:** [brand/brand-guide.md](brand/brand-guide.md) — positioning, voice, and the
design system. It is binding; read it before building anything that renders.

[CLAUDE.md](CLAUDE.md) holds the working rules for this repo — the standards a calculator
has to meet before it counts as done, and the documentation hygiene rules.

| Directory | What's in it |
|---|---|
| [brand/](brand/) | The design system — binding, superseded via `decisions/` rather than edited |
| [decisions/](decisions/) | ADRs and post-mortems — reasoning as of a date, never current state; superseded through git history |
| [src/](src/) | The site — routes, content collections, components, and the pure TypeScript modules the tests import |
| [reference/](reference/) | Generic material, no boltwright specifics |

The site publishes four surfaces, and each has its own bar to clear before it counts as
published — see [decisions/scope-and-surfaces.md](decisions/scope-and-surfaces.md):

| | |
|---|---|
| **Calculators** | A pure core plus its full explanation on one page. Ships with a pinned worked example and a human-signed verification record. |
| **Visualizers** | Interactive geometry for what prose cannot carry — thread fit, allowance, coating against the tolerance zone. See [decisions/visualizer-device.md](decisions/visualizer-device.md). |
| **Articles** | Prose in MDX, embedding live calculators and spec callouts. |
| **Resources** | An annotated, dated index of external material. Every entry says what it is good for. |

```
src/
  content.config.ts      the entry schema — and the enforcement point for the rules above
  content/               calculators · visualizers · articles · resources
  lib/                   calc/ (pure cores + pinned tests) · data/ · units/
  components/            brand/ · devices/ · calc/ · viz/
  layouts/  pages/  styles/  assets/
```

Task tracking lives in Linear, team `Boltwright`. Cross-references between docs are repo-root-relative paths,
so they resolve from any depth.

## Status

Scaffolded, with the deploy path wired and the content schema in place — Astro and MDX,
Vitest, four empty collections, and a single placeholder page. See
[decisions/framework-and-hosting.md](decisions/framework-and-hosting.md) for why each piece
was chosen.

`npm run build` is the deploy gate: it type-checks and runs the tests before it builds, and
Cloudflare Pages runs that same command, so a failing test does not reach the site. The
type-check stage also validates every content entry against
[src/content.config.ts](src/content.config.ts), so an entry published without a signed
verification record fails the build rather than the review.

No calculators, visualizers, articles, or resources are published yet. What is built and
what is still open lives in Linear, not here.
