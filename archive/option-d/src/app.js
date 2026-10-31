/* W House · full-system mockup (option D). Data in data.js comes from whouse.co.th (designs, projects, posts). */
const W = window.WH;
const u = id => `<svg class="ico"><use href="#i-${id}"/></svg>`;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isX = k => /^(a|p|o|d|mm)-|^yt/.test(k);
const SRC = (k, sz) => isX(k) ? `img/x/${sz === 's' ? 's/' : ''}${k}.jpg` : `img/${sz === 's' ? 's/' : 'm/'}${k}.jpg`;
const img = (k, alt, sizes, eager) => `<img src="${SRC(k, 'm')}" srcset="${SRC(k, 's')} 560w, ${SRC(k, 'm')} 1100w" sizes="${sizes || '(max-width:700px) 100vw, 33vw'}" alt="${esc(alt)}"${eager ? '' : ' loading="lazy"'}>`;
const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thDate = s => { const d = new Date(s); return `${d.getDate()} ${TH_M[d.getMonth()]} ${d.getFullYear() + 543}`; };
const fmt = n => n == null ? '—' : n.toLocaleString('en-US');
const crumbs = (...a) => `<div class="crumbs"><a href="#home">หน้าแรก</a>${a.map(x => `<i></i>${Array.isArray(x) ? `<a href="${x[1]}">${esc(x[0])}</a>` : `<span>${esc(x)}</span>`}`).join('')}</div>`;
const PHBG = { 'W House Style': 'render', 'Reviews': '10', 'News & Event': '02', 'Blog': '03', 'News': '18', 'Event': '20', 'Work Process': '17', 'About Us': '05', 'Get in Touch': '09', 'Saved': '13' };
const phImg = k => isX(k) ? SRC(k, 'm') : (/^s-/.test(k) ? `img/${k}.webp` : SRC(k, 'm'));
const phead = (cr, eb, h1, lead, extra, bg) => { bg = bg || PHBG[eb]; return `<div class="phead${bg ? ' pimg' : ''}">${bg ? `<img class="phbg" src="${phImg(bg)}" alt="" aria-hidden="true" fetchpriority="high">` : ''}<div class="wrap">${cr}${eb ? `<span class="eyebrow">${eb}</span>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra || ''}</div></div>`; };
const head = (eb, h2, link, label) => `<div class="head"><div><span class="eyebrow">${eb}</span><h2>${h2}</h2></div>${link ? `<a class="more" href="${link}">${label || 'ดูทั้งหมด'} ${u('arr')}</a>` : ''}</div>`;

const STY = {
  modern: { n: 'Modern', th: 'โมเดิร์น', img: 's-modern', d: 'เส้นสายเรียบ หลังคาแบน ผนังกระจกบานใหญ่ เน้นพื้นที่โล่งและแสงธรรมชาติ' },
  tropical: { n: 'Tropical', th: 'ทรอปิคอล', img: 's-tropical-2', d: 'ชายคายื่นยาว ช่องลมเยอะ เปิดบ้านออกสู่สวนและสระว่ายน้ำ เหมาะกับแดดและฝนเมืองไทย' },
  contemporary: { n: 'Contemporary', th: 'ร่วมสมัย', img: 's-contemporary-2', d: 'ผสมวัสดุสมัยใหม่กับรูปทรงที่มีเอกลักษณ์ ฟังก์ชันออกแบบตามโจทย์ของแต่ละครอบครัว' },
  classic: { n: 'Classic', th: 'คลาสสิก · ทัสคานี', img: 's-classic-2', d: 'สัดส่วนสมมาตร ซุ้มโค้ง ผนังสตัคโค และโทนเอิร์ธโทน กลิ่นอายบ้านชนบทอิตาลี' },
  villa: { n: 'Villa', th: 'วิลล่า', img: 's-villa-style-2', d: 'บ้านขนาดใหญ่พร้อมเฉลียงและสระว่ายน้ำ สำหรับครอบครัวที่ต้องการพื้นที่พักผ่อนเต็มรูปแบบ' },
  special: { n: 'Special Design', th: 'ออกแบบพิเศษ', img: 'd-the-forest-s023-modern-tropical', d: 'คฤหาสน์ขนาด 1,000 ตร.ม. ขึ้นไป ออกแบบเฉพาะโจทย์ รวมถึงคอลเลกชัน More Is More' }
};
const RICH = {
  creston: { t: 'The Creston Hills', loc: 'เขาใหญ่ นครราชสีมา', sn: 'Modern Tropical', a: 535, bed: 3, bath: 4, fl: 2, yr: 2026, gal: ['03', '01', '02', 'pcreston-air', '04', '05', '06', '07'], d: ['บ้านพักตากอากาศริมทะเลสาบที่หันหน้ารับวิวภูเขา ทุกห้องหลักเปิดออกสู่สวนและสระว่ายน้ำ', 'ทางเดินในสวนเปิดรับทิวทัศน์เขาใหญ่ สระว่ายน้ำและสวนเชื่อมพื้นที่พักผ่อนกับธรรมชาติ'], f: ['สระว่ายน้ำส่วนตัวหันรับวิวภูเขา', 'ผนังกระจกสูงสองชั้นในโถงนั่งเล่น', 'ทางเดินสวนรอบทะเลสาบ', 'ชายคายื่นยาวกันแดดและฝน'] },
  navathanee: { t: 'บ้านพักอาศัย หมู่บ้านนวธานี', loc: 'กรุงเทพฯ', sn: 'Modern Contemporary', a: 1380, bed: 5, bath: 7, fl: 2, yr: 2026, gal: ['18', '19', '20'], d: ['บ้านหลังใหญ่สำหรับครอบครัว พร้อมสนามบาสส่วนตัวและสวนกว้าง'], f: ['สนามบาสเกตบอลส่วนตัว', 'สวนกว้างรอบบ้าน', 'ประตูรั้วออกแบบเฉพาะ'] },
  ramkhamhaeng: { t: 'บ้านพักอาศัย รามคำแหง', loc: 'รามคำแหง กรุงเทพฯ', sn: 'Modern Contemporary', a: 710, bed: 4, bath: 5, fl: 2, gal: ['17', '12', '13', '14', '15', '16'], d: ['หน้าจั่วสีขาวตัดงานไม้ พร้อมโรงจอดรถในตัว เหมาะกับที่ดินในเมือง'], f: ['โรงจอดรถในตัว', 'หน้าจั่วสูงพร้อมกระจกรับแสง', 'ประตูไม้ระแนงออกแบบเฉพาะ'] },
  thongsathit: { t: 'ทองสถิตย์ ฮิลล์', loc: 'เขาใหญ่ นครราชสีมา', sn: 'Modern Tropical', a: 540, bed: 4, bath: 6, fl: 2, gal: ['10', '11', '09'], d: ['“บ้านต้นไม้” บ้านพักตากอากาศใกล้ชิดธรรมชาติ ผนังกระจกรอบด้าน นั่งเล่นอยู่กลางต้นไม้'], f: ['ผนังกระจกมุมห้อง', 'ห้องนอนรับวิวสองด้าน', 'เทอเรซกึ่งเอาท์ดอร์'] },
  miracles: { t: 'Miracles V', loc: 'เขาใหญ่ นครราชสีมา', sn: 'Modern Tropical', fl: 2, gal: ['22'] },
  talingchan: { t: 'บ้านพักอาศัย 3 ชั้น', loc: 'กรุงเทพฯ', sn: 'Modern', fl: 3, gal: ['p3story'] },
  bangna: { t: 'บ้านพักอาศัย 2 ชั้น บางนา-ตราด', loc: 'บางนา-ตราด', sn: 'Classic', fl: 2, gal: ['21'] },
  thawi: { t: 'บ้านพักอาศัย 2 ชั้น ทวีวัฒนา', loc: 'ทวีวัฒนา กรุงเทพฯ', sn: 'Contemporary', fl: 2, gal: ['pthawi'] },
  vibha: { t: 'บ้านพักอาศัย 3 ชั้น วิภาวดี 58', loc: 'วิภาวดี 58 กรุงเทพฯ', sn: 'Modern', fl: 3, gal: ['pvibha'] }
};
const PJ = W.projects.map(p => { const r = p.rich ? RICH[p.rich] : null; return { ...p, R: r, title: r ? r.t : p.name, cover: r ? r.gal[0] : p.key, gal: r ? r.gal : [p.key], loc: r ? r.loc : '', fl: r ? r.fl : p.fl }; });
const pj = id => PJ.find(p => String(p.id) === String(id));
const DS = W.designs;
const ds = slug => DS.find(d => d.slug === slug);
const POSTS = Object.entries(W.posts).flatMap(([c, a]) => a.map(p => ({ ...p, cat: c })));
const post = id => POSTS.find(p => String(p.id) === String(id));
const CATN = { blog: 'Blog', news: 'News', event: 'Event', reviews: 'Review' };
const MIM = [['mm-1', 's019'], ['mm-2', 's021-2'], ['mm-3', 's020'], ['mm-4', 's022'], ['mm-5', 'the-forest-s023-modern-tropical'], ['mm-6', 's024']];
const YT = 'https://www.youtube.com/watch?v=wO6SwWoxeu8';

/* ---------- saved ---------- */
let saved = []; try { saved = JSON.parse(localStorage.getItem('wh-saved2') || '[]'); } catch (e) { }
const isSaved = k => saved.includes(k);
const syncSaved = () => { try { localStorage.setItem('wh-saved2', JSON.stringify(saved)); } catch (e) { } document.querySelectorAll('.savedn').forEach(e => { e.textContent = saved.length; e.dataset.n = saved.length; }); document.querySelectorAll('.savedn2').forEach(e => e.textContent = saved.length); };
const heart = k => `<button class="heart${isSaved(k) ? ' on' : ''}" data-heart="${k}" aria-label="บันทึก" aria-pressed="${isSaved(k)}">${u('heart')}</button>`;

/* ---------- cards ---------- */
const stName = k => STY[k] ? STY[k].n : k;
function planCard(d) {
  const st = d.st.filter(s => s !== 'special' || d.st.length === 1).slice(0, 1).map(stName)[0] || '';
  const title = d.name ? `${d.code} · ${d.name}` : d.code;
  return `<article class="card plan2" data-plan="${d.slug}" tabindex="0" aria-label="แบบบ้าน ${esc(title)}">
  <div class="ph">${img(d.key, 'แบบบ้าน ' + d.code, '(max-width:700px) 100vw, 380px')}<span class="yr">แบบ ${esc(d.code)}</span>${heart('d:' + d.slug)}</div>
  <div class="bd"><div class="chips"><span class="chip g">${esc(st)}</span>${d.concept === 'alife' ? '<span class="chip">A Life of Style</span>' : d.concept === 'mim' ? '<span class="chip">More Is More</span>' : d.popular ? '<span class="chip">ยอดนิยม</span>' : ''}</div>
  <h3>${esc(title)}</h3><span class="loc">${u('style')}${esc(d.sub || 'แบบบ้าน' + STY[d.st[0]].th)}</span>
  <div class="specs">${d.bed ? `<span title="ห้องนอน">${u('bed')}${d.bed} ห้องนอน</span>` : ''}${d.bath ? `<span title="ห้องน้ำ">${u('bath')}${d.bath} ห้องน้ำ</span>` : ''}${d.park ? `<span title="ที่จอดรถ">${u('car')}${d.park} คัน</span>` : ''}</div>
  <div class="area"><small>พื้นที่ใช้สอย</small><b>${d.area ? fmt(d.area) + ' ตร.ม.' : '—'}</b></div></div></article>`;
}
function projCard(p) {
  const R = p.R;
  return `<article class="card" data-proj="${p.id}" tabindex="0" aria-label="${esc(p.title)}">
  <div class="ph">${img(p.cover, p.title, '(max-width:700px) 100vw, 390px')}${R && R.yr ? `<span class="yr">แล้วเสร็จ ${R.yr}</span>` : ''}${heart('p:' + p.id)}</div>
  <div class="bd"><div class="chips">${R ? `<span class="chip g">${esc(R.sn)}</span>` : ''}<span class="chip">${esc(p.type)}</span></div>
  <h3>${esc(p.title)}</h3>${p.loc ? `<span class="loc">${u('pin')}${esc(p.loc)}</span>` : ''}
  <div class="specs">${R && R.bed ? `<span>${u('bed')}${R.bed} ห้องนอน</span><span>${u('bath')}${R.bath} ห้องน้ำ</span>` : ''}${p.fl ? `<span>${u('home')}${p.fl} ชั้น</span>` : ''}</div>
  ${R && R.a ? `<div class="area"><small>พื้นที่ใช้สอย</small><b>${fmt(R.a)} ตร.ม.</b></div>` : `<div class="area"><small>ดูภาพผลงาน</small><b style="font-size:15px">${u('arr')}</b></div>`}</div></article>`;
}
function postCard(p, big) {
  return `<article class="post${big ? ' big' : ''}" data-post="${p.id}" tabindex="0" aria-label="${esc(p.t)}"><div class="ph">${img(p.key, p.t, big ? '(max-width:900px) 100vw, 55vw' : '(max-width:700px) 100vw, 380px')}</div>
  <div style="display:grid;gap:10px"><div class="meta"><span class="chip g">${CATN[p.cat]}</span>${thDate(p.date)}</div><h3>${esc(p.t)}</h3><p>${esc(p.ex)}</p></div></article>`;
}


/* ---------- hero slider ---------- */
const HERO = () => {
  const cr = PJ.find(p => p.rich === 'creston').id, mv = PJ.find(p => p.rich === 'miracles').id;
  return [
    { img: 'img/x/hero-orig.webp', s: 'img/x/s/hero-orig.webp', eb: 'Signature Residence', h: 'Homes That <em>Define</em> You', th: 'บ้านที่ออกแบบจากชีวิตของคุณ', p: 'ประสบการณ์กว่า 26 ปีในการออกแบบและสร้างบ้านหรู ทีมเดียวดูแลตั้งแต่ภาพร่างแรกจนถึงวันรับกุญแจ', tag: 'W House · Luxury Modern Design', href: '#design', c1: ['ดูแบบบ้าน', '#design'], c2: ['ดูผลงานที่สร้างแล้ว', '#projects'] },
    { img: 'img/01.webp', s: 'img/x/s/hero-01.webp', eb: 'ISO 9001:2015', h: 'Built to <em>Last</em>', th: 'มาตรฐาน ISO · รับประกัน 20 ปี', p: 'ก่อสร้างตามแผนงานและตรวจบ้านร่วมกับวิศวกรผู้ดูแลของบริษัททุกขั้นตอน แบ่งชำระตามผลงานจริง', tag: 'ผลงาน · The Creston Hills เขาใหญ่', href: '#project-' + cr, c1: ['ขั้นตอนการทำงาน', '#process'], c2: ['ดูแบบบ้านทั้งหมด', '#design'] },
    { img: 'img/x/hero-timeless.webp', s: 'img/x/s/hero-timeless.webp', eb: 'New Collection · A Life of Style', h: 'Timeless <em>White</em>', th: 'Modern Luxury · 660 ตร.ม.', p: '3 ห้องนอน · 4 ห้องน้ำ · 3 ที่จอดรถ จากคอนเซปต์ A Life of Style นิยามแห่งสถาปัตยกรรมที่สะท้อนตัวตน', tag: 'แบบบ้าน · Timeless White', href: '#plan-timeless-white-modern-luxury', c1: ['ดูแบบบ้านนี้', '#plan-timeless-white-modern-luxury'], c2: ['ดูคอลเลกชัน', '#a-life-of-style'] }
  ];
};
const heroCopy = (x) => `<span class="eyebrow">${x.eb}</span><h1>${x.h}<span class="th">${x.th}</span></h1><p>${x.p}</p><div class="hero-cta"><a class="btn dark" href="${x.c1[1]}">${x.c1[0]} ${u('arr')}</a><a class="btn line" href="${x.c2[1]}">${x.c2[0]}</a></div>`;
function heroHTML() {
  const H = HERO();
  return `<section class="hero" id="hero" style="padding:0" aria-roledescription="carousel" aria-label="ภาพผลงานเด่น">
  <div class="hero-img" id="himg">${H.map((x, i) => `<img class="hs${i ? '' : ' on'}" src="${x.img}" srcset="${x.s} 900w, ${x.img} 1920w" sizes="100vw" alt="${esc(x.tag)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('')}</div>
  <a class="hero-tag" id="htag" href="${H[0].href}"><i></i><span>${H[0].tag}</span></a>
  <div class="wrap"><div class="hero-copy" id="hcopy" aria-live="polite">${heroCopy(H[0])}</div></div>
  <button class="harr l" data-hstep="-1" aria-label="สไลด์ก่อนหน้า">${u('arl')}</button><button class="harr r" data-hstep="1" aria-label="สไลด์ถัดไป">${u('arr')}</button>
  <div class="hdots" role="tablist" aria-label="เลือกสไลด์">${H.map((_, i) => `<button data-hs="${i}" class="${i ? '' : 'on'}" role="tab" aria-label="สไลด์ ${i + 1}"></button>`).join('')}</div></section>`;
}
const HS = { i: 0, t: null, paused: false };
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function heroGo(n) {
  const hero = document.getElementById('hero'); if (!hero) return;
  const H = HERO(); HS.i = (n + H.length) % H.length; const x = H[HS.i];
  hero.querySelectorAll('.hs').forEach((im, j) => { if (j === HS.i) im.loading = 'eager'; im.classList.toggle('on', j === HS.i); });
  const c = document.getElementById('hcopy'); c.classList.add('fade');
  setTimeout(() => { c.innerHTML = heroCopy(x); numFont(c); c.classList.remove('fade'); }, 280);
  const tg = document.getElementById('htag'); tg.href = x.href; tg.querySelector('span').textContent = x.tag;
  hero.querySelectorAll('[data-hs]').forEach((b, j) => { b.classList.remove('on'); b.setAttribute('aria-selected', j === HS.i); if (j === HS.i) { void b.offsetWidth; b.classList.add('on'); } });
  heroTimer();
}
/* autoplay every 6s; pauses on hover/focus, restarts after a manual change */
function heroTimer() { clearTimeout(HS.t); if (reduceMotion || HS.paused) return; HS.t = setTimeout(() => { if (document.getElementById('hero') && current === 'home') heroGo(HS.i + 1); }, 5000); }
function bindHero() {
  const hero = document.getElementById('hero'); if (!hero) return;
  HS.i = 0; HS.paused = false; heroTimer();
  const pause = (p) => { HS.paused = p; hero.classList.toggle('paused', p); heroTimer(); };
  hero.addEventListener('mouseenter', () => pause(true)); hero.addEventListener('mouseleave', () => pause(false));
  hero.addEventListener('focusin', () => pause(true)); hero.addEventListener('focusout', () => pause(false));
  let x0 = null; const im = document.getElementById('himg');
  im.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  im.addEventListener('touchend', e => { if (x0 === null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) heroGo(HS.i + (d < 0 ? 1 : -1)); x0 = null; }, { passive: true });
}


/* ---------- style coverflow (home) ---------- */
const FL = { i: 0 };
function styleFlow() {
  const keys = Object.keys(STY);
  const cards = keys.map((k, i) => {
    const s = STY[k]; const list = DS.filter(d => d.st.includes(k)); const ar = list.map(d => d.area).filter(Boolean);
    const range = ar.length ? `${fmt(Math.min(...ar))}–${fmt(Math.max(...ar))}` : '';
    return `<article class="fcard" data-sfi="${i}" aria-label="สไตล์ ${s.n}"><img src="${isX(s.img) ? SRC(s.img, 'm') : 'img/' + s.img + '.webp'}" alt="${esc('บ้านสไตล์' + s.th)}" decoding="async"${i < 3 ? '' : ' loading="lazy"'}>
    <span class="fnum">${String(i + 1).padStart(2, '0')}/${String(keys.length).padStart(2, '0')}</span>
    <div class="fbody"><span class="fth">สไตล์${s.th}</span><h3>${s.n}</h3><div class="fmeta"><span>${u('home')}<b class="n">${list.length}</b> แบบบ้าน</span>${range ? `<span>${u('area')}<b class="n">${range}</b> ตร.ม.</span>` : ''}</div>
    <div class="fcta"><a class="btn white" href="#design-${k}">ดูแบบบ้านสไตล์นี้ ${u('arr')}</a><a class="fround" href="#contact" aria-label="ปรึกษาสไตล์ ${s.n}">${u('chat')}</a></div></div></article>`;
  }).join('');
  return `<section class="sflow"><div class="wrap">
   <div class="sfhead2"><span class="eyebrow">House Styles</span><h2 class="sftitle">เลือก<em>สไตล์</em>บ้านที่ใช่</h2>
    <p class="sflead"><b class="n">${DS.length}</b> แบบบ้านจริงจาก W House ใน 6 สไตล์<br>ปรับผังให้เข้ากับที่ดินและการใช้ชีวิตของคุณได้ทุกแบบ</p>
    <div class="sfpills">${keys.map((k, i) => `<button class="sfpill${i ? '' : ' on'}" data-sfi="${i}">${STY[k].n}</button>`).join('')}</div>
    </div>
   <div class="fstage" id="fstage">${cards}</div>
   <div class="fnav"><button data-sfstep="-1" aria-label="สไตล์ก่อนหน้า">${u('arl')}</button><div class="fdots">${keys.map((_, i) => `<i data-sfi="${i}"></i>`).join('')}</div><button data-sfstep="1" aria-label="สไตล์ถัดไป">${u('arr')}</button></div>
   <div class="sfall"><a class="more" href="#design">ดูแบบบ้านทั้งหมด ${u('arr')}</a></div>
  </div></section>`;
}
function flowLayout() {
  const st = document.getElementById('fstage'); if (!st) return;
  const cards = [...st.querySelectorAll('.fcard')]; const n = cards.length; const mob = window.innerWidth < 760;
  cards.forEach((c, j) => {
    let o = j - FL.i; if (o > n / 2) o -= n; if (o < -n / 2) o += n;
    const a = Math.abs(o);
    const x = mob ? o * 64 : (a === 0 ? 0 : Math.sign(o) * (a === 1 ? 330 : 580));
    const sc = a === 0 ? 1 : a === 1 ? (mob ? .84 : .8) : .64;
    c.style.transform = mob ? `translateX(calc(-50% + ${x}vw)) scale(${sc})` : `translateX(calc(-50% + ${x}px)) scale(${sc})`;
    c.style.zIndex = 10 - a; c.style.opacity = a > (mob ? 1 : 2) ? 0 : 1; c.style.pointerEvents = a > (mob ? 1 : 2) ? 'none' : '';
    c.classList.toggle('on', a === 0); c.setAttribute('aria-hidden', a !== 0);
    c.querySelectorAll('a').forEach(l => l.tabIndex = a === 0 ? 0 : -1);
  });
  document.querySelectorAll('.sfpill').forEach((b, j) => b.classList.toggle('on', j === FL.i));
  document.querySelectorAll('.fdots i').forEach((d, j) => d.classList.toggle('on', j === FL.i));
}
function flowGo(i) { const n = Object.keys(STY).length; FL.i = (i + n) % n; flowLayout(); }
function bindFlow() {
  FL.i = 0; flowLayout();
  const st = document.getElementById('fstage'); if (!st) return;
  let x0 = null;
  st.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  st.addEventListener('touchend', e => { if (x0 === null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) flowGo(FL.i + (d < 0 ? 1 : -1)); x0 = null; }, { passive: true });
}
window.addEventListener('resize', () => { if (current === 'home') flowLayout(); });


/* ---------- review + inline video (home) ---------- */
const cleanT = t => t.replace(/^(W HOUSE\s*)?สัมภาษณ์(ลูกค้า|ความประทับใจ)\s*/i, '').replace(/^W House We Family\s*:\s*/i, '').replace(/\s*\|.*$/, '').replace(/"\s*([^"]+?)\s*"/g, '“$1”').replace(/^เสียงจริง\s*/, '').trim();
function videoPlayer(cap) {
  return `<figure class="vplayer"><div class="vbox"><video id="tw-video" playsinline preload="metadata" poster="img/x/timeless-poster.jpg" aria-label="วิดีโอ Timeless White"><source src="img/x/timeless-teaser.mp4" type="video/mp4"></video>
  <button class="vplay" data-vplay aria-label="เล่นวิดีโอ"><span>${u('play')}</span><em>เล่นวิดีโอ</em></button><span class="vbadge">A Life of Style</span></div>
  <figcaption><div><b>Timeless White</b><span>Modern Luxury · 660 ตร.ม. · 3 ห้องนอน · 4 ห้องน้ำ</span></div><a class="more" href="${YT}" target="_blank" rel="noopener">${cap || 'ดูคลิปเต็มบน YouTube'} ${u('arr')}</a></figcaption></figure>`;
}
const YTCH = 'https://www.youtube.com/@whouseonline';
const MIMV = { 'The Wind': 'kPwZTpXdD4g', 'The Moon': 'UNw1tB41Rqo', 'The Sun': 'TpLtskOY_Bo', 'The Flame': 'S5bV_T6F-J0', 'The Ocean': 'YgH2a8uq66k', 'The Forest': 'YCsnYbfq98Q' };
const ytCard = (id, t, meta, cls) => `<button type="button" class="ytc ${cls || ''}" data-yt="${id}" data-ytt="${esc(t)}" aria-label="เล่นวิดีโอ ${esc(t)}"><span class="th"><img src="img/yt/${id}.webp" alt="" loading="lazy"><span class="pl">${u('play')}</span></span><span class="tt"><b>${esc(t)}</b>${meta ? `<small>${esc(meta)}</small>` : ''}</span></button>`;
function ytSection() {
  const side = [['UNw1tB41Rqo', 'THE MOON · คฤหาสน์ 3 ชั้น เหนือกาลเวลา', 'More Is More · ดู 1 แสนครั้ง'], ['y_4jjIH2x2I', 'More is More · พื้นที่แห่งความสุขที่ไร้ขีดจำกัด', 'ดู 2.3 หมื่นครั้ง'], ['_Swt6ngnSXc', "DESIGN YOUR FUTURE ที่งานสถาปนิก'68", 'ดู 1.4 หมื่นครั้ง'], ['zs7FAUn34X4', 'รีโนเวทบ้านเก่า vs ทุบสร้างใหม่ แบบไหนคุ้มกว่า?', 'ดู 6.3 พันครั้ง']];
  return `<section class="ytv"><div class="wrap">
   <div class="ytvh"><div><span class="eyebrow">W House Channel</span><h2>ชมบ้านจริง<em>ผ่านวิดีโอ</em></h2><p>เดินชมคฤหาสน์ ผลงานจริง และเกร็ดความรู้การสร้างบ้าน จากช่อง YouTube ของ W House</p></div>
    <div class="ytvs"><span class="cnt"><b class="n">356</b>คลิปบนช่อง</span><a class="btn gold" href="${YTCH}?sub_confirmation=1" target="_blank" rel="noopener">${u('play')}Subscribe</a></div></div>
   <div class="ytvg">${ytCard('kPwZTpXdD4g', 'THE WIND · คฤหาสน์ Super Luxury Modern สูง 4 ชั้น', 'More Is More · ดู 4 แสนครั้ง', 'big')}
    <div class="ytvside">${side.map(([id, t, m]) => ytCard(id, t, m, 'sm')).join('')}</div></div>
   <div class="ytvf"><a class="more" href="${YTCH}/videos" target="_blank" rel="noopener">ดูวิดีโอทั้งหมดบน YouTube ${u('arr')}</a></div>
  </div></section>`;
}
function reviewVideo() {
  const r = W.posts.reviews; const main = POSTS.find(x => x.id === r[2].id); const others = [r[1], r[0], r[3]].map(p => POSTS.find(x => x.id === p.id));
  return `<section class="rvsec"><div class="wrap rvgrid">
   <div class="rvq"><span class="qmark" aria-hidden="true">“</span><span class="eyebrow">เสียงจากเจ้าของบ้าน</span>
    <h2>“บ้านต้นไม้” บ้านพักตากอากาศ<br>ใจกลางเขาใหญ่</h2>
    <div class="rvchips"><span>Modern · 2 ชั้น</span><span class="n">490 ตร.ม.</span><span>3 ห้องนอน · 4 ห้องน้ำ</span></div>
    <p>${esc(main.ex)}</p>
    <div class="rvbtn"><a class="btn dark" href="#article-${main.id}">อ่านบทสัมภาษณ์ ${u('arr')}</a><a class="more" href="#reviews">รีวิวทั้งหมด 19 เรื่อง ${u('arr')}</a></div>
    <div class="rvlist"><span class="lbl">รีวิวอื่น ๆ</span>${others.map(p => `<a href="#article-${p.id}"><img src="${SRC(p.key, 's')}" alt="" loading="lazy"><span><b>${esc(cleanT(p.t))}</b><small>${thDate(p.date)}</small></span>${u('arr')}</a>`).join('')}</div>
   </div>
   <div class="rvv">${ytCard('uvE02SHj2Ks', 'สัมภาษณ์ลูกค้า · ผ่าน 25 ปี บ้านยังมั่นคง', 'เสียงจริงจากเจ้าของบ้าน · ดู 5.9 พันครั้ง', 'rv')}</div></div></section>`;
}

