import path from 'node:path';
import XLSX from 'xlsx';

const workbookPath = path.resolve('public', 'apex girl calculator.xlsx');
const workbook = XLSX.readFile(workbookPath);
const sheetName = workbook.SheetNames.find((name) => /glass/i.test(name)) || 'Glass';
const worksheet = workbook.Sheets[sheetName];

if (!worksheet) {
  console.error('Glass sheet not found');
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
const headerRow = data[0] && data[0].every((cell) => typeof cell === 'string') ? data[0] : null;
const rows = headerRow ? data.slice(1) : data;
const keyValues = rows.map((row) => row[0]).filter((key) => key !== undefined && key !== null);
const numericKeys = keyValues.map((key) => Number(key)).filter((num) => !Number.isNaN(num));

console.log('sheetName:', sheetName);
console.log('rows count:', rows.length);
console.log('numeric keys count:', numericKeys.length);
console.log('max numeric key:', numericKeys.length ? Math.max(...numericKeys) : 'N/A');
console.log('sample keys (first 20):', keyValues.slice(0, 20));