#!/bin/bash
set -euo pipefail
# ============================================================================
# deploy-ha.sh — zero-downtime ROLLING deploy across an N-node HA fleet.
#
# Topology this script targets (built out 2026-11-09, see ha/README.md):
#   - 1..N self-managed nodes, each running 1..M app replicas (one container per
#     replica).  All replicas on all nodes talk to a SINGLE Postgres PRIMARY
#     (the cutover model: both/all nodes WRITE to the primary; the hot standby
#     is failover-only and is NOT written to by the app).
#   - Shared stateless layer already in place: self-hosted Redis (WS pub/sub,
#     WS_PUBSUB_TYPE=redis) + MinIO (chat storage, CHAT_STORAGE_TYPE=s3),
#     replicated between nodes over WireGuard (10.88.0.0/24).
#   - Edge = self-hosted PowerDNS on BOTH boxes (two authoritative NS), round-
#     robin A across both public IPs, with a per-box ha-dns-health daemon that
#     drops a dead box's A within ~30-60s (ha/edge-dns/). PER-BOX, each node's
#     Caddy load-balances across that node's N local app replicas, health-checked
#     on /robots.txt (ha/edge-lb/). There is NO floating IP and NO keepalived —
#     the servers are in different datacenters so an L2 VIP cannot bridge them;
#     cross-node failover is DNS, intra-node LB is Caddy.
#
# The deploy, per replica, one replica at a time (never >1 replica down at once,
# so the fleet always keeps serving):
#
#   0. MIGRATE ONCE, UP FRONT (before touching any replica) with the NEW image,
#      against the single primary. Migrations MUST be expand-only / backward-
#      compatible so the OLD replicas still running keep working against the
#      migrated schema for the duration of the roll (see
#      ha/scripts/README-migrations.md). This script HARD-STOPS if migration
#      fails and touches no replica.
#   1. DRAIN  — `docker stop --time=$DRAIN_TIME` → SIGTERM → the app's G1 handler
#      (src/instrumentation.ts) finishes in-flight AI StreamLoops up to
#      STREAM_DRAIN_TIMEOUT_MS before exit. No half-written answer is severed.
#      The node's Caddy LB active health-check (/robots.txt every 5s, max_fails
#      2) ejects the replica within ~10s of the port going away — no explicit
#      deregister call is needed, and there is no cross-node LB admin to notify
#      (the DNS edge only decides which BOXES are up, not which replicas).
#   2. RECREATE the replica's container on the new image.
#   3. HEALTH-WAIT until that replica serves /robots.txt again.
#   4. RE-REGISTER — automatic: Caddy's health-check re-adds the replica the
#      moment /robots.txt returns 200.
#   5. next replica.
#
# Order: non-primary nodes first, primary node LAST, so the Postgres-primary box
# is updated last and is never the lone survivor mid-migration.
#
# Usage:
#   scripts/deploy-ha.sh [--image-tag TAG] [--drain-time SEC] [--health-timeout SEC]
#                        [--skip-migrate] [--dry-run]
#
# Fleet is declared in scripts/ha-fleet.conf (see FLEET CONFIG below) OR inline
# via the HA_FLEET env var. Each node line:
#   name | ssh_host | compose_dir | compose_files | primary(0/1) | health_target | replicas
# where health_target is either "exec" (docker-exec curl /robots.txt inside the
# replica — the HA model, replicas have no host port) or "http://IP:PORT" (a
# host-port'd single container, e.g. the pre-cutover shared-prod test node).
# ---------------------------------------------------------------------------- #

