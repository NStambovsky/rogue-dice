import {GODS,ACTIONS,HANDS,newRun,targetFor,effectiveColor,preview,bestHand,reroll,scoreHand,advanceRound,buy,refreshShop,sellGod,useAction,discardAction,burnHand,validSave} from './engine.js?v=1';
const $=id=>document.getElementById(id),KEY='rogue-dice-run-v1';
const random=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;};
const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:1});
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const button=(text,cls,fn)=>{const e=node('button',cls,text);e.type='button';e.addEventListener('click',fn);return e;};
let state=newRun(random),selected=[],held=[],busy=false,generation=0,inspected=null;
try{const data=JSON.parse(localStorage.getItem(KEY));if(data&&validSave(data.state)){state=data.state;selected=Array.isArray(data.selected)?data.selected.filter(id=>state.dice.some(d=>d.id===id)):[];held=Array.isArray(data.held)?data.held.filter(id=>state.dice.some(d=>d.id===id)):[];}}catch{/* A missing or invalid save starts a fresh run. */}
function save(){try{localStorage.setItem(KEY,JSON.stringify({state,selected,held}));$('save-label').textContent='Run saved on this device.';}catch{$('save-label').textContent='Saving unavailable. Keep this tab open.';}}
function message(text){$('message').textContent=text;}
function commit(fn,{reset=false,notice=''}={}){if(busy)return;try{state=fn();if(reset){selected=[];held=[];}save();render();message(notice);}catch(e){message(e.message);}}
function animate(fn,{notice=''}={}){if(busy)return;busy=true;render();$('dice').classList.add('rolling');const token=generation;setTimeout(()=>{if(token!==generation)return;busy=false;$('dice').classList.remove('rolling');commit(fn,{notice});},280);}
function header(){
 const round=state.round%3,ante=Math.floor(state.round/3)+1,target=targetFor(state.round);
 $('hud').replaceChildren();
 for(const [label,value,cls,sub] of [['ANTE',`${ante} / 8`,'',`Round ${round+1} / 3`],['ROUND SCORE',fmt(state.score),'score-cell',''],['TARGET',fmt(target),'target-cell',''],['MONEY',`$${state.money}`,'money',''],['HANDS',`${state.hands}`,'hands',`of ${state.maxHands}`],['REROLLS',`${state.rerolls}`,'rerolls',`of ${state.maxRerolls}`]]){
  const cell=node('div',`hud-cell ${cls}`);cell.append(node('span','',label),node('strong','',value));if(sub)cell.append(node('small','',` ${sub}`));if(cls==='target-cell'){const bar=node('div','progress');bar.style.width=`${Math.min(100,state.score/target*100)}%`;cell.append(bar);}$('hud').append(cell);
 }
 $('round-name').textContent=`ANTE ${ante} / ${['THE OPENING WAGER','THE HIGHER STAKES','THE HOUSE CHALLENGE'][round]}`;
 $('round-heading').textContent=['A little faith. A little fortune.','The table remembers.','One more roll could change everything.'][round];
}
function renderGods(){
 $('god-count').textContent=`${state.gods.length} / ${4+state.vouchers.slots}`;$('gods').replaceChildren();
 for(const id of state.gods){const g=GODS.find(g=>g.id===id);const b=button('',`god-card ${g.color}`,()=>openGod(id));b.append(node('span','god-symbol',g.symbol),node('strong','',g.name),node('small','',id==='echo'?`+${state.pairGrowth} MULT`:id==='relic'?`+${(state.totalScored+1)*5} NEXT CHIPS`:'TAP TO INSPECT'));b.setAttribute('aria-label',`${g.name}. ${g.text}`);$('gods').append(b);}
 for(let i=state.gods.length;i<4+state.vouchers.slots;i++){const e=node('div','god-slot','✧');e.setAttribute('aria-label','Empty Dice God slot');$('gods').append(e);}
 $('gods').style.gridTemplateColumns=`repeat(${Math.min(5,4+state.vouchers.slots)},minmax(0,1fr))`;
}
const pipPositions={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function renderDice(){
 $('dice').replaceChildren();
 for(const d of state.dice){const wrap=node('div','die-wrap');const color=effectiveColor(state,d);const b=button('',`die ${color==='black'?'black':''} ${selected.includes(d.id)?'selected':''} ${held.includes(d.id)?'held':''}`,()=>{if(busy)return;selected=selected.includes(d.id)?selected.filter(id=>id!==d.id):[...selected,d.id];save();render();});b.dataset.die=d.id;b.disabled=busy;b.setAttribute('aria-label',`${color} die ${d.value}${d.load?`, loaded +${d.load}`:''}${d.bonus?`, +${d.bonus} Chips`:''}${held.includes(d.id)?', held':''}`);b.setAttribute('aria-pressed',String(selected.includes(d.id)));for(let i=0;i<9;i++)b.append(node('span',`pip ${pipPositions[d.value].includes(i)?'on':''}`));wrap.append(b);if(held.includes(d.id))wrap.append(node('span','hold-badge','HELD'));if(d.bonus||d.load)wrap.append(node('span','die-mods',[d.bonus?`+${d.bonus}C`:null,d.load?`+${d.load}P`:null].filter(Boolean).join(' ')));$('dice').append(wrap);}
 const result=preview(state,selected);
 $('hand-label').textContent=result?(result.sameColor?`${effectiveColor(state,state.dice.find(d=>d.id===selected[0])).toUpperCase()} HAND · COLOR BONUS`:'MIXED COLORS'):'SELECT YOUR DICE';
 $('hand-name').textContent=result?`${result.name}${result.kind==='run'?` of ${selected.length}`:''} · Lv.${state.levels[result.kind]}`:selected.length?'Not a scoring hand':'No hand selected';
 $('chips').textContent=result?fmt(result.chips):'0';$('mult').textContent=result?fmt(result.mult):'0';$('points').textContent=result?fmt(result.points):'0';
 $('effects').replaceChildren(...(result?result.effects.map(e=>node('span','effect',e)):[]));
 $('score').disabled=!result||busy||state.phase!=='play';$('reroll').disabled=busy||state.rerolls<=0||state.dice.every(d=>held.includes(d.id));
 $('reroll').textContent=`Reroll unheld · ${state.rerolls} left ↻`;
 $('hold').disabled=busy||selected.length===0;$('hold').textContent=selected.length&&selected.every(id=>held.includes(id))?'Release selected':'Hold selected';$('best').disabled=busy;$('clear').disabled=busy||selected.length===0;$('burn').disabled=busy;
 $('dice-hint').textContent=state.rerolls===0&&!bestHand(state)?'No scoring hand and no rerolls. Use an action card or burn a hand.':held.length?`${held.length} held · Reroll changes the other dice. Select a group to score.`:'Tap dice to select a hand. Hold dice to keep them when rerolling.';
 $('last-score').textContent=state.lastScore?`Last hand: ${state.lastScore.name} · ${fmt(state.lastScore.chips)} × ${fmt(state.lastScore.mult)} = ${fmt(state.lastScore.points)}${state.lastScore.money?` · +$${state.lastScore.money}`:''}`:'';
}
function renderActions(host){
 host.replaceChildren();if(!state.actions.length){host.append(node('div','empty-action','No tricks up your sleeve. Find action cards in the market.'));return;}
 for(const a of state.actions){const def=ACTIONS.find(c=>c.id===a.key),box=node('article','action'),title=node('strong');title.append(node('i','',def.symbol),node('span','',def.name));box.append(title,node('p','',def.text));const tools=node('div','action-buttons');const use=button('Use card →','',()=>{
  if(a.key==='reroll')animate(()=>{const n=useAction(state,a.id,selected,held,random);selected=[];return n;},{notice:`Used ${def.name}.`});
  else commit(()=>useAction(state,a.id,selected,held,random),{notice:`Used ${def.name}.`});
 });use.disabled=state.phase!=='play'||busy;tools.append(use,button('Discard ×','',()=>commit(()=>discardAction(state,a.id),{notice:'Action discarded.'})));box.append(tools);host.append(box);}
}
function renderGuide(){
 $('hand-guide').replaceChildren();for(const key of ['pair','triplet','run']){const h=HANDS[key],level=state.levels[key],row=node('div','hand-guide-row'),left=node('div');left.append(node('strong','',h.name),node('small','',`LEVEL ${level} · ${key==='pair'?'2 MATCHING':key==='triplet'?'3 MATCHING':'3+ SEQUENTIAL'}`));const vals=node('span','values');vals.append(node('span','chips',`${h.chips+(level-1)*12}`),node('span','',' × '),node('span','mult',`${h.mult+(level-1)}`));row.append(left,vals);$('hand-guide').append(row);}
}
const voucherMeta={dice:{name:'A Bigger Fist',symbol:'⚄',text:'Permanently adds one die to this run. No God slot required.',color:'gold'},hands:{name:'Another Chance',symbol:'＋',text:'Start every future round with one more scoring hand.',color:'red'},rerolls:{name:'Loaded Pockets',symbol:'↻',text:'Start every future round with one more reroll.',color:'teal'},slots:{name:'A Fifth Altar',symbol:'✧',text:'Unlock a fifth Dice God slot for this run.',color:'violet'}};
function renderShop(){
 const r=state.receipt;$('receipt').textContent=r?`Round cleared · $${r.base} reward + $${r.unused} unused hands + $${r.interest} interest = $${r.earned} earned.`:'';
 $('refresh').textContent=`Refresh shop · $${2+state.shopRerolls}`;$('refresh').disabled=state.money<2+state.shopRerolls;
 $('offers').replaceChildren();for(const item of state.offers){
  const meta=item.type==='god'?GODS.find(g=>g.id===item.key):item.type==='action'?ACTIONS.find(a=>a.id===item.key):item.type==='voucher'?voucherMeta[item.key]:{name:`${HANDS[item.key].name} Study`,symbol:item.key==='run'?'↗':item.key==='triplet'?'Ⅲ':'Ⅱ',color:'teal',text:item.bought?`Purchased. Current level ${state.levels[item.key]}. Added +12 base Chips and +1 base Mult for ${HANDS[item.key].name} hands this run.`:`Level ${state.levels[item.key]} → ${state.levels[item.key]+1}. Permanently +12 base Chips and +1 base Mult for ${HANDS[item.key].name} hands this run.`};
  const box=node('article',`offer ${meta.color} ${item.bought?'sold':''}`),top=node('div','offer-top');top.append(node('span','',item.type==='god'?'DICE GOD':item.type==='upgrade'?'HAND UPGRADE':item.type==='voucher'?'VOUCHER':'ACTION CARD'),node('span','',item.bought?'SOLD':`$${item.price}`));box.append(top,node('div','offer-symbol',meta.symbol),node('h3','',meta.name),node('p','',meta.text));
  const b=button(item.bought?'Purchased ✓':`Buy · $${item.price} →`,'',()=>commit(()=>buy(state,item.id,random),{notice:`Bought ${meta.name}.`}));b.disabled=item.bought||state.money<item.price;box.append(b);$('offers').append(box);
 }
 renderActions($('shop-actions'));
}
function renderEnd(){const won=state.phase==='won';$('end-kicker').textContent=won?'EIGHT ANTES. ONE SURVIVOR.':'THE HOUSE COLLECTS.';$('end-title').textContent=won?'Fortune is yours.':'The dice fall silent.';$('end-detail').textContent=won?'You beat all 24 rounds. Your Gods, upgrades, and a little luck carried you to the last table.':`Your run ended at Ante ${Math.floor(state.round/3)+1}, round ${state.round%3+1}. You scored ${fmt(state.score)} of ${fmt(targetFor(state.round))}. Every run is a new build.`;$('end-stats').textContent=`${state.totalScored} hands scored · ${state.gods.length} Gods · ${state.dice.length} dice`;}
function render(){
 const focus=document.activeElement?.dataset?.die;
 header();renderGods();renderGuide();renderActions($('actions'));$('action-count').textContent=`${state.actions.length} / 3`;
 $('play-view').hidden=state.phase!=='play';$('shop-view').hidden=state.phase!=='shop';$('end-view').hidden=!['won','lost'].includes(state.phase);
 if(state.phase==='play')renderDice();if(state.phase==='shop')renderShop();if(['won','lost'].includes(state.phase))renderEnd();
 if(focus)document.querySelector(`[data-die="${Number(focus)}"]`)?.focus({preventScroll:true});
}
function openGod(id){inspected=id;const g=GODS.find(g=>g.id===id);$('god-detail-body').replaceChildren(node('div','god-symbol',g.symbol),node('h2','',g.name),node('p','',g.text));if(id==='echo')$('god-detail-body').append(node('p','',`Current growth: +${state.pairGrowth} Mult. Score another Pair to grow it.`));if(id==='relic')$('god-detail-body').append(node('p','',`Next scoring hand: +${(state.totalScored+1)*5} Chips.`));$('sell-god').hidden=state.phase!=='shop';$('sell-god').textContent=`Sell for $${Math.floor(g.price/2)}${id==='finger'?' · removes its extra die':''}`;$('god-detail').showModal();}
$('close-god').addEventListener('click',()=>$('god-detail').close());$('sell-god').addEventListener('click',()=>{commit(()=>sellGod(state,inspected),{reset:true,notice:'God sold.'});$('god-detail').close();});
$('score').addEventListener('click',()=>{const previous=state.phase;commit(()=>scoreHand(state,selected,random),{reset:true});if(previous==='play'&&state.phase!=='play'){window.scrollTo({top:0,behavior:'smooth'});message(state.phase==='shop'?'Round cleared. Welcome to the night market.':state.phase==='won'?'You beat the house.':'Run over. A new build awaits.');}});
$('reroll').addEventListener('click',()=>animate(()=>{const n=reroll(state,held,random);selected=[];return n;}));
$('hold').addEventListener('click',()=>{if(busy)return;held=selected.every(id=>held.includes(id))?held.filter(id=>!selected.includes(id)):[...new Set([...held,...selected])];save();render();message('Held dice keep their values when you reroll.');});
$('clear').addEventListener('click',()=>{selected=[];save();render();message('');});
$('best').addEventListener('click',()=>{const best=bestHand(state);selected=best?best.ids:[];save();render();message(best?`Best hand: ${best.value.name} for ${fmt(best.value.points)}.`:'No legal hand. Hold useful dice and reroll, use an action, or burn a hand.');});
$('burn').addEventListener('click',()=>{commit(()=>burnHand(state,random),{reset:true,notice:'Burned one hand for a fresh tray.'});if(state.phase==='lost')window.scrollTo({top:0,behavior:'smooth'});});
$('continue').addEventListener('click',()=>{commit(()=>advanceRound(state,random),{reset:true,notice:'New round. Find your opening.'});window.scrollTo({top:0,behavior:'smooth'});});
$('refresh').addEventListener('click',()=>commit(()=>refreshShop(state,random),{notice:'New offerings. Choose carefully.'}));
$('help').addEventListener('click',()=>$('rules').showModal());$('close-help').addEventListener('click',()=>$('rules').close());
function restart(){generation++;busy=false;state=newRun(random);selected=[];held=[];$('dice').classList.remove('rolling');save();render();message('A new run. May the Gods be kind.');window.scrollTo({top:0,behavior:'smooth'});}
$('new').addEventListener('click',()=>{if(['won','lost'].includes(state.phase))restart();else $('confirm-new').showModal();});$('again').addEventListener('click',restart);$('cancel-new').addEventListener('click',()=>$('confirm-new').close());$('start-new').addEventListener('click',()=>{$('confirm-new').close();restart();});
save();render();
