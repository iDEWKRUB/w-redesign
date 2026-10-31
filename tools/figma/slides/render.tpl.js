/*DATA*/
const hex=s=>{const [h,a]=s.split(':');return {c:{r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255},a:a===undefined?1:+a}};
const solid=s=>{const {c,a}=hex(s);return {type:'SOLID',color:c,opacity:a}};
const WS={100:'Thin',200:'ExtraLight',300:'Light',400:'Regular',500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold',900:'Black'};
const fnt=(fam,w,it)=>{w=Math.min(900,Math.max(100,Math.round((w||400)/100)*100));if(fam==='Anuphan'){w=Math.min(700,w);it=0}if(fam==='Cormorant Garamond')w=Math.min(700,Math.max(300,w));let s=WS[w];if(it)s=s==='Regular'?'Italic':s+' Italic';return {family:fam,style:s}};
const stops=g=>g.s.map(([col,p])=>{const h=hex(col);return {color:{...h.c,a:h.a},position:Math.max(0,Math.min(1,p))}});
const grad=g=>{if(g.rad){const [cx,cy]=g.c||[0.5,0.5];const rx=Math.max(cx,1-cx)*1.414,ry=Math.max(cy,1-cy)*1.414;return {type:'GRADIENT_RADIAL',gradientTransform:[[1/(2*rx),0,0.5-cx/(2*rx)],[0,1/(2*ry),0.5-cy/(2*ry)]],gradientStops:stops(g)}}
 const t=(g.a-90)*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return {type:'GRADIENT_LINEAR',gradientTransform:[[c,s,0.5-c/2-s/2],[-s,c,0.5+s/2-c/2]],gradientStops:stops(g)}};
const need=new Set();const scan=n=>{if(n.k==='t')for(const r of n.runs)need.add(JSON.stringify(fnt(r[5],r[3],r[4])));(n.ch||[]).forEach(scan)};
for(const d of Object.values(S))d.tree.forEach(scan);
const bad=[];await Promise.all([...need].map(k=>figma.loadFontAsync(JSON.parse(k)).catch(()=>bad.push(k))));
let count=0;
// append to the real parent first, then size/style/position (Slides -240 offset rule)
const mk=(n,par)=>{count++;let o;
 if(n.k==='t'){o=figma.createText();par.appendChild(o);const r0=n.runs[0];o.fontName=fnt(r0[5],r0[3],r0[4]);o.characters=n.txt;
  for(const r of n.runs){const e=Math.min(r[1],n.txt.length);if(e<=r[0])continue;try{o.setRangeFontName(r[0],e,fnt(r[5],r[3],r[4]))}catch(x){}o.setRangeFontSize(r[0],e,r[6]||24);o.setRangeFills(r[0],e,[solid(r[2])])}
  if(n.lh)o.lineHeight={unit:'PIXELS',value:n.lh};if(n.ls)o.letterSpacing={unit:'PIXELS',value:n.ls};
  o.textAlignHorizontal=n.al||'LEFT';
  if((n.h||0)<=(n.lh||30)*1.5&&(n.al||'LEFT')==='LEFT'){o.textAutoResize='WIDTH_AND_HEIGHT'}
  else{o.resize(Math.max(1,n.w+3),Math.max(1,n.h));o.textAutoResize='HEIGHT'}
  o.name=n.txt.slice(0,30);
 } else if(n.k==='i'){o=figma.createRectangle();par.appendChild(o);o.resize(Math.max(1,n.w),Math.max(1,n.h));o.fills=[{type:'IMAGE',imageHash:n.src,scaleMode:n.fit==='FIT'?'FIT':'FILL'}];if(n.r)o.cornerRadius=n.r;o.name=n.n||'image';
 } else if(n.k==='v'){let s=ICONS[n.ic];if(s)s=s.replace(/currentColor/g,n.c.split(':')[0]);try{o=figma.createNodeFromSvg(s)}catch(e){o=figma.createFrame();o.fills=[]}par.appendChild(o);o.resize(Math.max(1,n.w),Math.max(1,n.h));o.name='icon';
 } else {o=figma.createFrame();par.appendChild(o);o.resize(Math.max(1,n.w),Math.max(1,n.h));o.name=n.n||'box';const f=[];if(n.f)f.push(solid(n.f));if(n.bi)f.push({type:'IMAGE',imageHash:n.bi,scaleMode:'FILL'});if(n.g)f.push(grad(n.g));o.fills=f;o.clipsContent=!!n.cl;
  if(n.s){o.strokes=[solid(n.s[0])];o.strokeWeight=n.s[1];o.strokeAlign='INSIDE'}
  else if(n.sd){const k=Object.keys(n.sd);o.strokes=[solid(n.sd[k[0]][0])];o.strokeAlign='INSIDE';o.strokeTopWeight=n.sd.T?n.sd.T[1]:0;o.strokeRightWeight=n.sd.R?n.sd.R[1]:0;o.strokeBottomWeight=n.sd.B?n.sd.B[1]:0;o.strokeLeftWeight=n.sd.L?n.sd.L[1]:0}
  if(n.r){if(Array.isArray(n.r)){[o.topLeftRadius,o.topRightRadius,o.bottomRightRadius,o.bottomLeftRadius]=n.r}else o.cornerRadius=n.r}
  const ef=[];if(n.sh){const h=hex(n.sh[0]);ef.push({type:'DROP_SHADOW',color:{...h.c,a:h.a},offset:{x:n.sh[1]||0,y:n.sh[2]||0},radius:n.sh[3]||0,spread:n.sh[4]||0,visible:true,blendMode:'NORMAL',showShadowBehindNode:false})}
  if(n.bl)ef.push({type:'BACKGROUND_BLUR',radius:n.bl,visible:true});if(ef.length)o.effects=ef;
 }
 if(n.op)o.opacity=n.op;o.x=n.x||0;o.y=n.y||0;
 if(n.k==='b')(n.ch||[]).forEach(c=>mk(c,o));
 return o};
const done={};
for(const [id,d] of Object.entries(S)){
 const sl=await figma.getNodeByIdAsync(d.sid);for(const c of [...sl.children])c.remove();
 const f=[];if(d.bg)f.push(solid(d.bg));if(d.g)f.push(grad(d.g));sl.fills=f.length?f:[solid('#ffffff')];
 const before=count;d.tree.forEach(n=>mk(n,sl));
 if(d.notes)sl.speakerNotes=d.notes;
 done[id]=count-before;
}
return {done,bad};
