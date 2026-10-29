import {GODS} from '../catalog.js';import {writeFileSync} from 'node:fs';
const colors={red:['#642f3d','#d64c60','#ff8d67'],teal:['#184854','#368d93','#89e0c2'],gold:['#5b4735','#c69242','#ffe49a'],violet:['#3f355d','#8c6cc4','#d9bded']};
const symbols=[];
for(const [index,g]of GODS.entries()){
 const [dark,mid,light]=colors[g.color]||colors.violet,grid=Array.from({length:40},()=>Array(32).fill(dark));
 const rect=(x,y,w,h,c)=>{for(let j=Math.max(0,y);j<Math.min(40,y+h);j++)for(let i=Math.max(0,x);i<Math.min(32,x+w);i++)grid[j][i]=c;};
 const line=(x,y,x2,y2,c)=>{const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let t=0;t<=n;t++)rect(Math.round(x+(x2-x)*t/n),Math.round(y+(y2-y)*t/n),1,1,c);};
 const disk=(x,y,r,c)=>{for(let j=0;j<40;j++)for(let i=0;i<32;i++)if((i-x)**2+(j-y)**2<=r*r)grid[j][i]=c;};
 const star=(x,y,c=light)=>{rect(x,y-1,1,3,c);rect(x-1,y,3,1,c);};
 for(let y=1;y<39;y+=4)for(let x=(y%8?1:3);x<31;x+=4)rect(x,y,1,1,mid);
 rect(1,1,30,1,light);rect(1,38,30,1,mid);rect(1,1,1,38,mid);rect(30,1,1,38,mid);
 star(5,6);star(26,9);star(27,31);star(4,25);
 const skin=['#e8c8a1','#bdc9ce','#d7bbd7','#e1d5b9'][index%4],ink='#172735',shadow='#8c8195';
 const face=(x=10,y=12,w=12,h=13)=>{rect(x,y,w,h,skin);rect(x,y,2,h,shadow);rect(x+2,y+4,2,2,ink);rect(x+w-4,y+4,2,2,ink);rect(x+4,y+h-3,w-8,1,ink);};
 // A stepped mantle and hood form the common pantheon silhouette; each patron has its own mark.
 rect(9,9,14,18,ink);rect(7,12,18,11,ink);rect(5,28,22,10,ink);rect(7,26,18,11,mid);rect(10,23,12,15,mid);rect(7,29,3,9,dark);rect(23,29,2,9,dark);face();rect(14,26,4,9,light);rect(15,28,2,7,mid);
 const crown=()=>{rect(8,7,16,4,light);for(const x of [8,14,22])rect(x,4,2,6,light);rect(10,8,12,2,mid);};
 if(['scarlet','inkking','sapphire','aurum','crown'].includes(g.id)){crown();rect(9,24,14,14,g.id==='inkking'?ink:mid);rect(14,29,4,4,light);if(g.id==='aurum'){rect(10,12,12,13,'#e7b84e');rect(12,16,2,2,ink);rect(18,16,2,2,ink);}if(g.id==='crown')rect(12,3,8,2,light);}
 if(g.id==='echo'){rect(5,12,2,13,light);rect(3,15,1,7,mid);rect(25,12,2,13,light);rect(28,15,1,7,mid);rect(12,30,2,5,ink);rect(18,30,2,5,ink);}
 if(g.id==='striker'){rect(4,7,11,5,light);rect(3,8,2,3,mid);rect(8,12,3,18,'#b28161');rect(8,27,4,3,skin);rect(12,8,3,6,mid);}
 if(g.id==='resonator'){for(const [x,y,w,h]of [[4,7,24,1],[4,29,24,1],[4,8,1,21],[27,8,1,21],[7,10,18,1],[7,26,18,1],[7,11,1,15],[24,11,1,15]])rect(x,y,w,h,light);rect(12,14,8,9,ink);rect(14,17,4,3,light);}
 if(g.id==='refrain'){for(const x of [5,24]){line(x+3,9,x,13,light);line(x,13,x+3,17,light);}rect(11,30,4,3,light);rect(17,30,4,3,light);}
 if(g.id==='oath'){rect(8,10,16,7,'#b0bfc2');rect(10,15,12,3,ink);rect(15,11,2,14,mid);rect(11,29,10,7,light);rect(13,27,6,3,light);rect(15,31,2,3,ink);}
 if(g.id==='ladder'){rect(4,13,2,23,light);rect(9,13,2,23,light);for(let y=15;y<35;y+=4)rect(5,y,5,1,light);rect(11,7,10,4,mid);}
 if(g.id==='twins'){rect(4,10,24,18,dark);face(4,13,10,12);face(18,13,10,12);rect(4,27,10,11,mid);rect(18,27,10,11,light);rect(7,9,4,3,light);rect(21,9,4,3,mid);}
 if(g.id==='trinity'||g.id==='chorus'){rect(3,9,26,25,dark);for(const [i,x]of [4,12,20].entries()){rect(x,12+(i%2)*3,8,13,ink);face(x+1,14+(i%2)*3,6,10);rect(x,27,8,11,i===1?light:mid);}}
 if(g.id==='finger'){rect(5,5,22,22,dark);for(let i=0;i<6;i++)rect(5+i*4,7+(i%3)*2,2,14,light);rect(7,16,18,12,light);rect(10,20,2,5,mid);rect(16,19,2,6,mid);rect(12,28,9,10,mid);}
 if(g.id==='ember'){for(const [x,y,w,h]of [[8,9,3,6],[12,4,3,9],[17,7,4,7],[23,10,2,7]])rect(x,y,w,h,'#ff9861');rect(14,30,4,5,'#ffbd7a');rect(15,27,2,5,'#ffe29b');}
 if(g.id==='fortune'){disk(16,13,10,light);disk(16,13,7,mid);face(11,11,10,13);for(const [x,y]of [[16,2],[4,13],[28,13],[7,4],[25,4]])star(x,y);}
 if(g.id==='midas'){rect(10,12,12,13,'#e3b153');rect(12,16,2,2,ink);rect(18,16,2,2,ink);disk(25,24,4,light);rect(25,22,1,5,mid);}
 if(g.id==='obsidian'){rect(10,12,12,13,ink);rect(12,16,2,2,light);rect(18,16,2,2,light);line(11,21,20,13,mid);}
 if(['moon','hermit','undertow'].includes(g.id)){disk(16,12,10,light);disk(20,10,9,dark);rect(10,13,12,12,ink);face(12,15,8,10);if(g.id==='hermit'){rect(13,23,6,7,'#e6ded0');rect(14,29,4,3,'#e6ded0');rect(25,23,4,8,light);rect(26,24,2,5,mid);}if(g.id==='undertow')for(let y=27;y<38;y+=3){rect(5,y,8,1,light);rect(18,y+1,8,1,mid);}}
 if(g.id==='relic'){rect(9,11,14,14,'#e6ddc2');rect(11,15,4,4,ink);rect(18,15,3,4,ink);rect(15,20,2,3,ink);for(let x=11;x<23;x+=3)rect(x,24,1,3,ink);}
 if(g.id==='smallfortune'){rect(9,9,14,18,dark);face(11,19,10,10);rect(9,29,14,9,mid);star(9,10);star(22,8);star(17,4);}
 if(g.id==='giant'){face(6,11,20,16);rect(4,8,4,12,light);rect(24,8,4,12,light);rect(10,28,12,10,mid);rect(10,7,12,3,ink);}
 if(g.id==='odd'||g.id==='even'){for(let i=0;i<(g.id==='odd'?3:2);i++)rect(11+i*4,29,2,6,light);rect(15,11,1,13,mid);}
 if(g.id==='balance'||g.id==='divide'){rect(16,12,6,13,g.id==='divide'?'#e26562':'#69bec6');rect(18,16,2,2,ink);rect(7,27,9,11,g.id==='divide'?'#a44150':mid);rect(16,27,9,11,g.id==='divide'?ink:'#659fbd');}
 if(g.id==='mirror'){rect(7,9,18,18,light);rect(9,11,14,14,ink);rect(11,13,10,10,mid);line(11,21,19,13,'#e4e5ef');}
 if(g.id==='cartographer'){rect(7,7,18,5,mid);rect(4,11,24,2,light);rect(20,24,10,12,'#e6d2a2');line(21,32,27,26,mid);rect(25,30,2,2,ink);}
 if(g.id==='sentinel'){rect(8,9,16,7,light);rect(10,14,12,3,ink);rect(15,10,2,15,mid);rect(4,25,9,10,light);rect(6,27,5,7,mid);rect(8,26,1,8,light);}
 if(g.id==='pauper'){rect(8,7,15,5,mid);rect(7,11,18,3,mid);rect(20,29,4,4,light);rect(12,16,2,2,shadow);}
 if(g.id==='banker'){rect(9,5,14,7,ink);rect(6,12,20,2,light);rect(18,15,4,4,light);rect(19,16,2,2,ink);rect(16,27,1,8,light);disk(7,29,3,light);}
 if(g.id==='prism'||g.id==='kaleidoscope'){rect(8,9,16,17,ink);for(let y=0;y<14;y++){const width=Math.min(y,13-y)+2;rect(16-width,10+y,width,y<7?1:1,y<7?'#f4b4c5':'#83c6c4');rect(16,10+y,width,1,y<7?'#efc86f':'#9997e1');}rect(15,26,2,9,light);}
 if(g.id==='rainmaker'){for(const [x,y,r]of [[9,12,5],[15,8,6],[23,12,5]])disk(x,y,r,'#a4c5d0');face(11,15,10,10);for(const x of [5,26]){rect(x,23,1,3,light);rect(x-1,26,2,1,light);}}
 if(g.id==='scavenger'){rect(10,11,13,13,ink);rect(19,16,9,4,light);rect(19,18,6,4,mid);rect(14,15,2,2,light);rect(6,27,20,11,mid);}
 if(g.id==='tide'){rect(8,8,16,5,mid);for(const x of [8,15,23]){rect(x,5,1,6,light);rect(x-1,10,3,2,light);}for(let y=29;y<38;y+=3)rect(7+(y%2)*2,y,16,1,light);}
 if(g.id==='quartet'){rect(3,6,26,27,ink);for(const x of [4,11,18,25]){rect(x,10,3,23,light);rect(x-1,8,5,3,mid);}rect(3,33,26,3,light);}
 if(g.id==='pactkeeper'){disk(16,18,11,light);disk(16,18,9,ink);rect(8,17,16,3,mid);rect(12,12,3,12,light);rect(18,12,3,12,light);rect(10,20,13,4,mid);}
 if(g.id==='anchor'){rect(15,8,2,25,light);disk(16,8,3,light);disk(16,8,1,ink);rect(8,17,16,2,light);line(5,26,16,35,light);line(27,26,16,35,light);rect(4,25,3,6,light);rect(25,25,3,6,light);}
 if(g.id==='wildling'){line(8,14,4,4,light);line(24,14,28,4,light);line(5,8,2,6,light);line(27,8,30,6,light);rect(11,9,10,4,mid);rect(12,30,8,3,ink);}
 if(g.id==='duelist'){line(3,7,26,33,light);line(29,7,6,33,light);rect(3,27,9,2,mid);rect(21,27,9,2,mid);rect(7,32,3,5,light);rect(22,32,3,5,light);}
 if(g.id==='outcast'){rect(6,7,20,8,ink);rect(7,14,18,2,mid);rect(11,16,5,3,ink);rect(20,27,5,5,light);rect(21,28,3,3,dark);}
 if(g.id==='crossroads'){rect(12,5,8,31,ink);rect(3,17,26,8,ink);for(let y=5;y<36;y+=5)rect(15,y,2,3,light);for(let x=3;x<29;x+=5)rect(x,20,3,2,light);}
 if(g.id==='chromatic'){rect(3,8,13,24,'#b85563');rect(16,8,13,24,'#377c9c');disk(10,16,4,'#ffd080');disk(23,24,4,'#d5c9ed');rect(3,31,26,3,ink);}
 if(g.id==='frugal'){rect(11,16,4,1,ink);rect(18,16,4,1,ink);rect(13,24,6,6,light);rect(15,25,2,4,mid);rect(6,6,20,3,light);}
 if(g.id==='craftsman'){rect(4,8,24,6,light);rect(6,10,20,2,ink);rect(8,26,16,12,ink);rect(11,29,10,3,light);rect(14,26,4,10,light);}
 if(g.id==='harvester'){rect(6,5,2,31,light);line(7,5,25,10,light);line(25,10,28,17,light);rect(23,9,4,3,mid);rect(10,31,13,2,light);}
 if(g.id==='comet'){rect(3,6,26,28,ink);line(4,7,20,23,mid);line(10,5,23,20,light);line(3,13,16,26,light);disk(22,26,7,mid);disk(22,26,5,light);disk(23,27,2,ink);}
 const grouped=new Map();for(let y=0;y<40;y++){let x=0;while(x<32){const c=grid[y][x];let end=x+1;while(end<32&&grid[y][end]===c)end++;grouped.set(c,(grouped.get(c)||'')+`M${x} ${y}h${end-x}v1H${x}z`);x=end;}}
 symbols.push(`<symbol id="${g.id}" viewBox="0 0 32 40">${[...grouped].map(([c,d])=>`<path fill="${c}" d="${d}"/>`).join('')}</symbol>`);
}
writeFileSync(new URL('../assets/patrons.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><title>Original Rogue Dice patron portraits</title><defs>${symbols.join('')+`<symbol id="study" viewBox="0 0 32 40"><path fill="#214a65" d="M0 0h32v40H0z"/><path fill="#f0d9a6" d="M5 8h22v25H5z"/><path fill="#618bba" d="M8 10h7v20H8zM17 10h7v20h-7z"/><path fill="#fff2cb" d="M10 13h4v1h-4zM10 17h4v1h-4zM18 13h4v1h-4zM18 17h4v1h-4zM15 8h2v27h-2z"/><path fill="#f4bd62" d="M15 2h2v4h-2zM12 3h8v1h-8z"/></symbol><symbol id="action" viewBox="0 0 32 40"><path fill="#614477" d="M0 0h32v40H0z"/><path fill="#c8a7db" d="M5 6h20v27H5z"/><path fill="#24384f" d="M7 8h16v23H7z"/><path fill="#ffe0a0" d="M17 10h5l-7 9h6L11 29l3-9H9z"/><path fill="#f7e8ca" d="M4 3h2v4H4zM2 4h6v1H2zM26 30h2v5h-2zM24 32h6v1h-6z"/></symbol><symbol id="voucher" viewBox="0 0 32 40"><path fill="#385342" d="M0 0h32v40H0z"/><path fill="#eab45e" d="M3 9h26v23H3z"/><path fill="#f5df9d" d="M5 11h22v19H5z"/><path fill="#385342" d="M0 18h6v5H0zM26 18h6v5h-6zM10 14h1v2h-1zM10 19h1v2h-1zM10 24h1v2h-1zM16 18h7v7h-7z"/><path fill="#d58a45" d="M18 16h3v11h-3z"/></symbol>`}</defs></svg>`);
writeFileSync(new URL('../assets/table.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM3 4h1v1H3z" fill="#e0ffe8" opacity=".045"/></pattern></defs><path fill="#12544b" d="M0 0h1600v1000H0z"/><g fill="none" stroke-width="100" opacity=".3"><ellipse cx="1100" cy="460" rx="800" ry="550" stroke="#267466" transform="rotate(-28 1100 460)"/><ellipse cx="1050" cy="450" rx="600" ry="400" stroke="#0d3b3b" transform="rotate(-28 1050 450)"/><ellipse cx="1000" cy="450" rx="420" ry="250" stroke="#257467" transform="rotate(-28 1000 450)"/><ellipse cx="970" cy="450" rx="240" ry="100" stroke="#124c45" transform="rotate(-28 970 450)"/></g><path fill="url(#grain)" d="M0 0h1600v1000H0z"/></svg>`);
console.log(`Built ${symbols.length} original pixel portraits and table texture.`);
