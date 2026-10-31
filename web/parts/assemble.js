// Builds every inner page (body-only sources) from the shared chrome in index.html + about.html.
// Run: node parts/assemble.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const between = (s, a, b, incB = true) => {
  const i = s.indexOf(a); const j = s.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error('block not found: ' + a.slice(0, 40));
  return s.slice(i, incB ? j + b.length : j);
};
const swap = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); return s.split(a).join(b); };

const PAGES = [
  { file: 'designs.html', nav: 'designs', title: 'แบบบ้าน W House', skip: '#dlist', skipText: 'ข้ามไปยังรายการแบบบ้าน',
    desc: 'แบบบ้านหรู 34 แบบจาก W House · Modern · Tropical · Contemporary · Classic · Special Design',
    css: ['designs.css'], main: 'parts/designs-main.html', js: ['designs-data.js', 'designs.js'] },
  { file: 'projects.html', nav: 'projects', title: 'ผลงาน W House', skip: '#plist', skipText: 'ข้ามไปยังรายการผลงาน',
    desc: 'ผลงานสร้างบ้านของ W House 43 หลังที่แล้วเสร็จ และ 10 หลังที่กำลังก่อสร้าง ในกรุงเทพฯ เขาใหญ่ และชายทะเล',
    css: ['designs.css', 'pages.css'], main: 'parts/projects-main.html', js: ['projects-data.js', 'projects.js'] },
  { file: 'process.html', nav: 'process.html', title: 'ขั้นตอนการทำงาน W House', skip: '#steps7', skipText: 'ข้ามไปยังขั้นตอน',
    desc: '7 ขั้นตอนสร้างบ้านกับ W House ดูแลโดยทีมเดียว ตามมาตรฐาน ISO 9001:2015 พร้อมรับประกันโครงสร้าง 20 ปี',
    css: ['pages.css'], main: 'parts/process-main.html', js: ['process.js'] },
  { file: 'news.html', nav: 'news.html', title: 'ข่าวสาร W House', skip: '#nlist', skipText: 'ข้ามไปยังบทความ',
    desc: 'บทความ ข่าวสาร กิจกรรม และรีวิวจากลูกค้า W House',
    css: ['designs.css', 'pages.css'], main: 'parts/news-main.html', js: ['posts-data.js', 'news.js'] },
  { file: 'contact.html', nav: 'contact.html', title: 'ติดต่อ W House', skip: '#bookform', skipText: 'ข้ามไปยังแบบฟอร์มนัดหมาย',
    desc: 'นัดคุยกับสถาปนิก W House · โทร 093-555-0596 · LINE @151elccu · 65/6 ซอยรามอินทรา 14 กรุงเทพฯ',
    css: ['pages.css'], main: 'parts/contact-main.html', js: ['designs-data.js', 'contact.js'] }
];

const home = read('index.html'), about = read('about.html');
const headBase = home.slice(0, home.indexOf('<a class="skip"'));
const headerBase = between(home, '<header class="hd hm-hd"', '<div class="mm-scrim" id="mmScrim" hidden></div>')
  .replace(' aria-label="W House หน้าแรก" aria-current="page"', ' aria-label="W House หน้าแรก"');
const drawerBase = between(home, '<div class="drawer" id="drawer" hidden>', '\n\n<main', false)
  .replace('<a href="index.html" class="on">', '<a href="index.html">');
const footer = between(about, '<footer class="ft">', '</footer>');
const contact = between(home, '<dialog class="modal contact"', '<div class="toast" id="toast" role="status" aria-live="polite"></div>');

const only = process.argv[2];
for (const pg of PAGES) {
  if (only && pg.file !== only) continue;
  if (!fs.existsSync(path.join(root, pg.main))) { console.log('skip (no part yet):', pg.file); continue; }
  let head = headBase
    .replace('<title>W House</title>', `<title>${pg.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${pg.desc}">`)
    .replace('<link rel="stylesheet" href="site.css">', ['site.css', ...pg.css].map(c => `<link rel="stylesheet" href="${c}">`).join('\n'));
  let header = headerBase, drawer = drawerBase;
  if (pg.nav === 'designs' || pg.nav === 'projects') {
    header = swap(header, `class="mm-trigger" type="button" aria-expanded="false" aria-controls="mm-${pg.nav}"`, `class="mm-trigger is-current" type="button" aria-expanded="false" aria-controls="mm-${pg.nav}"`);
    drawer = swap(drawer, `<a href="${pg.nav}.html"><span>`, `<a href="${pg.nav}.html" class="on"><span>`);
  } else {
    header = swap(header, `<a href="${pg.nav}">`, `<a href="${pg.nav}" aria-current="page">`);
    drawer = swap(drawer, `<a href="${pg.nav}"><span>`, `<a href="${pg.nav}" class="on"><span>`);
  }
  const page = head
    + `<a class="skip" href="${pg.skip}">${pg.skipText}</a>\n\n`
    + header + '\n\n' + drawer + '\n\n'
    + read(pg.main) + '\n'
    + footer + '\n\n' + contact + '\n\n'
    + ['core.js', 'site.js', ...pg.js].map(s => `<script src="${s}"></script>`).join('\n') + '\n';
  fs.writeFileSync(path.join(root, pg.file), page);
  console.log('assembled', pg.file);
}
