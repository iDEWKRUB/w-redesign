(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.WH_DESIGNS || [];
  const byK = Object.fromEntries(D.map(d => [d.k, d]));
  const LABEL = { modern: 'Modern', tropical: 'Tropical', contemporary: 'Contemporary', classic: 'Classic', villa: 'Villa', special: 'Special Design' };
  const TH = { modern: 'โมเดิร์น', tropical: 'ทรอปิคอล', contemporary: 'ร่วมสมัย', classic: 'คลาสสิก · วิลล่า', special: 'Special Design' };
  const styleOf = d => d.st.map(s => LABEL[s]).filter(Boolean).join(' · ');
  const FILTERS = [
    ['all', 'ทั้งหมด', () => true],
    ['modern', 'Modern', d => d.st.includes('modern')],
    ['tropical', 'Tropical', d => d.st.includes('tropical')],
    ['contemporary', 'Contemporary', d => d.st.includes('contemporary')],
    ['classic', 'Classic & Villa', d => d.st.includes('classic') || d.st.includes('villa')],
    ['special', 'Special Design', d => d.st.includes('special')]
  ];
  const num = n => n.toLocaleString('en-US');
  const title = d => d.name || d.code;
  const subline = d => [d.name ? d.code : '', d.sub, d.dim].filter(Boolean).join(' · ') || styleOf(d);
  const specs = d => [
    d.area && `<span><svg><use href="#i-area"/></svg>${num(d.area)} ตร.ม.</span>`,
    d.bed && `<span><svg><use href="#i-bed"/></svg>${d.bed}</span>`,
    d.bath && `<span><svg><use href="#i-bath"/></svg>${d.bath}</span>`,
    d.park && `<span><svg><use href="#i-car"/></svg>${d.park}</span>`
  ].filter(Boolean).join('');
  const aria = d => [title(d), d.area && `${num(d.area)} ตารางเมตร`, d.bed && `${d.bed} ห้องนอน`, d.bath && `${d.bath} ห้องน้ำ`, d.park && `ที่จอดรถ ${d.park} คัน`].filter(Boolean).join(', ');

  const heart = d => `<button class="fav" type="button" data-fav="${d.k}" aria-pressed="${window.WHFav && WHFav.has(d.k)}" aria-label="ถูกใจ ${title(d)}"><svg><use href="#i-heart"/></svg></button>`;
  const card = (d, kind = '') => `<div class="dcw ${kind}">${heart(d)}<a class="dc ${kind}" href="#d-${d.k}" data-k="${d.k}" aria-label="${aria(d)}">
    <div class="dc-ph"><img src="img/d/${d.k}.jpg" alt="" loading="lazy">${d.two ? `<img class="b" src="img/d/${d.k}-2.jpg" alt="" loading="lazy">` : ''}${kind === 'poster' ? '' : `<span class="dc-tag">${styleOf(d)}</span>`}</div>
    <div class="dc-body">
      <p class="dc-name"><b>${title(d)}</b><span>${kind === 'poster' ? (d.sub || styleOf(d)) : subline(d)}</span></p>
      <p class="specs">${specs(d)}</p>
      <span class="dc-go" aria-hidden="true"><svg><use href="#i-arr"/></svg></span>
    </div></a></div>`;

  const list = $('#dlist');
  let current = 'all', order = [];
  const section = (title, en, items, grid, kind) => items.length ? `<section class="dsec">
      <header class="dband"><h2>${title}</h2><p>${en}</p></header>
      <div class="wrap"><div class="dgrid ${grid}">${items.map(d => card(d, kind)).join('')}</div></div></section>` : '';

  const render = key => {
    current = key;
    const f = FILTERS.find(x => x[0] === key) || FILTERS[0];
    if (key === 'all') {
      const sig = D.filter(d => d.concept === 'alife');
      const pop = D.filter(d => d.pop && d.concept !== 'alife');
      const spe = D.filter(d => d.concept === 'mim');
      const rest = D.filter(d => !sig.includes(d) && !pop.includes(d) && !spe.includes(d));
      order = [...sig, ...pop, ...spe, ...rest];
      list.innerHTML = section('A Life in Style', 'Signature Collection', sig, 'g3', 'poster')
        + section('แบบบ้านยอดนิยม', 'Most Loved', pop, 'g3', '')
        + section('Special Design · บ้านขนาดใหญ่', 'Grand Residences', spe, 'g2', 'wide')
        + section('แบบบ้านเพิ่มเติม', 'More Designs', rest, 'g3', '');
    } else {
      order = D.filter(f[2]);
      list.innerHTML = `<section class="dsec flat"><div class="wrap"><div class="flat-h"><h2>${f[1]} <small style="font-size:.6em;color:var(--soft);font-weight:400">${TH[key] || ''}</small></h2><span>${order.length} แบบ</span></div>
        <div class="dgrid g3">${order.map(d => card(d)).join('')}</div></div></section>`;
    }
    $$('.chip').forEach(c => c.setAttribute('aria-selected', c.dataset.f === key));
    reveal();
  };

  // Filter chips with live counts
  $('#filters .df-in').innerHTML = FILTERS.map(([k, label, fn]) =>
    `<button class="chip" role="tab" type="button" data-f="${k}" aria-selected="false">${label}<small>${D.filter(fn).length}</small></button>`).join('');
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    render(c.dataset.f);
    history.replaceState(null, '', c.dataset.f === 'all' ? location.pathname + location.search : '#' + c.dataset.f);
    // Bring the top of the new list into view (measure the list: the sticky bar reports its stuck position)
    const df = $('#filters'), lst = $('#dlist');
    const top = lst.getBoundingClientRect().top + scrollY - df.offsetHeight - (parseFloat(getComputedStyle(df).top) || 0);
    if (Math.abs(scrollY - top) > 4 && scrollY > top - innerHeight * .5) scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
  }));

  // Cards rise in as they enter
  let io = null;
  const reveal = () => {
    if (RM || !('IntersectionObserver' in window)) return;
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.dc', list).forEach((el, i) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('rv'); el.style.setProperty('--d', (i % 3) * 90 + 'ms'); io.observe(el);
    });
  };

  // Detail sheet
  const dd = $('#dd');
  let at = -1;
  const show = (k, push = true) => {
    const d = byK[k]; if (!d) return;
    if (!order.includes(d)) render('all');
    at = order.indexOf(d);
    const imgs = [`img/d/${d.k}.jpg`, ...(d.two ? [`img/d/${d.k}-2.jpg`] : [])];
    const main = $('#ddImg');
    const setImg = i => {
      main.src = imgs[i]; main.alt = `${title(d)} มุมที่ ${i + 1}`;
      main.style.animation = 'none'; void main.offsetWidth; main.style.animation = '';
      $$('#ddThumbs button').forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    };
    $('#ddThumbs').innerHTML = imgs.length > 1 ? imgs.map((s, i) => `<button type="button" aria-label="ดูมุมที่ ${i + 1}" aria-pressed="false"><img src="${s}" alt=""></button>`).join('') : '';
    $$('#ddThumbs button').forEach((b, i) => b.addEventListener('click', () => setImg(i)));
    setImg(0);
    $('#ddStyle').textContent = styleOf(d) + (d.concept === 'alife' ? ' · A Life in Style' : '');
    $('#dd-name').textContent = title(d);
    $('#ddSub').textContent = [d.name ? d.code : '', d.sub].filter(Boolean).join(' · ') || 'แบบบ้าน W House';
    $('#ddSpecs').innerHTML = [
      d.area && ['i-area', 'พื้นที่ใช้สอย', `${num(d.area)} ตร.ม.`],
      d.bed && ['i-bed', 'ห้องนอน', d.bed],
      d.bath && ['i-bath', 'ห้องน้ำ', d.bath],
      d.park && ['i-car', 'ที่จอดรถ', `${d.park} คัน`],
      d.dim && ['i-frame', 'ขนาดที่ดินที่เหมาะสม', d.dim, 'full']
    ].filter(Boolean).map(([ic, t, v, cls]) => `<div class="${cls || ''}"><svg><use href="#${ic}"/></svg><dt>${t}</dt><dd>${v}</dd></div>`).join('');
    $('#ddText').textContent = d.text ? d.text.replace(/\s+/g, ' ').trim().replace(/([^.。])$/, '$1…') : '';
    $('#ddPos').textContent = `${at + 1} / ${order.length}`;
    $('#ddPrev').disabled = at <= 0;
    $('#ddNext').disabled = at >= order.length - 1;
    if (!dd.open) { dd.showModal(); document.documentElement.style.overflow = 'hidden'; }
    $('#ddBook').href = 'contact.html#d-' + d.k;
    const df = $('#ddFav'); df.dataset.fav = d.k; df.setAttribute('aria-pressed', WHFav.has(d.k)); df.querySelector('span').textContent = WHFav.has(d.k) ? 'ถูกใจแล้ว' : 'ถูกใจ';
    if (push) history.replaceState(null, '', '#d-' + d.k);
  };
  const closeDd = () => dd.close();
  dd.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    history.replaceState(null, '', current === 'all' ? location.pathname + location.search : '#' + current);
  });
  $('#ddClose').addEventListener('click', closeDd);
  dd.addEventListener('click', e => { if (e.target === dd) closeDd(); });
  $('#ddPrev').addEventListener('click', () => at > 0 && show(order[at - 1].k));
  $('#ddNext').addEventListener('click', () => at < order.length - 1 && show(order[at + 1].k));
  dd.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && at < order.length - 1) show(order[at + 1].k);
    if (e.key === 'ArrowLeft' && at > 0) show(order[at - 1].k);
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a.dc, [data-open]');
    if (!a) return;
    e.preventDefault();
    show(a.dataset.k || a.dataset.open);
  });

  // Deep links: #modern (filter) or #d-m062 (open a design); menu tiles on this page use the same hashes
  const fromHash = () => {
    const h = location.hash.slice(1);
    if (h.startsWith('d-') && byK[h.slice(2)]) show(h.slice(2), false);
    else if (FILTERS.some(f => f[0] === h)) { render(h); window.WH_closeMenu && window.WH_closeMenu(); $('#filters').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }
  };
  addEventListener('hashchange', fromHash);
  render('all');
  fromHash();

  /* ---------- Hearts → tray → compare ---------- */
  const FX = !RM;
  const heartSvg = '<svg viewBox="0 0 24 24"><use href="#i-heart"/></svg>';
  const burst = el => {
    if (!FX) return;
    const r = el.getBoundingClientRect(), b = document.createElement('div');
    b.className = 'burst'; b.style.transform = `translate(${r.left + r.width / 2}px, ${r.top + r.height / 2}px)`;
    let html = '<b></b>';
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14 + Math.random() * .4, dist = 46 + Math.random() * 52;
      html += `<i style="--tx:${Math.cos(a) * dist}px;--ty:${Math.sin(a) * dist - 14}px;--r:${(Math.random() * 80 - 40) | 0}deg;--s:${(.6 + Math.random() * .8).toFixed(2)};animation-delay:${(Math.random() * 60) | 0}ms">${heartSvg}</i>`;
    }
    b.innerHTML = html; document.body.appendChild(b); setTimeout(() => b.remove(), 1100);
  };
  // the chosen house flies into the tray
  const flyTo = (fromEl, k) => {
    if (!FX || !fromEl) return;
    const src = fromEl.getBoundingClientRect(), slot = $(`#trayThumbs [data-k="${k}"]`) || $('#tray');
    const dst = slot.getBoundingClientRect();
    const ghost = document.createElement('img');
    ghost.src = `img/d/${k}.jpg`; ghost.className = 'ghost';
    Object.assign(ghost.style, { left: src.left + 'px', top: src.top + 'px', width: src.width + 'px', height: src.height + 'px' });
    document.body.appendChild(ghost);
    const dx = dst.left + dst.width / 2 - (src.left + src.width / 2), dy = dst.top + dst.height / 2 - (src.top + src.height / 2);
    const s = Math.max(.08, dst.width / src.width);
    ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1, borderRadius: '18px' },
      { transform: `translate(${dx * .35}px, ${dy * .35 - 120}px) scale(.55) rotate(-8deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0)`, opacity: .2, borderRadius: '50%' }
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).onfinish = () => {
      ghost.remove();
      if (slot.animate) slot.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    };
  };
  const tray = $('#tray');
  const renderTray = () => {
    const favs = WHFav.all().map(k => byK[k]).filter(Boolean);
    $('#trayN').textContent = favs.length;
    $('#trayThumbs').innerHTML = favs.map(d => `<button type="button" data-k="${d.k}" aria-label="ดู ${title(d)}"><img src="img/d/${d.k}.jpg" alt=""></button>`).join('')
      + Array.from({ length: WHFav.MAX - favs.length }, () => '<span class="empty" aria-hidden="true"></span>').join('');
    $('#trayGo').disabled = favs.length < 2;
    $('#trayGo span').textContent = favs.length < 2 ? 'เลือกอีก ' + (2 - favs.length) + ' แบบ' : 'เปรียบเทียบ ' + favs.length + ' แบบ';
    if (favs.length && tray.hidden) { tray.hidden = false; requestAnimationFrame(() => tray.classList.add('in')); }
    if (!favs.length && !tray.hidden) { tray.classList.remove('in'); setTimeout(() => { if (!WHFav.all().length) tray.hidden = true; }, 500); }
    $$('[data-fav]').forEach(b => b.setAttribute('aria-pressed', WHFav.has(b.dataset.fav)));
    const df = $('#ddFav'); if (df.dataset.fav) df.querySelector('span').textContent = WHFav.has(df.dataset.fav) ? 'ถูกใจแล้ว' : 'ถูกใจ';
  };
  const toggleFav = (k, btn, imgEl) => {
    const res = WHFav.toggle(k);
    if (res === null) {
      window.WH_toast && WH_toast('เปรียบเทียบได้สูงสุด 4 แบบ · เอาออกก่อน 1 แบบ');
      tray.animate && tray.animate([{ transform: 'translate(-50%,0)' }, { transform: 'translate(calc(-50% - 10px),0)' }, { transform: 'translate(calc(-50% + 10px),0)' }, { transform: 'translate(-50%,0)' }], { duration: 380 });
      return;
    }
    renderTray();
    if (res) { burst(btn); requestAnimationFrame(() => flyTo(imgEl, k)); }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const k = b.dataset.fav;
    const img = b.id === 'ddFav' ? $('#ddImg') : b.parentElement.querySelector('.dc-ph img');
    toggleFav(k, b, img);
  }, true);
  $('#trayThumbs').addEventListener('click', e => { const t = e.target.closest('[data-k]'); if (t) show(t.dataset.k); });
  $('#trayClear').addEventListener('click', () => { WHFav.clear(); renderTray(); });
  WHFav.on(() => { renderTray(); if (cmp.open) renderCmp(); });

  // Compare sheet
  const cmp = $('#cmp');
  const ROWS = [
    ['style', 'สไตล์', d => styleOf(d) + (d.sub ? ' · ' + d.sub : '')],
    ['area', 'พื้นที่ใช้สอย', d => d.area, 'ตร.ม.', 'i-area'],
    ['bed', 'ห้องนอน', d => d.bed, 'ห้อง', 'i-bed'],
    ['bath', 'ห้องน้ำ', d => d.bath, 'ห้อง', 'i-bath'],
    ['park', 'ที่จอดรถ', d => d.park, 'คัน', 'i-car'],
    ['dim', 'ขนาดที่ดินที่เหมาะสม', d => d.dim || '—']
  ];
  const renderCmp = () => {
    const favs = WHFav.all().map(k => byK[k]).filter(Boolean);
    if (favs.length < 2) { cmp.close(); return; }
    const best = {};
    ROWS.filter(r => r[3]).forEach(([key, , get]) => { best[key] = Math.max(...favs.map(d => get(d) || 0)); });
    const col = (d, i) => `<section class="cmp-col" style="--i:${i}">
      <div class="cmp-ph"><img src="img/d/${d.k}.jpg" alt=""><button class="cmp-rm" type="button" data-rm="${d.k}" aria-label="เอา ${title(d)} ออก"><svg><use href="#i-x"/></svg></button></div>
      <h3>${title(d)}</h3><p class="cmp-code">${d.name ? d.code : styleOf(d)}</p>
      <dl>${ROWS.map(([key, label, get, unit, ic]) => {
        const v = get(d);
        if (!unit) return `<div class="row t"><dt>${label}</dt><dd>${v}</dd></div>`;
        const win = v && v === best[key] && favs.filter(x => get(x) === v).length < favs.length;
        const pct = v && best[key] ? Math.round((v / best[key]) * 100) : 0;
        return `<div class="row n${win ? ' win' : ''}"><dt><svg><use href="#${ic}"/></svg>${label}</dt><dd><b data-to="${v || 0}">${v ? 0 : '—'}</b>${v ? ' ' + unit : ''}${win ? '<span class="crown"><svg><use href="#i-crown2"/></svg>มากที่สุด</span>' : ''}</dd><i class="bar"><s style="--w:${pct}%"></s></i></div>`;
      }).join('')}</dl>
      <div class="cmp-act"><button class="btn-ghost" type="button" data-open-d="${d.k}">ดูรายละเอียด</button><a class="btn-more" href="contact.html#d-${d.k}">นัดคุยแบบนี้ <svg><use href="#i-arr"/></svg></a></div>
    </section>`;
    $('#cmpBody').innerHTML = `<div class="cmp-grid" style="--n:${favs.length}">${favs.map(col).join('')}</div>`;
    // numbers count up, bars grow
    requestAnimationFrame(() => {
      $$('#cmpBody .bar s').forEach((s, i) => setTimeout(() => s.classList.add('go'), FX ? 250 + i * 40 : 0));
      $$('#cmpBody [data-to]').forEach(el => {
        const to = +el.dataset.to; if (!to) return;
        if (!FX) { el.textContent = to.toLocaleString('en-US'); return; }
        const t0 = performance.now() + 250, dur = 1100;
        const step = now => { const p = Math.min(1, Math.max(0, (now - t0) / dur)); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US'); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    });
  };
  const openCmp = from => {
    renderCmp();
    if (WHFav.all().length < 2) return;
    if (dd.open) dd.close();
    const r = (from || $('#trayGo')).getBoundingClientRect();
    cmp.style.setProperty('--ox', (r.left + r.width / 2) + 'px'); cmp.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
    cmp.showModal(); document.documentElement.style.overflow = 'hidden';
    history.replaceState(null, '', '#compare');
  };
  cmp.addEventListener('close', () => { document.documentElement.style.overflow = ''; history.replaceState(null, '', current === 'all' ? location.pathname : '#' + current); });
  $('#trayGo').addEventListener('click', e => openCmp(e.currentTarget));
  $('#cmpClose').addEventListener('click', () => cmp.close());
  cmp.addEventListener('click', e => {
    const rm = e.target.closest('[data-rm]'); if (rm) { const c = rm.closest('.cmp-col'); if (FX && c.animate) c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.9) translateY(20px)' }], { duration: 300, fill: 'forwards' }).onfinish = () => WHFav.remove(rm.dataset.rm); else WHFav.remove(rm.dataset.rm); return; }
    const od = e.target.closest('[data-open-d]'); if (od) { cmp.close(); show(od.dataset.openD); }
  });
  renderTray();
  if (location.hash === '#compare') setTimeout(() => (WHFav.all().length >= 2 ? openCmp() : window.WH_toast && WH_toast('กดหัวใจที่แบบบ้านอย่างน้อย 2 แบบเพื่อเปรียบเทียบ')), 300);

  // Filter bar sits under the header while the header is showing
  const hd = $('#hd'), df = $('#filters');
  const syncTop = () => df.style.setProperty('--df-top', hd.classList.contains('hide') ? '0px' : hd.offsetHeight + 'px');
  new MutationObserver(syncTop).observe(hd, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', syncTop);
  syncTop();

})();