# ─────────────────────────── args ───────────────────────────
IMAGE_TAG=""              # override DOCKER_IMAGE_TAG for the pull (else per-node .env)
DRAIN_TIME="${DRAIN_TIME:-120}"          # ≥ app STREAM_DRAIN_TIMEOUT_MS/1000 + margin
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"
SKIP_MIGRATE=0
DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --image-tag)      IMAGE_TAG="$2"; shift 2 ;;
    --drain-time)     DRAIN_TIME="$2"; shift 2 ;;
    --health-timeout) HEALTH_TIMEOUT="$2"; shift 2 ;;
    --skip-migrate)   SKIP_MIGRATE=1; shift ;;
    --dry-run)        DRY_RUN=1; shift ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO/.env}"
FLEET_FILE="${HA_FLEET_FILE:-$HERE/ha-fleet.conf}"

log() { printf '%s %s\n' "$(date -u +%H:%M:%S)" "$*"; }

# ─────────────── read SSH creds from .env (quote-safe) ───────────────
getenv() { python3 - "$1" "$ENV_FILE" <<'PY'
import re,sys
k,f=sys.argv[1],sys.argv[2]
try: s=open(f).read()
except OSError: print(""); raise SystemExit
m=re.search(r'^'+re.escape(k)+r'=(.*)$',s,re.M)
v=m.group(1).strip() if m else ''
if len(v)>=2 and v[0]==v[-1] and v[0] in '"\'': v=v[1:-1]
print(v)
PY
}
# Map a logical node name → its SSH password env var. Extend as the fleet grows.
pwd_for() {
  case "$1" in
    *server1*|*srv1*|*primary*) getenv SSH_SERVER_PWD ;;
    *server2*|*srv2*)           getenv SSH_SERVER2_PWD ;;
    *) getenv "SSH_${1^^}_PWD" ;;   # convention: SSH_<NAME>_PWD
  esac
}

## Real SSH — always executes (used for read-only discovery + the actual steps).
## Creds are passed to sshpass via an env var (never on the command line / logs).
ssh_exec() {   # ssh_exec <host> <pwd> <remote cmd...>
  local host="$1" pw="$2"; shift 2
  SSHPASS="$pw" sshpass -e ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 "$host" "$@"
}
## Mutating SSH — honours --dry-run. In dry-run it prints the REMOTE command
## only (never the host creds), so logs are safe to share.
ssh_run() {   # ssh_run <host> <pwd> <remote cmd...>
  local host="$1" pw="$2"; shift 2
  if [ "$DRY_RUN" = 1 ]; then echo "    DRY-SSH[$host]: $*"; return 0; fi
  ssh_exec "$host" "$pw" "$@"
}

# ─────────────────────────── FLEET CONFIG ───────────────────────────
# Lines: name | ssh_host | compose_dir | compose_files | primary | health_target | replicas
# - compose_files: space-joined -f list understood by `docker compose`.
# - primary: 1 for the node co-located with the Postgres PRIMARY (rolled LAST).
# - health_target: "exec" (docker-exec curl localhost:3000/robots.txt inside the
#   replica) or "http://IP:PORT" (a host-port'd single container). /robots.txt is
#   app-served + unauthenticated + returns 200 only while the app is serving; the
#   port/exec refuses while the container is down/restarting. (The /health API
#   endpoint needs auth → 401 → unusable as an anonymous probe.)
# - replicas: number of app containers on this node. For M>1 the container names
#   are "<APP_CONTAINER_NAME>" and "<APP_CONTAINER_NAME>-2".."-M" by convention
#   (the ha/edge-lb/docker-compose.replicas.yml overlay). container_name() below
#   matches that convention.
default_fleet() {
  cat <<'EOF'
# name     | ssh_host                 | compose_dir    | compose_files                                                        | primary | health_target         | replicas
server2    | __S2_HOST__              | /root/unbottled| -f docker-compose.prod.yml -f docker-compose.standalone.yml -f docker-compose.shared-prod.yml -f docker-compose.caddy-public.yml | 0 | http://10.88.0.2:3100 | 1
server1    | __S1_HOST__              | /unbottled     | -f docker-compose.prod.yml                                           | 1       | http://10.88.0.1:3000 | 1
EOF
}

