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
- Optional, saved, skippable scoring animation driven by exact engine steps. No hand is consumed until the animation completes or is skipped; duplicate finish callbacks cannot score twice.
- Casual linear targets without bosses; Hard escalating targets with bosses on Antes 3 and 6 and post-boss scale jumps.
- Saved-run migration preserves existing trays and builds. Older trays keep their four base dice; new runs start with three. Ghost Echo growth is cleared if the God is no longer owned.
- Compact iPhone SE landscape gameplay, with inspect dialogs for cards and effects.

## Run locally

No build, dependencies, backend, or API keys.

```sh
npm test
npm start
```

Open http://localhost:8767. `engine.js` owns rules, transactions, weighted markets, save migration, and scoring traces. `catalog.js` contains all card definitions and rarity weights. `app.js` handles the interface, preferences, and automatic local saving. System font fallbacks work if Google Fonts is unavailable.

Tests cover rules, cap enforcement, scoring, Highest Die, all effect families, shop economics and cooldowns, sampled rarity, Echo resale, save migration, modes/bosses, and complete runs. Browser QA checks scoring animations and skip safety, shop transactions, colors, cap enforcement, collection browsing, and small-screen layouts.

## Deploy

Push source to GitHub first. Copy these six public files to `rogue-dice/` in the complete current website bundle: `index.html`, `style.css`, `engine.js`, `catalog.js`, `app.js`, `icon.svg`. Commit the site integration, then deploy the complete public bundle to Cloudflare Pages project `noahstambovsky`, production branch `main`. Preserve all other site pages and apps. Do not upload tests, source docs, dependencies, or `.git`.
