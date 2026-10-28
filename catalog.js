export const GODS=[
 {id:'striker',name:'The Striker',symbol:'⚒',color:'red',price:8,rarity:'uncommon',text:'At this God’s position, retrigger the first scoring die once: repeat its pips and permanent Chip bonus. Does not replay other Gods.'},
 {id:'resonator',name:'The Resonator',symbol:'◎',color:'violet',price:7,rarity:'uncommon',text:'At this position, gain +2 Mult per die retrigger that has already happened in this hand. Put retrigger Gods to its left.'},
 {id:'refrain',name:'The Refrain',symbol:'↶',color:'teal',price:10,rarity:'rare',text:'Repeat the preceding active God’s immediate scoring effects once, at this position. Skips paint and inactive Gods. Never duplicates permanent growth or evolution progress.'},
 {id:'oath',name:'The Oath',symbol:'♜',color:'gold',price:11,rarity:'rare',text:'Score ×2 Mult at this position, but start rounds with one fewer normal reroll while equipped. Selling restores future-round capacity.'},
 {id:'echo',name:'The Echo',symbol:'Ⅱ',color:'violet',price:8,text:'Scoring Pair grows this God’s +Mult by 0.5; Two Pair grows it by 1. Growth resets when sold.'},
 {id:'scarlet',name:'The Red Queen',symbol:'♛',color:'red',price:12,rarity:'rare',text:'All dice count as red while this God is equipped. Original colors return when sold. One color-changing God at a time.'},
 {id:'ladder',name:'The Wayfarer',symbol:'↗',color:'teal',price:7,text:'Runs gain +2 Mult for every die in the Run.'},
 {id:'trinity',name:'Three Fates',symbol:'Ⅲ',color:'violet',price:8,text:'Triplets score ×3 Mult.'},
 {id:'twins',name:'The Twins',symbol:'Ⅱ',color:'gold',price:7,text:'Pair scores ×1.5 Mult; Two Pair scores ×2 Mult.'},
 {id:'midas',name:'The Alchemist',symbol:'✦',color:'gold',price:6,text:'Earn $2 whenever you score a hand with all dice the same color.'},
 {id:'fortune',name:'First Light',symbol:'☀',color:'gold',price:7,text:'Your first scoring hand each round scores ×2 Mult.'},
 {id:'ember',name:'The Ember',symbol:'✹',color:'red',price:6,text:'Every red die in your scored hand adds +8 Chips.'},
 {id:'obsidian',name:'The Night',symbol:'☾',color:'teal',price:7,text:'Every black die in your scored hand adds +1 Mult.'},
 {id:'relic',name:'Old Bones',symbol:'☷',color:'violet',price:7,text:'Adds +5 Chips for every hand scored this run, including the current hand.'},
 {id:'finger',name:'The Sixth Finger',symbol:'✋',color:'teal',price:16,weight:.35,rarity:'legendary',text:'Rare: adds one extra die to your tray while equipped. Takes a God slot.'},
 {id:'bounty',name:'The Wanderer',symbol:'⌁',color:'red',price:6,text:'Earn $3 every time you score a Run.'},
 {id:'moon',name:'Blood Moon',symbol:'◉',color:'red',price:8,text:'Hands with all dice the same color score ×1.5 Mult, on top of the color bonus.'},
 {id:'inkking',name:'The Ink King',symbol:'♚',color:'teal',price:12,rarity:'rare',text:'All dice count as black while equipped. Original colors return when sold. One color-changing God at a time.'},
 {id:'smallfortune',name:'Small Mercies',symbol:'Ⅰ',color:'gold',price:6,text:'Each scored 1 or 2 adds +2 Mult.'},
 {id:'giant',name:'The Colossus',symbol:'Ⅵ',color:'violet',price:7,text:'Each scored 6 adds +18 Chips.'},
 {id:'odd',name:'The Odd Saint',symbol:'Ⅲ',color:'red',price:7,text:'Each odd-valued scoring die adds +5 Chips and +1 Mult.'},
 {id:'even',name:'The Even Judge',symbol:'Ⅱ',color:'teal',price:7,text:'Each even-valued scoring die adds +5 Chips and +1 Mult.'},
 {id:'balance',name:'The Bridge',symbol:'◐',color:'teal',price:7,text:'Mixed-color hands gain +4 Mult.'},
 {id:'mirror',name:'The Looking Glass',symbol:'◇',color:'violet',price:8,rarity:'rare',text:'Same-color Pair scores ×1.25 Mult; same-color Two Pair scores ×1.5 Mult.'},
 {id:'cartographer',name:'The Long Road',symbol:'↠',color:'teal',price:8,rarity:'rare',text:'Runs of four or more dice score ×2 Mult.'},
 {id:'sentinel',name:'Last Watch',symbol:'⌛',color:'violet',price:8,rarity:'rare',text:'Your last remaining scoring hand scores ×2 Mult.'},
 {id:'pauper',name:'The Beggar',symbol:'∅',color:'gold',price:7,text:'Score ×2 Mult while holding $5 or less.'},
 {id:'banker',name:'The Treasurer',symbol:'♜',color:'gold',price:8,rarity:'uncommon',text:'Gain +1 Mult per $5 held, up to +8 Mult. Money is not spent.'},
 {id:'hermit',name:'The Hermit',symbol:'☽',color:'violet',price:7,text:'With four or fewer dice in your tray, score ×1.5 Mult.'},
 {id:'chorus',name:'The Chorus',symbol:'≋',color:'teal',price:7,text:'Scoring every die in your tray gives ×1.5 Mult.'},
 {id:'prism',name:'The Prism',symbol:'△',color:'red',price:7,text:'All-one-color hands gain +10 Chips per scoring die.'},
 {id:'rainmaker',name:'The Rainmaker',symbol:'☂',color:'gold',price:6,text:'Scored Triplets earn $4.'},
 {id:'scavenger',name:'The Scavenger',symbol:'♧',color:'gold',price:5,text:'Earn $1 whenever you burn a hand.'},
 {id:'undertow',name:'The Undertow',symbol:'≈',color:'teal',price:7,text:'Each reroll used this round adds +2 Mult to your scoring hands. Free rerolls count.'},
 {id:'tide',name:'The Tide',symbol:'≋',color:'teal',price:7,text:'Every blue die in your scored hand adds +8 Chips.'},
 {id:'sapphire',name:'The Blue Regent',symbol:'♜',color:'teal',price:12,rarity:'rare',text:'All dice count as blue while equipped. Original colors return when sold. One color-changing God at a time.'},
 {id:'aurum',name:'The Golden Sovereign',symbol:'♛',color:'gold',price:12,rarity:'rare',text:'All dice count as gold while equipped. Original colors return when sold. One color-changing God at a time.'},
 {id:'divide',name:'The Divide',symbol:'◐',color:'red',price:9,rarity:'uncommon',text:'Restrict the tray to red and black: gold → red, blue → black. One color-changing God at a time. Original colors return when sold.'},
 {id:'kaleidoscope',name:'The Kaleidoscope',symbol:'❖',color:'violet',price:8,rarity:'uncommon',text:'Each distinct effective color in your scoring hand adds +1 Mult. Four different colors add +4 Mult.'},
 {id:'crown',name:'The Crown',symbol:'♕',color:'gold',price:7,text:'Every gold die in your scored hand adds +1 Mult.'}
];
export const ACTIONS=[
 {id:'six',name:'Six Appeal',symbol:'⚅',color:'violet',price:3,text:'One use: set one selected die to 6 for this roll.'},
 {id:'reroll',name:'Second Wind',symbol:'↻',color:'teal',price:3,text:'One use: reroll all unheld dice without spending a reroll.'},
 {id:'dye',name:'Blood & Ink',symbol:'◐',color:'red',price:3,text:'Permanently cycle one selected die’s original color: red → black → blue → gold.'},
 {id:'gild',name:'Gold Leaf',symbol:'✦',color:'gold',price:4,text:'Permanently add +6 Chips to one selected die whenever it scores.'},
 {id:'load',name:'Loaded',symbol:'＋',color:'gold',price:5,text:'Permanently add +1 to one selected die’s future rolls, capped at 6. Maximum +2 per die.'},
 {id:'one',name:'Snake Eyes',symbol:'⚀',color:'violet',price:3,text:'Set one selected die to 1 for the current roll.'},
 {id:'nudge',name:'Gentle Push',symbol:'↑',color:'teal',price:3,text:'Increase one selected die by 1 for this roll, capped at 6.'},
 {id:'invert',name:'Turnabout',symbol:'⇄',color:'violet',price:3,text:'Flip one selected die: 1↔6, 2↔5, 3↔4 for this roll.'},
 {id:'copy',name:'Carbon Copy',symbol:'❖',color:'violet',price:4,rarity:'uncommon',text:'Select two dice in order. Copy the first die’s value onto the second for this roll.'},
 {id:'red',name:'Red Seal',symbol:'●',color:'red',price:3,text:'Permanently make one selected die’s original color red.'},
 {id:'black',name:'Black Seal',symbol:'●',color:'teal',price:3,text:'Permanently make one selected die’s original color black.'},
 {id:'blue',name:'Blue Seal',symbol:'●',color:'teal',price:3,text:'Permanently make one selected die’s original color blue. Temporary paint and color-changing Gods can still mask it.'},
 {id:'gold',name:'Gold Seal',symbol:'●',color:'gold',price:3,text:'Permanently make one selected die’s original color gold. Temporary paint and color-changing Gods can still mask it.'},
 {id:'veil-red',name:'Red Wash',symbol:'◌',color:'red',price:2,text:'Make one selected die count as red until the round ends, including rerolls and later hands. Overrides Gods and palette vouchers. Original color stays intact.'},
 {id:'veil-black',name:'Black Wash',symbol:'◌',color:'violet',price:2,text:'Make one selected die count as black until the round ends, including rerolls and later hands. Overrides Gods and palette vouchers. Original color stays intact.'},
 {id:'veil-blue',name:'Blue Wash',symbol:'◌',color:'teal',price:2,text:'Make one selected die count as blue until the round ends, including rerolls and later hands. Overrides Gods and palette vouchers. Original color stays intact.'},
 {id:'veil-gold',name:'Gold Wash',symbol:'◌',color:'gold',price:2,text:'Make one selected die count as gold until the round ends, including rerolls and later hands. Overrides Gods and palette vouchers. Original color stays intact.'},
 {id:'rally',name:'Extra Breath',symbol:'↻',color:'teal',price:4,text:'Gain one normal reroll this round. Cannot be used while rerolls are locked.'},
 {id:'hand',name:'Last Chance',symbol:'＋',color:'red',price:5,rarity:'rare',text:'Gain one scoring hand for this round.'},
 {id:'surge',name:'Overcharge',symbol:'ϟ',color:'gold',price:4,text:'Your next scoring hand gains +30 Chips. Persists through burns until scored.'},
 {id:'blessing',name:'Fortune’s Favor',symbol:'✧',color:'violet',price:4,text:'Your next scoring hand gains +3 Mult. Persists through burns until scored.'}
];

