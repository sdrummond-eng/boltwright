# Scope — what boltwright offers, and what it refuses

**Decided:** 2026-09-07 · last revised 2026-09-07
**Status:** Accepted
**Supersedes:** nothing
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

Fixes the surfaces the site publishes, the bar each must clear before it counts as
published, and the things this site will not do. Positioning, audience, and voice are
already settled in `brand/brand-guide.md` §1–§2 and are not restated here.

---

## Context

Three constraints shape everything below, and none of them is a preference.

**The cadence is evenings.** This is worked on after a full day of engineering. The
scarce resource is not AI throughput, it is the human attention that the verification
gate in `decisions/verification-and-authorship.md` reserves. Any plan that spends that
attention on layout review, dependency triage, or copy-editing has spent it wrong.

**The failure mode is a plausible wrong number, not a broken page.** A layout defect is
visible and embarrassing for an afternoon. A torque value that is wrong by a factor
because the nut factor was applied to the wrong diameter is invisible, gets copied into
someone's calculation notes, and stays wrong. Every mechanism in this repo — the build
gate, the pinned worked examples, the assumption strip, the revision block — exists
against that one failure, and scope decisions are made against it too.

**Standards text is copyrighted; standards facts are not.** ISO, ASME, SAE and DIN sell
the documents this site cites. A single dimension, a formula, a property-class value, or
a clause reference is a fact and is citable. A reproduced table is a substitute for the
document and is not. This is a scope boundary, not a legal opinion, and it is drawn
conservatively in Decision 2 below.

---

## Decision 1 — Four surfaces

The site publishes four kinds of thing and nothing else. Each has a different bar, and
the bar is what makes it a surface rather than a page.

### Calculators

A pure calculation core plus the page that explains it, on one page, never split
(`brand/brand-guide.md` §7). This is the site's centre of gravity — the hero is a working
calculator, not a headline.

**Bar to publish.** All five, no exceptions:

1. A pure TypeScript core in `src/lib/calc/` — numbers in, numbers out, no DOM.
2. At least one worked example from the cited standard, or an independent hand-check,
   pinned in a test that says in the test where the expected value came from.
3. A complete verification record, human-signed. See
   `decisions/verification-and-authorship.md`.
4. An assumption strip listing every assumption the number rests on.
5. A derivation disclosure carrying the equation and its symbol definitions.

Items 4 and 5 are `brand/brand-guide.md` §6 restated as a publication condition, because
"the calculator is not finished without them" needs somewhere to be enforced.

### Visualizers

Interactive geometry for the concepts that do not survive prose — thread fit and
tolerance class, allowance and clearance, coating thickness against the tolerance zone,
engagement length. The device, and the carve-out it needs from the motion rule, are
defined in `decisions/visualizer-device.md`.

**Bar to publish.** A visualizer that displays a computed dimension is making a numeric
claim and clears the calculator bar in full. A visualizer that is purely diagrammatic —
naming parts, showing a sequence — clears items 3 through 5 only. There is no third
category: if it shows a number, the number is verified.

### Articles

Prose, in MDX, embedding live calculators and spec callouts. The format exists so that an
explanation and the thing it explains are the same page.

**Bar to publish.** Every value names its source with the edition year. Where there is no
source, the page says "common shop practice, not standardized" in those words. A revision
block with at least an initial issue row. An uncited number is a defect, not a draft.

### Resources

An annotated, dated index of external material — the standards themselves and where to
buy them, calculators and tables worth trusting, university and manufacturer
documentation. This is the surface that most easily rots and most easily degrades into
link-farming, so it carries two rules the others do not.

**Bar to publish.** Every entry carries a `checked` date and a one-line note saying what
it is good for and, where relevant, what it gets wrong. A link with no annotation is a
bookmark, not a resource, and does not go in. Commercial material is labelled as such —
see Decision 2.

---

## Decision 2 — What this site does not do

Stated as decisions rather than absences, so that adding one later is a superseding entry
rather than a drift.

