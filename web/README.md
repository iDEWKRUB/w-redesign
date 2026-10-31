# W House — Website (7 หน้า)

หน้า "เกี่ยวกับเรา" ของ W House แบบเล่าเรื่อง อ้างอิงโครงจาก https://unity2000tour.com/about-us/
ใช้ตัวอักษร **H·O·U·S·E** เป็น 5 บท (เหมือน U·N·I·T·Y ของเว็บอ้างอิง)

| บท | หัวข้อ | เนื้อหา |
|---|---|---|
| H | HERITAGE · เส้นทางของเรา | ไทม์ไลน์ 2000 → 2010 → 2014 → 2024 → 2026 |
| O | OUR PROMISE · คำมั่นของเรา | วิสัยทัศน์ พันธกิจ 4 Core Values |
| U | UNIQUE · ตัวตนของเรา | “บริษัทรับสร้างบ้านหรู อันดับ 1” + 7 ขั้นตอน |
| S | SPECIALISTS · ทีมของเรา | ผู้บริหาร 2 ท่าน (popup) + ทีมสถาปนิก/วิศวกร/ก่อสร้าง |
| E | EXCELLENCE · ทำไมต้องเรา | ตัวเลข การรับประกัน DESIGN/BUILD/CARE ทำเล |

- ดูออนไลน์: https://claude.ai/artifact/Gpf4qyNUESFn1eFSfeVVe2
- พื้นหลัง hero = ภาพผลงานจริง 6 มุม ซูมช้า (Ken Burns) เปลี่ยนทุก 7 วิ — ถ้าได้ไฟล์วิดีโอโดรนจริงค่อยเปลี่ยนเป็น <video>
- CI: แดง #9E2A2F, แดงเลือดหมู #441D20 (จากนามบัตร) · ฟอนต์ไทย FC Vision (ใส่ไฟล์ใน fonts/ แล้วเพิ่ม url() ใน @font-face) · อังกฤษ Geist
- ข้อมูลทั้งหมดมาจาก whouse.co.th (ไม่มีตัวเลขสมมติ) — รูปผู้บริหารยังเป็นตัวอักษรแทน รอรูปจริง

## ไฟล์
```
index.html   หน้าแรก: ภาพผลงานหลายมุม + mega menu + ช่องทางติดต่อ (body-only)
about.html   หน้าเกี่ยวกับเรา H·O·U·S·E (body-only)
designs.html หน้าแบบบ้าน 34 แบบ (ข้อมูลจริงใน designs-data.js) + วิดีโอ Timeless White จริง
projects.html ผลงาน 43 หลัง + กำลังก่อสร้าง 10 (projects-data.js)
process.html  7 ขั้นตอน (ค้างจอเปลี่ยนทีละขั้น) + รับประกัน + FAQ
news.html     ข่าวสาร/บทความ 27 เรื่อง (posts-data.js) + หน้าต่างอ่าน
contact.html  ฟอร์มนัดหมาย (ตัวอย่าง ยังไม่ส่งข้อมูลจริง) + ช่องทางติดต่อ
parts/       ชิ้นส่วนหน้าภายใน → node parts/assemble.js ประกอบ designs/projects/process/news/contact
site.css / site.js  header + mega menu + กล่องติดต่อ ใช้ร่วมกันทุกหน้า
core.js      อินโทร W (เล่นครั้งแรกของการเข้าชมเท่านั้น)
styles.css   สไตล์หลัก (CI: แดง #9E2A2F + เลือดหมู #441D20)
scrollfx.css ลูกเล่นตามการเลื่อน (pin, scrub, stack, reveal) — อ่านค่า --p จาก app.js
app.js       header, แถบ H·O·U·S·E, เมนูมือถือ, popup ทีม, สไลด์ขั้นตอน, นับเลข
img/         รูปจากเว็บ W House
build.js     สร้าง dist/ (HTML เต็มรูปแบบ พร้อมขึ้นโฮสต์)
```

## Build / ดูในเครื่อง
```bash
node build.js        # ได้ dist/index.html
npx serve dist
```
