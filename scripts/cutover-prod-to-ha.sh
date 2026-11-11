#!/bin/bash
set -euo pipefail
# ============================================================================
# cutover-prod-to-ha.sh — THE single cutover action for Server 1 (prod).
#
# Flips prod's app from filesystem+local-WS to the SHARED HA data layer
# (CHAT_STORAGE_TYPE=s3 -> prod-minio, WS_PUBSUB_TYPE=redis -> prod-redis) and
# ships the new image, in ONE recreate. Server 2's unbottled-app ALREADY uses
# these same shared backends (prod-redis + prod-minio on S1 over WireGuard), so
# the instant prod flips, both boxes are coherent: WS/stream events cross boxes
# via the one shared Redis pub/sub, and chat media is one shared MinIO bucket.
#
# Everything else is already staged + verified (see ../ha/ + memory/ha-buildout-state):
#   - prod .env already holds REDIS_URL / S3_ENDPOINT / S3_* (INERT while
#     filesystem). This script only flips the two discriminator lines.
#   - prod-redis (prod-redis:6379) + prod-minio (prod-minio:9000) run on S1,
#     resolvable from next-vibe-app by container name on unbottled_app-network
#     (verified). prod-minio holds all 2738 historical uploads already.
#   - The PowerDNS edge (ns1=S1, ns2=S2) + each box's Caddy unbottled.ai vhost
#     are LIVE; both NS answer unbottled.ai round-robin across both IPs.
#
# RUN THIS ON S1 (prod), in the low-usage window. It is the ⚠️STREAM step: the
# ONE app recreate interrupts in-flight streams (the G1 stream-drain only takes
# effect from the NEW image onward). After this + the registrar NS flip, prod is
# active-active with S2.
#
# Usage (on S1):  cd /unbottled && bash cutover-prod-to-ha.sh [--image-tag TAG]
#   --image-tag  pull a specific tag (default: whatever DOCKER_IMAGE_TAG/.env says, i.e. latest)
#   --no-pull    skip the registry pull (image already loaded on the box)
#   --skip-sync  skip the final fs->minio upload delta sync (only if you know no
#                new uploads landed since the historical mirror)
#   --rollback   FAST REVERT to the OLD image + filesystem/local. Restores the
#                newest .env.bak.cutover-* and forces the app back onto the
#                pinned OLD image tag :rollback-pre-ha (ID 691b5c11…, retagged
#                before the build so it survives the new :latest). Use the moment
#                the post-flip GO/NO-GO gate fails (deploy error, login fails, or
#                chat/stream/media fails). Speed first, debug second.
#
# POST-FLIP GO/NO-GO GATE (Max's explicit call — do this, not just 307/health):
#   1. Real LOGIN on flipped prod with a WORKING test account (NOT max@tfq.at —
#      failing his login re-locks it). Confirm session works.
#   2. Real CHAT: send a message, confirm tokens STREAM back (Redis WS path) AND
#      a media upload + serve works (prod-minio).
#   If deploy fails OR login fails OR chat/stream/media fails → run --rollback
#   IMMEDIATELY, confirm prod works again on the old image (login + chat), STOP,
#   debug root cause with prod safe on old image, fix, only then retry.
# ============================================================================
ENV=/unbottled/.env
COMPOSE="docker compose -f docker-compose.prod.yml"
ROLLBACK_TAG="rollback-pre-ha"      # old image retagged before the build
IMAGE_TAG=""; NO_PULL=0; SKIP_SYNC=0; ROLLBACK=0
while [ $# -gt 0 ]; do case "$1" in
  --image-tag) IMAGE_TAG="$2"; shift 2;;
  --no-pull)   NO_PULL=1; shift;;
  --skip-sync) SKIP_SYNC=1; shift;;
  --rollback)  ROLLBACK=1; shift;;
  *) echo "unknown arg: $1" >&2; exit 2;;
esac; done
log(){ printf '%s %s\n' "$(date -u +%H:%M:%S)" "$*"; }