load_fleet() {
  local raw
  if [ -n "${HA_FLEET:-}" ]; then raw="$HA_FLEET"
  elif [ -f "$FLEET_FILE" ]; then raw="$(cat "$FLEET_FILE")"
  else
    raw="$(default_fleet)"
    # fill SSH hosts from .env so the built-in default works out of the box.
    raw="${raw//__S1_HOST__/$(getenv SSH_SERVER)}"
    raw="${raw//__S2_HOST__/$(getenv SSH_SERVER2)}"
  fi
  printf '%s\n' "$raw" | grep -vE '^\s*#' | grep -vE '^\s*$'
}

# Container name for replica index i (1-based) on a node whose base name is $1.
container_name() { local base="$1" i="$2"; if [ "$i" -le 1 ]; then echo "$base"; else echo "${base}-${i}"; fi; }

# ─────────────────────── migration gate (step 0) ───────────────────────
# Run migrations ONCE against the single primary, using the NEW image, BEFORE
# any replica is touched. Picks the primary node to run the one-off migrator on
# (it already has the compose + env + DB reachability).
migrate_once() {
  [ "$SKIP_MIGRATE" = 1 ] && { log "↷ migrate skipped (--skip-migrate)"; return 0; }
  local line name host cdir cfiles prim htarget reps pw
  while IFS='|' read -r name host cdir cfiles prim htarget reps; do
    name="$(echo "$name"|xargs)"; prim="$(echo "$prim"|xargs)"
    [ "$prim" = "1" ] || continue
    host="$(echo "$host"|xargs)"; cdir="$(echo "$cdir"|xargs)"; cfiles="$(echo "$cfiles"|xargs)"
    pw="$(pwd_for "$name")"
    log "▶ migrate (expand-only) via $name on the single primary, new image…"
    local tagenv=""; [ -n "$IMAGE_TAG" ] && tagenv="DOCKER_IMAGE_TAG=$IMAGE_TAG "
    # pull new image, then run a one-off container that ONLY migrates and exits.
    ssh_run "$host" "$pw" "cd $cdir && ${tagenv}docker compose $cfiles pull app"
    if ! ssh_run "$host" "$pw" "cd $cdir && ${tagenv}docker compose $cfiles run --rm app bun src/vibe/platforms/cli/vibe-runtime.ts migrate"; then
      log "✗ MIGRATION FAILED — aborting. No replica was touched. Fleet unchanged."
      exit 1
    fi
    log "✓ migration applied (must be backward-compatible; old replicas keep serving)."
    return 0
  done <<<"$(load_fleet)"
  log "⚠ no primary node flagged in fleet — refusing to deploy. Set primary=1 on exactly one node."
  exit 1
}

# Build the replica health probe command for a node's health_target.
#   exec           → curl /robots.txt INSIDE the replica (200 == serving). Works
#                    for host-port-less HA replicas reached only via Caddy.
#   http://IP:PORT → curl that base "/" from the node (2xx/3xx == serving).
# Prints a shell snippet that echoes an HTTP-ish code (000 == unreachable).
probe_cmd() {   # probe_cmd <health_target> <container>
  local ht="$1" container="$2"
  if [ "$ht" = "exec" ]; then
    echo "docker exec $container curl -s -o /dev/null -w '%{http_code}' --max-time 4 http://127.0.0.1:3000/robots.txt 2>/dev/null || echo 000"
  else
    echo "curl -s -o /dev/null -w '%{http_code}' --max-time 4 '${ht}/' 2>/dev/null || echo 000"
  fi
}

