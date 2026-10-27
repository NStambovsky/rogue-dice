import * as current from '../engine.js';
import {numericSpace,roundOdds} from './audit.mjs';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),temp=mkdtempSync(join(tmpdir(),'rogue-balance-v8-'));
let previous;
try{
 writeFileSync(join(temp,'package.json'),'{"type":"module"}');
 for(const file of ['engine.js','catalog.js','bosses.js'])writeFileSync(join(temp,file),execFileSync('git',['show',`ba6539e:${file}`],{cwd:root}));
 previous=await import(pathToFileURL(join(temp,'engine.js')));
 const results={baselineCommit:'ba6539e',method:'Conditional means choose the highest-scoring qualifying subset for that named hand, including pips and natural starting-color combos. Chances overlap. Round odds are exact optimal play for THREE hands sharing 0/1/2/3 rerolls, with free fresh rolls after scoring; default resources, no purchases, no boss. Gods that grow or depend on resources are excluded from this round model.',editions:{}};
 for(const [edition,E]of [['before',previous],['after',current]]){
  const sums={},profiles={};
  for(const [profile,gods,mono,growth]of [['bare',[],false,0],['pairGods',['twins','echo'],false,5],['runGod',['ladder'],false,0],['tripletGod',['trinity'],false,0],['fourColors',['kaleidoscope'],false,0],['monochrome',['scarlet'],true,0]]){
   const s=E.newRun(()=>.4,'casual');s.gods=gods;s.pairGrowth=growth;s.dice.forEach((d,i)=>d.color=mono?'red':E.COLORS[i]);const buckets={};let bestTotal=0;
   for(let roll=0;roll<1296;roll++){
    s.dice.forEach((d,i)=>d.value=Math.floor(roll/6**i)%6+1);const best={};
    for(let mask=1;mask<16;mask++){const ids=s.dice.filter((_,i)=>mask>>i&1).map(d=>d.id),p=E.preview(s,ids,false);if(!p)continue;const key=p.kind==='run'?'run'+ids.length:p.kind;best[key]=Math.max(best[key]||0,p.points);}
    for(const [key,points]of Object.entries(best)){buckets[key]??={count:0,total:0};buckets[key].count++;buckets[key].total+=points;}
    bestTotal+=E.bestHand(s).value.points;
   }
   profiles[profile]={meanBestScore:bestTotal/1296,hands:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,{chance:v.count/1296,meanScore:v.total/v.count}]))};
  }
  const {states}=numericSpace(4),s=E.newRun(()=>.4,'casual');
  const scores=states.map(({c})=>{const values=c.flatMap((count,i)=>Array(count).fill(i+1));s.dice.forEach((d,i)=>{d.value=values[i];d.color=E.COLORS[i];});return E.bestHand(s).value.points;});
  results.editions[edition]={profiles,openingRoundClear:roundOdds(scores)};
 }
 writeFileSync(fileURLToPath(new URL('./scores.json',import.meta.url)),JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify({before:results.editions.before.profiles.bare,after:results.editions.after.profiles.bare,rounds:results.editions.after.openingRoundClear},null,2));
}finally{rmSync(temp,{recursive:true,force:true});}
