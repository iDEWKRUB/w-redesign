(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { done: DONE, ongoing: ONG } = window.WH_PROJECTS;
  const AREAS = [['all', 'ทั้งหมด'], ['bkk', 'กรุงเทพฯ'], ['khaoyai', 'เขาใหญ่'], ['coast', 'ชายทะเล']];
  const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = s => { const d = new Date(s); return `${d.getDate()} ${TH_MONTH[d.getMonth()]} ${d.getFullYear() + 543}`; };
  const cover = p => p.gal && p.gal.length ? `img/${p.gal[0]}.jpg` : `img/p/${p.k}.jpg`;
  const gallery = p => p.gal && p.gal.length ? p.gal.map(g => `img/${g}.jpg`) : [`img/p/${p.k}.jpg`];
  // Ongoing titles read "บ้านพักอาศัย 2 ชั้น | Modern Style, เขาใหญ่" — split into a title and a line
  const split = t => { const [a, b] = t.split('|').map(s => s.trim()); return b ? [b, a] : [a, '']; };

  // Stats in the hero, counted from the data
  const n = a => DONE.filter(p => p.area === a).length;
  $('#pStats').innerHTML = [['สร้างเสร็จแล้ว', DONE.length, 'หลัง'], ['กำลังก่อสร้าง', ONG.length, 'หลัง'], ['กรุงเทพฯ', n('bkk'), 'หลัง'], ['เขาใหญ่', n('khaoyai'), 'หลัง']]
    .map(([t, v, u]) => `<div><dt>${t}</dt><dd>${v}<small>${u}</small></dd></div>`).join('');

  const specs = p => [
    p.sqm && `<span><svg><use href="#i-area"/></svg>${p.sqm.toLocaleString('en-US')} ตร.ม.</span>`,
    p.fl && `<span><svg><use href="#i-frame"/></svg>${p.fl} ชั้น</span>`,
    p.bed && `<span><svg><use href="#i-bed"/></svg>${p.bed}</span>`,
    p.bath && `<span><svg><use href="#i-bath"/></svg>${p.bath}</span>`
  ].filter(Boolean).join('');
  const card = (p, kind = '') => `<a class="dc ${kind}" href="#p-${p.id}" data-id="${p.id}">
      <div class="dc-ph"><img src="${cover(p)}" alt="" loading="lazy"><span class="dc-tag">${p.areaTh}</span></div>
      <div class="dc-body"><p class="dc-name"><b>${p.t}</b><span>${[p.type, p.sn, p.loc].filter(Boolean).join(' · ')}</span></p>
      <p class="specs">${specs(p)}</p><span class="dc-go" aria-hidden="true"><svg><use href="#i-arr"/></svg></span></div></a>`;
  const ocard = o => { const [t, s] = split(o.t); return `<a class="dc small" href="#o-${o.id}" data-oid="${o.id}">
      <div class="dc-ph"><img src="img/p/${o.k}.jpg" alt="" loading="lazy"><span class="dc-tag build">กำลังก่อสร้าง</span></div>
      <div class="dc-body"><p class="dc-name"><b>${t}</b><span>${s}</span></p><p class="specs"><span><svg><use href="#i-clock"/></svg>อัปเดต ${thDate(o.date)}</span></p><span class="dc-go" aria-hidden="true"><svg><use href="#i-arr"/></svg></span></div></a>`; };
  const band = (t, en, inner) => `<section class="dsec"><header class="dband"><h2>${t}</h2><p>${en}</p></header><div class="wrap">${inner}</div></section>`;

  const list = $('#plist');
  let state = { tab: 'done', area: 'all' }, order = [];
  const render = () => {
    if (state.tab === 'ongoing') {
      order = ONG.map(o => ({ ...o, ong: true }));
      list.innerHTML = band('กำลังก่อสร้าง', 'Under Construction', `<div class="dgrid pgrid4">${ONG.map(ocard).join('')}</div>`);
    } else if (state.area === 'all') {
      const feat = DONE.filter(p => p.rich), rest = DONE.filter(p => !p.rich);
      order = [...feat, ...rest];
      list.innerHTML = band('ผลงานเด่น', 'Featured Homes', `<div class="dgrid feat">${feat.map(p => card(p)).join('')}</div>`)
        + band('ผลงานทั้งหมด', 'All Completed Homes', `<div class="dgrid pgrid4">${rest.map(p => card(p, 'small')).join('')}</div>`);
    } else {
      order = DONE.filter(p => p.area === state.area).sort((a, b) => b.rich - a.rich);
      const label = AREAS.find(a => a[0] === state.area)[1];
      list.innerHTML = `<section class="dsec flat"><div class="wrap"><div class="flat-h"><h2>ผลงานใน${label}</h2><span>${order.length} หลัง</span></div><div class="dgrid pgrid4">${order.map(p => card(p, 'small')).join('')}</div></div></section>`;
    }
    $$('.chip').forEach(c => c.setAttribute('aria-selected', c.dataset.tab ? c.dataset.tab === state.tab : (state.tab === 'done' && c.dataset.area === state.area)));
    $$('.chip[data-area]').forEach(c => { c.hidden = state.tab !== 'done'; });
    $('#pTabs .sep').hidden = state.tab !== 'done';
    reveal();
  };
  $('#pTabs').innerHTML = `<button class="chip" type="button" data-tab="done">สร้างเสร็จแล้ว<small>${DONE.length}</small></button>
    <button class="chip" type="button" data-tab="ongoing">กำลังก่อสร้าง<small>${ONG.length}</small></button><span class="sep" aria-hidden="true"></span>`
    + AREAS.map(([k, t]) => `<button class="chip" type="button" data-area="${k}">${t}<small>${k === 'all' ? DONE.length : n(k)}</small></button>`).join('');
  const go = (patch, hash) => {
    Object.assign(state, patch); render();
    history.replaceState(null, '', hash ? '#' + hash : location.pathname + location.search);
    // Bring the top of the new list into view (measure the list: the sticky bar reports its stuck position)
    const df = $('#filters'), lst = $('#plist');
    const top = lst.getBoundingClientRect().top + scrollY - df.offsetHeight - (parseFloat(getComputedStyle(df).top) || 0);
    if (Math.abs(scrollY - top) > 4 && scrollY > top - innerHeight * .5) scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
  };
  $$('#pTabs .chip').forEach(c => c.addEventListener('click', () => {
    if (c.dataset.tab) go({ tab: c.dataset.tab, area: 'all' }, c.dataset.tab === 'ongoing' ? 'ongoing' : '');
    else go({ tab: 'done', area: c.dataset.area }, c.dataset.area === 'all' ? '' : c.dataset.area);
  }));

  let io = null;
  const reveal = () => {
    if (RM || !('IntersectionObserver' in window)) return;
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.dc', list).forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight) return; el.classList.add('rv'); el.style.setProperty('--d', (i % 4) * 80 + 'ms'); io.observe(el); });
  };

  // Detail sheet
  const pd = $('#pd');
  let at = -1;
  const show = item => {
    at = order.indexOf(item);
    const imgs = item.ong ? [`img/p/${item.k}.jpg`] : gallery(item);
    const main = $('#pdImg');
    const setImg = i => {
      main.src = imgs[i]; main.alt = `ภาพผลงานที่ ${i + 1}`;
      main.style.animation = 'none'; void main.offsetWidth; main.style.animation = '';
      $$('#pdThumbs button').forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    };
    $('#pdThumbs').innerHTML = imgs.length > 1 ? imgs.map((s, i) => `<button type="button" aria-label="ดูภาพที่ ${i + 1}" aria-pressed="false"><img src="${s}" alt="" loading="lazy"></button>`).join('') : '';
    $$('#pdThumbs button').forEach((b, i) => b.addEventListener('click', () => setImg(i)));
    setImg(0);
    if (item.ong) {
      const [t, s] = split(item.t);
      $('#pdKind').textContent = 'กำลังก่อสร้าง · Under Construction';
      $('#pd-name').textContent = t; $('#pdSub').textContent = s;
      $('#pdSpecs').innerHTML = `<div class="full"><svg><use href="#i-clock"/></svg><dt>อัปเดตความคืบหน้าล่าสุด</dt><dd>${thDate(item.date)}</dd></div>`;
      $('#pdText').innerHTML = '<p class="pd-note">ติดตามความคืบหน้าหน้างานได้จากทีมงาน W House โดยตรง</p>';
    } else {
      $('#pdKind').textContent = ['ผลงานสร้างเสร็จ', item.areaTh].filter(Boolean).join(' · ');
      $('#pd-name').textContent = item.t;
      $('#pdSub').textContent = [item.type, item.sn, item.loc].filter(Boolean).join(' · ');
      $('#pdSpecs').innerHTML = [
        item.sqm && ['i-area', 'พื้นที่ใช้สอย', `${item.sqm.toLocaleString('en-US')} ตร.ม.`],
        item.fl && ['i-frame', 'จำนวนชั้น', `${item.fl} ชั้น`],
        item.bed && ['i-bed', 'ห้องนอน', item.bed],
        item.bath && ['i-bath', 'ห้องน้ำ', item.bath],
        item.yr && ['i-check', 'ส่งมอบ', `ปี ${item.yr}`]
      ].filter(Boolean).map(([ic, t, v]) => `<div><svg><use href="#${ic}"/></svg><dt>${t}</dt><dd>${v}</dd></div>`).join('');
      $('#pdText').innerHTML = (item.d.length ? `<p class="dd-text">${item.d.join(' ')}</p>` : '')
        + (item.f.length ? `<ul class="pd-feat">${item.f.map(f => `<li><svg><use href="#i-check"/></svg>${f}</li>`).join('')}</ul>` : '');
    }
    $('#pdPos').textContent = `${at + 1} / ${order.length}`;
    $('#pdPrev').disabled = at <= 0; $('#pdNext').disabled = at >= order.length - 1;
    if (!pd.open) { pd.showModal(); document.documentElement.style.overflow = 'hidden'; }
    history.replaceState(null, '', item.ong ? '#o-' + item.id : '#p-' + item.id);
  };
  pd.addEventListener('close', () => { document.documentElement.style.overflow = ''; history.replaceState(null, '', state.tab === 'ongoing' ? '#ongoing' : state.area === 'all' ? location.pathname : '#' + state.area); });
  $('#pdClose').addEventListener('click', () => pd.close());
  pd.addEventListener('click', e => { if (e.target === pd) pd.close(); });
  $('#pdPrev').addEventListener('click', () => at > 0 && show(order[at - 1]));
  $('#pdNext').addEventListener('click', () => at < order.length - 1 && show(order[at + 1]));
  pd.addEventListener('keydown', e => { if (e.key === 'ArrowRight' && at < order.length - 1) show(order[at + 1]); if (e.key === 'ArrowLeft' && at > 0) show(order[at - 1]); });
  list.addEventListener('click', e => {
    const a = e.target.closest('a.dc'); if (!a) return;
    e.preventDefault();
    show(a.dataset.oid ? order.find(o => o.id === +a.dataset.oid) : order.find(p => p.id === +a.dataset.id));
  });

  const fromHash = () => {
    const h = location.hash.slice(1);
    if (h.startsWith('p-')) { state = { tab: 'done', area: 'all' }; render(); const p = order.find(x => x.id === +h.slice(2)); if (p) show(p); }
    else if (h.startsWith('o-')) { state = { tab: 'ongoing', area: 'all' }; render(); const o = order.find(x => x.id === +h.slice(2)); if (o) show(o); }
    else if (h === 'ongoing') { state = { tab: 'ongoing', area: 'all' }; render(); }
    else if (AREAS.some(a => a[0] === h)) { state = { tab: 'done', area: h }; render(); window.WH_closeMenu && window.WH_closeMenu(); $('#filters').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }
    else render();
  };
  addEventListener('hashchange', fromHash);
  fromHash();

  // Filter bar follows the header
  const hd = $('#hd'), df = $('#filters');
  const syncTop = () => df.style.setProperty('--df-top', hd.classList.contains('hide') ? '0px' : hd.offsetHeight + 'px');
  new MutationObserver(syncTop).observe(hd, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', syncTop); syncTop();
})();
