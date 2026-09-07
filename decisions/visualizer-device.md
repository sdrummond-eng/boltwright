# The visualizer — a fourth structural device, and a carve-out from the motion rule

**Decided:** 2026-09-07 · last revised 2026-09-07
**Status:** Accepted
**Supersedes:** `brand/brand-guide.md` §8, the motion rule, in the narrow case set out below.
**Superseded by:** —

*The `Decided` date above is authoritative — it is not derivable from the filename, and
the file's mtime is not evidence of anything. This entry is superseded by revising it in
place; `git log -p` on this file is the record of what changed and when.*

`brand/brand-guide.md` is binding. This entry is the superseding mechanism `CLAUDE.md`
requires, not a departure from it. A pointer to this file sits at both affected sections
of the guide so the conflict is visible from either end and is not resolved silently.

---

## Context

Visualizers are a surface (`decisions/scope-and-surfaces.md`, Decision 1): interactive
geometry for the concepts that do not survive prose. Thread fit against tolerance class.
Allowance, and how it differs from clearance. What 8 µm of zinc-nickel does to a 6g
tolerance zone. Engagement length against stripping.

These share a property that makes them the hard case for the guide as written. The
concept *is* the relationship between two things as one of them changes. A static diagram
of a 6g thread inside a 6H nut shows a state; what the reader is missing is what happens
to the flank clearance as the class changes, and that is a motion.

The guide's §8 motion rule is unambiguous and, for everything else on this site, correct:

> **Motion:** one place only. Result values transition their numeric change over 120 ms so
> the eye catches what moved. Nothing else animates. No scroll-triggered reveals, no card
> hover lifts.

Read literally, a draggable coating-thickness slider that moves a tolerance zone is
forbidden. That rule was written against decorative motion — reveals, lifts, the tells of
a template — and it should keep winning against those. It was not written against motion
that carries the information, because at the time the guide was written this site had no
such surface.

**Two ways to resolve it, and why the narrow carve-out wins.** The alternative considered
was to constrain visualizers to the existing rule: discrete controls that swap between
static states, no continuous manipulation. That is genuinely cheaper to build, easier to
test, and would need no entry here. It loses because the discrete version does not do the
job — swapping between two rendered states shows the reader the endpoints and hides the
relationship, which is the only thing the reader came for. Building the surface and
having it not teach is worse than not building it.

So the carve-out is deliberately narrow, and §8 is otherwise untouched.

---

## Decision 1 — Motion is permitted only where it is the information

A visualizer may animate geometry **under direct manipulation only**. The reader's
pointer or arrow key moves a control; the geometry moves with it, continuously, in the
same frame. Nothing else about a visualizer moves, ever.

Explicitly still forbidden, inside a visualizer as everywhere else:

- Autoplay, looping, and ambient motion. A visualizer at rest is a static drawing.
- Entrance and scroll-triggered animation. It is present on load or it is not there.
- Transitions on state that is not being manipulated — no easing a value into place, no
  crossfade between configurations, no staggered reveal of labels.
- Motion as emphasis. Nothing pulses, bounces, or draws attention to itself.

The test is a single question: **if the motion stopped, would the reader lose
information?** Under a dragged slider the answer is yes — the relationship is the point.
Everywhere else on this site the answer is no, and §8 continues to apply in full.

## Decision 2 — The visualizer as a structural device

Extending `brand/brand-guide.md` §6, which currently defines four devices — revision
block, spec callout, assumption strip, derivation disclosure. The visualizer is the
fifth, and it encodes information exactly as they do.

**Geometry is scale-true, or it is labelled as not to scale, in those words.** A drawing
of a tolerance zone that exaggerates the zone for legibility is lying about the one thing
the reader is there to understand — tolerance zones are small, and their smallness is
frequently the insight. Where exaggeration is genuinely unavoidable, the exaggeration
factor is stated on the drawing (`radial clearance × 20`), not buried in a caption.

**Every dimension shown is dimensioned.** Values set in mono with the inline `<span
class="dim">` element from §5, using true `±` notation. A visualizer that shows a gap
without a number is decoration.

**A visualizer carries an assumption strip.** Same device, same rules, same position —
immediately below, `--zinc`, mono. Nominal size, tolerance class, coating allowance,
whether the geometry is basic or maximum-material. Without it, the drawing shows one
case and implies all of them.

**Colour is the semantic pair or nothing.** `--within` and `--exceed` mean within spec and
out of spec, per §4, and mean nothing else here either. Tolerance zones, clearance,
interference, and stripping are exactly the domain those two tokens were defined for.
`--chromate` remains interactive-only: it may fill the control being dragged, never the
geometry.

**Controls are labelled with their unit and their range**, per §8. A slider whose range is
not stated is not a control, it is a toy.

## Decision 3 — Reduced motion, and the no-JS state, are first-class

`prefers-reduced-motion` does not degrade a visualizer to nothing. It renders a **static,
fully labelled state** — a real dimensioned drawing of the default configuration, with the
discrete controls still operable. The reader loses the continuous relationship and keeps
every fact.

Same for no-JS and for print: the server-rendered SVG of the default state, dimensioned,
with its assumption strip. `decisions/framework-and-hosting.md` puts the island model in
place precisely so this is the natural implementation rather than a fallback someone has
to remember to build.

**This is a build-time obligation, not a runtime nicety.** The static state is the SVG the
page ships; the island enhances it. A visualizer whose static state is blank has not
shipped.

## Decision 4 — A visualizer that shows a number is verified like a calculator

Per `decisions/scope-and-surfaces.md`, a visualizer displaying a computed dimension is
making a numeric claim, and the geometry is computed by a pure module in `src/lib/calc/`
with a pinned worked example and a signed verification record, exactly as a calculator is.
Purely diagrammatic visualizers — naming parts, showing an assembly sequence — do not
carry one, and are marked `quantitative: false` in frontmatter so the schema knows not to
require it.

The rendering layer never computes. A tolerance zone's dimensions come out of the core the
same way a torque value does, because a drawing that is wrong is wrong in exactly the way
a number that is wrong is wrong, and less obviously.

---

## Consequences

- `brand/brand-guide.md` §6 and §8 each carry a pointer to this entry. The guide's text is
  not edited to mean something new; the pointer says where the narrow exception lives.
- `src/components/viz/` holds shared primitives — dimension lines, leaders, tolerance-zone
  fills, the scale bar — so that scale-true and dimensioned are defaults rather than
  per-visualizer discipline.
- The `visualizers` collection schema carries `quantitative`, and requires the
  verification block when it is true.
- The first visualizer will test whether "scale-true or labelled" is livable in practice.
  If it is not, that is a revision to this entry with the evidence, not an unrecorded
  exception in one component.

## What this does not decide

- Which visualizer is built first, or whether any is built before the second calculator.
  `decisions/scope-and-surfaces.md` Decision 3 puts a calculator first; the order after
  that is a Linear question.
- Whether visualizers embed inside articles as islands. Probably yes — that is what MDX is
  for — but no article yet exists to want one.
