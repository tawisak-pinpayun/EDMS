# EDMS - Excel Data Management System

Web Application สำหรับจัดการข้อมูลจากไฟล์ Excel โดยใช้ **Next.js 14 + MongoDB** พร้อมรองรับ CRUD, Search, Filter, Sort, Pagination

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Mongoose
- xlsx (SheetJS)

## ฟีเจอร์หลัก

- Import และ Export ไฟล์ Excel ที่สามารถนำกลับมาใช้ร่วมกันได้
- ดูรายการข้อมูลเป็นตาราง
- ค้นหา (Search) หลายฟิลด์
- กรองข้อมูลตามแผนก สถานะ ช่วงวันที่ และช่วงเงินเดือน
- เรียงลำดับ (Sort)
- แบ่งหน้า (Pagination)
- เพิ่ม/แก้ไข/ลบ ข้อมูลผ่าน Modal
- เลือกสถานะเดิมหรือเพิ่มสถานะใหม่จาก Dropdown
- กำหนดเวลาอัปเดตล่าสุดจาก Server อัตโนมัติ
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

## เงื่อนไขการ Import และ Export

Export จะสร้างไฟล์ที่ใช้หัวคอลัมน์มาตรฐานดังนี้:

| ฟิลด์ในระบบ | หัวคอลัมน์มาตรฐาน | หัวคอลัมน์ภาษาไทยที่รองรับ |
| --- | --- | --- |
| รหัสพนักงาน | `ID` | `รหัสพนักงาน` |
| ชื่อ | `Name` | `ชื่อ` |
| แผนก | `Department` | `แผนก` |
| เงินเดือน | `Salary` | `เงินเดือน` |
| วันที่เข้าร่วม | `Join Date` | `วันที่เข้าร่วม` |
| สถานะ | `Status` | `สถานะ` |
| อัปเดตล่าสุด | `Last Updated Date` | `อัปเดตล่าสุด` |

ระบบรองรับวันที่จาก Excel หลายรูปแบบ:

- Excel serial number
- ISO 8601 เช่น `2026-09-02T12:34:56.000Z`
- วันที่ไทยแบบ พ.ศ. เช่น `15/1/2566` ซึ่งจะแปลงเป็น ค.ศ. อัตโนมัติ

ก่อนนำเข้าระบบจะตรวจสอบข้อมูลทุกแถวด้วย Mongoose หากพบข้อมูลไม่ถูกต้องจะยกเลิกโดยไม่ลบข้อมูลเดิม และแสดงข้อความจาก API ให้ผู้ใช้ทราบ

> **Import mode ปัจจุบันเป็น Replace:** เมื่อตรวจสอบไฟล์ผ่าน ระบบจะลบข้อมูลเดิมทั้งหมดและเพิ่มข้อมูลจากไฟล์ชุดใหม่ โดยยังไม่ได้ใช้ `employeeId` สำหรับ Upsert และยังไม่ได้กำหนด `employeeId` เป็น Unique Key

## เงื่อนไขสถานะและเวลาอัปเดต

- Dropdown สถานะดึงค่าที่ไม่ซ้ำจาก MongoDB
- ผู้ใช้เลือกสถานะเดิมหรือเลือก `+ เพิ่มสถานะใหม่` แล้วกรอกค่าใหม่ได้
- สถานะใหม่จะปรากฏใน Dropdown และตัวกรองหลังบันทึก
- รายการ Dropdown มีความกว้างเท่ากับช่องเลือก และเลื่อนดูได้เมื่อมีรายการจำนวนมาก
- เมื่อเพิ่มหรือแก้ไขข้อมูล API จะกำหนด `lastUpdatedDate` ด้วยเวลาปัจจุบันจาก Server เพื่อป้องกัน Client ส่งเวลาที่ไม่ถูกต้อง

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