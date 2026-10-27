# Rogue Dice — rules & tutorial

Start with **four six-sided dice** drawn from four original colors: **red, black, blue, and gold**. Your tray may eventually grow to eight dice, but you may submit **at most four dice per scoring hand**. Extra dice improve your choices, not the submission limit.

## Scoring hands

| Hand | Requirement | Base Chips | Base Mult |
|---|---|---:|---:|
| Highest Die | Fallback only when the tray has no other legal hand | 0 | 1 |
| Pair | Two equal values | 8 | 2 |
| Two Pair | Four dice: two different pairs | 20 | 3 |
| Triplet | Three equal values | 18 | 3 |
| Quads | Four equal values | 72 | 5 |
| Run | Three or four distinct consecutive values | 6 | 3 |
| Color Pact | Three or four dice of one effective color, any values | 8 | 1.5 |

A four-die Run adds +4 base Chips. Runs cannot wrap from 6 to 1. Quints and higher groups cannot be submitted under the four-die limit. A larger tray can still provide a four-die Quad subset.

Selected dice add their pip values and permanent chip bonuses. A same-color Pair adds +1 Mult; other all-one-color hands of at least two dice add +2 Mult. Gods and one-shot boosts then apply; all additive bonuses are counted before Mult multipliers. The final score is floored once.

When a selection qualifies as both a numerical hand and Color Pact, the preview uses whichever scores higher with your current levels, Gods, and boss. Find Best Hand checks all legal subsets up to four dice.

**Highest Die** automatically uses the tray’s highest face only if there is no regular hand anywhere in the tray. Its initial score is just that face value ×1, with no single-die color bonus. Study gains are calibrated too: Pair +6 Chips/+0.5 Mult; Run +8/+0.5; Triplet +12/+1; Two Pair +14/+1; Quads +20/+1.5; Color Pact +6/+0.5; Highest Die +2/+0.25. It takes many levels to become strong.

Pair is the dependable low-reward hand: **8 Chips ×2 Mult**, **+6 Chips / +0.5 Mult** per Study, and **+1 Mult** for matching colors. The Twins gives Pair ×1.5 (Two Pair still ×2); The Looking Glass gives same-color Pair ×1.25 (Two Pair still ×1.5). The Echo grows by +0.5 per Pair and +1 per Two Pair. The Hermit now works with four or fewer tray dice at ×1.5 Mult.

## Probability-based rewards

Base rewards use exact four-die odds and optimal hold/reroll calculations, with a modest rarity premium rather than inverse-probability jackpots. See [BALANCE.md](BALANCE.md) for the method, all odds, and before/after scores. Three rerolls are shared across the round. Colors are fixed; a Color Pact is a setup investment, not a rare roll. Bigger trays, paint, loaded dice, upgrades, and Gods can change your build’s odds and payoff. Rewards stay fixed rather than shrinking when your build improves.

## Combo bonuses

Combos reward the colors inside a numerical hand. They keep the original hand’s level and God triggers, with no separate Study to find. Preview and Best Hand include them automatically; see Collection → 3 Combos.

| Combo | Requirement | Extra score effects |
|---|---|---|
| Pure Run | Run of 3–4 dice, all one effective color | +6 Chips, then ×1.25 Mult |
| Prism Run | Run of four dice in four different effective colors | +4 Chips and +1 Mult |
| Twin Pacts | Two Pair with each equal-value pair matching in color | +8 Chips and +1 Mult |

Twin Pacts allows the two pairs to use different colors; all-four-one-color also qualifies and keeps its ordinary +2 Mult. Pure Run’s multiplier follows God multipliers; all combo additions precede them. Glass Ceiling weakens combo multipliers too (Pure Run becomes ×1.125). Other boss rules apply to the underlying hand normally. Temporary Washes and color-changing Gods affect eligibility. Full House still needs five dice and does not fit the four-die cap.

## Play a round

Each round starts with three scoring hands and three shared rerolls unless upgraded. Select dice, then **Hold selected** to preserve them on rerolls. Scoring selection and holds are separate. You can hold more than four dice by selecting and holding separate groups.

Reroll changes unheld dice and spends a reroll. Scoring spends a hand and gives the whole tray a fresh roll for free if the target remains unmet. Holds clear; rerolls do not replenish until the next round. Burn a hand for a fresh tray without points if desired. Reaching the target immediately clears the round; running out of hands below target ends the run.

