// Scripted practice only. This module never reads or writes the saved run.
import {newRun,scoreHand,reroll,advanceRound,buy,GODS,validSave} from './engine.js?v=24';
const colors=['red','black','blue','gold'];
function preset(state,values){const next=structuredClone(state);next.dice.forEach((d,i)=>{d.value=values[i];d.color=colors[i];});return next;}
export function createPractice(){return preset(newRun(()=>.4,'casual','standard'),[4,4,1,6]);}
export function playPracticePair(state,ids){const next=scoreHand(state,ids,()=>.4);if(next.lastScore.kind!=='pair'||next.lastScore.points!==32)throw Error('Select the two 4s for this practice hand.');return preset(next,[3,3,1,6]);}
export function rerollPractice(state,held){if(held.length!==2||!held.includes(1)||!held.includes(2))throw Error('Hold the two 3s first.');const rolls=[.4,.1,.99,.6];let index=0;return reroll(state,held,()=>rolls[index++]);}
export function playPracticeTriplet(state,ids){const next=scoreHand(state,ids,()=>.4);if(next.phase!=='shop'||next.lastScore.kind!=='triplet')throw Error('Select all three 3s to clear this round.');next.offers=[{id:'practice-study',type:'upgrade',key:'pair',price:4,bought:false},...['striker','portrait'].map(key=>({id:'practice-'+key,type:'god',key,price:GODS.find(g=>g.id===key).price,bought:false}))];return next;}
export const buyPractice=(state,id)=>buy(state,id,()=>.4);
export function nextPracticeRound(state){if(state.levels.pair!==2||!['striker','portrait'].every(id=>state.gods.includes(id)))throw Error('Buy the Study and both Gods first.');return preset(advanceRound(state,()=>.4),[6,6,2,1]);}
export function playPracticeCombo(state,ids){const next=scoreHand(state,ids,()=>.4);if(next.lastScore.points!==760||next.phase!=='shop')throw Error('Select the two 6s for the final practice hand.');if(!validSave(next))throw Error('Invalid practice result.');return next;}
