# Postgres HA — logical replication (Server 1 primary → Server 2 replica)

## Decision: logical replication into the SHARED container — SAFE

- **Primary**: Server 1 `prod-postgres` (image `unbottled-postgres`), DB
  `postgres`, 132 tables, ~1.2 GB. **Every table has a PRIMARY KEY** (verified:
  0 tables lack one), so logical replication streams INSERT/UPDATE/DELETE
  correctly with the default `REPLICA IDENTITY` — no `REPLICA IDENTITY FULL`
  needed.
- **Replica**: Server 2 reuses heilpraktiker's EXISTING `prod-postgres`
  container. We add a **separate database `unbottled`** inside it as the logical
  subscriber. heilpraktiker keeps its own `postgres` DB untouched.
- **Why logical, not physical streaming**: Server 2's PG instance is
  heilpraktiker's own primary; it can't also be a physical standby of Server 1.
  Logical replication lets a single instance subscribe to another instance's DB
  into a _different_ database — exactly our case.

### Safety for heilpraktiker

1. **Publisher side (Server 1)** needs `wal_level=logical` (default is
   `replica`). This requires **one restart** of unbottled's prod-postgres — done
   in the cutover window by the main thread (flagged in the runbook). It does
   NOT touch Server 2.
2. **Subscriber side (Server 2)** needs NO `wal_level` change and NO restart —
   a subscriber only needs `max_logical_replication_workers`/`max_replication_slots`
   headroom (heilpraktiker's container already has `max_replication_slots=10`,
   `max_wal_senders=10`). Creating the `unbottled` DB + the subscription is a
   pure additive operation; heilpraktiker's `postgres` DB is never read or
   written.
3. All replication traffic rides **WireGuard** (`10.88.0.1:5432`), never the
   public internet. Postgres' host port stays bound to the WG IP (see
   `ha/postgres/expose-pg-on-wg.md`).

## Failover model

The app always connects to the **live primary** through **PgBouncer** running on
each node (`ha/postgres/pgbouncer/`). PgBouncer's `[databases]` entry points at
the private VIP `10.88.0.10:5432` (keepalived-owned, always on the node that is
currently primary). On a Server-1 loss:

1. keepalived moves the VIP `10.88.0.10` to Server 2 and runs the
   `notify_master` hook (`ha/keepalived/notify-pg.sh`), which **promotes** the
   Server 2 `unbottled` DB: `ALTER SUBSCRIPTION ... DISABLE` + make it writable
   (it already is — a logical subscriber is a normal read/write DB; we just stop
   pulling from the dead primary and repoint the apps).
2. PgBouncer on both nodes now resolves `10.88.0.10` to Server 2 → apps write
   there. No app restart (PgBouncer `RECONNECT`/pause-resume via the hook).
3. **Failback** is manual + supervised (re-seed Server 1 from Server 2, re-point
   the publication) because logical replication has no automatic re-sync — see
   `failback.md`. This is the deliberate tradeoff of logical vs. physical: it
   survives a node loss with the data that replicated, and failback is a
   controlled operation rather than an automatic (and possibly split-brain) one.

> **Split-brain guard**: keepalived uses `nopreempt` + a shared VRRP auth pass,
> and the promote hook writes a `PROMOTED` sentinel. Server 1 must NOT auto-take
> the primary role back on reboot while Server 2 holds `PROMOTED`; the failback
> runbook clears it explicitly.

## Files

- `01-primary-setup.sql` — run on Server 1: set up publication + replication role.
- `02-replica-setup.sql` — run on Server 2 shared container: create `unbottled`
  DB + subscription.
- `setup-replication.sh` — orchestrates both over SSH/WireGuard (idempotent).
- `pgbouncer/` — per-node PgBouncer config + compose service.
- `expose-pg-on-wg.md` — how each PG binds its 5432 to the WG IP only.
- `failback.md` — supervised re-sync procedure after a failover.