## Scoring presentation and speed

Scoring happens on the table. Each die lifts and contributes Chips, Gods light up in the engine’s scoring order, +Mult adds to the counter, and ×Mult effects land with a stronger pulse. The chain builds in intensity, then points move into the round score. Clearing breaks the target and counts the payout into your wallet.

Choose **Full** or **Instant** beside the dice controls. Full is the default and pauses 0.65–0.85 seconds on each step, with another 0.45 seconds for multiplier hits. It no longer rushes long chains. Instant skips presentation. Saved Quick preferences become Full; saved Turbo preferences become Instant. Tap **Skip scoring** or change to Instant during a sequence to finish immediately. **Sound** is optional and saved separately. Previously saved Score FX on/off preferences migrate to Full/Instant respectively.

Your hand commits exactly once when you press Score, before presentation. Reloading, skipping, or switching away from the page cannot duplicate its points or payout. Scoring details remain available through Score breakdown. Reduced-motion preferences suppress flying and shaking.

## Build from what the market offers

A normal shop has **five offers**: two Gods, one Study, one action, and one voucher. Foresight adds one extra God offer. Recent offerings have cooldowns; the Study cannot be one of the last two offered Studies while alternatives remain. Pair Study is not guaranteed. Only hands that fit your tray and four-die cap receive Study offers.

Clearing pays a $6/$7/$8 base reward, $2 per unused hand, and $1 interest per $5 held up to $5. Vouchers can improve payouts, interest limits, prices, action capacity, God selection, resale, or permanent chip polishing. Refreshing costs $2 initially and rises by $1 each time, resetting next round.

The collection has **36 Dice Gods, 15 vouchers, and 21 action cards**. Open Rules → Card collection to inspect them. Gods use slots and work while equipped. Selling The Echo resets all its accumulated Mult; rebuying starts at zero. Selling The Sixth Finger removes its granted die, including modifications on that die.

Extra-die God/voucher offers are legendary and unavailable until Ante 2. The Sixth Finger lists at $16; A Bigger Fist starts at $18 and costs $8 more each repeat. Discounts may lower these prices. New runs can reach eight dice through rare die vouchers and/or The Sixth Finger, but extra dice do not raise the hand limit.

## Actions

Each action is consumed on successful use. Most target one selected die. Carbon Copy needs two selected in order: source, then destination. Second Wind, Extra Breath, Last Chance, Overcharge, and Fortune’s Favor need no target.

Blood & Ink cycles original colors red → black → blue → gold. Red, Black, Blue, and Gold Seals permanently set one selected die’s original color. The four Wash cards temporarily set a selected die’s effective color until the round ends, surviving rerolls, scoring hands, and reloads. A later Wash replaces the earlier one; permanent Seals still repaint the original underneath it. Gold Leaf adds permanent scoring Chips; Loaded biases rolls upward, capped at six and at +2 load per die. Overcharge and Fortune’s Favor affect the next scored hand and survive burns. Extra Breath and Last Chance add temporary resources for the current round. “Permanent” means for this run.

### Your palette and color builds

Dice keep their original colors between rolls. A four-die start includes one die in each of red, black, blue, and gold. Older saved trays retain their original paint. Tap the color summary beside the round heading for visible counts, active effects, and the original/effective color of each die.

Color priority is **round Wash → color-changing God → palette license → original paint**. This same effective color controls the die’s appearance, Color Pacts, same-color bonuses, color Gods, and color-fog bosses. Washes expire on entering the next round. Permanent Seals change original paint even when a God or Wash masks it.

Only one color-changing God can be equipped: **Red Queen** (all red), **Ink King** (all black), **Blue Regent** (all blue), **Golden Sovereign** (all gold), or **The Divide** (gold → red, blue → black). Selling it restores the underlying colors and any palette-license effect. The Hush can silence a color God if it is your first scoring God.

Choose at most one permanent palette license per run: **Blood & Ink License** maps gold → red and blue → black; **Ocean & Ore License** maps red → gold and black → blue. Licenses affect future extra dice too without deleting original colors. Gods override a license; a Wash can break its restriction for one die until the next round.

For varied builds, **The Kaleidoscope** adds +1 Mult per distinct effective scoring color, and **Spectrum Grant** adds +0.5 per distinct effective scoring color. They stack before ×Mult effects. The Tide rewards blue dice and The Crown rewards gold dice, complementing The Ember and The Night.

