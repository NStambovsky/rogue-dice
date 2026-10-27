import {GODS,ACTIONS,VOUCHERS,weightedPick} from './catalog.js?v=4';
export {GODS,ACTIONS,VOUCHERS} from './catalog.js?v=4';
export const VERSION=4;
export const COLORS=['red','black','blue','gold'];
export const HANDS={
 high:{name:'Highest Die',chips:0,mult:1,minDice:1,chipStep:2,multStep:.25},
 pair:{name:'Pair',chips:12,mult:2,minDice:2},twopair:{name:'Two Pair',chips:24,mult:3,minDice:4},triplet:{name:'Triplet',chips:24,mult:3,minDice:3},
 quad:{name:'Quads',chips:48,mult:5,minDice:4},quint:{name:'Quints',chips:80,mult:8,minDice:5},sextet:{name:'Six of a Kind',chips:120,mult:12,minDice:6},septet:{name:'Seven of a Kind',chips:170,mult:17,minDice:7},octet:{name:'Eight of a Kind',chips:230,mult:23,minDice:8},
 run:{name:'Run',chips:18,mult:3,minDice:3},pact:{name:'Color Pact',chips:16,mult:2,minDice:3}
};
const copy=s=>structuredClone(s);
const has=(s,id)=>s.gods.includes(id);
const voucherDefaults=()=>Object.fromEntries(VOUCHERS.map(v=>[v.id,0]));
const emptyHistory=()=>({gods:[],studies:[],actions:[],vouchers:[]});
const emptyEffects=()=>({hands:0,rerolls:0,nextChips:0,nextMult:0});
export const actionSlots=s=>3+s.vouchers.actions;
export const godSellPrice=(s,id)=>Math.floor(GODS.find(g=>g.id===id).price*(s.vouchers.salvage ? 0.65 : 0.5));
export const ANTE_BASES=[100,250,650,1600,4000,10000,25000,60000];
export const BOSSES=[{round:8,id:'pale',name:'The Pale House',text:'The matching-color +2 Mult bonus is disabled this round.',symbol:'◈'},{round:17,id:'lock',name:'The Iron Hand',text:'Normal rerolls are locked this round. Second Wind still works.',symbol:'⚿'}];
export function bossFor(round,mode='hard'){return mode==='casual'?null:BOSSES.find(b=>b.round===round)||null;}
export function targetFor(round,mode='hard'){if(mode==='casual')return 100+100*round;const ante=Math.floor(round/3)+1,postBossScale=2**Math.floor((ante-1)/3);return Math.round(ANTE_BASES[Math.min(7,Math.floor(round/3))]*(bossFor(round,mode)?1.8:[1,1.3,1.65][round%3])*postBossScale);}
export function stakesFor(round,mode='hard'){const ante=Math.floor(round/3)+1,stage=round%3,boss=bossFor(round,mode),target=targetFor(round,mode),previous=round>0?targetFor(round-1,mode):null;return {ante,stage,boss,target,previous,mode,increase:previous?Math.round((target/previous-1)*100):0,scale:mode==='casual'?1:2**Math.floor((ante-1)/3),label:boss?'BOSS':round===23?'FINAL WAGER':mode==='casual'?'CASUAL':['OPENING','HIGH STAKES','HOUSE WAGER'][stage],next:round<23?targetFor(round+1,mode):null};}
const pairUnits=kind=>kind==='twopair'?2:kind==='pair'?1:0;


