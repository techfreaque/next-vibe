#!/bin/bash
set -euo pipefail

# ============================================================================
# One-time (idempotent) migration: filesystem chat uploads  ->  MinIO bucket
# ============================================================================
#
# WHY: the filesystem storage adapter writes to the per-container
#   CHAT_STORAGE_PATH (prod: /app/uploads/chat, host bind /next-vibe-uploads).
# The S3/MinIO adapter stores the same files under the bucket key prefix
#   chat-attachments/{threadId}/...  (+ .metadata/{fileId}.json).
# This script copies the existing on-disk tree into the bucket so previously
# uploaded/generated media keeps resolving after CHAT_STORAGE_TYPE flips to s3.
#
# Layout mapping (unchanged structure, just a prefix):
#   HOST  /next-vibe-uploads/chat/{threadId}/{fileId}.ext
#   HOST  /next-vibe-uploads/chat/{threadId}/.metadata/{fileId}.json
#        ->  s3://{bucket}/chat-attachments/{threadId}/{fileId}.ext
#        ->  s3://{bucket}/chat-attachments/{threadId}/.metadata/{fileId}.json
#
# IDEMPOTENT: `mc mirror` only transfers new/changed objects; safe to re-run.
# It runs a throwaway minio/mc container that SHARES the running minio
# container's network namespace (--network container:prod-minio), so the bucket
# needs no published port.
#
# Usage (run on the deploy box, after `minio` + `minio-init` are up):
#   bash scripts/migrate-uploads-to-minio.sh
#
# Overridable via env:
#   SRC_HOST_DIR (default /next-vibe-uploads/chat)
#   MINIO_CONTAINER (default prod-minio)
#   ENV_FILE (default .env)  — read for MINIO_ROOT_USER/PASSWORD, S3_BUCKET
# ============================================================================

ENV_FILE="${ENV_FILE:-.env}"
SRC_HOST_DIR="${SRC_HOST_DIR:-/next-vibe-uploads/chat}"
MINIO_CONTAINER="${MINIO_CONTAINER:-prod-minio}"
# Chainguard image (freely pullable, ships a shell + mc). NOT docker.io/minio/mc,
# which is gated behind a registry login as of 2025. Matches docker-compose.prod.yml.
MC_IMAGE="${MC_IMAGE:-cgr.dev/chainguard/minio:latest}"

# Load creds + bucket from .env if present (shell-safe: only the three keys).
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  eval "$(grep -E '^(MINIO_ROOT_USER|MINIO_ROOT_PASSWORD|S3_BUCKET)=' "$ENV_FILE" | sed 's/^/export /')"
fi
MINIO_ROOT_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:-minioadmin}"
S3_BUCKET="${S3_BUCKET:-chat-media}"

if [ ! -d "$SRC_HOST_DIR" ]; then
  echo "No source directory at '$SRC_HOST_DIR' - nothing to migrate. Done."
  exit 0
fi

if ! docker inspect "$MINIO_CONTAINER" >/dev/null 2>&1; then
  echo "ERROR: MinIO container '$MINIO_CONTAINER' is not running."
  echo "  Start it first:  docker compose -f docker-compose.prod.yml up -d minio minio-init"
  exit 1
fi

echo "Migrating '$SRC_HOST_DIR'  ->  s3://$S3_BUCKET/chat-attachments/ ..."

# --user 0:0 (root): the app container runs as root, so /next-vibe-uploads is
# root-owned. The mc image's default non-root user (uid 65532) cannot read the
# bind-mounted source, so mirror would silently transfer 0 bytes. Run as root to
# read any-owner source; it only reads /src (:ro) and writes to the bucket.
docker run --rm \
  --user 0:0 \
  --network "container:$MINIO_CONTAINER" \
  -v "$SRC_HOST_DIR":/src:ro \
  -e MC_USER="$MINIO_ROOT_USER" \
  -e MC_PASS="$MINIO_ROOT_PASSWORD" \
  -e MC_BUCKET="$S3_BUCKET" \
  --entrypoint /bin/sh \
  "$MC_IMAGE" -c '
    set -e
    until mc alias set local http://localhost:9000 "$MC_USER" "$MC_PASS"; do
      echo "waiting for minio..."; sleep 1;
    done
    mc mb --ignore-existing "local/$MC_BUCKET"
    # --overwrite keeps re-runs correct if a source file changed; identical
    # objects are skipped, so repeated runs are cheap and non-destructive.
    mc mirror --overwrite /src/ "local/$MC_BUCKET/chat-attachments/"
    echo "Migration complete."
    echo "Object count under chat-attachments/:"
    mc ls --recursive "local/$MC_BUCKET/chat-attachments/" | wc -l
  '

echo "Done."
