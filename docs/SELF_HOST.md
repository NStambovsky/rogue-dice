# Host your own Rogue Dice instance

The current game is a static site. Gameplay, random rolls and saved runs live in each visitor’s browser. A separate instance needs no database, API key, paid plan or shared service. Instances do not share saves; clearing browser storage loses local progress. Accounts/cloud sync are not implemented in this package.

## Cloudflare Pages: fork and connect

1. Fork https://github.com/NStambovsky/rogue-dice into your GitHub account.
2. In your own Cloudflare account, create a **Pages** project and connect your fork. Choose `main` as the production branch.
3. Use **None** as the framework preset, `npm run build` as the build command and `dist` as the output directory. Keep the root directory at the repository root. Use Node 22 or later.
4. Deploy. Your game runs at the assigned `*.pages.dev` address. A custom domain is optional.
5. Your pushes to `main` are deployed automatically. To receive upstream improvements, sync your GitHub fork and let Pages redeploy.

The default arcade link credits Noah’s original site. Optionally set the build environment variable `ROGUE_HOME_URL` to your own http(s) URL or root-relative home path. The original game/author attribution remains.

Official instructions: https://developers.cloudflare.com/pages/get-started/git-integration/ and https://developers.cloudflare.com/pages/configuration/build-configuration/.

## Local build or another static host

Install Node 22+, then run:

```sh
npm test
npm run build
python3 -m http.server 8767 --directory dist
```

Visit http://localhost:8767. Python is only a convenient local server; any static server works. Upload **only the contents of `dist`** to your static host. Keep the game files and assets together. The game and practice pages also work inside a subfolder; the home link can be customized as above. Some hosts ignore `_headers`; this does not affect gameplay. Never publish the repository root, tests, balance audit traces, `.git`, tokens or private configuration as the public site.

## Noah’s existing personal site

This is a standalone export, **not** a replacement bundle for noahstambovsky.com. Copy the public game files/assets into `rogue-dice/` inside the complete current personal-site bundle. Preserve all other pages, apps, `_headers` and `_redirects`. Deploying `dist` by itself to that existing project would replace the rest of the site.

## Before sharing

Check the game and Learn to play on your deployed address, run a hand and reload to confirm local saving. Your host’s normal usage limits and terms still apply. No automatic upgrades or paid subscriptions are enabled by this build.
