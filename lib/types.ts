/**
 * Type สำหรับข้อมูลในตาราง
 */
export interface ExamDataItem {
  _id?: string;
  employeeId: number;
  name: string;
  department: string;
  salary: number;
  joinDate: string | null;
  status: string;
  lastUpdatedDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}
