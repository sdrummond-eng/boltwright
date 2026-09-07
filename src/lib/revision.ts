/**
 * Revision dates for the revision block defined in `brand/brand-guide.md` §6,
 * which sets them as ISO calendar dates (`2026-08-14`).
 *
 * Formatting is UTC, deliberately. A revision date is a property of the
 * revision, not of the reader's clock or of wherever the build happened to run.
 * Formatting in local time prints a different date either side of midnight,
 * which on a site whose whole claim is "you can tell how current this is" is a
 * correctness bug, not a display one.
 */
export function formatRevisionDate(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('formatRevisionDate: received an invalid Date');
  }
  return date.toISOString().slice(0, 10);
}
