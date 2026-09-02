# EDMS - Excel Data Management System

Web Application สำหรับจัดการข้อมูลจากไฟล์ Excel โดยใช้ **Next.js 14 + MongoDB** พร้อมรองรับ CRUD, Search, Filter, Sort, Pagination

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Mongoose
- xlsx (SheetJS)

## ฟีเจอร์หลัก

- Import ไฟล์ Excel เข้า MongoDB
- ดูรายการข้อมูลเป็นตาราง
- ค้นหา (Search) หลายฟิลด์
- กรองข้อมูล (Filter) ตามแผนกและสถานะ
- เรียงลำดับ (Sort)
- แบ่งหน้า (Pagination)
- เพิ่ม/แก้ไข/ลบ ข้อมูลผ่าน Modal
- Responsive UI
- คอมเม้นภาษาไทยทุกฟังก์ชั่น

## วิธีรัน

1. ติดตั้ง dependencies:

```bash
npm install
```

2. ตั้งค่า MONGODB_URI ใน `.env` (หรือ `.env.local`)

3. รัน development server:

```bash
npm run dev
```

4. เปิดเบราว์เซอร์ที่ http://localhost:3000

## วิธี Build

```bash
npm run build
npm run start
```

## โครงสร้างโปรเจค

```
EDMS/
  app/
    api/
      import/route.ts         # API Import Excel
      exam-data/route.ts      # API List + Create
      exam-data/[id]/route.ts # API Read + Update + Delete
    page.tsx                  # หน้าหลัก
    layout.tsx                # Layout
  components/                 # คอมโพเนนต์ต่าง ๆ
  lib/
    db.ts                     # เชื่อมต่อ MongoDB
    models/examData.ts        # Mongoose Model
    excel.ts                  # อ่านและแปลงไฟล์ Excel
    types.ts                  # TypeScript Types
  .env                        # ค่าตัวแปรสภาพแวดล้อม
```