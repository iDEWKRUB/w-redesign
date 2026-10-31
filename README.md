# W House Redesign

เว็บไซต์ใหม่ของ [whouse.co.th](https://www.whouse.co.th/) (บริษัท ดับบลิว เฮ้าส์ จำกัด) โทนสีตาม CI แดง `#9E2A2F` + แดงเลือดหมู `#441D20`

- ดูออนไลน์ (Vercel): https://w-redesign.vercel.app
- Artifact: https://claude.ai/artifact/Gpf4qyNUESFn1eFSfeVVe2
- Figma: https://www.figma.com/design/IAvkeKfth0zhlBDsQbxm5t
- เด็คนำเสนอ: https://claude.ai/artifact/VkCnfJFiWgccrUe2vM8571 · Figma Slides: https://www.figma.com/slides/DRtEzx5NAqss3TU06YSiO3

## หน้าเว็บ (7 หน้า)

| หน้า | ไฟล์ | จุดเด่น |
|---|---|---|
| หน้าแรก | `index.html` | อินโทรตัว W, ภาพแบบบ้านหรูเต็มจอ, mega menu, ช่องทางติดต่อ |
| เกี่ยวกับเรา | `about.html` | เรื่องราว H·O·U·S·E, ไทม์ไลน์, ลูกเล่นตามการเลื่อนแบบ Apple |
| แบบบ้าน | `designs.html` | 34 แบบจริง, กรองตามสไตล์, กดหัวใจ + เปรียบเทียบ |
| ผลงาน | `projects.html` | สร้างเสร็จ 43 หลัง + กำลังก่อสร้าง 10 หลัง |
| ขั้นตอนการทำงาน | `process.html` | 7 ขั้นตอน, การรับประกัน, FAQ |
| ข่าวสาร | `news.html` | บทความ 27 เรื่อง พร้อมหน้าต่างอ่าน |
| ติดต่อเรา | `contact.html` | ฟอร์มนัดหมาย (ตัวอย่าง ยังไม่ส่งข้อมูลจริง) |

## โครงสร้าง

```
site/       เว็บที่ deploy (Vercel ใช้โฟลเดอร์นี้) — สร้างจาก web/ ห้ามแก้ตรงนี้
web/        ไฟล์ต้นฉบับของเว็บใหม่ (ดู web/README.md)
build-site.js  build web/ → site/
archive/option-d/  เว็บเวอร์ชันก่อนหน้า (Option D) เก็บไว้อ้างอิง
deck/       สไลด์นำเสนอลูกค้า
tools/      สคริปต์แปลงเว็บ/เด็คเป็นเลเยอร์ใน Figma
mockups/    ภาพ mockup
```

## Build

```bash
node build-site.js
```

แก้ไฟล์ใน `web/` แล้วรันคำสั่งด้านบน จะได้ `site/` ใหม่ แล้ว commit + push เพื่อให้ Vercel deploy

## หมายเหตุ

- รูปภาพ ข้อมูลแบบบ้าน ผลงาน และบทความเป็นของ W House ใช้เพื่อนำเสนองานออกแบบเท่านั้น
- เว็บตั้ง noindex + robots.txt ไว้ ไม่ให้ search engine เก็บ
