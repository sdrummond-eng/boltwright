# Boltwright — brand and design system

Reference site for fastener engineering. Public information, working calculators, cited standards.

---

## 1. Positioning

**What it is.** A working reference for engineers who specify, analyze, or troubleshoot threaded fasteners and bolted joints.

**Who it's for.** Practicing engineers — design, manufacturing, quality, field. They already know what a preload is. They came for a number, a geometry, or a standard reference, and they want it in under thirty seconds.

**What it is not.** Not a supplier catalog. Not a lead-gen funnel. Not a beginner's tutorial site. No gated content, no signup wall, no "contact us for a quote."

**The name.** *-wright* is the trade suffix — shipwright, wheelwright, millwright. Maker, not merchant. The identity should read as a competent tradesman's bench: everything laid out, labeled, in reach, nothing decorative.

**One-line descriptor.** Use this in the masthead, the meta description, and the OG card:

> Fastener engineering reference — calculators, geometry, and standards.

---

## 2. Voice

Six rules, in priority order.

1. **State the standard.** Every value, formula, and dimension names its source: ISO 898-1, ASME B18.2.1, ISO 4762. If there is no source, say so explicitly ("common shop practice, not standardized").
2. **Show the assumption.** A torque figure is meaningless without the nut factor, the lubrication state, and the target preload fraction. These are visible on the page, not hidden in the code.
3. **Never hide the equation.** Every calculator exposes the formula it used, in the same view as the result.
4. **Assume competence.** No "as you may know," no "simply," no re-teaching what a thread pitch is. Link to a definition instead of inlining one.
5. **Errors are diagnostic.** "Pitch 1.5 mm is not a standard coarse pitch for M12. Coarse is 1.75 mm." Not "Invalid input."
6. **Sentence case. Active voice. No exclamation marks.**

Words to avoid: *solution, leverage, seamless, unlock, empower, revolutionize, comprehensive.* If a sentence would fit in a supplier brochure, rewrite it.

---

## 3. The mark

**Concept: the head marking.** Every graded bolt already carries a logotype stamped into its top face — a property class, radial grade ticks, and a manufacturer's mark inside a circular field. Boltwright's mark uses that convention rather than inventing one.

**Primary mark.** Top view of a fastener head: a hexagonal outline containing a six-lobe (hexalobular) recess, concentric. Pure line work, single weight, no fill. The hex and the rosette are rotationally offset so the lobes bisect the hex flats — this makes the form read at small sizes and is geometrically correct for a hex-head-with-recess.

**Construction notes for whoever draws it.**
- Circumscribed circle diameter = 100 units. Hex across flats = 92. Lobe circle major = 46, minor = 34.
- Stroke weight 6 units at the primary size — heavy enough to survive a 32 px favicon.
- One optional variant: add three short radial ticks at 120° in the annulus between hex and lobes, echoing SAE grade marking. Use this only on the full-size masthead lockup; drop the ticks below 48 px.

**Lockup.** Mark at left, wordmark "boltwright" at right, baseline-aligned to the mark's horizontal centerline. Gap = 0.35 × mark height. Wordmark set lowercase — the `.dev` domain is lowercase and the trade-suffix name reads better without a capital.

**Wordmark.** IBM Plex Sans, 500 weight, tracking −1.5%. Do not letterspace it. Do not put the `.dev` in the logo; it belongs in the browser bar, not the identity.

**Clear space.** 0.5 × mark height on all sides. **Minimum size:** 20 px tall for the mark alone, 96 px wide for the lockup.

**Never:** rotate the mark, fill the lobes, apply a gradient, place it on a photograph, or add a shadow.

---

## 4. Color

The palette is taken from fastener finishes, not from a color picker.

| Token | Hex | Source | Use |
|---|---|---|---|
| `--oxide` | `#191D1F` | Black oxide finish | Masthead block, code blocks, footer. Not body text. |
| `--ink` | `#262D31` | — | Body text, headings |
| `--zinc` | `#6E7A80` | Clear zinc plating | Secondary text, captions, table rules |
| `--zinc-light` | `#C9D0D2` | — | Hairlines, dividers, disabled states |
| `--surface` | `#E9ECE9` | Drawing vellum | Panels, calculator input wells, table zebra |
| `--paper` | `#F5F6F4` | — | Page background |
| `--chromate` | `#B8841C` | Yellow zinc dichromate (grade 8) | The single accent. Links, active states, focus rings. |
| `--chromate-wash` | `#F6EBD3` | — | Accent fill behind highlighted rows only |

