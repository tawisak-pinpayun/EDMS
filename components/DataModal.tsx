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
  statusOptions: string[];
  departmentOptions: string[];
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
export default function DataModal({
  item,
  statusOptions,
  departmentOptions,
  onClose,
  onSaved,
}: DataModalProps) {
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
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);

  /**
   * โหลดข้อมูลเดิมเข้าฟอร์มเมื่อมีการแก้ไข
   */
  useEffect(() => {
    const now = new Date().toLocaleString('th-TH');
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
        lastUpdatedDate: now,
      });
    } else {
      setForm((current) => ({ ...current, lastUpdatedDate: now }));
    }
    setIsAddingStatus(false);
    setIsStatusOpen(false);
    setIsAddingDepartment(false);
    setIsDepartmentOpen(false);
  }, [item]);

  /**
   * อัปเดตค่าในฟอร์ม
   * @param e Event ของ input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    if (value === '__new__') {
      setForm({ ...form, status: '' });
      setIsAddingStatus(true);
    } else {
      setForm({ ...form, status: value });
      setIsAddingStatus(false);
    }
    setIsStatusOpen(false);
  };

  const handleDepartmentChange = (value: string) => {
    if (value === '__new__') {
      setForm({ ...form, department: '' });
      setIsAddingDepartment(true);
    } else {
      setForm({ ...form, department: value });
      setIsAddingDepartment(false);
    }
    setIsDepartmentOpen(false);
  };

  /**
   * บันทึกข้อมูลไปยัง API
   * @param e Event ของการ submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.status.trim()) {
      alert('กรุณาเลือกหรือเพิ่มสถานะ');
      return;
    }
    if (!form.department.trim()) {
      alert('กรุณาเลือกหรือเพิ่มแผนก');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        employeeId: Number(form.employeeId),
        name: form.name.trim(),
        department: form.department.trim(),
        salary: Number(form.salary),
        joinDate: form.joinDate ? new Date(form.joinDate) : null,
        status: form.status.trim(),
        lastUpdatedDate: new Date(),
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

  const availableStatuses = Array.from(
    new Set([...statusOptions, ...(item?.status ? [item.status] : [])])
  );
  const availableDepartments = Array.from(
    new Set([...departmentOptions, ...(item?.department ? [item.department] : [])])
  );

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
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsDepartmentOpen((open) => !open)}
                className="w-full h-[42px] border rounded px-3 py-2 bg-white text-left flex items-center justify-between gap-2"
              >
                <span className={`truncate ${form.department ? '' : 'text-slate-400'}`}>
                  {isAddingDepartment ? '+ เพิ่มแผนกใหม่' : form.department || 'เลือกแผนก'}
                </span>
                <span className="text-slate-500 shrink-0">⌄</span>
              </button>
              {isDepartmentOpen && (
                <div className="absolute z-20 top-full inset-x-0 mt-1 box-border max-h-48 overflow-y-auto rounded border bg-white shadow-lg">
                  {availableDepartments.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleDepartmentChange(option)}
                      className="block w-full px-3 py-2 text-left truncate hover:bg-slate-100"
                      title={option}
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleDepartmentChange('__new__')}
                    className="block w-full border-t px-3 py-2 text-left font-medium text-blue-600 hover:bg-blue-50"
                  >
                    + เพิ่มแผนกใหม่
                  </button>
                </div>
              )}
            </div>
            {isAddingDepartment && (
              <input
                required
                autoFocus
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="กรอกชื่อแผนกใหม่"
                className="w-full h-[42px] border rounded px-3 py-2 mt-2"
              />
            )}
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
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsStatusOpen((open) => !open)}
                className="w-full h-[42px] border rounded px-3 py-2 bg-white text-left flex items-center justify-between gap-2"
              >
                <span className={`truncate ${form.status ? '' : 'text-slate-400'}`}>
                  {isAddingStatus ? '+ เพิ่มสถานะใหม่' : form.status || 'เลือกสถานะ'}
                </span>
                <span className="text-slate-500 shrink-0">⌄</span>
              </button>
              {isStatusOpen && (
                <div className="absolute z-20 top-full inset-x-0 mt-1 box-border max-h-48 overflow-y-auto rounded border bg-white shadow-lg">
                  {availableStatuses.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleStatusChange(option)}
                      className="block w-full px-3 py-2 text-left truncate hover:bg-slate-100"
                      title={option}
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleStatusChange('__new__')}
                    className="block w-full border-t px-3 py-2 text-left font-medium text-blue-600 hover:bg-blue-50"
                  >
                    + เพิ่มสถานะใหม่
                  </button>
                </div>
              )}
            </div>
            {isAddingStatus && (
              <input
                required
                autoFocus
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="กรอกชื่อสถานะใหม่"
                className="w-full h-[42px] border rounded px-3 py-2 mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm">อัปเดตล่าสุด</label>
            <input
              readOnly
              type="text"
              value={form.lastUpdatedDate}
              className="w-full h-[42px] border rounded px-3 py-2 bg-slate-100 text-slate-600"
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
