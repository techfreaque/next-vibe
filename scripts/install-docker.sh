#!/bin/bash
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"

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
  echo "ERROR: Migration failed! Old container is still running — prod is NOT down."
  echo "Fix the migration and re-run this script."
  exit 1
fi

# Swap: bring up new app container (replaces old one)
echo "Starting new app container..."
$COMPOSE up -d app

# Wait for the new container to be healthy (up to 60s)
echo "Waiting for new app to respond..."
TRIES=0
MAX_TRIES=30
until curl -sf http://localhost:3000 > /dev/null 2>&1; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    echo "WARNING: New app not responding after ${MAX_TRIES}s. Check logs:"
    echo "  $COMPOSE logs --tail=50 app"
    exit 1
  fi
  sleep 2
done

echo "Deployment successful — new app is responding."
echo "Cleaning up docker resources..."
docker system prune -a -f
docker volume prune -a -f

