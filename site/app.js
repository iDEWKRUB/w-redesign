(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hd = $('#hd'), rail = $('#rail'), hero = $('.hero');

  const chapters = $$('#rail a[data-k]').map(a => ({ a, el: document.getElementById(a.dataset.k) }));
  const tones = $$('[data-tone]');

  /* Toast */
  const toastEl = $('#toast'); let toastT;
  const toast = msg => {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  /* W on the rail: spring back to the very top */
  $('#railTop').addEventListener('click', e => {
    e.preventDefault();
    const w = e.currentTarget;
    w.classList.remove('boing'); void w.offsetWidth; w.classList.add('boing');
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  /* Header + chapter rail follow the scroll */
  let lastY = scrollY, ticking = false, lowY = scrollY, highY = scrollY;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight, heroEnd = hero.offsetHeight;
    const drawerOpen = !$('#drawer').hidden;
    hd.classList.toggle('solid', y > heroEnd - 90 || drawerOpen);
    // Hide after 48px of net travel down, show after 32px of net travel up — jitter in between changes nothing
    const hidden = hd.classList.contains('hide');
    if (y < heroEnd || drawerOpen) { hd.classList.remove('hide'); lowY = highY = y; }
    else if (!hidden) { lowY = Math.min(lowY, y); if (y - lowY > 48) { hd.classList.add('hide'); highY = y; } }
    else { highY = Math.max(highY, y); if (highY - y > 32) { hd.classList.remove('hide'); lowY = y; } }
    lastY = y;

    const ft = $('.ft').getBoundingClientRect().top;
    rail.classList.toggle('show', y > heroEnd * .55 && ft > vh * .85);
    let cur = null;
    for (const c of chapters) if (c.el.getBoundingClientRect().top <= vh * .5) cur = c;
    chapters.forEach(c => {
      const on = c === cur;
      c.a.classList.toggle('on', on);
      on ? c.a.setAttribute('aria-current', 'step') : c.a.removeAttribute('aria-current');
    });
    // Match the rail to whatever section sits behind it
    const probe = vh / 2;
    const under = tones.find(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    rail.classList.toggle('light', !!under && under.dataset.tone === 'light');
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* Mobile drawer */
  const drawer = $('#drawer'), burger = $('#burger');
  const openDrawer = () => {
    drawer.hidden = false; burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; $('#drawerClose').focus(); onScroll();
  };
  const closeDrawer = (focusBack = true) => {
    drawer.hidden = true; burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; if (focusBack) burger.focus(); onScroll();
  };
  burger.addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', () => closeDrawer());
  $$('#drawer a').forEach(a => a.addEventListener('click', () => closeDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

  /* Links to the rest of the site (outside this About page) */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]');
    if (!a) return;
    e.preventDefault();
    toast('ตัวอย่างนี้แสดงเฉพาะหน้า “เกี่ยวกับเรา”');
  });

  /* Hero film: a new shot every 7s; each drifts for 9s so it is still moving while the next one fades in */
  const film = $('#film'), vbtn = $('#vbtn');
  if (film && vbtn) {
    const shots = $$('.shot', film), bars = $$('#filmBars i');
    const HOLD = 7000, DUR = 9000;
    film.style.setProperty('--dur', DUR + 'ms');
    $('#filmBars').style.setProperty('--dur', HOLD + 'ms');
    let cur = 0, timer = null, left = HOLD, startedAt = 0, userPaused = false;
    const restart = el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };
    const schedule = ms => {
      clearTimeout(timer); left = ms; startedAt = performance.now();
      timer = setTimeout(() => show((cur + 1) % shots.length), ms);
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
    bars[0].classList.add('on');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { userPaused = true; film.classList.add('paused'); syncBtn(); }
    else schedule(HOLD + (document.documentElement.classList.contains('intro-on') ? 3000 : 0));
    vbtn.addEventListener('click', () => { userPaused = !userPaused; syncBtn(); setPaused(userPaused); });
    // Pause while the hero is off screen; resume only if the viewer had not paused it
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) setPaused(true);
      else if (!userPaused) setPaused(false);
    }).observe(film);
  }

  /* Steps carousel arrows */
  const sc = $('.steps-scroll'), prev = $('#stPrev'), next = $('#stNext');
  const step = () => { const li = $('.steps-track li'); return li ? li.offsetWidth + 18 : 300; };
  const syncArrows = () => {
    prev.disabled = sc.scrollLeft < 8;
    next.disabled = sc.scrollLeft > sc.scrollWidth - sc.clientWidth - 8;
  };
  prev.addEventListener('click', () => sc.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => sc.scrollBy({ left: step(), behavior: 'smooth' }));
  sc.addEventListener('scroll', syncArrows, { passive: true });
  addEventListener('resize', syncArrows);
  syncArrows();

  /* Count up the legacy numbers once they come into view (final values are already in the HTML) */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, to = +el.dataset.to, t0 = performance.now(), d = 1200;
      const tick = t => {
        const p = Math.min(1, (t - t0) / d);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    $$('.stats [data-to]').forEach(el => io.observe(el));
  }

  /* Specialist profile modal */
  const PEOPLE = [
    { mono: 'จ', name: 'คุณเจตน์ กาญจนกูล', role: 'รองประธานบริหาร',
      facts: [['ตำแหน่ง', 'รองประธานบริหาร'], ['บริษัท', 'บริษัท ดับบลิว เฮ้าส์ จำกัด']] },
    { mono: 'ว', name: 'คุณวรวุฒิ กาญจนกูล', role: 'ผู้บริหาร · วิทยากร HOME BUILDER EXPERT',
      facts: [['ตำแหน่ง', 'ผู้บริหาร'], ['บทบาทเพิ่มเติม', 'วิทยากร HOME BUILDER EXPERT'], ['บริษัท', 'บริษัท ดับบลิว เฮ้าส์ จำกัด']] }
  ];
  const modal = $('#modal');
  $$('.btn-more').forEach(b => b.addEventListener('click', () => {
    const p = PEOPLE[+b.dataset.person];
    $('#m-mono').textContent = p.mono;
    $('#m-name').textContent = p.name;
    $('#m-role').textContent = p.role;
    $('#m-facts').innerHTML = p.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    modal.showModal();
    document.body.style.overflow = 'hidden';
  }));
  $('#mClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => { document.body.style.overflow = ''; });

  /* Copy phone number */
  $('#copyTel').addEventListener('click', e => {
    const v = e.currentTarget.dataset.copy;
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents($('.tel'));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      toast('เลือกเบอร์ไว้แล้ว กดคัดลอกได้เลย');
    };
    try {
      navigator.clipboard.writeText(v).then(() => toast('คัดลอกเบอร์ 093-555-0596 แล้ว'), fallback);
    } catch { fallback(); }
  });

  /* ---------- Scroll choreography ---------- */
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.min(1, Math.max(0, v));
  // Progress through a tall pinned section: 0 when its top reaches the viewport top, 1 when its bottom does
  const pinP = el => { const r = el.getBoundingClientRect(), span = r.height - innerHeight; return span > 0 ? clamp01(-r.top / span) : 0; };
  const near = el => { const r = el.getBoundingClientRect(); return r.bottom > -innerHeight && r.top < innerHeight * 2; };
  const set = (el, k, v) => el.style.setProperty(k, v.toFixed(4));

  // Split text into words (Thai has no spaces, so use the word segmenter)
  const seg = 'Segmenter' in Intl ? new Intl.Segmenter('th', { granularity: 'word' }) : null;
  $$('[data-words]').forEach(el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const parts = seg ? [...seg.segment(n.textContent)].map(s => s.segment) : n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(t => { if (!t) return; if (/^\s+$/.test(t)) frag.append(t); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); } });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
    el.setAttribute('aria-label', el.textContent);
  });
  const wordBlocks = $$('[data-words]').map(el => ({ el, words: $$('.w', el) }));

  const heroEl = $('.hero'), chap = $('#heritage'), tl = $('#timeline'), uni = $('#unique'), why = $('#excellence'), motto = $('#motto');
  const stacks = $$('.pc.stack');
  let stackTops = [];
  const measureStacks = () => { stackTops = stacks.map(c => parseFloat(getComputedStyle(c).top) || 0); };
  measureStacks();

  // Timeline: each milestone holds for most of its slot, then the year rolls to the next one
  const tlYear = $('#tlYear'), tlItems = $$('.tl-item'), tlImgs = $$('.tl-bg img'), tlDots = $$('.tl-rail li');
  const YEARS = [2010, 2014, 2024, 2026];
  let tlIdx = 0;
  const tlUpdate = p => {
    const n = YEARS.length, f = p * n, i = Math.min(n - 1, Math.floor(f)), inSlot = f - i;
    const roll = i < n - 1 ? clamp01((inSlot - .72) / .28) : 0;
    const eased = roll < .5 ? 2 * roll * roll : 1 - Math.pow(-2 * roll + 2, 2) / 2;
    tlYear.textContent = Math.round(YEARS[i] + (i < n - 1 ? (YEARS[i + 1] - YEARS[i]) * eased : 0));
    set(tl, '--p', p);
    if (i !== tlIdx) {
      tlIdx = i;
      tlItems.forEach((el, k) => el.classList.toggle('on', k === i));
      tlImgs.forEach((el, k) => el.classList.toggle('on', k === i));
      tlDots.forEach((el, k) => { el.classList.toggle('on', k === i); el.classList.toggle('past', k < i); });
    }
  };

  // Steps: pin and slide sideways on wide screens
  const stepsEl = $('#steps');
  const stepsSetup = () => {
    stepsEl.classList.remove('pin'); stepsEl.style.removeProperty('--h');
    if (RM || innerWidth < 900) return;
    const dx = sc.scrollWidth - sc.clientWidth;
    if (dx <= 0) return;
    stepsEl.style.setProperty('--dx', dx);
    stepsEl.style.setProperty('--h', (innerHeight + dx * 1.4) + 'px');
    stepsEl.classList.add('pin');
  };
  stepsSetup();

  let fxTick = false;
  const fx = () => {
    fxTick = false;
    const vh = innerHeight;
    if (!RM) {
      if (near(heroEl)) set(heroEl, '--p', clamp01(scrollY / heroEl.offsetHeight));
      if (near(chap)) set(chap, '--p', pinP(chap));
      if (near(why)) set(why, '--p', pinP(why));
      if (near(uni)) set(uni, '--p', pinP(uni));
      if (near(motto)) { const r = motto.getBoundingClientRect(); set(motto, '--p', clamp01((vh * .9 - r.top) / (vh * .55))); }
      stacks.forEach((card, k) => {
        const next = card.nextElementSibling;
        if (!next) return;
        const top = stackTops[k] || 0;
        set(card, '--q', clamp01(1 - (next.getBoundingClientRect().top - top) / vh));
      });
      if (stepsEl.classList.contains('pin') && near(stepsEl)) set(stepsEl, '--p', pinP(stepsEl));
    }
    if (near(tl)) tlUpdate(pinP(tl));
    wordBlocks.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 1.5) return;
      const p = RM ? 1 : clamp01((vh * .85 - r.top) / (vh * .45 + r.height * .5));
      const lit = Math.round(p * words.length);
      words.forEach((w, k) => w.classList.toggle('lit', k < lit));
    });
  };
  addEventListener('scroll', () => { if (!fxTick) { fxTick = true; requestAnimationFrame(fx); } }, { passive: true });
  addEventListener('resize', () => { stepsSetup(); measureStacks(); fx(); });
  fx();

  // Gentle rise for blocks further down the page
  if (!RM && 'IntersectionObserver' in window) {
    const groups = ['.pc.values .v-list li', '.lead-grid .person', '.crew article', '.stats > div', '.trio article', '.where-head > *', '.marks li', '.zones > div', '.cta-in > *', '.steps-head > *', '.ft-grid > *'];
    const rvIO = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      rvIO.unobserve(en.target);
      en.target.classList.add('rv-in');
      en.target.addEventListener('transitionend', () => en.target.classList.remove('rv', 'rv-in'), { once: true });
    }), { rootMargin: '0px 0px -8% 0px' });
    groups.forEach(sel => $$(sel).forEach((el, k) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('rv'); el.style.setProperty('--d', (k % 4) * 90 + 'ms'); rvIO.observe(el);
    }));
  }

  // Specialist cards: slight tilt and a soft light that follows the pointer
  if (!RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.person').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add('tilting');
        card.style.transform = `perspective(1200px) rotateY(${(x - .5) * 6}deg) rotateX(${(.5 - y) * 6}deg) translateY(-4px)`;
        const ph = card.querySelector('.portrait').getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - ph.left) / ph.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - ph.top) / ph.height * 100) + '%');
      });
      card.addEventListener('pointerleave', () => { card.classList.remove('tilting'); card.style.transform = ''; });
    });
    // Primary buttons lean toward the pointer
    $$('.btn.solid, .btn-more').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .2}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }
})();
