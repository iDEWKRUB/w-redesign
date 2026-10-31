// Pull real content from whouse.co.th WordPress REST API + pages for the full-system mockup
const fs = require('fs');
const BASE = 'https://www.whouse.co.th';
const get = async (u) => { const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) throw new Error(r.status + ' ' + u); return r; };
const json = async (u) => (await get(u)).json();
const html = async (u) => (await get(u)).text();
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&#038;|&amp;/g, '&').replace(/&#8217;/g, "'")
  .split('\n').map(x => x.trim()).filter(Boolean);
const dec = (s) => strip(s).join(' ');
const imgOf = (p) => { const m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]; if (!m || !m.media_details) return m && m.source_url; const z = m.media_details.sizes || {}; return (z.large || z['1536x1536'] || z.medium_large || z.full || {}).source_url || m.source_url; };

(async () => {
  const out = { designs: [], projects: [], ongoing: [], posts: {}, moreismore: [], images: [] };
  const cats = await json(`${BASE}/wp-json/wp/v2/la_portfolio_category?per_page=50&_fields=id,slug`);
  const cid = Object.fromEntries(cats.map(c => [c.id, c.slug]));
  let pf = [];
  for (let p = 1; p <= 2; p++) { try { pf = pf.concat(await json(`${BASE}/wp-json/wp/v2/la_portfolio?per_page=100&page=${p}&_embed=wp:featuredmedia`)); } catch (e) { } }
  const addImg = (key, url) => { if (url) out.images.push({ key, url }); return key; };

  // ---- designs
  const wantDesign = ['contemporary-style', 'tropical-style', 'modern-style', 'villa-style', 'special-design', 'w-style'];
  const seen = new Set();
  for (const p of pf) {
    const cs = p.la_portfolio_category.map(c => cid[c]);
    if (cs.includes('portfolio') || cs.includes('under-construction')) continue;
    if (!cs.some(c => wantDesign.includes(c))) continue;
    if (seen.has(p.slug)) continue; seen.add(p.slug);
    const modernCount = out.designs.filter(d => d.cats.includes('modern-style') && !d.cats.includes('special-design')).length;
    const specialCount = out.designs.filter(d => d.cats.includes('special-design') && !d.cats.includes('modern-style')).length;
    if (cs.includes('modern-style') && !cs.includes('special-design') && modernCount >= 8 && !/timeless/.test(p.slug)) continue;
    if (cs.includes('special-design') && !cs.includes('modern-style') && specialCount >= 6 && !/forest|space|shine/.test(p.slug)) continue;
    const page = await html(p.link);
    const t = strip(page);
    const kf = t.findIndex(x => /Key Property/i.test(x));
    const spec = {};
    if (kf >= 0) for (const line of t.slice(kf + 1, kf + 9)) {
      const m = line.match(/^(พื้นที่|สัดส่วน|ห้องนอน|ห้องน้ำ|ที่จอดรถ)\s*:\s*(.+)$/); if (m) spec[m[1]] = m[2].trim();
    }
    // fallback for concept pages that list specs in text
    const body = t.join(' | ');
    if (!spec['พื้นที่']) { const m = body.match(/พื้นที่ใช้สอย\s*:?\s*([\d,\.]+)\s*ตร\.ม/); if (m) spec['พื้นที่'] = m[1] + ' SQM.'; }
    if (!spec['ห้องนอน']) { const m = body.match(/(\d+)\s*ห้องนอน/); if (m) spec['ห้องนอน'] = m[1]; }
    if (!spec['ห้องน้ำ']) { const m = body.match(/(\d+)\s*ห้องน้ำ/); if (m) spec['ห้องน้ำ'] = m[1]; }
    if (!spec['ที่จอดรถ']) { const m = body.match(/(\d+)\s*ที่จอดรถ/); if (m) spec['ที่จอดรถ'] = m[1]; }
    const ci = t.findIndex(x => /CONCEPTUAL DESIGN/i.test(x));
    let concept = ci >= 0 ? t.slice(ci + 1, ci + 6).filter(x => x !== 'ㅤ' && !/Key Property/i.test(x)).join(' ') : '';
    concept = concept.replace(/\s+/g, ' ').slice(0, 420);
    const styleM = body.match(/สไตล์\s*:\s*([A-Za-z ]+)/);
    const ups = [...page.matchAll(/https?:\/\/www\.whouse\.co\.th\/wp-content\/uploads\/[^"' )]+?\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0])
      .filter(u => !/logo|Logo|icon|ลายน้ำ|-\d+x\d+\./.test(decodeURI(u)));
    const uniq = [...new Set(ups)];
    const cover = imgOf(p) || uniq[0];
    const second = uniq.find(u => u !== cover && !/scaled-1-819/.test(u));
    const key = 'd-' + p.slug.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    addImg(key, cover); if (second) addImg(key + '-2', second);
    out.designs.push({ slug: p.slug, key, code: dec(p.title.rendered), cats: cs, spec, concept, style: styleM ? styleM[1].trim() : '', has2: !!second });
    process.stdout.write('d');
  }
  // ---- completed projects + ongoing
  for (const p of pf) {
    const cs = p.la_portfolio_category.map(c => cid[c]);
    const title = dec(p.title.rendered);
    if (cs.includes('portfolio')) { const key = 'p-' + p.id; addImg(key, imgOf(p)); out.projects.push({ id: p.id, title, key, date: p.date }); }
    else if (cs.includes('under-construction')) { const key = 'o-' + p.id; addImg(key, imgOf(p)); out.ongoing.push({ id: p.id, title, key, date: p.date }); }
  }
  process.stdout.write('\nprojects ' + out.projects.length + ' ongoing ' + out.ongoing.length + '\n');
  // ---- posts
  const pc = await json(`${BASE}/wp-json/wp/v2/categories?per_page=50&_fields=id,slug`);
  for (const c of pc.filter(c => /^w-(blog|news|events|reviews)$/.test(c.slug))) {
    const ps = await json(`${BASE}/wp-json/wp/v2/posts?categories=${c.id}&per_page=${c.slug === 'w-reviews' ? 9 : 6}&_embed=wp:featuredmedia`);
    out.posts[c.slug] = ps.map(p => {
      const key = 'a-' + p.id; addImg(key, imgOf(p));
      const paras = strip(p.content.rendered).filter(x => x.length > 40).slice(0, 8);
      return { id: p.id, title: dec(p.title.rendered), date: p.date.slice(0, 10), excerpt: dec(p.excerpt.rendered).slice(0, 220), paras, key };
    });
  }
  // ---- more is more
  const mm = await html(`${BASE}/design/more-is-more/`);
  const mt = strip(mm);
  out.moreismoreText = mt.slice(0, 60);
  const mmImgs = [...new Set([...mm.matchAll(/https?:\/\/www\.whouse\.co\.th\/wp-content\/uploads\/[^"' )]+?\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]).filter(u => !/logo|Logo|icon|-\d+x\d+\./.test(u)))];
  out.moreismoreImgs = mmImgs;
  fs.writeFileSync('data.json', JSON.stringify(out, null, 1));
  console.log('designs', out.designs.length, 'posts', Object.entries(out.posts).map(([k, v]) => k + ':' + v.length).join(' '), 'images', out.images.length, 'mm imgs', mmImgs.length);
})();
