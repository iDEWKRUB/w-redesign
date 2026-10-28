// Download every image in data.json and make m (1100w) + s (560w) JPGs, flattening PNG alpha onto white
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const FF = path.resolve(__dirname, '../ff/node_modules/ffmpeg-static/ffmpeg.exe');
const OUT = path.resolve(__dirname, '../v2/img/x'); fs.mkdirSync(OUT + '/s', { recursive: true });
const RAW = path.resolve(__dirname, 'raw'); fs.mkdirSync(RAW, { recursive: true });
const d = require('./data.json');
const list = [...d.images, ...d.moreismoreImgs.map((u, i) => ({ key: 'mm-' + (i + 1), url: u }))];
const conv = (src, dst, w) => execFileSync(FF, ['-y', '-loglevel', 'error', '-i', src, '-filter_complex',
  `color=white:s=16x16[bg];[bg][0]scale2ref[bg][im];[bg][im]overlay=format=auto,scale='min(${w},iw)':-2,format=yuvj420p`, '-frames:v', '1', '-q:v', '5', dst]);
(async () => {
  let ok = 0, fail = [];
  const q = [...list];
  const worker = async () => {
    while (q.length) {
      const { key, url } = q.shift();
      const m = path.join(OUT, key + '.jpg'), s = path.join(OUT, 's', key + '.jpg');
      if (fs.existsSync(m) && fs.existsSync(s)) { ok++; continue; }
      try {
        const r = await fetch(encodeURI(decodeURI(url)), { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!r.ok) throw new Error(r.status);
        const raw = path.join(RAW, key + path.extname(new URL(url).pathname).toLowerCase());
        fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
        conv(raw, m, 1100); conv(raw, s, 560); ok++;
      } catch (e) { fail.push(key + ' ' + e.message); }
    }
  };
  await Promise.all([1, 2, 3, 4, 5, 6].map(worker));
  console.log('ok', ok, 'fail', fail.length, fail.slice(0, 10));
})();