Semantic pair for calculators — these are functional, not decorative:

| Token | Hex | Meaning |
|---|---|---|
| `--within` | `#3D6B57` | Within spec, below yield, pass |
| `--exceed` | `#9E3D2B` | Exceeds limit, above yield, fail |

**Rules.**
- `--chromate` appears only on interactive elements and the active nav item. If it shows up as a decorative rule, a section background, or an icon tint, remove it.
- Never use `--within` / `--exceed` for anything except a spec verdict. If they mean "good design" instead of "within spec," the semantics are broken.
- Body text is `--ink` on `--paper`. Do not use `--oxide` for running text; it's a surface color.
- Dark mode: invert to `--oxide` page, `--paper` text at 92% weight, `--chromate` lightened to `#D9A63E` to hold contrast.

---

## 5. Typography

Three faces, two families. All open-licensed and self-hostable — important for a `.dev` reference site that should stay fast and dependency-free.

| Role | Face | Notes |
|---|---|---|
| Headings, UI, nav | **IBM Plex Sans** | 500 and 600. Industrial lineage, wide numerals, real condensed cuts available for dense tables. |
| Body, article prose | **Source Serif 4** | 400/600, italic for variables. Serif suits long technical reading and handles sub/superscripts and math italic properly. |
| Values, dimensions, code, part numbers | **IBM Plex Mono** | 400. Tabular figures on. Every dimension, torque value, class designation, and standard number sets in mono. |

**Scale** (1.25 ratio, 18 px base):

```
Article h1      36 / 1.15   Plex Sans 600
Article h2      26 / 1.25   Plex Sans 600
Article h3      20 / 1.3    Plex Sans 600
Body            18 / 1.65   Source Serif 4 400
Caption, meta   15 / 1.5    Plex Sans 400, --zinc
Data / mono     16 / 1.5    Plex Mono 400
Table cell      16 / 1.4    Plex Sans 400, mono for numeric columns
```

**Measure.** Article body 68–72 characters. Do not exceed 75.

**Numerals.** Tabular lining figures everywhere a column of numbers appears. Proportional oldstyle is wrong here — columns must align.

**Tolerance notation is a native inline element.** `12.700 ±0.025` sets in mono with a true `±` and a thin space before it. Build a `<span class="dim">` for this; never let it wrap mid-value.

**Avoid:** all-caps labels, tracked-out eyebrows above headings, accenting one word of a headline in a different color, and metadata strings joined with middle dots. These are the tells of a template.

---

## 6. Structural devices

Each of these encodes information. None is decoration.

**Revision block.** Replaces the standard byline. Sits directly under the article h1, styled as a drawing revision table — thin rules, mono, four columns:

```
REV   DATE          BY   DESCRIPTION
C     2026-08-14    SW   Updated for ISO 898-1:2024 property class table
B     2026-03-02    SW   Added nut factor sensitivity section
A     2025-11-19    SW   Initial issue
```

Latest revision expanded, prior revisions collapsed behind a disclosure. This is functionally correct for a reference site — readers need to know whether they're on the revision that predates a standard update.

**Spec callout.** For a hard requirement pulled from a standard. Rendered as a bordered frame with a leading cell for the standard designation, echoing a feature control frame:

```
┌──────────────┬────────────────────────────────────────────┐
│ ISO 898-1    │ Class 10.9, min. tensile 1040 MPa,         │
│ §9.1         │ min. yield (0.2% offset) 940 MPa           │
└──────────────┴────────────────────────────────────────────┘
```

Border `--zinc-light`, zero radius, mono throughout. Use only for direct standard citations — not for tips, notes, or asides.

**Assumption strip.** Every calculator carries one, immediately below its result. A single line, `--zinc`, mono, listing the assumptions the number rests on. If a calculator has no assumption strip, it isn't finished.

**Derivation disclosure.** A collapsed `Show the formula` control under each calculator, opening to the equation and symbol definitions. Closed by default, but present without exception.

