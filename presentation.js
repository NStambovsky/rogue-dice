export const SPEEDS=['full','instant'];
export function resolvePreferences(raw){return {speed:SPEEDS.includes(raw?.speed)?raw.speed:raw?.speed==='turbo'||raw?.scoringAnimation===false?'instant':'full',sound:raw?.sound===true};}
// Full stays readable even with a long chain; multiplier hits get their own pause.
export function timingFor(speed,index=0,multiplier=false){if(speed==='instant')return 0;return Math.max(650,850-index*8)+(multiplier?450:0);}
export function intensityFor(step,index){return Math.min(1,.15+index*.055+(step.label.includes('×')&&['god','combo'].includes(step.source)?.3:0)+Math.log10(Math.max(1,step.points))*.035);}
export function createPresenter(getPreferences){
 let active=null,audio=null;const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:6});
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function audioReady(){if(!getPreferences().sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{audio=null;}}
 function sound(index,kind='chip',strength=.3){if(!getPreferences().sound)return;audioReady();if(!audio||audio.state!=='running')return;const start=audio.currentTime,base=Math.min(1200,230*Math.pow(1.065,index));for(const [i,ratio]of(kind==='win'?[1,1.25,1.5]:kind==='multiply'?[1,1.5]:[1]).entries()){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=kind==='chip'?'sine':'triangle';osc.frequency.setValueAtTime(base*ratio,start+i*.045);gain.gain.setValueAtTime(.0001,start+i*.045);gain.gain.exponentialRampToValueAtTime(.018+strength*.025,start+i*.045+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+i*.045+.12);osc.connect(gain);gain.connect(audio.destination);osc.start(start+i*.045);osc.stop(start+i*.045+.15);}}
 function pulse(el,cls='proc-active'){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
 function fly(text,from,to,kind,duration){if(reduced()||!from||!to||getPreferences().speed==='instant')return;const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),e=document.createElement('span');e.className=`score-fly ${kind}`;e.textContent=text;e.style.left=`${a.left+a.width/2}px`;e.style.top=`${a.top+a.height/2}px`;document.body.append(e);const animation=e.animate([{transform:'translate(-50%,-50%) scale(.8)',opacity:0},{offset:.2,transform:'translate(-50%,-75%) scale(1.15)',opacity:1},{transform:`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.7)`,opacity:0}],{duration:Math.max(130,duration),easing:'cubic-bezier(.2,.65,.4,1)'});animation.onfinish=()=>e.remove();animation.oncancel=()=>e.remove();}
 function clear(){for(const e of document.querySelectorAll('.proc-active,.mult-hit,.counter-hit,.target-break,.score-impact'))e.classList.remove('proc-active','mult-hit','counter-hit','target-break','score-impact');for(const e of document.querySelectorAll('.score-fly'))e.remove();document.body.classList.remove('is-scoring');$('score-event').hidden=true;}
 function score({before,next,result,onFinish}){
  if(active)active.finish();const job={done:false,timer:null,resolve:null};active=job;
  job.finish=()=>{if(job.done)return;job.done=true;clearTimeout(job.timer);job.resolve?.();clear();if(active===job)active=null;onFinish();};
  const sleep=ms=>new Promise(resolve=>{if(job.done||!ms){resolve();return;}job.resolve=resolve;job.timer=setTimeout(()=>{job.resolve=null;resolve();},ms);});
  const tween=async(el,from,to,ms)=>{if(!el)return;const ticks=ms?Math.min(12,Math.max(1,Math.floor(ms/25))):1;for(let i=1;i<=ticks&&!job.done;i++){el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-i/ticks,3))));await sleep(ms/ticks);}};
  audioReady();document.body.classList.add('is-scoring');$('score-event').hidden=false;$('chips').textContent='0';$('mult').textContent='0';$('points').textContent='0';$('score').disabled=false;$('score').textContent='Skip scoring →';
  (async()=>{
   let previous={chips:0,mult:0,money:0,points:0};
   for(let index=0;index<result.steps.length&&!job.done;index++){
    if(getPreferences().speed==='instant'){job.finish();return;}
    const step=result.steps[index],multiply=['god','boss','combo'].includes(step.source)&&step.label.includes('×'),duration=timingFor(getPreferences().speed,index,multiply),strength=intensityFor(step,index);
    const source=step.source==='die'?document.querySelector(`[data-die="${step.id}"]`):step.source==='god'?document.querySelector(`[data-god="${step.id}"]`):$('hand-name');
    for(const e of document.querySelectorAll('.proc-active'))e.classList.remove('proc-active');pulse(source);if(step.retrigger&&step.dieId)pulse(document.querySelector(`[data-die="${step.dieId}"]`));$('score-event').textContent=(step.phase==='die'?'DIE TRIGGER · ':step.source==='god'?'GOD CHAIN · ':step.source==='set'?'DICE SET · ':'')+step.label;$('score-event').dataset.kind=multiply?'multiply':step.retrigger?'retrigger':step.source==='die'?'chip':'bonus';$('score-event').style.setProperty('--intensity',strength);
    if(step.chips!==previous.chips){pulse($('chips'),'counter-hit');fly(`${step.chips>=previous.chips?'+':''}${fmt(step.chips-previous.chips)}`,source,$('chips'),'chip',duration);}
    if(step.mult!==previous.mult){pulse($('mult'),multiply?'mult-hit':'counter-hit');fly(multiply?`×${fmt(step.mult/Math.max(.0001,previous.mult))}`:`${step.mult>=previous.mult?'+':'−'}${fmt(Math.abs(step.mult-previous.mult))}`,source,$('mult'),multiply?'multiply':'bonus',duration);}
    if(multiply&&!reduced()&&getPreferences().speed==='full')pulse(document.querySelector('.felt'),'score-impact');
    $('chips').textContent=fmt(step.chips);$('mult').textContent=fmt(step.mult);$('points').textContent=fmt(step.points);sound(index,multiply?'multiply':step.retrigger?'retrigger':step.source==='total'?'win':'chip',strength);previous=step;await sleep(duration);
   }
   if(job.done)return;
   $('score-event').textContent=`+${fmt(result.points)} POINTS`;$('score-event').dataset.kind='total';pulse($('points'),'mult-hit');const scoreTarget=document.querySelector('.score-cell strong');fly(`+${fmt(result.points)}`,$('points'),scoreTarget,'total',380);
   await tween(scoreTarget,before.score,next.score,timingFor(getPreferences().speed)*1.2);if(job.done)return;
   const progress=document.querySelector('.progress');if(progress)progress.style.width=`${Math.min(100,next.score/Number(document.querySelector('.target-cell strong')?.textContent.replaceAll(',','')||1)*100)}%`;
   if(['shop','won'].includes(next.phase)){
    $('score-event').textContent=next.phase==='won'?'RUN COMPLETE!':'ROUND CLEARED!';$('score-event').dataset.kind='clear';pulse(document.querySelector('.target-cell'),'target-break');sound(14,'win',.8);await sleep(timingFor(getPreferences().speed)*1.4);if(job.done)return;
    const earned=next.money-before.money;$('score-event').textContent=`+$${earned} · PAYOUT`;$('score-event').dataset.kind='cash';fly(`+$${earned}`,document.querySelector('.target-cell'),document.querySelector('.money strong'),'cash',350);
   }
   const money=document.querySelector('.money strong');if(money&&next.money!==before.money){const ticks=6;for(let i=1;i<=ticks&&!job.done;i++){money.textContent=`$${Math.round(before.money+(next.money-before.money)*i/ticks)}`;sound(8+i,'chip',.2);await sleep(timingFor(getPreferences().speed)/ticks);}}
   await sleep(timingFor(getPreferences().speed));job.finish();
  })().catch(()=>job.finish());
  return job;
 }
 return {score,skip:()=>active?.finish(),audioReady,isActive:()=>!!active};
}
