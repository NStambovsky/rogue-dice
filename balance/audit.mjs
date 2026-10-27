import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const factorial=[1];for(let i=1;i<=8;i++)factorial[i]=factorial[i-1]*i;
const key=c=>c.reduce((v,x,i)=>v+x*9**i,0);
function counts(n,i=0,prefix=[]){if(i===5)return [[...prefix,n]];return Array.from({length:n+1},(_,v)=>counts(n-v,i+1,[...prefix,v])).flat();}
const targets={pair:c=>c.some(n=>n>=2),twopair:c=>c.filter(n=>n>=2).length>=2,triplet:c=>c.some(n=>n>=3),quad:c=>c.some(n=>n>=4),run3:c=>[0,1,2,3].some(i=>c.slice(i,i+3).every(Boolean)),run4:c=>[0,1,2].some(i=>c.slice(i,i+4).every(Boolean))};
const rolls=Array.from({length:9},(_,n)=>counts(n).map(c=>({c,key:key(c),p:factorial[n]/c.reduce((v,x)=>v*factorial[x],1)/6**n})));
function subcounts(c,i=0,p=[]){if(i===6)return [p];return Array.from({length:c[i]+1},(_,n)=>subcounts(c,i+1,[...p,n])).flat();}
export function numericSpace(n){
 const states=rolls[n],indices=new Map(states.map((s,i)=>[s.key,i]));
 const held=rolls.slice(0,n+1).flatMap((list,h)=>list.map(s=>({key:s.key,transitions:rolls[n-h].map(r=>[indices.get(s.key+r.key),r.p])})));
 const holdIndex=new Map(held.map((h,i)=>[h.key,i]));
 const choices=states.map(s=>subcounts(s.c).map(c=>holdIndex.get(key(c))));
 return {states,held,choices};
}
export function audit(n){
 const {states,held,choices}=numericSpace(n);
 return Object.fromEntries(Object.entries(targets).map(([name,predicate])=>{
  const success=states.map(s=>predicate(s.c));let values=Float64Array.from(success,Boolean),probabilities=[states.reduce((v,s,i)=>v+s.p*values[i],0)];
  for(let remaining=1;remaining<=3;remaining++){
   const expected=held.map(h=>h.transitions.reduce((v,[i,p])=>v+p*values[i],0));
   values=Float64Array.from(states,(_,i)=>success[i]?1:Math.max(...choices[i].map(h=>expected[h])));
   probabilities.push(states.reduce((v,s,i)=>v+s.p*values[i],0));
  }
  return [name,probabilities];
 }));
}
export function runAudit(){
const result={method:'Exact multinomial enumeration and Bellman optimal-hold dynamic programming. Fair unloaded d6; at most four submitted dice. Each target is pursued alone. Columns: initial roll, then 1/2/3 dedicated rerolls. Rerolls are shared across hands in the game, so three-reroll chances are an upper bound for each hand, not a per-hand entitlement.',trays:{}};
for(let n=4;n<=8;n++)result.trays[n]=audit(n);


// Identity-aware color audit: fixed paint belongs to each die, never rerolled.
function colorAudit(colors){
 const faces=Array.from({length:1296},(_,i)=>Array.from({length:4},(_,d)=>Math.floor(i/6**d)%6+1));
 const patterns=Array.from({length:2401},(_,i)=>Array.from({length:4},(_,d)=>Math.floor(i/7**d)%7));
 const index=v=>v.reduce((n,x,d)=>n+(x-1)*6**d,0);
 function completions(p,d=0,v=[]){if(d===4)return [index(v)];return (p[d]?[p[d]]:[1,2,3,4,5,6]).flatMap(x=>completions(p,d+1,[...v,x]));}
 const transitions=patterns.map(p=>completions(p)),choices=faces.map(v=>Array.from({length:16},(_,mask)=>v.reduce((n,x,d)=>n+((mask>>d)&1?x:0)*7**d,0)));
 const masks=Array.from({length:16},(_,m)=>[0,1,2,3].filter(i=>m>>i&1)).filter(ids=>ids.length>=3);
 const straight=v=>new Set(v).size===v.length&&Math.max(...v)-Math.min(...v)===v.length-1;
 const predicates={
  pact:v=>masks.some(ids=>ids.every(i=>colors[i]===colors[ids[0]])),
  pureRun:v=>masks.some(ids=>ids.every(i=>colors[i]===colors[ids[0]])&&straight(ids.map(i=>v[i]))),
  prismRun:v=>new Set(colors).size===4&&straight(v),
  twinPacts:v=>{const groups=new Map();v.forEach((x,i)=>{if(!groups.has(x))groups.set(x,[]);groups.get(x).push(i);});return groups.size===2&&[...groups.values()].every(ids=>ids.length===2&&colors[ids[0]]===colors[ids[1]]);}
 };
 return Object.fromEntries(Object.entries(predicates).map(([name,predicate])=>{
  const success=faces.map(predicate);let values=Float64Array.from(success,Boolean),probabilities=[values.reduce((a,b)=>a+b,0)/1296];
  for(let r=1;r<=3;r++){const expected=transitions.map(list=>list.reduce((sum,i)=>sum+values[i],0)/list.length);values=Float64Array.from(faces,(_,i)=>success[i]?1:Math.max(...choices[i].map(h=>expected[h])));probabilities.push(values.reduce((a,b)=>a+b,0)/1296);}
  return [name,probabilities];
 }));
}
result.colors={};for(const [name,colors]of Object.entries({starting:['red','black','blue','gold'],twoTone:['red','black','black','red'],threePainted:['red','red','red','blue'],monochrome:['red','red','red','red']}))result.colors[name]={colors,odds:colorAudit(colors)};
result.calibration={anchorMeanPair:30,rarityExponent:.65,effectiveChance:'geometric mean of initial and one-reroll optimal-target chance; one reroll is the budget per hand if the round’s three rerolls are spread across three hands. Dedicated-three-reroll odds are also reported, but do not set rewards.',targets:{}};
const pairChance=Math.sqrt(result.trays[4].pair[0]*result.trays[4].pair[1]);
for(const [name,odds]of Object.entries(result.trays[4]))result.calibration.targets[name]=30*(pairChance/Math.sqrt(odds[0]*odds[1]))**.65;
writeFileSync(fileURLToPath(new URL('./odds.json',import.meta.url)),JSON.stringify(result,null,2)+'\n');
console.log('Color audit',JSON.stringify(result.colors));console.log('Target average rewards',JSON.stringify(result.calibration.targets));


}

