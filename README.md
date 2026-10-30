# Rogue Dice

Original mobile-friendly dice-building roguelike by Noah Stambovsky.

Play: https://www.noahstambovsky.com/rogue-dice/

See [RULES.md](RULES.md) for the complete rulebook, examples, tutorial, and Casual/Hard target maps.

## Current edition

- Four starting d6 dice: one each of red, black, blue, and gold.
- A separate fixed four-dice submission cap, regardless of tray size.
- Pair, Two Pair, Triplet, Quads, Runs of 3–4, and Color Pacts of 3–4.
- Highest Die fallback if no other legal hand exists, with intentionally weak +2 Chips / +0.25 Mult Studies.
- Pure Run, Prism Run, and Twin Pacts combo bonuses, using existing Run/Two Pair Studies and Gods.
- Automatic selection of the strongest qualifying hand and legal subset search.
- 40 Dice Gods, 15 functional vouchers, and 21 functional action cards.
- Smaller five-offer markets with one randomized Study and recent-offer cooldowns. Foresight can add one God option.
- Weighted legendary extra-die offers, first available after Ante 1, with higher and escalating costs.
- Exact numerical odds for trays of 4–8, optimal-hold odds for 0–3 dedicated rerolls, fixed-color combo odds, and exact three-hand shared-reroll opening-round checks underpin scores. See [BALANCE.md](BALANCE.md); reproduce with `npm run balance`.
- Pair has 8 base Chips ×2 Mult, +6 Chips / +0.5 Mult Studies, +1 same-color Mult, smaller Pair multipliers, and slower Echo growth. The Hermit supports a four-die tray.
- Echo growth resets on sale and on rebuy.
- Active Gods fire in configurable left-to-right rack order. Touch controls and desktop drag reorder the rack; the preview follows the same rules.
- Striker/Refrain/Resonator enable bounded die-repeat chains; Oath trades a reroll for ×2 Mult. Replayed effects never duplicate permanent growth.
- Echo, Wayfarer, Ember and Kaleidoscope earn visible progress toward two-choice evolutions after five relevant hands. Sale resets evolution; schema-7 migration retains saved runs and rack order.
- On-table scoring driven by exact engine steps: lifting dice, glowing Gods, distinct +Mult/×Mult effects, rising optional native audio, round-score transfer, target break, and payout count. Full/Instant speed and separate sound preferences persist. A hand commits once before the visual sequence; skipping, fast-forwarding, hiding the tab, and reloading cannot score twice.
- Casual linear targets without bosses; Hard escalating targets with bosses on Antes 3 and 6 and post-boss scale jumps. A saved d20 draw selects one of 20 handicaps on entry, avoiding repeats; resources and reveal acknowledgement apply once.
- Inspectable color counts and provenance; four monochrome Gods plus The Divide, mutually exclusive palette licenses, varied-color rewards, four permanent Seals, and four round-long Washes. Temporary paint overrides Gods and licenses without erasing originals.
- Saved-run migration preserves existing trays and builds. Existing trays retain their three or four base dice; new runs start with four. Ghost Echo growth is cleared if the God is no longer owned.
- Compact iPhone SE landscape gameplay, with inspect dialogs for cards and effects.

## Run locally

No build, dependencies, backend, or API keys.

```sh
npm test
npm start
```

Open http://localhost:8767. `engine.js` owns rules, transactions, weighted markets, save migration, and scoring traces. `bosses.js` defines twenty handicaps and saved-draw selection; `presentation.js` handles table effects, Web Audio, two speed modes, and cancellation. `catalog.js` contains all card definitions and rarity weights. `app.js` handles the interface, preferences, and automatic local saving. System font fallbacks work if Google Fonts is unavailable.

Tests cover rules, cap enforcement, scoring, Highest Die, all effect families, shop economics and cooldowns, sampled rarity, Echo resale, save migration, modes/bosses, and complete runs. Browser QA checks scoring animations and skip safety, shop transactions, colors, cap enforcement, collection browsing, and small-screen layouts.

## Deploy

Push source to GitHub first. Copy these eight public files to `rogue-dice/` in the complete current website bundle: `index.html`, `style.css`, `engine.js`, `catalog.js`, `bosses.js`, `presentation.js`, `app.js`, `icon.svg`. Commit the site integration, then deploy the complete public bundle to Cloudflare Pages project `noahstambovsky`, production branch `main`. Preserve all other site pages and apps. Do not upload tests, source docs, dependencies, or `.git`.

