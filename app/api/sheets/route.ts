
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

type SheetPayload = {
  name: string;
  data: unknown[][];
  formulas: string[];
};

type WorkbookResponse = {
  sheets: string[];
  tables: unknown[][] | null;
  sheet?: SheetPayload;
  error?: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sheetQuery = url.searchParams.get('sheet');
    const filePath = path.join(process.cwd(), 'src', 'apex girl calculator.xlsx');
    console.log('api runtime cwd', process.cwd(), 'file', filePath, 'exists', fs.existsSync(filePath));
    const fileBuffer = await fs.promises.readFile(filePath);
    const wb = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const excludedSheets = new Set(['Calculator', 'Welcome']);
    const availableSheets = wb.SheetNames.filter((name) => !excludedSheets.has(name));
    const out: WorkbookResponse = { sheets: availableSheets, tables: null };

    if (wb.Sheets['Tables']) {
      try {
        out.tables = XLSX.utils.sheet_to_json(wb.Sheets['Tables'], { header: 1 }) as unknown[][];
      } catch {
        out.tables = null;
      }
    }

    if (sheetQuery) {
      const name = sheetQuery;
      if (excludedSheets.has(name) || !wb.Sheets[name]) {
        return NextResponse.json({ error: 'Sheet not found', sheets: availableSheets }, { status: 404 });
      }
      const ws = wb.Sheets[name];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
      const formulas = XLSX.utils.sheet_to_formulae(ws);
      out.sheet = { name, data, formulas };
      return NextResponse.json(out);
    }

    return NextResponse.json(out);
  } catch (error) {
    console.error('sheets route failed', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
