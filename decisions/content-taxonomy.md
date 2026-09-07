# Content taxonomy — four surfaces, topic as a tag, and the entry schema

**Decided:** 2026-07-13 (originating work) · recorded 2026-09-07 · **ratified and reversed 2026-09-07**
**Status:** Accepted
**Supersedes:** the provisional seven-room structure recorded in this entry's own first version
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

---

## Revision note, 2026-09-07 — this entry reverses its own earlier decision

The first version of this entry recorded a **seven-room taxonomy as the primary
structure**, carried forward from the July tree, and marked it provisional pending a
rethink (BW-19). This revision performs that rethink and **reverses it**: rooms are no
longer the primary axis and are no longer the folder structure.

The old reasoning is retained below under *What was built* rather than deleted, because
the part of it that was right is still right and is preserved in Decision 2. What follows
is why the structure it implied was wrong.

**Three reasons, in order of weight.**

1. **It could not hold the site's own centre of gravity.** The entry itself flagged this:
   the taxonomy is article-shaped, the site's hero is a calculator, and where a calculator
   sits in a room structure "was never worked out." It still could not be worked out. A
   preload calculator is not *in* torque–tension the way an article is; it is the thing
   torque–tension is about, and it is equally reached for from selection and from
   verification.

2. **It inverted the stated positioning.** `brand/brand-guide.md` §1 is explicit that a
   reader "came for a number, a geometry, or a standard reference, and they want it in
   under thirty seconds." A causal path beginning at `0-manufacturing` serves a reader
   working through the subject, which is a real audience but not the primary one. The
   entry noted this too, and it is decisive rather than a caveat.

3. **Seven top-level items do not fit the masthead** the guide draws with three, and no
   grouping of seven rooms into three or four nav items survived contact with the actual
   content — several rooms are near-empty and two are most of the site.

Two further surfaces settled in `decisions/scope-and-surfaces.md` — visualizers and
resources — are also not room-shaped, which would have forced this question regardless.

---

## What was built (July tree — retained as the superseded reasoning)

A single Astro content collection, `entries`, with every entry assigned to one of seven
"rooms" — an ordered path from how a fastener is made through to how you verify it did
its job:

```
0-manufacturing     how the part comes to exist
1-what-holds        preload, clamp load, the bolt as a spring
2-selection         choosing thread, class, geometry, finish
3-torque-tension    getting from an applied torque to an achieved preload
4-durability        fatigue, relaxation, loosening, corrosion
5-failure           how joints fail and what the failure looks like
6-verification      measurement, inspection, proving the joint
```

The ordering is pedagogical and causal, not alphabetical or by artifact type. It reads as
a path through the subject rather than a filing cabinet — which was correctly identified
at the time as the part most worth preserving through any rework. Decision 2 below is that
preservation.

Only one entry was ever written, and it was a stub (`1-what-holds/bolt-is-a-spring.mdx`,
body: TODO), so the taxonomy was never load-tested against real content. Treating it as an
untested hypothesis was right, and it did not survive the test.

---

## Decision 1 — Artifact type is the primary axis

Four collections, matching the four surfaces in `decisions/scope-and-surfaces.md`, and
matching the nav one-to-one:

```
Calculators   Visualizers   Articles   Resources
```

```
src/content/
  calculators/    preload-and-torque.mdx
  visualizers/    thread-fit-and-allowance.mdx
  articles/       nut-factor-selection.mdx
  resources/      standards-bodies.mdx
```

**Why this wins.** It matches how the site is reached. A reader wanting a number goes to
Calculators; a reader wanting to understand something goes to Articles or Visualizers; a
reader wanting the source document goes to Resources. Each surface has a different
publication bar (`decisions/scope-and-surfaces.md`, Decision 1), so type is already the
axis along which the build gate discriminates — making it the folder structure means the
schema and the directory agree rather than cross-cutting.

It is also four items, which is what the masthead can carry.

**The cost, stated plainly.** A reader who wants to work through the subject rather than
look something up is not served by a type-first nav. Decision 2 is the answer to that, and
it is a genuine answer rather than a consolation.

## Decision 2 — The room sequence survives as `topic`, and as one curated page

