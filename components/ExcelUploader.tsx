'use client';

import { useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (inputRef.current) inputRef.current.value = '';
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
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="text-sm file:px-3 file:py-2 file:rounded-lg file:border file:border-slate-300 file:bg-white file:text-slate-700 hover:file:bg-slate-50"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition"
      >
        {uploading ? 'กำลังนำเข้า...' : 'Import Excel'}
      </button>
    </div>
  );
}
