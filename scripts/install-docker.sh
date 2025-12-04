#!/bin/bash
set -e

# Build and start
docker compose -f docker-compose.prod.yml up -d --build --no-cache
