// PAGES: [route, carrierId, x, y, label, sub, headerVariantId]
const PG=await figma.getNodeByIdAsync('154:3'); await figma.setCurrentPageAsync(PG);
const rd=async id=>JSON.parse((await figma.getNodeByIdAsync(id)).findOne(x=>x.type==='TEXT').characters);
const ICONS=await rd('156:20');
const hex=s=>{const [h,a]=s.split(':');return {c:{r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255},a:a===undefined?1:+a}};
const solid=s=>{const {c,a}=hex(s);return {type:'SOLID',color:c,opacity:a}};
const WS={100:'Thin',200:'ExtraLight',300:'Light',400:'Regular',500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold',900:'Black'};
const fnt=(fam,w,it)=>{w=Math.min(900,Math.max(100,Math.round((w||400)/100)*100));if(fam==='Anuphan'){w=Math.min(700,w);it=0}if(fam==='Figtree'&&w<300)w=300;let s=WS[w];if(it)s=s==='Regular'?'Italic':s+' Italic';return {family:fam,style:s}};
const need=new Map();const scan=n=>{if(n.k==='t')for(const r of n.runs)need.set(JSON.stringify(fnt(r[5],r[3],r[4])),1);(n.ch||[]).forEach(scan)};
const loadFonts=async root=>{scan(root);for(const k of need.keys()){try{await figma.loadFontAsync(JSON.parse(k))}catch(e){}}};
const grad=g=>{const t=(g.a-90)*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return {type:'GRADIENT_LINEAR',gradientTransform:[[c,s,0.5-c/2-s/2],[-s,c,0.5+s/2-c/2]],gradientStops:g.s.map(([col,p])=>{const h=hex(col);return {color:{...h.c,a:h.a},position:Math.max(0,Math.min(1,p))}})}};
let count=0;
const mk=(n,par)=>{count++;let o;
 if(n.k==='t'){o=figma.createText();const r0=n.runs[0];o.fontName=fnt(r0[5],r0[3],r0[4]);o.characters=n.txt;
  for(const r of n.runs){const e=Math.min(r[1],n.txt.length);if(e<=r[0])continue;try{o.setRangeFontName(r[0],e,fnt(r[5],r[3],r[4]))}catch(x){}o.setRangeFontSize(r[0],e,r[6]||14);o.setRangeFills(r[0],e,[solid(r[2])])}
  if(n.lh)o.lineHeight={unit:'PIXELS',value:n.lh};if(n.ls)o.letterSpacing={unit:'PIXELS',value:n.ls};
  o.textAlignHorizontal=n.al||'LEFT';
  if(n.va){o.resize(Math.max(1,n.w),Math.max(1,n.h));o.textAutoResize='NONE';o.textAlignVertical=n.va}
  else if(n.cl){o.resize(Math.max(1,n.w+2),Math.max(1,n.h));o.textAutoResize='NONE';o.textTruncation='ENDING';o.maxLines=Math.max(1,Math.round(n.h/(n.lh||20)))}
  else if((n.h||0)<=(n.lh||20)*1.5&&(n.al||'LEFT')==='LEFT'){o.textAutoResize='WIDTH_AND_HEIGHT'}
  else{o.resize(Math.max(1,n.w+3),Math.max(1,n.h));o.textAutoResize='HEIGHT'}
 } else if(n.k==='i'){o=figma.createRectangle();o.resize(Math.max(1,n.w),Math.max(1,n.h));o.fills=[{type:'IMAGE',imageHash:n.src,scaleMode:n.fit==='FIT'?'FIT':'FILL'}];if(n.r)o.cornerRadius=n.r;o.name=n.n||'image';
 } else if(n.k==='v'){let s=ICONS[n.ic];if(!s){o=figma.createFrame();o.fills=[]}else{s=s.replace(/currentColor/g,n.c.split(':')[0]);try{o=figma.createNodeFromSvg(s)}catch(e){o=figma.createFrame();o.fills=[]}}o.resize(Math.max(1,n.w),Math.max(1,n.h));o.name='icon/'+n.ic.replace(/^i-/,'');
 } else {o=figma.createFrame();o.resize(Math.max(1,n.w),Math.max(1,n.h));o.name=n.n||'box';const f=[];if(n.f)f.push(solid(n.f));if(n.bi)f.push({type:'IMAGE',imageHash:n.bi,scaleMode:'FILL'});if(n.g)f.push(grad(n.g));o.fills=f;o.clipsContent=!!n.cl;
  if(n.s){o.strokes=[solid(n.s[0])];o.strokeWeight=n.s[1];o.strokeAlign='INSIDE'}
  else if(n.sd){const k=Object.keys(n.sd);o.strokes=[solid(n.sd[k[0]][0])];o.strokeAlign='INSIDE';o.strokeTopWeight=n.sd.T?n.sd.T[1]:0;o.strokeRightWeight=n.sd.R?n.sd.R[1]:0;o.strokeBottomWeight=n.sd.B?n.sd.B[1]:0;o.strokeLeftWeight=n.sd.L?n.sd.L[1]:0}
  if(n.r){if(Array.isArray(n.r)){[o.topLeftRadius,o.topRightRadius,o.bottomRightRadius,o.bottomLeftRadius]=n.r}else o.cornerRadius=n.r}
  const ef=[];if(n.sh){const h=hex(n.sh[0]);ef.push({type:'DROP_SHADOW',color:{...h.c,a:h.a},offset:{x:n.sh[1]||0,y:n.sh[2]||0},radius:n.sh[3]||0,spread:n.sh[4]||0,visible:true,blendMode:'NORMAL'})}
  if(n.bl)ef.push({type:'BACKGROUND_BLUR',radius:n.bl,visible:true});if(ef.length)o.effects=ef;
  (n.ch||[]).forEach(c=>mk(c,o));}
 if(n.op)o.opacity=n.op;par.appendChild(o);o.x=n.x||0;o.y=n.y||0;return o};
await figma.loadFontAsync({family:'Anuphan',style:'SemiBold'});await figma.loadFontAsync({family:'Sarabun',style:'Regular'});
const out=[];
for(const [route,cid,X,Y,label,sub,hv] of PAGES){
 const old=PG.children.filter(n=>n.getPluginData?false:false);
 const D=await rd(cid); await loadFonts(D.main);
 const fr=figma.createFrame();PG.appendChild(fr);fr.name=label+' · #'+route;fr.resize(1440,D.H);fr.x=X;fr.y=Y;fr.fills=[solid(D.bg)];fr.clipsContent=true;
 const m=mk(D.main,fr);m.x=0;m.y=D.mainY;m.name='Content';
 const h=(await figma.getNodeByIdAsync(hv)).createInstance();fr.appendChild(h);h.x=0;h.y=0;h.name='Header';
 const f=(await figma.getNodeByIdAsync('157:92')).createInstance();fr.appendChild(f);f.x=0;f.y=D.fy;f.name='Footer';
 const lb=figma.createAutoLayout('VERTICAL',{name:'Label · '+route,itemSpacing:8});lb.fills=[];PG.appendChild(lb);
 const t1=figma.createText();t1.fontName={family:'Anuphan',style:'SemiBold'};t1.characters=label;t1.fontSize=72;t1.fills=[solid('#22171A')];lb.appendChild(t1);
 const t2=figma.createText();t2.fontName={family:'Sarabun',style:'Regular'};t2.characters=sub+'  ·  #'+route+'  ·  1440 × '+Math.round(D.H);t2.fontSize=34;t2.fills=[solid('#9A8C8F')];lb.appendChild(t2);
 lb.x=X;lb.y=Y-lb.height-48;
 out.push({route,frame:fr.id,label:lb.id,H:D.H});
}
return {out,count};
