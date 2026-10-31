// node up.js <offset> <id,id,...>  -> uploads imglist[offset..] to the given upload ids, merges hashes into hashes.json
const fs=require('fs'),path=require('path');const {execFileSync}=require('child_process');
const list=JSON.parse(fs.readFileSync('imglist.json'));const off=+process.argv[2];const ids=process.argv[3].split(',');
const H=fs.existsSync('hashes.json')?JSON.parse(fs.readFileSync('hashes.json')):{};
const jobs=ids.map((id,i)=>[id,list[off+i]]).filter(j=>j[1]);
let done=0;
for(const [id,img] of jobs){const f='C:/Users/NEXA-ADMIN/whouse-redesign/site/'+img;
 const ext=path.extname(img).slice(1).toLowerCase();const ct={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml'}[ext];
 try{const out=execFileSync('curl',['-s','-F',`file=@${f};type=${ct}`,`https://mcp.figma.com/mcp/upload/${id}/submit?scaleMode=FILL&currentPageId=154%3A6`]).toString();
 const j=JSON.parse(out);if(j.imageHash){H[img]=[j.imageHash,j.placedOnNodeId];done++}else console.log('fail',img,out.slice(0,200))}catch(e){console.log('err',img,String(e).slice(0,200))}}
fs.writeFileSync('hashes.json',JSON.stringify(H));console.log('done',done,'of',jobs.length,'total',Object.keys(H).length);
