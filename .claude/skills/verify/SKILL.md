---
name: verify
description: Produce the human verification packet for a finished calculator or quantitative visualizer - the formula as implemented, the claim it makes, live computed values, and exactly where in the standard to look. Use when a calculator is ready for its human check, or when asked to verify, sign off, or publish one. Triggers on "verify the calculator", "ready to publish", "sign off", "what do I need to check".
---

# The verification packet

This skill prepares a human check. It does not perform one.

The gate exists because a pinned test proves the code agrees with a number someone typed
into the test file. If AI wrote the core *and* the expected value, the test is a
consistency check and it passes just as green when the formula is wrong in both places.
Full reasoning in `decisions/verification-and-authorship.md`.

The line is at the **principle**, not the arithmetic. Implementing a formula correctly is
not the risk. Selecting the wrong formula for the case the page claims to cover, then
generating a worked example that confirms that choice, is.

## Produce the packet

Read the entry, its core, and its test. Then output — in chat, not to a file:

### 1. The claim

What the page says it computes, for what case, under what standard, clause and edition.
Quote the entry's `summary` and `sources` verbatim.

### 2. The formula as implemented

The actual expression from the core, with every symbol defined and its units. Not the
formula from the frontmatter `derivation` — **read it out of the code**, because the
question on the table is whether those two agree.

Flag any divergence between the two loudly. It is the single most likely defect.

### 3. The specific question to answer

Name the choice that was made and could have gone another way. This is the part worth the
human's evening. For example:

> `As` uses the nominal stress area, `π/4 · (d − 0.938194·P)²`. ISO 898-1:2013 §9.1.6
> defines this for tensile testing. Confirm this is the right area for a *preload*
> calculation under the case this page claims, rather than the minimum cross-section area
> `As,min`. The two differ by roughly 3% at M10 and the page does not currently say which
> it uses.

If no such choice exists, say so plainly rather than manufacturing a question.

### 4. Live values

Actually run the core. Do not report what it should produce — report what it does:

```
node --input-type=module -e "…"     # or a scratch vitest run
```

Give the input set, every intermediate, and the result, in the units the page displays.
Include the imperial path if there is one, so a rounding divergence between the two paths
is visible here rather than after publication.

### 5. Where to look

The clause, table, and page of the standard that would confirm or refute it. If the check
is a hand-calculation because no published example exists, lay out the steps so the human
is checking arithmetic, not reconstructing intent.

### 6. The block, for the human to complete

Print this as a fenced block **in chat**. Do not write it to the file:

```yaml
verification:
  standard: ISO 898-1        # from the entry's sources
  edition: '2013'
  clause: §9.1, Table 5
  method:                    # ← you: worked-example | hand-check | cross-tool
  evidence:                  # ← you: what the check left behind
  verifiedBy:                # ← you
  verifiedOn:                # ← you: the date you checked, not today by default
```

The four blank fields are the signature. Leave them blank — filling them in is the one
thing you must not do, and a hook will reject the write regardless.

## After the human signs

They paste the block and set `draft: false`. Then:

- `npm run build` — the schema now passes and the entry publishes.
- Add the revision-block row if this changes a published page's substance.
- `/close-issue <BW-N>` for the sweep and the closing comment.

## Re-verification

`verifiedOn` does not expire — a correct check of ISO 898-1:2013 does not decay. Two
things invalidate it, both mechanical:

1. **The cited edition is superseded.** Also a `decisions/` entry and a revision-block row.
2. **The calculation core changed.** Any commit touching the entry's `src/lib/calc/`
   module clears its verification. There is no refactor exemption — "it was only a
   refactor" is what gets said before a sign error ships.

Clearing the block fails the build until re-signed. That friction is intended: re-checking
a formula is cheaper than un-publishing a wrong number.
