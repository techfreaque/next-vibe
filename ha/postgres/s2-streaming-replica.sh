#!/bin/bash
# ============================================================================
# s2-streaming-replica.sh — physical streaming hot standby of PROD Postgres
# (Server 1 prod-postgres) on Server 2, plus the manual failover lever.
#
# Runs ON Server 2. Replication goes over WireGuard to 10.88.0.1:5432 (the
# pg-wg-forward socat in front of prod-postgres) as role `replicator`, through
# the physical slot `s2_replica` (S1 caps retained WAL with
# max_slot_wal_keep_size, so a dead S2 can never fill S1's disk).
#
#   REPL_PASSWORD=... bash s2-streaming-replica.sh init     # base backup + start (idempotent refuse if data exists)
#   bash s2-streaming-replica.sh status                     # lag, slot, recovery state
#   bash s2-streaming-replica.sh promote                    # FAILOVER ONLY: S1 is dead
#
# Image: `unbottled-postgres:prod-s1` = the exact image prod runs on S1 (same
# PG minor + plv8 + pgvector binaries), transferred with docker save|load.
# Container: unbottled-pg-replica on unbottled_app-network, alias pg-replica,
# host port 127.0.0.1:5434 for checks. Data: /srv/unbottled/pg-replica.
#
# NEVER run `promote` while S1 is alive: that splits the brain (two writable
# primaries). Promotion is the documented manual failover in
# ha/FAILOVER-S1-DOWN.md, not an automatic action.
# ============================================================================
set -euo pipefail
IMAGE="${REPLICA_IMAGE:-unbottled-postgres:prod-s1}"
NAME="unbottled-pg-replica"
DATA="/srv/unbottled/pg-replica"
NET="unbottled_app-network"
PRIMARY_HOST="10.88.0.1"
SLOT="s2_replica"

cmd="${1:-status}"
case "$cmd" in
init)
  : "${REPL_PASSWORD:?set REPL_PASSWORD (role replicator)}"
  if docker inspect "$NAME" >/dev/null 2>&1; then echo "$NAME already exists; refusing"; exit 1; fi
  if [ -n "$(ls -A "$DATA" 2>/dev/null)" ]; then echo "$DATA not empty; refusing (move it aside first)"; exit 1; fi
  mkdir -p "$DATA"
  echo "base backup from $PRIMARY_HOST (slot $SLOT, rate-limited)…"
  docker run --rm --network host -e PGPASSWORD="$REPL_PASSWORD" \
    -v "$DATA":/var/lib/postgresql/data --entrypoint bash "$IMAGE" -c "
      set -e
      pg_basebackup -h $PRIMARY_HOST -p 5432 -U replicator -D /var/lib/postgresql/data \
        -X stream -R -C -S $SLOT --checkpoint=spread --max-rate=30M -P -v
      chown -R postgres:postgres /var/lib/postgresql/data
      chmod 700 /var/lib/postgresql/data"
  docker run -d --name "$NAME" --restart unless-stopped \
    --network "$NET" --network-alias pg-replica \
    -p 127.0.0.1:5434:5432 \
    --log-opt max-size=20m --log-opt max-file=5 \
    -v "$DATA":/var/lib/postgresql/data \
    "$IMAGE" postgres -c hot_standby=on -c hot_standby_feedback=on \
      -c wal_level=replica -c max_wal_senders=10 -c max_replication_slots=10
  echo "started $NAME"; sleep 5; exec bash "$0" status
  ;;
status)
  docker exec "$NAME" psql -U postgres -Atc "select 'in_recovery='||pg_is_in_recovery(), 'receive_lsn='||coalesce(pg_last_wal_receive_lsn()::text,'-'), 'replay_lsn='||coalesce(pg_last_wal_replay_lsn()::text,'-'), 'replay_lag='||coalesce((now()-pg_last_xact_replay_timestamp())::text,'-')"
  docker exec "$NAME" psql -U postgres -Atc "select 'wal_receiver='||status||' sender='||sender_host from pg_stat_wal_receiver" || true
  ;;
promote)
  echo "!! FAILOVER: promoting $NAME to a WRITABLE primary. Only do this when Server 1 is DOWN."
  read -r -p "type PROMOTE to continue: " ok; [ "$ok" = "PROMOTE" ] || { echo aborted; exit 1; }
  docker exec -u postgres "$NAME" pg_ctl promote -D /var/lib/postgresql/data
  sleep 3; docker exec "$NAME" psql -U postgres -Atc "select 'in_recovery='||pg_is_in_recovery()"
  ;;
*) echo "usage: $0 init|status|promote"; exit 2;;
esac
