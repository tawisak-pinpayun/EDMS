import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamData from '@/lib/models/examData';
import { parseExcelBuffer, mapExcelRow } from '@/lib/excel';

/**
 * API สำหรับรับไฟล์ Excel และ Import ข้อมูลลง MongoDB
 * ล้างข้อมูลเก่าก่อน import ใหม่เพื่อไม่ให้มีข้อมูลซ้ำ
 * @param request NextRequest ที่มีไฟล์แนบมา
 * @returns JSON สถานะการนำเข้า
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'กรุณาเลือกไฟล์' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rows = parseExcelBuffer(buffer);
    const mapped = rows.map(mapExcelRow);

    await dbConnect();
    await ExamData.deleteMany({});
    await ExamData.insertMany(mapped);

    return NextResponse.json({ message: 'นำเข้าสำเร็จ', count: mapped.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
