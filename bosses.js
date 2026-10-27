export const BOSS_ROUNDS=[8,17];
export const BOSSES=[
 {id:'pale',name:'The Pale House',text:'The matching-color +2 Mult bonus is disabled.'},
 {id:'lock',name:'The Iron Hand',text:'Normal rerolls are locked. Second Wind still works.'},
 {id:'redfog',name:'Crimson Fog',text:'Red dice contribute no pip Chips. Permanent Chip bonuses and Gods still work.'},
 {id:'blackfog',name:'Blackout',text:'Black dice contribute no pip Chips. Permanent Chip bonuses and Gods still work.'},
 {id:'bluefog',name:'Deep Water',text:'Blue dice contribute no pip Chips. Permanent Chip bonuses and Gods still work.'},
 {id:'goldfog',name:'Fool’s Gold',text:'Gold dice contribute no pip Chips. Permanent Chip bonuses and Gods still work.'},
 {id:'lowfog',name:'Small Print',text:'Ones and twos contribute no pip Chips. Permanent Chip bonuses still work.'},
 {id:'highfog',name:'Tall Poppies',text:'Fives and sixes contribute no pip Chips. Permanent Chip bonuses still work.'},
 {id:'pairs',name:'Split Decision',text:'Pair and Two Pair base Chips, including Study gains, are halved.'},
 {id:'runs',name:'Roadblock',text:'Run base Chips, including Study gains, are halved.'},
 {id:'pacts',name:'Broken Covenant',text:'Color Pact base Chips, including Study gains, are halved.'},
 {id:'matches',name:'Crowded House',text:'Triplet and Quads base Chips, including Study gains, are halved.'},
 {id:'silence',name:'The Hush',text:'Your first equipped scoring God is silenced. Extra-die and burn-income Gods are unaffected.'},
 {id:'glass',name:'Glass Ceiling',text:'God ×Mult bonuses are reduced: ×2 becomes ×1.5, ×3 becomes ×2.'},
 {id:'study',name:'Closed Book',text:'Mult gained from Studies is halved. Base Mult and other bonuses still work.'},
 {id:'tax',name:'The Taxman',text:'God cash rewards are disabled. The ordinary round-clear payout still applies.'},
 {id:'short',name:'Short Notice',text:'Start this round with one fewer scoring hand, minimum one.'},
 {id:'thin',name:'Thin Air',text:'Start this round with two fewer normal rerolls, minimum zero.'},
 {id:'three',name:'Three’s Company',text:'You may submit at most three dice this round. Your tray size is unchanged.'},
 {id:'pressure',name:'Mounting Pressure',text:'Each previously scored hand reduces this hand’s final Mult by 10%, down to 50%.'}
];
export function bossFor(round,mode='hard',choices=null){if(mode==='casual'||!BOSS_ROUNDS.includes(round))return null;const id=choices?.[round]||(round===8?'pale':'lock');return {...BOSSES.find(b=>b.id===id),round};}
export function drawBoss(choices,round,r=Math.random){const used=new Set(Object.values(choices)),pool=BOSSES.filter(b=>!used.has(b.id));return pool[Math.min(pool.length-1,Math.floor(r()*pool.length))].id;}
