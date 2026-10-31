(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ps = $('#steps7'), cards = $$('.ps-card'), phases = $$('.phases span'), ofEl = $('#psOf');
  const PHASE = [0, 0, 1, 1, 2, 2, 2], PH_TH = ['วางแผน', 'เตรียมก่อสร้าง', 'ก่อสร้างและส่งมอบ'];
  const N = cards.length;
  let cur = -1;
  const pad = i => String(i + 1).padStart(2, '0');
  const setStep = i => {
    if (i === cur) return;
    const dir = i > cur ? 1 : -1;
    cur = i;
    cards.forEach((c, k) => { c.classList.toggle('on', k === i); c.classList.toggle('past', k < i); c.setAttribute('aria-hidden', k !== i); });
    phases.forEach((p, k) => p.classList.toggle('on', k === PHASE[i]));
    ofEl.textContent = `Step ${pad(i)} of 0${N} · ${PH_TH[PHASE[i]]}`;
    // the big number rolls up (or down) to the new step
    const old = $('#psNum');
    const nu = old.cloneNode();
    nu.textContent = pad(i);
    nu.id = 'psNum';
    nu.classList.add('in-below');
    if (dir < 0) nu.style.transform = 'translateY(-100%)';
    old.removeAttribute('id');
    old.parentNode.appendChild(nu);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nu.classList.remove('in-below'); nu.style.transform = '';
      old.classList.add('out'); if (dir < 0) old.style.transform = 'translateY(100%)';
      setTimeout(() => old.remove(), 900);
    }));
  };
  let tick = false;
  const onScroll = () => {
    tick = false;
    const r = ps.getBoundingClientRect(), span = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / span));
    ps.style.setProperty('--p', p.toFixed(4));
    setStep(Math.min(N - 1, Math.floor(p * N * .999)));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  cur = 0;
  phases[0].classList.add('on');
  cards.forEach((c, k) => c.setAttribute('aria-hidden', k !== 0));
  onScroll();
})();
