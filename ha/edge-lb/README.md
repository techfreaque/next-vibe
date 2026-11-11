# Per-box LB — Caddy across N local app replicas

The DNS edge (`ha/edge-dns/`) spreads traffic BETWEEN the two boxes; this layer
spreads it ACROSS the N app replicas ON each box, so all cores are used.

## Files

| File                          | What                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unbottled.ai.lb.caddy`       | the `unbottled.ai` vhost: Caddy LB over this box's replicas (`unbottled-app:3000`, `unbottled-app-2:3000`, …), health-checked on `/robots.txt`, with connection draining. Drop into S1's static Caddyfile / import on S2. REPLACES each box's current single-upstream `unbottled.ai { reverse_proxy next-vibe-app:3000 }` block at cutover. |
| `docker-compose.replicas.yml` | adds replica #2 (`app-2`, no host port, reached via Caddy on `caddy_internal`). Copy the block to `app-3`/`app-4` for N>2.                                                                                                                                                                                                                  |

## Why `/robots.txt` as the health signal

The app's `/health` endpoint requires auth (401 for an anonymous probe) and
`/health` + `/` 307-redirect to a locale, so neither gives a clean 2xx for a
Caddy `health_status 200` check. `/robots.txt` is app-served, unauthenticated,
and returns **200 only while the app is actually serving** (the port refuses the
connection while a container is down/restarting). During a rolling-deploy drain
the replica is `docker stop`ped, so Caddy's active health-check (every 5s,
`max_fails 2`) ejects it within ~10s; the G1 SIGTERM handler keeps in-flight AI
streams alive through the drain window.

## Replica count

Each box = 4 cores / 15 GB. Default N = 2 (two app replicas + postgres/redis/
minio/caddy fit comfortably). Keep three things in sync:

1. `docker-compose.replicas.yml` — one service per replica (#2+).
2. `unbottled.ai.lb.caddy` — the upstream list.
3. `scripts/ha-fleet.conf` — the node's `replicas` column (deploy-ha.sh rolls
   `unbottled-app`, `-2`, … one at a time).

## Status: STAGED, not live

Neither box has had its Caddy `unbottled.ai` block swapped and neither runs a
2nd replica yet. Apply at cutover (see `ha/edge-dns/README.md` for the ordered
switch). Prod's Caddy (`/caddy/Caddyfile`) and its single `next-vibe-app` are
untouched.
