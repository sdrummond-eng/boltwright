---
name: adr
description: Write a new decisions/ entry, or supersede an existing one, in this repo's house format. Use when a decision needs recording, when a standard's edition changes, when a choice is being revisited or reversed, or when a change would contradict brand/brand-guide.md. Triggers on "write an ADR", "record this decision", "supersede", "revisit", "this contradicts the brand guide".
---

# Writing a decisions/ entry

`decisions/` is **a snapshot of reasoning, never current state**. It records why a choice
was made, on a date, by someone who did not know what happened next. Status — done vs
open — lives in Linear and never here.

## Before writing

Read the existing entries. They are the format, and they are dense on purpose: each one
names its alternatives and says why they lost, so the decision does not get re-litigated
by someone who only sees the winner.

Check whether this is a **new** entry or a **revision to an existing one**. Superseding is
carried by git history, not by accumulating files — there is never a `foo-v2.md`.

## New entry

Filename is an undated kebab-case slug: `decisions/<slug>.md`. The date lives in the
document, not the filename.

```markdown
# <Title — the decision, not the topic>

**Decided:** YYYY-MM-DD · last revised YYYY-MM-DD
**Status:** Accepted
**Supersedes:** nothing
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

<One paragraph: what this decides, and what it deliberately leaves alone.>

---

## Context

<The constraints that do the deciding. Quote binding sources — `brand/brand-guide.md` §N,
`CLAUDE.md`, an existing ADR — rather than restating them from memory.>

## Decision 1 — <the decision, stated as a decision>

<Why it wins. Then:>

| Candidate | Why not |
|---|---|
| **<Alternative>** | <Its genuine strength first, then what it loses on.> |

---

## Consequences

## What this does not decide
```

**Rules that make the difference between a real entry and a summary:**

- Give each rejected alternative its due. "Genuinely close, and lighter" before the
  reason it lost. An alternatives table that only lists weaknesses is advocacy, not a record.
- Where a decision could plausibly be reversed later, **state the revisit trigger in
  advance** so the reversal does not need re-litigating.
- Verified facts carry their date and where they were checked: *"Verified 2026-09-07, in
  the Cloudflare dashboard."*
- Cross-references are repo-root-relative paths in backticks.

## Revising an existing entry

Edit in place. Update `last revised`. Then, at the point of the change, leave a dated note:

```markdown
*Revised YYYY-MM-DD.* <What this paragraph said before, and what it says now.>
```

Two distinctions the note must make, because they are not the same failure:

- **Wrong on the facts** — it was wrong when written, not overtaken by events. Say so.
- **Reversed on the merits** — it was right, and is now being overturned. Quote the
  original wording rather than deleting it, and give the reasoning that overturns it.

> A revision that reverses a decision says so in the body rather than quietly deleting the
> old reasoning — the diff shows what changed, but only the prose can say why.

When an entry is substantially reversed, update the header: `**Status:**`, and
`**Supersedes:** the <thing> recorded in this entry's own first version`. Retain the old
reasoning under a heading that marks it as superseded.

## Contradicting the brand guide

`brand/brand-guide.md` is binding. It is **never edited to mean something new**. If a
change contradicts it, either the change is wrong, or the guide needs a superseding entry
here.

Do not resolve this silently. Write the `decisions/` entry, and leave a **pointer** at the
affected section of the guide saying where the exception lives. `decisions/visualizer-device.md`
is the worked example of both halves.

## Finishing

Run the grep sweep and fix every hit — an ADR that supersedes another usually makes
statements elsewhere stale:

```
git grep -niE '<slug>|<topic keywords>'
```

Do not commit unless asked.
