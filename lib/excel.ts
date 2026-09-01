import * as XLSX from 'xlsx';

/**
 * รูปแบบของแถวข้อมูลจาก Excel
 */
interface ExcelRow {
  [key: string]: unknown;
}

/**
 * รูปแบบของฟังก์ชั่น parse_date_code จาก xlsx
 */
interface SsfType {
  parse_date_code(serial: number): { y: number; m: number; d: number };
}

/**
 * แปลงค่าวันที่จาก Excel (อาจเป็น Date หรือ serial number)
 * @param value ค่าวันที่จาก Excel
 * @returns อ็อบเจ็กต์ Date หรือ null
 */
function convertExcelDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    const ssf = (XLSX as unknown as { SSF: SsfType }).SSF;
    const parsed = ssf.parse_date_code(value);
    return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  }

  if (typeof value === 'string' && value.trim()) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }

  return null;
}

/**
 * แปลง Buffer ของไฟล์ Excel เป็น array ของ object
 * โดยใช้แถวแรกเป็นชื่อฟิลด์
 * @param buffer Buffer ของไฟล์ Excel
 * @returns Array ของ object ข้อมูล
 */
export function parseExcelBuffer(buffer: Buffer): ExcelRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
  return rows;
}

/**
 * แปลงข้อมูลแถวจาก Excel ให้ตรงกับฟิลด์ใน Mongoose
 * @param row ข้อมูลแถวจาก Excel
 * @returns Object ทีพร้อมบันทึกลง MongoDB
 */
export function mapExcelRow(row: ExcelRow) {
  return {
    employeeId: Number(row['ID']) || 0,
    name: String(row['Name'] ?? '').trim(),
    department: String(row['Department'] ?? '').trim(),
    salary: Number(row['Salary']) || 0,
    joinDate: convertExcelDate(row['Join Date']),
    status: String(row['Status'] ?? '').trim(),
    lastUpdatedDate: convertExcelDate(row['Last Updated Date']),
  };
}
