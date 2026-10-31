const fs=require('fs'),path=require('path');
const SITE=path.resolve(__dirname,'../site');
const old=fs.readFileSync(__dirname+'/d-parts/backup-v5.html','utf8').replace('family=Noto+Serif+Thai:wght@400;500','family=Anuphan:wght@300;400;500;600').replace('family=Fraunces:opsz,wght@9..144,400;9..144,500','family=Jost:ital,wght@0,300;0,400;0,500;1,300;1,400');
let head=old.slice(0,old.indexOf('<header>')).replace('<title>','<meta name="robots" content="noindex,nofollow">\n<title>').replace('<title>W House Option D</title>','<title>W House — Website Redesign</title>\n<link rel="icon" type="image/png" sizes="32x32" href="img/brand/icon-32.png">\n<link rel="apple-touch-icon" href="img/brand/icon-180.png">');
const fix=fs.readFileSync(__dirname+'/fix.css','utf8');
let css=fs.readFileSync(__dirname+'/extra2.css','utf8').replace('@media(max-width:1100px){nav.main,.lang,.bar>.btn{display:none!important}','@media(max-width:1100px){nav.main,.hicons .lang,.bar>.btn{display:none!important}');
head=head.replace('</style>',css+fix+'</style>');
const sprite=fs.readFileSync(__dirname+'/sprite.svg','utf8');
const out=head+sprite+fs.readFileSync(__dirname+'/body2.html','utf8')+'\n<script src="data.js"></script>\n<script>\n'+fs.readFileSync(__dirname+'/app.js','utf8')+'\n</script>\n';
// standalone hosting needs the document shell the artifact viewer normally adds
const shell='<!doctype html>\n<html lang="th">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n';
fs.writeFileSync(SITE+'/index.html',shell+out);console.log('assembled',(out.length/1024).toFixed(0)+'KB');
