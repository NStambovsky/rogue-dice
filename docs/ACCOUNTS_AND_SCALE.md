# Accounts and traffic readiness

Verified October 31, 2026: the production Cloudflare Pages project reports `uses_functions: false` for both project and production deployment. No server API is called by the game; state is stored in localStorage. The connected Cloudflare OAuth integration cannot read billing subscriptions, so the account’s actual Workers billing plan has not been confirmed.

## Current capacity

Cloudflare states that Pages static asset requests are free and unlimited when they do not invoke Functions. That fits the current architecture: initial files download from the CDN, then play runs in the visitor’s browser. A rush of players does not generate a server operation for every roll. This is architectural readiness, not a load-test guarantee or SLA.

Source: https://developers.cloudflare.com/pages/functions/pricing/

## Proposed account scope (not yet implemented)

Keep **Play as guest** as the default. Offer optional sign-in to back up/resume the active run across devices and retain private run history. No mandatory sign-in, public leaderboard or server-verified competitive score is needed for the initial rollout. Browser-calculated scores are user-editable and must not be represented as cheat-proof.

Use a separate account API Worker plus D1, leaving the game and assets static. Route only API requests through server code; never put authentication middleware over the entire game. Account-service outages/quota exhaustion should show a pending-sync status while play and local saving continue.

First version can use Google sign-in (OAuth/OIDC authorization code flow with PKCE/state/nonce, strict configured redirect URI). It needs a Google OAuth application/client configuration before activation. An email-link alternative also needs an email delivery provider. Provider selection is pending; no account service or database has been provisioned.

Session cookies should be Secure, HttpOnly and same-site, with explicit expiration/logout, origin/CSRF checks on writes and per-user ownership checks. Validate saves on the server using the versioned engine schema and bounded JSON size. Use conditional revision updates: concurrent devices must choose which run to continue rather than silently overwrite. Never replace a local run with a cloud copy without a clear user choice. Keep a local backup before importing a save; provide account/data deletion.

## Write budget

Save locally after each action as today. Queue a cloud checkpoint at round completion, run completion, explicit Save/Sync, and a debounced periodic checkpoint while actively playing (at most once per minute). Merge overlapping triggers, retry failures with exponential backoff, and do not poll inactive tabs. Bound payload size (for example 64 KB), keep one current-run row per account and cap retained history (for example the last 20 summaries). Index ownership and use primary-key lookups rather than scanning all users. Rate-limit sign-in and save endpoints with server-enforced per-account/IP controls; return Retry-After instead of retry storms. Limit body size before parsing.

With **12 cloud-save requests per player per day**, 1,000 players would make 12,000 save requests; 10,000 would make 120,000. Those examples exclude authentication, reads, retries and index writes. They are workload assumptions, not measured usage. The larger example exceeds the Free Workers daily request allowance even before that overhead.

## Published limits and pricing

- Pages static assets: free, unlimited requests when no Functions are invoked.
- Workers Free: 100,000 requests/day, shared account-wide with Pages Functions.
- D1 Free: 5 million rows read/day; 100,000 rows written/day; 5 GB total storage. Index writes count too. Hitting daily limits causes query errors until reset.
- Workers Paid: minimum $5/month; includes 10 million requests/month and 30 million CPU-ms, with additional usage billed. D1 paid includes 25 billion row reads/month, 50 million row writes/month and 5 GB storage. Paid is not a hard $5 spending cap.

Sources: https://developers.cloudflare.com/workers/platform/pricing/, https://developers.cloudflare.com/workers/platform/limits/, https://developers.cloudflare.com/d1/platform/pricing/.

For a public launch with accounts, monitor errors, requests, D1 rows read/written, CPU and storage; set available usage/budget alerts and maintain a switch to disable cloud sync while retaining guest play. Confirm other workloads consuming account-wide quotas. Upgrade billing only with Noah’s authorization. Load-test a staging API after it exists, using a representative sign-in/checkpoint pattern; do not flood the personal site as a test.

## Independent instances

`npm run build` generates a complete static `dist` folder. See SELF_HOST.md. Forks require their own Cloudflare account/project; if accounts are added later, each instance must supply its own OAuth application, database, session keys and allowed origins, or remain guest-only. Never ship Noah’s credentials or point all forks at his account API by default.
