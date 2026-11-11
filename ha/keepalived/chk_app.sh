#!/bin/bash
# keepalived health track: exit 0 if the LOCAL unbottled app is healthy.
# The health endpoint returns overall "critical" during graceful drain or when
# the DB is unreachable, which we treat as unhealthy so the VIP leaves this node.
set -u
PORT="${APP_LOCAL_PORT:-3100}"   # srv1: 3000, srv2: 3100 (set per node)
BIND="${APP_LOCAL_BIND:-127.0.0.1}"
URL="http://${BIND}:${PORT}/vibe/platforms/web/health"
body="$(curl -fsS --max-time 2 "$URL" 2>/dev/null)" || exit 1
# Fail on overall critical (drain / db-down). "healthy"/"warning" pass.
echo "$body" | grep -q '"status":"critical"' && exit 1
exit 0
