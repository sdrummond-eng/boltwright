import { describe, expect, it } from 'vitest';
import { formatRevisionDate } from './revision.js';

describe('formatRevisionDate', () => {
  // Expected format taken from the revision-block example in
  // `brand/brand-guide.md` §6: `C  2026-08-14  SW  Updated for ISO 898-1:2024`.
  it('formats a date as an ISO calendar date', () => {
    expect(formatRevisionDate(new Date('2026-08-14T12:00:00Z'))).toBe('2026-08-14');
  });

  // The two cases that matter. Both pass under a UTC implementation and fail
  // under a local-time one, so they are what pins the choice rather than
  // documenting it. Each is a real date that would roll a day in a build
  // container east or west of UTC.
  it('does not roll forward late in the UTC day', () => {
    expect(formatRevisionDate(new Date('2026-08-14T23:59:59Z'))).toBe('2026-08-14');
  });

  it('does not roll back early in the UTC day', () => {
    expect(formatRevisionDate(new Date('2026-01-01T00:30:00Z'))).toBe('2026-01-01');
  });

  it('refuses an invalid date rather than printing "Invalid Date"', () => {
    expect(() => formatRevisionDate(new Date('not a date'))).toThrow(RangeError);
  });
});
