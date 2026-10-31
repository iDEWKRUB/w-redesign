const fs=require('fs');const H=JSON.parse(fs.readFileSync('hashes.json'));
const R=v=>typeof v==="number"?(Math.abs(v)<4?Math.round(v*100)/100:Math.round(v*2)/2):Array.isArray(v)?v.map(R):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k,x])=>x!==undefined&&x!==null&&x!==0&&k!=='after'&&k!=='ps').map(([k,x])=>[k,k==='src'||k==='bi'?(H[x]?H[x][0]:x):R(x)])):v;
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g,'\u0020');
const svg=(name,obj)=>{const j=esc(JSON.stringify(obj));fs.writeFileSync('svg/'+name+'.svg','<svg xmlns="http://www.w3.org/2000/svg" width="40" height="10"><text x="0" y="8" font-family="Sarabun" font-size="2">'+j+'</text></svg>');return j.length};
const routes=['home','design','design-modern','plan-m062','more-is-more','a-life-of-style','projects','project-6680','ongoing','reviews','process','news-event','blog','article-10109','about','contact','saved','privacy','nope'];
const icons={};const ren=(n,r)=>{if(n.ic&&n.ic.startsWith('inl'))n.ic=r+'_'+n.ic;(n.ch||[]).forEach(c=>ren(c,r))};
const D={};for(const r of routes){const d=JSON.parse(fs.readFileSync(r+'.json'));D[r]=d;for(const[k,v]of Object.entries(d.icons))icons[k.startsWith('inl')?r+'_'+k:k]=v;ren(d.main,r);if(d.headerTree){ren(d.headerTree,r);ren(d.footerTree,r)}
 svg('D-'+r,{r,H:R(d.H),bg:d.bg,mainY:R(d.main.y),fy:R(d.footer.y),cy:d.cta?R(d.cta.y):null,main:R(d.main)});}
svg('D-chrome',{hdrT:R(D.home.headerTree),hdrS:R(D.design.headerTree),ftr:R(D.home.footerTree),cta:R(D.home.ctaTree)});
svg('D-icons',icons);console.log(fs.readdirSync('svg').join(' '));
