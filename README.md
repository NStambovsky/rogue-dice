# Rogue Dice

Original mobile-friendly dice-building roguelike by Noah Stambovsky.

Play: https://www.noahstambovsky.com/rogue-dice/

See [RULES.md](RULES.md) for the complete rulebook, examples, tutorial, and Casual/Hard target maps.

## Current edition

- Three starting d6 dice, drawn from red/black/blue/gold.
- A separate fixed four-dice submission cap, regardless of tray size.
- Pair, Two Pair, Triplet, Quads, Runs of 3–4, and Color Pacts of 3–4.
- Highest Die fallback if no other legal hand exists, with intentionally weak +2 Chips / +0.25 Mult Studies.
- Automatic selection of the strongest qualifying hand and legal subset search.
- 32 Dice Gods, 12 functional vouchers, and 15 functional action cards.
- Smaller five-offer markets with one randomized Study and recent-offer cooldowns. Foresight can add one God option.
- Weighted legendary extra-die offers, first available after Ante 1, with higher and escalating costs.
- Echo growth resets on sale and on rebuy.
- On-table scoring driven by exact engine steps: lifting dice, glowing Gods, distinct +Mult/×Mult effects, rising optional native audio, round-score transfer, target break, and payout count. Full/Quick/Turbo/Instant speed and separate sound preferences persist. A hand commits once before the visual sequence; skipping, fast-forwarding, hiding the tab, and reloading cannot score twice.
- Casual linear targets without bosses; Hard escalating targets with bosses on Antes 3 and 6 and post-boss scale jumps. A saved d20 draw selects one of 20 handicaps on entry, avoiding repeats; resources and reveal acknowledgement apply once.
- Saved-run migration preserves existing trays and builds. Older trays keep their four base dice; new runs start with three. Ghost Echo growth is cleared if the God is no longer owned.
- Compact iPhone SE landscape gameplay, with inspect dialogs for cards and effects.

## Run locally

No build, dependencies, backend, or API keys.

```sh
npm test
npm start
```

Open http://localhost:8767. `engine.js` owns rules, transactions, weighted markets, save migration, and scoring traces. `bosses.js` defines twenty handicaps and saved-draw selection; `presentation.js` handles table effects, Web Audio, speed presets, and cancellation. `catalog.js` contains all card definitions and rarity weights. `app.js` handles the interface, preferences, and automatic local saving. System font fallbacks work if Google Fonts is unavailable.

Tests cover rules, cap enforcement, scoring, Highest Die, all effect families, shop economics and cooldowns, sampled rarity, Echo resale, save migration, modes/bosses, and complete runs. Browser QA checks scoring animations and skip safety, shop transactions, colors, cap enforcement, collection browsing, and small-screen layouts.

## Deploy

Push source to GitHub first. Copy these eight public files to `rogue-dice/` in the complete current website bundle: `index.html`, `style.css`, `engine.js`, `catalog.js`, `bosses.js`, `presentation.js`, `app.js`, `icon.svg`. Commit the site integration, then deploy the complete public bundle to Cloudflare Pages project `noahstambovsky`, production branch `main`. Preserve all other site pages and apps. Do not upload tests, source docs, dependencies, or `.git`.

## Presentation and boss QA

87 automated checks cover rules, all boss-effect families, saved draws, preference migration and timing presets. Browser QA verifies on-table step order, clear/payout events, sound controls, Quick/Turbo/Instant behavior, mid-sequence reload/fast-forward single-commit safety, persistent d20 reveal, and SE viewports down to 568×232. Native Web Audio starts only on a user gesture when sound is enabled. No audio files or copied game assets are used. Reduced-motion preferences suppress flying/shaking effects.