The seven rooms become a `topic` field on every entry across all four collections. It is a
cross-cutting tag, not a location: an entry has one topic and one folder, and they are
independent.

```ts
topic: 'manufacturing' | 'what-holds' | 'selection' | 'torque-tension'
     | 'durability' | 'failure' | 'verification'
```

The numeric prefixes are dropped from the identifiers and the ordering moves into code,
where it belongs — a sort order encoded in a filename is a fact stored in a place that
cannot be typed.

The pedagogical value of the ordering is preserved by deriving from it, at build time, a
single page that presents the subject as the causal path the original taxonomy described,
sequencing every entry of every type. That page is the reading route; the four collections
are the reference. Both are derived from the same entries, so neither can drift from the
other, and no entry is filed twice.

## Decision 3 — Confidence is editorial, not published

The first version of this entry flagged an unresolved tension: `flag` (green/yellow/red)
and `dataRung` (1–4) encode a **confidence** axis, while the guide's structural devices
encode a **citation and currency** axis, and the two were designed independently and
overlap without being the same thing. Three shapes were offered and none chosen.

**Resolved: none of the three as stated. `flag` and `dataRung` are dropped entirely.**

The reasoning that closes it is that `decisions/verification-and-authorship.md` has since
made confidence binary at the point where it matters. An entry is either signed by a human
against a named standard, clause, and edition, or it does not publish. There is no
yellow. A three-value confidence flag on a published entry would advertise a middle state
the build gate does not permit to exist, and publishing "we are not sure about this
number" is not a feature of a reference site — it is a reason not to publish the number.

What the fields were actually useful for — triaging the writing backlog — is Linear's job,
and Linear is already the single source of truth for done versus open. Keeping a
duplicate status axis in frontmatter violates "one home per fact."

Currency, the axis that does survive, is carried by the revision block and by
`verification.edition`, both of which are dated facts rather than opinions.

## Decision 4 — The entry schema

`src/content.config.ts` is the authoritative definition and the enforcement point; this is
the shape and the reasoning, not a second copy to be kept in sync.

**Shared by all four collections:**

| Field | Type | Purpose |
|---|---|---|
| `title` | string | — |
| `summary` | string | Index listings, meta description, OG card |
| `topic` | enum, 7 values | Decision 2. Cross-cutting, not a location |
| `revisions` | array, min 1 | The revision block (`brand/brand-guide.md` §6). Newest first |
| `sources` | array of `{designation, edition, clause?}` | Structured, not strings — the edition year is required because editions supersede |
| `draft` | boolean, default `true` | Publication gate. Default `true` so an unfinished entry cannot publish by omission |

**Calculators, and quantitative visualizers, add:**

| Field | Type | Purpose |
|---|---|---|
| `assumptions` | array, min 1 | The assumption strip. Empty means unfinished, so the schema refuses it |
| `derivation` | `{equation, symbols[]}` | The derivation disclosure. Present without exception |
| `verification` | object | The human gate. See `decisions/verification-and-authorship.md` |

**Visualizers also carry** `quantitative: boolean` — true when the visualizer displays a
computed dimension, which is what makes `verification` required
(`decisions/visualizer-device.md`, Decision 4).

**Resources carry instead** `url`, `publisher`, `kind`
(`standard | tool | table | course | paper | vendor-doc`), `free: boolean`, `note`, and
`checked` — the link-rot date. `kind: vendor-doc` exists so commercial material is
labelled rather than laundered, per `decisions/scope-and-surfaces.md` Decision 2.

**The refinement that does the work:** an entry with `draft: false` and an incomplete
`verification` block fails schema validation, which fails `astro check`, which fails the
build. `sources` requires an edition on every citation for the same reason. These are not
lint rules; they are the build gate.

---

## Consequences

- BW-19 is closed by this revision.
- `src/content.config.ts` is written against this and is the single enforcement point.
- The `topic` values lose their numeric prefixes; ordering lives in a typed constant.
- The reading-route page derives from the collections and never maintains its own list, per
  "never write a count into a doc or a page."

## What this does not decide

- The slug shape within each collection, beyond kebab-case.
- Whether `topic` is ever surfaced as a filter on collection index pages, or only on the
  reading-route page.
- Search, which remains open per `decisions/framework-and-hosting.md`.
