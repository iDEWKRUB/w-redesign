# W House Redesign — Option D

Mockup เว็บไซต์ใหม่ของ [whouse.co.th](https://www.whouse.co.th/) (บริษัท ดับบลิว เฮ้าส์ จำกัด) โทนสีตามโลโก้ แดงไวน์ `#80192D` + ชาร์โคล `#2B2B2B`

- ดูออนไลน์: https://claude.ai/artifact/MrHauU2Jofq9YsEKzjcarN
- Figma: https://www.figma.com/design/IAvkeKfth0zhlBDsQbxm5t
- เด็คนำเสนอ: https://claude.ai/artifact/VkCnfJFiWgccrUe2vM8571 · Figma Slides: https://www.figma.com/slides/DRtEzx5NAqss3TU06YSiO3

## โครงสร้าง

```
site/          เว็บที่ใช้งานได้ทันที (เปิด site/index.html)
  index.html   หน้าเว็บทั้งระบบ (single page, hash routing)
  data.js      ข้อมูลแบบบ้าน ผลงาน บทความ (ดึงจาก WP REST API ของเว็บเดิม)
  img/         รูปภาพ
src/           ไฟล์ต้นฉบับสำหรับ build
  app.js       JavaScript ทั้งหมด (หน้า, router, slider, coverflow ฯลฯ)
  body2.html   header, เมนู, footer, lightbox, ช่องค้นหา
  extra2.css   CSS หลักของหน้าย่อย
  fix.css      CSS ปรับแต่งเพิ่มเติม
  sprite.svg   ไอคอน
  d-parts/     head + CSS พื้นฐาน
  assemble.js  รวมไฟล์ทั้งหมดเป็น site/index.html
deck/          สไลด์นำเสนอลูกค้า 12 หน้า (HTML + รูป)
tools/figma/   สคริปต์แปลงเว็บ/เด็คเป็นเลเยอร์ใน Figma
mockups/       ภาพ mockup สำหรับพรีเซนต์
```

## Build

```bash
node src/assemble.js
```

แก้ไฟล์ใน `src/` แล้วรันคำสั่งด้านบน จะได้ `site/index.html` ใหม่

## ดูในเครื่อง

```bash
npx serve site
```

หรือเปิด `site/index.html` ในเบราว์เซอร์ได้เลย

## หมายเหตุ

รูปภาพ ข้อมูลแบบบ้าน ผลงาน และบทความเป็นของ W House ใช้เพื่อนำเสนองานออกแบบเท่านั้น
