# Edge HA — Caddy load-balancing unbottled across both nodes

Each node's Caddy terminates TLS for `unbottled.ai` and **load-balances** the
request across BOTH app instances, health-checked on
`GET /vibe/platforms/web/health`, with connection draining. Combined with the
keepalived public floating IP (which sits on the live node), the public address
AND the app pool both survive a node loss.

## Upstreams (over WireGuard)

| Instance     | Address          |
| ------------ | ---------------- |
| Server 1 app | `10.88.0.1:3000` |
| Server 2 app | `10.88.0.2:3100` |

WebSocket (`/ws*`) goes to port `4000` (srv1) / `4100` (srv2). The health check
path returns `critical` during drain, so a draining node is pulled from the pool
automatically (that is the rolling-deploy drain signal).

## Two edge styles (the two nodes differ today — converge them)

- **Server 1** already runs a **static Caddyfile** (`caddy:2-alpine` at
  `/caddy/Caddyfile`). Replace its `unbottled.ai` block with
  `unbottled.ai.caddy-snippet` below (load-balanced + health-checked). Its other
  vhosts (max.a42.ch, bucksflux.com, …) are untouched.
- **Server 2** runs **caddy-docker-proxy** for heilpraktiker. Add the unbottled
  vhost ADDITIVELY — either (a) a static-snippet import, or (b) a
  caddy-docker-proxy label on a tiny "edge config" container. We use (a): mount
  `unbottled.ai.caddy-snippet` into Server 2's Caddy and `import` it, leaving
  heilpraktiker's label-generated config alone.

> Because the floating IP lands on ONE node at a time, only that node's Caddy
> actually serves public traffic at any instant — but BOTH are configured
> identically so failover is seamless. Each Caddy load-balances to both apps, so
> even the active node spreads load across the pair (active-active).

## Files

- `unbottled.ai.caddy-snippet` — the load-balanced vhost (drop into either edge).
- `Caddyfile.server1.example` — Server 1's full file with the snippet merged
  (its other vhosts preserved).
- `server2-caddy.md` — exactly how to add the snippet to Server 2 without
  touching heilpraktiker's routing.
