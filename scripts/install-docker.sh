#!/bin/bash
git stash
git pull
set -e

# Build and start
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
docker builder prune -a -f