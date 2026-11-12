> **DONE 2026-11-12.** Prod runs s3 (prod-minio) + redis (prod-redis), Server 2 is an active peer, edge staged. Current state: `README.md`. Only the registrar NS change remains (`edge-dns/README.md`). This runbook is history.

> ⚠️ **EDGE SECTION SUPERSEDED (2026-11-09).** Phase 6 (keepalived floating IP)
> does not apply across two datacenters. The real edge is `ha/edge-dns/`
> (PowerDNS round-robin + fast health-driven failover) + `ha/edge-lb/` (per-box
> Caddy LB over N replicas). Use `ha/edge-dns/README.md` for the edge cutover +
> the single registrar nameserver change. Phases 0-5 (data layer, app start,
> stream-drain) remain the reference; the DB model is now shared-prod-over-WG
> (see `../memory/ha-buildout-state.md`), not logical replication.

# CUTOVER RUNBOOK — unbottled.ai single-node → 2-node active-active HA

Run by the **main thread**, in a **low-usage window**. Every step that can
interrupt a live AI stream is flagged ⚠️STREAM. Each phase has a rollback.

By design, almost everything is PRE-STAGED (WireGuard up, replica DB + schema
loaded, configs on Server 2). Go-live is: flip Server 1 to publisher (one PG
restart), start the subscription, start Server 2's app, enable keepalived +
edge LB. **If you only want "the app also runs on Server 2"**, the single
remaining deploy action is Phase 4 (start Server 2 app) + Phase 6 (edge).

## Pre-staged already (verified live, additive, heilpraktiker untouched)

- ✅ WireGuard mesh `10.88.0.1 ⇄ 10.88.0.2` up + persistent (`wg show`).
- ✅ `wireguard-tools` + `keepalived` installed on both nodes.
- ✅ Server 2 shared `prod-postgres`: `unbottled` DB created + schema loaded
  (132 tables, plv8+vector) — heilpraktiker's `postgres` DB (111 tables) intact.
- ✅ `/root/unbottled/` on Server 2 holds compose + `ha/` configs.

## Prerequisites to set in Server 2's `/root/unbottled/.env` BEFORE Phase 4

Copy Server 1's `/unbottled/.env` as the base, then override for Server 2:

```
# distinct image tag so unbottled never overwrites heilpraktiker's :latest
DOCKER_IMAGE_TAG=unbottled
APP_CONTAINER_NAME=unbottled-app
APP_BIND_IP=10.88.0.2
APP_HOST_PORT=3100
APP_WS_HOST_PORT=4100
APP_STOP_GRACE_PERIOD=120s
STREAM_DRAIN_TIMEOUT_MS=90000
# DB: app → local PgBouncer → VIP → primary. (Direct form for first boot test:)
DATABASE_URL=postgres://postgres:postgres@prod-postgres:5432/unbottled?schema=public
SHARED_PG_NETWORK=heilpraktiker-brandstaetter_app-network
# HA data layer
WS_PUBSUB_TYPE=redis
REDIS_URL=redis://redis-haproxy:6379          # local HAProxy front
CHAT_STORAGE_TYPE=s3
S3_ENDPOINT=http://minio:9000                 # local MinIO
REDIS_ANNOUNCE_IP=10.88.0.2
REDIS_REPLICAOF=10.88.0.1 6379
MINIO_BIND_IP=10.88.0.2
```

Also set on Server 1's `/unbottled/.env`: `PG_WAL_LEVEL=logical` (already the
compose default), `WS_PUBSUB_TYPE=redis`, `CHAT_STORAGE_TYPE=s3`,
`REDIS_ANNOUNCE_IP=10.88.0.1`, `MINIO_BIND_IP=10.88.0.1`.

---

## Phase 0 — Foundation on Server 1 (Redis + MinIO + uploads) ⚠️STREAM (app restart)

The stateless-app foundation must be active on Server 1 before the pair makes
sense. If Server 1 is still filesystem+local-WS, do this first.

1. Bring up Redis + MinIO on Server 1:
   `cd /unbottled && docker compose -f docker-compose.prod.yml up -d redis minio minio-init`
2. Migrate uploads → MinIO: `bash scripts/migrate-uploads-to-minio.sh` (idempotent).
3. Flip `.env`: `WS_PUBSUB_TYPE=redis`, `CHAT_STORAGE_TYPE=s3` (+ S3_* already
   wired in compose).
4. ⚠️STREAM Recreate the app to pick up the adapters:
   `docker compose -f docker-compose.prod.yml up -d app`
   (This ONE restart interrupts in-flight streams — the G1 drain is only active
   AFTER the new image ships. Do it at the quietest moment.)

- **Rollback:** set `WS_PUBSUB_TYPE=local`, `CHAT_STORAGE_TYPE=filesystem`,
  recreate app. Files still on `/next-vibe-uploads`.

## Phase 1 — Expose Postgres + Redis + MinIO on the WireGuard IPs (no stream impact)

1. Server 1 PG on WG: `docker compose -f docker-compose.prod.yml -f ha/postgres/srv1.pg-wg.override.yml up -d postgres`
   ⚠️ this recreates the `postgres` container → a brief app DB blip; do with app
   drained or accept a sub-second reconnect. Verify `ss -tlnp | grep 10.88.0.1:5432`.
2. MinIO on WG (both nodes): `… -f ha/minio/minio-wg.override.yml up -d minio`.

