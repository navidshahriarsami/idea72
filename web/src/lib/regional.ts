// Coarse approximation of Home Affairs "designated regional area" rules:
// everywhere except metropolitan Sydney, Melbourne and Brisbane qualifies.
// Replace with the official postcode list when ingestion is built.
const METRO_RANGES: Array<[number, number]> = [
  // Sydney
  [1000, 1999],
  [2000, 2249],
  [2555, 2574],
  [2740, 2786],
  // Melbourne
  [3000, 3211],
  [8000, 8999],
  // Brisbane
  [4000, 4207],
  [9000, 9999],
];

export function isRegionalPostcode(postcode: string): boolean {
  const value = Number(postcode);
  if (!Number.isInteger(value)) return false;
  return !METRO_RANGES.some(([lo, hi]) => value >= lo && value <= hi);
}
