# farmshare-landing

Marketing site for [farmshare.co](https://farmshare.co).

## Homepage network stats

The hero stats bar shows three figures:

- **Plants** and **states** come from `src/data/network-stats.json`.
- **Producers** is the static label `10k+`. It is not loaded from the dashboard.

`scripts/sync-network-stats.mjs` refreshes the JSON from the Farmshare ops dashboard. [`.github/workflows/sync-network-stats.yml`](.github/workflows/sync-network-stats.yml) runs it daily (and on manual dispatch) and commits the file when the counts change. Vite inlines the JSON at build time and substitutes the homepage meta description, Open Graph description, Twitter description, and organization structured data. The page title stays `Farmshare | The Coordination Layer for Independent Meat`.

The published file is only `plants`, `states`, and `updatedAt`. The script does not write or log customer names. The client bundle contains the two counts, not a customer list.

`updatedAt` changes only when the counts change, so an unchanged day does not commit or redeploy.

### Dashboard source

Plants are the dashboard's **active customers**: one customer whose latest billing `arr_events` row has status Active. States are the distinct states of those customers. The dashboard already computes the customer count. This site does not recompute it and does not read HubSpot.

The job sends a GET to **`https://farmshare-dashboard.vercel.app/api/network-stats`** (override with `DASHBOARD_NETWORK_STATS_URL`). No token is required. Do not put a Supabase service-role key or any dashboard credential in this repo, and do not prefix a dashboard secret with `VITE_`.

```bash
npm run sync-network-stats
npm run sync-network-stats -- --dry-run
```

`--dry-run` prints the counts and does not write the file. If the new plant count is below half the count already in the JSON, the script exits without replacing it. A redirect, a non-JSON body, or any field besides the three aggregates is also refused, and the response body is not logged.

That public route does not exist yet. Unauthenticated requests are redirected to Google sign-in. Until it is added on [harrowood7/farmshare-dashboard](https://github.com/harrowood7/farmshare-dashboard), the JSON stays at the last count verified against that billing database.

### Counts currently in the file

Verified **2026-09-02** against the dashboard billing DB (`arr_events`, status Active on the latest event): **44 plants, 28 states**. States were resolved per customer outside that row (directory, HubSpot, and the wiki). A live pull on 2026-10-27 could not be completed because the aggregate route is not public. Producers stays `10k+` (the previous exact producer count was 10,228).

`processors.json` is the public directory, not the customer list, so this job does not read it.

### Dashboard change still required

On the dashboard repo, add a public read-only route:

- Path: `GET /api/network-stats` on `https://farmshare-dashboard.vercel.app`
- Auth: exclude this path from the Google sign-in middleware. `/api/cron/*` already skips that redirect and returns the app 404, so the new path needs the same exemption.
- Query: the same active-customer definition the dashboard overview uses (latest `arr_events` row per customer, status Active). `plants` is that count. `states` is the distinct states of those customers, computed in the dashboard from whatever location the customer record already has. If `arr_events` has no state, join it server-side. Do not send the rows to this marketing site.
- Body, exactly:

```json
{ "plants": 44, "states": 28, "updatedAt": "2026-09-02T15:39:26.000Z" }
```

No names, ids, or dollar amounts. The Supabase service role stays on the dashboard.
