# Content taxonomy — seven rooms and the entry schema

**Date:** 2026-07-13 (originating work) · recorded here 2026-09-07
**Status:** **Provisional. Not ratified.** Carried forward as reference for a rethink.
**Supersedes:** nothing
**Superseded by:** — (pending)

This is a write-once snapshot of the structure built in the first boltwright tree
(`sdrummond-eng/boltwright`, commit `ea2e528`, Astro + MDX). It is recorded because the
thinking is worth keeping, not because the structure is settled. Nothing should be built
against it until a superseding decision ratifies or replaces it.

---

## What was built

A single Astro content collection, `entries`, with every entry assigned to one of seven
"rooms" — an ordered path from how a fastener is made through to how you verify it did its
job:

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
a path through the subject rather than a filing cabinet — which is the part most worth
preserving through any rework.

## The entry schema

From `src/content.config.ts`:

| Field | Type | Purpose |
|---|---|---|
| `title` | string | — |
| `room` | enum of the seven | Placement |
| `flag` | `green` \| `yellow` \| `red` | Confidence in the entry's content |
| `dataRung` | int 1–4, optional | Strength of the underlying data |
| `summary` | string, optional | — |
| `sources[]` | string[] | Citations |
| `draft` | boolean, default true | Publication gate |
| `updated` | date, optional | — |

Only one entry was ever written, and it was a stub (`1-what-holds/bolt-is-a-spring.mdx`,
body: TODO). So the taxonomy was never load-tested against real content. Treat it as an
untested hypothesis.

## The unresolved tension

`flag` and `dataRung` encode a **confidence** axis — how solid is this number, how good is
the data under it. The brand guide's structural devices (`brand/brand-guide.md` §6 —
revision block, spec callout, assumption strip) encode a **citation and currency** axis —
which standard, which edition, is this revision stale.

These overlap without being the same thing, and they were designed independently. The
brand guide has no visual treatment for a red-flagged or rung-1 entry, and the schema has
no field for the revision letter the revision block requires.

Any rework has to resolve this deliberately. Three shapes, none yet chosen:

1. **Confidence is public.** `flag`/`dataRung` get a visual treatment in the design
   system, and the guide gains a section for it.
2. **Confidence is editorial.** The fields stay, drive nothing user-facing, and exist to
   triage the writing backlog.
3. **Confidence folds into currency.** The revision block absorbs it — a low-confidence
   entry is simply one whose revision description says so.

## Also unresolved

- Seven top-level rooms is a lot for a nav bar. The brand guide's masthead shows three
  items (Calculators, Reference, About), which does not obviously accommodate seven rooms.
- The taxonomy is article-shaped. The site's hero is a **calculator**, and the brand guide
  puts a calculator and its explanation on one page, never split. Where a calculator lives
  in a room structure — or whether calculators are a parallel axis rather than entries in
  rooms — was never worked out.
- `0-manufacturing` leading the sequence suits a curriculum. A reader arriving for a
  torque number in under thirty seconds (the stated positioning) starts nowhere near it.
