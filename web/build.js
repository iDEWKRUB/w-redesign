// สร้าง dist/ = เว็บพร้อมใช้งานจริง (ไฟล์ .html ต้นฉบับเป็นแบบ body-only สำหรับ Artifact)
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const page of ['index.html', 'about.html', 'designs.html', 'projects.html', 'process.html', 'news.html', 'contact.html']) {
  const body = fs.readFileSync(path.join(__dirname, page), 'utf8');
  const head = body.slice(0, body.indexOf('<svg width="0"'));
  const rest = body.slice(head.length);
  fs.writeFileSync(path.join(out, page),
    `<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}</head>\n<body>\n${rest}</body>\n</html>\n`);
}
for (const f of ['styles.css', 'scrollfx.css', 'site.css', 'designs.css', 'pages.css', 'core.js', 'app.js', 'site.js', 'designs.js', 'designs-data.js', 'projects.js', 'projects-data.js', 'process.js', 'news.js', 'posts-data.js', 'contact.js']) fs.copyFileSync(path.join(__dirname, f), path.join(out, f));
fs.cpSync(path.join(__dirname, 'img'), path.join(out, 'img'), { recursive: true });
fs.cpSync(path.join(__dirname, 'media'), path.join(out, 'media'), { recursive: true });
console.log('built dist/ (7 pages)');
