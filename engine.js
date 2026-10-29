import {BOSSES,BOSS_ROUNDS,bossFor,drawBoss} from './bosses.js?v=10';
export {BOSSES,BOSS_ROUNDS,bossFor} from './bosses.js?v=10';
import {GODS,ACTIONS,VOUCHERS,EVOLUTIONS,weightedPick} from './catalog.js?v=14';
export {GODS,ACTIONS,VOUCHERS,EVOLUTIONS} from './catalog.js?v=14';
export const VERSION=9;
export const COLORS=['red','black','blue','gold'];
export const HANDS={
 high:{name:'Highest Die',chips:0,mult:1,minDice:1,chipStep:2,multStep:.25},
 pair:{name:'Pair',chips:8,mult:2,minDice:2,chipStep:6,multStep:.5},twopair:{name:'Two Pair',chips:20,mult:3,minDice:4,chipStep:14,multStep:1},triplet:{name:'Triplet',chips:18,mult:3,minDice:3},
 quad:{name:'Quads',chips:72,mult:5,minDice:4,chipStep:20,multStep:1.5},quint:{name:'Quints',chips:80,mult:8,minDice:5},sextet:{name:'Six of a Kind',chips:120,mult:12,minDice:6},septet:{name:'Seven of a Kind',chips:170,mult:17,minDice:7},octet:{name:'Eight of a Kind',chips:230,mult:23,minDice:8},
 run:{name:'Run',chips:6,mult:3,minDice:3,chipStep:8,multStep:.5,extraChips:4,extraMult:0},pact:{name:'Color Pact',chips:8,mult:1.5,minDice:3,chipStep:6,multStep:.5}
};
const copy=s=>structuredClone(s);
const has=(s,id)=>s.gods.includes(id);
const voucherDefaults=()=>Object.fromEntries(VOUCHERS.map(v=>[v.id,0]));
const emptyHistory=()=>({gods:[],studies:[],actions:[],vouchers:[]});
const emptyEffects=()=>({hands:0,rerolls:0,nextChips:0,nextMult:0});
export const actionSlots=s=>3+s.vouchers.actions;
export const refreshCost=s=>Math.max(1,2+s.shopRerolls-(s.vouchers.bargainrefresh||0));
export const godSellPrice=(s,id)=>Math.floor(GODS.find(g=>g.id===id).price*(s.vouchers.salvage ? 0.65 : 0.5));
export const ANTE_BASES=[100,250,650,1600,4000,10000,25000,60000];
export function targetFor(round,mode='hard'){if(mode==='casual')return 100+100*round;const ante=Math.floor(round/3)+1,postBossScale=2**Math.floor((ante-1)/3);return Math.round(ANTE_BASES[Math.min(7,Math.floor(round/3))]*(bossFor(round,mode)?1.8:[1,1.3,1.65][round%3])*postBossScale);}
export function stakesFor(round,mode='hard',choices=null){const ante=Math.floor(round/3)+1,stage=round%3,boss=bossFor(round,mode,choices),target=targetFor(round,mode),previous=round>0?targetFor(round-1,mode):null;return {ante,stage,boss,target,previous,mode,increase:previous?Math.round((target/previous-1)*100):0,scale:mode==='casual'?1:2**Math.floor((ante-1)/3),label:boss?'BOSS':round===23?'FINAL WAGER':mode==='casual'?'CASUAL':['OPENING','HIGH STAKES','HOUSE WAGER'][stage],next:round<23?targetFor(round+1,mode):null};}
export function activeBoss(s){return s.phase==='play'?bossFor(s.round,s.mode,s.bossChoices):null;}
export const handLimit=s=>activeBoss(s)?.id==='three'?3:s.maxHandSize;
const scoringHas=(s,id)=>has(s,id)&&!(activeBoss(s)?.id==='silence'&&s.gods.find(g=>!['finger','scavenger'].includes(g))===id);
const pairUnits=kind=>kind==='twopair'?2:kind==='pair'?1:0;
const echoGrowth=(s,kind)=>pairUnits(kind)*(s.godStates?.echo?.path==='resonance'?1:.5);


