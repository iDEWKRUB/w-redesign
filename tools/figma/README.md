# Figma tooling

สคริปต์ที่ใช้แปลงเว็บและเด็คเป็นเลเยอร์ใน Figma (render ด้วย Chrome → JSON layer tree → สคริปต์ `use_figma`)

```bash
cd tools/figma && npm install   # puppeteer-core ใช้ Chrome ที่ติดตั้งในเครื่อง
```

| ไฟล์ | หน้าที่ |
|---|---|
| `dom2fig.js` | ฟังก์ชัน `extract()` อ่าน DOM ที่ render แล้วเป็น layer tree (ข้อความ สี เงา รูป ไอคอน) |
| `site/pack.js` · `site/render.js` · `site/up.js` | ประกอบหน้าเว็บ 19 หน้าเข้าไฟล์ Figma Design, อัปโหลดรูปได้ imageHash |
| `slides/slides2fig.js` | render สไลด์จาก `deck/` ทีละหน้า → `slides/out/<id>.json` + ภาพตัวอย่าง |
| `slides/pack.js` | `node pack.js <ids> <slideIdMap>` สร้างสคริปต์จาก `render.tpl.js` (map รูป→hash, ใส่ speaker notes) |
| `slides/up.js` | อัปโหลดรูปผ่าน URL ของ `upload_assets` → `hashes.json` |
| `slides/brk.json` | ตำแหน่งตัดบรรทัดภาษาไทยตาม Chrome (Figma ตัดคำไทยไม่เหมือนเบราว์เซอร์) |
| `slides/qr.json` | QR code ของ w-redesign.vercel.app เป็นแถวของช่อง |
| `slides/w2j.js` · `slides/shot.js` | แปลง webp→jpg, ถ่ายภาพหน้าเพื่อตรวจ |

Figma files:
- Design (19 หน้า + Design System + Handoff): https://www.figma.com/design/IAvkeKfth0zhlBDsQbxm5t
- Slides: https://www.figma.com/slides/DRtEzx5NAqss3TU06YSiO3