## Run modes

**Casual** starts at 100 and adds 100 to every next target, with no bosses. **Hard** has escalating targets. The third rounds of Antes 3 and 6 add a boss handicap; the target scale doubles afterward (×2 from Ante 4, ×4 from Ante 7).

A d20 roll selects one of twenty handicaps on boss entry. The result is saved immediately, does not change on reload, and avoids previously drawn bosses. Confirm Face the boss after reading its rule. The handicap ends after that boss round. Future boss names remain unknown until drawn. Existing saves keep their current legacy boss if already inside one. Open Stakes Map for all targets and check the shop’s next-round preview before advancing. Beat all 24 rounds across eight Antes to win.

## First-run tutorial

1. Start Casual and look at the 100-point target.
2. Tap Find Best Hand. If you roll red 4, black 4, blue 2, and gold 6, the Pair scores (8 + 4 + 4) ×2 = 32.
3. Hold the fours and reroll the other two dice to chase a Triplet. Or score the Pair and use the next free tray to keep building toward the target.
4. If no regular group exists, Score Highest Die gives a small fallback instead of forcing a zero-point burn.
5. Buy from the available market. Build around the Gods and Studies you actually see rather than assuming Pair Study will return.
6. A Color Pact of blue 1, 3, and 6 scores (8 + 10) ×3.5 = 63 before upgrades. Quads of mixed-color fours score (72 + 16) ×5 = 440.
7. Choose Full speed and enable Sound to feel each contribution, or select Instant once you know your build. In landscape, tap God/action names and Score breakdown for details without leaving the compact table.

Existing saves retain their tray, money, mode, and owned upgrades. New hand levels and voucher fields are added automatically. Existing original dice colors are preserved; start a new run to get the four-die start drawn from the full four-color palette. Gods that force a color still display that effective color.

## Target map

| Ante | Casual: rounds 1 / 2 / 3 | Hard: rounds 1 / 2 / 3 |
|---|---|---|
| 1 | 100 / 200 / 300 | 100 / 130 / 165 |
| 2 | 400 / 500 / 600 | 250 / 325 / 413 |
| 3 | 700 / 800 / 900 | 650 / 845 / 1,170 **boss** |
| 4 | 1,000 / 1,100 / 1,200 | 3,200 / 4,160 / 5,280 |
| 5 | 1,300 / 1,400 / 1,500 | 8,000 / 10,400 / 13,200 |
| 6 | 1,600 / 1,700 / 1,800 | 20,000 / 26,000 / 36,000 **boss** |
| 7 | 1,900 / 2,000 / 2,100 | 100,000 / 130,000 / 165,000 |
| 8 | 2,200 / 2,300 / 2,400 | 240,000 / 312,000 / 396,000 |

## The twenty boss handicaps

1. The Pale House — no matching-color Mult bonus (Pair +1, other hands +2).
2. The Iron Hand — normal rerolls locked; Second Wind works.
3. Crimson Fog — red pips add no Chips.
4. Blackout — black pips add no Chips.
5. Deep Water — blue pips add no Chips.
6. Fool’s Gold — gold pips add no Chips.
7. Small Print — ones and twos add no pip Chips.
8. Tall Poppies — fives and sixes add no pip Chips.
9. Split Decision — Pair/Two Pair base Chips, including Studies, halved.
10. Roadblock — Run base Chips, including Studies, halved.
11. Broken Covenant — Color Pact base Chips, including Studies, halved.
12. Crowded House — Triplet/Quads base Chips, including Studies, halved.
13. The Hush — first equipped scoring God silenced; extra-die/burn-income Gods unaffected.
14. Glass Ceiling — God and combo multiplier bonuses weakened: ×2 becomes ×1.5, ×3 becomes ×2.
15. Closed Book — Study Mult gains halved.
16. The Taxman — no God cash rewards; ordinary round payout remains.
17. Short Notice — one fewer starting scoring hand, minimum one.
18. Thin Air — two fewer starting normal rerolls, minimum zero.
19. Three’s Company — three-dice scoring cap this round; tray unchanged.
20. Mounting Pressure — each prior scored hand reduces final Mult by 10%, down to 50%.

Pip-suppression bosses retain permanent die Chip bonuses and God effects. Other modifiers explicitly name what they suppress. Bosses and their saved choices are also visible in Rules → Card collection → 20 Bosses.
