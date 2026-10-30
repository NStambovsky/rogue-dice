// All sets are available immediately; Standard is retained for legacy saves and audits.
const base={dice:4,hands:3,rerolls:3,godSlots:4,actionSlots:3,faces:[1,2,3,4,5,6],colors:[1,1,1,1]};
export const SETS=[
 {id:'second-chances',name:'Second Chances',text:'Four rerolls each round. Four equally likely colors.',rerolls:4},
 {id:'deep-reserves',name:'Deep Reserves',text:'Four scoring hands each round.',hands:4},
 {id:'gilded-purse',name:'Gilded Purse',text:'Start with $18 instead of $8.',money:18},
 {id:'working-fortune',name:'Working Fortune',text:'No interest. Clear rewards: $3 per unused hand and $1 per unused reroll, replacing the normal unused-hand reward.'},
 {id:'forbidden-altar',name:'Forbidden Altar',text:'Five God slots, but only two scoring hands each round.',godSlots:5,hands:2},
 {id:'trickster',name:'Trickster’s Pouch',text:'Four action slots. Start with Carbon Copy and Borrowed Hue.',actionSlots:4,actions:['copy','colorcopy']},
 {id:'guiding-star',name:'Guiding Star',text:'Only two action slots. Study offers weight your most-played hand three times as heavily. Recent-offer cooldowns still apply.',actionSlots:2},
 {id:'haunted-bones',name:'Haunted Bones',text:'Start with Haunt. Ritual actions can appear in shops: permanent power with costs and tradeoffs.',actions:['haunt']},
 {id:'small-bones',name:'Small Bones',text:'Dice roll only 1–4; Crowned faces are 3–4. Face-setting cards and Loaded respect the four-face maximum.',faces:[1,2,3,4]},
 {id:'blood-ink',name:'Blood & Ink',text:'Natural rolls are 50% red, 50% black. Start with Blood & Ink License. Gods and Washes can override the license.',colors:[1,1,0,0],vouchers:{dichrome:1}},
 {id:'grand-bazaar',name:'Grand Bazaar',text:'Six shop offers: the extra slot alternates between an action and a different Study.'},
 {id:'wide-cast',name:'Wide Cast',text:'Start with six dice and three God slots. Still submit at most four dice; tray maximum remains eight.',dice:6,godSlots:3},
 {id:'echo-chamber',name:'Echo Chamber',text:'Clearing Antes 3 and 6 gives an Echo token, even in Casual. Opt in at a shop to duplicate one purchased Study or action.'},
 {id:'equilibrium',name:'Equilibrium',text:'After all effects, balance Chips and Mult to their average, then multiply. All score targets are doubled.'},
 {id:'crooked-dice',name:'Crooked Dice',text:'Each die receives its own random positive weights for faces and colors, fixed for the run. Inspect them before starting.'},
 {id:'prismatic',name:'Prismatic',text:'Four equally likely colors. Start with Spectrum Grant: +0.5 Mult per distinct scoring color.',vouchers:{spectrum:1}},
 {id:'ember-bag',name:'Ember Bag',text:'Natural colors: red 50%; black, blue and gold each 16⅔%.',colors:[3,1,1,1]},
 {id:'sealed-fate',name:'Sealed Fate',text:'Four dice locked to red, black, blue and gold. Choose two starting Seal cards below.'},
 {id:'shifting-sands',name:'Shifting Sands',text:'Unheld, unlocked dice must change color whenever rolled. Held and permanently locked colors stay.'}
];
export const setConfig=id=>({...base,...(SETS.find(s=>s.id===id)||{}),id:id||'standard',name:SETS.find(s=>s.id===id)?.name||'Standard'});
export function weightedIndex(weights,r=Math.random){let x=r()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<weights.length;i++){x-=weights[i];if(x<0)return i;}return weights.length-1;}
export const distribution=(values,weights)=>values.map((v,i)=>`${v}: ${weights[i]}/${weights.reduce((a,b)=>a+b,0)} (${(weights[i]/weights.reduce((a,b)=>a+b,0)*100).toFixed(1)}%)`).join(' · ');
