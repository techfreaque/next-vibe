#!/bin/bash
# ============================================================================
# deploy-ha-node.sh — roll the unbottled app on a SECONDARY HA node (Server 2).
#
# Called by `vibe image-push` AFTER Server 1 (primary: migrations + task runner)
# deployed healthy. image-push has already:
#   - loaded the new image on this box and tagged it :${IMAGE_TAG} (never
#     :latest, which belongs to the co-hosted heilpraktiker site), moving the
#     previous one to :${IMAGE_TAG}-rollback;
#   - optionally dropped Server 1's current .env at .env.from-s1.
#
# Steps: merge .env (S1 identity + this node's infra overrides) -> archive logs
# -> recreate the app (SIGTERM stream drain via stop_grace_period) -> health
# wait -> on failure roll back to :${IMAGE_TAG}-rollback and exit 1.
# While this node's app is down, this box's Caddy serves unbottled.ai from
# Server 1 over WireGuard (lb_policy first), so the roll is uninterrupted.
#
# Runs from /root/unbottled (image-push cds there). Never touches heilpraktiker.
# ============================================================================
set -euo pipefail

PROJECT="${HA_COMPOSE_PROJECT:-unbottled}"
APP="${HA_APP_CONTAINER:-unbottled-app}"
IMAGE_NAME="${DOCKER_IMAGE_NAME:-ghcr.io/techfreaque/next-vibe-app}"
IMAGE_TAG="${HA_IMAGE_TAG:-unbottled}"
ROLLBACK_TAG="${IMAGE_TAG}-rollback"
HEALTH_URL="${HA_HEALTH_URL:-http://10.88.0.2:3100/robots.txt}"
LOG_ARCHIVE_DIR="${LOG_ARCHIVE_DIR:-/root/unbottled/logs}"
LOG_ARCHIVE_KEEP="${LOG_ARCHIVE_KEEP:-30}"
# shellcheck disable=SC2206
FILES=(${HA_COMPOSE_FILES:--f docker-compose.prod.yml -f docker-compose.standalone.yml -f docker-compose.s2-ha.yml})

log() { printf '%s [ha-node] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
compose() { docker compose -p "$PROJECT" --env-file .env "${FILES[@]}" "$@"; }

# 1. Env: Server 1's .env is the source of truth for identity/keys/URLs.
if [ -f .env.from-s1 ]; then
  if [ -f ha/scripts/merge-env.py ] && [ -f .ha-database-url ]; then
    cp .env ".env.bak.deploy-$(date -u +%Y%m%d%H%M%S)"
    python3 ha/scripts/merge-env.py .env.from-s1 .env .env.next .ha-database-url
    chmod 600 .env.next
    mv .env.next .env
    log "env merged from Server 1"
    ls -1t .env.bak.deploy-* 2>/dev/null | tail -n +6 | xargs -r rm -f
  else
    log "WARN: .env.from-s1 present but merge-env.py or .ha-database-url missing; keeping current .env"
  fi
  rm -f .env.from-s1
fi

# 2. Promote the freshly loaded image (HA_NEW_IMAGE_REF, set by image-push) to
#    :${IMAGE_TAG}, keeping the current one as :${ROLLBACK_TAG}. Tags move only
#    here, so a primary deploy that failed after the transfer leaves this node's
#    tags (and its next restart) on the old image.
if [ -n "${HA_NEW_IMAGE_REF:-}" ]; then
  docker image inspect "$HA_NEW_IMAGE_REF" >/dev/null || { log "ERROR: $HA_NEW_IMAGE_REF not loaded"; exit 1; }
  if docker image inspect "${IMAGE_NAME}:${IMAGE_TAG}" >/dev/null 2>&1; then
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:${ROLLBACK_TAG}"
  fi
  docker tag "$HA_NEW_IMAGE_REF" "${IMAGE_NAME}:${IMAGE_TAG}"
  log "tagged $HA_NEW_IMAGE_REF as :${IMAGE_TAG} (previous kept as :${ROLLBACK_TAG})"
fi

# 3. Sanity: the stack renders and points at the expected image.
REF="$(compose config --images app | head -1)"
[ "$REF" = "${IMAGE_NAME}:${IMAGE_TAG}" ] || { log "ERROR: compose resolves app image to '$REF', expected ${IMAGE_NAME}:${IMAGE_TAG}"; exit 1; }
docker image inspect "$REF" >/dev/null

archive_logs() {
  mkdir -p "$LOG_ARCHIVE_DIR" 2>/dev/null || return 0
  if docker inspect "$APP" >/dev/null 2>&1; then
    local out; out="$LOG_ARCHIVE_DIR/app-$(date -u +%Y%m%d-%H%M%S).log"
    docker logs "$APP" > "$out" 2>&1 || true
    gzip -f "$out" 2>/dev/null || true
    ls -1t "$LOG_ARCHIVE_DIR"/app-*.log.gz 2>/dev/null | tail -n +$((LOG_ARCHIVE_KEEP + 1)) | xargs -r rm -f || true
  fi
}

health_wait() {
  local tries=0
  until [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$HEALTH_URL" || true)" = "200" ]; do
    local st; st="$(docker inspect -f '{{.State.Status}}' "$APP" 2>/dev/null || echo missing)"
    if [ "$st" = "exited" ] || [ "$st" = "missing" ]; then log "app container $st"; return 1; fi
    tries=$((tries + 1)); [ "$tries" -ge 90 ] && { log "no 200 from $HEALTH_URL after 180s"; return 1; }
    sleep 2
  done
}

# 4. Roll.
archive_logs
log "recreating $APP on ${IMAGE_NAME}:${IMAGE_TAG} (Server 1 covers traffic meanwhile)"
compose up -d --no-deps --force-recreate app
if health_wait; then
  log "OK: $APP healthy on $(docker inspect -f '{{.Image}}' "$APP" | cut -c8-19)"
  docker image prune -f >/dev/null 2>&1 || true
  exit 0
fi

# 5. Roll back.
log "ERROR: new image unhealthy, rolling back to :${ROLLBACK_TAG}"
compose logs --tail=60 app || true
if docker image inspect "${IMAGE_NAME}:${ROLLBACK_TAG}" >/dev/null 2>&1; then
  docker tag "${IMAGE_NAME}:${ROLLBACK_TAG}" "${IMAGE_NAME}:${IMAGE_TAG}"
  compose up -d --no-deps --force-recreate app
  health_wait && log "rolled back, $APP healthy on previous image" || log "ROLLBACK ALSO UNHEALTHY: Server 1 is carrying all traffic"
fi
exit 1
