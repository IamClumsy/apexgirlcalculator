/**
 * Excel-style VLOOKUP: exact match on column 0, return column `col` (1-based).
 * Handles both numeric and string keys.
 */
export function vlookup(
  key: number | string,
  table: unknown[][],
  col: number
): number | null {
  for (const row of table) {
    const cell = row[0];
    if (cell == null) continue;
    const match =
      typeof key === "number"
        ? typeof cell === "number" && cell === key
        : String(cell) === String(key);
    if (match) {
      const val = row[col - 1]; // VLOOKUP columns are 1-based
      if (typeof val === "number") return val;
      if (val == null) return 0;
      const parsed = Number(val);
      return isNaN(parsed) ? 0 : parsed;
    }
  }
  return null;
}

/**
 * Difference pattern used across all calculator sections:
 * VLOOKUP(to, table, col) - VLOOKUP(from, table, col)
 */
export function vlookupDiff(
  from: number | string,
  to: number | string,
  table: unknown[][],
  col: number
): number | null {
  const vTo = vlookup(to, table, col);
  const vFrom = vlookup(from, table, col);
  if (vTo == null || vFrom == null) return null;
  return vTo - vFrom;
}
