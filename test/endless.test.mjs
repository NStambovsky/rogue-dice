import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {drawBoss,isBossRound} from '../bosses.js';
const r=()=>.4;
test('existing Hard victory continues through a shop without duplicate rewards or losing the build',()=>{
 const s=E.newRun(r,'hard');s.round=23;s.phase='won';s.money=99;s.levels.pair=7;
 const n=E.continueEndless(s,r);assert.equal(s.phase,'won');assert.equal(n.phase,'shop');assert.equal(n.money,99);assert.equal(n.levels.pair,7);assert.deepEqual(n.dice,s.dice);assert.ok(n.offers.length);assert.ok(E.validSave(n));
 const next=E.advanceRound(n,r);assert.equal(next.round,24);assert.equal(next.phase,'play');assert.equal(next.score,0);assert.ok(E.validSave(E.migrateSave(JSON.parse(JSON.stringify(next)))));
 assert.throws(()=>E.continueEndless(next,r));s.mode='casual';assert.throws(()=>E.continueEndless(s,r));
});
test('endless targets accelerate, stay finite and preserve original campaign',()=>{
 assert.equal(E.targetFor(23),23100);assert.equal(E.targetFor(24),28000);assert.equal(E.targetFor(26),50400);
 let previous=E.targetFor(23);for(let i=24;i<300;i++){const target=E.targetFor(i);assert.ok(Number.isFinite(target));assert.ok(target>previous);previous=target;}
 assert.ok(E.targetFor(30)/E.targetFor(27)>E.targetFor(27)/E.targetFor(24));assert.equal(E.targetFor(26,'hard','equilibrium'),100800);
});
test('every endless ante ends in a saved boss; exhausted boss pool recycles without consecutive repeats',()=>{
 let s=E.newRun(r,'hard');s.round=23;s.phase='won';s=E.continueEndless(s,r);
 for(let round=24;round<93;round++){
  s.phase='shop';s=E.advanceRound(s,r);assert.equal(s.round,round);assert.equal(Boolean(E.activeBoss(s)),round%3===2);assert.ok(E.validSave(s));
  if(round%3===2){assert.ok(s.bossRevealPending);const id=s.bossChoices[round];assert.equal(E.activeBoss(E.migrateSave(JSON.parse(JSON.stringify(s)))).id,id);}
 }
 assert.equal(isBossRound(23),false);assert.equal(isBossRound(26),true);assert.equal(E.bossFor(26,'casual'),null);
 const choices={};for(let i=0;i<45;i++){const round=26+i*3,id=drawBoss(choices,round,r);if(i>=20)assert.notEqual(id,choices[round-3]);choices[round]=id;}assert.equal(new Set(Object.values(choices).slice(0,20)).size,20);
});
test('clearing an endless round opens another shop rather than another victory',()=>{
 const s=E.newRun(r,'hard');s.round=26;s.bossChoices[26]='tax';s.dice.forEach(d=>{d.value=6;d.color='red';});s.score=E.targetFor(26)-1;
 const n=E.scoreHand(s,[1,2,3,4],r);assert.equal(n.phase,'shop');assert.ok(E.validSave(n));assert.equal(E.advanceRound(n,r).round,27);
});
