# Rogue Dice: probability and balance

## Rolling-color update — October 29, 2026

Fresh runs now sample four colors independently, including on unheld rerolls and full-tray rolls. Holds keep value and color. Permanent paint locks color; Gods, palette licenses and round Washes retain their existing precedence. Across all 256 four-color starting trays, 52 contain at least three matching colors: **20.3125% Color Pact availability**. Numeric hand odds below remain exact, but fixed-color payout and color-chase tables below describe the historical calibration, not the new joint value/color reroll strategy. Rerolling to chase values can now lose an unlocked color combo. No base rewards changed in this test release.

Existing saves retain their prior colors as locked, preserving permanent paint that older saves did not track separately. New evolution branches exist for Tide, Crown, Prism and Trinity; each needs five relevant committed hands.


This edition calibrates rewards against exact fair-d6 probabilities, then adjusts for fixed-color setup, shared rerolls, and build synergies. It is a reproducible baseline, not a claim that every future build has identical value.

## Odds of finding a hand

Four fair, unloaded dice; any legal subset of at most four can be submitted. Hand events overlap: a Quad also provides a Triplet and Pair. Each reroll column follows an optimal hold strategy dedicated to that one target and permits stopping once found. These are target-availability probabilities, not probabilities that the target is the highest scoring hand.

| Available hand | Initial roll | After 1 dedicated reroll | After 3 dedicated rerolls |
|---|---:|---:|---:|
| Pair | 72.22% | 92.28% | 99.40% |
| Run of 3+ | 27.78% | 57.58% | 88.73% |
| Triplet | 9.72% | 31.52% | 65.41% |
| Two Pair | 6.94% | 19.74% | 43.43% |
| Run of 4 / Prism Run | 5.56% | 18.95% | 47.38% |
| Quads | 0.46% | 3.87% | 18.29% |

The game gives three rerolls **shared across the whole round**, not three per hand. Spending all three chasing Quads leaves none for later hands. The round model below accounts for that correctly.

## How rewards were chosen

1. Anchor a mixed-color Pair near 30 points including pips. Pair is the dependable common hand.
2. Use the geometric mean of initial and one-reroll target chances as a difficulty index. One reroll per hand is a useful shared-budget benchmark, not a rule requiring equal allocation.
3. Set an approximate target: **30 × (Pair difficulty index / hand difficulty index)^0.65**. The exponent is a design choice that rewards rarity without inverse-probability jackpots. The exact odds are mathematical; this risk premium is a tunable balance policy.
4. Choose readable base Chips/Mult near that average. Validate the actual engine over all 1,296 ordered four-die rolls, including pips and the Prism Run that already comes naturally with four starting colors. All six current conditional averages are within 8% of their target.

| Available hand | Target mean | Previous mean | New mean |
|---|---:|---:|---:|
| Pair | 30 | 30.45 | 30.45 |
| Run of 3+ | 47.7 | 86.4 | 50.4 |
| Triplet | 81.62 | 103.5 | 85.5 |
| Two Pair | 106.01 | 114 | 102 |
| Run of 4 / Prism Run | 115.5 | 420 | 112 |
| Quads | 434.02 | 310 | 430 |

Means select the highest-scoring eligible subset for that named hand, conditional on it being present. A Run of 3+ in the odds table includes rolls containing a four-die Run; the run3 score column measures the best three-die Run subset. These are average final hand scores, **not** base Chips × Mult. No Gods, Studies, die modifications, vouchers or bosses are included in this table. These probability-calibrated bases remain unchanged by the ordered-chain edition.

The previous four-color Run averaged 420 despite being easier to chase than Two Pair after enough rerolls. Its automatic Prism bonus was charging rarity twice: the starting tray already has four different colors. The new four-color Run averages 112 versus Two Pair’s 102. Quads rise from 310 to 430. Pair stays at its already-reduced baseline.

## Base scores and Study gains

| Hand | Base Chips × Mult | Chips per Study | Mult per Study |
|---|---:|---:|---:|
| Pair | 8 × 2 | +6 | +0.5 |
| Run | 6 × 3 | +8 | +0.5 |
| Triplet | 18 × 3 | +12 | +1 |
| Two Pair | 20 × 3 | +14 | +1 |
| Quads | 72 × 5 | +20 | +1.5 |
| Color Pact | 8 × 1.5 | +6 | +0.5 |
| Highest Die | 0 × 1 | +2 | +0.25 |

A fourth Run die adds +4 base Chips. Pure Run adds +6 Chips and ×1.25 Mult; Prism Run adds +4 Chips and +1 Mult; Twin Pacts adds +8 Chips and +1 Mult. Combo additions precede multipliers. Glass Ceiling weakens Pure Run to ×1.125. Run Studies also improve the much more common three-die Run, so their gains are gentler than Two Pair’s. Higher matching ranks are excluded because they cannot be submitted under the four-die cap.

Highest Die stays weak despite its restricted availability: it is a guaranteed fallback when no normal hand exists, not a rare target to chase for a jackpot.

## Color setup is not roll probability

