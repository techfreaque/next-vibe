# Visitor country (offline geo IP)

Admin analytics (acquisition, funnel, abuse, lead list) show where a visitor
is, not only which site locale they picked. Two separate dimensions:

| Field                                            | Meaning                                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `leads.geo_country`, `growth_visits.geo_country` | Visitor country from the client IP, ISO 3166-1 alpha-2. `ZZ` = reserved or unknown range, `NULL` = not resolved yet. |
| `leads.country`                                  | Region of the chosen site locale (e.g. `DE`, `GLOBAL`). Shown as "Locale region".                                    |

## How it resolves

- Client IP = first `X-Forwarded-For` hop, else `X-Real-IP`. Caddy on S1/S2
  does not trust incoming forwarding headers, so the first hop is the real
  client; the S2 fallback path keeps the header S1's Caddy set.
- Lookups are offline: an in-memory range table (~5 MB) read once per process
  from `geo_ip_databases` and re-checked every 6 hours. No API call per visit.
- Only the country is stored for this purpose. The IP is not copied anywhere.
- Lead creation and every tracked visit write the country; a visit also fills
  a lead that had none yet.

## Data source and updates

- [DB-IP IP to Country Lite](https://db-ip.com/db/lite.php), monthly, free.
  Chosen over MaxMind GeoLite2 (account + license key required) and IP2Location
  LITE (token required, CC BY-SA). The CSV (~4.6 MB gz) is folded into a
  compact table stored gzip + base64 (~2 MB) in Postgres, so S1, S2 and
  self-hosted instances share one copy and only the task runner downloads.
- Task `geo-ip-update` (hourly, `src/leads/geo/update/`): downloads the
  current month once (falls back to last month until the new file is out),
  then resolves up to 2,000 leads per run that have an IP but no country.
  Run it by hand: `vibe geo-ip-update --force=true`.

## Attribution (CC BY 4.0)

IP geolocation by [DB-IP](https://db-ip.com), licensed under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