export const VOUCHERS=[
 {id:'dice',name:'A Bigger Fist',symbol:'⚄',color:'gold',price:18,max:4,weight:.25,rarity:'legendary',text:'Rare: permanently add one die. First available after Ante 1. Each repeat costs $8 more.'},
 {id:'hands',name:'Another Chance',symbol:'＋',color:'red',price:12,max:2,text:'Start each future round with one more scoring hand.'},
 {id:'rerolls',name:'Loaded Pockets',symbol:'↻',color:'teal',price:11,max:2,text:'Start each future round with one more normal reroll.'},
 {id:'slots',name:'A Fifth Altar',symbol:'✧',color:'violet',price:14,max:1,rarity:'rare',text:'Unlock a fifth Dice God slot.'},
 {id:'discount',name:'Friendly Merchant',symbol:'¤',color:'gold',price:10,max:2,text:'All future shop items cost $1 less per level, minimum $1.'},
 {id:'interest',name:'Nest Egg',symbol:'◎',color:'gold',price:9,max:2,text:'Raise the maximum interest payout by $2 per level.'},
 {id:'rewards',name:'House Stipend',symbol:'♢',color:'gold',price:10,max:2,text:'Each cleared round pays an extra $2 per level.'},
 {id:'study',name:'Scholarship',symbol:'▤',color:'teal',price:9,max:2,text:'Hand-upgrade cards cost $1 less per level, minimum $1.'},
 {id:'actions',name:'Hidden Sleeve',symbol:'▣',color:'violet',price:12,max:1,rarity:'uncommon',text:'Unlock a fourth action-card slot.'},
 {id:'foresight',name:'Foresight',symbol:'◉',color:'violet',price:11,max:1,rarity:'uncommon',text:'Each future market refresh offers one additional Dice God.'},
 {id:'salvage',name:'Better Bargain',symbol:'↔',color:'gold',price:10,max:1,text:'Sell equipped Gods for 65% of their listed price, rounded down.'},
 {id:'dichrome',name:'Blood & Ink License',symbol:'◐',color:'red',price:10,max:1,rarity:'uncommon',text:'For this run, gold counts as red and blue counts as black. Restricts natural colors to red/black. Mutually exclusive with Ocean & Ore. Gods and round Washes override it.'},
 {id:'oceanore',name:'Ocean & Ore License',symbol:'◐',color:'teal',price:10,max:1,rarity:'uncommon',text:'For this run, red counts as gold and black counts as blue. Restricts natural colors to blue/gold. Mutually exclusive with Blood & Ink License. Gods and round Washes override it.'},
 {id:'spectrum',name:'Spectrum Grant',symbol:'❖',color:'violet',price:11,max:1,rarity:'uncommon',text:'Each distinct effective color in your scored hand adds +0.5 Mult. Rewards keeping a varied palette.'},
 {id:'polish',name:'Polishing Cloth',symbol:'✦',color:'teal',price:10,max:1,text:'At each new Ante, permanently add +1 scoring Chip to every die currently in your tray.'}
];
export function rarityOf(item){return item.rarity||'common';}
export function weightOf(item){return item.weight??({common:5,uncommon:2.5,rare:1,legendary:.35}[rarityOf(item)]);}
export function weightedPick(items,r=Math.random){const total=items.reduce((n,item)=>n+weightOf(item),0);let value=r()*total;for(const item of items){value-=weightOf(item);if(value<0)return item;}return items.at(-1);}


