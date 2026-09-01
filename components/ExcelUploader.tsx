'use client';

import { useState } from 'react';

/**
 * Props ของ ExcelUploader
 */
interface ExcelUploaderProps {
  onImported: () => void;
}

/**
 * คอมโพเนนต์สำหรับอัปโหลดไฟล์ Excel
 * @param onImported ฟังก์ชั่นทีจะเรียกเมื่อ import เสร็จ
 * @returns JSX Element
 */
export default function ExcelUploader({ onImported }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  /**
   * จัดการเมื่อผู้ใช้เลือกไฟล์
   * @param e Event ของ input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  /**
   * ส่งไฟล์ไป API Import
   */
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Import ล้มเหลว');
      setFile(null);
      onImported();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
      >
        {uploading ? 'กำลังนำเข้า...' : 'Import Excel'}
      </button>
    </div>
  );
}
