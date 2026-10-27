import {GODS,ACTIONS,HANDS,newRun,targetFor,effectiveColor,preview,bestHand,reroll,scoreHand,advanceRound,buy,refreshShop,sellGod,useAction,discardAction,burnHand,validSave,migrateSave,bossFor,stakesFor,VOUCHERS,actionSlots,godSellPrice,COLORS} from './engine.js?v=4';
const $=id=>document.getElementById(id),KEY='rogue-dice-run-v1';
const random=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;};
const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:6});
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const button=(text,cls,fn)=>{const e=node('button',cls,text);e.type='button';e.addEventListener('click',fn);return e;};
let scoringAnimation=false;try{scoringAnimation=JSON.parse(localStorage.getItem('rogue-dice-preferences-v1'))?.scoringAnimation===true;}catch{}
let scoreFinish=null;
let state=newRun(random,'casual'),selected=[],held=[],busy=false,generation=0,inspected=null;
try{const data=JSON.parse(localStorage.getItem(KEY));const migrated=data?migrateSave(data.state):null;if(migrated){state=migrated;selected=Array.isArray(data.selected)?data.selected.filter(id=>state.dice.some(d=>d.id===id)).slice(0,state.maxHandSize):[];held=Array.isArray(data.held)?data.held.filter(id=>state.dice.some(d=>d.id===id)):[];}}catch{/* A missing or invalid save starts a fresh run. */}
function save(){try{localStorage.setItem(KEY,JSON.stringify({state,selected,held}));$('save-label').textContent='Run saved on this device.';}catch{$('save-label').textContent='Saving unavailable. Keep this tab open.';}}
function message(text){const e=$('message');e.textContent=text;e.style.animation='none';void e.offsetWidth;e.style.animation='';}
function commit(fn,{reset=false,notice=''}={}){if(busy)return;try{state=fn();if(reset){selected=[];held=[];}save();render();message(notice);}catch(e){message(e.message);}}
function animate(fn,{notice=''}={}){if(busy)return;busy=true;render();$('dice').classList.add('rolling');const token=generation;setTimeout(()=>{if(token!==generation)return;busy=false;$('dice').classList.remove('rolling');commit(fn,{notice});},280);}
function header(){
 const round=state.round%3,ante=Math.floor(state.round/3)+1,target=targetFor(state.round,state.mode),stakes=stakesFor(state.round,state.mode);
 $('mode-picker').textContent=`${state.mode==='casual'?'CASUAL':'HARD'} ▾`;$('mode-picker').classList.toggle('hard',state.mode==='hard');
 document.body.dataset.phase=state.phase;document.body.dataset.boss=stakes.boss?.id||'';
 $('hud').replaceChildren();
 for(const [label,value,cls,sub] of [['ANTE',`${ante} / 8`,'',`Round ${round+1} / 3`],['ROUND SCORE',fmt(state.score),'score-cell',''],['TARGET',fmt(target),'target-cell',''],['MONEY',`$${state.money}`,'money',''],['HANDS',`${state.hands}`,'hands',`of ${state.maxHands+state.roundEffects.hands}`],['REROLLS',stakes.boss?.id==='lock'?'LOCK':`${state.rerolls}`,'rerolls',stakes.boss?.id==='lock'?'Second Wind OK':`of ${state.maxRerolls+state.roundEffects.rerolls}`]]){
  const cell=node('div',`hud-cell ${cls}`);cell.append(node('span','',label),node('strong','',value));if(sub)cell.append(node('small','',` ${sub}`));if(cls==='target-cell'){const bar=node('div','progress');bar.style.width=`${Math.min(100,state.score/target*100)}%`;cell.append(bar);}$('hud').append(cell);
 }
 $('stake-title').textContent=`ANTE ${ante} · ${stakes.label}${stakes.boss?' · '+stakes.boss.name:stakes.scale>1?' · STAKES ×'+stakes.scale:''}`;
 $('stake-change').textContent=stakes.previous?`${fmt(stakes.previous)} → ${fmt(target)} · ${state.mode==='casual'?'+100 / round':'+'+stakes.increase+'%'}`:`Target ${fmt(target)} · Opening table`;
 $('boss-rule').textContent=stakes.boss?stakes.boss.text:stakes.next?`Next target: ${fmt(stakes.next)}${bossFor(state.round+1,state.mode)?' · BOSS: '+bossFor(state.round+1,state.mode).name:''}`:'Final target. Beat this round to win.';
 $('stakes-strip').classList.toggle('boss-active',!!stakes.boss);
 $('round-name').textContent=`ANTE ${ante} / ${stakes.label}`;
 $('round-heading').textContent=stakes.boss?stakes.boss.name:['A little faith. A little fortune.','The table remembers.','One more roll could change everything.'][round];
}
function renderGods(){
 $('god-count').textContent=`${state.gods.length} / ${4+state.vouchers.slots}`;$('gods').replaceChildren();
 for(const id of state.gods){const g=GODS.find(g=>g.id===id);const b=button('',`god-card ${g.color}`,()=>openGod(id));b.append(node('span','god-symbol',g.symbol),node('strong','',g.name),node('small','',id==='echo'?`+${state.pairGrowth} MULT`:id==='relic'?`+${(state.totalScored+1)*5} NEXT CHIPS`:'TAP TO INSPECT'));b.dataset.god=id;b.setAttribute('aria-label',`${g.name}. ${g.text}`);$('gods').append(b);}
 for(let i=state.gods.length;i<4+state.vouchers.slots;i++){const e=node('div','god-slot','✧');e.setAttribute('aria-label','Empty Dice God slot');$('gods').append(e);}
 $('gods').style.gridTemplateColumns=`repeat(${Math.min(5,4+state.vouchers.slots)},minmax(0,1fr))`;
}
const pipPositions={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function renderDice(){
 $('dice').dataset.count=state.dice.length;$('dice').dataset.expanded=String(state.dice.length>4);
 $('dice').replaceChildren();
 for(const d of state.dice){const wrap=node('div','die-wrap');const color=effectiveColor(state,d);const b=button('',`die ${color} ${selected.includes(d.id)?'selected':''} ${held.includes(d.id)?'held':''}`,()=>{if(busy)return;if(!selected.includes(d.id)&&selected.length>=state.maxHandSize){message('Hand limit: 4 dice. Deselect one before choosing another.');return;}selected=selected.includes(d.id)?selected.filter(id=>id!==d.id):[...selected,d.id];save();render();});b.dataset.die=d.id;b.disabled=busy;b.setAttribute('aria-label',`${color} die ${d.value}${d.load?`, loaded +${d.load}`:''}${d.bonus?`, +${d.bonus} Chips`:''}${held.includes(d.id)?', held':''}`);b.setAttribute('aria-pressed',String(selected.includes(d.id)));for(let i=0;i<9;i++)b.append(node('span',`pip ${pipPositions[d.value].includes(i)?'on':''}`));wrap.append(b);if(held.includes(d.id))wrap.append(node('span','hold-badge','HELD'));if(d.bonus||d.load)wrap.append(node('span','die-mods',[d.bonus?`+${d.bonus}C`:null,d.load?`+${d.load}P`:null].filter(Boolean).join(' ')));$('dice').append(wrap);}
 const result=preview(state,selected);
 $('hand-label').textContent=result?(result.kind==='high'?'HIGHEST DIE · FALLBACK':result.sameColor?`${effectiveColor(state,state.dice.find(d=>d.id===selected[0])).toUpperCase()} HAND · ${bossFor(state.round,state.mode)?.id==='pale'?'COLOR BONUS BLOCKED':'COLOR BONUS'}`:'MIXED COLORS'):`SELECT DICE · ${selected.length}/${state.maxHandSize}`;
 $('hand-name').textContent=result?`${result.name}${result.kind==='run'?` of ${selected.length}`:''} · Lv.${state.levels[result.kind]}`:selected.length?'Not a scoring hand':'No hand selected';
 $('chips').textContent=result?fmt(result.chips):'0';$('mult').textContent=result?fmt(result.mult):'0';$('points').textContent=result?fmt(result.points):'0';
 $('effects').replaceChildren(...(result?result.effects.map(e=>node('span','effect',e)):[]));
 $('score').disabled=!result||busy||state.phase!=='play';$('score').textContent=result?.kind==='high'?'Score highest die →':'Score hand →';$('reroll').disabled=busy||bossFor(state.round,state.mode)?.id==='lock'||state.rerolls<=0||state.dice.every(d=>held.includes(d.id));
 $('reroll').textContent=bossFor(state.round,state.mode)?.id==='lock'?'Rerolls locked ⚿':`Reroll unheld · ${state.rerolls} left ↻`;
 $('score-details').disabled=!result;$('animation-toggle').textContent=`Score FX: ${scoringAnimation?'on':'off'}`;$('animation-toggle').setAttribute('aria-pressed',String(scoringAnimation));$('animation-toggle').disabled=busy;
 $('hold').disabled=busy||selected.length===0;$('hold').textContent=selected.length&&selected.every(id=>held.includes(id))?'Release selected':'Hold selected';$('best').disabled=busy;$('clear').disabled=busy||selected.length===0;$('burn').disabled=busy;
 $('dice-hint').textContent=state.rerolls===0&&!bestHand(state)?'No regular hand. Score Highest Die, use an action, or burn a hand.':held.length?`${held.length} held · Reroll changes the other dice. Select a group to score.`:'Select up to 4 dice to score. Hold useful dice before rerolling.';
 $('last-score').textContent=state.lastScore?`Last hand: ${state.lastScore.name} · ${fmt(state.lastScore.chips)} × ${fmt(state.lastScore.mult)} = ${fmt(state.lastScore.points)}${state.lastScore.money?` · +$${state.lastScore.money}`:''}`:'';
}
function renderActions(host){
 host.replaceChildren();if(!state.actions.length){host.append(node('div','empty-action','No tricks up your sleeve. Find action cards in the market.'));return;}
 for(const a of state.actions){const def=ACTIONS.find(c=>c.id===a.key),box=node('article','action'),title=button('','action-info',()=>showDetails('ACTION CARD',def.name,[def.text]));title.append(node('i','',def.symbol),node('span','',def.name));box.append(title,node('p','',def.text));const tools=node('div','action-buttons');const use=button('Use card →','',()=>{
  if(a.key==='reroll')animate(()=>{const n=useAction(state,a.id,selected,held,random);selected=[];return n;},{notice:`Used ${def.name}.`});
  else commit(()=>useAction(state,a.id,selected,held,random),{notice:`Used ${def.name}.`});
 });use.disabled=state.phase!=='play'||busy;tools.append(use,button('Discard ×','',()=>commit(()=>discardAction(state,a.id),{notice:'Action discarded.'})));box.append(tools);host.append(box);}
}
function renderGuide(){
 $('hand-guide').replaceChildren();for(const key of Object.keys(HANDS).filter(k=>HANDS[k].minDice<=Math.min(state.dice.length,state.maxHandSize))){const h=HANDS[key],level=state.levels[key],row=node('div','hand-guide-row'),left=node('div');left.append(node('strong','',h.name),node('small','',`LEVEL ${level} · ${key==='high'?'FALLBACK ONLY':key==='pair'?'2 MATCHING':key==='twopair'?'2 DIFFERENT PAIRS':key==='pact'?'3+ SAME COLOR':key==='run'?'3+ SEQUENTIAL':HANDS[key].minDice+' MATCHING'}`));const vals=node('span','values');vals.append(node('span','chips',`${h.chips+(level-1)*(h.chipStep||12)}`),node('span','',' × '),node('span','mult',`${h.mult+(level-1)*(h.multStep||1)}`));row.append(left,vals);$('hand-guide').append(row);}
}
const voucherMeta=Object.fromEntries(VOUCHERS.map(v=>[v.id,v]));
function renderShop(){
 const next=stakesFor(state.round+1,state.mode);$('next-stakes').replaceChildren(node('strong','',`UP NEXT · ANTE ${next.ante} · ${next.label}`),node('p','',`${fmt(targetFor(state.round,state.mode))} → ${fmt(next.target)} target · ${state.mode==='casual'?'+100 / round':'+'+next.increase+'%'+(next.stage===0&&(next.ante===4||next.ante===7)?' · POST-BOSS STAKES ×'+next.scale:'')}${next.boss?' · '+next.boss.name+': '+next.boss.text:''}`));
 $('next-stakes').classList.toggle('boss-active',!!next.boss);
 $('continue').textContent=`Ante ${next.ante} · Round ${next.stage+1} →`;
 const r=state.receipt;$('receipt').textContent=r?`Round cleared · $${r.base} reward + $${r.unused} unused hands + $${r.interest} interest = $${r.earned} earned.`:'';
 $('refresh').textContent=`Refresh shop · $${2+state.shopRerolls}`;$('refresh').disabled=state.money<2+state.shopRerolls;
 $('offers').replaceChildren();for(const item of state.offers){
  const meta=item.type==='god'?GODS.find(g=>g.id===item.key):item.type==='action'?ACTIONS.find(a=>a.id===item.key):item.type==='voucher'?voucherMeta[item.key]:{name:`${HANDS[item.key].name} Study`,symbol:item.key==='run'?'↗':item.key==='triplet'?'Ⅲ':'Ⅱ',color:'teal',text:item.bought?`Purchased. Current level ${state.levels[item.key]}. Added +${HANDS[item.key].chipStep||12} base Chips and +${HANDS[item.key].multStep||1} base Mult for ${HANDS[item.key].name} hands this run.`:`Level ${state.levels[item.key]} → ${state.levels[item.key]+1}. Permanently +${HANDS[item.key].chipStep||12} base Chips and +${HANDS[item.key].multStep||1} base Mult for ${HANDS[item.key].name} hands this run.`};
  const box=node('article',`offer ${meta.color} ${item.bought?'sold':''}`),top=node('div','offer-top');top.append(node('span','',item.type==='god'?'DICE GOD':item.type==='upgrade'?'HAND UPGRADE':item.type==='voucher'?'VOUCHER':'ACTION CARD'),node('span','',item.bought?'SOLD':`${meta.rarity||'common'} · $${item.price}`));box.append(top,node('div','offer-symbol',meta.symbol),node('h3','',meta.name),node('p','',meta.text));
  const b=button(item.bought?'Purchased ✓':`Buy · $${item.price} →`,'',()=>commit(()=>buy(state,item.id,random),{notice:`Bought ${meta.name}.`}));b.disabled=item.bought||state.money<item.price;box.append(b);$('offers').append(box);
 }
 renderActions($('shop-actions'));
}
function renderEnd(){const won=state.phase==='won';$('end-kicker').textContent=won?'EIGHT ANTES. ONE SURVIVOR.':'THE HOUSE COLLECTS.';$('end-title').textContent=won?'Fortune is yours.':'The dice fall silent.';$('end-detail').textContent=won?'You beat all 24 rounds. Your Gods, upgrades, and a little luck carried you to the last table.':`Your run ended at Ante ${Math.floor(state.round/3)+1}, round ${state.round%3+1}. You scored ${fmt(state.score)} of ${fmt(targetFor(state.round,state.mode))}. Every run is a new build.`;$('end-stats').textContent=`${state.totalScored} hands scored · ${state.gods.length} Gods · ${state.dice.length} dice`;}
function render(){
 const focus=document.activeElement?.dataset?.die;
 header();$('animation-toggle').textContent=`Score FX: ${scoringAnimation?'on':'off'}`;$('animation-toggle').setAttribute('aria-pressed',String(scoringAnimation));renderGods();renderGuide();renderActions($('actions'));$('actions').dataset.count=state.actions.length;$('action-count').textContent=`${state.actions.length} / ${actionSlots(state)}`;
 $('play-view').hidden=state.phase!=='play';$('shop-view').hidden=state.phase!=='shop';$('end-view').hidden=!['won','lost'].includes(state.phase);
 if(state.phase==='play')renderDice();if(state.phase==='shop')renderShop();if(['won','lost'].includes(state.phase))renderEnd();
 if(focus)document.querySelector(`[data-die="${Number(focus)}"]`)?.focus({preventScroll:true});
}
function openGod(id){if(busy)return;inspected=id;const g=GODS.find(g=>g.id===id);$('god-detail-body').replaceChildren(node('div','god-symbol',g.symbol),node('h2','',g.name),node('p','',g.text));if(id==='echo')$('god-detail-body').append(node('p','',`Current growth: +${state.pairGrowth} Mult. Score another Pair to grow it.`));if(id==='relic')$('god-detail-body').append(node('p','',`Next scoring hand: +${(state.totalScored+1)*5} Chips.`));$('sell-god').hidden=state.phase!=='shop';$('sell-god').textContent=`Sell for $${godSellPrice(state,id)}${id==='finger'?' · removes its extra die':''}`;$('god-detail').showModal();}
$('close-god').addEventListener('click',()=>$('god-detail').close());$('sell-god').addEventListener('click',()=>{commit(()=>sellGod(state,inspected),{reset:true,notice:'God sold.'});$('god-detail').close();});
function finishScoring(ids){const previous=state.phase;commit(()=>scoreHand(state,ids,random),{reset:true});if(previous==='play'&&state.phase!=='play'){window.scrollTo({top:0,behavior:'smooth'});message(state.phase==='shop'?'Round cleared. Welcome to the night market.':state.phase==='won'?'You beat the house.':'Run over. A new build awaits.');}}
$('score').addEventListener('click',()=>{if(busy)return;const result=preview(state,selected);if(!result)return;const ids=result.scoringIds;if(scoringAnimation)playScoring(ids,result);else finishScoring(ids);});
$('reroll').addEventListener('click',()=>animate(()=>{const n=reroll(state,held,random);selected=[];return n;}));
$('hold').addEventListener('click',()=>{if(busy)return;held=selected.every(id=>held.includes(id))?held.filter(id=>!selected.includes(id)):[...new Set([...held,...selected])];save();render();message('Held dice keep their values when you reroll.');});
$('clear').addEventListener('click',()=>{selected=[];save();render();message('');});
$('best').addEventListener('click',()=>{const best=bestHand(state);selected=best?best.ids:[];save();render();message(best?`Best hand: ${best.value.name} for ${fmt(best.value.points)}.`:'No legal hand. Hold useful dice and reroll, use an action, or burn a hand.');});
$('burn').addEventListener('click',()=>{commit(()=>burnHand(state,random),{reset:true,notice:'Burned one hand for a fresh tray.'});if(state.phase==='lost')window.scrollTo({top:0,behavior:'smooth'});});
$('continue').addEventListener('click',()=>{commit(()=>advanceRound(state,random),{reset:true});const st=stakesFor(state.round,state.mode);message(st.boss?`BOSS: ${st.boss.name}. ${st.boss.text}`:`Ante ${st.ante}, ${st.label.toLowerCase()}. Target ${fmt(st.target)} (+${st.increase}%).`);window.scrollTo({top:0,behavior:'smooth'});});
$('refresh').addEventListener('click',()=>commit(()=>refreshShop(state,random),{notice:'New offerings. Choose carefully.'}));
$('help').addEventListener('click',()=>$('rules').showModal());$('close-help').addEventListener('click',()=>$('rules').close());
function restart(mode=state.mode){generation++;busy=false;state=newRun(random,mode);selected=[];held=[];$('dice').classList.remove('rolling');save();render();message('A new run. May the Gods be kind.');window.scrollTo({top:0,behavior:'smooth'});}
function chooseMode(){if(busy)return;$('mode-casual').checked=state.mode==='casual';$('mode-hard').checked=state.mode==='hard';$('confirm-new').showModal();}
$('new').addEventListener('click',chooseMode);$('mode-picker').addEventListener('click',chooseMode);$('again').addEventListener('click',chooseMode);$('cancel-new').addEventListener('click',()=>$('confirm-new').close());$('start-new').addEventListener('click',()=>{$('confirm-new').close();restart(document.querySelector('input[name=run-mode]:checked').value);});
save();render();

function showDetails(kicker,title,lines){$('details-kicker').textContent=kicker;$('details-body').replaceChildren(node('h2','',title),...lines.map(line=>node('p','',line)));$('details-dialog').showModal();}
$('close-details').addEventListener('click',()=>$('details-dialog').close());
$('score-details').addEventListener('click',()=>{const p=preview(state,selected);if(p)showDetails('SCORING BREAKDOWN',`${p.name} · ${fmt(p.points)} points`,[...p.effects,`${fmt(p.chips)} Chips × ${fmt(p.mult)} Mult = ${fmt(p.points)} points`]);});
$('show-stakes').addEventListener('click',()=>{$('map-description').textContent=state.mode==='casual'?'CASUAL: targets increase by 100 every round. No bosses.':'HARD: bosses end Antes 3 and 6. The target scale doubles after each boss (×2 from Ante 4, ×4 from Ante 7).';const host=$('stakes-map-body');host.replaceChildren();for(let ante=0;ante<8;ante++){const box=node('section',`ante-map-row ${Math.floor(state.round/3)===ante?'current':''}`);box.append(node('strong','',`ANTE ${ante+1}${state.mode==='hard'&&(ante===2||ante===5)?' · BOSS ANTE':''}`));const rounds=node('div','map-rounds');for(let stage=0;stage<3;stage++){const r=ante*3+stage,st=stakesFor(r,state.mode),cell=node('div',`map-round ${st.boss?'boss':''} ${r===state.round?'current':''}`);cell.append(node('span','',`${r<state.round?'✓ ':r===state.round?'▶ ':''}${st.label}`),node('strong','',fmt(st.target)));if(st.boss)cell.append(node('small','',st.boss.name));rounds.append(cell);}box.append(rounds);const boss=bossFor(ante*3+2,state.mode);if(boss)box.append(node('p','',boss.text));host.append(box);}$('stakes-map').showModal();});
$('close-stakes').addEventListener('click',()=>$('stakes-map').close());

$('animation-toggle').addEventListener('click',()=>{if(busy)return;scoringAnimation=!scoringAnimation;try{localStorage.setItem('rogue-dice-preferences-v1',JSON.stringify({scoringAnimation}));}catch{}render();message(scoringAnimation?'Scoring animation on. Each die and God will be counted.':'Scoring animation off. Hands score immediately.');});
function playScoring(ids,result){
 busy=true;render();const token=generation,dialog=$('scoring-animation');let index=0,done=false,timer;
 $('trace-title').textContent=result.name;$('trace-history').replaceChildren();$('trace-dice').replaceChildren(...ids.map(id=>{const d=state.dice.find(d=>d.id===id),e=node('span',`trace-die ${effectiveColor(state,d)}`,String(d.value));e.dataset.traceDie=id;return e;}));
 $('trace-total').textContent='0';$('trace-chips').textContent='0';$('trace-mult').textContent='0';$('trace-source').textContent='✦';
 function finish(){if(done||token!==generation)return;done=true;clearTimeout(timer);scoreFinish=null;dialog.close();busy=false;finishScoring(ids);}
 scoreFinish=finish;dialog.showModal();
 function tick(){if(done||token!==generation)return;const step=result.steps[index];$('trace-label').textContent=step.label;$('trace-chips').textContent=fmt(step.chips);$('trace-mult').textContent=fmt(step.mult);$('trace-total').textContent=fmt(step.points);$('trace-count').textContent=`${index+1} / ${result.steps.length}`;$('trace-progress').style.width=`${(index+1)/result.steps.length*100}%`;
  for(const e of $('trace-dice').children)e.classList.toggle('active',step.source==='die'&&String(step.id)===e.dataset.traceDie);
  $('trace-source').textContent=step.source==='god'?GODS.find(g=>g.id===step.id).symbol:step.source==='die'?'⚄':step.source==='total'?'✓':step.source==='color'?'◐':'✦';
  const entry=node('li','',step.label);$('trace-history').append(entry);$('trace-history').scrollTop=$('trace-history').scrollHeight;index++;timer=setTimeout(index<result.steps.length?tick:finish,index<result.steps.length?280:650);
 }
 tick();
}
$('skip-scoring').addEventListener('click',()=>scoreFinish?.());$('scoring-animation').addEventListener('cancel',e=>{e.preventDefault();scoreFinish?.();});
const catalogs={gods:GODS,vouchers:VOUCHERS,actions:ACTIONS};
function showCollection(type='gods'){$('collection-body').replaceChildren(...catalogs[type].map(item=>{const card=node('article',`collection-card ${item.color}`);card.append(node('span','collection-symbol',item.symbol),node('strong','',item.name),node('small','',`${item.rarity||'common'} · $${item.price}`),node('p','',item.text));return card;}));for(const b of document.querySelectorAll('[data-catalog]'))b.setAttribute('aria-pressed',String(b.dataset.catalog===type));}
$('open-collection').addEventListener('click',()=>{$('rules').close();showCollection();$('collection').showModal();});$('close-collection').addEventListener('click',()=>$('collection').close());for(const b of document.querySelectorAll('[data-catalog]'))b.addEventListener('click',()=>showCollection(b.dataset.catalog));
