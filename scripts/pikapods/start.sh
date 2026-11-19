#!/bin/sh
set -eu
: "${DATABASE_URL:?Set the URL of the managed PostgreSQL database}"
: "${NEXT_PUBLIC_APP_URL:?Set the public origin of the pod}"
: "${VIBE_ADMIN_USER_EMAIL:?Set the administrator email}"
: "${VIBE_ADMIN_USER_PASSWORD:?Set the administrator password}"
: "${JWT_SECRET_KEY:?Set a persistent random signing key}"
: "${CRON_SECRET:?Set a separate persistent random cron secret}"

case "$DATABASE_URL" in postgres://*|postgresql://*) ;; *) echo "DATABASE_URL must use PostgreSQL" >&2; exit 1 ;; esac
case "$NEXT_PUBLIC_APP_URL" in https://*|http://localhost:*|http://127.0.0.1:*) ;; *) echo "Use an HTTPS origin or a loopback HTTP origin" >&2; exit 1 ;; esac
case "$VIBE_ADMIN_USER_PASSWORD" in change-me-now|your-*) echo "Replace the example admin password" >&2; exit 1 ;; esac
case "$JWT_SECRET_KEY:$CRON_SECRET" in *REPLACE_WITH_*|*your-*) echo "Replace the example secrets" >&2; exit 1 ;; esac
if [ "${#VIBE_ADMIN_USER_PASSWORD}" -lt 12 ] || [ "${#JWT_SECRET_KEY}" -lt 32 ] || [ "${#CRON_SECRET}" -lt 32 ] || [ "$JWT_SECRET_KEY" = "$CRON_SECRET" ]; then
  echo "Use a password of at least 12 characters and two independent secrets of at least 32 characters" >&2
  exit 1
fi
export VIBE_POD=true NODE_ENV=production NEXT_PUBLIC_VIBE_MODE=cloud
export CHAT_STORAGE_TYPE=filesystem CHAT_STORAGE_PATH=/data/chat WS_PUBSUB_TYPE=local VIBE_DISABLE_PROXY=false
umask 077
mkdir -p /data/chat /data/files /data/uploads
touch /data/settings.env
bun scripts/pikapods/bootstrap.ts
exec vibe start --port="${PORT:-3000}" --db-setup=false --seed=false