export function effectiveColor(s,d){return has(s,'inkking')?'black':has(s,'scarlet')?'red':d.color;}
export function rollValue(d,r=Math.random){return Math.min(6,1+Math.floor(r()*6)+d.load);}
function makeDie(s,r,source='base',color=COLORS[Math.floor(r()*COLORS.length)]){const d={id:s.nextId++,color,value:1,bonus:0,load:0,source};d.value=rollValue(d,r);return d;}
export function newRun(r=Math.random,mode='hard'){
 if(!['casual','hard'].includes(mode))throw new Error('Choose Casual or Hard.');
 const s={version:VERSION,mode,baseDice:3,maxHandSize:4,shopHistory:emptyHistory(),phase:'play',round:0,score:0,money:8,hands:3,rerolls:3,maxHands:3,maxRerolls:3,dice:[],nextId:1,gods:[],actions:[],levels:Object.fromEntries(Object.keys(HANDS).map(k=>[k,1])),pairGrowth:0,totalScored:0,scoredThisRound:0,rerollsThisRound:0,roundEffects:emptyEffects(),vouchers:voucherDefaults(),offers:[],shopRerolls:0,receipt:null,lastScore:null};
 const palette=[...COLORS];for(let i=0;i<s.baseDice;i++){const color=palette.splice(Math.floor(r()*palette.length),1)[0];s.dice.push(makeDie(s,r,'base',color));}return s;
}
function numericKind(dice){
 if(dice.length>=2&&dice.length<=8&&dice.every(d=>d.value===dice[0].value))return ({2:'pair',3:'triplet',4:'quad',5:'quint',6:'sextet',7:'septet',8:'octet'})[dice.length];
 if(dice.length===4){const c=new Map();for(const d of dice)c.set(d.value,(c.get(d.value)||0)+1);if(c.size===2&&[...c.values()].every(n=>n===2))return 'twopair';}
 if(dice.length>=3&&dice.length<=6){const v=dice.map(d=>d.value).sort((a,b)=>a-b);if(v.every((n,i)=>i===0||n===v[i-1]+1))return 'run';}return null;
}
export function classifyAll(dice,colorFor=d=>d.color){const kinds=[],numeric=numericKind(dice);if(numeric)kinds.push(numeric);if(dice.length>=3&&COLORS.includes(colorFor(dice[0]))&&dice.every(d=>colorFor(d)===colorFor(dice[0])))kinds.push('pact');return kinds;}
export function classify(dice){return classifyAll(dice)[0]||null;}
export function preview(s,ids,allowFallback=true){
 if(!Array.isArray(ids)||ids.length>s.maxHandSize||new Set(ids).size!==ids.length)return null;
 const dice=ids.map(id=>s.dice.find(d=>d.id===id));if(dice.some(d=>!d))return null;
 const kinds=classifyAll(dice,d=>effectiveColor(s,d));if(!kinds.length){if(!allowFallback||normalHandExists(s))return null;const highest=[...s.dice].sort((a,b)=>b.value-a.value||b.bonus-a.bonus)[0];return calculateHand(s,[highest],'high');}let best=null;for(const kind of kinds){const result=calculateHand(s,dice,kind);if(!best||result.points>best.points)best=result;}return best;
}
function calculateHand(s,dice,kind){
 const level=s.levels[kind],sameColor=dice.length>=2&&dice.every(d=>effectiveColor(s,d)===effectiveColor(s,dice[0]));
 let chips=HANDS[kind].chips+(level-1)*(HANDS[kind].chipStep||12)+(kind==='run'?Math.max(0,dice.length-3)*12:0);
 let mult=HANDS[kind].mult+(level-1)*(HANDS[kind].multStep||1)+(kind==='run'?Math.max(0,dice.length-3):0),money=0;
 const steps=[],effects=[];
 function step(label,source='hand',id=null){steps.push({label,source,id,chips,mult,money,points:Math.floor(chips*mult)});effects.push(label);}
 function addGod(id,c=0,m=0){if(c||m){chips+=c;mult+=m;step(`${GODS.find(g=>g.id===id).name}: ${[c?'+'+c+' Chips':null,m?'+'+m+' Mult':null].filter(Boolean).join(', ')}`,'god',id);}}
 step(`${HANDS[kind].name} Lv.${level}: base ${chips} Chips × ${mult} Mult`);
 for(const die of dice){const amount=die.value+die.bonus;chips+=amount;step(`Die ${die.value}${die.bonus?' + '+die.bonus+' bonus':''}: +${amount} Chips`,'die',die.id);}
 if(has(s,'scarlet'))step('The Red Queen: scoring dice count as red','god','scarlet');if(has(s,'inkking'))step('The Ink King: scoring dice count as black','god','inkking');
 if(sameColor){if(bossFor(s.round,s.mode)?.id==='pale')step('The Pale House: color +2 Mult blocked','boss');else{mult+=2;step('Same color: +2 Mult','color');}}
 if(s.roundEffects.nextChips){chips+=s.roundEffects.nextChips;step(`Overcharge: +${s.roundEffects.nextChips} Chips`,'action','surge');}
 if(s.roundEffects.nextMult){mult+=s.roundEffects.nextMult;step(`Fortune’s Favor: +${s.roundEffects.nextMult} Mult`,'action','blessing');}
 const count=fn=>dice.filter(fn).length;
 if(has(s,'echo'))addGod('echo',0,s.pairGrowth+pairUnits(kind));
 if(has(s,'ladder')&&kind==='run')addGod('ladder',0,dice.length*2);
 if(has(s,'ember'))addGod('ember',count(d=>effectiveColor(s,d)==='red')*8);
 if(has(s,'obsidian'))addGod('obsidian',0,count(d=>effectiveColor(s,d)==='black'));
 if(has(s,'tide'))addGod('tide',count(d=>effectiveColor(s,d)==='blue')*8);
 if(has(s,'crown'))addGod('crown',0,count(d=>effectiveColor(s,d)==='gold'));
 if(has(s,'relic'))addGod('relic',(s.totalScored+1)*5);
 if(has(s,'smallfortune'))addGod('smallfortune',0,count(d=>d.value<=2)*2);
 if(has(s,'giant'))addGod('giant',count(d=>d.value===6)*18);
 if(has(s,'odd')){const n=count(d=>d.value%2===1);addGod('odd',n*5,n);}
 if(has(s,'even')){const n=count(d=>d.value%2===0);addGod('even',n*5,n);}
 if(has(s,'balance')&&!sameColor)addGod('balance',0,4);
 if(has(s,'banker'))addGod('banker',0,Math.min(8,Math.floor(s.money/5)));
 if(has(s,'prism')&&sameColor)addGod('prism',dice.length*10);
 if(has(s,'undertow'))addGod('undertow',0,s.rerollsThisRound*2);
 for(const [id,when,factor] of [
  ['twins',pairUnits(kind)>0,2],['trinity',kind==='triplet',3],['fortune',s.scoredThisRound===0,2],['moon',sameColor,1.5],
  ['mirror',pairUnits(kind)>0&&sameColor,1.5],['cartographer',kind==='run'&&dice.length>=4,2],['sentinel',s.hands===1,2],['pauper',s.money<=5,2],['hermit',s.dice.length===3,1.75],['chorus',dice.length===s.dice.length,1.5]
 ])if(has(s,id)&&when){mult*=factor;step(`${GODS.find(g=>g.id===id).name}: ×${factor} Mult`,'god',id);}
 for(const [id,when,amount]of[['midas',sameColor,2],['bounty',kind==='run',3],['rainmaker',kind==='triplet',4]])if(has(s,id)&&when){money+=amount;step(`${GODS.find(g=>g.id===id).name}: +$${amount}`,'god',id);}
 step('Final score','total');
 return {kind,scoringIds:dice.map(d=>d.id),name:HANDS[kind].name,chips,mult,points:Math.floor(chips*mult),sameColor,effects,steps,money};
}
function normalHandExists(s){for(let mask=1;mask<(1<<s.dice.length);mask++){const dice=s.dice.filter((_,i)=>mask&(1<<i));if(dice.length>=2&&dice.length<=s.maxHandSize&&classifyAll(dice,d=>effectiveColor(s,d)).length)return true;}return false;}
export function bestHand(s){let best=null;for(let mask=1;mask<(1<<s.dice.length);mask++){const ids=s.dice.filter((_,i)=>mask&(1<<i)).map(d=>d.id),value=preview(s,ids,false);if(value&&(!best||value.points>best.value.points))best={ids:value.scoringIds,value};}if(!best){const value=preview(s,[]);if(value)best={ids:value.scoringIds,value};}return best;}
function requirePlay(s){if(s.phase!=='play')throw new Error('Finish the current screen first.');}
export function reroll(s,held=[],r=Math.random,free=false){
 requirePlay(s);if(!free&&bossFor(s.round,s.mode)?.id==='lock')throw new Error('The Iron Hand locks normal rerolls. Use Second Wind or score a hand.');
 if(!free&&s.rerolls<=0)throw new Error('No rerolls left.');if(held.some(id=>!s.dice.some(d=>d.id===id)))throw new Error('Unknown held die.');if(s.dice.every(d=>held.includes(d.id)))throw new Error('Release at least one die to reroll.');
 const n=copy(s);if(!free)n.rerolls--;n.rerollsThisRound++;for(const d of n.dice)if(!held.includes(d.id))d.value=rollValue(d,r);return n;
}
function itemPrice(s,type,price){return Math.max(1,price-s.vouchers.discount-(type==='upgrade'?s.vouchers.study:0));}
function offer(s,type,key,price){return {id:`${s.round}-${s.shopRerolls}-${type}-${key}`,type,key,price:itemPrice(s,type,price),bought:false};}
function fresh(items,recent,count=1){const filtered=items.filter(item=>!recent.includes(item.id));return filtered.length>=count?filtered:items;}
function recordOffers(s,offers){const groups={god:'gods',upgrade:'studies',action:'actions',voucher:'vouchers'};for(const [type,key]of Object.entries(groups)){s.shopHistory[key]=[...s.shopHistory[key],...offers.filter(o=>o.type===type).map(o=>o.key)].slice(-(type==='god'?4:2));}}
export function shopOffers(s,r=Math.random){
 const list=[],history=s.shopHistory||emptyHistory();
 const allGods=GODS.filter(g=>!has(s,g.id)&&!(g.id==='finger'&&(s.round<3||s.dice.length>=8))&&!(g.id==='scarlet'&&has(s,'inkking'))&&!(g.id==='inkking'&&has(s,'scarlet')));
 const available=fresh(allGods,history.gods,2+s.vouchers.foresight);
 for(let i=0;i<2+s.vouchers.foresight&&available.length;i++){const g=weightedPick(available,r);available.splice(available.indexOf(g),1);list.push(offer(s,'god',g.id,g.price));}
 const studies=Object.entries(HANDS).filter(([,h])=>h.minDice<=Math.min(s.dice.length,s.maxHandSize)).map(([id])=>({id}));
 if(studies.length){const study=weightedPick(fresh(studies,history.studies),r);list.push(offer(s,'upgrade',study.id,4+Math.floor((s.levels[study.id]-1)/2)));}
 const action=weightedPick(fresh([...ACTIONS],history.actions),r);list.push(offer(s,'action',action.id,action.price));
 const vouchers=VOUCHERS.filter(v=>s.vouchers[v.id]<v.max&&!(v.id==='dice'&&(s.round<3||s.dice.length>=8)));
 if(vouchers.length){const v=weightedPick(fresh(vouchers,history.vouchers),r);list.push(offer(s,'voucher',v.id,v.price+(v.id==='dice'?s.vouchers.dice*8:0)));}return list;
}
export function scoreHand(s,ids,r=Math.random){
 requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const result=preview(s,ids);if(!result)throw new Error('Select a matching group, Two Pair, a Run, or 3+ same-color dice for a Color Pact.');
 const n=copy(s);n.score+=result.points;n.money+=result.money;n.hands--;n.scoredThisRound++;n.totalScored++;if(has(n,'echo'))n.pairGrowth+=pairUnits(result.kind);n.lastScore=result;n.roundEffects.nextChips=0;n.roundEffects.nextMult=0;
 if(n.score>=targetFor(n.round,n.mode)){
  const interest=Math.min(5+n.vouchers.interest*2,Math.floor(n.money/5)),base=6+n.round%3+n.vouchers.rewards*2,unused=n.hands*2;
  n.receipt={base,interest,unused,earned:base+interest+unused};n.money+=n.receipt.earned;
  if(n.round===23)n.phase='won';else{n.phase='shop';n.shopRerolls=0;n.offers=shopOffers(n,r);recordOffers(n,n.offers);}
 }else if(n.hands===0)n.phase='lost';else for(const d of n.dice)d.value=rollValue(d,r);return n;
}
export function advanceRound(s,r=Math.random){
 if(s.phase!=='shop')throw new Error('Visit the shop between rounds.');const n=copy(s);n.round++;n.phase='play';n.score=0;n.hands=n.maxHands;n.rerolls=n.maxRerolls;n.rerollsThisRound=0;n.scoredThisRound=0;n.roundEffects=emptyEffects();n.lastScore=null;n.receipt=null;n.offers=[];
 if(n.round%3===0&&n.vouchers.polish)for(const d of n.dice)d.bonus+=n.vouchers.polish;
 for(const d of n.dice)d.value=rollValue(d,r);return n;
}
export function buy(s,id,r=Math.random){
 if(s.phase!=='shop')throw new Error('The shop opens between rounds.');const n=copy(s),item=n.offers.find(o=>o.id===id);if(!item||item.bought)throw new Error('That item is no longer available.');if(n.money<item.price)throw new Error('Not enough money.');
 if(item.type==='god'){
  if(n.gods.length>=4+n.vouchers.slots)throw new Error('Your Dice God slots are full. Sell one first.');if(has(n,item.key))throw new Error('You already have that God.');
  if((item.key==='scarlet'&&has(n,'inkking'))||(item.key==='inkking'&&has(n,'scarlet')))throw new Error('Sell the other color-changing God first.');
  if(item.key==='finger'&&n.dice.length>=8)throw new Error('The tray is full.');
  n.gods.push(item.key);if(item.key==='finger')n.dice.push(makeDie(n,r,'finger'));if(item.key==='echo')n.pairGrowth=0;
 }else if(item.type==='upgrade')n.levels[item.key]++;
 else if(item.type==='action'){if(n.actions.length>=actionSlots(n))throw new Error('Action slots are full. Use or discard a card first.');n.actions.push({id:n.nextId++,key:item.key});}
 else if(item.type==='voucher'){
  const v=VOUCHERS.find(v=>v.id===item.key);if(!v)throw new Error('Unknown voucher.');if(n.vouchers[v.id]>=v.max)throw new Error('That voucher is maxed out.');if(v.id==='dice'&&n.dice.length>=8)throw new Error('The tray is full.');
  n.vouchers[v.id]++;if(v.id==='dice')n.dice.push(makeDie(n,r,'voucher'));if(v.id==='hands')n.maxHands++;if(v.id==='rerolls')n.maxRerolls++;
 }
 if(item.type==='voucher'&&['discount','study'].includes(item.key))for(const other of n.offers)if(other.id!==item.id&&!other.bought&&(item.key==='discount'||other.type==='upgrade'))other.price=Math.max(1,other.price-1);
 n.money-=item.price;item.bought=true;return n;
}
export function refreshShop(s,r=Math.random){if(s.phase!=='shop')throw new Error('Not in the shop.');const cost=2+s.shopRerolls;if(s.money<cost)throw new Error('Not enough money.');const n=copy(s);n.money-=cost;n.shopRerolls++;n.offers=shopOffers(n,r);recordOffers(n,n.offers);return n;}
export function sellGod(s,id){if(s.phase!=='shop'||!has(s,id))throw new Error('Sell equipped Gods in the shop.');const n=copy(s);n.gods=n.gods.filter(g=>g!==id);n.money+=godSellPrice(s,id);if(id==='finger')n.dice=n.dice.filter(d=>d.source!=='finger');if(id==='echo')n.pairGrowth=0;return n;}
export function discardAction(s,id){if(!['shop','play'].includes(s.phase))throw new Error('This run is over.');const n=copy(s);if(!n.actions.some(a=>a.id===id))throw new Error('Unknown action.');n.actions=n.actions.filter(a=>a.id!==id);return n;}
export function useAction(s,id,selected=[],held=[],r=Math.random){
 requirePlay(s);const card=s.actions.find(a=>a.id===id);if(!card)throw new Error('That action is unavailable.');
 const untargeted=['reroll','rally','hand','surge','blessing'],required=card.key==='copy'?2:untargeted.includes(card.key)?0:1;
 if(required&&(selected.length!==required||new Set(selected).size!==required||selected.some(id=>!s.dice.some(d=>d.id===id))))throw new Error(required===2?'Select exactly two dice: source first, destination second.':'Select exactly one die for this card.');
 let n=copy(s),d=n.dice.find(d=>d.id===selected[0]);
 if(card.key==='reroll')n=reroll(n,held,r,true);
 if(card.key==='six')d.value=6;if(card.key==='one')d.value=1;if(card.key==='nudge')d.value=Math.min(6,d.value+1);if(card.key==='invert')d.value=7-d.value;
 if(card.key==='copy')n.dice.find(d=>d.id===selected[1]).value=d.value;
 if(card.key==='dye')d.color=COLORS[(COLORS.indexOf(d.color)+1)%COLORS.length];if(card.key==='red')d.color='red';if(card.key==='black')d.color='black';if(card.key==='gild')d.bonus+=6;
 if(card.key==='load'){if(d.load>=2)throw new Error('That die is already fully loaded.');d.load++;d.value=Math.min(6,d.value+1);}
 if(card.key==='rally'){if(bossFor(n.round,n.mode)?.id==='lock')throw new Error('The boss locks normal rerolls. Save Extra Breath for another round.');n.rerolls++;n.roundEffects.rerolls++;}
 if(card.key==='hand'){n.hands++;n.roundEffects.hands++;}
 if(card.key==='surge')n.roundEffects.nextChips+=30;if(card.key==='blessing')n.roundEffects.nextMult+=3;
 n.actions=n.actions.filter(a=>a.id!==id);return n;
}
export function burnHand(s,r=Math.random){requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const n=copy(s);n.hands--;n.lastScore=null;if(has(n,'scavenger'))n.money++;if(n.hands===0)n.phase='lost';else for(const d of n.dice)d.value=rollValue(d,r);return n;}
export function validSave(s){
 if(!s||s.version!==VERSION||!['casual','hard'].includes(s.mode)||!['play','shop','lost','won'].includes(s.phase))return false;
 if(!Number.isInteger(s.round)||s.round<0||s.round>23||!Number.isFinite(s.money)||s.money<0||!Number.isFinite(s.score)||s.score<0||![3,4].includes(s.baseDice)||s.maxHandSize!==4)return false;
 if(!s.shopHistory||!['gods','studies','actions','vouchers'].every(k=>Array.isArray(s.shopHistory[k])&&s.shopHistory[k].every(id=>typeof id==='string')))return false;
 if(!s.vouchers||!VOUCHERS.every(v=>Number.isInteger(s.vouchers[v.id])&&s.vouchers[v.id]>=0&&s.vouchers[v.id]<=v.max))return false;
 if(!Array.isArray(s.gods)||s.gods.length>4+s.vouchers.slots||new Set(s.gods).size!==s.gods.length||s.gods.some(id=>!GODS.some(g=>g.id===id))||(has(s,'scarlet')&&has(s,'inkking')))return false;
 if(!Array.isArray(s.dice)||s.dice.length!==s.baseDice+s.vouchers.dice+(has(s,'finger')?1:0)||s.dice.length>8||new Set(s.dice.map(d=>d.id)).size!==s.dice.length)return false;
 if(!s.dice.every(d=>Number.isInteger(d.id)&&d.id>0&&COLORS.includes(d.color)&&Number.isInteger(d.value)&&d.value>=1&&d.value<=6&&Number.isInteger(d.load)&&d.load>=0&&d.load<=2&&Number.isInteger(d.bonus)&&d.bonus>=0&&['base','voucher','finger'].includes(d.source)))return false;
 if(!s.roundEffects||!['hands','rerolls','nextChips','nextMult'].every(k=>Number.isInteger(s.roundEffects[k])&&s.roundEffects[k]>=0))return false;
 if(s.maxHands!==3+s.vouchers.hands||s.maxRerolls!==3+s.vouchers.rerolls||!Number.isInteger(s.hands)||s.hands<0||s.hands>s.maxHands+s.roundEffects.hands||!Number.isInteger(s.rerolls)||s.rerolls<0||s.rerolls>s.maxRerolls+s.roundEffects.rerolls)return false;
 if(!s.levels||!Object.keys(HANDS).every(k=>Number.isInteger(s.levels[k])&&s.levels[k]>=1))return false;
 if(!['pairGrowth','totalScored','scoredThisRound','rerollsThisRound','shopRerolls'].every(k=>Number.isInteger(s[k])&&s[k]>=0))return false;
 if(!Number.isInteger(s.nextId)||s.nextId<=Math.max(...s.dice.map(d=>d.id)))return false;
 if(!Array.isArray(s.actions)||s.actions.length>actionSlots(s)||new Set(s.actions.map(a=>a.id)).size!==s.actions.length||!s.actions.every(a=>Number.isInteger(a.id)&&a.id<s.nextId&&ACTIONS.some(c=>c.id===a.key)))return false;
 if(!Array.isArray(s.offers)||!s.offers.every(o=>typeof o.id==='string'&&Number.isFinite(o.price)&&o.price>=1&&typeof o.bought==='boolean'&&['god','upgrade','action','voucher'].includes(o.type)&&(o.type==='god'?GODS.some(g=>g.id===o.key):o.type==='action'?ACTIONS.some(a=>a.id===o.key):o.type==='upgrade'?Object.hasOwn(HANDS,o.key):VOUCHERS.some(v=>v.id===o.key))))return false;
 return true;
}
export function migrateSave(raw){
 if(!raw)return null;const s=copy(raw);
 if([1,2,3].includes(s.version)){
  if(s.version<=2)s.mode='hard';s.version=VERSION;s.baseDice=4;s.maxHandSize=4;s.shopHistory=emptyHistory();s.vouchers={...voucherDefaults(),...s.vouchers};s.roundEffects=emptyEffects();s.rerollsThisRound=Math.max(0,(s.maxRerolls||0)-(s.rerolls||0));
  if(s.levels)for(const key of Object.keys(HANDS))if(!Object.hasOwn(s.levels,key))s.levels[key]=1;
  if(s.phase==='shop'&&Array.isArray(s.offers)&&s.levels){s.offers=shopOffers(s,()=>.37);recordOffers(s,s.offers);}
  if(!s.gods?.includes('echo'))s.pairGrowth=0;
 }return validSave(s)?s:null;
}
