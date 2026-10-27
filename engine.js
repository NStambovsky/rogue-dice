export const VERSION=3;
export const HANDS={pair:{name:'Pair',chips:12,mult:2},twopair:{name:'Two Pair',chips:24,mult:3},triplet:{name:'Triplet',chips:24,mult:3},run:{name:'Run',chips:18,mult:3}};
export const GODS=[
 {id:'echo',name:'The Echo',symbol:'Ⅱ',color:'violet',price:8,text:'Each scored pair grows this God’s permanent +Mult by 1. Two Pair grows it by 2. Applies immediately.'},
 {id:'scarlet',name:'The Red Queen',symbol:'♛',color:'red',price:8,text:'All dice count as red while this God is equipped. Original colors return when sold.'},
 {id:'ladder',name:'The Wayfarer',symbol:'↗',color:'teal',price:7,text:'Runs gain +2 Mult for every die in the Run.'},
 {id:'trinity',name:'Three Fates',symbol:'Ⅲ',color:'violet',price:8,text:'Triplets score ×3 Mult.'},
 {id:'twins',name:'The Twins',symbol:'Ⅱ',color:'gold',price:7,text:'Pair and Two Pair hands score ×2 Mult.'},
 {id:'midas',name:'The Alchemist',symbol:'✦',color:'gold',price:6,text:'Earn $2 whenever you score a hand with all dice the same color.'},
 {id:'fortune',name:'First Light',symbol:'☀',color:'gold',price:7,text:'Your first scoring hand each round scores ×2 Mult.'},
 {id:'ember',name:'The Ember',symbol:'✹',color:'red',price:6,text:'Every red die in your scored hand adds +8 Chips.'},
 {id:'obsidian',name:'The Night',symbol:'☾',color:'teal',price:7,text:'Every black die in your scored hand adds +1 Mult.'},
 {id:'relic',name:'Old Bones',symbol:'☷',color:'violet',price:7,text:'Adds +5 Chips for every hand scored this run, including the current hand.'},
 {id:'finger',name:'The Sixth Finger',symbol:'✋',color:'teal',price:9,text:'Adds one extra die to your tray while equipped. Takes a God slot.'},
 {id:'bounty',name:'The Wanderer',symbol:'⌁',color:'red',price:6,text:'Earn $3 every time you score a Run.'},
 {id:'moon',name:'Blood Moon',symbol:'◉',color:'red',price:8,text:'Hands with all dice the same color score ×1.5 Mult, on top of the color bonus.'}
];
export const ACTIONS=[
 {id:'six',name:'Six Appeal',symbol:'⚅',color:'violet',price:3,text:'One use: set one selected die to 6 for this roll.'},
 {id:'reroll',name:'Second Wind',symbol:'↻',color:'teal',price:3,text:'One use: reroll all unheld dice without spending a reroll.'},
 {id:'dye',name:'Blood & Ink',symbol:'◐',color:'red',price:3,text:'Permanently switch one selected die’s original color.'},
 {id:'gild',name:'Gold Leaf',symbol:'✦',color:'gold',price:4,text:'Permanently add +6 Chips to one selected die whenever it scores.'},
 {id:'load',name:'Loaded',symbol:'＋',color:'gold',price:5,text:'Permanently add +1 to one selected die’s future rolls, capped at 6. Maximum +2 per die.'}
];
const copy=s=>structuredClone(s);
const pick=(a,r)=>a[Math.min(a.length-1,Math.floor(r()*a.length))];
const has=(s,id)=>s.gods.includes(id);
export const ANTE_BASES=[100,250,650,1600,4000,10000,25000,60000];
export const BOSSES=[{round:8,id:'pale',name:'The Pale House',text:'The matching-color +2 Mult bonus is disabled this round.',symbol:'◈'},{round:17,id:'lock',name:'The Iron Hand',text:'Normal rerolls are locked this round. Second Wind still works.',symbol:'⚿'}];
export function bossFor(round,mode='hard'){return mode==='casual'?null:BOSSES.find(b=>b.round===round)||null;}
export function targetFor(round,mode='hard'){if(mode==='casual')return 100+100*round;const ante=Math.floor(round/3)+1,postBossScale=2**Math.floor((ante-1)/3);return Math.round(ANTE_BASES[Math.min(7,Math.floor(round/3))]*(bossFor(round,mode)?1.8:[1,1.3,1.65][round%3])*postBossScale);}
export function stakesFor(round,mode='hard'){const ante=Math.floor(round/3)+1,stage=round%3,boss=bossFor(round,mode),target=targetFor(round,mode),previous=round>0?targetFor(round-1,mode):null;return {ante,stage,boss,target,previous,mode,increase:previous?Math.round((target/previous-1)*100):0,scale:mode==='casual'?1:2**Math.floor((ante-1)/3),label:boss?'BOSS':round===23?'FINAL WAGER':mode==='casual'?'CASUAL':['OPENING','HIGH STAKES','HOUSE WAGER'][stage],next:round<23?targetFor(round+1,mode):null};}
const pairUnits=kind=>kind==='twopair'?2:kind==='pair'?1:0;