export const COLOR_GODS=['scarlet','inkking','sapphire','aurum','divide'];
const MONO_COLORS={scarlet:'red',inkking:'black',sapphire:'blue',aurum:'gold'};
const warm=color=>({blue:'black',gold:'red'})[color]||color;
const cool=color=>({red:'gold',black:'blue'})[color]||color;
export function colorDetails(s,d){
 if(d.roundColor)return {color:d.roundColor,source:'Round Wash',temporary:true};
 const god=COLOR_GODS.find(id=>scoringHas(s,id));
 if(god)return {color:god==='divide'?warm(d.color):MONO_COLORS[god],source:GODS.find(g=>g.id===god).name,temporary:false};
 if(s.vouchers.dichrome)return {color:warm(d.color),source:'Blood & Ink License',temporary:false};
 if(s.vouchers.oceanore)return {color:cool(d.color),source:'Ocean & Ore License',temporary:false};
 return {color:d.color,source:d.colorLocked?'Locked color':'Rolled color',temporary:false};
}
export const effectiveColor=(s,d)=>colorDetails(s,d).color;
export function paletteRule(s){
 const god=COLOR_GODS.find(id=>scoringHas(s,id));
 return god?GODS.find(g=>g.id===god).name:s.vouchers.dichrome?'Blood & Ink License':s.vouchers.oceanore?'Ocean & Ore License':'Natural colors';
}
export function rollValue(d,r=Math.random){return Math.min(6,1+Math.floor(r()*6)+d.load);}
export function rollDie(d,r=Math.random){d.value=rollValue(d,r);if(!d.colorLocked)d.color=COLORS[Math.floor(r()*COLORS.length)];return d;}
function makeDie(s,r,source='base',color=COLORS[Math.floor(r()*COLORS.length)]){const d={id:s.nextId++,color,colorLocked:false,value:1,bonus:0,load:0,source};d.value=rollValue(d,r);return d;}
export function newRun(r=Math.random,mode='hard'){
 if(!['casual','hard'].includes(mode))throw new Error('Choose Casual or Hard.');
 const s={version:VERSION,mode,baseDice:4,maxHandSize:4,bossChoices:{},bossRevealPending:false,shopHistory:emptyHistory(),phase:'play',round:0,score:0,money:8,hands:3,rerolls:3,maxHands:3,maxRerolls:3,dice:[],nextId:1,gods:[],godStates:{},actions:[],levels:Object.fromEntries(Object.keys(HANDS).map(k=>[k,1])),pairGrowth:0,totalScored:0,scoredThisRound:0,rerollsThisRound:0,roundEffects:emptyEffects(),vouchers:voucherDefaults(),offers:[],shopRerolls:0,receipt:null,lastScore:null};
 for(let i=0;i<s.baseDice;i++)s.dice.push(makeDie(s,r,'base'));return s;
}
function numericKind(dice){
 if(dice.length>=2&&dice.length<=8&&dice.every(d=>d.value===dice[0].value))return ({2:'pair',3:'triplet',4:'quad',5:'quint',6:'sextet',7:'septet',8:'octet'})[dice.length];
 if(dice.length===4){const c=new Map();for(const d of dice)c.set(d.value,(c.get(d.value)||0)+1);if(c.size===2&&[...c.values()].every(n=>n===2))return 'twopair';}
 if(dice.length>=3&&dice.length<=6){const v=dice.map(d=>d.value).sort((a,b)=>a-b);if(v.every((n,i)=>i===0||n===v[i-1]+1))return 'run';}return null;
}
export const COMBOS=[
 {id:'pure-run',name:'Pure Run',text:'A Run of 3–4 dice, all the same color: +6 Chips and ×1.25 Mult.',chips:6,mult:0,factor:1.25},
 {id:'prism-run',name:'Prism Run',text:'A Run of four dice in four different colors: +4 Chips and +1 Mult.',chips:4,mult:1},
 {id:'twin-pacts',name:'Twin Pacts',text:'Two Pair with each pair matching in color: +8 Chips and +1 Mult. The two pairs may have different colors.',chips:8,mult:1}
];
export function comboFor(dice,kind,colorFor=d=>d.color){
 let id=null;
 if(kind==='run'&&dice.every(d=>colorFor(d)===colorFor(dice[0])))id='pure-run';
 else if(kind==='run'&&dice.length===4&&new Set(dice.map(colorFor)).size===4)id='prism-run';
 else if(kind==='twopair'){const groups=new Map();for(const d of dice){if(!groups.has(d.value))groups.set(d.value,[]);groups.get(d.value).push(d);}if([...groups.values()].every(pair=>colorFor(pair[0])===colorFor(pair[1])))id='twin-pacts';}
 return COMBOS.find(c=>c.id===id)||null;
}
export function classifyAll(dice,colorFor=d=>d.color){const kinds=[],numeric=numericKind(dice);if(numeric)kinds.push(numeric);if(dice.length>=3&&COLORS.includes(colorFor(dice[0]))&&dice.every(d=>colorFor(d)===colorFor(dice[0])))kinds.push('pact');return kinds;}
export function classify(dice){return classifyAll(dice)[0]||null;}
export function preview(s,ids,allowFallback=true){
 if(!Array.isArray(ids)||ids.length>handLimit(s)||new Set(ids).size!==ids.length)return null;
 const dice=ids.map(id=>s.dice.find(d=>d.id===id));if(dice.some(d=>!d))return null;
 const kinds=classifyAll(dice,d=>effectiveColor(s,d));if(!kinds.length){if(!allowFallback||normalHandExists(s))return null;const highest=[...s.dice].sort((a,b)=>b.value-a.value||b.bonus-a.bonus)[0];return calculateHand(s,[highest],'high');}let best=null;for(const kind of kinds){const result=calculateHand(s,dice,kind);if(!best||result.points>best.points)best=result;}return best;
}
function calculateHand(s,dice,kind){
 const boss=activeBoss(s),level=s.levels[kind],sameColor=dice.length>=2&&dice.every(d=>effectiveColor(s,d)===effectiveColor(s,dice[0]));
 const combo=comboFor(dice,kind,d=>effectiveColor(s,d));
 let chips=HANDS[kind].chips+(level-1)*(HANDS[kind].chipStep||12)+(kind==='run'?Math.max(0,dice.length-3)*HANDS.run.extraChips:0);
 let mult=HANDS[kind].mult+(level-1)*(HANDS[kind].multStep||1)*(boss?.id==='study'?0.5:1)+(kind==='run'?Math.max(0,dice.length-3)*HANDS.run.extraMult:0),money=0;
 const steps=[],effects=[];let retriggers=0;const activeGods=[];
 function step(label,source='hand',id=null,extra={}){steps.push({label,source,id,chips,mult,money,points:Math.floor(chips*mult),...extra});effects.push(label);}

 if((boss?.id==='pairs'&&['pair','twopair'].includes(kind))||(boss?.id==='runs'&&kind==='run')||(boss?.id==='pacts'&&kind==='pact')||(boss?.id==='matches'&&['triplet','quad'].includes(kind)))chips=Math.floor(chips/2);
 step(`${HANDS[kind].name} Lv.${level}: base ${chips} Chips × ${mult} Mult`);
 function contribution(die){const color=effectiveColor(s,die),blocked=(boss?.id===color+'fog')||(boss?.id==='lowfog'&&die.value<=2)||(boss?.id==='highfog'&&die.value>=5);return {blocked,amount:(blocked?0:die.value)+die.bonus};}
 for(const die of dice){const {blocked,amount}=contribution(die);chips+=amount;step(`Die ${die.value}${blocked?' · pips blocked':''}${die.bonus?' + '+die.bonus+' bonus':''}: +${amount} Chips`,'die',die.id);}
 if(s.vouchers.dichrome||s.vouchers.oceanore)step(`${s.vouchers.dichrome?'Blood & Ink License':'Ocean & Ore License'}: palette applied beneath Gods and Washes`,'voucher');
 for(const die of dice)if(die.roundColor)step(`Round Wash: die ${die.id} counts as ${die.roundColor}`,'action');
 if(sameColor){if(activeBoss(s)?.id==='pale')step('The Pale House: matching-color Mult bonus blocked','boss');else{const bonus=kind==='pair'?1:2;mult+=bonus;step(`Same color: +${bonus} Mult`,'color');}}
 if(combo){chips+=combo.chips;mult+=combo.mult;step(`${combo.name}: +${combo.chips} Chips${combo.mult?' +'+combo.mult+' Mult':''}`,'combo',combo.id);}
 if(s.roundEffects.nextChips){chips+=s.roundEffects.nextChips;step(`Action boost: +${s.roundEffects.nextChips} Chips`,'action','surge');}
 if(s.roundEffects.nextMult){mult+=s.roundEffects.nextMult;step(`Action boost: +${s.roundEffects.nextMult} Mult`,'action','blessing');}
 const count=fn=>dice.filter(fn).length,distinctColors=new Set(dice.map(d=>effectiveColor(s,d))).size;
 if(s.vouchers.spectrum){mult+=distinctColors*.5;step(`Spectrum Grant: ${distinctColors} colors, +${distinctColors*.5} Mult`,'voucher','spectrum');}
 for(const [id,amount]of [['pactprimer',kind==='pact'?8:0],['quadmanual',kind==='quad'?16:0],['runmanual',kind==='run'?4:0],['sealgrant',count(d=>d.colorLocked)*3],['wildgrant',count(d=>!d.colorLocked)*2]])if(s.vouchers[id]&&amount){chips+=amount;step(`${VOUCHERS.find(v=>v.id===id).name}: +${amount} Chips`,'voucher',id);}
 let previousActivation=null;
 function apply(action,id,replayedFrom=null){
  const name=GODS.find(g=>g.id===id).name+(replayedFrom?' → '+GODS.find(g=>g.id===replayedFrom).name:'');
  if(action.type==='add'){chips+=action.chips;mult+=action.mult;step(`${name}: ${[action.chips?'+'+action.chips+' Chips':null,action.mult?'+'+action.mult+' Mult':null].filter(Boolean).join(', ')}`,'god',id);}
  if(action.type==='multiply'){const factor=boss?.id==='glass'?1+(action.factor-1)/2:action.factor;mult*=factor;step(`${name}: ×${factor} Mult`,'god',id);}
  if(action.type==='cash'){money+=action.amount;step(`${name}: +$${action.amount}`,'god',id);}
  if(action.type==='retrigger'){const die=dice.find(d=>d.id===action.dieId);if(!die)return;const {amount,blocked}=contribution(die);chips+=amount;retriggers++;step(`${name}: retrigger die ${die.value}${blocked?' · pips blocked':''}, +${amount} Chips`,'god',id,{dieId:die.id,retrigger:true,retriggerNumber:retriggers});}
 }
 // Base hand, color/combos and one-shot boosts resolve first; active Gods then fire in rack order.
 for(const id of s.gods){
  if(!scoringHas(s,id))continue;
  const actions=[],path=s.godStates?.[id]?.path;
  const add=(c=0,m=0)=>{if(c||m)actions.push({type:'add',chips:c,mult:m});};
  const times=factor=>actions.push({type:'multiply',factor});
  const repeat=die=>{if(die)actions.push({type:'retrigger',dieId:die.id});};
  const cash=amount=>{if(boss?.id!=='tax')actions.push({type:'cash',amount});};
  if(COLOR_GODS.includes(id))step(`${GODS.find(g=>g.id===id).name}: paint rule active before scoring`,'god',id);
  switch(id){
   case 'quartet':if(kind==='quad'){if(path==='cornerstone')add(40);times(path==='monolith'?4:3);}break;
   case 'pactkeeper':if(kind==='pact'){times(path==='covenant'?2.25:1.75);if(path==='communion')cash(3);}break;
   case 'anchor':{const n=count(d=>d.colorLocked);add(n*6,n*.5);break;}
   case 'wildling':{const n=count(d=>!d.colorLocked);add(n*5,n*.5);break;}
   case 'duelist':if(dice.length===2)add(12);break;
   case 'outcast':if(kind==='high'){add(10);times(3);}break;
   case 'crossroads':if(kind==='run')add(dice.length===4?12:0,dice.length===3?2:0);break;
   case 'chromatic':if(distinctColors===2)times(1.5);break;
   case 'frugal':if(s.rerollsThisRound===0)add(0,3);break;
   case 'craftsman':add(0,count(d=>d.bonus>0));break;
   case 'harvester':if(kind==='pact')cash(3);break;
   case 'comet':if(dice.at(-1)?.value===6)repeat(dice.at(-1));break;
   case 'echo':add(path==='harmonics'?pairUnits(kind)*6:0,s.pairGrowth+echoGrowth(s,kind));break;
   case 'ladder':if(kind==='run'){add(0,dice.length*2+(path==='footpath'&&dice.length===3?3:0));if(path==='highroad'&&dice.length===4)times(1.5);}break;
   case 'ember':add(count(d=>effectiveColor(s,d)==='red')*(path==='whiteheat'?16:8));if(path==='furnace')repeat(dice.find(d=>effectiveColor(s,d)==='red'));break;
   case 'obsidian':add(0,count(d=>effectiveColor(s,d)==='black'));break;
   case 'tide':add(count(d=>effectiveColor(s,d)==='blue')*(path==='deepwater'?14:8));if(path==='undertide')repeat(dice.find(d=>effectiveColor(s,d)==='blue'));break;
   case 'crown':add(0,count(d=>effectiveColor(s,d)==='gold')*(path==='radiance'?2:1));if(path==='treasury'&&count(d=>effectiveColor(s,d)==='gold'))cash(2);break;
   case 'relic':add((s.totalScored+1)*5);break;
   case 'smallfortune':add(0,count(d=>d.value<=2)*2);break;
   case 'giant':add(count(d=>d.value===6)*18);break;
   case 'odd':{const n=count(d=>d.value%2===1);add(n*5,n);break;}
   case 'even':{const n=count(d=>d.value%2===0);add(n*5,n);break;}
   case 'balance':if(!sameColor)add(0,4);break;
   case 'banker':add(0,Math.min(8,Math.floor((s.money+money)/5)));break;
   case 'prism':if(sameColor){add(dice.length*(path==='facet'?16:10));if(path==='unity'&&dice.length>=3)times(1.5);}break;
   case 'kaleidoscope':add(0,distinctColors*(path==='prismatic'?2:1));if(path==='spectrum'&&distinctColors===4)times(1.5);break;
   case 'undertow':add(0,s.rerollsThisRound*2);break;
   case 'twins':if(pairUnits(kind))times(kind==='pair'?1.5:2);break;
   case 'trinity':if(kind==='triplet'){times(path==='ascension'?4:3);if(path==='tithe')cash(4);}break;
   case 'fortune':if(s.scoredThisRound===0)times(2);break;
   case 'moon':if(sameColor)times(1.5);break;
   case 'mirror':if(pairUnits(kind)&&sameColor)times(kind==='pair'?1.25:1.5);break;
   case 'cartographer':if(kind==='run'&&dice.length>=4)times(2);break;
   case 'sentinel':if(s.hands===1)times(2);break;
   case 'pauper':if(s.money+money<=5)times(2);break;
   case 'hermit':if(s.dice.length<=4)times(1.5);break;
   case 'chorus':if(dice.length===s.dice.length)times(1.5);break;
   case 'midas':if(sameColor)cash(2);break;
   case 'bounty':if(kind==='run')cash(3);break;
   case 'rainmaker':if(kind==='triplet')cash(4);break;
   case 'striker':repeat(dice[0]);break;
   case 'resonator':add(0,retriggers*2);break;
   case 'refrain':if(previousActivation){for(const action of previousActivation.actions)apply(action,id,previousActivation.id);activeGods.push(id);}break;
   case 'oath':times(2);break;
  }
  for(const action of actions)apply(action,id);
  if(actions.length){activeGods.push(id);previousActivation={id,actions};}
 }
 if(combo?.factor){const applied=boss?.id==='glass'?1+(combo.factor-1)/2:combo.factor;mult*=applied;step(`${combo.name}: ×${applied} Mult`,'combo',combo.id);}
 if(boss?.id==='silence')step('The Hush: first scoring God silenced','boss');
 if(boss?.id==='pressure'){const factor=Math.max(.5,1-s.scoredThisRound*.1);mult*=factor;step(`Mounting Pressure: ×${factor} final Mult`,'boss');}
 step('Final score','total');
 return {kind,scoringIds:dice.map(d=>d.id),name:HANDS[kind].name,chips,mult,points:Math.floor(chips*mult),sameColor,combo:combo?.id||null,comboName:combo?.name||null,retriggers,activeGods,effects,steps,money};
}
function normalHandExists(s){for(let mask=1;mask<(1<<s.dice.length);mask++){const dice=s.dice.filter((_,i)=>mask&(1<<i));if(dice.length>=2&&dice.length<=handLimit(s)&&classifyAll(dice,d=>effectiveColor(s,d)).length)return true;}return false;}
export function bestHand(s){let best=null;for(let mask=1;mask<(1<<s.dice.length);mask++){const ids=s.dice.filter((_,i)=>mask&(1<<i)).map(d=>d.id),value=preview(s,ids,false);if(value&&(!best||value.points>best.value.points))best={ids:value.scoringIds,value};}if(!best){const value=preview(s,[]);if(value)best={ids:value.scoringIds,value};}return best;}
function requirePlay(s){if(s.phase!=='play')throw new Error('Finish the current screen first.');}
export function reroll(s,held=[],r=Math.random,free=false){
 requirePlay(s);if(!free&&activeBoss(s)?.id==='lock')throw new Error('The Iron Hand locks normal rerolls. Use Second Wind or score a hand.');
 if(!free&&s.rerolls<=0)throw new Error('No rerolls left.');if(held.some(id=>!s.dice.some(d=>d.id===id)))throw new Error('Unknown held die.');if(s.dice.every(d=>held.includes(d.id)))throw new Error('Release at least one die to reroll.');
 const n=copy(s);if(!free)n.rerolls--;n.rerollsThisRound++;for(const d of n.dice)if(!held.includes(d.id))rollDie(d,r);return n;
}
function itemPrice(s,type,price){return Math.max(1,price-s.vouchers.discount-(type==='upgrade'?s.vouchers.study:0));}
function offer(s,type,key,price){return {id:`${s.round}-${s.shopRerolls}-${type}-${key}`,type,key,price:itemPrice(s,type,price),bought:false};}
function fresh(items,recent,count=1){const filtered=items.filter(item=>!recent.includes(item.id));return filtered.length>=count?filtered:items;}
function recordOffers(s,offers){const groups={god:'gods',upgrade:'studies',action:'actions',voucher:'vouchers'};for(const [type,key]of Object.entries(groups)){s.shopHistory[key]=[...s.shopHistory[key],...offers.filter(o=>o.type===type).map(o=>o.key)].slice(-(type==='god'?4:2));}}
export function shopOffers(s,r=Math.random){
 const list=[],history=s.shopHistory||emptyHistory();
 const allGods=GODS.filter(g=>!has(s,g.id)&&!(g.id==='finger'&&(s.round<3||s.dice.length>=8))&&!(COLOR_GODS.includes(g.id)&&s.gods.some(id=>COLOR_GODS.includes(id))));
 const available=fresh(allGods,history.gods,2+s.vouchers.foresight);
 for(let i=0;i<2+s.vouchers.foresight&&available.length;i++){const g=weightedPick(available,r);available.splice(available.indexOf(g),1);list.push(offer(s,'god',g.id,g.price));}
 const studies=Object.entries(HANDS).filter(([,h])=>h.minDice<=Math.min(s.dice.length,s.maxHandSize)).map(([id])=>({id}));
 if(studies.length){const study=weightedPick(fresh(studies,history.studies),r);list.push(offer(s,'upgrade',study.id,4+Math.floor((s.levels[study.id]-1)/2)));}
 const action=weightedPick(fresh([...ACTIONS],history.actions),r);list.push(offer(s,'action',action.id,action.price));
 const vouchers=VOUCHERS.filter(v=>s.vouchers[v.id]<v.max&&!(v.id==='dichrome'&&s.vouchers.oceanore)&&!(v.id==='oceanore'&&s.vouchers.dichrome)&&!(v.id==='dice'&&(s.round<3||s.dice.length>=8)));
 if(vouchers.length){const v=weightedPick(fresh(vouchers,history.vouchers),r);list.push(offer(s,'voucher',v.id,v.price+(v.id==='dice'?s.vouchers.dice*8:0)));}return list;
}
export function scoreHand(s,ids,r=Math.random){
 requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const result=preview(s,ids);if(!result)throw new Error('Select a matching group, Two Pair, a Run, or 3+ same-color dice for a Color Pact.');
 const n=copy(s);n.score+=result.points;n.money+=result.money;n.hands--;n.scoredThisRound++;n.totalScored++;if(scoringHas(s,'echo'))n.pairGrowth+=echoGrowth(s,result.kind);n.lastScore=result;n.roundEffects.nextChips=0;n.roundEffects.nextMult=0;
 for(const id of Object.keys(EVOLUTIONS))if(scoringHas(s,id)&&((id==='quartet'&&result.kind==='quad')||(id==='pactkeeper'&&result.kind==='pact')||(id==='echo'&&pairUnits(result.kind)>0)||(id==='ladder'&&result.kind==='run')||(id==='ember'&&result.scoringIds.some(id=>effectiveColor(s,s.dice.find(d=>d.id===id))==='red'))||(id==='tide'&&result.scoringIds.some(id=>effectiveColor(s,s.dice.find(d=>d.id===id))==='blue'))||(id==='crown'&&result.scoringIds.some(id=>effectiveColor(s,s.dice.find(d=>d.id===id))==='gold'))||(id==='prism'&&result.scoringIds.length>=3&&new Set(result.scoringIds.map(id=>effectiveColor(s,s.dice.find(d=>d.id===id)))).size===1)||(id==='trinity'&&result.kind==='triplet')||(id==='kaleidoscope'&&new Set(result.scoringIds.map(id=>effectiveColor(s,s.dice.find(d=>d.id===id)))).size>=3))){n.godStates[id]??={progress:0,path:null};n.godStates[id].progress=Math.min(EVOLUTIONS[id].goal,n.godStates[id].progress+1);}

 if(n.score>=targetFor(n.round,n.mode)){
  const interest=Math.min(5+n.vouchers.interest*2,Math.floor(n.money/5)),base=6+n.round%3+n.vouchers.rewards*2,unused=n.hands*2;
  n.receipt={base,interest,unused,earned:base+interest+unused};n.money+=n.receipt.earned;
  if(n.round===23)n.phase='won';else{n.phase='shop';n.shopRerolls=0;n.offers=shopOffers(n,r);recordOffers(n,n.offers);}
 }else if(n.hands===0)n.phase='lost';else for(const d of n.dice)rollDie(d,r);return n;
}
export function advanceRound(s,r=Math.random){
 if(s.phase!=='shop')throw new Error('Visit the shop between rounds.');const n=copy(s);n.round++;n.phase='play';n.score=0;n.hands=n.maxHands;n.rerolls=n.maxRerolls;n.rerollsThisRound=0;n.scoredThisRound=0;n.roundEffects=emptyEffects();n.lastScore=null;n.receipt=null;n.offers=[];
 for(const die of n.dice)delete die.roundColor;
 if(n.round%3===0&&n.vouchers.polish)for(const d of n.dice)d.bonus+=n.vouchers.polish;
 if(n.mode==='hard'&&BOSS_ROUNDS.includes(n.round)){if(!n.bossChoices[n.round])n.bossChoices[n.round]=drawBoss(n.bossChoices,n.round,r);n.bossRevealPending=true;const boss=activeBoss(n);if(boss.id==='short')n.hands=Math.max(1,n.hands-1);if(boss.id==='thin')n.rerolls=Math.max(0,n.rerolls-2);}
 for(const d of n.dice)rollDie(d,r);return n;
}
export function buy(s,id,r=Math.random){
 if(s.phase!=='shop')throw new Error('The shop opens between rounds.');const n=copy(s),item=n.offers.find(o=>o.id===id);if(!item||item.bought)throw new Error('That item is no longer available.');if(n.money<item.price)throw new Error('Not enough money.');
 if(item.type==='god'){
  if(n.gods.length>=4+n.vouchers.slots)throw new Error('Your Dice God slots are full. Sell one first.');if(has(n,item.key))throw new Error('You already have that God.');
  if(COLOR_GODS.includes(item.key)&&n.gods.some(id=>COLOR_GODS.includes(id)))throw new Error('Sell the other color-changing God first.');
  if(item.key==='finger'&&n.dice.length>=8)throw new Error('The tray is full.');
  n.gods.push(item.key);if(EVOLUTIONS[item.key])n.godStates[item.key]={progress:0,path:null};if(item.key==='oath'){n.maxRerolls--;n.rerolls=Math.min(n.rerolls,n.maxRerolls);}if(item.key==='finger')n.dice.push(makeDie(n,r,'finger'));if(item.key==='echo')n.pairGrowth=0;
 }else if(item.type==='upgrade')n.levels[item.key]++;
 else if(item.type==='action'){if(n.actions.length>=actionSlots(n))throw new Error('Action slots are full. Use or discard a card first.');n.actions.push({id:n.nextId++,key:item.key});}
 else if(item.type==='voucher'){
  const v=VOUCHERS.find(v=>v.id===item.key);if(!v)throw new Error('Unknown voucher.');if(n.vouchers[v.id]>=v.max)throw new Error('That voucher is maxed out.');if(v.id==='dice'&&n.dice.length>=8)throw new Error('The tray is full.');
  if((v.id==='dichrome'&&n.vouchers.oceanore)||(v.id==='oceanore'&&n.vouchers.dichrome))throw new Error('Choose only one palette license per run.');
  n.vouchers[v.id]++;if(v.id==='dice')n.dice.push(makeDie(n,r,'voucher'));if(v.id==='hands')n.maxHands++;if(v.id==='rerolls')n.maxRerolls++;
 }
 if(item.type==='voucher'&&['discount','study'].includes(item.key))for(const other of n.offers)if(other.id!==item.id&&!other.bought&&(item.key==='discount'||other.type==='upgrade'))other.price=Math.max(1,other.price-1);
 n.money-=item.price;item.bought=true;return n;
}
export function refreshShop(s,r=Math.random){if(s.phase!=='shop')throw new Error('Not in the shop.');const cost=refreshCost(s);if(s.money<cost)throw new Error('Not enough money.');const n=copy(s);n.money-=cost;n.shopRerolls++;n.offers=shopOffers(n,r);recordOffers(n,n.offers);return n;}
export function sellGod(s,id){if(s.phase!=='shop'||!has(s,id))throw new Error('Sell equipped Gods in the shop.');const n=copy(s);n.gods=n.gods.filter(g=>g!==id);delete n.godStates[id];if(id==='oath')n.maxRerolls++;n.money+=godSellPrice(s,id);if(id==='finger')n.dice=n.dice.filter(d=>d.source!=='finger');if(id==='echo')n.pairGrowth=0;return n;}
export function discardAction(s,id){if(!['shop','play'].includes(s.phase))throw new Error('This run is over.');const n=copy(s);if(!n.actions.some(a=>a.id===id))throw new Error('Unknown action.');n.actions=n.actions.filter(a=>a.id!==id);return n;}
export function useAction(s,id,selected=[],held=[],r=Math.random){
 requirePlay(s);const card=s.actions.find(a=>a.id===id);if(!card)throw new Error('That action is unavailable.');
 const untargeted=['reroll','rally','hand','surge','blessing','focus'],required=['copy','colorcopy','swap'].includes(card.key)?2:untargeted.includes(card.key)?0:1;
 if(required&&(selected.length!==required||new Set(selected).size!==required||selected.some(id=>!s.dice.some(d=>d.id===id))))throw new Error(required===2?'Select exactly two dice: source first, destination second.':'Select exactly one die for this card.');
 let n=copy(s),d=n.dice.find(d=>d.id===selected[0]);
 if(card.key==='reroll')n=reroll(n,held,r,true);
 if(card.key==='unseal'){if(!d.colorLocked)throw new Error('That die has no permanent color lock.');d.colorLocked=false;}
 if(card.key==='rinse'){if(!d.roundColor)throw new Error('That die has no round Wash.');delete d.roundColor;}
 if(card.key==='colorcopy')n.dice.find(d=>d.id===selected[1]).roundColor=effectiveColor(s,s.dice.find(d=>d.id===selected[0]));
 if(card.key==='swap'){const other=n.dice.find(d=>d.id===selected[1]);[d.value,other.value]=[other.value,d.value];}
 if(card.key==='down')d.value=Math.max(1,d.value-1);
 if(card.key==='recolor'){if(d.colorLocked)throw new Error('Break this die’s Seal before rerolling its color.');d.color=COLORS[Math.floor(r()*COLORS.length)];}
 if(card.key==='spotroll'){rollDie(d,r);n.rerollsThisRound++;}
 if(card.key==='focus'){n.roundEffects.nextChips+=15;n.roundEffects.nextMult++;}
 if(card.key==='six')d.value=6;if(card.key==='one')d.value=1;if(card.key==='nudge')d.value=Math.min(6,d.value+1);if(card.key==='invert')d.value=7-d.value;
 if(card.key==='copy')n.dice.find(d=>d.id===selected[1]).value=d.value;
 if(card.key==='dye')d.color=COLORS[(COLORS.indexOf(d.color)+1)%COLORS.length];if(card.key==='red')d.color='red';if(card.key==='black')d.color='black';if(card.key==='blue')d.color='blue';if(card.key==='gold')d.color='gold';if(card.key.startsWith('veil-'))d.roundColor=card.key.slice(5);if(card.key==='gild')d.bonus+=6;
 if(['dye','red','black','blue','gold'].includes(card.key))d.colorLocked=true;
 if(card.key==='load'){if(d.load>=2)throw new Error('That die is already fully loaded.');d.load++;d.value=Math.min(6,d.value+1);}
 if(card.key==='rally'){if(activeBoss(n)?.id==='lock')throw new Error('The boss locks normal rerolls. Save Extra Breath for another round.');n.rerolls++;n.roundEffects.rerolls++;}
 if(card.key==='hand'){n.hands++;n.roundEffects.hands++;}
 if(card.key==='surge')n.roundEffects.nextChips+=30;if(card.key==='blessing')n.roundEffects.nextMult+=3;
 n.actions=n.actions.filter(a=>a.id!==id);return n;
}
export function burnHand(s,r=Math.random){requirePlay(s);if(s.hands<=0)throw new Error('No hands left.');const n=copy(s);n.hands--;n.lastScore=null;if(has(n,'scavenger')&&activeBoss(n)?.id!=='tax')n.money++;if(n.hands===0)n.phase='lost';else for(const d of n.dice)rollDie(d,r);return n;}
export function validSave(s){
 if(!s||s.version!==VERSION||!['casual','hard'].includes(s.mode)||!['play','shop','lost','won'].includes(s.phase))return false;
 if(!Number.isInteger(s.round)||s.round<0||s.round>23||!Number.isFinite(s.money)||s.money<0||!Number.isFinite(s.score)||s.score<0||![3,4].includes(s.baseDice)||s.maxHandSize!==4)return false;
 if(!s.bossChoices||typeof s.bossChoices!=='object'||Array.isArray(s.bossChoices)||!Object.entries(s.bossChoices).every(([round,id])=>BOSS_ROUNDS.includes(Number(round))&&BOSSES.some(b=>b.id===id))||typeof s.bossRevealPending!=='boolean')return false;
 if(!s.shopHistory||!['gods','studies','actions','vouchers'].every(k=>Array.isArray(s.shopHistory[k])&&s.shopHistory[k].every(id=>typeof id==='string')))return false;
 if(!s.vouchers||!VOUCHERS.every(v=>Number.isInteger(s.vouchers[v.id])&&s.vouchers[v.id]>=0&&s.vouchers[v.id]<=v.max))return false;
 if(s.vouchers.dichrome&&s.vouchers.oceanore)return false;
 if(!Array.isArray(s.gods)||s.gods.length>4+s.vouchers.slots||new Set(s.gods).size!==s.gods.length||s.gods.some(id=>!GODS.some(g=>g.id===id))||s.gods.filter(id=>COLOR_GODS.includes(id)).length>1)return false;
 if(!s.godStates||typeof s.godStates!=='object'||Array.isArray(s.godStates)||!Object.entries(s.godStates).every(([id,g])=>has(s,id)&&EVOLUTIONS[id]&&g&&Number.isInteger(g.progress)&&g.progress>=0&&g.progress<=EVOLUTIONS[id].goal&&(g.path===null||(g.progress===EVOLUTIONS[id].goal&&EVOLUTIONS[id].options.some(o=>o.id===g.path)))))return false;
 if(!Array.isArray(s.dice)||s.dice.length!==s.baseDice+s.vouchers.dice+(has(s,'finger')?1:0)||s.dice.length>8||new Set(s.dice.map(d=>d.id)).size!==s.dice.length)return false;
 if(!s.dice.every(d=>Number.isInteger(d.id)&&d.id>0&&COLORS.includes(d.color)&&(d.colorLocked===undefined||typeof d.colorLocked==='boolean')&&(d.roundColor===undefined||COLORS.includes(d.roundColor))&&Number.isInteger(d.value)&&d.value>=1&&d.value<=6&&Number.isInteger(d.load)&&d.load>=0&&d.load<=2&&Number.isInteger(d.bonus)&&d.bonus>=0&&['base','voucher','finger'].includes(d.source)))return false;
 if(!s.roundEffects||!['hands','rerolls','nextChips','nextMult'].every(k=>Number.isInteger(s.roundEffects[k])&&s.roundEffects[k]>=0))return false;
 if(s.maxHands!==3+s.vouchers.hands||s.maxRerolls!==3+s.vouchers.rerolls-(has(s,'oath')?1:0)||!Number.isInteger(s.hands)||s.hands<0||s.hands>s.maxHands+s.roundEffects.hands||!Number.isInteger(s.rerolls)||s.rerolls<0||s.rerolls>s.maxRerolls+s.roundEffects.rerolls)return false;
 if(!s.levels||!Object.keys(HANDS).every(k=>Number.isInteger(s.levels[k])&&s.levels[k]>=1))return false;
 if(!Number.isFinite(s.pairGrowth)||s.pairGrowth<0||!Number.isInteger(s.pairGrowth*2))return false;
 if(!['totalScored','scoredThisRound','rerollsThisRound','shopRerolls'].every(k=>Number.isInteger(s[k])&&s[k]>=0))return false;
 if(!Number.isInteger(s.nextId)||s.nextId<=Math.max(...s.dice.map(d=>d.id)))return false;
 if(!Array.isArray(s.actions)||s.actions.length>actionSlots(s)||new Set(s.actions.map(a=>a.id)).size!==s.actions.length||!s.actions.every(a=>Number.isInteger(a.id)&&a.id<s.nextId&&ACTIONS.some(c=>c.id===a.key)))return false;
 if(!Array.isArray(s.offers)||!s.offers.every(o=>typeof o.id==='string'&&Number.isFinite(o.price)&&o.price>=1&&typeof o.bought==='boolean'&&['god','upgrade','action','voucher'].includes(o.type)&&(o.type==='god'?GODS.some(g=>g.id===o.key):o.type==='action'?ACTIONS.some(a=>a.id===o.key):o.type==='upgrade'?Object.hasOwn(HANDS,o.key):VOUCHERS.some(v=>v.id===o.key))))return false;
 return true;
}
export function migrateSave(raw){
 if(!raw)return null;const s=copy(raw);
 const previousVersion=s.version;
 if([1,2,3].includes(s.version)){
  if(s.version<=2)s.mode='hard';s.version=VERSION;s.baseDice=4;s.maxHandSize=4;s.shopHistory=emptyHistory();s.vouchers={...voucherDefaults(),...s.vouchers};s.roundEffects=emptyEffects();s.rerollsThisRound=Math.max(0,(s.maxRerolls||0)-(s.rerolls||0));
  if(s.levels)for(const key of Object.keys(HANDS))if(!Object.hasOwn(s.levels,key))s.levels[key]=1;
  if(s.phase==='shop'&&Array.isArray(s.offers)&&s.levels){s.offers=shopOffers(s,()=>.37);recordOffers(s,s.offers);}
  if(!s.gods?.includes('echo'))s.pairGrowth=0;
 }if(previousVersion>=1&&previousVersion<=4){s.version=VERSION;s.bossChoices={};s.bossRevealPending=false;if(s.mode==='hard')for(const round of BOSS_ROUNDS)if(round<=s.round)s.bossChoices[round]=round===8?'pale':'lock';}
 if(previousVersion>=1&&previousVersion<=5){s.version=VERSION;s.vouchers={...voucherDefaults(),...s.vouchers};}
 if(previousVersion>=1&&previousVersion<=6){s.version=VERSION;s.godStates=Object.fromEntries((s.gods||[]).filter(id=>EVOLUTIONS[id]).map(id=>[id,{progress:0,path:null}]));}
 if(previousVersion>=1&&previousVersion<=7){s.version=VERSION;for(const d of s.dice||[])d.colorLocked=true;s.godStates??={};for(const id of s.gods||[])if(EVOLUTIONS[id])s.godStates[id]??={progress:0,path:null};}
 if(previousVersion>=1&&previousVersion<=8){s.version=VERSION;s.vouchers={...voucherDefaults(),...s.vouchers};}
 return validSave(s)?s:null;
}

