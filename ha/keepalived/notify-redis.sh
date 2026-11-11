#!/bin/bash
# Optional companion to notify-pg.sh: on becoming DB-VIP master, make sure Redis
# has also failed over (2-node Sentinel may need a manual trigger — see
# ha/redis/README.md quorum caveat). HAProxy already routes to whichever Redis
# reports role:master, so this just ACCELERATES promotion if Sentinel stalled.
set -u
STATE="${1:-}"
ENVF="/etc/keepalived/pg-notify.env"
[ -f "$ENVF" ] && . "$ENVF"
SENTINEL_CONTAINER="${SENTINEL_CONTAINER:-unbottled-redis-sentinel}"
REDIS_PASSWORD="${REDIS_PASSWORD:-}"
log() { logger -t keepalived-redis "$*"; echo "$*"; }

if [ "$STATE" = "master" ]; then
  log "Redis: requesting Sentinel failover of mymaster (if master is down)"
  docker exec "$SENTINEL_CONTAINER" \
    redis-cli -p 26379 SENTINEL failover mymaster 2>/dev/null \
    || log "sentinel failover skipped (already promoted or sentinel down)"
fi