export function effectiveColor(s,die){return has(s,'scarlet')?'red':die.color;}
export function rollValue(die,r=Math.random){return Math.min(6,1+Math.floor(r()*6)+die.load);}
function makeDie(s,r,source='base'){const d={id:s.nextId++,color:s.dice.length%2===0?'red':'black',value:1,bonus:0,load:0,source};d.value=rollValue(d,r);return d;}
export function newRun(r=Math.random,mode='hard'){if(!['casual','hard'].includes(mode))throw new Error('Choose Casual or Hard.');const s={version:VERSION,mode,phase:'play',round:0,score:0,money:8,hands:3,rerolls:3,maxHands:3,maxRerolls:3,dice:[],nextId:1,gods:[],actions:[],levels:{pair:1,twopair:1,triplet:1,run:1},pairGrowth:0,totalScored:0,scoredThisRound:0,vouchers:{dice:0,hands:0,rerolls:0,slots:0},offers:[],shopRerolls:0,receipt:null,lastScore:null};for(let i=0;i<4;i++)s.dice.push(makeDie(s,r));return s;}
export function classify(dice){
 if(dice.length===2&&dice[0].value===dice[1].value)return 'pair';
 if(dice.length===4){const counts=new Map();for(const d of dice)counts.set(d.value,(counts.get(d.value)||0)+1);if(counts.size===2&&[...counts.values()].every(n=>n===2))return 'twopair';}
 if(dice.length===3&&dice.every(d=>d.value===dice[0].value))return 'triplet';
 if(dice.length>=3){const v=dice.map(d=>d.value).sort((a,b)=>a-b);if(v.every((n,i)=>i===0||n===v[i-1]+1))return 'run';}
 return null;
}
export function preview(s,ids){
 if(!Array.isArray(ids)||new Set(ids).size!==ids.length)return null;
 const dice=ids.map(id=>s.dice.find(d=>d.id===id));if(dice.some(d=>!d))return null;
 const kind=classify(dice);if(!kind)return null;
 const level=s.levels[kind],sameColor=dice.every(d=>effectiveColor(s,d)===effectiveColor(s,dice[0]));
 let chips=HANDS[kind].chips+(level-1)*12+(kind==='run'?Math.max(0,dice.length-3)*12:0)+dice.reduce((n,d)=>n+d.value+d.bonus,0);
 let mult=HANDS[kind].mult+(level-1)+(kind==='run'?Math.max(0,dice.length-3):0);
 const effects=[`${HANDS[kind].name} Lv.${level}`,`+${dice.reduce((n,d)=>n+d.value+d.bonus,0)} dice Chips`];
 if(sameColor&&bossFor(s.round,s.mode)?.id!=='pale'){mult+=2;effects.push('Same color: +2 Mult');}
 if(sameColor&&bossFor(s.round,s.mode)?.id==='pale')effects.push('The Pale House: color +2 Mult blocked');
 if(has(s,'echo')){mult+=s.pairGrowth+pairUnits(kind);effects.push(`The Echo: +${s.pairGrowth+pairUnits(kind)} Mult`);}
 if(has(s,'ladder')&&kind==='run'){mult+=dice.length*2;effects.push(`Wayfarer: +${dice.length*2} Mult`);}
 if(has(s,'ember')){const n=dice.filter(d=>effectiveColor(s,d)==='red').length*8;chips+=n;if(n)effects.push(`Ember: +${n} Chips`);}
 if(has(s,'obsidian')){const n=dice.filter(d=>effectiveColor(s,d)==='black').length;mult+=n;if(n)effects.push(`Night: +${n} Mult`);}
 if(has(s,'relic')){chips+=(s.totalScored+1)*5;effects.push(`Old Bones: +${(s.totalScored+1)*5} Chips`);}
 for(const [id,when,factor] of [['twins',pairUnits(kind)>0,2],['trinity',kind==='triplet',3],['fortune',s.scoredThisRound===0,2],['moon',sameColor,1.5]])if(has(s,id)&&when){mult*=factor;effects.push(`${GODS.find(g=>g.id===id).name}: ×${factor} Mult`);}
 return {kind,name:HANDS[kind].name,chips,mult,points:Math.floor(chips*mult),sameColor,effects,money:(has(s,'midas')&&sameColor?2:0)+(has(s,'bounty')&&kind==='run'?3:0)};
}
export function bestHand(s){let best=null;for(let mask=1;mask<(1<<s.dice.length);mask++){const ids=s.dice.filter((_,i)=>mask&(1<<i)).map(d=>d.id);const value=preview(s,ids);if(value&&(!best||value.points>best.value.points))best={ids,value};}return best;}
function requirePlay(s){if(s.phase!=='play')throw new Error('Finish the current screen first.');}
export function reroll(s,held=[],r=Math.random,free=false){requirePlay(s);if(!free&&bossFor(s.round,s.mode)?.id==='lock')throw new Error('The Iron Hand locks normal rerolls. Use Second Wind or score a hand.');if(!free&&s.rerolls<=0)throw new Error('No rerolls left.');if(held.some(id=>!s.dice.some(d=>d.id===id)))throw new Error('Unknown held die.');if(s.dice.every(d=>held.includes(d.id)))throw new Error('Release at least one die to reroll.');const n=copy(s);if(!free)n.rerolls--;for(const d of n.dice)if(!held.includes(d.id))d.value=rollValue(d,r);return n;}
function offer(s,type,key,price){return {id:`${s.round}-${s.shopRerolls}-${type}-${key}`,type,key,price,bought:false};}
export function shopOffers(s,r=Math.random){const list=[];const available=GODS.filter(g=>!s.gods.includes(g.id));for(let i=0;i<2&&available.length;i++){const g=pick(available,r);available.splice(available.indexOf(g),1);list.push(offer(s,'god',g.id,g.price));}for(const key of Object.keys(HANDS))list.push(offer(s,'upgrade',key,4+Math.floor((s.levels[key]-1)/2)));const actions=[...ACTIONS];for(let i=0;i<2;i++){const a=pick(actions,r);actions.splice(actions.indexOf(a),1);list.push(offer(s,'action',a.id,a.price));}const vouchers=[];if(s.vouchers.dice<3)vouchers.push('dice');if(s.vouchers.hands<2)vouchers.push('hands');if(s.vouchers.rerolls<2)vouchers.push('rerolls');if(s.vouchers.slots<1)vouchers.push('slots');if(vouchers.length){const v=pick(vouchers,r);list.push(offer(s,'voucher',v,v==='dice'?10+s.vouchers.dice*4:v==='slots'?14:11));}return list;}
export function scoreHand(s,ids,r=Math.random){requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const result=preview(s,ids);if(!result)throw new Error('Select a Pair, Two Pair, a Triplet, or a Run of 3–6 dice.');const n=copy(s);n.score+=result.points;n.money+=result.money;n.hands--;n.scoredThisRound++;n.totalScored++;if(has(n,'echo'))n.pairGrowth+=pairUnits(result.kind);n.lastScore=result;
 if(n.score>=targetFor(n.round,n.mode)){
 const interest=Math.min(5,Math.floor(n.money/5)),base=6+n.round%3,unused=n.hands*2;
 n.receipt={base,interest,unused,earned:base+interest+unused};n.money+=n.receipt.earned;
 if(n.round===23)n.phase='won';else{n.phase='shop';n.shopRerolls=0;n.offers=shopOffers(n,r);}
 }else if(n.hands===0)n.phase='lost';
 else for(const d of n.dice)d.value=rollValue(d,r);
 return n;
}
export function advanceRound(s,r=Math.random){if(s.phase!=='shop')throw new Error('Visit the shop between rounds.');const n=copy(s);n.round++;n.phase='play';n.score=0;n.hands=n.maxHands;n.rerolls=n.maxRerolls;n.scoredThisRound=0;n.lastScore=null;n.receipt=null;n.offers=[];for(const d of n.dice)d.value=rollValue(d,r);return n;}
export function buy(s,id,r=Math.random){if(s.phase!=='shop')throw new Error('The shop opens between rounds.');const n=copy(s),item=n.offers.find(o=>o.id===id);if(!item||item.bought)throw new Error('That item is no longer available.');if(n.money<item.price)throw new Error('Not enough money.');
 if(item.type==='god'){if(n.gods.length>=4+n.vouchers.slots)throw new Error('Your Dice God slots are full. Sell one first.');if(n.gods.includes(item.key))throw new Error('You already have that God.');if(item.key==='finger'&&n.dice.length>=8)throw new Error('The tray is full.');n.gods.push(item.key);if(item.key==='finger')n.dice.push(makeDie(n,r,'finger'));}
 else if(item.type==='upgrade')n.levels[item.key]++;
 else if(item.type==='action'){if(n.actions.length>=3)throw new Error('Action slots are full. Use or discard a card first.');n.actions.push({id:n.nextId++,key:item.key});}
 else if(item.type==='voucher'){
 const key=item.key,limits={dice:3,hands:2,rerolls:2,slots:1};if(n.vouchers[key]>=limits[key])throw new Error('That voucher is maxed out.');n.vouchers[key]++;
 if(key==='dice')n.dice.push(makeDie(n,r,'voucher'));
 if(key==='hands')n.maxHands++;
 if(key==='rerolls')n.maxRerolls++;
 }
 n.money-=item.price;item.bought=true;return n;
}
export function refreshShop(s,r=Math.random){if(s.phase!=='shop')throw new Error('Not in the shop.');const cost=2+s.shopRerolls;if(s.money<cost)throw new Error('Not enough money.');const n=copy(s);n.money-=cost;n.shopRerolls++;n.offers=shopOffers(n,r);return n;}
export function sellGod(s,id){if(s.phase!=='shop'||!s.gods.includes(id))throw new Error('Sell equipped Gods in the shop.');const n=copy(s);n.gods=n.gods.filter(g=>g!==id);n.money+=Math.floor(GODS.find(g=>g.id===id).price/2);if(id==='finger')n.dice=n.dice.filter(d=>d.source!=='finger');return n;}
export function discardAction(s,id){if(!['shop','play'].includes(s.phase))throw new Error('This run is over.');const n=copy(s);if(!n.actions.some(a=>a.id===id))throw new Error('Unknown action.');n.actions=n.actions.filter(a=>a.id!==id);return n;}
export function useAction(s,id,selected=[],held=[],r=Math.random){requirePlay(s);const card=s.actions.find(a=>a.id===id);if(!card)throw new Error('That action is unavailable.');if(card.key!=='reroll'&&(selected.length!==1||!s.dice.some(d=>d.id===selected[0])))throw new Error('Select exactly one die for this card.');let n=copy(s),d=n.dice.find(d=>d.id===selected[0]);if(card.key==='reroll')n=reroll(n,held,r,true);if(card.key==='six')d.value=6;if(card.key==='dye')d.color=d.color==='red'?'black':'red';if(card.key==='gild')d.bonus+=6;if(card.key==='load'){if(d.load>=2)throw new Error('That die is already fully loaded.');d.load++;d.value=Math.min(6,d.value+1);}n.actions=n.actions.filter(a=>a.id!==id);return n;}
export function validSave(s){
 if(!s||s.version!==VERSION||!['casual','hard'].includes(s.mode)||!['play','shop','lost','won'].includes(s.phase))return false;
 if(!Number.isInteger(s.round)||s.round<0||s.round>23||!Number.isFinite(s.money)||s.money<0||!Number.isFinite(s.score)||s.score<0)return false;
 if(!s.vouchers||!Object.entries({dice:3,hands:2,rerolls:2,slots:1}).every(([k,max])=>Number.isInteger(s.vouchers[k])&&s.vouchers[k]>=0&&s.vouchers[k]<=max))return false;
 if(!Array.isArray(s.gods)||s.gods.length>4+s.vouchers.slots||new Set(s.gods).size!==s.gods.length||s.gods.some(id=>!GODS.some(g=>g.id===id)))return false;
 if(!Array.isArray(s.dice)||s.dice.length!==4+s.vouchers.dice+(has(s,'finger')?1:0)||s.dice.length>8||new Set(s.dice.map(d=>d.id)).size!==s.dice.length)return false;
 if(!s.dice.every(d=>Number.isInteger(d.id)&&d.id>0&&['red','black'].includes(d.color)&&Number.isInteger(d.value)&&d.value>=1&&d.value<=6&&Number.isInteger(d.load)&&d.load>=0&&d.load<=2&&Number.isInteger(d.bonus)&&d.bonus>=0&&['base','voucher','finger'].includes(d.source)))return false;
 if(s.maxHands!==3+s.vouchers.hands||s.maxRerolls!==3+s.vouchers.rerolls||!Number.isInteger(s.hands)||s.hands<0||s.hands>s.maxHands||!Number.isInteger(s.rerolls)||s.rerolls<0||s.rerolls>s.maxRerolls)return false;
 if(!s.levels||!Object.keys(HANDS).every(k=>Number.isInteger(s.levels[k])&&s.levels[k]>=1))return false;
 if(!['pairGrowth','totalScored','scoredThisRound','shopRerolls'].every(k=>Number.isInteger(s[k])&&s[k]>=0))return false;
 if(!Number.isInteger(s.nextId)||s.nextId<=Math.max(...s.dice.map(d=>d.id)))return false;
 if(!Array.isArray(s.actions)||s.actions.length>3||!s.actions.every(a=>Number.isInteger(a.id)&&a.id<s.nextId&&ACTIONS.some(c=>c.id===a.key)))return false;
 if(!Array.isArray(s.offers)||!s.offers.every(o=>typeof o.id==='string'&&Number.isFinite(o.price)&&o.price>=0&&typeof o.bought==='boolean'&&(['god','upgrade','action','voucher'].includes(o.type))&&(o.type==='god'?GODS.some(g=>g.id===o.key):o.type==='action'?ACTIONS.some(a=>a.id===o.key):o.type==='upgrade'?Object.hasOwn(HANDS,o.key):['dice','hands','rerolls','slots'].includes(o.key))))return false;
 return true;
}

export function burnHand(s,r=Math.random){requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const n=copy(s);n.hands--;n.lastScore=null;if(n.hands===0)n.phase='lost';else for(const d of n.dice)d.value=rollValue(d,r);return n;}

export function migrateSave(raw){if(!raw)return null;const s=copy(raw);if(s.version===1||s.version===2){s.version=VERSION;s.mode='hard';if(s.levels&&!Object.hasOwn(s.levels,'twopair'))s.levels.twopair=1;if(s.phase==='shop'&&Array.isArray(s.offers)&&!s.offers.some(o=>o.type==='upgrade'&&o.key==='twopair'))s.offers.push(offer(s,'upgrade','twopair',4));}return validSave(s)?s:null;}
