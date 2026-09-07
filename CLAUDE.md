# CLAUDE.md — working instructions for this repo

This is boltwright.dev — a fastener engineering reference: calculators, geometry, and
standards. Read this before doing any work here.

`brand/brand-guide.md` is binding, not advisory. It settles voice, colour, type, and the
structural devices. If a change here contradicts it, the change is wrong — or the guide
needs a superseding entry in `decisions/`. Do not resolve the conflict silently.

## Ground rules

- **You run the tooling here.** Dev server, build, tests, linting — run them and read the
  output. This is a local static site with no estate behind it and no production box to
  break. (Note for anyone porting rules from the ironridge runbook set: that repo's
  never-touch-the-boxes rule is the exact inverse and does not apply here.)
- **One change per window.** One thing, then verify, then the next.
- **Nothing ships behind a claim.** A calculator is not done because it renders. See
  Standards below.
- **Never commit a secret.** No API keys, no analytics tokens, no deploy credentials in
  the tree. There is nothing here that needs one — if something appears to, stop and ask.

## Standards

- **A number that appears is not a number that is right.** A calculator running clean
  proves nothing. The bar is agreement with a worked example from the standard itself, or
  an independent hand-check recorded in the test. Every calculator ships with at least one
  such case pinned in a test, citing where the expected value came from.
- **Every value names its source.** ISO 898-1, ASME B18.2.1, ISO 4762 — with the edition
  year, because editions supersede. Where there is no source, the page says so in those
  words: "common shop practice, not standardized." An uncited number is a defect.
- **Assumptions are visible or the result is meaningless.** A torque figure without its nut
  factor, lubrication state, and target preload fraction is not a result. If a calculator
  has no assumption strip, it is not finished.
- **The equation is never hidden.** Every calculator carries its derivation disclosure.
  Closed by default, present without exception.
- **Standards editions are a dated fact, not a constant.** When a referenced standard is
  revised, the change is a `decisions/` entry and a revision-block row — not a silent edit.
- **Units are a correctness concern, not a display concern.** Conversions are tested. A
  metric/imperial toggle that rounds differently in the two paths is a bug.

## Where things live

| | |
|---|---|
| **`brand/`** | The design system. Binding. Changes are superseded via `decisions/`, never edited in place to mean something new. |
| **`decisions/`** | ADRs and post-mortems. A snapshot of reasoning, never current state. Filenames are an undated slug (`slug.md`); the date lives in the `**Decided:**` field at the top of the document. Superseding is expected here — standards get revised and choices get revisited — and is carried by **git history, not by accumulating files**: revise the entry in place and update its `**Decided:**` field, and `git log -p decisions/<slug>.md` is the record of what changed and when. A revision that reverses a decision says so in the body rather than quietly deleting the old reasoning — the diff shows what changed, but only the prose can say why. |
| **`reference/`** | Generic material with no boltwright specifics. |
| **Linear** | Team `Boltwright` (`BW-*`) — the task tracker and the single source of truth for done vs open. Unlike the ironridge team, issue titles and bodies here can be specific: there is nothing sensitive about a public reference site. |

Directories for the site itself are not created yet. The framework, hosting, and deploy
path are settled in `decisions/framework-and-hosting.md` — read it before scaffolding
anything, and supersede it rather than departing from it.

## Documentation hygiene

The recurring failure in a reference site is a page that outlived the standard it cites.

- **One home per fact.** Mutable status → Linear. Docs describe mechanism, not status.
  A page describes what a formula does; whether it is built lives in the tracker.
- **Cross-references are repo-root-relative paths in backticks** — `brand/brand-guide.md`,
  not a bare filename. Bare filenames go ambiguous the moment the tree grows.
- **Never write a count into a doc or a page.** "All calculators (14)" is a number that
  will be wrong. Derive it from the collection at build time or omit it. This applies to
  the brand guide's own home-page mockup, which shows a hardcoded count as shorthand.
- **State flows up and down, never sideways.** A page never restates another page's
  content — it links. Where duplication is genuinely unavoidable, leave an HTML-comment
  breadcrumb pointing at the other copy.
- **The grep sweep is part of "done".** Before closing any issue:
  `git grep -niE '<issue-id>|<topic keywords>'`, then fix every hit.

## Finishing a task

1. Reconcile **every** doc and page the change touches — not just the one named in the
   request. Run the grep sweep.
2. If the change alters a published page's substance, add a revision-block row. A silent
   edit to a cited page is the failure mode this site exists to avoid.
3. Draft the Linear closing comment: as-built + what was falsified + any decision and its
   reasoning.
4. Do not commit or push unless asked.