# Archive the OUTGOING app container's logs to the host BEFORE any recreate.
# Docker's json-file log is wiped on --force-recreate, so without this each
# recreate loses the prior container's history (we could not retro-triage prod
# WS/auth errors after a redeploy). Non-fatal; keeps only the newest archives.
LOG_ARCHIVE_DIR="${LOG_ARCHIVE_DIR:-/unbottled/logs}"
LOG_ARCHIVE_KEEP="${LOG_ARCHIVE_KEEP:-30}"
archive_app_logs(){
  mkdir -p "$LOG_ARCHIVE_DIR" 2>/dev/null || { log "  (log archive: cannot create $LOG_ARCHIVE_DIR, skipping)"; return 0; }
  if docker inspect next-vibe-app >/dev/null 2>&1; then
    local ts out; ts="$(date -u +%Y%m%d-%H%M%S)"; out="$LOG_ARCHIVE_DIR/app-${ts}.log"
    log "  archiving outgoing app logs -> ${out}.gz"
    docker logs next-vibe-app > "$out" 2>&1 || log "  (log archive: docker logs failed, continuing)"
    gzip -f "$out" 2>/dev/null || true
    ls -1t "$LOG_ARCHIVE_DIR"/app-*.log.gz "$LOG_ARCHIVE_DIR"/app-*.log 2>/dev/null \
      | tail -n +$((LOG_ARCHIVE_KEEP + 1)) | xargs -r rm -f 2>/dev/null || true
  fi
}

# ─────────────────────── FAST ROLLBACK (--rollback) ───────────────────────
if [ "$ROLLBACK" = 1 ]; then
  cd /unbottled
  log "⟲ FAST ROLLBACK — restoring old env + OLD image (:$ROLLBACK_TAG)…"
  bak="$(ls -t "$ENV".bak.cutover-* 2>/dev/null | head -1 || true)"
  if [ -n "$bak" ]; then cp "$bak" "$ENV"; log "   restored env from $bak (filesystem/local)";
  else
    log "   ⚠ no .env.bak.cutover-* found — forcing filesystem/local in place";
    sed -i 's/^CHAT_STORAGE_TYPE=.*/CHAT_STORAGE_TYPE=filesystem/' "$ENV"
    sed -i 's/^WS_PUBSUB_TYPE=.*/WS_PUBSUB_TYPE=local/' "$ENV"
  fi
  docker image inspect "ghcr.io/techfreaque/next-vibe-app:$ROLLBACK_TAG" >/dev/null 2>&1 \
    || { echo "✗ old image tag :$ROLLBACK_TAG missing — cannot fast-rollback. Old ID was 691b5c115b47."; exit 1; }
  log "   recreate app on OLD image :$ROLLBACK_TAG…"
  archive_app_logs
  DOCKER_IMAGE_TAG="$ROLLBACK_TAG" $COMPOSE up -d --no-deps --force-recreate app
  log "   health-wait…"; ok=0
  for i in $(seq 1 40); do
    c="$(curl -s -o /dev/null -w '%{http_code}' --max-time 4 --resolve unbottled.ai:443:72.61.156.49 https://unbottled.ai/robots.txt 2>/dev/null || echo 000)"
    [ "$c" = "200" ] && { ok=1; break; }; sleep 3
  done
  [ "$ok" = 1 ] && log "✓ ROLLED BACK — prod on old image, filesystem/local. NOW manually confirm LOGIN + CHAT work, then debug." \
                || { echo "✗ prod STILL not healthy after rollback — escalate immediately"; exit 1; }
  exit 0
fi

cd /unbottled

# 0. Pre-flight: prod healthy now, backends reachable, keys staged.
log "pre-flight…"
curl -sf -o /dev/null -w '' --resolve unbottled.ai:443:72.61.156.49 https://unbottled.ai/robots.txt \
  || { echo "prod not serving /robots.txt — abort"; exit 1; }
grep -q '^S3_SECRET_ACCESS_KEY=' "$ENV" || { echo "S3_* not staged in $ENV — abort"; exit 1; }
docker exec next-vibe-app bun -e 'const r=(h,p)=>Bun.connect({hostname:h,port:p,socket:{open(s){s.end()},data(){},error(){}}}).then(()=>0).catch(()=>1);process.exit((await r("prod-redis",6379))||(await r("prod-minio",9000)))' \
  || { echo "prod app cannot reach prod-redis/prod-minio — abort"; exit 1; }

# 1. FINAL delta-sync: filesystem uploads -> prod-minio (catches anything
#    uploaded since the historical mirror). fs /next-vibe-uploads/chat/<id>/<f>
#    maps to s3 chat-media/chat-attachments/<id>/<f>.
if [ "$SKIP_SYNC" = 0 ]; then
  log "final upload delta-sync /next-vibe-uploads/chat -> s3://chat-media/chat-attachments …"
  MU="$(sed -n 's/^S3_ACCESS_KEY_ID=//p' "$ENV")"
  MP="$(sed -n 's/^S3_SECRET_ACCESS_KEY=//p' "$ENV")"
  # Use the already-present chainguard minio image — it bundles /usr/bin/mc, so
  # no extra pull/registry access is needed.
  docker run --rm --network unbottled_app-network \
    -e MU="$MU" -e MP="$MP" \
    -v /next-vibe-uploads:/src:ro \
    --entrypoint sh cgr.dev/chainguard/minio:latest -c '
      mc alias set m http://prod-minio:9000 "$MU" "$MP" >/dev/null &&
      mc mirror --overwrite --quiet /src/chat m/chat-media/chat-attachments' \
    || log "⚠ delta-sync had issues (non-fatal: historical mirror already covers the bulk)"
