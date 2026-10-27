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

The daily job GETs **`https://farmshare-dashboard.vercel.app/api/network-stats`**. That URL is set in the workflow. A local run uses the same default, or `DASHBOARD_NETWORK_STATS_URL` if you point it at another host. No token is required. Do not put a Supabase service-role key or any dashboard credential in this repo, and do not prefix a dashboard secret with `VITE_`.

```bash
npm run sync-network-stats
npm run sync-network-stats -- --dry-run
```

`--dry-run` prints the counts and does not write the file. If the new plant count is below half the count already in the JSON, the script exits without replacing it. A non-200 response (including 503), a redirect, or any field besides `plants`, `states`, and `updatedAt` is refused, and the response body is not logged.

### Counts currently in the file

Synced **2026-10-27** from `GET https://farmshare-dashboard.vercel.app/api/network-stats`: **50 plants, 26 states** (`updatedAt` `2026-10-27T23:46:44.644Z`). Producers stays `10k+`.

`processors.json` is the public directory, not the customer list, so this job does not read it.
