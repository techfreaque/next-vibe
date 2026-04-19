#!/bin/bash
set -e

compose() { docker compose -f docker-compose.prod.yml "$@" 2>/dev/null; }
COMPOSE=compose

git stash
git pull

# Build postgres image first (includes plv8 + pgvector via Dockerfile.postgres)
$COMPOSE build postgres

# Ensure postgres is running and healthy (restarts if image changed)
$COMPOSE up -d postgres
echo "Waiting for postgres..."
until $COMPOSE exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  sleep 1
done

# Build app image (old container keeps running while new image builds)
$COMPOSE build app

# Run migrations using the new image (separate one-off container, old app still serving)
echo "Running migrations..."
if ! $COMPOSE run --rm app \
  bun src/app/api/\[locale\]/system/unified-interface/cli/vibe-runtime.ts migrate; then
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