/* ---------- project rail (home) ---------- */
/* reusable card carousel: rail(id, cardsHTML, unit) + arrows, dots and counter */
const rail = (id, html, unit) => `<div class="rail"><button class="nav-btn l" data-rail="-1" data-rt="${id}" aria-label="ก่อนหน้า">${u('arl')}</button><div class="cards rtrack" id="${id}" data-unit="${unit}">${html}</div><button class="nav-btn r" data-rail="1" data-rt="${id}" aria-label="ถัดไป">${u('arr')}</button></div>
   <div class="rpager"><div class="rdots" id="${id}-dots" role="tablist" aria-label="หน้า${unit}"></div><span class="rcnt" id="${id}-cnt"></span></div>`;
function railGeom(id) {
  const c = document.getElementById(id); if (!c) return null;
  const cards = c.children; const n = cards.length; const w = cards[0] ? cards[0].getBoundingClientRect().width : 300; const step = w + 20;
  const vis = Math.max(1, Math.round((c.clientWidth + 20) / step)); const pages = Math.ceil(n / vis); const max = c.scrollWidth - c.clientWidth;
  return { c, n, step, vis, pages, max };
}
function railState(id) {
  if (typeof id !== 'string') { document.querySelectorAll('.rtrack').forEach(t => railState(t.id)); return; }
  const g = railGeom(id); if (!g) return; const { c, n, step, vis, pages, max } = g;
  document.querySelectorAll(`[data-rt="${id}"]`).forEach(b => { const off = +b.dataset.rail < 0 ? c.scrollLeft <= 2 : c.scrollLeft >= max - 2; b.classList.toggle('off', off); b.disabled = off; });
  const first = c.scrollLeft >= max - 2 ? Math.max(0, n - vis) : Math.round(c.scrollLeft / step);
  const page = c.scrollLeft >= max - 2 ? pages - 1 : Math.min(pages - 1, Math.floor((first + vis / 2) / vis));
  const dots = document.getElementById(id + '-dots');
  if (dots && dots.children.length !== pages) dots.innerHTML = Array.from({ length: pages }, (_, i) => `<button data-rpage="${i}" data-rt="${id}" role="tab" aria-label="หน้า ${i + 1} จาก ${pages}"></button>`).join('');
  if (dots) [...dots.children].forEach((d, i) => { d.classList.toggle('on', i === page); d.setAttribute('aria-selected', i === page); });
  const cnt = document.getElementById(id + '-cnt'); if (cnt) cnt.innerHTML = `แสดง <b class="n">${first + 1}–${Math.min(n, first + vis)}</b> จาก <b class="n">${n}</b> ${c.dataset.unit}`;
}
function railPage(id, p) { const g = railGeom(id); if (!g) return; g.c.scrollTo({ left: Math.min(g.max, p * g.vis * g.step), behavior: 'smooth' }); }
function railStep(id, d) { const g = railGeom(id); if (!g) return; g.c.scrollBy({ left: d * g.step, behavior: 'smooth' }); }
function bindRail() { document.querySelectorAll('.rtrack').forEach(t => { t.addEventListener('scroll', () => railState(t.id), { passive: true }); railState(t.id); }); }
window.addEventListener('resize', () => railState());

