# Employee Data Dashboard

เว็บ Flask สำหรับอัปโหลดไฟล์ข้อมูลพนักงานและแสดงเป็นตาราง พร้อมค้นหาชื่อและกรองข้อมูลทุกหัวข้อ

## ฟีเจอร์
- อัปโหลด CSV / XLSX / XLS
- อ่านหัวตารางอัตโนมัติและสร้างตัวกรองทุกคอลัมน์
- ค้นหาด้วยคำในคอลัมน์ชื่อพนักงาน (ถ้าหาไม่พบจะค้นหาทุกคอลัมน์)
- Pagination และเลือกจำนวนแถวต่อหน้า
- Dashboard สรุปจำนวนพนักงาน / จำนวนคอลัมน์ / จำนวนผลลัพธ์
- รองรับการ deploy บน Vercel

## รันบนเครื่อง

```bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

เปิด `http://127.0.0.1:5000`

## Deploy บน Vercel
1. Push โฟลเดอร์นี้ขึ้น GitHub
2. Import repository ใน Vercel
3. Vercel จะอ่าน `vercel.json` และติดตั้ง dependencies จาก `requirements.txt`

> หมายเหตุ: เวอร์ชันนี้ประมวลผลข้อมูลใน request และไม่ได้เก็บข้อมูลถาวร หากต้องการระบบฐานข้อมูลจริง ควรเพิ่ม PostgreSQL/Supabase หรือฐานข้อมูลอื่นก่อนใช้งานจริง