export function roundOdds(scores,targets=[100,130,165]){
 const {states,held,choices}=numericSpace(4),maxTarget=Math.max(...targets);
 const fresh=Array.from({length:4},()=>Array.from({length:4},()=>new Float64Array(maxTarget+1)));
 for(const row of fresh)for(const f of row)f[0]=1;
 for(let hands=1;hands<=3;hands++){
  const values=Array.from({length:4},()=>Array.from({length:maxTarget+1},()=>null));
  for(let rerolls=0;rerolls<=3;rerolls++)for(let target=1;target<=maxTarget;target++){
   const scoreValues=Float64Array.from(scores,score=>score>=target?1:fresh[hands-1][rerolls][target-score]);
   if(rerolls){const prior=values[rerolls-1][target],expected=held.map(h=>h.transitions.reduce((v,[i,p])=>v+p*prior[i],0));for(let i=0;i<states.length;i++)scoreValues[i]=Math.max(scoreValues[i],...choices[i].map(h=>expected[h]));}
   values[rerolls][target]=scoreValues;fresh[hands][rerolls][target]=states.reduce((v,s,i)=>v+s.p*scoreValues[i],0);
  }
 }
 return Object.fromEntries(targets.map(t=>[t,Array.from({length:4},(_,r)=>fresh[3][r][t])]));
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1]))runAudit();
