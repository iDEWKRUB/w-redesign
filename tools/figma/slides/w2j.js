const p=require('puppeteer-core'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--allow-file-access-from-files']});const pg=await b.newPage();
await pg.goto(pathToFileURL(path.resolve('out/cover.html')).href);
const u=pathToFileURL(path.resolve('../../../deck/img/057cc6202ff07a2060243d764289066d.webp')).href;
const d=await pg.evaluate(async u=>{const i=new Image();i.src=u;await i.decode();const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0);return c.toDataURL('image/jpeg',0.92)},u);
fs.writeFileSync('../../../deck/img/057cc6202ff07a2060243d764289066d.jpg',Buffer.from(d.split(',')[1],'base64'));await b.close()})();
