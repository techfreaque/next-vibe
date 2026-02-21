#!/bin/bash
git stash
git pull
set -e

# Build image (no DB access during build)
docker compose -f docker-compose.prod.yml build

# Ensure postgres is running and healthy
docker compose -f docker-compose.prod.yml up -d postgres
echo "Waiting for postgres..."
until docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  sleep 1
done

# Run migrations using the new image inside the compose network (where postgres is reachable)
docker compose -f docker-compose.prod.yml run --rm app \
  bun src/app/api/\[locale\]/system/unified-interface/cli/vibe-runtime.ts migrate

# Start everything
docker compose -f docker-compose.prod.yml up -d
docker builder prune -a -f