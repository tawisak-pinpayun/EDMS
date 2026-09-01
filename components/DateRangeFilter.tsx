/**
 * Props ของ DateRangeFilter
 */
interface DateRangeFilterProps {
  label: string;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

/**
 * คอมโพเนนต์สำหรับกรองช่วงวันที่
 * @param label ข้อความ label
 * @param from วันที่เริ่มต้น
 * @param to วันที่สิ้นสุด
 * @param onFromChange ฟังก์ชั่นเมื่อเปลี่ยนวันที่เริ่มต้น
 * @param onToChange ฟังก์ชั่นเมื่อเปลี่ยนวันที่สิ้นสุด
 * @returns JSX Element
 */
export default function DateRangeFilter({
  label,
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="จาก"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ถึง"
        />
      </div>
    </div>
  );
}