export const EVOLUTIONS={
 echo:{goal:5,label:'Pair / Two Pair hands scored',options:[
  {id:'resonance',name:'Deep Resonance',text:'Future Pair growth doubles to +1 Mult; Two Pair growth becomes +2. Existing growth is retained.'},
  {id:'harmonics',name:'Rich Harmonics',text:'Keep normal growth. At Echo’s position, Pair adds +6 Chips and Two Pair adds +12 Chips.'}
 ]},
 ladder:{goal:5,label:'Runs scored',options:[
  {id:'footpath',name:'The Footpath',text:'Keep Wayfarer’s normal bonus. Three-die Runs gain another +3 Mult at its position.'},
  {id:'highroad',name:'The High Road',text:'Keep Wayfarer’s normal bonus. Four-die Runs also gain ×1.5 Mult at its position.'}
 ]},
 ember:{goal:5,label:'Hands scored with a red die',options:[
  {id:'furnace',name:'The Furnace',text:'Keep Ember’s +8 Chips per red die, then retrigger the first red scoring die once. Can feed Resonator and Refrain.'},
  {id:'whiteheat',name:'White Heat',text:'Ember’s bonus becomes +16 Chips per red scoring die.'}
 ]},
 kaleidoscope:{goal:5,label:'Hands scored with 3+ colors',options:[
  {id:'prismatic',name:'Prismatic Heart',text:'Kaleidoscope’s bonus becomes +2 Mult per distinct scoring color.'},
  {id:'spectrum',name:'Spectrum Crown',text:'Keep the normal color bonus. Four-color scoring hands also gain ×1.5 Mult at its position.'}
 ]}
};
