// Build the live site: web/ (sources) → web/dist → site/ (what Vercel serves)
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const web = path.join(__dirname, 'web'), site = path.join(__dirname, 'site');
execSync('node parts/assemble.js', { cwd: web, stdio: 'inherit' });
execSync('node build.js', { cwd: web, stdio: 'inherit' });
fs.rmSync(site, { recursive: true, force: true });
fs.cpSync(path.join(web, 'dist'), site, { recursive: true });
fs.writeFileSync(path.join(site, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
const fav = path.join(__dirname, 'archive/option-d/site/favicon.ico');
if (fs.existsSync(fav)) fs.copyFileSync(fav, path.join(site, 'favicon.ico'));
console.log('site/ ready');
