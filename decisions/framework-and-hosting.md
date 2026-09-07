# Framework, hosting, and deploy path

**Decided:** 2026-09-07 · last revised 2026-09-07
**Status:** Accepted
**Supersedes:** nothing
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

Decides the static site framework, whether the calculators need a client framework, the
host, and how a build gets triggered. Written before anything is scaffolded, per BW-1.

The July tree (`sdrummond-eng/boltwright`, Astro + MDX) was not a considered choice — it
came out of `npm create astro`. This ADR either ratifies that on its merits or replaces
it. It ratifies it, for reasons that are not the reasons it was originally picked.

---

## Constraints

Binding, from `brand/brand-guide.md` §9 and §8:

- Static-first. Calculators run client-side.
- No account, no cookie banner, no analytics requiring consent.
- Self-hosted fonts, no CDN dependency.
- Results update on input, no submit button. Responsive to 360 px.

From `CLAUDE.md`:

- Every calculator ships with at least one worked example from the standard pinned in a
  test. A calculator that renders is not a calculator that is done.
- Unit conversions are a correctness concern and are tested.
- Never commit a secret. Nothing here should need one.

From the repo:

- `origin` is GitHub (`sdrummond-eng/boltwright`) and is the deploy trigger.
- `forgejo` (LAN) is a backup mirror and must not appear in the build path.

---

## Decision 1 — Framework: Astro

Content-driven static output with typed content collections andisland-scoped client JS.

**Why it wins.** Two constraints do the deciding. Zero JS shipped by default with opt-in
islands maps exactly onto "static-first, calculators run client-side" — the article pages,
which are most of the site, ship no runtime at all, and only a calculator hydrates. And
the content collection schema is Zod-validated at build time, which the entry schema in
`decisions/content-taxonomy.md` needs: `sources[]`, `flag`, `dataRung` and a
`draft` publication gate are all build-time-enforceable rather than conventions someone
has to remember. *(Revised 2026-09-07: `flag` and `dataRung` no longer exist — the ratified
schema drops them and adds a `verification` block. The argument is unaffected and is in fact
stronger, since the verification gate depends on build-time validation in a way the
confidence fields never did.)*

**Alternatives and why they lost:**

| Candidate | Why not |
|---|---|
| **Eleventy** | Genuinely close, and lighter. Loses on interactive components: embedding a live calculator into a prose page is hand-wired per instance, and there is no typed frontmatter — the entry schema becomes a convention rather than a build error. |
| **Hugo** | Fastest builds and no npm tree at all, which is real. Loses on the same two points as Eleventy, and Go template shortcodes are a poor host for the calculator/prose-on-one-page layout the guide mandates. |
| **Next.js (static export)** | Ships a React runtime to a site that is predominantly prose. Pays a framework cost on every page to get interactivity on some. Inverts the ratio this site actually has. |
| **Hand-rolled HTML** | The revision block, assumption strip, and spec callout repeat on every page, and the calculator index derives from the collection. That is a generator, and writing one is not the work. |

**Version.** Pin the major current at scaffold time in the lockfile, and record it in the
BW-2 closing comment. The July tree was on Astro 7. The lockfile is committed
(`.gitignore` already says so); the version is not restated in prose anywhere, because a
version written into a doc goes stale silently.

**MDX.** Yes, for article entries — prose that embeds a live calculator or a spec callout
is the whole point of the format.

*Revised 2026-09-07.* This paragraph originally continued: "Calculator pages themselves are
components, not MDX." **That is reversed — calculator pages are MDX entries too.** It is a
reversal on the merits rather than a correction of fact, so the original wording is quoted
here rather than replaced.

The reasoning that overturns it is that `brand/brand-guide.md` §7 puts the calculator and its
full explanation on one page, never split — the derivation, the assumption set in full, the
worked example, and links to the articles explaining each input all sit below the fold. That
is substantial prose, and an `.astro` page makes writing it worse for no gain. The interactive
part is an imported island either way, so the choice was only ever about the prose around it.
The alternative — a component page plus a separate collection entry carrying its metadata —
splits one entry across two files and puts its title, sources, and verification record
somewhere other than the thing they vouch for, which `CLAUDE.md`'s "one home per fact"
forbids and which `decisions/verification-and-authorship.md` depends on not happening.
Calculator *components* remain components; calculator *pages* are MDX.

