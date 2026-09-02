'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExamDataItem } from '@/lib/types';
import ExcelUploader from '@/components/ExcelUploader';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DateRangeFilter from '@/components/DateRangeFilter';
import SalaryRangeFilter from '@/components/SalaryRangeFilter';
import DataTable from '@/components/DataTable';
import DataModal from '@/components/DataModal';
import DeleteConfirm from '@/components/DeleteConfirm';
import ExportButton from '@/components/ExportButton';

/**
 * หน้าหลักสำหรับจัดการข้อมูล
 * @returns JSX Element
 */
export default function HomePage() {
  const [items, setItems] = useState<ExamDataItem[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [joinDateFrom, setJoinDateFrom] = useState('');
  const [joinDateTo, setJoinDateTo] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [sortBy, setSortBy] = useState('employeeId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selected, setSelected] = useState<ExamDataItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /**
   * สร้าง query string สำหรับเรียก API บนหน้าเว็บ
   */
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (department) params.set('department', department);
    if (status) params.set('status', status);
    if (joinDateFrom) params.set('joinDateFrom', joinDateFrom);
    if (joinDateTo) params.set('joinDateTo', joinDateTo);
    if (salaryMin) params.set('salaryMin', salaryMin);
    if (salaryMax) params.set('salaryMax', salaryMax);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', String(page));
    params.set('limit', String(limit));
    return params.toString();
  }, [
    search,
    department,
    status,
    joinDateFrom,
    joinDateTo,
    salaryMin,
    salaryMax,
    sortBy,
    sortOrder,
    page,
    limit,
  ]);

  /**
   * สร้าง query string สำหรับ Export ข้อมูลทั้งหมดทีกรองไว้
   */
  const exportQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (department) params.set('department', department);
    if (status) params.set('status', status);
    if (joinDateFrom) params.set('joinDateFrom', joinDateFrom);
    if (joinDateTo) params.set('joinDateTo', joinDateTo);
    if (salaryMin) params.set('salaryMin', salaryMin);
    if (salaryMax) params.set('salaryMax', salaryMax);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', '1');
    params.set('limit', '10000');
    return params.toString();
  }, [
    search,
    department,
    status,
    joinDateFrom,
    joinDateTo,
    salaryMin,
    salaryMax,
    sortBy,
    sortOrder,
  ]);

  /**
   * รีเซ็ตหน้าเป้นหน้า 1 เมื่อ filter เปลี่ยน
   */
  useEffect(() => {
    setPage(1);
  }, [
    search,
    department,
    status,
    joinDateFrom,
    joinDateTo,
    salaryMin,
    salaryMax,
  ]);

  /**
   * โหลดข้อมูลจาก API ตามเงื่อนไขค้นหา
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/exam-data?${queryString}`);
      const json = (await res.json()) as {
        data: ExamDataItem[];
        total: number;
        statuses: string[];
      };
      setItems(json.data || []);
      setStatusOptions(json.statuses || []);
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

  /**
   * ล้าง filter ทั้งหมด
   */
  const handleReset = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
    setJoinDateFrom('');
    setJoinDateTo('');
    setSalaryMin('');
    setSalaryMax('');
    setSortBy('employeeId');
    setSortOrder('asc');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* ส่วนหัว */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow p-6">
          <h1 className="text-3xl font-bold">ระบบจัดการข้อมูล Excel</h1>
          <p className="text-blue-100 mt-1">
            นำเข้า ค้นหา กรอง เรียง แก้ไข และ Export ข้อมูลพนักงาน
          </p>
        </div>

        {/* ส่วนควบคุม */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <ExcelUploader onImported={fetchData} />
              <ExportButton query={exportQueryString} />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                + เพิ่มข้อมูล
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                ล้าง filter
              </button>
            </div>
            <div className="text-sm text-slate-500">
              แสดง {items.length} จาก {total} รายการ
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              options={statusOptions}
              onChange={setStatus}
            />
            <SalaryRangeFilter
              min={salaryMin}
              max={salaryMax}
              onMinChange={setSalaryMin}
              onMaxChange={setSalaryMax}
            />
          </div>

          <DateRangeFilter
            label="วันที่เข้าร่วม"
            from={joinDateFrom}
            to={joinDateTo}
            onFromChange={setJoinDateFrom}
            onToChange={setJoinDateTo}
          />
        </div>

        {/* ส่วนตาราง */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
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
            <div className="flex items-center justify-between p-4 border-t bg-slate-50">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 transition"
              >
                ก่อนหน้า
              </button>
              <span className="text-sm text-slate-600">
                หน้า {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 transition"
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <DataModal
          item={selected}
          statusOptions={statusOptions}
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
