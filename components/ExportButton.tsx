'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExamDataItem } from '@/lib/types';

/**
 * Props ของ ExportButton
 */
interface ExportButtonProps {
  query: string;
}

/**
 * คอมโพเนนต์สำหรับ Export ข้อมูลเป้น Excel
 * @param query query string สำหรับดึงข้อมูลทีต้องการ export
 * @returns JSX Element
 */
export default function ExportButton({ query }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  /**
   * ดึงข้อมูลจาก API แล้วสร้างไฟล์ Excel ให้ดาวน์โหลด
   */
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/exam-data?${query}`);
      const json = (await res.json()) as { data: ExamDataItem[] };
      const rows = (json.data || []).map((item) => ({
        รหัสพนักงาน: item.employeeId,
        ชื่อ: item.name,
        แผนก: item.department,
        เงินเดือน: item.salary,
        วันที่เข้าร่วม: item.joinDate
          ? new Date(item.joinDate).toLocaleDateString('th-TH')
          : '',
        สถานะ: item.status,
        อัปเดตล่าสุด: item.lastUpdatedDate
          ? new Date(item.lastUpdatedDate).toLocaleDateString('th-TH')
          : '',
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ข้อมูลพนักงาน');
      XLSX.writeFile(wb, 'exam-data-export.xlsx');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition"
    >
      {exporting ? 'กำลัง Export...' : 'Export Excel'}
    </button>
  );
}
