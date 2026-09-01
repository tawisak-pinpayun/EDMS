'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExamDataItem } from '@/lib/types';
import ExcelUploader from '@/components/ExcelUploader';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DataTable from '@/components/DataTable';
import DataModal from '@/components/DataModal';
import DeleteConfirm from '@/components/DeleteConfirm';

/**
 * หน้าหลักสำหรับจัดการข้อมูล
 * @returns JSX Element
 */
export default function HomePage() {
  const [items, setItems] = useState<ExamDataItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('employeeId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selected, setSelected] = useState<ExamDataItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /**
   * สร้าง query string สำหรับเรียก API
   */
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (department) params.set('department', department);
    if (status) params.set('status', status);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', String(page));
    params.set('limit', String(limit));
    return params.toString();
  }, [search, department, status, sortBy, sortOrder, page, limit]);

  /**
   * โหลดข้อมูลจาก API ตามเงื่อนไขค้นหา
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/exam-data?${queryString}`);
      const json = (await res.json()) as { data: ExamDataItem[]; total: number };
      setItems(json.data || []);
      setTotal(json.total || 0);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * เปิด Modal สำหรับเพิ่มข้อมูล
   */
  const handleAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  /**
   * เปิด Modal สำหรับแก้ไขข้อมูล
   */
  const handleEdit = (item: ExamDataItem) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  /**
   * บันทึกข้อมูลแล้วโหลดข้อมูลใหม่
   */
  const handleSaved = () => {
    setIsModalOpen(false);
    fetchData();
  };

  /**
   * ลบข้อมูลแล้วโหลดข้อมูลใหม่
   */
  const handleDeleted = () => {
    setDeleteId(null);
    fetchData();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">ระบบจัดการข้อมูล Excel</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <ExcelUploader onImported={fetchData} />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          เพิ่มข้อมูล
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          label="แผนก"
          value={department}
          options={['Engineering', 'Marketing', 'Sales', 'HR']}
          onChange={setDepartment}
        />
        <FilterPanel
          label="สถานะ"
          value={status}
          options={['Active', 'In Active']}
          onChange={setStatus}
        />
      </div>

      <DataTable
        items={items}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(field) => {
          if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy(field);
            setSortOrder('asc');
          }
        }}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      {total > limit && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      )}

      {isModalOpen && (
        <DataModal
          item={selected}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deleteId && (
        <DeleteConfirm
          id={deleteId}
          onClose={() => setDeleteId(null)}
          onDeleted={handleDeleted}
        />
      )}
    </main>
  );
}
