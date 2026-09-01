/**
 * Props ของ FilterPanel
 */
interface FilterPanelProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

/**
 * คอมโพเนนต์สำหรับกรองข้อมูลแบบ dropdown
 * @param label ข้อความ label
 * @param value ค่าปัจจุบัน
 * @param options รายการตัวเลือก
 * @param onChange ฟังก์ชั่นเมื่อเลือกตัวเลือก
 * @returns JSX Element
 */
export default function FilterPanel({
  label,
  value,
  options,
  onChange,
}: FilterPanelProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">ทั้งหมด</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
