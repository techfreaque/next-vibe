#!/bin/bash
# keepalived VI_DB notify hook. Runs on state change of the private DB VIP.
#   master → this node now owns 10.88.0.10 → become the write primary.
#   backup/fault → step down.
# Env (set in /etc/keepalived/pg-notify.env, sourced here):
#   SHARED_PG_CONTAINER (srv2: prod-postgres), REPLICA_DB (unbottled),
#   PGBOUNCER_CONTAINER (unbottled-pgbouncer), PG_SUPERUSER.
set -u
STATE="${1:-}"
ENVF="/etc/keepalived/pg-notify.env"
[ -f "$ENVF" ] && . "$ENVF"
SHARED_PG_CONTAINER="${SHARED_PG_CONTAINER:-prod-postgres}"
REPLICA_DB="${REPLICA_DB:-unbottled}"
PGBOUNCER_CONTAINER="${PGBOUNCER_CONTAINER:-unbottled-pgbouncer}"
PG_SUPERUSER="${PG_SUPERUSER:-postgres}"
SENTINEL="/var/run/keepalived-pg.promoted"
log() { logger -t keepalived-pg "$*"; echo "$*"; }

promote() {
  log "PROMOTE: taking Postgres primary role ($REPLICA_DB)"
  # Stop pulling from the (now dead) upstream so this node is an independent
  # primary. DISABLE is reversible for a controlled failback.
  docker exec "$SHARED_PG_CONTAINER" psql -U "$PG_SUPERUSER" -d "$REPLICA_DB" \
    -c "ALTER SUBSCRIPTION unbottled_sub DISABLE;" 2>/dev/null \
    || log "subscription disable skipped (none or already primary)"
  # Nudge PgBouncer to re-resolve the VIP (now local) and resume.
  docker exec "$PGBOUNCER_CONTAINER" sh -c \
    "psql -h 127.0.0.1 -p 6432 -U '$PG_SUPERUSER' pgbouncer -c 'RECONNECT;' -c 'RESUME;'" 2>/dev/null \
    || log "pgbouncer reconnect skipped"
  touch "$SENTINEL"
  log "PROMOTE done; sentinel $SENTINEL written (clear it on controlled failback)."
}

stepdown() {
  log "STEP DOWN ($STATE): this node is no longer the DB VIP owner"
  # Pause PgBouncer briefly so clients re-resolve to the new VIP owner.
  docker exec "$PGBOUNCER_CONTAINER" sh -c \
    "psql -h 127.0.0.1 -p 6432 -U '$PG_SUPERUSER' pgbouncer -c 'PAUSE;' -c 'RESUME;'" 2>/dev/null || true
}

case "$STATE" in
  master) promote ;;
  backup|fault) stepdown ;;
  *) log "unknown state '$STATE'";;
esac
