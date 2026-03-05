import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

type RangeDef = { colStart: number; colEnd: number; maxRows: number };

const RANGES: Record<string, RangeDef> = {
  glass:       { colStart: 0,   colEnd: 3,   maxRows: 603 },
  gems:        { colStart: 3,   colEnd: 6,   maxRows: 53  },
  carParts:    { colStart: 6,   colEnd: 11,  maxRows: 36  },
  villa:       { colStart: 11,  colEnd: 16,  maxRows: 41  },
  carRanks:    { colStart: 16,  colEnd: 18,  maxRows: 7   },
  floors:      { colStart: 59,  colEnd: 70,  maxRows: 63  },
  exhibits:    { colStart: 70,  colEnd: 81,  maxRows: 63  },
  carCore:     { colStart: 81,  colEnd: 92,  maxRows: 63  },
  homemaking:  { colStart: 92,  colEnd: 103, maxRows: 63  },
  artists:     { colStart: 103, colEnd: 108, maxRows: 143 },
  assets:      { colStart: 122, colEnd: 132, maxRows: 62  },
  assetTypes:  { colStart: 108, colEnd: 111, maxRows: 5   },
  sacrifices:  { colStart: 132, colEnd: 135, maxRows: 63  },
};

function extractRange(
  data: unknown[][],
  { colStart, colEnd, maxRows }: RangeDef
): { headers: (string | null)[]; data: unknown[][] } {
  const headerRow = data[1]; // row 1 has column headers
  const headers: (string | null)[] = [];
  for (let c = colStart; c < colEnd; c++) {
    const v = headerRow?.[c];
    headers.push(v != null ? String(v) : null);
  }

  const rows: unknown[][] = [];
  // data rows start at row 2 (row 0 = title, row 1 = headers)
  for (let r = 2; r < Math.min(data.length, maxRows + 2); r++) {
    const srcRow = data[r];
    if (!srcRow) continue;
    const first = srcRow[colStart];
    if (first == null || first === "") continue; // skip empty rows in this range
    const row: unknown[] = [];
    for (let c = colStart; c < colEnd; c++) {
      row.push(srcRow[c] ?? null);
    }
    rows.push(row);
  }
  return { headers, data: rows };
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "apex girl calculator.xlsx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Workbook not found" }, { status: 500 });
    }
    const fileBuffer = await fs.promises.readFile(filePath);
    const wb = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
    const ws = wb.Sheets["Tables"];
    if (!ws) {
      return NextResponse.json({ error: "Tables sheet not found" }, { status: 500 });
    }
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

    const result: Record<string, { headers: (string | null)[]; data: unknown[][] }> = {};
    for (const [name, rangeDef] of Object.entries(RANGES)) {
      result[name] = extractRange(raw, rangeDef);
    }

    // Extend artist data with levels from the Artist sheet (new levels beyond Tables data)
    const artistWs = wb.Sheets["Artist"];
    if (artistWs && result.artists) {
      const artistRaw = XLSX.utils.sheet_to_json(artistWs, { header: 1 }) as unknown[][];

      // Collect per-level EXP from Artist sheet (rows where col 0 and col 1 are numbers)
      const expByLevel = new Map<number, number>();
      for (const row of artistRaw) {
        if (Array.isArray(row) && typeof row[0] === "number" && typeof row[1] === "number") {
          expByLevel.set(row[0], row[1]);
        }
      }

      // Build per-level PROM ACUM from the grouped right-side table (col 3 = range, col 7 = promo accum)
      // Follows the step-function pattern in the Tables sheet: keys from rangeStart-1 through rangeEnd-1
      // all carry the range's cumulative value (matching how existing data is structured).
      const promAccumByLevel = new Map<number, number>();
      for (const row of artistRaw) {
        if (!Array.isArray(row)) continue;
        const rangeStr = row[3];
        const promAccum = row[7];
        if (typeof rangeStr !== "string" || typeof promAccum !== "number") continue;
        const match = rangeStr.match(/^(\d+)\s+to\s+(\d+)$/);
        if (!match) continue;
        const rangeStart = parseInt(match[1]);
        const rangeEnd = parseInt(match[2]);
        for (let level = rangeStart - 1; level <= rangeEnd - 1; level++) {
          promAccumByLevel.set(level, promAccum);
        }
      }

      if (expByLevel.size > 0) {
        // Find the last row with a valid numeric EXP ACUM in the Tables artist data
        let baseLevel = -1;
        let baseExpAccum = 0;
        for (const row of result.artists.data) {
          const lvl = row[0];
          const accum = row[2];
          if (typeof lvl === "number" && typeof accum === "number" && lvl > baseLevel) {
            baseLevel = lvl;
            baseExpAccum = accum;
          }
        }

        // Remove any rows with non-numeric EXP ACUM (e.g. the old "MAX" row)
        result.artists.data = result.artists.data.filter(
          (row) => typeof row[0] === "number" && typeof row[2] === "number"
        );

        // Append new levels from the Artist sheet.
        // The Tables EXP_ACUM convention stores the cumulative at key K using level K+1's EXP
        // (matching the existing data structure), so vlookupDiff(from-1, to-1) correctly
        // returns EXP for levels from..to.
        const maxLevel = Math.max(...expByLevel.keys());
        let expAccum = baseExpAccum;
        for (let level = baseLevel + 1; level < maxLevel; level++) {
          const expCard = expByLevel.get(level + 1);
          if (expCard == null) break;
          expAccum += expCard;
          const promAccum = promAccumByLevel.get(level) ?? 0;
          result.artists.data.push([level, expCard, expAccum, null, promAccum]);
        }
      }
    }

    // Extend assets and sacrifices from the Assets sheet
    const assetWs = wb.Sheets["Assets"];
    if (assetWs && result.assets && result.sacrifices) {
      const assetRaw = XLSX.utils.sheet_to_json(assetWs, { header: 1 }) as unknown[][];

      // Build per-level map from Assets sheet (col 0 = level, skip MAX rows)
      // Column mapping to Tables row: [StdJew, StdCar, StdProp, AbrJew, AbrCar, AbrProp, 0, AuctCar, AuctProp]
      const assetsByLevel = new Map<number, number[]>();
      for (const row of assetRaw) {
        if (!Array.isArray(row) || typeof row[0] !== "number" || typeof row[1] !== "number") continue;
        assetsByLevel.set(row[0], [
          row[1] as number,  // Std Jewelry
          row[2] as number,  // Std Car
          row[3] as number,  // Std Property
          row[6] as number,  // Abroad Jewelry
          row[7] as number,  // Abroad Car
          row[8] as number,  // Abroad Property
          0,                 // Auction Jewelry (n/a)
          row[11] as number, // Auction Car
          row[12] as number, // Auction Property
        ]);
      }

      // Remove rows with non-numeric values (e.g. empty level 60 row) from assets
      result.assets.data = result.assets.data.filter(
        (row) => typeof row[0] === "number" && typeof row[1] === "number"
      );

      // Find last valid cumulative row for assets
      let assetBaseLevel = -1;
      const assetAccum = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (const row of result.assets.data) {
        const lvl = row[0];
        if (typeof lvl === "number" && lvl > assetBaseLevel && typeof row[1] === "number") {
          assetBaseLevel = lvl;
          for (let i = 0; i < 9; i++) assetAccum[i] = (row[i + 1] as number) ?? 0;
        }
      }

      // Find last valid sacrifices accumulation
      result.sacrifices.data = result.sacrifices.data.filter(
        (row) => typeof row[0] === "number" && typeof row[2] === "number"
      );
      let sacrifBaseLevel = -1;
      let sacrifAccum = 0;
      for (const row of result.sacrifices.data) {
        const lvl = row[0];
        if (typeof lvl === "number" && lvl > sacrifBaseLevel && typeof row[2] === "number") {
          sacrifBaseLevel = lvl;
          sacrifAccum = row[2] as number;
        }
      }

      // Append new levels
      const maxAssetLevel = Math.max(...assetsByLevel.keys());
      for (let level = assetBaseLevel + 1; level <= maxAssetLevel; level++) {
        const perLevel = assetsByLevel.get(level);
        if (!perLevel) break;
        for (let i = 0; i < 9; i++) assetAccum[i] += perLevel[i];
        result.assets.data.push([level, ...assetAccum]);
        // Carry forward last known sacrifice accumulation for new levels
        if (level > sacrifBaseLevel) {
          result.sacrifices.data.push([level, null, sacrifAccum]);
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("tables route failed", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
