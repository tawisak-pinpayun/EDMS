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
    return <p>กำลังโหลด...</p>;
  }

  if (items.length === 0) {
    return <p className="text-gray-500">ไม่มีข้อมูล</p>;
  }

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

  const fields = [
    'employeeId',
    'name',
    'department',
    'salary',
    'joinDate',
    'status',
    'lastUpdatedDate',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {fields.map((field) => (
              <th
                key={field}
                onClick={() => onSort(field)}
                className="border p-2 cursor-pointer text-left whitespace-nowrap"
              >
                {field} {sortIcon(field)}
              </th>
            ))}
            <th className="border p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="border p-2">{item.employeeId}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.department}</td>
              <td className="border p-2">{item.salary.toLocaleString()}</td>
              <td className="border p-2">{formatDate(item.joinDate)}</td>
              <td className="border p-2">{item.status}</td>
              <td className="border p-2">{formatDate(item.lastUpdatedDate)}</td>
              <td className="border p-2 whitespace-nowrap">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => item._id && onDelete(item._id)}
                  className="text-red-600 hover:underline"
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
