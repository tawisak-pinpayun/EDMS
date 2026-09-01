import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamData from '@/lib/models/examData';

/**
 * API สำหรับดูข้อมูลตาม ID
 * @param request NextRequest
 * @param params ส่วนประกอบของ URL ประกอบด้วย id
 * @returns JSON ข้อมูลรายการ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const item = await ExamData.findById(params.id).lean();
    if (!item) {
      return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * API สำหรับแก้ไขข้อมูล
 * @param request NextRequest ที่มี JSON body
 * @param params ส่วนประกอบของ URL ประกอบด้วย id
 * @returns JSON ข้อมูลทีอัปเดต
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await dbConnect();
    const updated = await ExamData.findByIdAndUpdate(params.id, body, {
      new: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * API สำหรับลบข้อมูล
 * @param request NextRequest
 * @param params ส่วนประกอบของ URL ประกอบด้วย id
 * @returns JSON สถานะการลบ
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const deleted = await ExamData.findByIdAndDelete(params.id).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
    }
    return NextResponse.json({ message: 'ลบสำเร็จ' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
