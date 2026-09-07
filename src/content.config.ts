import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// zod is imported directly rather than re-exported from `astro:content`, which
// Astro 7 deprecates. Declared in package.json at the same major Astro resolves,
// so this is not a transitive import that a dependency bump could remove.

/**
 * The entry schema. Decided in `decisions/content-taxonomy.md`, Decision 4 —
 * this file is the authoritative definition and the enforcement point, and that
 * entry is the reasoning rather than a second copy of the shape.
 *
 * These are not lint rules. Astro validates collections during `astro check`,
 * which is the first stage of `npm run build`, which is the command Cloudflare
 * Pages runs. A schema failure here is a failed deploy — which is the whole
 * mechanism behind "nothing ships behind a claim" (`CLAUDE.md`).
 */

/**
 * The seven topics, in the causal order the superseded room taxonomy used:
 * how the part comes to exist, through to proving the joint did its job.
 *
 * Order is data, not filename convention — `decisions/content-taxonomy.md`
 * Decision 2 moves it here so the reading-route page can derive its sequence
 * from a typed constant rather than from a numeric prefix nobody can type-check.
 */
export const TOPICS = [
  'manufacturing',
  'what-holds',
  'selection',
  'torque-tension',
  'durability',
  'failure',
  'verification',
] as const;

export type Topic = (typeof TOPICS)[number];

/**
 * An edition year. Required on every citation, without exception: editions
 * supersede, so "ISO 898-1" without a year names a moving target rather than a
 * document. `CLAUDE.md` calls an uncited number a defect; an undated citation is
 * the same defect one step removed.
 */
const editionYear = z
  .string()
  .regex(/^\d{4}$/, 'Edition must be a four-digit year — editions supersede, so the year is part of the citation.');

const source = z.object({
  /** e.g. `ISO 898-1`, `ASME B18.2.1`, `VDI 2230 Part 1`. */
  designation: z.string().min(1),
  edition: editionYear,
  /** e.g. `§9.1, Table 5`. Optional only where the whole document is the source. */
  clause: z.string().optional(),
  /** Where to obtain it. Never a copy of it — see `decisions/scope-and-surfaces.md` Decision 2. */
  url: z.url().optional(),
});

/**
 * One row of the revision block (`brand/brand-guide.md` §6). Newest first.
 * Dates format through `src/lib/revision.ts`, in UTC, for the reason given there.
 */
const revision = z.object({
  rev: z.string().regex(/^[A-Z]{1,2}$/, 'Revision letter, e.g. A, B, AA.'),
  date: z.coerce.date(),
  by: z.string().min(1),
  description: z.string().min(1),
});

/**
 * The human gate. `decisions/verification-and-authorship.md` — the one block in
 * this repo that AI must not write, edit, or fill. It means a person opened the
 * standard and confirmed the number, and it means nothing if an agent can produce it.
 */
const verification = z.object({
  standard: z.string().min(1),
  edition: editionYear,
  clause: z.string().min(1),
  /**
   * `worked-example` — the expected value is printed in the cited standard. Strongest.
   * `hand-check`     — computed independently by hand; the working is in the test.
   * `cross-tool`     — agreed against a named independent implementation. Weakest;
   *                    never the only method for a headline result.
   */
  method: z.enum(['worked-example', 'hand-check', 'cross-tool']),
  /** Points at the artefact the method left behind, e.g. `src/lib/calc/preload.test.ts::M10 x 1.5, class 10.9`. */
  evidence: z.string().min(1),
  /** Initials, matching the revision block's BY column. */
  verifiedBy: z.string().min(1),
  /** The date a human checked it — not the date the code was written. */
  verifiedOn: z.coerce.date(),
});

const base = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  topic: z.enum(TOPICS),
  revisions: z.array(revision).min(1, 'At least an initial issue row — see brand/brand-guide.md §6.'),
  /** Default `true` so an unfinished entry cannot publish by omission. */
  draft: z.boolean().default(true),
});

/**
 * The derivation disclosure (`brand/brand-guide.md` §6). Closed by default in the
 * UI, present without exception in the data — which is why it is required rather
 * than optional here.
 */
const derivation = z.object({
  equation: z.string().min(1),
  symbols: z
    .array(
      z.object({
        symbol: z.string().min(1),
        meaning: z.string().min(1),
        unit: z.string().optional(),
      }),
    )
    .min(1),
});

/**
 * The refinement that does the work: a published entry making a numeric claim
 * must carry a signed verification block. This is what makes the human gate a
 * build failure rather than an intention.
 */
const requiresVerificationWhenPublished = (
  value: { draft: boolean; verification?: unknown; quantitative?: boolean },
  ctx: z.RefinementCtx,
) => {
  const makesNumericClaim = value.quantitative ?? true;
  if (!value.draft && makesNumericClaim && !value.verification) {
    ctx.addIssue({
      code: 'custom',
      path: ['verification'],
      message:
        'Published entry has no verification block. A human must confirm the calculation ' +
        'principle and result against the standard before this can ship — see ' +
        'decisions/verification-and-authorship.md. Keep draft: true until then.',
    });
  }
};

const calculators = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/calculators' }),
  schema: base
    .extend({
      sources: z.array(source).min(1, 'A calculator cites at least one standard.'),
      /** The assumption strip. An empty one means the calculator is not finished. */
      assumptions: z.array(z.string().min(1)).min(1),
      derivation,
      verification: verification.optional(),
    })
    .superRefine(requiresVerificationWhenPublished),
});

const visualizers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/visualizers' }),
  schema: base
    .extend({
      sources: z.array(source).min(1),
      /**
       * True when the visualizer displays a computed dimension — which makes it a
       * numeric claim, verified exactly as a calculator is
       * (`decisions/visualizer-device.md`, Decision 4). False for purely
       * diagrammatic work: naming parts, showing an assembly sequence.
       */
      quantitative: z.boolean(),
      assumptions: z.array(z.string().min(1)).min(1),
      /** Required when quantitative — the geometry comes out of a calc core like any other number. */
      derivation: derivation.optional(),
      verification: verification.optional(),
      /**
       * Whether the geometry is drawn to scale. When false, the exaggeration factor
       * is stated on the drawing itself, not buried in a caption.
       */
      toScale: z.boolean().default(true),
      exaggeration: z.string().optional(),
    })
    .superRefine(requiresVerificationWhenPublished)
    .superRefine((value, ctx) => {
      if (!value.toScale && !value.exaggeration) {
        ctx.addIssue({
          code: 'custom',
          path: ['exaggeration'],
          message:
            'A visualizer not drawn to scale must state its exaggeration factor, e.g. ' +
            '"radial clearance × 20" — see decisions/visualizer-device.md, Decision 2.',
        });
      }
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: base.extend({
    /** Empty is legitimate only for an article that states no values. */
    sources: z.array(source).default([]),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string().min(1),
    url: z.url(),
    publisher: z.string().min(1),
    topic: z.enum(TOPICS),
    /**
     * `vendor-doc` exists so commercial material is labelled rather than laundered.
     * `brand/brand-guide.md` §1: maker, not merchant.
     */
    kind: z.enum(['standard', 'tool', 'table', 'course', 'paper', 'vendor-doc']),
    free: z.boolean(),
    /**
     * What it is good for and, where relevant, what it gets wrong. A link with no
     * annotation is a bookmark, not a resource — `decisions/scope-and-surfaces.md`.
     */
    note: z.string().min(1),
    /** Link-rot date. The chore that refreshes it is a Linear issue, not a doc. */
    checked: z.coerce.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { calculators, visualizers, articles, resources };
