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

    return NextResponse.json(result);
  } catch (error) {
    console.error("tables route failed", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