Colors belong to dice and do not reroll. A natural starting tray cannot form Color Pact or Pure Run. After three dice share a color, Color Pact is guaranteed regardless of the numbers. A monochrome God occupies a slot and costs money; permanent Seals require shop access, money and action-card opportunities; Washes spend an action for a round. Those setup costs deserve a useful floor, but not a fictitious rare-color-roll jackpot.

A four-die monochrome Color Pact averages **about 77 points** (76.75 after score flooring) before upgrades, compared with 120 previously (the plain four-die Pact formula including pips and the matching-color bonus; a better numerical hand is scored instead when available). Pact Studies grow +6 Chips/+0.5 Mult rather than +12/+1. Numerical same-color hands and Pure Run still offer upside.

Exact identity-aware fixed-paint checks:

- Starting red/black/blue/gold: Pact impossible; Prism Run shares the four-die Run odds.
- Two of each of two colors: Twin Pacts starts at 2.31%, reaching 26.53% after three dedicated optimal rerolls. Pact remains impossible.
- Three matching colors: Pact guaranteed; Pure Run begins at 11.11% and reaches 61.26% after three dedicated rerolls.
- Monochrome: Pact guaranteed; Pure Run uses ordinary Run odds and Twin Pacts uses Two Pair odds.

Kaleidoscope is reduced to +1 Mult per distinct scored color, and Spectrum Grant to +0.5 per color. The four-color start otherwise made those bonuses unusually large for almost every ordinary hand. Color-changing Gods and paint still preserve their setup utility and opportunity costs.

## Ordered chains and evolution

The current edition adds left-to-right God order, Striker/Refrain/Resonator die-repeat chains, Oath’s reroll tradeoff, and earned two-choice evolutions on Echo, Wayfarer, Ember and Kaleidoscope. Order and player choices now affect build payoffs; the unbuilt probability and whole-round tables still apply. The spot checks below use the listed rack order and no evolution, rather than optimizing all permutations. Copies replay immediate effects only, not growth, and are finite. New evolutions provide earned payoff beyond this base-score calibration; their full run-level balance is not claimed to be solved by these tables.

## God interaction spot checks

The following are means of the best available hand across all 1,296 initial rolls. They are useful stress checks, not equal-cost or full-run comparisons. pairGods has Twins followed by Echo with +5 already earned growth; runGod has Wayfarer; tripletGod has Three Fates; fourColors has Kaleidoscope; monochrome has Red Queen. Other profiles have no Gods. Numbers do not include future Echo growth or rerolls.

| Profile | Before | After |
|---|---:|---:|
| bare | 75.25 | 48.19 |
| pairGods | 245.37 | 157.83 |
| runGod | 139.92 | 82.64 |
| tripletGod | 94.44 | 64.03 |
| fourColors | 210.45 | 98.35 |
| monochrome | 204.4 | 117.66 |

Color profile category statistics in scores.json reflect the category the app selects when a selection qualifies in several ways; a Pact can be overshadowed by a stronger numerical hand. Use odds.json for underlying availability, rather than treating those winning-category counts as color probabilities.

## Whole-round checks with the actual shared budget

Exact optimal play, three scoring hands, the indicated total shared rerolls, fair dice, starting colors, no Gods or upgrades. Scoring rolls the whole tray fresh for free. The solver chooses when to score versus hold/reroll; it does not simply repeat a per-hand chance three times.

| Target | 0 shared rerolls | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| 100 | 74.37% | 91.21% | 97.27% | 99.21% |
| 130 | 53.41% | 75.40% | 87.99% | 94.46% |
| 165 | 31.71% | 54.85% | 72.55% | 84.30% |

The opening 100-point target remains forgiving under optimal play. The 130/165 opening-ante targets increasingly reward reroll decisions and early shop improvements. This release keeps targets unchanged. These are mathematical optimal-policy rates; human play, shop choices, bosses and later rounds differ.

## Larger trays and limits

| Tray dice | Pair, initial | Quads, initial | Quads, after 3 dedicated rerolls |
|---|---:|---:|---:|
| 4 | 72.22% | 0.46% | 18.29% |
| 5 | 90.74% | 2.01% | 44.80% |
| 6 | 98.46% | 5.22% | 67.95% |
| 7 | 100.00% | 10.58% | 83.88% |
| 8 | 100.00% | 18.33% | 92.99% |

Extra dice intentionally improve hand availability as a purchased advantage. Scores do not shrink dynamically as your build improves. Extra-die rarity, cost, the four-die submission cap, and slot opportunity costs remain. Loaded dice, value actions, extra resources, and boss handicaps are excluded from fair-die odds and can change them substantially. No claim is made that every possible God/action combination has been solved.

## Reproduce and verify

Run `npm run balance` to regenerate `balance/odds.json`, `balance/scores.json`, and this file. The scripts need no npm packages; the scoring comparison requires Git and local history containing the baseline commit. Numerical odds use exact multinomial enumeration and optimal-hold Bellman dynamic programming; color checks use a separate identity-aware solver. The round solver optimizes over the actual shared resources. Before/after scoring compares the current engine with source commit `ba6539e` from local Git history.

Run `npm test` for closed-form probability cross-checks, ordered-roll engine enumeration, agreement between independent identity/multiset solvers, reward bands, shared-resource invariants, save compatibility and gameplay regressions. Existing run progress and levels are retained; future scores use this balance edition.
