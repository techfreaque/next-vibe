#!/bin/bash
set -e

compose() { docker compose -f docker-compose.prod.yml "$@" 2>/dev/null; }
COMPOSE=compose

# DESTRUCTIVE: this is a DEPLOY/UPDATE script for a dedicated deploy box. It
# force-syncs the checkout to origin, DISCARDING any uncommitted local changes.
# Do NOT run it on a working tree you have edits in. Set NO_GIT_RESET=1 to skip.
if [ "${NO_GIT_RESET:-0}" != "1" ]; then
  git fetch origin
  git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
fi

# Build postgres image first (includes plv8 + pgvector via Dockerfile.postgres)
$COMPOSE build postgres

# Ensure postgres is running and healthy (restarts if image changed)
$COMPOSE up -d postgres
echo "Waiting for postgres..."
until $COMPOSE exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  sleep 1
done

# Pull the app image built + pushed elsewhere (see: vibe image-push) - this box no longer
# builds the app itself. Old container keeps running while the new image pulls.
# `vibe image-push --sshTarget=user@this-host` transfers the image directly (docker save |
# ssh | docker load) instead of a registry, so it's already present locally with no registry
# entry to pull from - pull failure there is expected, not fatal, as long as the image exists.
echo "Pulling app image..."
if ! $COMPOSE pull app; then
  IMAGE_REF=$($COMPOSE config --images app 2>/dev/null | head -1)
  if [ -n "$IMAGE_REF" ] && docker image inspect "$IMAGE_REF" > /dev/null 2>&1; then
    echo "Pull failed, but $IMAGE_REF is already present locally (e.g. via 'vibe image-push --sshTarget=...') - continuing with it."
  else
    echo "ERROR: Failed to pull app image, and it's not present locally either."
    echo "  Run 'vibe image-push' first - push to a registry, or pass --sshTarget=user@$(hostname) to transfer it directly here."
    exit 1
  fi
fi

# Run migrations using the new image (separate one-off container, old app still serving)
echo "Running migrations..."
if ! $COMPOSE run --rm app \
  bun src/vibe/platforms/cli/vibe-runtime.ts migrate; then
  echo "ERROR: Migration failed! Old container is still running - prod is NOT down."
  echo "Fix the migration and re-run this script."
  exit 1
fi

# Archive the OUTGOING app container's logs to the host BEFORE recreate.
# Docker's json-file log lives under /var/lib/docker/containers/<id>/ and is
# DELETED when the container is recreated below, so without this every deploy
# wipes the prior container's 6-24h of history (this bit us triaging prod WS +
# auth 403 errors after a redeploy). Dumping `docker logs` to a host dir makes
# each outgoing container's history survive the swap. Non-fatal: a failure here
# never blocks the deploy. Old archives are pruned to the newest LOG_ARCHIVE_KEEP.
LOG_ARCHIVE_DIR="${LOG_ARCHIVE_DIR:-/unbottled/logs}"
LOG_ARCHIVE_KEEP="${LOG_ARCHIVE_KEEP:-30}"
APP_CONTAINER="${APP_CONTAINER_NAME:-next-vibe-app}"
archive_app_logs() {
  mkdir -p "$LOG_ARCHIVE_DIR" 2>/dev/null || { echo "  (log archive: cannot create $LOG_ARCHIVE_DIR, skipping)"; return 0; }
  if docker inspect "$APP_CONTAINER" >/dev/null 2>&1; then
    local ts out
    ts="$(date -u +%Y%m%d-%H%M%S)"
    out="$LOG_ARCHIVE_DIR/app-${ts}.log"
    echo "Archiving outgoing app logs to ${out} ..."
    docker logs "$APP_CONTAINER" > "$out" 2>&1 || echo "  (log archive: docker logs failed, continuing)"
    gzip -f "$out" 2>/dev/null || true
    # Prune: keep only the newest LOG_ARCHIVE_KEEP archives.
    ls -1t "$LOG_ARCHIVE_DIR"/app-*.log.gz "$LOG_ARCHIVE_DIR"/app-*.log 2>/dev/null \
      | tail -n +$((LOG_ARCHIVE_KEEP + 1)) | xargs -r rm -f 2>/dev/null || true
  else
    echo "  (log archive: no running $APP_CONTAINER yet, nothing to archive)"
  fi
}
archive_app_logs

# Swap: bring up new app container (replaces old one).
# --force-recreate is REQUIRED here: the app image is pinned to a fixed tag
# (":latest") and transferred directly via `docker load` (vibe image-push),
# not pulled from a registry compose can diff by digest - `up -d` alone sees
# no service-config change and leaves the OLD container running unchanged
# even though a brand new image was just loaded under the same tag. Without
# this flag every deploy "succeeds" (waits for /, gets 200 from the still-
# running old container) while silently shipping nothing.
echo "Starting new app container..."
$COMPOSE up -d --force-recreate app

# Wait for the new container to be healthy (up to 180s)
# Check from the host via the mapped port - not inside the container.
# The app runs a Bun proxy on port 3000 which proxies to Next.js on 3100 internally;
# only the host-side port reliably reflects when both layers are ready.
echo "Waiting for new app to respond..."
TRIES=0
MAX_TRIES=90
until curl -sf --max-time 3 http://localhost:3000 > /dev/null 2>&1; do
  # Bail early if container has already exited
  STATUS=$($COMPOSE ps -q app | xargs docker inspect --format='{{.State.Status}}' 2>/dev/null || echo "missing")
  if [ "$STATUS" = "exited" ] || [ "$STATUS" = "missing" ]; then
    echo "ERROR: App container exited during startup. Check logs:"
    echo "  $COMPOSE logs --tail=50 app"
    exit 1
  fi
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    WAIT_SECS=$((MAX_TRIES * 2))
    echo "ERROR: New app not responding after ${WAIT_SECS}s. Check logs:"
    echo "  $COMPOSE logs --tail=50 app"
    exit 1
  fi
  sleep 2
done

echo "Deployment successful - new app is responding."
echo "Cleaning up docker resources..."
# Reclaim disk WITHOUT destroying the rollback image. `docker system prune -a`
# would delete every image not attached to a running container - including the
# `:rollback` tag image-push just set to the previous release, leaving no way
# back. So prune only build cache and DANGLING (untagged <none>) images, which
# never includes the tagged :rollback or :latest images.
docker builder prune -a -f
docker image prune -f
# Only dangling (anonymous, unreferenced) volumes - NEVER `-a`, which would also
# target named volumes like the Postgres data volume. The DB volume survives.
docker volume prune -f

