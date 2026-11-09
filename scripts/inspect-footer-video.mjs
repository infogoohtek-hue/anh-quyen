const html=await(await fetch('https://drive.google.com/drive/folders/1nAdOS6oDvfOqUuj09MdeUPxqht4SZ8VE')).text();
const raw=html.match(/_DRIVE_ivd'\] = '((?:\\.|[^'])*)'/)?.[1];
if(!raw)throw Error('Folder unavailable');
const decoded=raw.replace(/\\x([0-9a-f]{2})/gi,(_,h)=>String.fromCharCode(parseInt(h,16))).replace(/\\\//g,'/').replace(/\\'/g,"'").replace(/\\\\/g,'\\');
console.log(JSON.stringify((JSON.parse(decoded)[0]||[]).map(r=>({id:r[0],name:r[2],type:r[3]}))));
