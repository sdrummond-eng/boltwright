# Verification — the human gate, and what AI is allowed to close

**Decided:** 2026-09-07 · last revised 2026-09-07
**Status:** Accepted
**Supersedes:** nothing
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

Divides the work between AI and human, and decides where the human half is enforced.

---

## Context

The working model for this project is that AI leads everything except verification of
calculation principles and results. Stated that way it is an intention, and intentions
decay at 21:00 on a weeknight when the calculator renders correctly and the tests are
green and the only thing left is the part that requires actually opening the standard.

The existing gate does not catch this. `CLAUDE.md` requires a worked example pinned in a
test, and that requirement is real — but a test proves that the code agrees with a number
someone typed into the test file. If AI wrote the core *and* wrote the expected value,
the test is a consistency check, not a verification. It will pass just as green when the
formula is wrong in both places.

The gap is narrow and specific: **nothing currently distinguishes "a human opened the
standard and confirmed this" from "the arithmetic is self-consistent."**

---

## Decision 1 — The division of labour

**AI leads, without asking:** scaffolding, components, layout, styling against the brand
guide, MDX prose drafting, refactors, test scaffolding, tooling, dependency work, the
grep sweep, ADR drafting, Linear hygiene, accessibility and responsive work, link-rot
checks, and every conversion, serialisation, and encoding path.

**AI drafts, human signs:** the calculation principle — which formula, which standard,
which clause, which edition, and whether the formula is the right one for the case the
page claims to cover. And the expected value in every pinned worked example.

**Human only, never delegated:** the statement that a specific number is correct. That is
the signature in Decision 2, and it is the only thing in this repo AI must not produce.

The line is drawn at the *principle*, not at the arithmetic. AI implementing
`As = π/4 · (d − 0.938194·P)²` correctly is not the risk. AI selecting the nominal-stress-area
formula where the standard's case calls for the minimum-cross-section one, and then
generating a worked example that confirms its own choice, is.

## Decision 2 — The gate binds at build time, in the entry's frontmatter

Every published calculator — and every visualizer that displays a computed dimension —
carries a verification record. Astro's content collection schema validates it, and a
non-draft entry with an incomplete record fails `astro check` and therefore fails the
build. Same mechanism as the test gate, same non-zero exit, same consequence: it does not
deploy.

```yaml
verification:
  standard: ISO 898-1        # designation
  edition: '2024'            # editions supersede; the year is part of the citation
  clause: §9.1, Table 5      # where in the document
  method: worked-example     # worked-example | hand-check | cross-tool
  evidence: src/lib/calc/preload.test.ts::M10 x 1.5, class 10.9
  verifiedBy: SW             # initials, matching the revision block BY column
  verifiedOn: 2026-09-14     # the date a human checked it, not the date it was written
```

**`method` is an enum with three values and no fourth.**

| Value | Means |
|---|---|
| `worked-example` | The expected value is taken from an example printed in the cited standard. The strongest form, and the one to reach for first. |
| `hand-check` | No published example exists, so the value was computed independently by hand and the working is recorded in the test. |
| `cross-tool` | Agreed against an independent implementation — a published table, another calculator, a textbook. Names the tool in `evidence`. Weakest of the three; acceptable, but never the only method for a headline result. |

There is deliberately no `reviewed`, `checked`, or `looks-right`. Each of the three names
a specific act that leaves a specific artefact, and `evidence` has to point at it.

**Why frontmatter and not a Linear label.** Linear is the source of truth for done versus
open, and stays so. But a label on a closed issue does not stop a deploy, and it drifts
away from the entry the moment the entry is revised. The record has to live next to the
thing it vouches for, and travel with it in the same commit.

## Decision 3 — Re-verification is triggered by revision, not by time

`verifiedOn` does not expire. A correct check of ISO 898-1:2024 does not become incorrect
in six months.

What invalidates it is a change to what was checked. Two triggers, both mechanical:

1. **The cited edition is superseded.** The standard is revised, so the citation is now to
   a document that has been replaced. This is already a `decisions/` entry and a
   revision-block row per `CLAUDE.md`; it is also a cleared `verification` block.
2. **The calculation core changes.** Any commit touching a `src/lib/calc/` module clears
   the verification on every entry that consumes it. Not a refactor exemption — the whole
   point is that "it was only a refactor" is exactly what a human says before shipping a
   sign error.

Clearing the block makes the entry fail the build until re-signed. That is the intended
friction: it is cheaper to re-check a formula than to un-publish a wrong one.

## Decision 4 — AI may not write, edit, or fill a `verification` block

The block is the one thing in the tree that means "a human did this," and the moment an
agent can populate it, it means nothing at all.

**Operationally:** when a calculator is otherwise complete, AI leaves the entry
`draft: true` with the `verification` block absent, and hands over exactly what the human
needs to do the check — the formula as implemented, the standard and clause it claims,
the input set, the computed result, and where in the standard the confirming example
should be. The human opens the standard, confirms or rejects, and writes the block.

The build failure on a non-draft entry with no block is what makes this stick rather than
a convention. AI cannot route around it without editing the schema, and a schema edit is
a visible diff in a reviewed file.

---

## Consequences

- `src/content.config.ts` carries the enum, the shape, and the refinement that ties
  `draft: false` to a complete block. That file is the enforcement point and should be
  read as such.
- The `BY` column in the revision block (`brand/brand-guide.md` §6) and `verifiedBy` are
  the same person and the same initials. They are not the same claim: `BY` says who
  issued the revision, `verifiedBy` says who checked the number.
- A calculator can sit finished-but-unsigned indefinitely without blocking anything else.
  That is the correct queue for an evening project: implementation is not the bottleneck,
  and the backlog of unsigned entries is the honest measure of the real one.
- The falsification probe for this gate is the one `CLAUDE.md` demands of any new build
  stage: publish an entry with no verification, confirm the build aborts and leaves no
  `dist/`, then revert.
- Decision 4 is enforced mechanically as well as by instruction. A `PreToolUse` hook —
  `.claude/hooks/block-verification-write.sh`, wired in `.claude/settings.json` — rejects
  any agent `Write`/`Edit`/`MultiEdit` that puts a `verification:` key into
  `src/content/`. The schema stops an *unverified* entry publishing; the hook stops an
  agent *forging the signature* and going green, which the schema alone cannot see.
  Deletions pass deliberately: clearing a stale block is required by Decision 3 and must
  not need a human. The hook binds the project rather than the machine, so it lives in
  `.claude/settings.json` — `.gitignore` excludes `settings.local.json`.

## What this does not decide

- Whether `verifiedBy` ever holds initials other than `SW`.
- Whether a `cross-tool` verification names the tool publicly on the page or only in the
  frontmatter.
