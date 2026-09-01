/**
 * Props ของ SearchBar
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * คอมโพเนนต์สำหรับค้นหาข้อมูล
 * @param value ค่าปัจจุบันในช่องค้นหา
 * @param onChange ฟังก์ชั่นทีจะเรียกเมื่อค่าเปลี่ยน
 * @returns JSX Element
 */
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        ค้นหา
      </label>
      <input
        type="text"
        placeholder="ค้นหาชื่อ แผนก หรือสถานะ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
