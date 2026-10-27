# Rogue Dice

An original, mobile-friendly dice-building roguelike by Noah Stambovsky. Inspired by the build-and-shop rhythm of poker roguelikes, with its own dice rules, interface, names, and effects.

Play: https://www.noahstambovsky.com/rogue-dice/

## The run

Start with four red/black six-sided dice, $8, four Dice God slots, and three action-card slots. Beat 24 rounds across eight Antes. Every round has three scoring hands and three shared rerolls unless increased by vouchers. Initial dice and dice after each scored or burned hand roll for free. Score does not carry between rounds. Missing the target after the last hand ends the run.

Only these selected groups score:

- **Pair:** exactly two equal values. Base 12 Chips × 2 Mult.
- **Triplet:** exactly three equal values. Base 24 Chips × 3 Mult.
- **Run:** three to six distinct sequential values, no wrap. Base 18 Chips × 3 Mult; each die beyond the third adds +12 Chips and +1 Mult.

Selected dice add their pip values and permanent die Chip bonuses. If all selected dice have the same effective color, add +2 Mult. Upgrades add +12 base Chips and +1 base Mult per level. Additive Gods apply before multiplicative Gods; the final score is floored once. Four-of-a-kind, full houses, two-pair selections, and single dice are not scoring hands, but valid subsets can be selected.

Select dice by tapping them. Hold selected dice to preserve their values on rerolls. Holds and selection are separate. Scoring or burning a hand clears both and rolls the entire tray. Find Best Hand exhaustively evaluates all subsets (at most 255 for an eight-die tray).

## The market

Clear a round to earn $6/$7/$8 depending on the round within the Ante, $2 per unused hand, and $1 interest per $5 held (capped at $5). Shop offers include two randomly selected Gods not already equipped, each of the three hand upgrades, two different action cards, and one non-maxed voucher. Refresh costs $2 and increases by $1 each use, resetting each round. Items can only be purchased once per offering. There are no real-money transactions.

Thirteen **Dice Gods** affect scoring, income, colors, or tray size while equipped. The Echo grows +Mult when Pairs are scored while equipped; growth persists for the run if sold and reacquired. The Red Queen changes effective colors without destroying original die colors. The Sixth Finger adds one identifiable die while equipped; selling it removes that die, including any upgrades on it. Gods sell only in the market for half price rounded down.

Five **actions** are consumed on use:

- Six Appeal sets one die to 6 for the current roll.
- Second Wind rerolls unheld dice at no reroll cost.
- Blood & Ink permanently switches one die’s original red/black color.
- Gold Leaf permanently adds +6 scoring Chips to one die.
- Loaded permanently adds +1 to a die’s roll result, capped at six, with a maximum +2 load. It also adds +1 to the current value immediately. This intentionally increases the chance of sixes.

“Permanent” means for the current run. Vouchers add up to three dice without taking God slots, up to two extra hands, up to two extra rerolls, or one fifth God slot. With The Sixth Finger, the maximum tray is eight dice.

## Engineering

No build, dependencies, backend, or API keys. Original CSS dice and card visuals. Google Fonts is optional; system fallbacks remain usable offline after assets are available. The app stores its active run, selected dice, and holds locally in the browser. Unsupported/corrupt saves start a new run. The engine is pure and accepts injectable randomness; the browser uses `crypto.getRandomValues`.

```sh
npm test
npm start
```

Open http://localhost:8767. `engine.js` implements rules and transactions. `app.js` handles the UI and automatic local saving. `test/engine.test.mjs` covers scoring, color bonuses, valid subsets, shop limits, God effects, permanent changes, rerolls, save validation, failure, and 24-round completion.

## Deployment

Push this source to GitHub before publishing. Copy only `index.html`, `style.css`, `engine.js`, `app.js`, and `icon.svg` to `rogue-dice/` in the personal website’s full public bundle. Add its card in `projects.html`, push the website integration, then deploy the full bundle to Cloudflare Pages project `noahstambovsky`, production branch `main`. Preserve all existing public pages and apps; Direct Upload replaces a whole deployment. Exclude source tests, docs, `.git`, and dependencies from the upload.

## Validation

29 automated engine checks. Browser checks include scoring into the market, buying a God/upgrade/action, advancing to the next round, holding/rerolling, save restoration, consuming an action, rules/restart dialogs, and phone/desktop layouts. A simple strategy was also exercised over 100 seeded natural runs to sanity-check the late-game curve; this is a tuning aid, not a guarantee of human win rates.
