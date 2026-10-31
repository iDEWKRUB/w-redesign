const fs=require('fs');const {execFileSync}=require('child_process');
const urls=process.argv.slice(2);const imgs=fs.readdirSync('img').filter(f=>f.endsWith('.jpg')).sort();
const H={};urls.forEach((u,i)=>{const f=imgs[i];const out=execFileSync('curl',['-s','-F',`file=@img/${f};type=image/jpeg`,u]).toString();try{const j=JSON.parse(out);H[f.slice(0,32)]=j.imageHash;}catch(e){console.log('fail',f,out.slice(0,200))}});
fs.writeFileSync('hashes.json',JSON.stringify(H,null,0));console.log(Object.keys(H).length,JSON.stringify(H).slice(0,200));