/* ---------- pages ---------- */
const V = {};
V.home = () => {
  const four = ['creston', 'navathanee', 'ramkhamhaeng', 'thongsathit', 'miracles', 'vibha', 'talingchan', 'bangna', 'thawi'].map(r => PJ.find(p => p.rich === r));
  const rv = W.posts.reviews[2];
  const latest = [W.posts.blog[0], W.posts.news[0], W.posts.event[0]].map(p => POSTS.find(x => x.id === p.id));
  return `${heroHTML()}
  <div class="wrap planner"><form class="pbox" id="planner" aria-label="วางแผนบ้านของคุณ">
   <div class="fld">${u('pin')}<div style="min-width:0;flex:1"><label for="f-loc">ทำเลที่ดิน</label><select id="f-loc"><option>กรุงเทพฯ และปริมณฑล</option><option>เขาใหญ่ / ปากช่อง</option><option>ต่างจังหวัดอื่น ๆ</option><option>ยังไม่มีที่ดิน</option></select></div></div>
   <div class="fld">${u('style')}<div style="min-width:0;flex:1"><label for="f-style">สไตล์บ้าน</label><select id="f-style"><option value="">ทุกสไตล์</option>${Object.entries(STY).map(([k, s]) => `<option value="${k}">${s.n}</option>`).join('')}</select></div></div>
   <div class="fld">${u('bed')}<div style="min-width:0;flex:1"><label for="f-bed">ห้องนอน</label><select id="f-bed"><option value="">ไม่ระบุ</option><option value="3">3 ห้องนอน</option><option value="4">4 ห้องนอน</option><option value="5">5 ห้องนอนขึ้นไป</option></select></div></div>
   <div class="fld">${u('area')}<div style="min-width:0;flex:1"><label for="f-size">พื้นที่ใช้สอย</label><select id="f-size"><option value="">ไม่ระบุ</option><option value="s">ไม่เกิน 500 ตร.ม.</option><option value="m">500 – 800 ตร.ม.</option><option value="l">800 ตร.ม. ขึ้นไป</option></select></div></div>
   <button class="btn gold" type="submit">ค้นหาแบบบ้าน ${u('arr')}</button>
   <div class="ptrust" aria-label="มาตรฐาน W House"><span><i class="pti">${u('award')}</i><em><b><span class="n">26</span> ปี</b><small>ประสบการณ์บ้านหรู</small></em></span><span><i class="pti">${u('check')}</i><em><b>ISO <span class="n">9001:2015</span></b><small>มาตรฐานคุณภาพ</small></em></span><span><i class="pti">${u('shield')}</i><em><b>รับประกัน <span class="n">20</span> ปี</b><small>โครงสร้างบ้าน</small></em></span><span><i class="pti">${u('coin')}</i><em><b>จ่ายตามงานจริง</b><small>แบ่งงวดตามผลงาน</small></em></span></div></form></div>
  <section><div class="wrap">${head('Signature Residences', 'ผลงานบ้านที่เราภูมิใจ', '#projects', 'ดูผลงานทั้งหมด')}
   ${rail('cards', four.map(projCard).join(''), 'ผลงาน')}</div></section>
  ${styleFlow()}
  <section><div class="wrap">${head('W House Concept', 'คอลเลกชันแบบบ้านพิเศษ')}${conceptBanners()}</div></section>
  ${ytSection()}
  <section class="ab2"><div class="wrap ab2in">
   <div class="ab2ph">${img('05', 'The Creston Hills เขาใหญ่', '(max-width:900px) 100vw, 48vw')}
    <div class="ab2badge"><b class="n">26</b><span>ปีแห่งการสร้าง<br>บ้านหรู</span></div>
    <div class="ab2cap">${u('pin')}The Creston Hills เขาใหญ่</div></div>
   <div class="ab2tx"><span class="eyebrow">About W House</span>
    <h2>บริษัทรับสร้างบ้านหรู<br>มาตรฐานสูง <em>ตั้งแต่ปี <span class="n">2543</span></em></h2>
    <p class="ab2lead">รังสรรค์บ้านหรูที่โดดเด่นร่วมสมัยและบ่งบอกสไตล์ของผู้อยู่อาศัย ครบครันด้วยคุณภาพและนวัตกรรม ทีมเดียวดูแลตั้งแต่ภาพร่างแรกจนถึงวันรับกุญแจ</p>
    <div class="ab2why">
     <a href="#process">${u('pen')}<span><b>ออกแบบใหม่ หรือปรับจากแบบ</b><small>เริ่มจากความต้องการและงบประมาณ</small></span></a>
     <a href="#process">${u('pin')}<span><b>ช่วยหาที่ดิน</b><small>ตรวจสอบที่ดินและคำนวณค่าก่อสร้าง</small></span></a>
     <a href="#process">${u('helmet')}<span><b>ตรวจร่วมกับวิศวกร</b><small>ตามระบบ ISO 9001:2015</small></span></a>
     <a href="#about">${u('team')}<span><b>ทีมเดียวดูแลครบ</b><small>ตั้งแต่ภาพร่างแรกจนถึงวันรับกุญแจ</small></span></a></div>
    <div class="ab2cta"><a class="btn gold" href="#about">รู้จัก W House ${u('arr')}</a><a class="more" href="#contact">นัดคุยสถาปนิก ${u('arr')}</a></div>
   </div></div></section>
  <section class="st3"><div class="wrap st3in">
   <div class="st3h"><span class="eyebrow">Work Process</span>
    <h2><span class="n">7</span> ขั้นตอน<br><em>สู่บ้านในฝัน</em></h2>
    <p>ทีมเดียวดูแลครบ ตั้งแต่คุยความต้องการจนถึงตรวจรับบ้าน แบ่งชำระตามผลงานจริง</p>
    <a class="more" href="#process">ดูรายละเอียดทุกขั้นตอน ${u('arr')}</a></div>
   <ol class="st3g">${STEPS.map(([t, b, ic], i) => `<li><a href="#process"><span class="top"><span class="no n">${String(i + 1).padStart(2, '0')}</span>${u(ic)}</span><b>${t}</b><small>${b[0]}</small></a></li>`).join('')}<li class="st3go"><a href="#contact"><span class="top">${u('cal')}</span><b>เริ่มขั้นตอนแรก</b><small>นัดคุยสถาปนิกฟรี</small></a></li></ol>
  </div></section>
  ${reviewVideo()}
  <section style="padding-bottom:88px"><div class="wrap">${head('News & Event', 'ข่าวสารและบทความล่าสุด', '#news-event')}<div class="grid3">${latest.map(p => postCard(p)).join('')}</div></div></section>`;
};
function conceptBanners() {
  const mim = MIM.map(([, s]) => ds(s)).filter(Boolean), al = DS.filter(d => d.concept === 'alife');
  const rng = l => { const a = l.map(d => d.area).filter(Boolean); return a.length ? `${fmt(Math.min(...a))}–${fmt(Math.max(...a))} ตร.ม.` : ''; };
  const thumbs = l => `<div class="cthumbs">${l.map(d => `<a href="#plan-${d.slug}" title="${esc((d.name || d.code) + ' · ' + fmt(d.area) + ' ตร.ม.')}"><img src="${SRC(d.key, 's')}" alt="${esc(d.name || d.code)}" loading="lazy"><span>${esc(d.name || d.code)}</span></a>`).join('')}</div>`;
  return `<div class="concepts2">
  <article class="ccard dark"><a class="cimg" href="#more-is-more" aria-label="More Is More">${img('d-s019', 'More Is More · The Moon', '(max-width:900px) 100vw, 50vw')}<span class="cno">01</span></a>
   <div class="cbody"><span class="k">W House Concept</span><h3>More Is More</h3><p>คฤหาสน์ Super Luxury ที่งดงามที่สุดเมื่อไร้ขีดจำกัด 6 หลัง 6 แรงบันดาลใจ ตั้งแต่ดวงจันทร์จนถึงผืนป่า</p>
   ${thumbs(mim)}<div class="cfoot"><span class="cmeta"><b class="n">${mim.length}</b> คฤหาสน์ · <span class="n">${rng(mim)}</span></span><a class="btn" href="#more-is-more">ดูคอลเลกชัน ${u('arr')}</a></div></div></article>
  <article class="ccard light"><a class="cimg" href="#a-life-of-style" aria-label="A Life of Style">${'<img src="img/x/hero-timeless.webp" srcset="img/x/s/hero-timeless.webp 900w, img/x/hero-timeless.webp 1920w" sizes="(max-width:900px) 100vw, 50vw" alt="A Life of Style · Timeless White" loading="lazy">'}<span class="cno">02</span></a>
   <div class="cbody"><span class="k">W House Concept</span><h3>A Life of Style</h3><p>“ทุกสถานที่ มีเรื่องราว” แบบบ้านคอลเลกชันใหม่ที่สะท้อนตัวตนของผู้อยู่อาศัย พร้อมวิดีโอนำชม</p>
   ${thumbs(al)}<div class="cfoot"><span class="cmeta"><b class="n">${al.length}</b> แบบบ้าน · <span class="n">${rng(al)}</span></span><a class="btn" href="#a-life-of-style">ดูคอลเลกชัน ${u('arr')}</a></div></div></article></div>`;
}
V.design = () => {
  const cnt = k => DS.filter(d => d.st.includes(k)).length;
  return phead(crumbs('แบบบ้าน'), 'W House Style', 'แบบบ้าน<em>ของเรา</em>', 'เลือกจากแบบบ้านมาตรฐานแล้วปรับให้เข้ากับที่ดินและการใช้ชีวิต หรือให้สถาปนิกออกแบบใหม่ทั้งหลัง', `<div class="phstats"><span><b class="n">${DS.length}</b>แบบบ้าน</span><span><b class="n">6</b>สไตล์</span><span><b>${u('pen')}</b>ปรับผังได้ทุกแบบ</span></div><nav class="phchips" aria-label="สไตล์บ้าน">${Object.entries(STY).map(([k, s]) => `<a href="#design-${k}">${s.n}</a>`).join('')}</nav>`)
    + `<div class="wrap sec2"><div class="shub">${Object.entries(STY).map(([k, s]) => `<a class="scard" href="#design-${k}">${img(s.img, s.n, '(max-width:700px) 100vw, 33vw')}<em>${cnt(k)} แบบ</em><span class="cap"><b>${s.n}</b><p>${s.d}</p></span></a>`).join('')}</div></div>
    <div class="wrap" style="padding-bottom:20px">${head('W House Concept', 'คอลเลกชันพิเศษ')}${conceptBanners()}</div>
    <section class="wrap" style="padding-block:72px 88px">${head('Popular Designs', 'แบบบ้านยอดนิยม')}<div class="grid3">${DS.filter(d => d.popular).slice(0, 6).map(planCard).join('')}</div></section>`;
};
const SF = { bed: '', size: '', sort: 'new' };
V.style = (k) => {
  const s = STY[k];
  return phead(crumbs(['แบบบ้าน', '#design'], s.n), 'House Style', `${s.n} <em>${s.th}</em>`, s.d, '', s.img)
    + `<div class="wrap sec tight"><nav class="stabs" aria-label="สไตล์">${Object.entries(STY).map(([kk, ss]) => `<a href="#design-${kk}" class="${kk === k ? 'on' : ''}">${ss.n}</a>`).join('')}</nav>
    <div class="ftool"><div class="grp"><span class="lbl">ห้องนอน</span>${[['', 'ทั้งหมด'], ['3', '3'], ['4', '4'], ['5', '5+']].map(([v, l]) => `<button class="fchip${SF.bed === v ? ' on' : ''}" data-sf="bed" data-v="${v}">${l}</button>`).join('')}</div>
    <div class="grp"><span class="lbl">พื้นที่</span>${[['', 'ทั้งหมด'], ['s', '< 500'], ['m', '500–800'], ['l', '800+']].map(([v, l]) => `<button class="fchip${SF.size === v ? ' on' : ''}" data-sf="size" data-v="${v}">${l}</button>`).join('')}</div>
    <div class="tsel" style="margin-left:auto"><select id="sf-sort" aria-label="เรียงลำดับ"><option value="new">แนะนำ</option><option value="small">พื้นที่น้อย → มาก</option><option value="big">พื้นที่มาก → น้อย</option></select></div></div>
    <p class="rcount" id="sfcount"></p><div class="grid3" id="sfgrid"></div></div>`;
};
function renderStyleGrid(k) {
  let list = DS.filter(d => d.st.includes(k));
  if (SF.bed) list = list.filter(d => SF.bed === '5' ? d.bed >= 5 : d.bed === +SF.bed);
  if (SF.size) list = list.filter(d => d.area && (SF.size === 's' ? d.area < 500 : SF.size === 'm' ? d.area >= 500 && d.area <= 800 : d.area > 800));
  if (SF.sort !== 'new') list = [...list].sort((a, b) => ((a.area || 0) - (b.area || 0)) * (SF.sort === 'big' ? -1 : 1));
  document.getElementById('sfcount').innerHTML = `พบ <b>${list.length}</b> แบบ${SF.bed || SF.size ? ' <button data-sfclear>ล้างตัวกรอง</button>' : ''}`;
  const g = document.getElementById('sfgrid'); g.style.display = list.length ? '' : 'block';
  g.innerHTML = list.length ? list.map(planCard).join('') : `<div class="empty">${u('search')}<b>ไม่มีแบบที่ตรงกับตัวกรอง</b><p>ลองเปลี่ยนจำนวนห้องนอนหรือพื้นที่</p><button class="btn dark" data-sfclear>ล้างตัวกรอง</button></div>`;
  const ss = document.getElementById('sf-sort'); if (ss) ss.value = SF.sort;
}
V.plan = (slug) => {
  const d = ds(slug); if (!d) return null;
  const gal = d.has2 ? [d.key, d.key + '-2'] : [d.key];
  const st = d.st.map(stName);
  const rel = DS.filter(x => x.slug !== d.slug && x.st.some(s => d.st.includes(s))).slice(0, 3);
  CUR.caps = null; CUR.gal = gal; CUR.title = d.code;
  return `<div class="wrap" style="padding-block:28px 88px">${crumbs(['แบบบ้าน', '#design'], [stName(d.st[0]), '#design-' + d.st[0]], d.code)}
  <div class="gal ${gal.length === 1 ? 'one' : 'two'}" style="margin-top:18px">${gal.map((k, i) => `<button data-lb="${i}" aria-label="ดูภาพที่ ${i + 1}">${img(k, d.code + ' ภาพที่ ' + (i + 1), i ? '35vw' : '(max-width:700px) 100vw, 62vw', !i)}</button>`).join('')}</div>
  <div class="dlay"><div>
   <div class="chips">${st.map(s => `<span class="chip g">${esc(s)}</span>`).join('')}${d.popular ? '<span class="chip">แบบยอดนิยม</span>' : ''}${d.concept === 'alife' ? '<span class="chip">A Life of Style</span>' : ''}${d.concept === 'mim' ? '<span class="chip">More Is More</span>' : ''}</div>
   <h1>${esc(d.code)}${d.name ? ` · <em style="font-style:italic;color:var(--gold)">${esc(d.name)}</em>` : ''}</h1>${d.sub ? `<span class="loc" style="font-size:14.5px">สไตล์ ${esc(d.sub)}</span>` : ''}
   <div class="speclist"><div>${u('area')}<b>${fmt(d.area)}</b><small>ตร.ม. พื้นที่ใช้สอย</small></div><div>${u('ruler')}<b style="font-size:15px">${esc(d.dim || '—')}</b><small>สัดส่วนที่ดิน</small></div><div>${u('bed')}<b>${d.bed ?? '—'}</b><small>ห้องนอน</small></div><div>${u('bath')}<b>${d.bath ?? '—'}</b><small>ห้องน้ำ</small></div><div>${u('car')}<b>${d.park ?? '—'}</b><small>ที่จอดรถ</small></div></div>
   <div class="conceptbox"><span class="k">Conceptual Design · แนวความคิดในการออกแบบ</span><p>${esc(d.text)}</p></div>
   <div class="dtext" style="margin-top:28px"><h2 style="margin-top:0">ปรับแบบนี้ให้เป็นบ้านของคุณ</h2><ul class="feat"><li>${u('check')}<span>ปรับผังและจำนวนห้องตามสมาชิกในบ้าน</span></li><li>${u('check')}<span>ปรับสัดส่วนให้เข้ากับขนาดที่ดิน</span></li><li>${u('check')}<span>เลือกวัสดุและโทนสีภายนอก-ภายใน</span></li><li>${u('check')}<span>คำนวณระยะเวลาและค่าก่อสร้างให้ก่อนเซ็นสัญญา</span></li></ul></div>
  </div><aside class="side-card"><div class="area"><small>พื้นที่ใช้สอย</small><b>${fmt(d.area)} ตร.ม.</b></div>
   <dl class="facts"><dt>รหัสแบบ</dt><dd>${esc(d.code)}</dd><dt>สไตล์</dt><dd>${esc(st.join(', '))}</dd><dt>ห้องนอน / ห้องน้ำ</dt><dd>${d.bed ?? '—'} / ${d.bath ?? '—'}</dd><dt>ที่จอดรถ</dt><dd>${d.park ?? '—'} คัน</dd></dl><hr>
   <a class="btn gold" href="#contact" data-about="d:${d.slug}">${u('cal')}นัดคุยเรื่องแบบนี้</a>
   <button class="btn line" data-heart="d:${d.slug}" aria-pressed="${isSaved('d:' + d.slug)}" style="justify-content:center">${u('heart')}<span>${isSaved('d:' + d.slug) ? 'บันทึกแล้ว' : 'บันทึกแบบนี้'}</span></button>
   <button class="btn line" data-toast="ตัวอย่าง: ระบบจะส่งแบบแปลนทางอีเมลหลังกรอกชื่อและเบอร์โทร" style="justify-content:center">${u('area')}ขอแบบแปลน (PDF)</button>
   <p class="note-s">ข้อมูลแบบ ภาพ และแนวคิดอ้างอิงจากหน้า ${esc(d.code)} บน whouse.co.th</p></aside></div>
  <div class="related">${head('Similar Designs', 'แบบบ้านที่ใกล้เคียง', '#design-' + d.st[0])}<div class="grid3">${rel.map(planCard).join('')}</div></div></div>`;
};
V.mim = () => {
  return `<div class="hero2"><img src="img/x/d-s019.jpg" alt="" aria-hidden="true"><div class="in wrap">${crumbs(['แบบบ้าน', '#design'], 'More Is More').replace('class="crumbs"', 'class="crumbs" style="color:#9AA3BA"')}<span class="eyebrow" style="color:var(--gold2)">W House Concept</span><h1>MORE <span class="gold">IS</span> MORE</h1><p>เพราะพื้นที่แห่งความสุข งดงามที่สุด เมื่อไร้ขีดจำกัด<br>ทุกสัดส่วน Super Luxury เริ่มต้น 1,000 ตร.ม.</p><a class="btn gold" href="#mimlist" data-scroll="mimlist" style="background:var(--gold2);color:var(--night)">ชม 6 คฤหาสน์ ${u('arr')}</a></div></div>
  <div class="wrap mimlist" id="mimlist">${MIM.map(([im, slug]) => { const d = ds(slug); return `<article class="mimrow"><div class="mi">${img(d.key, d.name, "(max-width:900px) 100vw, 60vw")}</div><div class="tx"><span class="eyebrow" style="color:var(--gold2)">${esc(d.code)}</span><h3>${esc((d.name || '').toUpperCase())}</h3><div class="sp"><span><b>${fmt(d.area)}</b> ตร.ม.</span><span><b>${d.bed}</b> ห้องนอน</span><span><b>${d.bath}</b> ห้องน้ำ</span><span><b>${d.park}</b> ที่จอดรถ</span></div><p>${esc(d.text)}</p><div class="mimbtn"><a class="btn" href="#plan-${d.slug}">ดูรายละเอียดแบบ ${u('arr')}</a>${MIMV[d.name] ? `<button type="button" class="ytbtn" data-yt="${MIMV[d.name]}" data-ytt="${esc(d.name)} · More Is More">${u('play')}ดูวิดีโอ</button>` : ''}</div></div></article>`; }).join('')}</div>`;
};
V.alife = () => {
  const ds3 = DS.filter(d => d.concept === 'alife');
  return `<div class="wrap">${crumbs(['แบบบ้าน', '#design'], 'A Life of Style')}<div class="als-hero"><span class="eyebrow">W House Concept</span><div class="logo2">A Life <small style="font-size:.45em">of</small><b>Style</b></div><blockquote>“ทุกสถานที่ มีเรื่องราว”</blockquote><p class="lead2">นิยามแห่งสถาปัตยกรรมเพื่อการอยู่อาศัย ที่สะท้อนตัวตนอย่างเหนือระดับ แบบบ้านคอลเลกชันใหม่ของ W House</p></div>
  ${ytCard('wO6SwWoxeu8', 'Timeless White · Modern Luxury 660 ตร.ม.', 'A Life of Style · วิดีโอนำชมบ้าน', 'big al')}
  <section style="padding-block:64px 88px">${head('The Collection', '3 แบบบ้านในคอนเซปต์')}<div class="grid3">${ds3.map(planCard).join('')}</div></section></div>`;
};
const PF = { tab: 'done', type: 'all', area: 'all', fl: 'all', sort: 'new', q: '', mode: 'grid', shown: 9 };
V.projects = (tab) => {
  PF.tab = tab;
  const cr = PJ.find(p => p.rich === 'creston');
  return `<section class="cp-hero" style="padding:0"><div class="wrap cp-in"><div class="cp-copy">${crumbs('ผลงาน', tab === 'done' ? 'Completed Projects' : 'Ongoing Projects')}
   <span class="eyebrow">${tab === 'done' ? 'Completed Projects' : 'Ongoing Projects'}</span><h1>${tab === 'done' ? 'ผลงานสร้างบ้าน<br><em>ที่แล้วเสร็จ</em>' : 'บ้านที่<br><em>กำลังก่อสร้าง</em>'}</h1>
   <p class="lead">${tab === 'done' ? 'บ้านที่ W House ออกแบบและก่อสร้างจนส่งมอบให้เจ้าของแล้ว ทั้งบ้านพักอาศัยในกรุงเทพฯ บ้านพักตากอากาศ และอาคารพิเศษ' : 'อัปเดตความคืบหน้าจากหน้างานจริง ตรวจตามระบบ ISO 9001:2015 ร่วมกับวิศวกรผู้ดูแลของบริษัท'}</p>
   <div class="cp-tabs" role="tablist" aria-label="สถานะโครงการ"><a role="tab" href="#projects" class="${tab === 'done' ? 'on' : ''}" aria-selected="${tab === 'done'}">แล้วเสร็จ</a><a role="tab" href="#ongoing" class="${tab === 'ongoing' ? 'on' : ''}" aria-selected="${tab === 'ongoing'}">กำลังก่อสร้าง</a></div></div>
   <div class="cp-mosaic" aria-hidden="true"><img class="a" src="img/m/pcreston-air.jpg" alt=""><img class="b" src="img/s/22.jpg" alt=""><img class="c" src="img/s/pvibha.jpg" alt=""></div></div></section>`
    + (tab === 'ongoing' ? `<div class="wrap sec2"><div class="grid3">${W.ongoing.map((o, oi) => `<article class="card" data-og="${oi}" tabindex="0" role="button" aria-label="ดูภาพ ${esc(o.t)}"><div class="ph">${img(o.key, o.t, '(max-width:700px) 100vw, 390px')}</div><div class="bd"><span class="upd"><i></i>อัปเดตล่าสุด ${thDate(o.date)}</span><h3>${esc(o.t)}</h3><span class="chip" style="justify-self:start">กำลังก่อสร้าง</span><span class="oglink">ดูภาพความคืบหน้า ${u('arr')}</span></div></article>`).join('')}</div><p class="note-s" style="margin-top:24px">รายการและภาพจากหมวด “โครงการที่กำลังดำเนินการก่อสร้าง” บนเว็บจริง (10 โครงการ)</p></div>`
      : `<div class="wrap"><a class="feat-card" href="#project-${cr.id}"><div class="fimg">${img('03', 'The Creston Hills', '(max-width:900px) 100vw, 60vw')}<span class="flag">ผลงานล่าสุด</span></div><div class="ftx"><div class="chips"><span class="chip g">Modern Tropical</span><span class="chip">บ้านพักตากอากาศ 2 ชั้น</span></div><h2>The Creston Hills</h2><span class="loc">เขาใหญ่ นครราชสีมา</span><p>บ้านพักตากอากาศท่ามกลางวิวภูเขาและผืนน้ำ ทุกห้องหลักเปิดออกสู่สวนและสระว่ายน้ำ</p><div class="fspec"><div><b>535</b><small>ตร.ม.</small></div><div><b>3</b><small>ห้องนอน</small></div><div><b>4</b><small>ห้องน้ำ</small></div><div><b>2026</b><small>แล้วเสร็จ</small></div></div><span class="btn dark">ดูรายละเอียดโครงการ ${u('arr')}</span></div></a></div>
   <div class="toolbar-wrap" id="cp-grid"><div class="wrap toolbar"><label class="search">${u('search')}<input id="cp-q" type="search" placeholder="ค้นหาชื่อโครงการหรือทำเล" aria-label="ค้นหาผลงาน" value="${esc(PF.q)}"></label>
    <div class="filters" id="pfilters" role="tablist" aria-label="ประเภท"></div>
    <div class="tsel"><select id="cp-area" aria-label="พื้นที่"><option value="all">ทุกพื้นที่</option><option value="bkk">กรุงเทพฯ และปริมณฑล</option><option value="khaoyai">เขาใหญ่</option><option value="coast">ชายทะเล</option></select><select id="cp-fl" aria-label="จำนวนชั้น"><option value="all">ทุกจำนวนชั้น</option><option value="1">1 ชั้น</option><option value="2">2 ชั้น</option><option value="3">3 ชั้น</option><option value="4">4 ชั้น</option></select>
    <div class="vtog" role="group" aria-label="รูปแบบการแสดง"><button data-v="grid" aria-label="แสดงแบบตาราง">${u('grid')}</button><button data-v="list" aria-label="แสดงแบบรายการ">${u('menu')}</button></div></div></div></div>
   <div class="wrap" style="padding-block:28px 0"><p class="rcount" id="rcount"></p><div class="pgrid" id="pgrid"></div><div class="pager"><p id="pshown"></p><div class="pbar"><i id="pbar"></i></div><button class="btn line" id="more">โหลดผลงานเพิ่ม ${u('arr')}</button></div></div>
   <section class="wrap" style="padding-block:72px 88px">${head('By Location', 'ผลงานตามพื้นที่')}<div class="areas"><button class="ar" data-area="bkk">${img('17', '', '50vw')}<span class="cap"><span><small>บ้านพักอาศัย</small><b>กรุงเทพฯ และปริมณฑล</b></span><em>${PJ.filter(p => p.area === 'bkk').length} โครงการ</em></span></button><button class="ar" data-area="khaoyai">${img('02', '', '50vw')}<span class="cap"><span><small>บ้านพักตากอากาศ</small><b>เขาใหญ่</b></span><em>${PJ.filter(p => p.area === 'khaoyai').length} โครงการ</em></span></button></div></section>`);
};
function renderProjGrid() {
  const g = document.getElementById('pgrid'); if (!g) return;
  const types = [['all', 'ทั้งหมด'], ['บ้านพักอาศัย', 'บ้านพักอาศัย'], ['บ้านพักตากอากาศ', 'บ้านพักตากอากาศ'], ['อาคาร / งานพิเศษ', 'อาคาร / งานพิเศษ']];
  const base = PJ.filter(p => (PF.area === 'all' || p.area === PF.area) && (PF.fl === 'all' || String(p.fl) === PF.fl) && (!PF.q || (p.title + p.t + p.loc).toLowerCase().includes(PF.q.toLowerCase())));
  document.getElementById('pfilters').innerHTML = types.map(([k, n]) => `<button class="fchip${PF.type === k ? ' on' : ''}" data-pt="${k}" role="tab" aria-selected="${PF.type === k}">${n}<span>${k === 'all' ? base.length : base.filter(p => p.type === k).length}</span></button>`).join('');
  const list = base.filter(p => PF.type === 'all' || p.type === PF.type);
  const show = list.slice(0, PF.shown);
  const active = PF.type !== 'all' || PF.area !== 'all' || PF.fl !== 'all' || PF.q;
  document.getElementById('rcount').innerHTML = `พบ <b>${list.length}</b> โครงการ${active ? '<button id="clearf">ล้างตัวกรอง</button>' : ''}`;
  g.classList.toggle('list', PF.mode === 'list'); g.style.display = show.length ? '' : 'block';
  g.innerHTML = show.length ? show.map(projCard).join('') : `<div class="empty">${u('search')}<b>ไม่พบผลงานที่ตรงกับตัวกรอง</b><button class="btn dark" id="clearf2">ล้างตัวกรอง</button></div>`;
  document.getElementById('pshown').innerHTML = `แสดง <b>${show.length}</b> จาก ${list.length} โครงการ`;
  document.getElementById('pbar').style.width = (list.length ? show.length / list.length * 100 : 100) + '%';
  const m = document.getElementById('more'); m.hidden = show.length >= list.length;
  document.querySelectorAll('.vtog button').forEach(b => { const on = b.dataset.v === PF.mode; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  const A = document.getElementById('cp-area'), F = document.getElementById('cp-fl'); if (A) A.value = PF.area; if (F) F.value = PF.fl;
}
V.project = (id) => {
  const p = pj(id); if (!p) return null; const R = p.R;
  CUR.caps = null; CUR.gal = p.gal; CUR.title = p.title;
  const g = p.gal, cls = g.length === 1 ? 'one' : g.length <= 3 ? 'three' : '';
  const rel = PJ.filter(x => x.id !== p.id && (x.R || x.area === p.area)).slice(0, 3);
  return `<div class="wrap" style="padding-block:28px 88px">${crumbs(['ผลงาน', '#projects'], p.title)}
  <div class="gal ${cls}" style="margin-top:18px">${g.slice(0, g.length <= 3 ? 3 : 5).map((k, i) => `<button data-lb="${i}" aria-label="ดูภาพที่ ${i + 1}">${img(k, p.title + ' ภาพที่ ' + (i + 1), i ? '30vw' : '(max-width:700px) 100vw, 60vw', !i)}</button>`).join('')}${g.length > 1 ? `<button class="all" data-lb="0">${u('grid')}ดูรูปทั้งหมด (${g.length})</button>` : ''}</div>
  <div class="dlay"><div><div class="chips">${R ? `<span class="chip g">${esc(R.sn)}</span>` : ''}<span class="chip">${esc(p.type)}</span>${p.fl ? `<span class="chip">${p.fl} ชั้น</span>` : ''}${R && R.yr ? `<span class="chip">แล้วเสร็จ ${R.yr}</span>` : ''}</div>
   <h1>${esc(p.title)}</h1>${p.loc ? `<span class="loc" style="font-size:14.5px">${u('pin')}${esc(p.loc)}</span>` : ''}
   ${R && R.a ? `<div class="bigspecs"><div>${u('area')}<b>${fmt(R.a)}</b><small>ตร.ม. พื้นที่ใช้สอย</small></div><div>${u('bed')}<b>${R.bed}</b><small>ห้องนอน</small></div><div>${u('bath')}<b>${R.bath}</b><small>ห้องน้ำ</small></div><div>${u('home')}<b>${R.fl}</b><small>ชั้น</small></div></div>` : '<div style="height:20px"></div>'}
   <div class="dtext">${p.rich === 'creston' ? ytCard('z1N84CZHUZ8', 'ผลงานบ้านพักตากอากาศ Banyan Tree Residences Creston Hill', 'วิดีโอผลงานจริง · W House', 'inl') : ''}<h2 style="margin-top:0">เกี่ยวกับโครงการ</h2>${R && R.d ? R.d.map(t => `<p>${esc(t)}</p>`).join('') : `<p>${esc(p.t)}</p><p class="note-s">หน้ารายละเอียดของโครงการนี้จะดึงคำบรรยาย ภาพแกลเลอรี และวิดีโอจากหน้าเดิมใน WordPress</p>`}
   ${R && R.f ? `<h2>จุดเด่นของการออกแบบ</h2><ul class="feat">${R.f.map(t => `<li>${u('check')}<span>${esc(t)}</span></li>`).join('')}</ul>` : ''}</div></div>
   <aside class="side-card">${R && R.a ? `<div class="area"><small>พื้นที่ใช้สอย</small><b>${fmt(R.a)} ตร.ม.</b></div>` : `<b style="font-family:var(--serif);font-weight:400;font-size:22px">อยากได้บ้านแบบนี้?</b>`}
   <p style="color:var(--soft);font-size:14px">คุยกับสถาปนิกเรื่องบ้านลักษณะนี้ ฟรี ไม่มีค่าใช้จ่าย</p><a class="btn gold" href="#contact" data-about="p:${p.id}">${u('cal')}นัดคุยเรื่องบ้านแบบนี้</a>
   <button class="btn line" data-heart="p:${p.id}" aria-pressed="${isSaved('p:' + p.id)}" style="justify-content:center">${u('heart')}<span>${isSaved('p:' + p.id) ? 'บันทึกแล้ว' : 'บันทึกบ้านหลังนี้'}</span></button></aside></div>
  <div class="related">${head('You May Also Like', 'ผลงานที่ใกล้เคียง', '#projects')}<div class="pgrid">${rel.map(projCard).join('')}</div></div></div>`;
};
V.reviews = () => {
  const r = W.posts.reviews.map(p => POSTS.find(x => x.id === p.id));
  return phead(crumbs('ผลงาน', 'รีวิว'), 'Reviews', 'เสียงจาก<em>เจ้าของบ้าน</em>', 'บทสัมภาษณ์ความประทับใจจากเจ้าของบ้านจริง บ้านโมเดิร์น 3 ชั้น บ้านพักตากอากาศ จนถึงบ้านที่อยู่กับเรามา 21 ปี', `<span class="realnote">${u('check')} รีวิวทั้งหมด 19 เรื่องบนเว็บจริง · แสดงล่าสุด ${r.length} เรื่อง</span>`)
    + `<div class="wrap sec2" style="display:grid;gap:40px">${postCard(r[0], true)}<div class="grid3">${r.slice(1).map(p => postCard(p)).join('')}</div></div>`;
};
V.newshub = () => phead(crumbs('News & Event'), 'News & Event', 'ข่าวสาร <em>กิจกรรม</em> และบทความ', 'อัปเดตจาก W House ทั้งบทความความรู้เรื่องสร้างบ้าน ข่าวสาร และกิจกรรมของบริษัท')
  + `<div class="wrap" style="padding-bottom:60px">${[['blog', 'Blog', 'บทความน่ารู้เรื่องสร้างบ้าน', 26], ['news', 'News', 'ข่าวสาร', 153], ['event', 'Event', 'กิจกรรม', 84]].map(([c, e, h, n]) => `<div class="nrow">${head(e + ' · ' + n + ' โพสต์', h, '#' + c)}<div class="grid3">${W.posts[c].slice(0, 3).map(p => postCard(POSTS.find(x => x.id === p.id))).join('')}</div></div>`).join('')}</div>`;
V.postlist = (c) => {
  const a = W.posts[c].map(p => POSTS.find(x => x.id === p.id));
  const N = { blog: ['Blog', 'บทความ<em>น่ารู้</em>', 26], news: ['News', 'ข่าว<em>สาร</em>', 153], event: ['Event', 'กิจ<em>กรรม</em>', 84] }[c];
  return phead(crumbs(['News & Event', '#news-event'], N[0]), N[0], N[1], '', `<nav class="stabs" style="margin:6px 0 0">${['blog', 'news', 'event'].map(k => `<a href="#${k}" class="${k === c ? 'on' : ''}">${CATN[k]}</a>`).join('')}</nav>`)
    + `<div class="wrap sec2" style="display:grid;gap:40px">${postCard(a[0], true)}<div class="grid3">${a.slice(1).map(p => postCard(p)).join('')}</div><div class="pager"><p>แสดง ${a.length} จาก ${N[2]} โพสต์</p><button class="btn line" data-toast="ตัวอย่าง: โหลดโพสต์ถัดไปจาก WordPress">โหลดเพิ่ม ${u('arr')}</button></div></div>`;
};
V.article = (id) => {
  const p = post(id); if (!p) return null;
  const rel = POSTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const back = p.cat === 'reviews' ? ['รีวิว', '#reviews'] : [CATN[p.cat], '#' + p.cat];
  return `<div class="wrap"><article class="article">${crumbs(p.cat === 'reviews' ? ['ผลงาน', '#projects'] : ['News & Event', '#news-event'], back, 'บทความ')}
   <div class="meta" style="display:flex;gap:10px;align-items:center;margin-top:18px;font-size:13px;color:var(--soft)"><span class="chip g">${CATN[p.cat]}</span>${thDate(p.date)}</div>
   <h1>${esc(p.t)}</h1><div class="cover">${img(p.key, p.t, '(max-width:800px) 100vw, 760px', true)}</div>
   <div class="body">${(p.paras.length ? p.paras : [p.ex]).map(t => `<p>${esc(t)}</p>`).join('')}</div>
   <div class="share"><span>แชร์บทความ</span><button class="btn line" data-copylink="${p.id}" style="min-height:38px">คัดลอกลิงก์</button><a class="btn line" href="https://www.facebook.com/sharer/sharer.php?u=https://www.whouse.co.th/" target="_blank" rel="noopener" style="min-height:38px">Facebook</a></div>
   <p class="note-s" style="margin-top:14px">เนื้อหาตัดตอนจากบทความจริงบน whouse.co.th</p></article>
   ${rel.length ? `<section style="padding-bottom:88px">${head('Related', 'บทความที่เกี่ยวข้อง', back[1])}<div class="grid3">${rel.map(x => postCard(x)).join('')}</div></section>` : ''}</div>`;
};
const STEPS = [
  ['ออกแบบบ้าน', ['สอบถามความต้องการของลูกค้า และงบประมาณ', 'ออกแบบใหม่ หรือเลือกปรับจากแบบบ้านมาตรฐาน'], 'pen'],
  ['ตรวจสอบจัดหาที่ดิน', ['ตรวจสอบและช่วยจัดหาที่ดิน', 'คำนวณระยะเวลาและค่าก่อสร้าง'], 'pin'],
  ['ขั้นตอนก่อนเริ่มก่อสร้าง', ['การทำสัญญา', 'เตรียมเทียบราคาและวัสดุ', 'เตรียมพื้นที่ รื้อถอน ถมดิน'], 'check'],
  ['ยื่นขออนุญาต', ['ยื่นขออนุญาตก่อสร้าง', 'ยื่นขออนุญาตไฟฟ้าและประปา'], 'cal'],
  ['ดำเนินการก่อสร้าง', ['ก่อสร้างตามแผนงานที่วางไว้', 'เป็นไปตามมาตรฐาน ISO 9001:2015'], 'helmet'],
  ['ตรวจสอบผลงาน', ['ตรวจตามระบบมาตรฐานคุณภาพ ISO 9001:2015', 'ตรวจบ้านร่วมกับวิศวกรผู้ดูแลของบริษัท'], 'shield'],
  ['การชำระเงิน', ['แบ่งชำระเป็นงวดตามผลงานก่อสร้างจริง', 'ตามเงื่อนไขที่ระบุในสัญญา'], 'coin']
];
const PHASES = [
  ['วางแผน', 'Plan', 'คุยความต้องการ งบประมาณ และหาที่ดินที่ใช่', [0, 1]],
  ['เตรียมก่อสร้าง', 'Prepare', 'ทำสัญญา เทียบราคาวัสดุ และขออนุญาตทั้งหมด', [2, 3]],
  ['ก่อสร้างและส่งมอบ', 'Build', 'สร้างตามแผน ตรวจร่วมกับวิศวกร และชำระตามงานจริง', [4, 5, 6]]
];
V.process = () => phead(crumbs('ขั้นตอนการทำงาน'), 'Work Process', '7 Steps <em>to Your Dream Home</em>', 'รังสรรค์บ้านหรู อยู่สบาย สไตล์คุณ ทุกขั้นตอนดูแลโดยทีมเดียว ตั้งแต่คุยความต้องการจนถึงตรวจรับบ้าน', `<div class="phstats"><span><b class="n">7</b>ขั้นตอน</span><span><b class="n">3</b>ช่วงงาน</span><span><b>${u('check')}</b>ISO 9001:2015</span></div>`)
  + `<div class="wrap pr2">
  ${PHASES.map(([th, en, d, ids], pi) => `<section class="ph2"><div class="ph2h"><span class="k">Phase <span class="n">0${pi + 1}</span> · ${en}</span><h2>${th}</h2><p>${d}</p></div>
   <div class="ph2g c${ids.length}">${ids.map(i => { const [t, b, ic] = STEPS[i]; return `<article class="sc2"><div class="top"><span class="no n">${String(i + 1).padStart(2, '0')}</span><span class="ic">${u(ic)}</span></div><h3>${t}</h3><ul>${b.map(x => `<li>${x}</li>`).join('')}</ul></article>`; }).join('')}</div></section>`).join('')}
  <div class="pr2b">
   <div class="wr2"><span class="eyebrow">Warranty</span><h2>การรับประกันหลังส่งมอบ</h2><p>นับจากวันรับมอบบ้าน บริษัทออกใบรับประกันผลงานให้ทุกหลัง</p>
    <div class="wr2l"><div><b class="n">20</b><span>ปี</span><em>โครงสร้าง</em></div><div><b class="n">5</b><span>ปี</span><em>หลังคา</em></div><div><b class="n">1</b><span>ปี</span><em>งานสถาปัตยกรรม ไฟฟ้า และประปา</em></div></div>
    <a class="btn white" href="#contact">${u('cal')}เริ่มขั้นตอนแรก นัดคุยสถาปนิก</a></div>
   <div class="fq2"><span class="eyebrow">FAQ</span><h2>คำถามที่พบบ่อย</h2><div class="faq">
  <details open><summary>ยังไม่มีที่ดิน คุยกับ W House ได้ไหม</summary><p>ได้ครับ ขั้นตอนที่ 2 ของเราคือช่วยตรวจสอบและจัดหาที่ดิน พร้อมคำนวณระยะเวลาและค่าก่อสร้างให้ก่อนตัดสินใจ</p></details>
  <details><summary>ต้องออกแบบใหม่ทั้งหลัง หรือเลือกจากแบบที่มีได้</summary><p>ได้ทั้งสองแบบ จะออกแบบใหม่ หรือเลือกปรับจากแบบบ้านมาตรฐานของ W House ก็ได้ ดูตัวอย่างแบบได้ที่หน้าแบบบ้าน</p></details>
  <details><summary>การชำระเงินแบ่งอย่างไร</summary><p>แบ่งชำระเป็นงวด ส่วนที่เหลือชำระตามผลงานก่อสร้างจริงตามเงื่อนไขในสัญญา</p></details>
  <details><summary>รับประกันอะไรบ้าง</summary><p>โครงสร้าง 20 ปี หลังคา 5 ปี งานสถาปัตยกรรมและงานระบบไฟฟ้าประปา 1 ปี นับจากวันรับมอบบ้าน</p></details>
  <details><summary>รับสร้างบ้านพื้นที่ไหนบ้าง</summary><p>กรุงเทพฯ ปริมณฑล และเขาใหญ่ ครอบคลุมสุขุมวิท พระราม 9 ราชพฤกษ์ เลียบด่วน บางนา รังสิต รวมถึงต่างจังหวัด เช่น นนทบุรี สมุทรสาคร เพชรบุรี และเชียงใหม่</p></details></div></div>
  </div></div>`;
V.about = () => phead(crumbs('เกี่ยวกับเรา'), 'About Us', 'บริษัท ดับบลิว เฮ้าส์ จำกัด<br><em>บริษัทรับสร้างบ้านมาตรฐานสูง</em>', 'รังสรรค์บ้านหรูที่โดดเด่นร่วมสมัยและบ่งบอกสไตล์ของผู้อยู่อาศัย ตั้งแต่ปี 2543', `<div class="phstats"><span><b class="n">26</b>ปีประสบการณ์</span><span><b>${u('check')}</b>ISO 9001:2015</span><span><b>${u('shield')}</b>รับประกันโครงสร้าง 20 ปี</span></div>`)
  + `<div class="wrap abp">
  <section class="abs"><div class="absph">${img('02', 'The Creston Hills เขาใหญ่', '(max-width:900px) 100vw, 50vw')}<span class="cap">${u('pin')}The Creston Hills เขาใหญ่</span></div>
   <div class="abstx"><span class="eyebrow">Our Story</span><h2>ก่อตั้ง พ.ศ. <span class="n">2543</span><br><em>ด้วยทุนจดทะเบียน <span class="n">15</span> ล้านบาท</em></h2>
    <p>W House ก่อตั้งขึ้นพร้อมจุดมุ่งหมายในการรังสรรค์บ้านหรูที่มีความสวยงามโดดเด่นร่วมสมัย และบ่งบอกถึงสไตล์ของผู้อยู่อาศัย ครบครันด้วยคุณภาพและนวัตกรรมเพื่ออนาคต</p>
    <p>ด้วยประสบการณ์และความเชี่ยวชาญ เราให้บริการครบวงจร ตั้งแต่การออกแบบ การก่อสร้าง ไปจนถึงการส่งมอบบ้านที่มีคุณภาพในมาตรฐานระดับสูง จนเป็นที่ยอมรับในฐานะบริษัทรับสร้างบ้านหรู</p>
    <ul class="absl"><li>${u('check')}ออกแบบและก่อสร้างครบในทีมเดียว</li><li>${u('check')}สมาชิกสมาคมธุรกิจรับสร้างบ้าน</li><li>${u('check')}ระบบบริหารคุณภาพ ISO 9001:2015</li></ul></div></section>
  </div>
  <section class="abn"><div class="wrap abnin">
   <div><b class="n">26</b><span>ปี</span><small>ประสบการณ์สร้างบ้านหรู</small></div>
   <div><b class="n">${PJ.length}</b><span>หลัง</span><small>ผลงานที่แล้วเสร็จบนเว็บไซต์</small></div>
   <div><b class="n">20</b><span>ปี</span><small>รับประกันโครงสร้าง</small></div>
   <div><b class="n">${DS.length}</b><span>แบบ</span><small>แบบบ้านให้เลือกปรับ</small></div></div></section>
  <div class="wrap abp">
  <section class="abv">${head('What We Do', 'สิ่งที่เรายึดมั่น')}<div class="abvg">
   <a class="abvc" href="#design">${img('10', 'บ้านหรูออกแบบเฉพาะคุณ', '(max-width:900px) 100vw, 33vw')}<span class="tx"><span class="no n">01</span><b>สร้างบ้านหรู</b><small>ออกแบบเฉพาะคุณ จากความต้องการและการใช้ชีวิตจริง</small></span></a>
   <a class="abvc" href="#design-modern">${img('22', 'บ้านสไตล์โมเดิร์น', '(max-width:900px) 100vw, 33vw')}<span class="tx"><span class="no n">02</span><b>บ้านสไตล์โมเดิร์น</b><small>ทันสมัย ฟังก์ชันตอบโจทย์ทุกช่วงชีวิต</small></span></a>
   <a class="abvc" href="#process">${img('14', 'คุณภาพมาตรฐานสูง', '(max-width:900px) 100vw, 33vw')}<span class="tx"><span class="no n">03</span><b>คุณภาพ · มาตรฐานสูง</b><small>ควบคุมทุกขั้นตอน วัสดุคุณภาพ งานระดับพรีเมียม</small></span></a></div></section>
  <section class="abj">${head('Our Journey', 'เส้นทางของ W House')}<ol class="abjl">
   <li><span class="y n">2000</span><b>ก่อตั้งบริษัท</b><p>สร้างบ้านหลังแรก กรุงเทพฯ 2,550 ตร.ม.</p></li>
   <li><span class="y n">2010</span><b>ขยายตลาด</b><p>รับสร้างบ้านทั่วประเทศ</p></li>
   <li><span class="y n">2014</span><b>ISO 9001</b><p>ได้รับรองมาตรฐานคุณภาพ และเข้าเป็นสมาชิกสมาคมธุรกิจรับสร้างบ้าน</p></li>
   <li><span class="y n">2024</span><b>รางวัลประหยัดพลังงาน</b><p>ขยายตลาดโซนตะวันออก ใต้ตอนบน และภาคเหนือ</p></li>
   <li class="now"><span class="y">ปัจจุบัน</span><b>26 ปี</b><p>บ้านหรูในกรุงเทพฯ ปริมณฑล และเขาใหญ่</p></li></ol></section>
  <section class="abz">
   <div class="abzc"><span class="eyebrow">Service Area</span><h2>พร้อมดูแลคุณในทุกทำเลคุณภาพ</h2><div class="zones">${['สุขุมวิท', 'พระราม 9', 'ราชพฤกษ์', 'เลียบด่วน', 'บางนา', 'รังสิต', 'นนทบุรี', 'สมุทรสาคร', 'เพชรบุรี', 'เขาใหญ่'].map(z => `<span>${u('pin')}${z}</span>`).join('')}</div><a class="more" href="#projects">ดูผลงานในแต่ละทำเล ${u('arr')}</a></div>
   <div class="abzc"><span class="eyebrow">Leadership</span><h2>ผู้บริหาร</h2><div class="abld">
    <div><span class="av">จ</span><span><b>คุณเจตน์ กาญจนกูล</b><small>รองประธานบริหาร</small></span></div>
    <div><span class="av">ว</span><span><b>คุณวรวุฒิ กาญจนกูล</b><small>ผู้บริหาร · วิทยากร HOME BUILDER EXPERT</small></span></div></div>
    <a class="btn gold" href="#contact">${u('cal')}นัดคุยกับทีมสถาปนิก</a></div></section>
  </div>`;
V.contact = () => {
  const days = []; const x = new Date(); while (days.length < 5) { x.setDate(x.getDate() + 1); if (x.getDay() > 0 && x.getDay() < 6) days.push(new Date(x)); }
  const TD = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  return phead(crumbs('ติดต่อ'), 'Get in Touch', 'นัดคุยกับ<em>สถาปนิก</em>', 'Let’s Build Something That Lasts · นัดหมายล่วงหน้าเพื่อคุยโจทย์บ้าน ที่สำนักงานรามอินทราหรือออนไลน์')
    + `<div class="wrap sec tight"><div class="cgrid"><div class="formcard" id="formcard">${formHTML(days, TD)}</div>
   <aside class="cinfo"><div class="ci"><span class="icb">${u('phone')}</span><div><b>โทร</b><p id="telnum">093-555-0596</p><p>แฟกซ์ 029-437-554</p><button class="copy" data-copy="093-555-0596">คัดลอกเบอร์</button></div></div>
   <div class="ci"><span class="icb">${u('chat')}</span><div><b>อีเมล</b><p>marketing@whouse.co.th</p></div></div>
   <div class="ci"><span class="icb">${u('pin')}</span><div><b>สำนักงาน</b><p>65/6 ซอยรามอินทรา 14 แขวงท่าแร้ง<br>เขตบางเขน กรุงเทพฯ 10230</p></div></div>
   <div class="ci"><span class="icb">${u('clock')}</span><div><b>วันเปิดทำการ</b><p>จันทร์ – ศุกร์ 8:30 – 17:30</p></div></div>
   <div class="mapcard"><svg class="map" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#F1ECEC"/><path d="M0 210 C120 190 220 230 400 170" stroke="#fff" stroke-width="16" fill="none"/><path d="M90 0 L150 300" stroke="#fff" stroke-width="12" fill="none"/><path d="M0 90 L400 120" stroke="#fff" stroke-width="8" fill="none"/><rect x="170" y="20" width="60" height="50" rx="6" fill="#E4EDE0"/><circle cx="200" cy="140" r="8" fill="#80192D"/></svg><span class="pinb">W House · รามอินทรา 14</span><a class="btn white" href="https://maps.google.com/maps?q=W%20House%20Co.%2CLtd" target="_blank" rel="noopener">${u('map')}เปิดใน Google Maps</a></div>
   <div class="ci"><span class="icb">${u('video')}</span><div><b>YouTube</b><p>@whouseonline</p><a class="copy" href="https://www.youtube.com/@whouseonline" target="_blank" rel="noopener" style="display:inline-flex;align-items:center">เปิดช่อง</a></div></div></aside></div></div>`;
};
function formHTML(days, TD) {
  return `<form id="bookform" novalidate style="display:grid;gap:22px"><div><h2>ข้อมูลการนัดหมาย</h2><p class="note-s" style="margin-top:6px" id="aboutproj"></p></div>
  <div class="fg"><div class="fi"><label for="c-name">ชื่อ-นามสกุล <span>*</span></label><input id="c-name" autocomplete="name" placeholder="เช่น สมชาย ใจดี"><span class="msg">กรุณากรอกชื่อ</span></div>
  <div class="fi"><label for="c-tel">เบอร์โทร <span>*</span></label><input id="c-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="08x-xxx-xxxx"><span class="msg">กรอกเบอร์โทร 9–10 หลัก</span></div>
  <div class="fi"><label for="c-mail">อีเมล</label><input id="c-mail" type="email" autocomplete="email" placeholder="ไม่บังคับ"></div>
  <div class="fi"><label for="c-loc">ทำเลที่ดิน</label><select id="c-loc"><option>กรุงเทพฯ และปริมณฑล</option><option>เขาใหญ่ / ปากช่อง</option><option>ต่างจังหวัดอื่น ๆ</option><option>ยังไม่มีที่ดิน</option></select></div>
  <div class="fi"><label for="c-style">สไตล์ที่สนใจ</label><select id="c-style"><option value="">ยังไม่แน่ใจ</option>${Object.entries(STY).map(([k, s]) => `<option value="${k}">${s.n}</option>`).join('')}</select></div>
  <div class="fi"><label for="c-size">พื้นที่ใช้สอย</label><select id="c-size"><option value="">ไม่ระบุ</option><option value="s">ไม่เกิน 500 ตร.ม.</option><option value="m">500 – 800 ตร.ม.</option><option value="l">800 ตร.ม. ขึ้นไป</option></select></div></div>
  <div class="fi"><label>รูปแบบการนัด</label><div class="seg"><label><input type="radio" name="c-mode" value="ที่สำนักงาน รามอินทรา 14" checked><span>ที่สำนักงาน<small>รามอินทรา 14 · ดูตัวอย่างวัสดุ</small></span></label><label><input type="radio" name="c-mode" value="ออนไลน์"><span>ออนไลน์<small>วิดีโอคอล · สะดวกทุกที่</small></span></label></div></div>
  <div class="fi"><label>วันที่สะดวก (จันทร์ – ศุกร์)</label><div class="slots">${days.map((t, i) => `<label><input type="radio" name="c-day" value="${TD[t.getDay()]} ${t.getDate()} ${TH_M[t.getMonth()]}"${i === 0 ? ' checked' : ''}>${TD[t.getDay()]}<small>${t.getDate()} ${TH_M[t.getMonth()]}</small></label>`).join('')}</div></div>
  <div class="fi"><label>เวลา</label><div class="slots">${['9:00', '10:30', '13:00', '14:30', '16:00'].map((t, i) => `<label><input type="radio" name="c-time" value="${t}"${i === 2 ? ' checked' : ''}>${t}</label>`).join('')}</div></div>
  <div class="fi"><label for="c-msg">เล่าโจทย์บ้านเพิ่มเติม</label><textarea id="c-msg" placeholder="เช่น ครอบครัว 5 คน มีผู้สูงอายุ อยากได้ห้องนอนชั้นล่าง"></textarea></div>
  <button class="btn gold" type="submit" style="justify-content:center;min-height:54px;font-size:15px">${u('cal')}ยืนยันนัดหมาย</button><p class="note-s" style="text-align:center">หน้านี้เป็น mockup ข้อมูลจะไม่ถูกส่งจริง</p></form>`;
}
V.saved = () => {
  const ps = saved.filter(k => k.startsWith('p:')).map(k => pj(k.slice(2))).filter(Boolean), dd = saved.filter(k => k.startsWith('d:')).map(k => ds(k.slice(2))).filter(Boolean);
  return phead(crumbs('บ้านที่บันทึกไว้'), 'Saved', 'บ้านที่<em>บันทึกไว้</em>', 'กดรูปหัวใจบนแบบบ้านหรือผลงานเพื่อเก็บไว้ที่นี่ แล้วนำไปคุยกับสถาปนิกได้ทันที')
    + `<div class="wrap sec tight">${!ps.length && !dd.length ? `<div class="empty">${u('heart')}<b>ยังไม่มีรายการที่บันทึกไว้</b><p>เริ่มจากดูแบบบ้านหรือผลงานที่ชอบ</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn dark" href="#design">ดูแบบบ้าน</a><a class="btn line" href="#projects">ดูผลงาน</a></div></div>` : ''}
    ${dd.length ? `<h2 style="font-size:26px;margin-bottom:18px">แบบบ้าน (${dd.length})</h2><div class="grid3" style="margin-bottom:48px">${dd.map(planCard).join('')}</div>` : ''}
    ${ps.length ? `<h2 style="font-size:26px;margin-bottom:18px">ผลงาน (${ps.length})</h2><div class="pgrid">${ps.map(projCard).join('')}</div>` : ''}</div>`;
};
V.privacy = () => phead(crumbs('นโยบายความเป็นส่วนตัว'), 'Privacy', 'นโยบาย<em>ความเป็นส่วนตัว</em>') + `<div class="wrap"><div class="legal"><p class="realnote">ข้อความตัวอย่าง · ใช้เนื้อหาจริงจากหน้า Privacy Policy เดิมของลูกค้า</p><h2>ข้อมูลที่เราเก็บ</h2><p>ชื่อ เบอร์โทร อีเมล และรายละเอียดโจทย์บ้านที่คุณกรอกในแบบฟอร์มนัดหมาย</p><h2>การนำไปใช้</h2><p>ใช้ติดต่อกลับเพื่อนัดหมายและให้ข้อมูลบริการเท่านั้น</p><h2>ติดต่อเรา</h2><p>marketing@whouse.co.th · 093-555-0596</p></div></div>`;
V['404'] = () => `<div class="e404"><div class="e4in"><span class="e4k">Error 404</span><b>404</b><h1>ไม่พบหน้าที่คุณค้นหา</h1><p class="lead2">ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่แล้ว ลองค้นหาแบบบ้าน หรือเลือกไปยังหน้าที่ต้องการ</p><div class="e4btn"><a class="btn dark" href="#home">${u('home')} กลับหน้าแรก</a><button class="btn line" data-opensearch>${u('search')} ค้นหา</button></div><div class="e4links"><a href="#design">แบบบ้าน</a><a href="#projects">ผลงาน</a><a href="#process">ขั้นตอน</a><a href="#contact">ติดต่อเรา</a></div></div></div>`;

/* serif headings: render digits in the number font */
function numFont(root) {
  root.querySelectorAll('h1,h2,h3,blockquote').forEach(h => {
    const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT); const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(t => { if (!/\d/.test(t.nodeValue) || t.parentElement.closest('.n')) return; const f = document.createDocumentFragment(); t.nodeValue.split(/(\d[\d,.:]*)/).forEach((s, i) => { if (!s) return; if (i % 2) { const sp = document.createElement('span'); sp.className = 'n'; sp.textContent = s; f.appendChild(sp); } else f.appendChild(document.createTextNode(s)); }); t.replaceWith(f); });
  });
}
/* ---------- router ---------- */
const CUR = { gal: [], title: '' };
let current = '', aboutRef = null;
function route() {
  // a page change must never inherit a scroll lock from an overlay left open (gallery, search, video, menu)
  ['lb', 'sov'].forEach(id => { const o = document.getElementById(id); if (o) o.hidden = true; });
  const dw = document.getElementById('drawer'); if (dw) { dw.classList.remove('open'); dw.setAttribute('aria-hidden', 'true'); }
  document.body.style.overflow = '';
  const h =decodeURIComponent((location.hash || '#home').slice(1)) || 'home';
  let v = h, arg = null, nav = h;
  if (h === 'home') v = 'home';
  else if (h === 'design') { v = 'design'; nav = 'design'; }
  else if (h.startsWith('design-') || h.startsWith('style-')) { arg = h.replace(/^(design|style)-/, ''); v = STY[arg] ? 'style' : '404'; nav = 'design'; }
  else if (h.startsWith('plan-')) { arg = h.slice(5); v = 'plan'; nav = 'design'; }
  else if (h === 'more-is-more') { v = 'mim'; nav = 'design'; }
  else if (h === 'a-life-of-style') { v = 'alife'; nav = 'design'; }
  else if (h === 'projects' || h === 'completed') { v = 'projects'; arg = 'done'; nav = 'projects'; }
  else if (h === 'ongoing') { v = 'projects'; arg = 'ongoing'; nav = 'projects'; }
  else if (h.startsWith('project-')) { arg = h.slice(8); v = 'project'; nav = 'projects'; }
  else if (h === 'reviews') { v = 'reviews'; nav = 'projects'; }
  else if (h === 'news-event') { v = 'newshub'; nav = 'news'; }
  else if (['blog', 'news', 'event'].includes(h)) { v = 'postlist'; arg = h; nav = 'news'; }
  else if (h.startsWith('article-')) { arg = h.slice(8); v = 'article'; const p = post(arg); nav = p && p.cat === 'reviews' ? 'projects' : 'news'; }
  else if (['process', 'about', 'contact', 'saved', 'privacy'].includes(h)) { v = h; }
  else v = '404';
  let html = V[v] ? V[v](arg) : null;
  if (html == null) { v = '404'; html = V['404'](); }
  const el = document.querySelector(`[data-view="${v}"]`);
  el.innerHTML = html;
  document.querySelectorAll('.view').forEach(x => x.classList.toggle('on', x === el));
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === nav));
  current = v;
  numFont(el);
  if (v === 'style') renderStyleGrid(arg);
  if (v === 'projects' && arg === 'done') renderProjGrid();
  if (v === 'contact') { setAbout(); bindForm(); }
  if (v === 'home') { bindPlanner(); bindHero(); bindFlow(); bindRail(); } else clearTimeout(HS.t);
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.body.classList.toggle('is-home', v === 'home');
  updHeader();
  closeDrawer();
}
function updHeader() { const y = window.scrollY; document.body.classList.toggle('ontop', current === 'home' && y < 40); document.body.classList.toggle('scrolled', y > 4); }
window.addEventListener('scroll', updHeader, { passive: true });
window.addEventListener('hashchange', route);

/* ---------- interactions ---------- */
const toast = (m) => { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); };
function setAbout() {
  const el = document.getElementById('aboutproj'); if (!el) return;
  let s = 'กรอกข้อมูลสั้น ๆ ทีมงานจะโทรยืนยันในวันทำการถัดไป';
  if (aboutRef) { const [t, id] = aboutRef.split(':'); const o = t === 'd' ? ds(id) : pj(id); if (o) s = `นัดคุยเกี่ยวกับ: <b>${esc(t === 'd' ? 'แบบบ้าน ' + o.code + (o.name ? ' · ' + o.name : '') : o.title)}</b>`; if (t === 'd' && o) { const st = document.getElementById('c-style'); if (st) st.value = o.st[0]; } }
  el.innerHTML = s;
}
function bindForm() {
  const f = document.getElementById('bookform'); if (!f) return;
  if (PL.style || PL.size) { const st = document.getElementById('c-style'), sz = document.getElementById('c-size'), lc = document.getElementById('c-loc'); if (PL.style) st.value = PL.style; if (PL.size) sz.value = PL.size; if (PL.loc) lc.value = PL.loc; }
  f.addEventListener('submit', e => {
    e.preventDefault();
    const name = f.querySelector('#c-name'), tel = f.querySelector('#c-tel'); let ok = true;
    [[name, name.value.trim().length > 1], [tel, /^0\d{8,9}$/.test(tel.value.replace(/[\s-]/g, ''))]].forEach(([el, v]) => { el.parentElement.classList.toggle('err', !v); if (!v) ok = false; });
    if (!ok) { f.querySelector('.err input').focus(); return; }
    const v = n => f.querySelector(`input[name="${n}"]:checked`).value;
    const card = document.getElementById('formcard');
    card.innerHTML = `<div class="done"><span class="ok">${u('check')}</span><h2>รับนัดหมายแล้ว</h2><p style="color:var(--soft);max-width:420px">ทีมงานจะโทรยืนยันที่เบอร์ ${esc(tel.value)} ในวันทำการถัดไป (ตัวอย่าง ไม่ได้ส่งข้อมูลจริง)</p>
    <div class="sum"><div><span>ชื่อ</span><b>${esc(name.value)}</b></div><div><span>วันและเวลา</span><b>${v('c-day')} · ${v('c-time')}</b></div><div><span>รูปแบบ</span><b>${v('c-mode')}</b></div>${aboutRef ? `<div><span>อ้างอิง</span><b>${document.getElementById('aboutproj') ? '' : ''}${esc(aboutRef.startsWith('d:') ? ds(aboutRef.slice(2)).code : pj(aboutRef.slice(2)).title)}</b></div>` : ''}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn dark" href="#design">ดูแบบบ้านระหว่างรอ</a><button class="btn line" id="again">แก้ไขนัดหมาย</button></div></div>`;
    document.getElementById('again').onclick = () => route();
  });
}
const PL = {};
function bindPlanner() {
  const f = document.getElementById('planner'); if (!f) return;
  f.addEventListener('submit', e => { e.preventDefault(); const st = document.getElementById('f-style').value; SF.bed = document.getElementById('f-bed').value; SF.size = document.getElementById('f-size').value; PL.style = st; PL.size = SF.size; PL.loc = document.getElementById('f-loc').value; location.hash = st ? '#design-' + st : '#design-modern'; toast('กรองแบบบ้านตามที่เลือกแล้ว'); });
}
document.addEventListener('click', e => {
  const t = e.target;
  const hb = t.closest('[data-heart]');
  if (hb) { e.preventDefault(); e.stopPropagation(); const k = hb.dataset.heart; saved = isSaved(k) ? saved.filter(x => x !== k) : [...saved, k]; syncSaved(); document.querySelectorAll(`[data-heart="${k}"]`).forEach(b => { const on = isSaved(k); if (b.classList.contains('heart')) b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); const sp = b.querySelector('span'); if (sp) sp.textContent = on ? 'บันทึกแล้ว' : (k.startsWith('d:') ? 'บันทึกแบบนี้' : 'บันทึกบ้านหลังนี้'); }); toast(isSaved(k) ? 'บันทึกแล้ว ดูได้ที่ไอคอนหัวใจด้านบน' : 'นำออกจากรายการที่บันทึกแล้ว'); if (current === 'saved') route(); return; }
  const pl = t.closest('[data-plan]'); if (pl) { location.hash = '#plan-' + pl.dataset.plan; return; }
  const pr = t.closest('[data-proj]'); if (pr) { location.hash = '#project-' + pr.dataset.proj; return; }
  const po = t.closest('[data-post]'); if (po) { location.hash = '#article-' + po.dataset.post; return; }
  const ca = t.closest('a[href="#contact"]'); if (ca) { aboutRef = ca.dataset.about || null; if (current === 'contact') setAbout(); }
  const lb = t.closest('[data-lb]'); if (lb) { openLb(+lb.dataset.lb); return; }
  const og = t.closest('[data-og]'); if (og) { CUR.gal = W.ongoing.map(o => o.key); CUR.caps = W.ongoing.map(o => o.t + ' · อัปเดต ' + thDate(o.date)); CUR.title = 'โครงการกำลังก่อสร้าง'; openLb(+og.dataset.og); return; }
  const hs = t.closest('[data-hs]'); if (hs) { heroGo(+hs.dataset.hs); return; }
  const hst = t.closest('[data-hstep]'); if (hst) { heroGo(HS.i + +hst.dataset.hstep); return; }
  const sfc = t.closest('.fcard[data-sfi]:not(.on)'); if (sfc) { e.preventDefault(); flowGo(+sfc.dataset.sfi); return; }
  const sfp = t.closest('.sfpill[data-sfi], .fdots [data-sfi]'); if (sfp) { flowGo(+sfp.dataset.sfi); return; }
  const sfs = t.closest('[data-sfstep]'); if (sfs) { flowGo(FL.i + +sfs.dataset.sfstep); return; }
  const vp = t.closest('[data-vplay]'); if (vp) { const box = vp.closest('.vbox'); const v = box.querySelector('video'); v.controls = true; box.classList.add('playing'); v.play().catch(() => {}); return; }
  const rp = t.closest('[data-rpage]'); if (rp) { railPage(rp.dataset.rt, +rp.dataset.rpage); return; }
  const rl = t.closest('[data-rail]'); if (rl) { railStep(rl.dataset.rt, +rl.dataset.rail); return; }
  const sf = t.closest('[data-sf]'); if (sf) { SF[sf.dataset.sf] = sf.dataset.v; document.querySelectorAll(`[data-sf="${sf.dataset.sf}"]`).forEach(b => b.classList.toggle('on', b === sf)); renderStyleGrid(location.hash.replace(/^#(design|style)-/, '')); return; }
  if (t.closest('[data-sfclear]')) { SF.bed = ''; SF.size = ''; route(); return; }
  const ptb = t.closest('[data-pt]'); if (ptb) { PF.type = ptb.dataset.pt; PF.shown = 9; renderProjGrid(); return; }
  const vt = t.closest('.vtog [data-v]'); if (vt) { PF.mode = vt.dataset.v; renderProjGrid(); return; }
  const ar = t.closest('[data-area]'); if (ar) { PF.area = ar.dataset.area; PF.shown = 9; renderProjGrid(); document.getElementById('cp-grid').scrollIntoView({ behavior: 'smooth' }); return; }
  if (t.closest('#clearf,#clearf2')) { Object.assign(PF, { type: 'all', area: 'all', fl: 'all', q: '', shown: 9 }); const q = document.getElementById('cp-q'); if (q) q.value = ''; renderProjGrid(); return; }
  if (t.closest('#more')) { PF.shown += 9; renderProjGrid(); return; }
  const ts = t.closest('[data-toast]'); if (ts) { toast(ts.dataset.toast); return; }
  const sc = t.closest('[data-scroll]'); if (sc) { e.preventDefault(); document.getElementById(sc.dataset.scroll).scrollIntoView({ behavior: 'smooth' }); return; }
  const cp = t.closest('[data-copy]'); if (cp) { try { navigator.clipboard.writeText(cp.dataset.copy).then(() => toast('คัดลอกเบอร์แล้ว'), () => toast('คัดลอกไม่ได้ กรุณาเลือกข้อความเอง')); } catch (er) { toast('คัดลอกไม่ได้ กรุณาเลือกข้อความเอง'); } return; }
  const cl = t.closest('[data-copylink]'); if (cl) { try { navigator.clipboard.writeText(location.href).then(() => toast('คัดลอกลิงก์แล้ว'), () => toast('คัดลอกไม่ได้')); } catch (er) { toast('คัดลอกไม่ได้'); } return; }
  if (t.closest('[data-opensearch]')) { openSearch(); return; }
  const lg = t.closest('[data-lang]'); if (lg) { setLang(lg.dataset.lang); return; }
  const dd = t.closest('.dd>button'); if (dd) { const p = dd.parentElement; const was = p.classList.contains('open'); document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open')); p.classList.toggle('open', !was); return; }
  if (!t.closest('.dd')) document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open'));
});
document.addEventListener('keydown', e => {
  const c = e.target.closest && e.target.closest('[data-plan],[data-proj],[data-post],[data-og]');
  if (c && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-heart]')) { e.preventDefault(); c.click(); }
  if (e.key === 'Escape') { closeLb(); closeSearch(); closeDrawer(); document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open')); }
  if (!lbEl.hidden) { if (e.key === 'ArrowRight') lbShow(gi + 1); if (e.key === 'ArrowLeft') lbShow(gi - 1); }
});
document.addEventListener('change', e => {
  if (e.target.id === 'cp-area') { PF.area = e.target.value; PF.shown = 9; renderProjGrid(); }
  if (e.target.id === 'cp-fl') { PF.fl = e.target.value; PF.shown = 9; renderProjGrid(); }
  if (e.target.id === 'sf-sort') { SF.sort = e.target.value; renderStyleGrid(location.hash.replace(/^#(design|style)-/, '')); }
});
document.addEventListener('input', e => { if (e.target.id === 'cp-q') { PF.q = e.target.value.trim(); PF.shown = 9; renderProjGrid(); } if (e.target.id === 'sq') { runSearch(e.target.value); document.getElementById('sclear').hidden = !e.target.value; } });

/* lightbox */
const lbEl = document.getElementById('lb'); let gi = 0;
function lbShow(i) { const g = CUR.gal; gi = (i + g.length) % g.length; const k = g[gi]; const im = document.getElementById('lbimg'); im.src = SRC(k, 'm'); im.alt = `${CUR.title} ภาพที่ ${gi + 1}`; document.getElementById('lbcap').textContent = `${CUR.caps ? CUR.caps[gi] : CUR.title} · ${gi + 1} / ${g.length}`; document.querySelectorAll('#lbthumbs button').forEach((b, j) => b.classList.toggle('on', j === gi)); }
function openLb(i) { document.getElementById('lbthumbs').innerHTML = CUR.gal.map((k, j) => `<button data-t="${j}" aria-label="ภาพที่ ${j + 1}"><img src="${SRC(k, 's')}" alt=""></button>`).join(''); lbEl.hidden = false; document.body.style.overflow = 'hidden'; lbShow(i); lbEl.querySelector('[data-lbclose]').focus(); }
function closeLb() { if (lbEl.hidden) return; lbEl.hidden = true; document.body.style.overflow = ''; }
document.getElementById('lbprev').onclick = () => lbShow(gi - 1); document.getElementById('lbnext').onclick = () => lbShow(gi + 1);
document.getElementById('lbthumbs').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) lbShow(+b.dataset.t); });
lbEl.addEventListener('click', e => { if (e.target.closest('[data-lbclose]') || e.target.classList.contains('stage')) closeLb(); });
(() => { let x = null; lbEl.addEventListener('touchstart', e => { x = e.touches[0].clientX; }, { passive: true }); lbEl.addEventListener('touchend', e => { if (x === null) return; const d = e.changedTouches[0].clientX - x; if (Math.abs(d) > 40) lbShow(gi + (d < 0 ? 1 : -1)); x = null; }, { passive: true }); })();

/* search */
const sov = document.getElementById('sov');
function openSearch() { sov.hidden = false; document.body.style.overflow = 'hidden'; const q = document.getElementById('sq'); q.value = ''; runSearch(''); document.getElementById('sclear').hidden = true; setTimeout(() => q.focus(), 30); }
document.getElementById('sclear').addEventListener('click', e => { e.preventDefault(); const q = document.getElementById('sq'); q.value = ''; runSearch(''); e.currentTarget.hidden = true; q.focus(); });
function closeSearch() { if (sov.hidden) return; sov.hidden = true; document.body.style.overflow = ''; }
document.getElementById('openSearch').onclick = openSearch; document.getElementById('closeSearch').onclick = closeSearch;
document.getElementById('shint').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { const q = document.getElementById('sq'); q.value = b.textContent; runSearch(q.value); document.getElementById('sclear').hidden = false; } });
sov.addEventListener('click', e => { if (e.target.closest('#sres a')) closeSearch(); });
function runSearch(q) {
  const r = document.getElementById('sres'); q = q.trim().toLowerCase();
  if (!q) { r.innerHTML = ''; return; }
  const m = s => String(s).toLowerCase().includes(q);
  const d = DS.filter(x => m(x.code + ' ' + x.name + ' ' + x.sub + ' ' + x.st.map(stName).join(' ') + ' ' + x.text + ' ' + (x.bed ? x.bed + ' ห้องนอน' : ''))).slice(0, 6);
  const p = PJ.filter(x => m(x.t + ' ' + x.title + ' ' + x.loc + ' ' + x.type)).slice(0, 6);
  const a = POSTS.filter(x => m(x.t + ' ' + x.ex)).slice(0, 6);
  const row = (href, k, b, s) => `<a href="${href}"><img src="${SRC(k, 's')}" alt=""><span><b>${esc(b)}</b><small>${esc(s)}</small></span></a>`;
  r.innerHTML = (d.length ? `<div class="grp"><h4>แบบบ้าน (${d.length})</h4><div class="res">${d.map(x => row('#plan-' + x.slug, x.key, x.code + (x.name ? ' · ' + x.name : ''), `${x.st.map(stName).join(', ')} · ${fmt(x.area)} ตร.ม.`)).join('')}</div></div>` : '')
    + (p.length ? `<div class="grp"><h4>ผลงาน (${p.length})</h4><div class="res">${p.map(x => row('#project-' + x.id, x.cover, x.title, x.type)).join('')}</div></div>` : '')
    + (a.length ? `<div class="grp"><h4>บทความ (${a.length})</h4><div class="res">${a.map(x => row('#article-' + x.id, x.key, x.t, CATN[x.cat] + ' · ' + thDate(x.date))).join('')}</div></div>` : '')
    || `<div class="snone"><span class="sic">${u('search')}</span><b>ไม่พบผลลัพธ์สำหรับ “${esc(q)}”</b><p>ลองคำอื่น เช่น Modern, เขาใหญ่ หรือ 4 ห้องนอน</p><div class="sgo"><a class="btn dark" href="#design">ดูแบบบ้านทั้งหมด ${u('arr')}</a><a class="btn line" href="#projects">ดูผลงาน</a></div></div>`;
}

/* language (mockup) */
function setLang(l) {
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  document.querySelectorAll('[data-en]').forEach(el => { if (!el.dataset.th) el.dataset.th = el.textContent; el.textContent = l === 'en' ? el.dataset.en : el.dataset.th; });
  document.documentElement.lang = l;
  toast(l === 'en' ? 'English: เมนูเปลี่ยนเป็นภาษาอังกฤษ เนื้อหาจริงแปลผ่าน TranslatePress' : 'ภาษาไทย');
}

/* drawer + mega menu */
const dr = document.getElementById('drawer'), bg = document.getElementById('burger');
function closeDrawer() { dr.classList.remove('open'); dr.setAttribute('aria-hidden', 'true'); bg.setAttribute('aria-expanded', 'false'); }
bg.onclick = () => { dr.classList.add('open'); dr.setAttribute('aria-hidden', 'false'); bg.setAttribute('aria-expanded', 'true'); };
dr.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.closest('a')) closeDrawer(); });
document.getElementById('mega').innerHTML = `<div class="mg-styles"><span class="mg-k">สไตล์บ้าน</span>${Object.entries(STY).map(([k, s]) => `<a href="#design-${k}"><img class="mi" src="${SRC(s.img, 's')}" alt=""><span>${s.n}<small>${s.th.split(' · ')[0]} · ${DS.filter(d => d.st.includes(k)).length} แบบ</small></span></a>`).join('')}</div>
  <div class="mg-side"><span class="mg-k">คอลเลกชันพิเศษ</span>
   <a class="mg-feat" href="#more-is-more"><img src="${SRC('d-s019', 's')}" alt=""><span class="mg-ft"><b>More Is More</b><small>6 คฤหาสน์ Super Luxury</small></span></a>
   <a class="mg-feat sm" href="#a-life-of-style"><img src="img/x/s/hero-timeless.webp" alt=""><span class="mg-ft"><b>A Life of Style</b><small>3 แบบบ้านคอลเลกชันใหม่</small></span></a></div>
  <a class="mg-all" href="#design"><span>ดูแบบบ้านทั้งหมด <b class="n">${DS.length}</b> แบบ</span>${u('arr')}</a>`;
