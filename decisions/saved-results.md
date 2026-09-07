# Saved results — permalink first, file export second, no local storage

**Decided:** 2026-09-07 · last revised 2026-09-07
**Status:** Accepted
**Supersedes:** nothing
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

Decides how a calculator result is saved, given that `brand/brand-guide.md` §9 forbids
the account that would normally carry it.

---

## Context

Results have to leave the page. `brand/brand-guide.md` §8 already requires a copy control
on every result row, yielding the value, its unit, and the assumption line as plain text,
"because it's going into someone's calculation notes." That is the floor, and it is not
enough on its own: it captures one row, and it captures the output without the input that
produced it.

Two distinct needs sit above it, and conflating them is what produces an account system
nobody asked for:

- **Sharing.** Sending a colleague the case, not the answer — so they can see the inputs,
  change one, and disagree with it.
- **Recording.** Putting the result into a design file or a calculation package, where it
  has to survive without the site.

An account serves both badly and costs the §9 floor. Neither need requires one.

---

## Decision — Two mechanisms, staged, and explicitly not a third

### Stage 1: the URL is the saved state

Calculator inputs encode into the query string. Changing an input rewrites it with
`history.replaceState` — no navigation, no history spam. Loading a URL with parameters
restores those inputs and recomputes client-side.

```
boltwright.dev/calculators/preload?thread=M10x1.5&class=10.9&k=0.20&target=65&u=metric
```

**Why this is the primary mechanism.** The saved thing is a link, and a link is
shareable, bookmarkable, pasteable into a design review or an email, and survives the
browser being wiped or changed — which is exactly what browser storage does not do. It
needs no storage, so it raises no consent question and leaves §9 untouched. It is
reviewable: a colleague opening it sees the assumptions, not just the number. And it
degrades honestly — a link to a calculator that has since been revised recomputes under
the current formula rather than replaying a stale answer, which for a reference site is
the correct behaviour and not a bug.

**Rules.**

- Parameter names are stable and are part of the site's contract. Renaming one breaks
  every link anyone has saved, and is a `decisions/` entry and a revision-block row.
- An unrecognised or out-of-range parameter is a diagnostic inline error naming the valid
  range, per `brand/brand-guide.md` §8 — never a silent fallback to a default. A link that
  quietly computes something other than what it says is the site's whole failure mode.
- The unit toggle is a parameter (`u=metric|imperial`) so a shared link opens in the
  units it was written in. Conversion still happens at the boundary and never inside the
  calculation core, per `decisions/framework-and-hosting.md` Decision 2.
- Encoding and decoding is a pure module in `src/lib/permalink.ts` with a round-trip
  test. It is a correctness path, not a convenience: a URL that decodes to different
  inputs than it encoded is the same class of defect as a unit conversion that rounds
  differently in two paths.

### Stage 2: file export as the record

A download of the full case — every input, every result, every assumption, the standard
and edition cited, and the site revision that computed it.

- **CSV and plain text** for a calculation package. Serialisation lives in
  `src/lib/export.ts`, pure and tested.
- **PDF via a print stylesheet**, not a PDF library. The calculator page already contains
  everything the export needs; `@media print` is a stylesheet, whereas a PDF generator is
  a dependency, a second rendering path, and a second thing to keep agreeing with the
  first.

**Every export carries its provenance.** A result in someone's design file six months
from now needs to say which calculator, which standard edition, which revision, and which
date produced it, or it is an orphaned number — the exact artefact this site exists to
argue against.

### Not doing: localStorage saved cases

Named case sets persisted per browser were considered and rejected.

| Against | |
|---|---|
| Solves neither need | Invisible to a colleague, and gone when the browser is wiped. Sharing and recording are both better served by the two mechanisms above. |
| Costs the §9 floor | Storage introduces a consent conversation the site currently does not have and does not want to acquire for a convenience feature. |
| Silent staleness | A stored case replayed after a formula revision is a stale number presented as current, with nothing on screen saying so. |

**Revisit trigger, stated in advance.** If a genuine repeat-user pattern emerges — the
same engineer working a set of joints across sessions, for whom re-pasting links is real
friction — the answer is still not localStorage. It is a permalink that encodes a *set*
of cases. That keeps the saved thing shareable and reviewable, which is the property
worth protecting.

---

## Consequences

- BW-17 (copy control) is the floor and is unchanged. Stage 1 sits above it, not instead
  of it.
- Two new pure modules join `src/lib/`: `permalink.ts` and `export.ts`. Both are tested
  the way the calculation cores are, because both are correctness paths.
- Parameter-name stability is a published contract. It belongs in the calculator's own
  revision block when it changes.
- The print stylesheet is a real deliverable with a real bar — a calculator that prints as
  a broken two-column layout has not shipped its export.

## What this does not decide

- Whether a permalink is shortened, or the URL is left long and honest. Long and honest is
  the default until someone complains.
- Whether the home-page hero calculator writes to the URL at all, or only the dedicated
  calculator pages do.
