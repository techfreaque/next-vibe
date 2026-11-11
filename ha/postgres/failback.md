# Postgres failback (after a Server-1 loss + failover to Server 2)

Logical replication has **no automatic re-sync**. After Server 2 has been
serving as primary, bringing Server 1 back is a supervised operation. Do NOT let
Server 1 auto-resume the primary role on boot (keepalived `nopreempt` +
`PROMOTED` sentinel guard).

## State after failover

- keepalived moved VIP `10.88.0.10` to Server 2; `notify-pg.sh master` ran:
  disabled `unbottled_sub` (Server 1 is gone), left the `unbottled` DB writable.
- Apps write to Server 2 via PgBouncer → VIP → Server 2.
- Server 1's data is now STALE (anything written to Server 2 since the failover
  is missing on Server 1).

## Failback procedure (planned window)

1. **Bring Server 1 Postgres up** but keep it out of the LB/VIP (keepalived
   stays BACKUP on srv1 while `PROMOTED` sentinel exists on srv2).
2. **Re-seed Server 1 from Server 2** (Server 2 is now the source of truth):
   - On Server 1, drop + recreate the `postgres` DB (or a fresh `unbottled`),
     load a fresh `pg_dump` from Server 2's `unbottled` DB.
   - Reverse the direction temporarily: make Server 2 the publisher and Server 1
     the subscriber until caught up (`setup-replication.sh` with PRIMARY_WG=10.88.0.2
     and swapped DBs), OR take a short write-freeze and a full dump/restore.
3. **Bump sequences** on the re-seeded node past each table's max id (logical
   replication does not carry sequence state):
   ```sql
   SELECT 'SELECT setval('||quote_literal(quote_ident(n.nspname)||'.'||quote_ident(s.relname))||
          ', COALESCE((SELECT MAX('||quote_ident(a.attname)||') FROM '||
          quote_ident(t.relname)||'),1));'
   FROM pg_class s JOIN pg_depend d ON d.objid=s.oid
   JOIN pg_class t ON t.oid=d.refobjid
   JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=d.refobjsubid
   JOIN pg_namespace n ON n.oid=s.relnamespace
   WHERE s.relkind='S'; \gexec
   ```
4. **Cut back**: brief write-freeze (toggle the app to read-only or stop writes
   for ~30s), confirm Server 1 is fully caught up, clear the `PROMOTED` sentinel
   on srv2, let keepalived move the VIP back to srv1 (manual trigger, not
   preempt), re-establish Server1→Server2 logical replication the original
   direction, re-enable apps.

## Why this is the right tradeoff

A single-instance shared Postgres on Server 2 **cannot** be a physical hot
standby of Server 1 (it is heilpraktiker's own primary). Logical replication is
the only way to keep a live copy there. The cost is a manual, supervised
failback — acceptable because failover (the urgent direction) IS automatic, and
failback happens on your schedule with no data at risk if done in a window.