document.querySelectorAll('.dd .panel a').forEach(a => a.addEventListener('click', () => document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open'))));

/* ---------- images: soft fade-in + load ahead before scrolling ---------- */
function imgMark(im) {
  if (im.dataset.lz || im.closest('#himg')) return; im.dataset.lz = 1;
  if (im.complete && im.naturalWidth) return;
  im.classList.add('ld');
  const done = () => { im.classList.remove('ld'); im.classList.add('fin'); };
  im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true });
}
let pfT;
function prefetchLazy() {
  clearTimeout(pfT);
  const go = () => {
    const q = [...document.querySelectorAll('.view.on img[loading="lazy"]')];
    const step = () => { q.splice(0, 4).forEach(im => { im.loading = 'eager'; }); if (q.length) pfT = setTimeout(step, 250); };
    pfT = setTimeout(step, 500);
  };
  if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
}
new MutationObserver(ms => {
  let any = false;
  for (const m of ms) m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') { imgMark(n); any = true; } else n.querySelectorAll('img').forEach(i => { imgMark(i); any = true; }); });
  if (any) prefetchLazy();
}).observe(document.getElementById('app'), { childList: true, subtree: true });
/* ---------- floating contact button ---------- */
(() => {
  const box = document.getElementById('cfab'), btn = document.getElementById('cfabBtn');
  const set = o => { box.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'ปิดช่องทางติดต่อ' : 'ติดต่อเรา'); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!box.classList.contains('open')); });
  document.addEventListener('pointerdown', e => { if (!box.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { set(false); btn.focus(); } });
  window.addEventListener('hashchange', () => set(false));
})();
/* ---------- YouTube player (loads only on click) ---------- */
(() => {
  const m = document.getElementById('ytm'), f = document.getElementById('ytf'), tt = document.getElementById('ytt'), op = document.getElementById('ytopen');
  let last = null, cur = '';
  const fallback = () => { f.innerHTML = `<div class="ytfb"><img src="img/yt/${cur}.webp" alt=""><div><b>เปิดดูวิดีโอบน YouTube</b><a class="btn gold" href="https://www.youtube.com/watch?v=${cur}" target="_blank" rel="noopener">${u('play')}ดูบน YouTube</a></div></div>`; };
  const open = (id, title, from) => {
    cur = id; last = from; tt.textContent = title || 'W House'; op.href = 'https://www.youtube.com/watch?v=' + id;
    f.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="${esc(title || 'W House')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    m.hidden = false; document.body.style.overflow = 'hidden'; m.querySelector('[data-ytclose]').focus();
  };
  const close = () => { if (m.hidden) return; m.hidden = true; f.innerHTML = ''; document.body.style.overflow = ''; if (last) last.focus(); };
  document.addEventListener('click', e => { const b = e.target.closest('[data-yt]'); if (b) { e.preventDefault(); e.stopPropagation(); open(b.dataset.yt, b.dataset.ytt, b); } }, true);
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-ytclose]')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('securitypolicyviolation', e => { if (!m.hidden && /youtube/.test(e.blockedURI || '')) fallback(); });
  window.addEventListener('hashchange', close);
})();
syncSaved(); route();
