// Serialize rendered pages into a compact layer tree for rebuilding as native Figma layers.
// usage: node dom2fig.js [route ...]   -> ../fig/<route>.json
const p = require('puppeteer-core'), path = require('path'), fs = require('fs');
const BASE = 'file:///C:/Users/NEXA-ADMIN/whouse-redesign/site/index.html';
const OUT = path.resolve(__dirname, '../fig'); fs.mkdirSync(OUT, { recursive: true });
const ALL = ['home','design','design-modern','plan-m062','more-is-more','a-life-of-style','projects','project-6680','ongoing','reviews','process','news-event','blog','article-10109','about','contact','saved','privacy','nope'];
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const W = 1440;

function extract(opts) {
  const FAM = ['Jost', 'Anuphan', 'Figtree', 'Sarabun'];
  const TH = /[\u0E00-\u0E7F]/;
  const r1 = v => Math.round(v * 10) / 10;
  const col = s => { // rgba() -> [hex, alpha]
    const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    const al = a.length > 3 ? a[3] : 1; if (al === 0) return null;
    return '#' + a.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (al < 1 ? ':' + r1(al * 100) / 100 : '');
  };
  const colA = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); const al = a.length > 3 ? a[3] : 1; return '#' + a.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (al < 1 ? ':' + Math.round(al * 100) / 100 : ''); };
  const fam = (cs, txt) => {
    const st = cs.fontFamily.split(',').map(s => s.trim().replace(/["']/g, ''));
    let f = st.find(s => FAM.includes(s)) || 'Sarabun';
    if (TH.test(txt) && (f === 'Jost' || f === 'Figtree')) f = st.find(s => s === 'Anuphan' || s === 'Sarabun') || 'Sarabun';
    return f;
  };
  const grad = bg => { // linear-gradient(...) -> {a, stops:[[hex,pos]]}
    const split = s => { const o = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { o.push(cur.trim()); cur = ''; } else cur += ch; } o.push(cur.trim()); return o; };
    const layer = split(bg).find(l => /^(linear|radial)-gradient\(/.test(l)); if (!layer) return null;
    const rad = layer.startsWith('radial');
    const parts = split(layer.slice(layer.indexOf('(') + 1, -1));
    if (rad) { if (!/rgba?\(/.test(parts[0])) parts.shift(); }
    let a = 180; if (rad) a = 0; else if (/deg$/.test(parts[0])) a = parseFloat(parts.shift()); else if (/^to /.test(parts[0])) { const t = parts.shift(); a = { 'to bottom': 180, 'to top': 0, 'to right': 90, 'to left': 270 }[t] ?? 180; }
    const stops = parts.map((s, i) => { const c = colA(s.match(/rgba?\([^)]+\)/)?.[0]); const pm = s.match(/(-?[\d.]+)%\s*$/); return c ? [c, pm ? +pm[1] / 100 : i / Math.max(1, parts.length - 1)] : null; }).filter(Boolean);
    return stops.length ? (rad ? { rad: 1, s: stops } : { a, s: stops }) : null;
  };
  const shadow = s => { if (!s || s === 'none') return null; const c = col(s.match(/rgba?\([^)]+\)/)?.[0]); const n = s.replace(/rgba?\([^)]+\)/, '').trim().split(/\s+/).map(parseFloat); if (!c || s.includes('inset')) return null; return [c, n[0] || 0, n[1] || 0, n[2] || 0, n[3] || 0]; };
  const vis = (el, cs) => cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.02;
  const inlineTags = new Set(['SPAN', 'EM', 'B', 'STRONG', 'I', 'A', 'SMALL', 'BR', 'SUP', 'U', 'MARK', 'LABEL', 'TIME']);
  const isTextBlock = el => { // contains direct text and only inline, box-less children
    let hasText = false;
    for (const c of el.childNodes) {
      if (c.nodeType === 3) { if (c.textContent.trim()) hasText = true; }
      else if (c.nodeType === 1) {
        const cs = getComputedStyle(c);
        if (!inlineTags.has(c.tagName) || cs.display.includes('block') || cs.display.includes('flex') || cs.display.includes('grid') || c.querySelector('img,svg,input,button')) return false;
        if (c.textContent.trim()) hasText = true;
      }
    }
    return hasText;
  };
  const segs = (el, base) => { // styled runs
    const out = [];
    const walk = (n, cs) => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) { const t = c.textContent.replace(/\s+/g, ' '); if (t) out.push([t, cs]); }
        else if (c.nodeType === 1) { if (c.tagName === 'BR') { out.push(['\n', cs]); continue; } const s = getComputedStyle(c); if (s.display === 'none') continue; walk(c, s); }
      }
    };
    walk(el, base);
    let txt = out.map(o => o[0]).join('').replace(/ *\n */g, '\n').trim();
    const runs = []; let pos = 0; const full = out.map(o => o[0]).join('');
    const lead = full.length - full.trimStart().length;
    for (const [t, cs] of out) {
      const st = pos - lead, en = st + t.length; pos += t.length;
      const s = Math.max(0, st), e = Math.min(txt.length, en); if (e <= s) continue;
      const tt = cs.textTransform;
      runs.push([s, e, col(cs.color) || '#000000', +cs.fontWeight, cs.fontStyle === 'italic' ? 1 : 0, fam(cs, txt), r1(parseFloat(cs.fontSize)), tt === 'uppercase' ? 1 : 0]);
    }
    if (runs.some(r => r[7])) { // apply uppercase
      let a = txt.split(''); for (const r of runs) if (r[7]) for (let i = r[0]; i < r[1]; i++) a[i] = a[i].toUpperCase(); txt = a.join('');
    }
    return { txt, runs };
  };
  const sprite = {}; let iconN = 0; const icons = {};
  const iconOf = svg => {
    const use = svg.querySelector('use'); let key, markup;
    const cs = getComputedStyle(svg);
    const color = col(cs.color) || '#000000';
    if (use) {
      const id = (use.getAttribute('href') || use.getAttribute('xlink:href') || '').slice(1);
      const sym = document.getElementById(id); if (!sym) return null;
      key = id; if (!icons[key]) icons[key] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sym.getAttribute('viewBox') || '0 0 24 24'}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${sym.innerHTML}</svg>`;
    } else {
      key = 'inl' + (iconN++); const c = svg.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); icons[key] = c.outerHTML;
    }
    return [key, color];
  };
  const imgs = new Set();
  const rel = u => { u = decodeURI(u); const i = u.indexOf('/site/'); return i >= 0 ? u.slice(i + 6) : u; };

  const build = (el, ox, oy, depth) => {
    const out = [];
    for (const c of el.childNodes) {
      if (c.nodeType === 3) { // loose text beside block children
        let tx = c.textContent.replace(/\s+/g, ' '); if (!tx.trim()) continue; tx = c.previousSibling ? tx.trimEnd() : tx.trim();
        const pcs = getComputedStyle(el); if (pcs.visibility === 'hidden') continue;
        const rg = document.createRange(); rg.selectNodeContents(c); const tb = rg.getBoundingClientRect(); if (tb.width < 1) continue;
        const lh = pcs.lineHeight === 'normal' ? r1(parseFloat(pcs.fontSize) * 1.5) : r1(parseFloat(pcs.lineHeight));
        const t2 = pcs.textTransform === 'uppercase' ? tx.toUpperCase() : tx;
        out.push({ k: 't', x: r1(tb.left + scrollX - ox), y: r1(tb.top + scrollY - oy), w: r1(tb.width), h: r1(tb.height), txt: t2, runs: [[0, t2.length, col(pcs.color) || '#000000', +pcs.fontWeight, pcs.fontStyle === 'italic' ? 1 : 0, fam(pcs, t2), r1(parseFloat(pcs.fontSize)), 0]], lh, al: 'LEFT', ls: pcs.letterSpacing === 'normal' ? 0 : r1(parseFloat(pcs.letterSpacing)) });
        continue;
      }
      if (c.nodeType !== 1) continue;
      const cs = getComputedStyle(c);
      if (!vis(c, cs)) continue;
      if (opts.skipFixed && cs.position === 'fixed') continue;
      if (['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'IFRAME'].includes(c.tagName)) continue;
      const b = c.getBoundingClientRect();
      const x = r1(b.left + scrollX - ox), y = r1(b.top + scrollY - oy), w = r1(b.width), h = r1(b.height);
      if (w < 1 || h < 1) { if (cs.overflow === 'visible' && c.children.length) out.push(...build(c, ox, oy, depth)); continue; }
      if (b.right < -50 || b.left > innerWidth + 50) continue; // off-canvas slides
      const op = +cs.opacity < 1 ? r1(+cs.opacity) : undefined;
      if (c.tagName === 'IMG') {
        const src = c.currentSrc || c.src; if (!src) continue; const k = rel(src); imgs.add(k);
        out.push({ k: 'i', wh: cs.filter.includes('invert(1)') ? 1 : undefined, x, y, w, h, src: k, r: parseFloat(cs.borderTopLeftRadius) || 0, fit: cs.objectFit === 'contain' ? 'FIT' : 'FILL', op, n: c.alt?.slice(0, 40) });
        continue;
      }
      if (c.tagName === 'svg' || c.tagName === 'SVG') { const ic = iconOf(c); if (ic) out.push({ k: 'v', x, y, w, h, ic: ic[0], c: ic[1], op }); continue; }
      if (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA' || c.tagName === 'SELECT') {
        const box = { k: 'b', x, y, w, h, n: c.name || c.tagName.toLowerCase() };
        const bg = col(cs.backgroundColor); if (bg) box.f = bg;
        const bw = parseFloat(cs.borderTopWidth); if (bw) box.s = [col(cs.borderTopColor) || '#dddddd', bw];
        box.r = parseFloat(cs.borderTopLeftRadius) || 0;
        const val = c.tagName === 'SELECT' ? c.options[c.selectedIndex]?.text : (c.value || c.placeholder);
        if (val) box.ch = [{ k: 't', x: parseFloat(cs.paddingLeft), y: 0, w: w - parseFloat(cs.paddingLeft) - 8, h, txt: val, runs: [[0, val.length, c.value || c.tagName === 'SELECT' ? (col(cs.color) || '#222') : '#8a7f82', +cs.fontWeight, 0, fam(cs, val), r1(parseFloat(cs.fontSize)), 0]], lh: h, al: 'LEFT', va: c.tagName === 'TEXTAREA' ? 'TOP' : 'CENTER' }];
        out.push(box); continue;
      }
      // box visuals
      const box = { k: 'b', x, y, w, h };
      const bg = col(cs.backgroundColor); if (bg) box.f = bg;
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        const um = bi.match(/url\("?([^")]+)"?\)/);
        if (um && !um[1].startsWith('data:')) { const k = rel(um[1]); imgs.add(k); box.bi = k; }
        const g = grad(bi); if (g) box.g = g;
      }
      const bw = parseFloat(cs.borderTopWidth), bb = parseFloat(cs.borderBottomWidth), bl = parseFloat(cs.borderLeftWidth);
      if (bw && cs.borderTopStyle !== 'none' && bw === bb && bw === bl) box.s = [col(cs.borderTopColor), bw];
      else { const sides = {}; ['Top', 'Right', 'Bottom', 'Left'].forEach(sd => { const v = parseFloat(cs['border' + sd + 'Width']); if (v && cs['border' + sd + 'Style'] !== 'none' && col(cs['border' + sd + 'Color'])) sides[sd[0]] = [col(cs['border' + sd + 'Color']), v]; }); if (Object.keys(sides).length) box.sd = sides; }
      if (box.s && !box.s[0]) delete box.s;
      const rad = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(v => Math.min(parseFloat(v) || 0, Math.min(w, h) / 2));
      if (rad.some(Boolean)) box.r = rad.every(v => v === rad[0]) ? rad[0] : rad;
      const sh = shadow(cs.boxShadow); if (sh) box.sh = sh;
      if (cs.backdropFilter && cs.backdropFilter !== 'none') { const m = cs.backdropFilter.match(/blur\(([\d.]+)px/); if (m) box.bl = +m[1]; }
      if (op) box.op = op;
      const clip = cs.overflow !== 'visible' || cs.overflowX !== 'visible';
      if (clip) box.cl = 1;
      const visual = box.f || box.bi || box.g || box.s || box.sd || box.sh || op;
      // pseudo elements with background (overlays)
      const pse = [];
      for (const ps of ['::before', '::after']) {
        const p = getComputedStyle(c, ps);
        if (!p || p.content === 'none' || p.display === 'none') continue;
        const pbg = col(p.backgroundColor), pg = p.backgroundImage !== 'none' ? grad(p.backgroundImage) : null;
        if ((pbg || pg) && p.position === 'absolute') {
          const L = parseFloat(p.left), T = parseFloat(p.top), R = parseFloat(p.right), B = parseFloat(p.bottom);
          let pw = parseFloat(p.width), ph = parseFloat(p.height);
          const px = isNaN(L) ? (isNaN(R) ? 0 : w - R - pw) : L, py = isNaN(T) ? (isNaN(B) ? 0 : h - B - ph) : T;
          if (isNaN(pw)) pw = w; if (isNaN(ph)) ph = h;
          if (pw > 0 && ph > 0) pse.push({ k: 'b', x: r1(px), y: r1(py), w: r1(pw), h: r1(ph), f: pbg, g: pg, op: +p.opacity < 1 ? +p.opacity : undefined, r: parseFloat(p.borderTopLeftRadius) || 0, ps: 1, after: ps === '::after' });
        }
      }
      let kids;
      if (isTextBlock(c)) {
        const { txt, runs } = segs(c, cs);
        if (txt) {
          const rg = document.createRange(); rg.selectNodeContents(c); const tb = rg.getBoundingClientRect();
          const pl = parseFloat(cs.paddingLeft), pt = parseFloat(cs.paddingTop);
          const lh = cs.lineHeight === 'normal' ? r1(parseFloat(cs.fontSize) * 1.5) : r1(parseFloat(cs.lineHeight));
          const al = { center: 'CENTER', right: 'RIGHT', end: 'RIGHT', justify: 'JUSTIFIED' }[cs.textAlign] || 'LEFT';
          const tx = visual || pse.length ? r1(tb.left - b.left) : r1(tb.left + scrollX - ox), ty = visual || pse.length ? r1(tb.top - b.top) : r1(tb.top + scrollY - oy);
          const t = { k: 't', x: tx, y: ty, w: r1(tb.width), h: r1(tb.height), txt, runs, lh, al, ls: cs.letterSpacing === 'normal' ? 0 : r1(parseFloat(cs.letterSpacing)), cl: cs.webkitLineClamp && cs.webkitLineClamp !== 'none' ? 1 : 0 };
          if (al !== 'LEFT' || t.w > 0) { t.w = al === 'LEFT' ? t.w : r1(w - pl - parseFloat(cs.paddingRight)); if (al !== 'LEFT') t.x = visual || pse.length ? pl : r1(x + pl); }
          if (visual || pse.length) { box.ch = [...pse.filter(q => !q.after), t, ...pse.filter(q => q.after)]; box.n = c.className && typeof c.className === 'string' ? c.className.split(' ')[0] : c.tagName.toLowerCase(); out.push(box); }
          else out.push(t);
          continue;
        }
      }
      if (visual || pse.length || (clip && rad.some(Boolean))) {
        kids = build(c, b.left + scrollX, b.top + scrollY, depth + 1);
        box.ch = [...pse.filter(q => !q.after), ...kids, ...pse.filter(q => q.after)];
        const cls = typeof c.className === 'string' ? c.className.split(' ')[0] : '';
        box.n = c.id || cls || c.tagName.toLowerCase();
        out.push(box);
      } else {
        const ch = build(c, ox, oy, depth + 1);
        if (depth < 2 && ch.length > 1 && (c.tagName === 'SECTION' || c.tagName === 'HEADER' || c.tagName === 'FOOTER')) {
          // group as transparent named frame for structure
          const cls = typeof c.className === 'string' ? c.className.split(' ')[0] : '';
          const h2 = c.querySelector('h1,h2,h3'); const nm = (h2 ? h2.textContent.trim().slice(0, 28) : '') || c.id || cls || c.tagName.toLowerCase();
          out.push({ k: 'b', x, y, w, h, n: nm, ch: build(c, b.left + scrollX, b.top + scrollY, depth + 1) });
        } else out.push(...ch);
      }
    }
    return out;
  };
  window.scrollTo(0, 0);
  const res = {};
  const hdr = document.querySelector('header'), ftr = document.querySelector('footer'), main = document.querySelector('#app .view.on') || document.querySelector('#app');
  const top = 0;
  res.H = r1(document.documentElement.scrollHeight);
  res.bg = col(getComputedStyle(document.body).backgroundColor) || '#ffffff';
  const hb = hdr.getBoundingClientRect(); res.header = { y: r1(hb.top), h: r1(hb.height), cls: hdr.className };
  const mb = main.getBoundingClientRect();
  res.main = { k: 'b', x: 0, y: r1(mb.top + scrollY), w: r1(mb.width), h: r1(mb.height), n: 'Content', ch: build(main, 0, mb.top + scrollY, 0) }; { const mcs = getComputedStyle(main); const mf = col(mcs.backgroundColor); if (mf) res.main.f = mf; const mg = mcs.backgroundImage !== 'none' ? grad(mcs.backgroundImage) : null; if (mg) res.main.g = mg; }
  const fb = ftr.getBoundingClientRect(); res.footer = { y: r1(fb.top + scrollY), h: r1(fb.height) }; const ct = document.querySelector('section.cta'); if (ct && ct.getBoundingClientRect().height > 2 && getComputedStyle(ct).display !== 'none') res.cta = { y: r1(ct.getBoundingClientRect().top + scrollY), h: r1(ct.getBoundingClientRect().height) };
  if (opts.withChrome) {
    res.headerTree = { k: 'b', x: 0, y: 0, w: r1(hb.width), h: r1(hb.height), n: 'Header', ch: build(hdr, 0, hb.top + scrollY, 0) };
    const hcs = getComputedStyle(hdr); const hbg = col(hcs.backgroundColor); if (hbg) res.headerTree.f = hbg; const sh = shadow(hcs.boxShadow); if (sh) res.headerTree.sh = sh;
    const hbb = parseFloat(hcs.borderBottomWidth); if (hbb) res.headerTree.sd = { B: [col(hcs.borderBottomColor), hbb] };
    const cta = document.querySelector('section.cta'); if (cta && cta.getBoundingClientRect().height > 2) { const cb = cta.getBoundingClientRect(); res.ctaTree = { k: 'b', x: 0, y: 0, w: r1(cb.width), h: r1(cb.height), n: 'CTA Band', f: col(getComputedStyle(cta).backgroundColor), ch: build(cta, 0, cb.top + scrollY, 0) }; }
    res.footerTree = { k: 'b', x: 0, y: 0, w: r1(fb.width), h: r1(fb.height), n: 'Footer', f: col(getComputedStyle(ftr).backgroundColor), ch: build(ftr, 0, fb.top + scrollY, 0) };
  }
  res.icons = icons; res.imgs = [...imgs];
  return res;
}

(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: W, height: 900 });
  await pg.evaluateOnNewDocument(() => { sessionStorage.setItem('wh-intro', '1'); localStorage.removeItem('wh-saved2'); });
  const wait = ms => new Promise(z => setTimeout(z, ms));
  for (const r of routes) {
    await pg.goto(BASE + '#' + r, { waitUntil: 'networkidle0' }); await wait(600);
    if (r === 'saved') { await pg.goto(BASE + '#home', { waitUntil: 'networkidle0' }); await wait(400); await pg.evaluate(() => { [...document.querySelectorAll('[data-heart]')].slice(0, 3).forEach(h => h.click()); }); await pg.evaluate(() => { location.hash = '#saved'; }); await wait(800); }
    // scroll through to trigger lazy/reveal, then freeze animations
    const H = await pg.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await pg.evaluate(y => scrollTo(0, y), y); await wait(120); }
    await pg.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important} .cfab,.toast{display:none!important}' });
    await pg.evaluate(() => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); scrollTo(0, 0); });
    await pg.evaluate(async () => { await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(z => { i.onload = i.onerror = z; }))); });
    await wait(500);
    const res = await pg.evaluate(extract, { skipFixed: true, withChrome: r === 'home' || r === 'design' });
    const js = JSON.stringify(res);
    fs.writeFileSync(path.join(OUT, r + '.json'), js);
    await pg.screenshot({ path: path.join(OUT, r + '.jpg'), type: 'jpeg', quality: 60, fullPage: true });
    console.log(r, 'H', res.H, 'kb', (js.length / 1024).toFixed(0), 'imgs', res.imgs.length, 'icons', Object.keys(res.icons).length);
  }
  await b.close();
})();
