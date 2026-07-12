#!/bin/bash
set -e

compose() { docker compose -f docker-compose.prod.yml "$@" 2>/dev/null; }
COMPOSE=compose

git fetch origin
git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)

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
  bun src/app/api/\[locale\]/system/platforms/cli/vibe-runtime.ts migrate; then
  echo "ERROR: Migration failed! Old container is still running - prod is NOT down."
  echo "Fix the migration and re-run this script."
  exit 1
fi

# Swap: bring up new app container (replaces old one)
echo "Starting new app container..."
$COMPOSE up -d app

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
docker system prune -a -f
docker volume prune -a -f

