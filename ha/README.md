# unbottled.ai HA: current state (2026-11-12)

Two boxes in two datacenters, both serving unbottled.ai from the same data.

|          | Server 1 (72.61.156.49, prod)                                              | Server 2 (179.198.214.41, co-hosts heilpraktiker)                                                                                        |
| -------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| App      | `next-vibe-app` (split port 3000 + WS 4000), runs migrations + task runner | `unbottled-app` (single port, `10.88.0.2:3100` WG only), no migrations/seeds/tasks                                                       |
| Caddy    | `/caddy/Caddyfile`: local app first, S2 over WG as fallback                | caddy-docker-proxy; sites live on the `unbottled-edge` container (`docker-compose.s2-edge.yml`): local app first, S1 over WG as fallback |
| Postgres | `prod-postgres` primary, slot `s2_replica`, `max_slot_wal_keep_size=20GB`  | `unbottled-pg-replica` hot standby streaming over WG (`ha/postgres/s2-streaming-replica.sh status`)                                      |
| Redis    | `prod-redis` (shared pub/sub for both apps)                                | (local `unbottled-redis` idle, used only after failover)                                                                                 |
| MinIO    | `prod-minio` bucket `chat-media` (shared by both apps)                     | `unbottled-minio` = replication target of S1 (rule dbp1gq4es4tc78049v6g)                                                                 |
| DNS      | PowerDNS `ns1` + health daemon                                             | PowerDNS `ns2` + health daemon                                                                                                           |
| Certs    | Caddy HTTP-01                                                              | Caddy HTTP-01                                                                                                                            |

- **Link:** plain WireGuard over UDP 51820 directly between the public IPs (10.88.0.1 / 10.88.0.2, both peers have an Endpoint + PersistentKeepalive 25). Measured ~520 Mbit/s, ~4.5 ms, 0% loss. Each box's `ha-host-fw.service` accepts UDP 51820 only from the peer.
- **NO tunnelling / relay binaries on these boxes, ever** (wstunnel, chisel, frp, ngrok, gost, cloudflared, socat, `nc -l` listeners, ...). Hostinger runs an hourly in-VM scanner through qemu-guest-agent (`/.hstgr-telemetry-* --threshold 20`) and hard-stops the VPS when it sees one: S1 was shut down for "malware, Process: wstunnel" on 2026-11-12 22:09 UTC. The old "WG over wstunnel TCP 8443" link was removed 2026-11-13; direct UDP was never actually blocked.
- **WG-IP forwarders:** `pg-wg-forward` (S1, `10.88.0.1:5432` -> `prod-postgres`) and `minio-wg-forward` (S2, `10.88.0.2:9000` -> `unbottled-minio`) are `haproxy:3.2-alpine` TCP proxies using `wireguard/wg-forward.haproxy.cfg` (copy at `/root/ha-wg-forward/`), started with the `docker run` line in that file. They replaced ad-hoc socat containers (kept stopped as `*-socat-old` for rollback).
- **Host firewall:** `scripts/ha-host-fw.sh` + `scripts/ha-host-fw.service` on both boxes (peer IPs in `/etc/default/ha-host-fw`). Public surface: 22, 80, 443 only. Drops public 3000/4000 (app ports that bypass Caddy), 53 (PowerDNS, until hardened), 5355 (LLMNR), and UDP 51820 from non-peers. The WG and docker-network paths are untouched. Rollback: `systemctl disable --now ha-host-fw`.
- **Image relay (deploys):** `vibe image-push` pipes `docker save | gzip | ssh` from S1 to `root@10.88.0.2` with S1's `/root/.ssh/ha-image-relay` key. On S2 that key is pinned in `/root/.ssh/authorized_keys` as `restrict,from="10.88.0.1",command="gunzip | docker load"`, so it can do nothing else and only works over WG. New box pair: `ssh-keygen -t ed25519 -N "" -f /root/.ssh/ha-image-relay` on the sender, add the pinned line on the receiver.
- **Edge:** each box's PowerDNS publishes the apex A for every box that passes `GET https://unbottled.ai/robots.txt` (30 s TTL). Live once the registrar delegates to ns1/ns2.unbottled.ai (Max's step, `ha/edge-dns/README.md`). **ON HOLD since 2026-11-13:** public :53 is dropped by `ha-host-fw` on both boxes. Do NOT delegate until PowerDNS is hardened (dnsdist or pdns rate limiting, minimal-responses, ANY refused, no recursion) and the `53` rules are removed from `ha-host-fw.sh`. DNS records then live in `ha/edge-dns/zone.unbottled.ai.tmpl` on BOTH boxes (`/root/ha-edge/edge-dns/`); editing the template re-renders the zone within 10 s.
- **ACME:** Let's Encrypt may reach either box. Each Caddy answers its own HTTP-01 tokens and relays unknown ones once to the peer over WG (`X-HA-Acme-Fwd` loop guard). TLS-ALPN-01 is disabled for these names. Verified by issuing S2's certs while DNS still pointed at S1. acme.sh/hosttech DNS-01 on S2 is retired (timer disabled).
- **Deploys:** `vibe image-push` deploys Server 1 (migrations), relays the image box to box over WG, then runs `scripts/deploy-ha-node.sh` on Server 2 (tag `:unbottled`, never `:latest`; S1 .env merged with S2 overrides via `ha/scripts/merge-env.py`; health check; auto-rollback to `:unbottled-rollback`). While either app restarts, that box's Caddy serves from the other box. Measured: zero failed requests across the S1 cutover recreate.
- **S2 env:** `/root/unbottled/.env` = S1's `.env` + S2 overrides; `HA_DATABASE_URL` comes from `/root/unbottled/.ha-database-url` (mode 600).

## Failover when Server 1 is DOWN (manual, never while S1 is alive)

1. On S2: `bash /root/unbottled/ha/s2-streaming-replica.sh promote` (type PROMOTE).
2. Point S2's app at local backends: in `/root/unbottled/.ha-database-url` use `postgres://s2app:<pw>@pg-replica:5432/postgres?schema=public`; in `docker-compose.s2-ha.yml` set `REDIS_URL=redis://unbottled-redis:6379`, `S3_ENDPOINT=http://unbottled-minio:9000`, and drop `--task-runner=false` so crons run here; then `bash scripts/deploy-ha-node.sh`.
3. DNS: the S2 health daemon already removed S1 from the apex.
4. Failback is a planned job: rebuild S1's Postgres as a standby of S2 (or dump/restore), mirror MinIO back, then reverse.

## History

Everything below is the original design. The keepalived/VIP edge and the logical-replication data layer were superseded (two datacenters cannot share an L2 floating IP); the G1 stream-drain notes still apply.

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