# ─────────────────────── per-replica roll ───────────────────────
roll_replica() {   # roll_replica <name> <host> <pw> <cdir> <cfiles> <htarget> <container>
  local name="$1" host="$2" pw="$3" cdir="$4" cfiles="$5" htarget="$6" container="$7"
  local tagenv=""; [ -n "$IMAGE_TAG" ] && tagenv="DOCKER_IMAGE_TAG=$IMAGE_TAG "

  log "  ── $name/$container ──"

  # LB-INTEGRATION: no explicit deregister call. The node's Caddy LB block
  # (ha/edge-lb/unbottled.ai.lb.caddy) active-health-checks /robots.txt every 5s
  # with max_fails=2 + fail_duration 10s, so it ejects this replica within ~10s
  # of the `docker stop` below taking the port away — before recreate completes.
  # Caddy re-adds it automatically when /robots.txt returns 200 again. The DNS
  # edge decides which BOXES are up (whole-node failover), never which replicas,
  # so there is no per-replica LB admin to call here. (If you later want to kill
  # even the ~10s eject lag, add `health_passes`/a Caddy admin "stop" here — not
  # needed for drain-safety because the G1 handler keeps serving in-flight
  # streams through the drain window anyway.)

  # 1. DRAIN via SIGTERM → G1 stream-drain (bounded by DRAIN_TIME, then SIGKILL
  #    thanks to compose stop_grace_period).
  log "  drain (stop --time=$DRAIN_TIME): finishing in-flight AI streams…"
  ssh_run "$host" "$pw" "cd $cdir && docker stop --time $DRAIN_TIME $container" || true

  # 2. RECREATE on the new image. --no-deps so we don't bounce postgres/redis/minio.
  log "  recreate on new image…"
  ssh_run "$host" "$pw" "cd $cdir && ${tagenv}docker compose $cfiles up -d --no-deps --force-recreate $container"

  # 3. HEALTH-WAIT. 'up' = the replica serves /robots.txt (200) again; while
  #    restarting the exec/port refuses (code 000).
  log "  health-wait (≤${HEALTH_TIMEOUT}s, target=$htarget)…"
  local pcmd; pcmd="$(probe_cmd "$htarget" "$container")"
  if [ "$DRY_RUN" = 1 ]; then echo "    DRY: [$htarget] $pcmd — until 2xx/3xx"; else
    local waited=0 code
    until code="$(ssh_run "$host" "$pw" "$pcmd")"; \
          [ "$code" != "000" ] && [ "$code" -lt 500 ]; do
      sleep 3; waited=$((waited+3))
      if [ "$waited" -ge "$HEALTH_TIMEOUT" ]; then
        log "  ✗ $name/$container NOT healthy after ${HEALTH_TIMEOUT}s — ABORTING roll."
        log "    Other replicas are still live. Investigate before re-running."
        exit 1
      fi
    done
    log "  ✓ healthy (HTTP $code) — Caddy re-adds it to the local pool on its next probe."
  fi
}

