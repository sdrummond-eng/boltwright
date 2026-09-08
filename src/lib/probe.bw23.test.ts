/**
 * DELIBERATELY FAILING — falsification probe for BW-23. Delete with the probe
 * branch; this file must never reach `main`.
 *
 * `npm run build` is the deploy gate (`CLAUDE.md`): `astro check`, then
 * `vitest run`, then `astro build`, and Cloudflare Pages runs that exact
 * command. This test fails the middle stage, which is the stage a wrong pinned
 * worked example would fail — so the probe exercises the real path rather than
 * an approximation of it.
 *
 * What it is testing is not the arithmetic. It is whether a red Cloudflare
 * check actually blocks the merge button on a PR, which is BW-23's
 * done-condition and is not established by the ruleset settings page looking
 * correct.
 */
import { describe, expect, it } from 'vitest';

describe('BW-23 falsification probe', () => {
  it('fails on purpose, to prove the deploy gate blocks a merge', () => {
    expect(1).toBe(2);
  });
});
