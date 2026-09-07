---
name: calculator
description: Scaffold a new calculator end to end - pure core, pinned worked-example test, and a schema-valid MDX entry left as a draft for human verification. Use when adding, building, or scaffolding a calculator, or implementing a BW issue for one. Triggers on "new calculator", "build the preload calculator", "add a calculator for".
---

# Scaffolding a calculator

A calculator is the site's centre of gravity and has the strictest bar in the repo. Read
`decisions/scope-and-surfaces.md` Decision 1 before starting — all five conditions there
are publication conditions, not a checklist to approximate.

**You will not finish this task.** The last step belongs to a human, and the build
enforces that. Your job is to get everything else to the point where the check takes ten
minutes with the standard open.

## Work in this order

The order matters: the core exists before anything renders, so a wrong number cannot hide
behind a working UI.

### 1. The core — `src/lib/calc/<slug>.ts`

Pure TypeScript. Numbers in, numbers out, no DOM, no imports from `src/components/`.
This is forced by `decisions/framework-and-hosting.md` Decision 2: it has to run under
Vitest in Node with nothing mounted.

- **Conversion never happens in here.** Metric and imperial both enter the core in SI.
  Conversion is applied at the boundary, in `src/lib/units/`. `CLAUDE.md` names a
  divergence between the two unit paths as a bug, and keeping conversion out of the core
  is what makes it testable as one.
- Every intermediate quantity a reader would want gets returned, not just the headline
  number. The assumption strip and derivation disclosure both need them.
- Standards data comes from `src/lib/data/`, not from literals inline. Note the copyright
  boundary in `decisions/scope-and-surfaces.md` Decision 2: the table holds the values the
  calculators consume, not the published table.

### 2. The test — `src/lib/calc/<slug>.test.ts`

At least one worked example from the cited standard, or an independent hand-check.

**The test says where the expected value came from, in the test.** A bare number in an
assertion is the exact defect this repo exists against — it proves the code agrees with
itself.

```ts
// ISO 898-1:2024 §9.1, Table 5. Class 10.9, M10 x 1.5:
// As = 58.0 mm², Sp = 830 MPa → Fp = 48.1 kN.
// Target 65% of proof load → Fi = 31.3 kN.
it('agrees with the worked example in ISO 898-1:2024 §9.1', () => {
```

Where no published example exists, record the hand-working in the test as a comment, step
by step, so a reader can follow it without redoing it.

Also test: the unit-conversion round trip, and the diagnostic errors — `brand/brand-guide.md`
§2 rule 5 requires *"Pitch 1.5 mm is not a standard coarse pitch for M12. Coarse is
1.75 mm"*, never "Invalid input".

### 3. The entry — `src/content/calculators/<slug>.mdx`

`src/content.config.ts` is the schema and will reject anything that misses. Required:

- `sources` — at least one, **every citation carrying its edition year**
- `assumptions` — at least one; this is the assumption strip, and an empty one means the
  calculator is not finished
- `derivation` — the equation and every symbol defined, with units
- `revisions` — at least an initial issue row
- `draft: true`
- **no `verification` block**

The body carries the prose the guide mandates below the fold: the derivation in full, the
assumption set, the worked example, and links to the articles explaining each input. The
calculator and its explanation are one page, never split.

### 4. Verify the build

```
npm run build
```

This runs `astro check` (which validates the entry against the schema), then `vitest run`,
then the build. All three must pass.

## The handoff — how this task ends

Do not write a `verification` block. Do not fill one in. Do not suggest values for
`verifiedBy` or `verifiedOn`. This is the one thing in the repo that means a human opened
the standard, and it means nothing if an agent can produce it — `decisions/verification-and-authorship.md`,
Decision 4. A hook blocks the write, but the reason is the rule, not the hook.

End by running `/verify <slug>`, which produces the packet the human needs. Then report:
what was built, what the core assumes, and that the entry is `draft: true` pending
verification.

Leave the Linear issue open. It is not done.
