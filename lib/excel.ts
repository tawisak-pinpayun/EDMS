import * as XLSX from 'xlsx';

/**
 * รูปแบบของแถวข้อมูลจาก Excel
 */
interface ExcelRow {
  [key: string]: unknown;
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
    const excelEpoch = Date.UTC(1899, 11, 30);
    return new Date(excelEpoch + Math.round(value * 24 * 60 * 60 * 1000));
  }

  if (typeof value === 'string' && value.trim()) {
    const text = value.trim();
    const thaiDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (thaiDate) {
      const year = Number(thaiDate[3]);
      return new Date(
        Date.UTC(year >= 2400 ? year - 543 : year, Number(thaiDate[2]) - 1, Number(thaiDate[1]))
      );
    }
    const d = new Date(text);
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
    employeeId: Number(row['ID'] ?? row['รหัสพนักงาน']) || 0,
    name: String(row['Name'] ?? row['ชื่อ'] ?? '').trim(),
    department: String(row['Department'] ?? row['แผนก'] ?? '').trim(),
    salary: Number(row['Salary'] ?? row['เงินเดือน']) || 0,
    joinDate: convertExcelDate(row['Join Date'] ?? row['วันที่เข้าร่วม']),
    status: String(row['Status'] ?? row['สถานะ'] ?? '').trim(),
    lastUpdatedDate: convertExcelDate(
      row['Last Updated Date'] ?? row['อัปเดตล่าสุด']
    ),
  };
}
