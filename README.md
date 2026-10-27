# farmshare-landing

Marketing site for [farmshare.co](https://farmshare.co).

## Homepage network stats

The hero stats bar shows three figures:

- **Plants** and **states** come from `src/data/network-stats.json`.
- **Producers** is the static label `10k+`. It is not loaded from HubSpot.

`scripts/sync-network-stats.mjs` refreshes the JSON. [`.github/workflows/sync-network-stats.yml`](.github/workflows/sync-network-stats.yml) runs it daily (and on manual dispatch) and commits the file when the counts change. Vite inlines the JSON at build time and substitutes the homepage meta description, Open Graph description, Twitter description, and organization structured data. The page title stays `Farmshare | The Coordination Layer for Independent Meat`.

The published file is only `plants`, `states`, and `updatedAt`. The script does not write or log company names, deal names, or record ids. Do not import `scripts/network-stats-lib.mjs` from client code; that module contains HubSpot stage ids. The client bundle should contain the two counts, not a customer list.

`updatedAt` changes only when the counts change, so an unchanged day does not commit or redeploy.

### HubSpot token

The job reads **`HUBSPOT_PRIVATE_APP_TOKEN`**.

| Where | What to set |
| --- | --- |
| GitHub Actions | Repository secret `HUBSPOT_PRIVATE_APP_TOKEN` |
| Local | Same variable in the environment. It is not read from a `VITE_` variable. |
| Vercel | Already used by `api/leads/open-processor.ts` and `api/leads/processor-email.ts`. The stats job does not call HubSpot from the browser or from a public route. |

Never prefix this token with `VITE_`. Vite embeds `VITE_` variables in the client bundle.

The private app needs these scopes:

- `crm.objects.companies.read`
- `crm.objects.deals.read`

```bash
HUBSPOT_PRIVATE_APP_TOKEN=... npm run sync-network-stats
HUBSPOT_PRIVATE_APP_TOKEN=... npm run sync-network-stats -- --dry-run
```

`--dry-run` prints the counts and does not write the file. If the new plant count is below half the count already in the JSON, the script exits without replacing it.

### What counts as a signed plant

One HubSpot company counts as one plant.

A company is included when either of these is true:

1. Lifecycle stage is one of:
   - Customer (`customer`)
   - Onboarding (`142222223`)
   - Closed Won (`142225202`)
   - Evangelist (`evangelist`)
2. It is associated with a closed-won **new-business** deal, and its lifecycle stage is not Deactivated or Closed Lost:
   - Farmshare Deal Pipeline `652756237`, stage Closed: Won `959773741`
   - Legacy All Deals pipeline `139919618`, stage Closed Won `239936119`

Left out on purpose:

- Deactivated (`142223971`) and Closed Lost (`142222226`), even when an older deal is still closed-won
- Growth & Renewal closed-won deals (an expansion of a plant already counted)
- Customer Lifecycle stages such as Activation Complete (onboarding progress; HubSpot marks some of these closed-won only because the stage probability is 1)
- Deals with no associated company

**States** are the distinct US states on the included companies. The company `state` property is used first, then `hs_state_code`. Full names and abbreviations are the same state (`Idaho` and `ID`). A combined value such as `CO & KS` counts as two states. A plant with a blank or unrecognized state still counts as a plant and does not add a state.

### Where the numbers came from before

Plants, states, and producers were hardcoded in `src/constants/index.ts`. The last manual check was 2026-09-02: 44 customers Active on the latest billing `arr_events` row, and 28 states resolved by hand. Producers was `10,228`. `processors.json` is the public directory, not the customer list (its `status` field is incomplete), so this job does not read it.

The JSON in the repo was filled on 2026-10-27 from a HubSpot query using the criteria above: **49 plants, 29 states**. The sync script was not executed in that pass because `HUBSPOT_PRIVATE_APP_TOKEN` was not available in the environment. After the GitHub secret is set, the Action replaces this snapshot with the script's output.