fi

# 2. Pull the new image (unless told not to).
if [ "$NO_PULL" = 0 ]; then
  log "pull new image…"
  if [ -n "$IMAGE_TAG" ]; then DOCKER_IMAGE_TAG="$IMAGE_TAG" $COMPOSE pull app; else $COMPOSE pull app; fi
fi

# 3. FLIP the two discriminator lines in prod .env (the whole cutover, env-wise).
log "flip .env: CHAT_STORAGE_TYPE=s3 + WS_PUBSUB_TYPE=redis …"
cp "$ENV" "$ENV.bak.cutover-$(date -u +%Y%m%d%H%M%S)"
sed -i 's/^CHAT_STORAGE_TYPE=.*/CHAT_STORAGE_TYPE=s3/' "$ENV"
if grep -q '^WS_PUBSUB_TYPE=' "$ENV"; then
  sed -i 's/^WS_PUBSUB_TYPE=.*/WS_PUBSUB_TYPE=redis/' "$ENV"
else
  echo 'WS_PUBSUB_TYPE=redis' >> "$ENV"
fi

# 4. Recreate the prod app on the new image + new env (⚠STREAM — the one restart).
log "recreate prod app (new image, s3+redis)…"
archive_app_logs
if [ -n "$IMAGE_TAG" ]; then DOCKER_IMAGE_TAG="$IMAGE_TAG" $COMPOSE up -d --no-deps --force-recreate app
else $COMPOSE up -d --no-deps --force-recreate app; fi

# 5. Health-wait.
log "health-wait…"
ok=0
for i in $(seq 1 40); do
  c="$(curl -s -o /dev/null -w '%{http_code}' --max-time 4 --resolve unbottled.ai:443:72.61.156.49 https://unbottled.ai/robots.txt 2>/dev/null || echo 000)"
  [ "$c" = "200" ] && { ok=1; break; }
  sleep 3
done
if [ "$ok" != 1 ]; then
  echo "✗ prod not healthy (robots != 200) after flip — ROLLING BACK NOW."
  exec bash "$0" --rollback
fi
log "✓ prod serving (robots 200) on s3+redis. root:"; curl -s -o /dev/null -w '  root=%{http_code}\n' --resolve unbottled.ai:443:72.61.156.49 https://unbottled.ai/

cat <<'DONE'

⚠️ NOT DONE YET — robots 200 is NECESSARY, NOT SUFFICIENT. Run the REAL GO/NO-GO gate:
   1. LOG IN on prod with a WORKING test account (NOT max@tfq.at — re-locks it).
      Confirm login succeeds + session persists.
   2. SEND A CHAT — confirm tokens STREAM back (Redis WS path) + a media
      upload/serve works (prod-minio).
   If login OR chat/stream/media fails → IMMEDIATELY:
        bash /unbottled/cutover-prod-to-ha.sh --rollback
   then confirm login+chat work on the old image, STOP, debug, fix, retry.

Only once login + chat + media all pass on the new stack is the flip COMPLETE:
   prod runs s3 (prod-minio) + redis (prod-redis), active-active with S2 over WG.

THEN (Max, the ONLY remaining manual step): at the .ai registrar for unbottled.ai,
set the nameservers to the self-hosted edge WITH GLUE:
     ns1.unbottled.ai   glue A 72.61.156.49
     ns2.unbottled.ai   glue A 179.198.214.41
Then (on S1 + S2) set EDGE_PROBE_INSECURE=0 and recreate ha-edge-dns-health so the
health probe validates the real LE certs (S2's Caddy will auto-issue the real
unbottled.ai cert once delegated — delete its caddy_internal_2.tls=internal label).

ROLLBACK: restore $ENV from the .bak.cutover-* written above (sets
CHAT_STORAGE_TYPE=filesystem, WS_PUBSUB_TYPE=local) and
  docker compose -f docker-compose.prod.yml up -d --no-deps --force-recreate app
Files are still on /next-vibe-uploads; nothing is deleted by this script.
DONE
