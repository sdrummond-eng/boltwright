---
name: close-issue
description: Finish a Linear issue properly - reconcile every doc the change touched, run the grep sweep, add a revision-block row if a published page changed, and draft the closing comment. Use before closing or completing any BW issue. Triggers on "close BW-N", "finish this issue", "wrap up", "done with".
---

# Finishing a task

`CLAUDE.md`'s "Finishing a task" as an executable procedure. The grep sweep is part of
"done" — an issue closed without it is the recurring failure mode of a reference site: a
page that outlived the thing it cites.

## 1. Reconcile every doc and page the change touched

**Every one — not just the one named in the request.** A change to a calculator usually
touches the entry, the core, the test, an ADR, and at least one index.

Work down this list and say which were affected and which were checked and found clean:

| | |
|---|---|
| `decisions/` | Did this change what an ADR asserts? If so, revise in place with a dated note — `/adr`. If it reverses a decision, the body says so. |
| `brand/brand-guide.md` | Binding. Never edited to mean something new. A contradiction needs a superseding `decisions/` entry plus a pointer at the affected section. |
| `CLAUDE.md` | Does a new rule bind future work? A rule that lives only in a closed issue does not bind anything. |
| `README.md` | Structure tables and the Status section. |
| `src/content.config.ts` | Any new or changed frontmatter field. It is the enforcement point, not documentation. |

## 2. The grep sweep

```
git grep -niE '<issue-id>|<topic keywords>'
```

Run it with the issue id **and** the topic words — a rename shows up under the topic, not
the id. Fix every hit. State the command you ran and what it returned.

Then check cross-references still resolve — they are repo-root-relative paths in
backticks, and a moved file breaks them silently:

```sh
for f in $(git grep -ohE '`(decisions|brand|src|reference)/[a-zA-Z0-9._/-]+`' -- '*.md' \
          | tr -d '`' | sort -u); do [ -e "$f" ] || echo "MISSING: $f"; done
```

## 3. Revision-block row

If the change alters a **published** page's substance, add a row to its `revisions`
frontmatter. A silent edit to a cited page is the failure mode this site exists to avoid.

Substance means: a value, a formula, a cited edition, an assumption, a stated range.
Not: typography, layout, a typo in prose that carries no number.

Note that a changed calculation core also clears that entry's `verification` block —
`/verify` for what happens next.

## 4. Verify

```
npm run build
```

`astro check`, then `vitest run`, then the build. If you added a build stage, break it on
purpose once and confirm the build aborts and leaves no `dist/`. A stage that can fail
without a non-zero exit silently disarms "nothing ships behind a claim".

## 5. Draft the closing comment

Three parts, in this order. Draft it for review — do not post it unless asked.

**As-built.** What actually exists now, in the tree, with paths. Not what was planned.
Where the outcome differs from the issue body, say so and why.

**What was falsified.** What you tried to break and how it held — the probe, the sweep,
the case that failed before the fix. An issue closed with no falsification is a claim.
This is the most valuable part of the comment and the one most often skipped.

**Any decision and its reasoning.** Choices made along the way that a future reader would
otherwise have to reverse-engineer. If a decision is load-bearing, it belongs in
`decisions/` and the comment links to it rather than restating it.

Issue titles and bodies on this team can be specific — there is nothing sensitive about a
public reference site.

## 6. Stop

Do not commit or push unless asked. Do not close the issue yourself unless asked — Linear
is the source of truth for done vs open, and that call is the user's.
