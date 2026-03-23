#!/bin/bash
set -e

compose() { docker compose -f docker-compose.prod.yml "$@" 2>/dev/null; }
COMPOSE=compose

git stash
git pull

# Build NEW image with a distinct tag so the old container keeps running
$COMPOSE build

# Ensure postgres is running and healthy
$COMPOSE up -d postgres
echo "Waiting for postgres..."
until $COMPOSE exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  sleep 1
done

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
echo "Waiting for new app to respond..."
TRIES=0
MAX_TRIES=90
until $COMPOSE exec -T app wget -q --server-response -O /dev/null http://localhost:3000 2>&1 | grep -q "HTTP/"; do
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

