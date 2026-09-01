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
    <input
      type="text"
      placeholder="ค้นหา..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    />
  );
}
