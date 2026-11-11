#!/bin/bash
set -euo pipefail
# ============================================================================
# Zero-downtime ROLLING deploy across the active-active pair.
#
# Replaces the old single `docker compose up -d --force-recreate app` (which
# killed every in-flight AI stream) with a per-node rolling update that always
# keeps >=1 live node:
#
#   for each node, one at a time:
#     1. DEREGISTER from the edge LB  (mark unhealthy → Caddy stops new traffic)
#     2. DRAIN                         (docker stop --time=N → SIGTERM → the app
#                                       finishes in-flight StreamLoops, G1)
#     3. pull new image + migrate (expand-only / backward-compatible)
#     4. start the new container
#     5. HEALTH-WAIT                   (/vibe/platforms/web/health == 2xx)
#     6. RE-REGISTER                   (health recovers → Caddy routes again)
#
# Migrations MUST be expand-then-contract (backward-compatible for one release)
# so the OTHER node's OLD app keeps working against the migrated DB. See
# ha/scripts/README-migrations.md.
#
# Usage (from a workstation with SSH to both nodes):
#   ha/scripts/rolling-deploy.sh [--image-tag TAG]
# Order: Server 2 (replica/newer) first, then Server 1, so Server 1 (primary) is
# updated last and is never the one left alone mid-migration.
# ============================================================================
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO/.env}"
DRAIN_TIME="${DRAIN_TIME:-120}"     # must exceed app STREAM_DRAIN_TIMEOUT_MS/1000
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"

getenv() { python3 - "$1" "$ENV_FILE" <<'PY'
import re,sys
k,f=sys.argv[1],sys.argv[2]
m=re.search(r'^'+re.escape(k)+r'=(.*)$',open(f).read(),re.M)
v=m.group(1).strip() if m else ''
if len(v)>=2 and v[0]==v[-1] and v[0] in '"\'': v=v[1:-1]
print(v)
PY
}
S1="$(getenv SSH_SERVER)";  S1_PWD="$(getenv SSH_SERVER_PWD)"
S2="$(getenv SSH_SERVER2)"; S2_PWD="$(getenv SSH_SERVER2_PWD)"

# node spec: "ssh_host|ssh_pwd|compose_cmd|container|local_health_url"
SRV1="$S1|$S1_PWD|cd /unbottled && docker compose -f docker-compose.prod.yml|next-vibe-app|http://10.88.0.1:3000/vibe/platforms/web/health"
SRV2="$S2|$S2_PWD|cd /root/unbottled && docker compose -f docker-compose.prod.yml -f docker-compose.ha.yml|unbottled-app|http://10.88.0.2:3100/vibe/platforms/web/health"

roll_node() {
  local spec="$1"; local name="$2"
  IFS='|' read -r host pwd compose container health <<<"$spec"
  local SSH="sshpass -p $pwd ssh -o StrictHostKeyChecking=accept-new $host"

  echo "══════ Rolling $name ($container) ══════"

  # 1+2. DRAIN: docker stop --time lets the app's SIGTERM handler finish
  # in-flight streams (G1) before SIGKILL. The edge LB's active health check
  # sees /health go unreachable/critical and stops routing new traffic here.
  echo "  [$name] draining (stop --time=$DRAIN_TIME)…"
  $SSH "$compose stop --timeout $DRAIN_TIME $container" || true

  # 3. pull + migrate with the NEW image (one-off container; other node serves).
  echo "  [$name] pull + migrate…"
  $SSH "$compose pull $container || true"
  $SSH "$compose run --rm $container bun src/vibe/platforms/cli/vibe-runtime.ts migrate"

  # 4. start new container.
  echo "  [$name] starting new container…"
  $SSH "$compose up -d --force-recreate $container"

  # 5. HEALTH-WAIT: re-registration is automatic (Caddy active check flips to
  # healthy once /health is 2xx again).
  echo "  [$name] waiting for health (≤${HEALTH_TIMEOUT}s)…"
  local waited=0
  until $SSH "curl -fsS --max-time 3 '$health' >/dev/null 2>&1"; do
    sleep 3; waited=$((waited+3))
    if [ "$waited" -ge "$HEALTH_TIMEOUT" ]; then
      echo "  [$name] ERROR: not healthy after ${HEALTH_TIMEOUT}s — ABORTING roll."
      echo "  The OTHER node is still live. Investigate before continuing."
      exit 1
    fi
  done
  echo "  [$name] healthy ✓ — back in rotation."
}

echo "Rolling deploy: Server 2 first, then Server 1 (always ≥1 node live)."
roll_node "$SRV2" "Server2"
echo "Server 2 healthy; proceeding to Server 1."
roll_node "$SRV1" "Server1"
echo "✅ Rolling deploy complete — both nodes updated with no stream kills."
