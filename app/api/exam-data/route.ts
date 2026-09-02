import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamData from '@/lib/models/examData';

/**
 * API สำหรับดึงรายการข้อมูล พร้อมรองรับ search, filter, sort, pagination
 * @param request NextRequest ที่มี query parameters
 * @returns JSON รายการข้อมูลและจำนวนทั้งหมด
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const joinDateFrom = searchParams.get('joinDateFrom') || '';
    const joinDateTo = searchParams.get('joinDateTo') || '';
    const salaryMin = searchParams.get('salaryMin') || '';
    const salaryMax = searchParams.get('salaryMax') || '';
    const sortBy = searchParams.get('sortBy') || 'employeeId';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) filter.department = department;
    if (status) filter.status = status;

    if (joinDateFrom || joinDateTo) {
      filter.joinDate = {};
      if (joinDateFrom) {
        (filter.joinDate as Record<string, Date>).$gte = new Date(joinDateFrom);
      }
      if (joinDateTo) {
        (filter.joinDate as Record<string, Date>).$lte = new Date(joinDateTo);
      }
    }

    if (salaryMin || salaryMax) {
      filter.salary = {};
      if (salaryMin) {
        (filter.salary as Record<string, number>).$gte = Number(salaryMin);
      }
      if (salaryMax) {
        (filter.salary as Record<string, number>).$lte = Number(salaryMax);
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    await dbConnect();
    const total = await ExamData.countDocuments(
      filter as unknown as Parameters<typeof ExamData.countDocuments>[0]
    );
    const [data, statuses] = await Promise.all([
      ExamData.find(filter as unknown as Parameters<typeof ExamData.find>[0])
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ExamData.distinct('status'),
    ]);

    return NextResponse.json({ data, total, page, limit, statuses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * API สำหรับเพิ่มข้อมูลใหม่
 * @param request NextRequest ที่มี JSON body
 * @returns JSON ข้อมูลทีบันทึก
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await dbConnect();
    const doc = new ExamData({ ...body, lastUpdatedDate: new Date() });
    await doc.save();
    return NextResponse.json(doc.toObject(), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