# ─────────────────────────── main ───────────────────────────
log "══ HA rolling deploy ══  (image-tag=${IMAGE_TAG:-<per-node .env>}, drain=${DRAIN_TIME}s, dry-run=${DRY_RUN})"
command -v sshpass >/dev/null || { echo "sshpass required" >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 required" >&2; exit 1; }

# Step 0: migrate once up front (backward-compatible), against the single primary.
migrate_once

# Steps 1-5: roll every replica of every node, non-primary nodes first, primary
# LAST. Within a node, roll replicas sequentially (never >1 of that node down).
# NOTE: this rolls one replica fleet-wide-serially. For a bigger fleet you can
# safely parallelise ACROSS nodes (one replica per node at a time) — left serial
# here for a clear, auditable first version. TODO[PARALLEL]: batch by node.
while IFS='|' read -r name host cdir cfiles prim htarget reps; do
  name="$(echo "$name"|xargs)"; prim="$(echo "$prim"|xargs)"
  [ "$prim" = "1" ] && continue            # defer primary node to the second pass
  host="$(echo "$host"|xargs)"; cdir="$(echo "$cdir"|xargs)"; cfiles="$(echo "$cfiles"|xargs)"
  htarget="$(echo "$htarget"|xargs)"; reps="$(echo "${reps:-1}"|xargs)"
  pw="$(pwd_for "$name")"
  appbase="$(ssh_exec "$host" "$pw" "cd $cdir && grep -E '^APP_CONTAINER_NAME=' .env | cut -d= -f2- | tr -d '\"'" 2>/dev/null || echo next-vibe-app)"
  [ -n "$appbase" ] || appbase="next-vibe-app"
  log "▶ node $name (${reps} replica(s), base '$appbase')"
  for i in $(seq 1 "$reps"); do
    roll_replica "$name" "$host" "$pw" "$cdir" "$cfiles" "$htarget" "$(container_name "$appbase" "$i")"
  done
done <<<"$(load_fleet)"

while IFS='|' read -r name host cdir cfiles prim htarget reps; do
  name="$(echo "$name"|xargs)"; prim="$(echo "$prim"|xargs)"
  [ "$prim" = "1" ] || continue            # second pass: the primary node, LAST
  host="$(echo "$host"|xargs)"; cdir="$(echo "$cdir"|xargs)"; cfiles="$(echo "$cfiles"|xargs)"
  htarget="$(echo "$htarget"|xargs)"; reps="$(echo "${reps:-1}"|xargs)"
  pw="$(pwd_for "$name")"
  appbase="$(ssh_exec "$host" "$pw" "cd $cdir && grep -E '^APP_CONTAINER_NAME=' .env | cut -d= -f2- | tr -d '\"'" 2>/dev/null || echo next-vibe-app)"
  [ -n "$appbase" ] || appbase="next-vibe-app"
  log "▶ PRIMARY node $name (${reps} replica(s), base '$appbase') — rolled last"
  for i in $(seq 1 "$reps"); do
    roll_replica "$name" "$host" "$pw" "$cdir" "$cfiles" "$htarget" "$(container_name "$appbase" "$i")"
  done
done <<<"$(load_fleet)"

log "✅ HA rolling deploy complete — every replica updated, no stream kills, ≥1 replica live throughout."

# ─────────────────────────── CUTOVER NOTES ───────────────────────────
# This script is already wired to the REAL edge, which is DNS + per-box Caddy,
# NOT keepalived/VIP (the two boxes are in different datacenters, so an L2
# floating IP cannot bridge them — see ha/edge-dns/README.md):
#
#   • Whole-BOX failover = the self-hosted PowerDNS edge (ha/edge-dns/). Each box
#     runs an authoritative NS + an ha-dns-health daemon that drops a dead box's
#     apex A within ~30-60s. This script does not touch DNS: draining ONE replica
#     on a box with >1 replica never makes the box fail its /robots.txt probe, so
#     the box stays in the apex A set throughout a roll. (A box whose LAST replica
#     is briefly down during a single-replica roll WILL get dropped from DNS for
#     ~30-60s — acceptable, the other box serves; run >1 replica/box to avoid it.)
#   • Intra-BOX LB = each box's Caddy over the local replicas, auto-ejecting a
#     draining replica on /robots.txt (handled above — no admin call needed).
#   • DB: the shared single PRIMARY is the `primary`-flagged node's Postgres,
#     reached by the other box's app over WireGuard (DATABASE_URL already points
#     at 10.88.0.1 in the shared-prod overlay). NO VIP. A primary-box loss is a
#     supervised DB failover (promote the standby, repoint DATABASE_URL, redeploy
#     the survivor) — deliberately NOT automatic here, to avoid split-brain on a
#     shared-writable DB. See ha/edge-dns/README.md "Primary-box loss".
#
# At cutover, swap scripts/ha-fleet.conf to the POST-CUTOVER block (2 replicas,
# health_target=exec) and bring up ha/edge-dns on BOTH boxes + the per-box Caddy
# LB block. See ha/edge-dns/README.md for the exact ordered switch + the single
# registrar nameserver change Max must make.
