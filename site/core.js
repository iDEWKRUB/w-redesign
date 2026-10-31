/* Shared by every page: the W intro. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  /* Intro: W draws in → becomes a window onto the house → zooms until the photo fills the screen → HOUSE rises */
  (() => {
    const root = document.documentElement, intro = $('#intro');
    if (!intro) return;
    const t0 = window.__t0 || 0;
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      // Hero letters start now, whether the intro ran to the end or was skipped
      root.style.setProperty('--intro-d', Math.max(0, performance.now() - t0 - 200) + 'ms');
      root.classList.remove('intro-on');
      root.style.overflow = '';
      intro.remove();
      try { sessionStorage.setItem('wIntroSeen', '1'); } catch (e) {}
      ['wheel', 'touchstart', 'keydown'].forEach(ev => removeEventListener(ev, skip));
    };
    if (!root.classList.contains('intro-on') || scrollY > 10) { finish(); return; }

    const svg = $('#introSvg'), hole = $('#wHoleG'), solid = $('#wSolidG'), wipe = $('#wWipeR'), tag = $('#introTag');
    const WC = [57.3, 38];   // centre of the W (viewBox units)
    const F = [47.5, 47];    // zoom focus: where the two middle strokes cross
    const ZOOM = 120;
    let vw, vh, base, C;
    const layout = () => {
      vw = innerWidth; vh = innerHeight;
      svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
      base = Math.min(vw * (vw < 700 ? .62 : .5), 440) / 114.6;
      C = [vw / 2, vh * .46];
      tag.style.top = (C[1] + 38 * base + 30) + 'px';
    };
    layout();
    addEventListener('resize', layout);
    root.style.overflow = 'hidden';

    const clamp = v => Math.min(1, Math.max(0, v));
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const start = performance.now();
    let skipAt = null;

    const frame = now => {
      if (done) return;
      const e = now - start;
      const wipeP = easeOut(clamp((e - 250) / 850));
      const breathe = 1 + .035 * easeInOut(clamp((e - 1100) / 700));
      const zoomP = easeInOut(clamp((e - 1800) / 1350));
      const s = breathe * Math.pow(ZOOM, zoomP);
      const fs = [C[0] + base * (F[0] - WC[0]), C[1] + base * (F[1] - WC[1])];
      const tf = `translate(${fs[0]} ${fs[1]}) scale(${base * s}) translate(${-F[0]} ${-F[1]})`;
      hole.setAttribute('transform', tf);
      solid.setAttribute('transform', tf);
      wipe.setAttribute('width', 118.6 * wipeP);
      solid.style.opacity = 1 - easeInOut(clamp((e - 1150) / 500));
      const tagIn = easeOut(clamp((e - 700) / 600)), tagOut = clamp((e - 1650) / 300);
      tag.style.opacity = tagIn * (1 - tagOut);
      tag.style.transform = `translateY(${(1 - tagIn) * 10 - tagOut * 6}px)`;
      let fade = clamp((e - 2750) / 400);
      if (skipAt !== null) fade = Math.max(fade, clamp((now - skipAt) / 350));
      intro.style.opacity = 1 - fade;
      if (fade >= 1) { finish(); return; }
      requestAnimationFrame(frame);
    };
    function skip() { if (skipAt === null) skipAt = performance.now(); }
    $('#introSkip').addEventListener('click', skip);
    intro.addEventListener('click', skip);
    ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, skip, { passive: true }));
    requestAnimationFrame(frame);
  })();
})();

/* Shared: favourite designs (kept in this browser only) + header badges */
(() => {
  const KEY = 'wh-fav', MAX = 4;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]').slice(0, MAX); } catch (e) { return []; } };
  let list = read();
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };
  const emit = (k, added) => { badges(true); subs.forEach(fn => fn(list.slice(), k, added)); };
  const badges = bump => document.querySelectorAll('[data-fav-count]').forEach(b => {
    b.textContent = list.length;
    if (b.classList.contains('fav-dot')) b.hidden = !list.length;
    const host = b.closest('.fav-hd'); if (host) host.classList.toggle('has', !!list.length);
    if (bump && !matchMedia('(prefers-reduced-motion: reduce)').matches) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
  window.WHFav = {
    MAX,
    all: () => list.slice(),
    has: k => list.includes(k),
    // returns true (added), false (removed) or null (list full)
    toggle(k) {
      if (list.includes(k)) { list = list.filter(x => x !== k); save(); emit(k, false); return false; }
      if (list.length >= MAX) return null;
      list = [...list, k]; save(); emit(k, true); return true;
    },
    remove(k) { if (list.includes(k)) { list = list.filter(x => x !== k); save(); emit(k, false); } },
    clear() { const old = list; list = []; save(); old.forEach(k => emit(k, false)); },
    on: fn => subs.add(fn)
  };
  addEventListener('storage', e => { if (e.key === KEY) { list = read(); emit(null, null); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => badges(false)); else badges(false);
})();
