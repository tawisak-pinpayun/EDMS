/**
 * Props ของ DeleteConfirm
 */
interface DeleteConfirmProps {
  id: string;
  onClose: () => void;
  onDeleted: () => void;
}

/**
 * คอมโพเนนต์ยืนยันก่อนลบข้อมูล
 * @param id ID ของข้อมูลทีต้องการลบ
 * @param onClose ฟังก์ชั่นปิด Modal
 * @param onDeleted ฟังก์ชั่นเมื่อลบสำเร็จ
 * @returns JSX Element
 */
export default function DeleteConfirm({
  id,
  onClose,
  onDeleted,
}: DeleteConfirmProps) {
  /**
   * ส่งคำขอลบไปยัง API
   */
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/exam-data/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('ลบล้มเหลว');
      onDeleted();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">ยืนยันการลบ</h2>
        <p className="mb-4">ต้องการลบข้อมูลนี้หรือไม่?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}