## Decision 2 — Calculator runtime: vanilla TypeScript, no client framework

The deciding argument is testability, not ergonomics.

`CLAUDE.md` requires every calculator pinned to a worked example from the standard it
cites. That forces the calculation core to be a plain TypeScript module — pure functions,
numbers in and numbers out, no DOM — so it runs under a test runner in Node with nothing
mounted. That module has to exist regardless of what renders it.

Once it does, the UI layer is: read some numeric inputs, call a pure function, write the
results, and re-run on `input`. That is a small shared binding module, not a framework.
Adding Preact would put a runtime on the page to save code that mostly is not there.

**Test runner: Vitest.** It shares Vite's transform pipeline with Astro, so the pure
calculation modules are importable in tests with no separate build config. The worked
examples cite their source in the test itself, per `CLAUDE.md`.

**Unit toggle.** The guide (§8) requires a single global metric/imperial toggle, persisted,
never per-field. That is shared state across islands and is the one thing genuinely
awkward without a framework. It is handled as a module-scoped store plus a custom event,
with conversion applied at the boundary — never inside the calculation core, so the two
unit paths cannot round differently. `CLAUDE.md` names that divergence as a bug; keeping
conversion out of the core is what makes it testable as one.

**Revisit trigger — stated in advance so the reversal does not need re-litigating.** If the
shared binding module grows its own component model, lifecycle, or reactive graph, it has
become a framework by accretion and lost the argument above. At that point switch to
Preact via Astro islands, which is the named fallback. That switch is a superseding ADR,
not a silent refactor.

## Decision 3 — Host: Cloudflare Pages

**Verified 2026-09-07, in the Cloudflare dashboard:** the `boltwright.dev` zone is active
on the free plan, and Workers & Pages holds no projects at all. So Cloudflare is already
in the path for this domain — the usual argument against it, taking on a second vendor,
does not apply — and BW-2 creates the Pages project from scratch rather than attaching to
an existing one. Account subdomain is `sdrummond.workers.dev`; the account also holds the
`afsac.net` and `ironridge.dev` zones, which share nothing with this project.

**Why it wins.** Per-PR preview deployments. For a site whose stated failure mode is a
published number that is wrong, looking at a rendered calculator at a real URL before it
goes live is worth more than it would be on a typical static site — the defect this site
exists to avoid is not a broken layout, it is a plausible-looking wrong value, and that is
exactly the kind of thing that survives a local dev-server glance. DNS, TLS, and the apex
record are already administered in the same place the deploy lives.

**Alternatives and why they lost:**

| Candidate | Why not |
|---|---|
| **GitHub Pages via Actions** | The genuine runner-up. Its expected advantage — no credential to manage — evaporates once Cloudflare's native Git integration is used instead of `wrangler` (Decision 4), since that path needs no token either. What remains is that GitHub Pages keeps the build definition in a committed workflow file rather than in dashboard settings. It loses on preview deployments, and on splitting DNS from deploy across two providers when one already holds the zone. |
| **Netlify** | Functionally close to Cloudflare Pages, with a tighter free build tier, and it would mean a third vendor when the zone is already at Cloudflare. Nothing this site needs is Netlify-specific. |

**The accepted cost.** The build runs in Cloudflare's environment rather than one this repo
fully specifies. That is the trade for needing no credential; see Decision 4. If it becomes
a problem, the move is to Actions plus `wrangler`, which brings the build back into the repo
at the cost of a token.

*Revised 2026-09-07.* This paragraph originally claimed the Node version was part of that
cost — "set in project settings, not in a committed file." That was wrong, and it was
wrong at the time of writing rather than overtaken by events. Cloudflare Pages reads a
committed `.nvmrc`, verified in the BW-2 preview build log: `Detected the following tools
from environment: nodejs@22.23.1, npm@10.9.2`, followed by `Installing nodejs 22.23.1`.
No `NODE_VERSION` variable is set in the project settings, deliberately, so the committed
file stays authoritative and the version moves by commit like everything else.

The cost is therefore smaller than stated, not absent. What remains outside version control
is the rest of the build environment — base image, the `npm` the image ships, and the
toolchain installer — which the repo does not pin and cannot. Node, the one part of it that
would actually change build output, is pinned in the tree.