---

## 7. Layout

**Grid.** 12 columns, 1200 px max, 24 px gutters. Articles use columns 2–9 for prose with 10–12 reserved for the sticky TOC. Do not center article body text in a full-width container.

**Alignment.** Everything left-aligned and flush. No centered paragraphs. Numeric table columns right-aligned on the decimal.

### Home

The hero is a **working calculator**, not a headline. Someone can compute a torque value before scrolling or clicking anything. This is the whole positioning in one decision — spend the boldness here and keep everything below it quiet.

```
┌──────────────────────────────────────────────────────────┐
│ [mark] boltwright        Calculators  Reference  About   │  --oxide bar
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Preload and tightening torque                           │
│                                                          │
│  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │ Thread   M10 x 1.5 │  │  Fi    28.4 kN             │  │
│  │ Class    10.9      │  │  T     56.8 N·m            │  │
│  │ K        0.20      │  │                            │  │
│  │ Target   65 % Sp   │  │  ● Within proof load       │  │
│  └────────────────────┘  └────────────────────────────┘  │
│  As, ISO 898-1 · dry, K assumed · T = K·Fi·d             │
│  › Show the formula                                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  All calculators (14)                                    │
│  Joint stiffness · Thread engagement · Shear strength …  │
├──────────────────────────────────────────────────────────┤
│  Recently revised                                        │
│  Rev C  Property classes under ISO 898-1:2024            │
└──────────────────────────────────────────────────────────┘
```

### Article

```
┌──────────────────────────────────────────────────────────┐
│ [mark] boltwright                              [search]  │
├────────────────────────────────────┬─────────────────────┤
│  Nut factor selection for          │  On this page       │
│  lubricated joints                 │  ─────────────      │
│                                    │  What K represents  │
│  REV  DATE        BY  DESCRIPTION  │  Published ranges   │
│  B    2026-03-02  SW  Added …      │  Sensitivity        │
│  › 2 earlier revisions             │  Measuring K        │
│                                    │  References         │
│  Body text, 68–72 char measure,    │                     │
│  Source Serif 4 at 18/1.65.        │                     │
│                                    │                     │
│  ┌──────────┬──────────────────┐   │                     │
│  │ ISO 16047│ Test method for  │   │                     │
│  │          │ torque–tension   │   │                     │
│  └──────────┴──────────────────┘   │                     │
│                                    │                     │
│  Inline dimension: 12.700 ±0.025   │                     │
└────────────────────────────────────┴─────────────────────┘
```

### Calculator page

Input panel pinned left (sticky on scroll), results right, updating live with no submit button. Below the fold: the derivation, the assumption set in full, worked example, and links to the articles that explain each input. The calculator and its explanation live on one page — never split them.

---

## 8. Interaction

- **No submit buttons on calculators.** Results update on input. A submit button implies a round trip that isn't happening.
- **Every input carries its unit** as a suffix inside the field, in mono, `--zinc`. Unit switching (metric/imperial) is a single global toggle in the masthead, persisted, never per-field.
- **Validation is inline and specific**, appearing below the field in `--exceed`, naming the valid range or the standard value.
- **Links are `--chromate` with a 1px underline at 0.12em offset.** No arrow glyphs appended to link text.
- **Focus rings are visible and mandatory** — 2px `--chromate`, 2px offset. Engineers use keyboard navigation.
- **Motion:** one place only. Result values transition their numeric change over 120 ms so the eye catches what moved. Nothing else animates. No scroll-triggered reveals, no card hover lifts.
- **Every result is copyable.** A copy control on each result row yields the value, its unit, and the assumption line as plain text — because it's going into someone's calculation notes.

---

## 9. Quality floor

- Responsive to 360 px. The calculator stacks input-above-result; the article TOC collapses to a disclosure at the top.
- Static-first. Calculators run client-side. No account, no cookie banner, no analytics that require consent.
- `prefers-reduced-motion` respected — kills the numeric transition.
- All text meets WCAG AA at minimum; `--chromate` on `--paper` is verified for AA at 16 px and above, and is never used for body-size text on `--surface`.
- Every page states its last revision date in the footer. A reference site that doesn't date itself can't be trusted.
