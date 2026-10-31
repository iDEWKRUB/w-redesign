(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = $('#hd');

  /* Toast */
  const toastEl = $('#toast'); let toastT;
  const toast = msg => {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]:not([data-contact]):not([data-mm-open])');
    if (!a) return;
    e.preventDefault();
    toast('หน้านี้ยังไม่มีในตัวอย่าง');
  });

  /* Mega menu: opens on hover (with a little patience) or click; Esc and the scrim close it */
  const scrim = $('#mmScrim');
  const triggers = $$('.mm-trigger');
  let openKey = null, hoverT = null;
  const panel = k => $(`.mm[data-panel="${k}"]`);
  const openMenu = k => {
    clearTimeout(hoverT);
    if (openKey === k) return;
    if (openKey) panel(openKey).hidden = true;
    openKey = k;
    panel(k).hidden = false;
    triggers.forEach(t => t.setAttribute('aria-expanded', t.dataset.mm === k));
    hd.classList.add('menu-open');
    scrim.hidden = false;
  };
  const closeMenu = () => {
    clearTimeout(hoverT);
    if (!openKey) return;
    panel(openKey).hidden = true;
    openKey = null;
    triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    hd.classList.remove('menu-open');
    scrim.hidden = true;
  };
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  triggers.forEach(t => {
    t.addEventListener('click', () => (openKey === t.dataset.mm ? closeMenu() : openMenu(t.dataset.mm)));
    if (canHover) t.addEventListener('pointerenter', () => { clearTimeout(hoverT); hoverT = setTimeout(() => openMenu(t.dataset.mm), 120); });
  });
  if (canHover) {
    hd.addEventListener('pointerleave', () => { clearTimeout(hoverT); hoverT = setTimeout(closeMenu, 260); });
    hd.addEventListener('pointerenter', () => { if (openKey) clearTimeout(hoverT); });
    $$('.hd-nav a, .hd-logo').forEach(a => a.addEventListener('pointerenter', () => { if (openKey) { clearTimeout(hoverT); hoverT = setTimeout(closeMenu, 200); } }));
  }
  scrim.addEventListener('click', closeMenu);
  addEventListener('keydown', e => { if (e.key === 'Escape' && openKey) { const k = openKey; closeMenu(); $(`.mm-trigger[data-mm="${k}"]`).focus(); } });
  $$('[data-mm-open]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (innerWidth > 1080) openMenu(a.dataset.mmOpen); else location.href = a.dataset.href || 'designs.html';
  }));
  const fromHash = location.hash.replace('#', '');
  if ($('.hm') && ['designs', 'projects'].includes(fromHash) && innerWidth > 1080) openMenu(fromHash);
  // Same-page menu links (e.g. a style tile on the designs page) just close the menu
  $$('.mm a').forEach(a => a.addEventListener('click', () => closeMenu()));
  window.WH_closeMenu = closeMenu;
  window.WH_toast = toast;

  /* Mobile drawer */
  const drawer = $('#drawer'), burger = $('#burger');
  const openDrawer = () => { drawer.hidden = false; burger.setAttribute('aria-expanded', 'true'); $('#drawerClose').focus(); };
  const closeDrawer = (back = true) => { drawer.hidden = true; burger.setAttribute('aria-expanded', 'false'); if (back) burger.focus(); };
  burger.addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', () => closeDrawer());
  $$('#drawer a').forEach(a => a.addEventListener('click', () => closeDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

  /* Contact sheet */
  const ct = $('#contactModal');
  $$('[data-contact]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeMenu(); ct.showModal(); }));
  $('#ctClose').addEventListener('click', () => ct.close());
  ct.addEventListener('click', e => { if (e.target === ct) ct.close(); });
  $$('button.copy[data-copy]').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.dataset.copy;
    const fallback = () => {
      const target = btn.previousElementSibling.querySelector('b');
      const r = document.createRange(); r.selectNodeContents(target);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      toast('เลือกข้อความไว้แล้ว กดคัดลอกได้เลย');
    };
    try { navigator.clipboard.writeText(v).then(() => toast('คัดลอก ' + v + ' แล้ว'), fallback); } catch (e) { fallback(); }
  }));

  /* Film: a new shot every 7s; each drifts for 9s so it is still moving while the next fades in */
  const film = $('#film'), vbtn = $('#vbtn'), cap = $('.hm-cap'), capT = $('#capT'), capS = $('#capS');
  if (film && vbtn) {
  const shots = $$('.shot', film), bars = $$('#filmBars i');
  const HOLD = 7000, DUR = 9000;
  film.style.setProperty('--dur', DUR + 'ms');
  $('#filmBars').style.setProperty('--dur', HOLD + 'ms');
  let cur = 0, timer = null, left = HOLD, startedAt = 0, userPaused = false;
  const restart = el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };
  const schedule = ms => { clearTimeout(timer); left = ms; startedAt = performance.now(); timer = setTimeout(() => show((cur + 1) % shots.length), ms); };
  const setCaption = s => {
    if (!cap || !s.dataset.cap) return;
    const [t, sub] = s.dataset.cap.split('|');
    cap.classList.add('swap');
    setTimeout(() => { capT.textContent = t; capS.textContent = sub; if (s.dataset.k && cap.tagName === 'A') cap.href = 'designs.html#d-' + s.dataset.k; cap.classList.remove('swap'); }, 450);
  };
  const show = i => {
    const prev = shots[cur];
    prev.classList.remove('on'); prev.classList.add('leaving');
    setTimeout(() => prev.classList.remove('leaving'), 2200);
    cur = i;
    const s = shots[cur];
    s.classList.remove('leaving'); s.classList.add('on'); restart(s.querySelector('img'));
    bars.forEach((b, k) => { b.classList.toggle('on', k === cur); b.classList.toggle('done', k < cur); });
    restart(bars[cur].querySelector('b'));
    setCaption(s);
    schedule(HOLD);
  };
  const setPaused = p => {
    if (p === film.classList.contains('paused')) return;
    film.classList.toggle('paused', p);
    if (p) { clearTimeout(timer); left = Math.max(0, left - (performance.now() - startedAt)); } else schedule(left);
  };
  const syncBtn = () => {
    vbtn.setAttribute('aria-pressed', userPaused);
    vbtn.setAttribute('aria-label', userPaused ? 'เล่นภาพเคลื่อนไหว' : 'หยุดภาพเคลื่อนไหว');
  };
  if (RM) { userPaused = true; film.classList.add('paused'); syncBtn(); }
  else schedule(HOLD + (document.documentElement.classList.contains('intro-on') ? 3000 : 0));
  vbtn.addEventListener('click', () => { userPaused = !userPaused; syncBtn(); setPaused(userPaused); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true); else if (!userPaused) setPaused(false); });
  }

  /* A slow drift of the whole frame toward the pointer — depth without motion sickness */
  if (!RM && canHover && $('.hm')) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const step = () => {
      x += (tx - x) * .05; y += (ty - y) * .05;
      film.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .05 ? requestAnimationFrame(step) : 0;
    };
    $('.hm').addEventListener('pointermove', e => {
      tx = (e.clientX / innerWidth - .5) * -14; ty = (e.clientY / innerHeight - .5) * -10;
      if (!raf) raf = requestAnimationFrame(step);
    });
  }

  if (!$('.hm')) {
    const heroEl = $('[data-hero]');
    let lowY = scrollY, highY = scrollY, tick = false;
    const onScroll = () => {
      tick = false;
      const y = scrollY, end = heroEl ? heroEl.offsetHeight : 200;
      hd.classList.toggle('solid', y > end - 90);
      const hidden = hd.classList.contains('hide');
      if (y < end || hd.classList.contains('menu-open') || !drawer.hidden) { hd.classList.remove('hide'); lowY = highY = y; }
      else if (!hidden) { lowY = Math.min(lowY, y); if (y - lowY > 48) { hd.classList.add('hide'); highY = y; } }
      else { highY = Math.max(highY, y); if (highY - y > 32) { hd.classList.remove('hide'); lowY = y; } }
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }
})();