- **Rollback:** drop the override files, recreate without them.

## Phase 2 — Postgres logical replication ⚠️STREAM (one PG restart on Server 1)

1. **wal_level=logical on Server 1** (the compose default is already `logical`,
   but it only applies on restart):
   `docker compose -f docker-compose.prod.yml up -d postgres` then confirm
   `docker exec prod-postgres psql -U postgres -tc "SHOW wal_level;"` → `logical`.
   ⚠️STREAM a PG restart drops app DB connections briefly — drain the app first
   (`docker compose stop --timeout 120 app`) or do it in the window; the app
   reconnects automatically.
2. `REPL_PASSWORD=<pick> ha/postgres/setup-replication.sh primary-role` (role + publication + pg_hba).
3. `REPL_PASSWORD=<same> ha/postgres/setup-replication.sh subscribe` (CREATE SUBSCRIPTION; schema already loaded).
4. `ha/postgres/setup-replication.sh verify` → wait for `pg_subscription_rel`
   state `r` (ready) on all tables and `pg_stat_subscription` streaming.

- **Rollback:** on Server 2 `DROP SUBSCRIPTION unbottled_sub;` on Server 1
  `DROP PUBLICATION unbottled_pub;` — the `unbottled` DB copy stays, harmless.

## Phase 3 — Redis replica + Sentinel + MinIO replication (no stream impact)

1. Server 1 Redis as master: `REDIS_ROLE=master REDIS_ANNOUNCE_IP=10.88.0.1 docker compose -f ha/redis/docker-compose.redis-ha.yml up -d`
   (renders `sentinel.conf` from template first; set `REDIS_PASSWORD`).
2. Server 2 Redis as replica + Sentinel: same with `REDIS_ANNOUNCE_IP=10.88.0.2 REDIS_REPLICAOF="10.88.0.1 6379"`.
3. HAProxy front on both: `docker compose -f ha/redis/haproxy/docker-compose.haproxy.yml up -d` (render `haproxy.cfg`).
4. MinIO replication: `ha/minio/setup-replication.sh` (two-way, versioned).

- **Rollback:** stop the redis-ha / haproxy / sentinel containers; app falls
  back to its local Redis if `REDIS_URL` is repointed.

## Phase 4 — Start Server 2's unbottled app (the "single image deploy")

1. Ship the unbottled image to Server 2 under the DISTINCT tag (so heilpraktiker's
   `:latest` is untouched): from the repo, `vibe image-push --sshTarget=<srv2> --tag=unbottled`
   (docker save | ssh | docker load), OR retag an already-loaded image.
2. `cd /root/unbottled && docker compose -f docker-compose.prod.yml -f docker-compose.ha.yml up -d app`
   - binds `10.88.0.2:3100/4100` (never 3000/4000 → heilpraktiker safe),
   - connects to the `unbottled` DB in the shared container,
   - uses local Redis/MinIO.
3. Health: `curl -fsS http://10.88.0.2:3100/vibe/platforms/web/health` → 2xx.

- **Rollback:** `docker compose … down` the unbottled app only. Heilpraktiker
  and Server 1 are unaffected (separate container name, ports, DB).

## Phase 5 — PgBouncer in front (optional but recommended before edge)

Render + start PgBouncer on both nodes (`ha/postgres/pgbouncer/`), repoint each
app's `DATABASE_URL` to `pgbouncer:6432/app`, recreate app ⚠️STREAM (drain first).
Now "the primary" is the VIP, ready for auto-failover.

## Phase 6 — Edge: keepalived floating IP + Caddy LB (public cutover)

1. Caddy: merge `ha/caddy/unbottled.ai.caddy-snippet` into Server 1's
   `/caddy/Caddyfile` (replace its `unbottled.ai` block) and reload
   (`docker exec caddy-caddy-1 caddy reload …`); add it to Server 2's Caddy per
   `ha/caddy/server2-caddy.md`. Both now LB across `10.88.0.1:3000` + `10.88.0.2:3100`,
   health-checked on `/vibe/platforms/web/health`.
2. keepalived: render `ha/keepalived/keepalived.server{1,2}.conf.template` +
   install `chk_app.sh`, `notify-pg.sh`, `pg-notify.env`; `systemctl enable --now keepalived`.
3. Point DNS `A unbottled.ai` → the floating IP (`ha/keepalived/floating-ip.md`).

- **Rollback:** `systemctl stop keepalived` (IP returns to Server 1's own
  address), restore the original `unbottled.ai` Caddy block, reload.

## Phase 7 — Verify HA

- Kill Server 2 app → traffic stays on Server 1 (Caddy ejects srv2). Restart → rejoins.
- Kill Server 1 app → Caddy serves from srv2; keepalived moves VIP; `notify-pg.sh`
  promotes srv2 PG; Redis HAProxy routes to the promoted replica. Confirm chat works.
- Rolling deploy drill: `ha/scripts/rolling-deploy.sh` → both nodes update, no
  stream kills (watch a live stream survive the other node's roll).

## Rollback (whole cutover)

Stop keepalived on both, restore Server 1's original Caddy `unbottled.ai` block,
`DROP SUBSCRIPTION`/`DROP PUBLICATION`, stop Server 2's unbottled app + redis-ha

- haproxy. Server 1 reverts to the exact single-node setup it had (its compose,
  ports and DB were never changed destructively). Heilpraktiker was never touched.

```

```