| Not doing | Why |
|---|---|
| **Reproducing standards tables wholesale** | The document is what ISO and ASME sell. Cite the clause, publish the value the calculation needs, link to where the document is bought. A table complete enough to replace the standard is not published even where it is arguably lawful. |
| **Accounts, logins, saved profiles** | `brand/brand-guide.md` §9 is a floor. Saved results are handled without an account — see `decisions/saved-results.md`. |
| **Analytics, cookie banners, consent surfaces** | Settled in `decisions/framework-and-hosting.md`. No decision here would be informed by traffic data. |
| **Comments, forums, user submissions** | Every one of them is a moderation obligation on an evening budget, and an unverified number appearing under the site's own masthead is precisely the failure this site exists against. |
| **A newsletter, or any email capture** | No lead-gen funnel, per `brand/brand-guide.md` §1. There is nothing to capture an address for. |
| **Supplier listings, part sourcing, affiliate links** | "Maker, not merchant." A vendor's own documentation may appear in Resources, labelled as vendor material; a link that earns money may not appear at all. |
| **CAD models or downloadable part geometry** | A different product with a different verification problem, and one already well served elsewhere. |
| **Metric-only or imperial-only** | Both unit paths are published and both are tested. `CLAUDE.md` names a divergence between them as a bug, not a limitation. |
| **Design-code compliance claims** | The site publishes what a standard says and what a formula computes. It does not tell anyone their joint is compliant, safe, or approved. |

**Disclaimer.** Every calculator carries an assumption strip, which is the honest version
of a disclaimer and is already mandated. A separate site-wide legal disclaimer page is
*not* a substitute for it, is not a scope item here, and must never be used to justify a
thinner assumption strip.

---

## Decision 3 — Work in vertical slices, never horizontal layers

The natural way to build this is layer by layer: all the tokens, then all the components,
then all the calculators. That ordering is wrong here for a specific reason. It defers
every real correctness question — the ones only the human gate can answer — behind weeks
of work that AI can do unsupervised, and it produces nothing publishable until the last
layer lands.

So: **one calculator end to end before a second of anything.** Tokens, type, the mark,
the masthead, the revision block, the assumption strip, the derivation disclosure, the
unit toggle, the permalink, the core, and the pinned worked example — all of it, but only
as much of each as the first calculator needs. The second calculator then costs a
fraction of the first, and the shared parts have been load-tested by a real entry rather
than designed against a hypothesis.

This is `CLAUDE.md`'s "one change per window" applied at the scale of the project rather
than the commit.

**The first slice is the preload and tightening torque calculator** — BW-14. It is the
hero on the home page mockup in `brand/brand-guide.md` §7, so it is the entry that has to
exist for the site to make its own argument, and it exercises the widest set of shared
parts: two data tables, a unit toggle, a verdict against proof load, an assumption strip
with four live assumptions, and a derivation.

---

## Decision 4 — The publication bar for the site as a whole

The site goes public when one calculator clears the Decision 1 bar in full, and not
before. Not when it looks finished — when one number on it is defensible end to end.

Until then the deployed site says what it says now: scaffolded, nothing published. A
reference site that publishes an unverified number once has spent the only thing it has.

---

## Consequences

- The taxonomy in `decisions/content-taxonomy.md` is ratified against these four surfaces
  rather than against the provisional seven rooms.
- Three mechanisms follow and are decided separately: the verification gate
  (`decisions/verification-and-authorship.md`), saved results
  (`decisions/saved-results.md`), and the visualizer device
  (`decisions/visualizer-device.md`).
- Resources needs a link-rot check that is a repeatable chore rather than a memory. The
  `checked` date makes staleness visible; the chore itself is a Linear issue, not a doc.
- The copyright boundary in Decision 2 constrains the data tables in BW-12 and BW-13.
  Both are scoped to the values the calculators consume, not to the full published table.

## What this does not decide

- Search. Still open, still noted in `decisions/framework-and-hosting.md`.
- Whether articles ever carry a named author beyond the revision block's `BY` column.
- The licence the site's own prose and calculators are published under.
