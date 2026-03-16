import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export type ArtistMod = { name: string; extra: number };

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "artistxpmods.xlsx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "artistxpmods.xlsx not found" }, { status: 500 });
    }
    const fileBuffer = await fs.promises.readFile(filePath);
    const wb = XLSX.read(fileBuffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

    // Row 0 = title, Row 1 = headers, Row 2+ = data (col0=name, col1=extra)
    const mods: ArtistMod[] = [];
    for (let i = 2; i < raw.length; i++) {
      const row = raw[i] as unknown[];
      const name = row[0];
      const extra = row[1];
      if (typeof name === "string" && name.trim() && typeof extra === "number") {
        mods.push({ name: name.trim(), extra });
      }
    }

    return NextResponse.json(mods);
  } catch (error) {
    console.error("artist-mods route failed", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