**Analytics.** None. Cloudflare Web Analytics is cookieless and would be permissible under
`brand/brand-guide.md` §9, but "no analytics requiring consent" is a floor, not a target,
and the site has no decision that traffic data would inform.

## Decision 4 — Deploy trigger: push to `main` on `origin`

Build and deploy on push to `main` at `sdrummond-eng/boltwright`. No scheduled rebuilds —
the content is static and a standard's revision is a commit, not a cron event.

The `forgejo` remote is never in the build path. It is a mirror, pushed to separately, and
nothing reads from it.

**The build gate.** The deploy runs only if the test suite passes. This is the mechanism
behind "nothing ships behind a claim": a calculator whose pinned worked example has stopped
agreeing with the standard must not reach the site. Type-check and build are part of the
same gate.

**Mechanism: Cloudflare Pages' native Git integration, not Actions plus `wrangler`.**
Cloudflare watches the GitHub repo directly, builds on its own infrastructure, and
publishes production from `main` with a preview per pull request. The alternative — build
in GitHub Actions, deploy the artifact with `wrangler` — gives finer control over the
build environment but requires a `CLOUDFLARE_API_TOKEN` and account ID in Actions secrets.
The native path requires no credential anywhere, which is the better answer for a repo
whose rule is that nothing here should need a secret. Node version is pinned by a committed
`.nvmrc`, which Cloudflare honours — see the revision under Decision 3.

**Credentials: none.** No API token, no `.env`. The `.gitignore` `.env` rule stays as
written and remains unexercised. If the build environment ever proves too constrained and
the Actions-plus-`wrangler` path becomes necessary, the token it needs lives in Actions
secrets and never in the tree — but that is a change to make deliberately, not a default.

**The gate under this mechanism.** Because Cloudflare runs the build command, the test run
has to be inside it — the build command is the gate, and a non-zero exit from the tests
fails the deploy. BW-2 wires it that way. A build command that runs only the build is the
specific misconfiguration that would silently disarm "nothing ships behind a claim."

---

## Consequences

- BW-2 scaffolds Astro with MDX and Vitest.

  *Revised 2026-09-07.* This bullet originally put the self-hosted IBM Plex Sans, Plex Mono,
  and Source Serif 4 subsets in BW-2 as well. That was wrong on the facts rather than on the
  merits: BW-3 already exists as a standalone issue for exactly that work, and BW-2's own body
  scopes itself to the pipeline and not the content. The constraint above is untouched — fonts
  are self-hosted and subset, committed to the repo, never fetched at build. Only which issue
  carries the work has moved, to BW-3. Recorded rather than quietly corrected because a reader
  of this entry could otherwise conclude the font constraint had been dropped.
- The seven-room taxonomy is still unratified. Astro's collection model does not force
  that decision either way — `room` is a schema field, and where calculators sit relative
  to rooms remains open per `decisions/content-taxonomy.md`.
- The confidence-versus-currency tension in that ADR is untouched here. It is a content
  modelling decision, not a framework one, and needs its own entry.

  *Revised 2026-09-07.* Both bullets were true when written and were overtaken the same day.
  `decisions/content-taxonomy.md` has since been ratified: rooms are no longer the primary
  axis, `topic` replaces `room` as a cross-cutting tag, and the confidence fields are dropped
  rather than reconciled. Neither outcome disturbs anything decided here — which is the point
  the bullets were making, and it held. They are left standing rather than rewritten, because
  a prediction that came true is worth more as a record than as a deletion.
- No CMS. Entries are files in the repo, and revision history is git.

## What this does not decide

- The taxonomy, the nav shape, and whether calculators are entries in rooms or a parallel
  axis. *(Decided 2026-09-07 in `decisions/content-taxonomy.md`: artifact type is the
  primary axis and calculators are their own collection. Left listed, because what this
  entry declined to decide is part of its record.)*
- Search. The guide's article mockup shows a search field in the masthead; whether that is
  a client-side index or is deferred is a separate decision.
- Whether a Cloudflare Pages project already exists for this domain, and the registrar of
  record. Neither changes the decision above; both are BW-2 groundwork.