export function acknowledgeBoss(s){if(!s.bossRevealPending)throw new Error('No boss reveal is pending.');const n=copy(s);n.bossRevealPending=false;return n;}


export function reorderGods(s,order){
 if(!['play','shop'].includes(s.phase))throw new Error('Rearrange Gods during play or in the shop.');
 if(!Array.isArray(order)||order.length!==s.gods.length||new Set(order).size!==order.length||order.some(id=>!has(s,id)))throw new Error('Keep exactly your equipped Gods.');
 const n=copy(s);n.gods=[...order];return n;
}
export function moveGod(s,id,direction){
 const order=[...s.gods],index=order.indexOf(id),next=index+direction;
 if(![-1,1].includes(direction)||index<0||next<0||next>=order.length)throw new Error('That God cannot move farther.');
 [order[index],order[next]]=[order[next],order[index]];return reorderGods(s,order);
}
export function evolveGod(s,id,path){
 if(!['play','shop'].includes(s.phase)||!has(s,id))throw new Error('Evolve an equipped God during play or in the shop.');
 const rule=EVOLUTIONS[id],progress=s.godStates[id];if(!rule||!progress||progress.progress<rule.goal||progress.path)throw new Error('This God is not ready to evolve.');
 if(!rule.options.some(o=>o.id===path))throw new Error('Choose a valid evolution.');
 const n=copy(s);n.godStates[id].path=path;return n;
}
export const pendingEvolutions=s=>s.gods.filter(id=>EVOLUTIONS[id]&&(s.godStates[id]?.progress||0)>=EVOLUTIONS[id].goal&&!s.godStates[id]?.path);
