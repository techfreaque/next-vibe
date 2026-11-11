> ⚠️ **PARTIALLY SUPERSEDED (2026-11-09).** The EDGE layer here (keepalived
> floating IP + VRRP) does NOT apply — the two servers are in DIFFERENT
> datacenters (Düsseldorf + Frankfurt), so an L2 floating IP cannot bridge them.
> The real edge is **`ha/edge-dns/`** (self-hosted PowerDNS round-robin +
> health-driven failover) + **`ha/edge-lb/`** (per-box Caddy over N replicas).
> The Postgres/Redis/MinIO logical-replication design below is also superseded by
> the shared-prod-DB-over-WireGuard model (see `../memory/ha-buildout-state.md`).
> Still accurate: the G1 stream-drain deploy model and `scripts/deploy-ha.sh`.

# unbottled.ai — 2-node active-active HA

A 2-node active-active pair (Server 1 + Server 2) that survives EITHER node
dying, with zero-downtime rolling deploys and no in-flight AI-stream kills.

Built ON TOP of the already-done stateless-app foundation (self-hosted Redis +
MinIO, WS/storage adapters flipped — `docker-compose.prod.yml`,
`scripts/migrate-uploads-to-minio.sh`, the storage-serving route, the env
schema).

## Nodes

| Node     | Public                 | WireGuard   | Role                                                                    |
| -------- | ---------------------- | ----------- | ----------------------------------------------------------------------- |
| Server 1 | unbottled.ai (srv1)    | `10.88.0.1` | PG primary, Redis master, app #1                                        |
| Server 2 | srv2016195.hstgr.cloud | `10.88.0.2` | PG logical replica, Redis replica, app #2 (coexists with heilpraktiker) |

- Private VIP `10.88.0.10` (keepalived) = the current DB/Redis primary.
- Public floating IP (keepalived) = the current live edge.

## Layers

| Layer    | Mechanism                                   | Failover                                                  | Dir                                |
| -------- | ------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| App      | 2 instances, portless on srv2 (WG-bound)    | LB health-checked; drain-safe deploys                     | `../docker-compose.ha.yml`         |
| Net      | WireGuard mesh `10.88.0.0/24`               | n/a (both always up)                                      | `wireguard/`                       |
| Postgres | logical replication srv1→srv2 `unbottled`   | keepalived VIP + promote hook (auto); supervised failback | `postgres/`                        |
| Redis    | master/replica + Sentinel + HAProxy front   | Sentinel promote; HAProxy routes to master                | `redis/`                           |
| MinIO    | two-way bucket replication                  | each app uses local MinIO (no promotion)                  | `minio/`                           |
| Edge     | keepalived floating IP + Caddy LB both apps | VRRP moves IP; Caddy health-checks apps                   | `keepalived/`, `caddy/`            |
| Deploy   | per-node drain → migrate → health → rejoin  | always ≥1 live node                                       | `scripts/rolling-deploy.sh`        |
| Stream   | G1 SIGTERM drain of in-flight StreamLoops   | finishes streams before exit                              | `src/instrumentation.ts`, app code |

## Build order (what to run)

Provisioning (safe, additive, done ahead of go-live):

```
ha/scripts/provision-node.sh server1      # wireguard-tools + keepalived + keys
ha/scripts/provision-node.sh server2
ha/scripts/wg-mesh-up.sh                   # bring up the private tunnel
# stage app image + configs on Server 2 (no public ports taken)
```

Go-live is then a SINGLE image deploy + flip — see `CUTOVER-RUNBOOK.md`.

## The stream-safe deploy (G1)

`src/instrumentation.ts` installs a SIGTERM handler in the Next.js runtime that
flips the health endpoint to `critical` (LB drains the node), waits for every
in-flight `StreamLoop` (tracked in
`src/vibe/agent/ai-stream/repository/loop/active-loops.ts`) up to
`STREAM_DRAIN_TIMEOUT_MS` (default 90s), then exits. `vibe start`'s supervisor
(`src/vibe/platforms/web/start/repository.ts`) forwards SIGTERM to that child and
waits for it (bounded) instead of hard-killing, and compose `stop_grace_period`
(120s) gives Docker time before SIGKILL. Result: a rolling deploy never severs a
half-written answer.

See each sub-directory's README for the layer detail, and `CUTOVER-RUNBOOK.md`
for the exact ordered switch.