## Presentation and boss QA

130 automated checks cover rules, all boss-effect families, saved draws, preference migration and timing presets. Browser QA verifies on-table step order, clear/payout events, sound controls, slower Full/Instant behavior, mid-sequence reload/fast-forward single-commit safety, persistent d20 reveal, and SE viewports down to 568×232. Native Web Audio starts only on a user gesture when sound is enabled. No audio files or copied game assets are used. Reduced-motion preferences suppress flying/shaking effects.

## Original pixel art theme

The table uses original SVG pixel portraits and a locally hosted OFL Pixelify Sans font. Deploy the assets directory alongside the eight public game files; font licensing is included in assets/font-license.txt. Rebuild portraits with `node tools/build-art.mjs`. The visual theme preserves existing saved runs and scoring.

## Rolling colors and active vouchers

Fresh dice roll values and colors independently. Held dice preserve both; Seals and Blood & Ink lock a die’s color for the run. Washes/Gods/licenses mask underlying paint in the usual order. Vouchers beside Stakes map lists only owned vouchers and purchased levels. Eight Gods now have two evolution paths each. Save schema 8 migrates older dice to locked colors to preserve prior permanent paint; begin a new run to try the rolling palette.

## Build variety expansion — October 29, 2026

52 Gods, 29 actions, 21 vouchers. New strategies support Quads, Color Pacts, locked versus rolling colors, crafted dice, small hands, and conditional retriggers. Four Pillars and Pactkeeper add two evolution branches each (ten evolving Gods total). Markets still normally show five offers, with one Study; extra dice retain their legendary weights and existing caps. Use Card collection for all effects and Vouchers for purchased upgrades. Schema 9 fills new voucher fields with zero while preserving schema-8 rolling/locked colors, money and evolution paths.

## Unlocked Dice Sets and Hard rebalance — October 30, 2026

New run offers all 19 dice sets immediately, in either mode. Inspect exact per-die face/color weights before starting and through Set during play. Sealed Fate lets you choose two starting Seals; Echo Chamber adds optional shop duplication tokens; Haunted Bones adds three Ritual actions. Set metadata, weighted profiles and enhancements save in schema 10; prior runs migrate to Standard and retain their dice, purchases and evolution paths.

Portrait, Beacon, Tribune and Conductor bring the catalog to 56 Gods. Striker is common and gives two additional first-die triggers. Crowned dice use their top two natural faces. Retriggers replay eligible die effects, including Portrait, permanent Radiance and Haunted Chips, without recursively firing other retrigger Gods. Wayfarer and Pactkeeper grow with qualifying committed hands. Four Pillars evolves after three Quads; prior progress is clamped safely while retaining chosen paths.

Hard Ante bases are 100, 220, 450, 900, 1800, 3600, 7200, 14000 with stage factors 1/1.3/1.65 and boss factor 1.8; the extra post-boss doubling is gone. Equilibrium doubles targets. First/second boss targets are 810/6480; final target is 23100. Iron Hand costs one starting reroll; Hush and Three’s Company restrict only the first scoring hand. Glass Ceiling reduces multiplier bonuses by 25%.

`npm test` includes real, earned Hard victories alongside unit/regression checks. Reproduce the full 760-run audit with `node balance/full-runs.mjs 20 '' hard,casual`. The shop policy uses counterfactual estimates from a separate random source, never future game rolls or offers. Actual purchases use earned funds; actual play never injects dice results, Gods, or upgrades. `balance/full-run-results.json` records every set/mode summary and up to three full winning traces per combination. These are small-sample automated-policy results, not player win rates.

Deploy **sets.js** as well as the original public modules and assets directory.

## Selected-die inspector

Selecting a die shows its current face/color, held status and permanent enhancements. A Crowned callout appears whenever the selection contains a Crowned die and identifies which dice qualify. Crowned means the top two natural faces (5–6 on d6, 3–4 on d4); it has no innate score bonus. Full details lists each selected die’s color overrides, loading, Haunted/Radiant effects and exact underlying weights. On portrait phones the summary appears beneath the dice; landscape and desktop use the side panel. Selection, holding and clearing update the details immediately.
