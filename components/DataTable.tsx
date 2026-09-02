import { ExamDataItem } from '@/lib/types';

/**
 * Props ของ DataTable
 */
interface DataTableProps {
  items: ExamDataItem[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (item: ExamDataItem) => void;
  onDelete: (id: string) => void;
}

/**
 * คอมโพเนนต์สำหรับแสดงตารางข้อมูล
 * @param items รายการข้อมูล
 * @param loading สถานะกำลังโหลด
 * @param sortBy ฟิลด์ทีกำลัง sort
 * @param sortOrder ทิศทางการ sort
 * @param onSort ฟังก์ชั่นเมื่อคลิกหัวตาราง
 * @param onEdit ฟังก์ชั่นเมื่อแก้ไข
 * @param onDelete ฟังก์ชั่นเมื่อลบ
 * @returns JSX Element
 */
export default function DataTable({
  items,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: DataTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">ไม่มีข้อมูล</div>
    );
  }

  const fields = [
    'employeeId',
    'name',
    'department',
    'salary',
    'joinDate',
    'status',
    'lastUpdatedDate',
  ];

  const fieldLabels: Record<string, string> = {
    employeeId: 'รหัสพนักงาน',
    name: 'ชื่อ',
    department: 'แผนก',
    salary: 'เงินเดือน',
    joinDate: 'วันที่เข้าร่วม',
    status: 'สถานะ',
    lastUpdatedDate: 'อัปเดตล่าสุด',
  };

  /**
   * สร้างสัญลักษณ์แสดงทิศทางการ Sort
   * @param field ชื่อฟิลด์
   * @returns สตริงสัญลักษณ์
   */
  const sortIcon = (field: string) => {
    if (sortBy !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  /**
   * แปลงวันที่เป้นรูปแบบไทย
   * @param date วันที่ทีต้องการแปลง
   * @returns ข้อความวันที่
   */
  const formatDate = (date: string | null | Date) => {
    return date ? new Date(date).toLocaleDateString('th-TH') : '-';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-white">
          <tr>
            {fields.map((field) => (
              <th
                key={field}
                onClick={() => onSort(field)}
                className="px-4 py-3 cursor-pointer whitespace-nowrap hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-1">
                  {fieldLabels[field]}
                  <span className="text-xs opacity-70">{sortIcon(field)}</span>
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item._id}
              className={`border-b hover:bg-blue-50 transition ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <td className="px-4 py-3 font-medium text-slate-700">
                {item.employeeId}
              </td>
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs">
                  {item.department}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {item.salary.toLocaleString()}
              </td>
              <td className="px-4 py-3">{formatDate(item.joinDate)}</td>
              <td className="px-4 py-3">{item.status}</td>
              <td className="px-4 py-3">{formatDate(item.lastUpdatedDate)}</td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition mr-2"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => item._id && onDelete(item._id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
