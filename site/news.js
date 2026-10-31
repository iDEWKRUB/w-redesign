(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const POSTS = window.WH_POSTS || [];
  const CATS = [['all', 'ทั้งหมด'], ['blog', 'บทความ'], ['news', 'ข่าวสาร'], ['event', 'กิจกรรม'], ['reviews', 'รีวิวลูกค้า']];
  const CAT = Object.fromEntries(CATS);
  const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = s => { const d = new Date(s); return `${d.getDate()} ${TH_MONTH[d.getMonth()]} ${d.getFullYear() + 543}`; };
  const img = p => `img/a/${p.k}.jpg`;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const meta = p => `${CAT[p.c]}<time datetime="${p.date}">${thDate(p.date)}</time>`;

  // Hero: the latest story
  const latest = POSTS[0];
  if (latest) {
    $('#nhImg').src = img(latest);
    $('#nhMeta').innerHTML = meta(latest);
    $('#nhTitle').textContent = latest.t;
    $('#nhRead').addEventListener('click', () => open(latest, POSTS));
  }

  const card = p => `<a class="dc ncard" href="#n-${p.id}" data-id="${p.id}">
    <div class="dc-ph"><img src="${img(p)}" alt="" loading="lazy"></div>
    <div class="dc-body"><p class="nmeta">${meta(p)}</p><h3>${esc(p.t)}</h3><p>${esc(p.ex)}</p></div></a>`;

  const list = $('#nlist');
  let cat = 'all', order = [];
  const render = c => {
    cat = c;
    order = POSTS.filter(p => c === 'all' || p.c === c);
    list.innerHTML = `<section class="dsec flat"><div class="wrap"><div class="flat-h"><h2>${c === 'all' ? 'เรื่องล่าสุด' : CAT[c]}</h2><span>${order.length} เรื่อง</span></div>
      <div class="dgrid g3">${order.map(card).join('')}</div></div></section>`;
    $$('.chip').forEach(b => b.setAttribute('aria-selected', b.dataset.c === c));
    reveal();
  };
  $('#nTabs').innerHTML = CATS.map(([k, t]) => `<button class="chip" type="button" data-c="${k}">${t}<small>${k === 'all' ? POSTS.length : POSTS.filter(p => p.c === k).length}</small></button>`).join('');
  $$('#nTabs .chip').forEach(b => b.addEventListener('click', () => {
    render(b.dataset.c);
    history.replaceState(null, '', b.dataset.c === 'all' ? location.pathname : '#' + b.dataset.c);
    // Bring the top of the new list into view (measure the list: the sticky bar reports its stuck position)
    const df = $('#filters'), lst = $('#nlist');
    const top = lst.getBoundingClientRect().top + scrollY - df.offsetHeight - (parseFloat(getComputedStyle(df).top) || 0);
    if (Math.abs(scrollY - top) > 4 && scrollY > top - innerHeight * .5) scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
  }));

  let io = null;
  const reveal = () => {
    if (RM || !('IntersectionObserver' in window)) return;
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.dc', list).forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight) return; el.classList.add('rv'); el.style.setProperty('--d', (i % 3) * 90 + 'ms'); io.observe(el); });
  };

  // Reader
  const rd = $('#reader');
  let seq = [], at = -1;
  const open = (p, within) => {
    seq = within || order; at = seq.indexOf(p);
    $('#rdImg').src = img(p); $('#rdImg').alt = '';
    $('#rdMeta').innerHTML = meta(p);
    $('#rd-t').textContent = p.t;
    $('#rdText').innerHTML = (p.paras && p.paras.length ? p.paras : [p.ex]).map(t => `<p>${esc(t)}</p>`).join('');
    $('#rdPos').textContent = `${at + 1} / ${seq.length}`;
    $('#rdPrev').disabled = at <= 0; $('#rdNext').disabled = at >= seq.length - 1;
    if (!rd.open) { rd.showModal(); document.documentElement.style.overflow = 'hidden'; }
    $('.reader-card').scrollTop = 0;
    history.replaceState(null, '', '#n-' + p.id);
  };
  rd.addEventListener('close', () => { document.documentElement.style.overflow = ''; history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat); });
  $('#rdClose').addEventListener('click', () => rd.close());
  rd.addEventListener('click', e => { if (e.target === rd) rd.close(); });
  $('#rdPrev').addEventListener('click', () => at > 0 && open(seq[at - 1], seq));
  $('#rdNext').addEventListener('click', () => at < seq.length - 1 && open(seq[at + 1], seq));
  list.addEventListener('click', e => { const a = e.target.closest('a.dc'); if (!a) return; e.preventDefault(); open(order.find(p => p.id === +a.dataset.id)); });

  const fromHash = () => {
    const h = location.hash.slice(1);
    if (h.startsWith('n-')) { render('all'); const p = POSTS.find(x => x.id === +h.slice(2)); if (p) open(p); }
    else render(CAT[h] ? h : 'all');
  };
  addEventListener('hashchange', fromHash);
  fromHash();

  const hd = $('#hd'), df = $('#filters');
  const syncTop = () => df.style.setProperty('--df-top', hd.classList.contains('hide') ? '0px' : hd.offsetHeight + 'px');
  new MutationObserver(syncTop).observe(hd, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', syncTop); syncTop();
})();
