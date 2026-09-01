'use client';

import { useState, useEffect } from 'react';
import { ExamDataItem } from '@/lib/types';

/**
 * ข้อมูลในฟอร์ม Modal
 */
interface FormData {
  employeeId: string;
  name: string;
  department: string;
  salary: string;
  joinDate: string;
  status: string;
  lastUpdatedDate: string;
}

/**
 * Props ของ DataModal
 */
interface DataModalProps {
  item: ExamDataItem | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * คอมโพเนนต์ Modal สำหรับเพิ่ม/แก้ไขข้อมูล
 * @param item ข้อมูลทีต้องการแก้ไข (null ถ้าเพิ่มใหม่)
 * @param onClose ฟังก์ชั่นปิด Modal
 * @param onSaved ฟังก์ชั่นเมื่อบันทึกสำเร็จ
 * @returns JSX Element
 */
export default function DataModal({ item, onClose, onSaved }: DataModalProps) {
  const [form, setForm] = useState<FormData>({
    employeeId: '',
    name: '',
    department: '',
    salary: '',
    joinDate: '',
    status: '',
    lastUpdatedDate: '',
  });
  const [saving, setSaving] = useState(false);

  /**
   * โหลดข้อมูลเดิมเข้าฟอร์มเมื่อมีการแก้ไข
   */
  useEffect(() => {
    if (item) {
      setForm({
        employeeId: String(item.employeeId),
        name: item.name,
        department: item.department,
        salary: String(item.salary),
        joinDate: item.joinDate
          ? new Date(item.joinDate).toISOString().split('T')[0]
          : '',
        status: item.status,
        lastUpdatedDate: item.lastUpdatedDate
          ? new Date(item.lastUpdatedDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [item]);

  /**
   * อัปเดตค่าในฟอร์ม
   * @param e Event ของ input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * บันทึกข้อมูลไปยัง API
   * @param e Event ของการ submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        employeeId: Number(form.employeeId),
        name: form.name.trim(),
        department: form.department.trim(),
        salary: Number(form.salary),
        joinDate: form.joinDate ? new Date(form.joinDate) : null,
        status: form.status.trim(),
        lastUpdatedDate: form.lastUpdatedDate ? new Date(form.lastUpdatedDate) : null,
      };
      const url = item?._id ? `/api/exam-data/${item._id}` : '/api/exam-data';
      const method = item?._id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('บันทึกล้มเหลว');
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {item ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">รหัสพนักงาน</label>
            <input
              required
              type="number"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">ชื่อ</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">แผนก</label>
            <input
              required
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">เงินเดือน</label>
            <input
              required
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">วันที่เข้าร่วม</label>
            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">สถานะ</label>
            <input
              required
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">อัปเดตล่าสุด</label>
            <input
              type="date"
              name="lastUpdatedDate"
              value={form.lastUpdatedDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
