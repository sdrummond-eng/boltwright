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
| [src/](src/) | The site — Astro pages and the pure TypeScript modules the tests import |
| [reference/](reference/) | Generic material, no boltwright specifics |

Task tracking lives in Linear, team `Boltwright`. Cross-references between docs are repo-root-relative paths,
so they resolve from any depth.

## Status

Scaffolded, with the deploy path wired — Astro and MDX, Vitest, and a single placeholder
page. See [decisions/framework-and-hosting.md](decisions/framework-and-hosting.md) for why
each piece was chosen.

`npm run build` is the deploy gate: it type-checks and runs the tests before it builds, and
Cloudflare Pages runs that same command, so a failing test does not reach the site.

No calculators or reference content are published yet. What is built and what is still open
lives in Linear, not here.
