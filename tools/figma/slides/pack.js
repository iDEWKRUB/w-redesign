// node pack.js id1,id2,... <slideIdMapJSON> -> prints a complete use_figma script for those slides
const fs = require('fs');
const H = JSON.parse(fs.readFileSync('hashes.json'));
const ids = process.argv[2].split(','), SID = JSON.parse(process.argv[3]);
const R = v => typeof v === 'number' ? (Math.abs(v) < 4 ? Math.round(v * 100) / 100 : Math.round(v * 2) / 2) : Array.isArray(v) ? v.map(R) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== undefined && x !== null && x !== 0 && k !== 'after' && k !== 'ps').map(([k, x]) => [k, k === 'src' || k === 'bi' ? (H[x] || x) : R(x)])) : v;
const S = {}, ICONS = {};
for (const id of ids) {
  const d = JSON.parse(fs.readFileSync('out/' + id + '.json'));
  const html = fs.readFileSync('../../../deck/' + id + '.html', 'utf8');
  const ren = n => { if (n.ic) n.ic = id + '_' + n.ic; (n.ch || []).forEach(ren); };
  d.tree.forEach(ren);
  for (const [k, v] of Object.entries(d.icons)) ICONS[id + '_' + k] = v.replace(/ style="[^"]*"/, '').replace(/ aria-label="[^"]*"/, '');
  // section background: keep the radial centre the extractor drops
  const sec = html.match(/<section[^>]*style="([^"]*)"/)[1];
  const at = sec.match(/ellipse at (\d+)% (\d+)%/);
  let g = d.g; if (g && g.rad && at) g.c = [+at[1] / 100, +at[2] / 100];
  const notes = (html.match(/<aside>([\s\S]*?)<\/aside>/) || [, ''])[1].trim();
  S[id] = { sid: SID[id], bg: d.bg, g: R(g), notes, tree: R(d.tree) };
}
const tpl = fs.readFileSync('render.tpl.js', 'utf8');
process.stdout.write(tpl.replace('/*DATA*/', 'const S=' + JSON.stringify(S) + ';const ICONS=' + JSON.stringify(ICONS) + ';'));
