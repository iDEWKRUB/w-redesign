// Turn data.json (scraped from whouse.co.th) into a compact data.js for the mockup
const fs = require('fs');
const d = require('./data.json');
const num = (s) => { const m = String(s || '').replace(/,/g, '').match(/[\d.]+/); return m ? Math.round(parseFloat(m[0])) : null; };
const clean = (s) => String(s || '').replace(/&#8230;/g, '…').replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;|&#8221;/g, '"').replace(/&#[0-9]+;/g, '').replace(/\s+/g, ' ').trim();

// ---- house designs
const NAMES = { 'timeless-white-modern-luxury': 'Timeless White', 'shine-on': 'Shine On', 'the-space-modern-luxury': 'The Space', 'the-forest-s023-modern-tropical': 'The Forest' };
const MM = { s019: 'The Moon', 's021-2': 'The Flame', s020: 'The Wind', s022: 'The Ocean', 'the-forest-s023-modern-tropical': 'The Forest', s024: 'The Sun' };
const styleOf = (x) => {
  const s = new Set();
  if (x.cats.includes('modern-style')) s.add('modern');
  if (x.cats.includes('tropical-style')) s.add('tropical');
  if (x.cats.includes('contemporary-style')) s.add('contemporary');
  if (x.cats.includes('villa-style')) s.add('villa');
  if (x.cats.includes('special-design')) s.add('special');
  if (/^tc/.test(x.slug) || x.slug === 'w02') s.add('classic');
  if (x.slug === 'w01' || x.slug === 'w03') s.add('modern');
  return [...s];
};
const designs = d.designs.map(x => {
  const concept = clean(x.concept).replace(/^แนวความคิดในการออกแบบ\s*/, '').replace(/^"[^"]+"\s*/, '');
  return {
    slug: x.slug, key: x.key, has2: x.has2, code: x.code.toUpperCase().replace('TIMELESS WHITE', 'TIMELESS WHITE'),
    name: NAMES[x.slug] || MM[x.slug] || '', st: styleOf(x), popular: x.cats.includes('popular-style'),
    concept: /timeless|shine|space/.test(x.slug) ? 'alife' : (MM[x.slug] ? 'mim' : ''),
    sub: x.style || '', area: num(x.spec['พื้นที่']), dim: clean(x.spec['สัดส่วน'] || '').replace(/^กว้าง\s*/, ''),
    bed: num(x.spec['ห้องนอน']), bath: num(x.spec['ห้องน้ำ']), park: num(x.spec['ที่จอดรถ']), text: concept
  };
});

// ---- completed projects (43, real titles + covers)
const RICH = [
  ['Creston Hills', 'creston'], ['นวธานี', 'navathanee'], ['| รามคำแหง', 'ramkhamhaeng'], ['ทองสถิตย์', 'thongsathit'], ['Miracles V', 'miracles'],
  ['โครงการบ้านพักอาศัย 3 ชั้น', 'talingchan', true], ['บางนา-ตราด', 'bangna'], ['ทวีวัฒนา', 'thawi'], ['วิภาวดี 58', 'vibha']
];
const projects = d.projects.map(p => {
  const t = clean(p.title);
  const r = RICH.find(([k, , exact]) => exact ? t === k : t.includes(k));
  const parts = t.split('|').map(s => s.trim());
  let name = parts.length > 1 ? parts[1] : t.replace(/^โครงการ/, '');
  let type = /ตากอากาศ/.test(t) ? 'บ้านพักตากอากาศ' : /SHOWROOM|สำนักงาน|CLUB HOUSE/i.test(t) ? 'อาคาร / งานพิเศษ' : 'บ้านพักอาศัย';
  const fl = (t.match(/(\d)\s*ชั้น/) || [])[1];
  const area = /เขาใหญ่|มวกเหล็ก|VINEYARD|สตาร์ฮิลล์/i.test(t) ? 'khaoyai' : /เพชรบุรี|เจ้าสำราญ|บ้านทะเล/.test(t) ? 'coast' : 'bkk';
  return { id: p.id, rich: r ? r[1] : null, t, name: clean(name), type, fl: fl ? +fl : null, area, key: p.key };
});
const ongoing = d.ongoing.map(o => ({ id: o.id, t: clean(o.title).replace(/^อัปเดต(ผลงานก่อสร้าง|ความคืบหน้า)\s*(โครงการ)?\s*/, ''), date: o.date.slice(0, 10), key: o.key }));
const posts = {};
const CAT = { 'w-blog': 'blog', 'w-news': 'news', 'w-events': 'event', 'w-reviews': 'reviews' };
for (const [k, arr] of Object.entries(d.posts)) posts[CAT[k]] = arr.map(p => ({ id: p.id, t: clean(p.title), date: p.date, ex: clean(p.excerpt).replace(/\[…\]|\[&hellip;\]/g, '…'), paras: p.paras.map(clean).filter(x => !/^(แชร์|Share|Tags?)/i.test(x)), key: p.key }));

for (const x of designs) if (x.slug === 'w01' || x.slug === 'w02') x.has2 = false;
const designsF = designs.filter(x => x.slug !== 'w03'); designs.length = 0; designs.push(...designsF);
const out = `window.WH=${JSON.stringify({ designs, projects, ongoing, posts })};`;
fs.writeFileSync('../v2/data.js', out);
console.log('data.js', (out.length / 1024).toFixed(0) + 'KB', 'designs', designs.length, 'rich', projects.filter(p => p.rich).map(p => p.rich).join(','));
console.log(designs.map(x => x.code + ':' + x.st.join('/') + (x.concept ? '[' + x.concept + ']' : '') + (x.name ? '(' + x.name + ')' : '')).join(' '));
