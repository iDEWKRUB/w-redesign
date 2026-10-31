// Render each deck slide (1920x1080) and serialize to the same layer-tree format as shot/dom2fig.js.
// usage: node slides2fig.js  -> out/<id>.json + out/<id>.jpg
const p = require('puppeteer-core'), path = require('path'), fs = require('fs');
const DIR = path.join(__dirname, '../../../deck'), OUT = path.join(__dirname, 'out');
const deck = JSON.parse(fs.readFileSync(path.join(DIR, 'deck.json')));
const IMG = 'file:///' + path.join(DIR, 'img').replace(/\\/g, '/') + '/';

// Chrome's line breaks as [[pos, replacesSpace]] in txt, so Figma wraps Thai exactly like the deck
function brk(el, txt) {
  const ws = ch => /\s/.test(ch), seq = [], rg = document.createRange();
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let nd, top = null, line = 0;
  while ((nd = tw.nextNode())) {
    const s = nd.textContent;
    for (let i = 0; i < s.length; i++) {
      if (ws(s[i])) continue;
      rg.setStart(nd, i); rg.setEnd(nd, i + 1); const r = rg.getClientRects()[0];
      if (r && r.height) { if (top === null) top = r.top; else if (r.top > top + r.height * 0.6) { line++; top = r.top; } }
      seq.push(line);
    }
  }
  if (!line) return undefined;
  const out = []; let k = 0, prev = 0;
  for (let i = 0; i < txt.length; i++) {
    if (ws(txt[i])) continue;
    const L = seq[k++]; if (L === undefined) break;
    if (L > prev) { let j = i - 1, nl = false; while (j >= 0 && ws(txt[j])) { if (txt[j] === '\n') nl = true; j--; } if (!nl) out.push(txt[i - 1] === ' ' ? [i - 1, 1] : [i, 0]); }
    prev = L;
  }
  return out.length ? out : undefined;
}

// pull extract() out of dom2fig.js and adapt it for slides
let src = fs.readFileSync(path.join(__dirname, '../dom2fig.js'), 'utf8');
let body = src.slice(src.indexOf('function extract(opts) {'), src.indexOf('  window.scrollTo(0, 0);'));
body = body
  .replace("const FAM = ['Jost', 'Anuphan', 'Figtree', 'Sarabun'];", "const FAM = ['Anuphan', 'Sarabun', 'Cormorant Garamond'];" + brk.toString())
  .replace("if (al !== 'LEFT' || t.w > 0)", "t.brk = brk(c, txt); if (al !== 'LEFT' || t.w > 0)")
  .replace("const rel = u => { u = decodeURI(u); const i = u.indexOf('/site/'); return i >= 0 ? u.slice(i + 6) : u; };", "const rel = u => (u.match(/([0-9a-f]{32})/) || [, u])[1];")
  // 'normal' line-height: use the real rendered line box instead of a 1.5 guess
  .replace("const lh = cs.lineHeight === 'normal' ? r1(parseFloat(cs.fontSize) * 1.5) : r1(parseFloat(cs.lineHeight));",
    "const lh = cs.lineHeight === 'normal' ? r1(tb.height / Math.max(1, Math.round(tb.height / (parseFloat(cs.fontSize) * 1.32)))) : r1(parseFloat(cs.lineHeight));");
const tail = `
  const sec = document.querySelector('section'); const cs = getComputedStyle(sec);
  const res = { bg: col(cs.backgroundColor) || null, g: cs.backgroundImage !== 'none' ? grad(cs.backgroundImage) : null };
  res.tree = build(sec, 0, 0, 0); res.icons = icons; res.imgs = [...imgs]; return res;
`;
const extract = new Function('opts', body.slice(body.indexOf('{') + 1) + tail);

const ICON = {
  Star: '<path d="M12 2.8l2.85 5.95 6.55.8-4.8 4.5 1.25 6.5L12 17.35 6.15 20.55l1.25-6.5-4.8-4.5 6.55-.8z"/>',
  Search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="M20 20l-4.3-4.3"/>',
  Home: '<path d="M3.5 10.2L12 3.5l8.5 6.7V20a.8.8 0 0 1-.8.8H15v-6.2H9v6.2H4.3a.8.8 0 0 1-.8-.8z"/>',
  ThumbsUp: '<path d="M7.5 10.5v10H4.3a.8.8 0 0 1-.8-.8v-8.4a.8.8 0 0 1 .8-.8zm0 0L11.2 3a2.4 2.4 0 0 1 2.6 2.4v3.9h5.4a2 2 0 0 1 2 2.3l-1.25 7.9a2 2 0 0 1-2 1.7H7.5"/>',
  Play: '<circle cx="12" cy="12" r="9"/><path d="M10.2 8.6v6.8l5.6-3.4z"/>',
  Verified: '<path d="M12 2.8l2.3 1.7 2.9-.2.9 2.7 2.3 1.7-.9 2.8.9 2.8-2.3 1.7-.9 2.7-2.9-.2L12 21.2l-2.3-1.7-2.9.2-.9-2.7-2.3-1.7.9-2.8-.9-2.8 2.3-1.7.9-2.7 2.9.2z"/><path d="M8.6 12.2l2.3 2.3 4.5-4.6"/>',
  Chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.1-4.4A8.5 8.5 0 1 1 20.5 12z"/>',
};
const prep = html => html
  .replace(/<aside>[\s\S]*?<\/aside>/, '')
  .replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => IMG + id + (id === '057cc6202ff07a2060243d764289066d' ? '.webp' : '.jpg'))
  .replace(/<x-icon name="(\w+)" style="([^"]*)"><\/x-icon>/g, (m, n, st) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex:none;${st}">${ICON[n] || ''}</svg>`)
  .replace(/<x-shape kind="arrow-right" style="background:([^;]+);width:(\d+)px;height:(\d+)px"><\/x-shape>/g, (m, c, w, h) => `<svg viewBox="0 0 40 20" style="flex:none;color:${c};width:${w}px;height:${h}px"><path fill="currentColor" d="M0 7.5h27V1l13 9-13 9v-6.5H0z"/></svg>`)
  .replace(/<li>/g, '<li>•&nbsp;&nbsp;');
const CSS = `*{margin:0;padding:0;box-sizing:border-box}body{width:1920px;height:1080px;overflow:hidden}section{width:1920px;height:1080px;position:relative;overflow:hidden}section>:not([style*="position:absolute"]){position:relative}ul,ol{list-style:none}h1,h2,h3{font-weight:600}img{display:block}`;
const FONTS = Object.values(deck.faces).map(f => `<link rel="stylesheet" href="${f.href}">`).join('');

(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080 });
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : deck.order;
  for (const id of ids) {
    const html = prep(fs.readFileSync(path.join(DIR, id + '.html'), 'utf8'));
    fs.writeFileSync(path.join(OUT, id + '.html'), `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>${html}</body></html>`);
    await pg.goto('file:///' + path.join(OUT, id + '.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(z => { i.onload = i.onerror = z; }))); });
    await new Promise(z => setTimeout(z, 300));
    const res = await pg.evaluate(extract, {});
    fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(res));
    await pg.screenshot({ path: path.join(OUT, id + '.jpg'), type: 'jpeg', quality: 70 });
    console.log(id, 'nodes', JSON.stringify(res).length, 'imgs', res.imgs.length, 'icons', Object.keys(res.icons).length);
  }
  await b.close();
})();
