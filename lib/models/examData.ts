import { Schema, model, models } from 'mongoose';

/**
 * Interface สำหรับเอกสาร ExamData
 */
export interface IExamData {
  employeeId: number;
  name: string;
  department: string;
  salary: number;
  joinDate: Date | null;
  status: string;
  lastUpdatedDate: Date | null;
}

/**
 * Schema สำหรับเก็บข้อมูลจากไฟล์ Excel
 * ประกอบด้วยฟิลด์หลักจากตารางข้อมูล
 */
const examDataSchema = new Schema<IExamData>(
  {
    employeeId: { type: Number, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, default: null },
    status: { type: String, required: true },
    lastUpdatedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * ตรวจสอบว่ามีโมเดล ExamData แล้วหรือยัง
 * หากมีแล้วจะใช้โมเดลเดิม เพื่อป้องกันการสร้างซ้ำใน Next.js
 */
const ExamData = models.ExamData || model<IExamData>('ExamData', examDataSchema);

export default ExamData;
