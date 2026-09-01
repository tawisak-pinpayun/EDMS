/**
 * Props ของ SalaryRangeFilter
 */
interface SalaryRangeFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

/**
 * คอมโพเนนต์สำหรับกรองช่วงเงินเดือน
 * @param min เงินเดือนขั้นต่ำ
 * @param max เงินเดือนขั้นสูง
 * @param onMinChange ฟังก์ชั่นเมื่อเปลี่ยนขั้นต่ำ
 * @param onMaxChange ฟังก์ชั่นเมื่อเปลี่ยนขั้นสูง
 * @returns JSX Element
 */
export default function SalaryRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
}: SalaryRangeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        เงินเดือน
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={min}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="ขั้นต่ำ"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-slate-500">-</span>
        <input
          type="number"
          value={max}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="ขั้นสูง"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
