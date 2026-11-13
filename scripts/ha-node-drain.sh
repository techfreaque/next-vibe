#!/bin/bash
# ============================================================================
# ha-node-drain.sh: take ONE unbottled HA node out of rotation, let its
# in-flight work finish, and put it back. Runs ON a box (root), acts on that
# box only; `vibe image-push` calls it on both boxes in the right order:
#
#   both boxes:  preflight <node>     refuse if the other node is drained or
#                                     unhealthy (never drain both at once)
#   both boxes:  edge-on <node>       DNS drops <node> (drain file read by this
#                                     box's ha-dns-health); on <node>'s own box
#                                     Caddy also sends every NEW request and
#                                     WebSocket upgrade to the peer (file
#                                     matcher, no reload). Open connections
#                                     (AI streams over WS, in-flight requests)
#                                     stay where they are.
#   node's box:  app-wait             ask the app to report its in-flight work
#                                     (AI runs/loops, async tool tasks, cron
#                                     attempts; cron stops claiming), wait for
#                                     0 (stable for HA_DRAIN_STABLE s) or
#                                     HA_DRAIN_TIMEOUT, then close every
#                                     client WebSocket with 1012 so browsers
#                                     reconnect to the peer.
#                (deploy script recreates the app + health-checks it)
#   both boxes:  swap <node> <peer>   between the two node rolls: <node> (new
#                                     build) takes the traffic back and <peer>
#                                     (old build) is drained in the same step,
#                                     so the boxes never serve mixed builds
#                                     side by side (chunk 404s)
#   both boxes:  edge-off <node> [--wait]
#                                     undrain; --wait blocks until this box's
#                                     zone publishes <node> again
#
# Other verbs: status, app-undrain (abort without recreate), probe <node>
# (public IP, through Caddy), local-probe (this box's app, bypassing Caddy).
#
# App contract (src/vibe/platforms/web/drain.ts): files in /app/.tmp/drain of
# the app container: `request`, `ws-close`, `status-next.json`,
# `status-server.json`. An image without that code never writes status: then
# the wait falls back to the DB (threads streaming at drain start must stop
# streaming) with a minimum wait of HA_DRAIN_FALLBACK_MIN seconds.
#
# Config: /etc/ha-failover/ha.env (HA_NODE, HA_PEER, HA_SELF_PUBLIC,
# HA_PEER_PUBLIC, HA_LOCAL_PG), overridable via env. Never touches the
# co-hosted heilpraktiker containers on Server 2.
# ============================================================================
set -uo pipefail

[ -f /etc/ha-failover/ha.env ] && . /etc/ha-failover/ha.env

NODE="${HA_NODE:?HA_NODE unset (no /etc/ha-failover/ha.env?)}"
PEER="${HA_PEER:?HA_PEER unset}"
SELF_IP="${HA_SELF_PUBLIC:?HA_SELF_PUBLIC unset}"
PEER_IP="${HA_PEER_PUBLIC:?HA_PEER_PUBLIC unset}"
case "$NODE" in
s1)
  DEF_APP=next-vibe-app
  DEF_CADDY_DIR=/caddy/data/ha-drain
  DEF_APP_URL=http://127.0.0.1:3000
  ;;
*)
  DEF_APP=unbottled-app
  DEF_CADDY_DIR=/root/caddy_data/ha-drain
  DEF_APP_URL=http://10.88.0.2:3100
  ;;
esac
APP="${HA_APP_CONTAINER:-$DEF_APP}"
APP_URL="${HA_APP_LOCAL_URL:-$DEF_APP_URL}"
CADDY_DRAIN_DIR="${HA_CADDY_DRAIN_DIR:-$DEF_CADDY_DIR}"
ZONE_DIR="${HA_ZONE_DIR:-/srv/ha-edge/zones}"
ZONE_FILE="${HA_ZONE_FILE:-$ZONE_DIR/unbottled.ai.zone}"
PROBE_COOKIE_FILE="${HA_PROBE_COOKIE_FILE:-/root/ha-edge/edge-dns/probe-cookie}"
PROBE_HOST="${HA_PROBE_HOST:-unbottled.ai}"
PROBE_PATH="${HA_PROBE_PATH:-/api/en-US/credits}"
PG_CONTAINER="${HA_LOCAL_PG:-}"
PG_DB="${HA_DRAIN_PG_DB:-postgres}"
DRAIN_TIMEOUT="${HA_DRAIN_TIMEOUT:-900}"
DRAIN_STABLE="${HA_DRAIN_STABLE:-10}"
FALLBACK_MIN="${HA_DRAIN_FALLBACK_MIN:-60}"
WS_GRACE="${HA_DRAIN_WS_GRACE:-15}"
APP_DRAIN_DIR=/app/.tmp/drain

log() { printf '%s [ha-drain %s] %s\n' "$(date -u +%H:%M:%S)" "$NODE" "$*"; }
die() { log "ERROR: $*"; exit 1; }

node_ip() { [ "$1" = "$NODE" ] && echo "$SELF_IP" || echo "$PEER_IP"; }
check_node() { [ "$1" = "$NODE" ] || [ "$1" = "$PEER" ] || die "unknown node '$1' (this box: $NODE, peer: $PEER)"; }

# DB-backed liveness of <node>'s app through its public IP (same probe as the
# DNS health daemon: the credits API of a fixed probe lead reads Postgres).
probe() {
  local ip cookie body
  ip="$(node_ip "$1")"
  cookie="$(head -1 "$PROBE_COOKIE_FILE" 2>/dev/null || true)"
  body="$(curl -s --max-time 6 -A unbottled-ha-probe/1 --resolve "${PROBE_HOST}:443:${ip}" \
    ${cookie:+-H "Cookie: $cookie"} "https://${PROBE_HOST}${PROBE_PATH}" 2>/dev/null)"
  printf '%s' "$body" | grep -qF '"success":true'
}

# The same DB-backed probe against THIS box's app directly (bypassing Caddy,
# which forwards a drained node's requests to the peer).
local_probe() {
  local cookie body
  cookie="$(head -1 "$PROBE_COOKIE_FILE" 2>/dev/null || true)"
  body="$(curl -s --max-time 6 -A unbottled-ha-probe/1 ${cookie:+-H "Cookie: $cookie"} \
    "${APP_URL}${PROBE_PATH}" 2>/dev/null)"
  printf '%s' "$body" | grep -qF '"success":true'
}

# Warm a freshly started app before it takes traffic again: the first render
# of a route after a start can take seconds (seen: 15 s for /en-US on a new
# container). Best-effort, never fails the caller.
warm_up() {
  local p
  for p in ${HA_WARM_PATHS:-/robots.txt /en-US /en-US/threads/private/new /en-US/story /api/en-US/credits}; do
    curl -s -o /dev/null --max-time 60 -A unbottled-ha-warmup/1 "${APP_URL}${p}" || true
  done
  log "warm-up done ($APP_URL)"
}

zone_has() { grep -E '^@[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A' "$ZONE_FILE" 2>/dev/null | grep -qw "$(node_ip "$1")"; }

app_exec() { docker exec "$APP" sh -c "$1"; }

# --------------------------------------------------------------------------
cmd_status() {
  log "edge: dns-drain files: $(cd "$ZONE_DIR" 2>/dev/null && ls drain.* 2>/dev/null | tr '\n' ' ' || true)"
  log "edge: caddy drain flag for $NODE: $([ -f "$CADDY_DRAIN_DIR/$NODE" ] && echo ON || echo off)"
  log "edge: zone apex A: $(grep -E '^@[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A' "$ZONE_FILE" 2>/dev/null | awk '{print $NF}' | tr '\n' ' ')"
  for f in request ws-close status-next.json status-server.json; do
    printf '  %-20s %s\n' "$f" "$(app_exec "cat $APP_DRAIN_DIR/$f 2>/dev/null | head -c 400" 2>/dev/null || echo '-')"
  done
}

# Run on BOTH boxes before draining <target>: each box vouches for itself.
cmd_preflight() {
  local target="$1" other
  check_node "$target"
  other="$([ "$target" = "$NODE" ] && echo "$PEER" || echo "$NODE")"
  [ -f "$ZONE_DIR/drain.$other" ] && die "$other is drained in DNS on this box: never drain both nodes"
  if [ "$other" = "$NODE" ]; then
    [ -f "$CADDY_DRAIN_DIR/$NODE" ] && die "this box ($NODE) is drained at Caddy: never drain both nodes"
    local_probe || die "this box's app ($APP_URL) fails the DB-backed probe: refusing to move traffic onto it"
    log "preflight OK: $NODE healthy and serving, ready to take $target's traffic"
  else
    log "preflight OK: no conflicting drain on $NODE"
  fi
}

cmd_edge_on() {
  local target="$1" i
  check_node "$target"
  touch "$ZONE_DIR/drain.$target"
  if [ "$target" = "$NODE" ]; then
    mkdir -p "$CADDY_DRAIN_DIR"
    date -u +%FT%TZ > "$CADDY_DRAIN_DIR/$NODE"
    log "caddy: new requests for $NODE now go to $PEER"
  fi
  # The health daemon re-renders within one CHECK_INTERVAL (10 s).
  for i in $(seq 1 30); do
    zone_has "$target" || { log "dns: $target removed from this box's zone"; return 0; }
    sleep 1
  done
  log "WARN: $target still in this box's zone after 30 s (health daemon down?)"
}

cmd_edge_off() {
  local target="$1" wait="${2:-}" i
  check_node "$target"
  if [ "$target" = "$NODE" ]; then
    [ -f "$CADDY_DRAIN_DIR/$NODE" ] && warm_up
    rm -f "$CADDY_DRAIN_DIR/$NODE"
    log "caddy: $NODE serves its own traffic again"
  fi
  rm -f "$ZONE_DIR/drain.$target"
  [ "$wait" = "--wait" ] || return 0
  # Re-added after RISE_THRESHOLD (2) passing probes, ~20-30 s.
  for i in $(seq 1 90); do
    zone_has "$target" && { log "dns: $target back in this box's zone"; return 0; }
    sleep 1
  done
  log "WARN: $target not back in this box's zone after 90 s (probe failing?)"
  return 1
}

# Hand the traffic from <to> back to <from> in one step (between the two node
# rolls): <from> runs the new build, <to> still the old one. Run on <from>'s
# box first, then on <to>'s, so the mixed-build window is one SSH round trip.
# DNS may publish both for one rise interval (never-dark guard); Caddy on both
# boxes already sends new requests to <from> meanwhile.
cmd_swap() {
  local from="$1" to="$2"
  check_node "$from"; check_node "$to"
  [ "$from" != "$to" ] || die "swap needs two different nodes"
  if [ "$NODE" = "$from" ]; then
    local_probe || die "this box's app fails the DB-backed probe: not taking traffic back"
    warm_up
    rm -f "$CADDY_DRAIN_DIR/$NODE"
    log "caddy: $NODE serves its own traffic again"
  fi
  if [ "$NODE" = "$to" ]; then
    mkdir -p "$CADDY_DRAIN_DIR"
    date -u +%FT%TZ > "$CADDY_DRAIN_DIR/$NODE"
    log "caddy: new requests for $NODE now go to $PEER"
  fi
  touch "$ZONE_DIR/drain.$to"
  rm -f "$ZONE_DIR/drain.$from"
  log "dns: drain moved from $from to $to"
}

# Sum of in-flight work over both status files; empty when none is fresh.
app_busy() {
  app_exec "cat $APP_DRAIN_DIR/status-next.json 2>/dev/null; echo; cat $APP_DRAIN_DIR/status-server.json 2>/dev/null" 2>/dev/null |
    python3 -c '
import json, sys, datetime
now = datetime.datetime.now(datetime.timezone.utc)
busy, ws, fresh, parts = 0, 0, 0, []
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        s = json.loads(line)
        at = datetime.datetime.fromisoformat(s["at"].replace("Z", "+00:00"))
    except Exception:
        continue
    if (now - at).total_seconds() > 10:
        continue
    fresh += 1
    for k, v in s.get("counts", {}).items():
        if k.startswith("ws"):
            if k == "wsClients":
                ws += v
        else:
            busy += v
        if v:
            parts.append("%s.%s=%s" % (s["role"], k, v))
if fresh:
    print(busy, ws, fresh, " ".join(parts) or "idle")
'
}

# Fallback for an image without the drain code: threads streaming at drain
# start must leave streaming/aborting. Prints how many still do. Rows older
# than 20 min are skipped: a run never lives that long (900 s maxDuration),
# so those are stale leftovers of killed processes, not work in flight.
db_streaming() {
  [ -n "$PG_CONTAINER" ] || { echo 0; return; }
  docker exec "$PG_CONTAINER" psql -U postgres -d "$PG_DB" -Atc \
    "select count(*) from chat_threads where id in ($1) and streaming_state in ('streaming','aborting')" 2>/dev/null || echo 0
}

cmd_app_wait() {
  docker inspect "$APP" >/dev/null 2>&1 || { log "no $APP container: nothing to drain"; return 0; }
  app_exec "mkdir -p $APP_DRAIN_DIR && rm -f $APP_DRAIN_DIR/ws-close && date -u +%FT%TZ > $APP_DRAIN_DIR/request" ||
    die "cannot write the drain request into $APP"
  log "app: drain requested in $APP (timeout ${DRAIN_TIMEOUT}s, stable ${DRAIN_STABLE}s)"

  local start now zero_since="" mode="" snapshot="" line busy ws last_log=0
  start="$(date +%s)"
  while :; do
    now="$(date +%s)"
    line="$(app_busy || true)"
    if [ -n "$line" ]; then
      mode=app
      read -r busy ws _ parts <<<"$line"
    elif [ -z "$mode" ] && [ $((now - start)) -lt 10 ]; then
      sleep 2; continue
    else
      if [ "$mode" != db ]; then
        mode=db
        snapshot="$(docker exec "$PG_CONTAINER" psql -U postgres -d "$PG_DB" -Atc \
          "select string_agg(quote_literal(id::text), ',') from chat_threads where streaming_state in ('streaming','aborting') and updated_at > now() - interval '20 minutes'" 2>/dev/null || true)"
        log "app: no drain status from $APP (image without drain support): DB fallback, ${snapshot:+$(echo "$snapshot" | tr ',' '\n' | wc -l) thread(s) streaming at start, }min wait ${FALLBACK_MIN}s"
      fi
      busy=0; ws="?"; parts="db"
      [ -n "$snapshot" ] && busy="$(db_streaming "$snapshot")"
      [ $((now - start)) -lt "$FALLBACK_MIN" ] && [ "$busy" = 0 ] && parts="db min-wait"
    fi

    if [ "$busy" = 0 ] && { [ "$mode" = app ] || [ $((now - start)) -ge "$FALLBACK_MIN" ]; }; then
      [ -n "$zero_since" ] || zero_since="$now"
      if [ $((now - zero_since)) -ge "$DRAIN_STABLE" ]; then
        log "app: idle for ${DRAIN_STABLE}s after $((now - start))s (${parts})"
        break
      fi
    else
      zero_since=""
    fi
    if [ $((now - start)) -ge "$DRAIN_TIMEOUT" ]; then
      log "WARN: drain timeout ${DRAIN_TIMEOUT}s reached with busy=${busy} (${parts}); the SIGTERM drain gets the rest"
      break
    fi
    if [ $((now - last_log)) -ge 15 ]; then
      last_log="$now"
      log "app: waiting ($((now - start))s) busy=${busy} wsClients=${ws} ${parts}"
    fi
    sleep 2
  done

  # Work done: move the WebSocket clients to the peer now, while this app is
  # still up (a recreate would drop them with a bare 1006 instead).
  app_exec "date -u +%FT%TZ > $APP_DRAIN_DIR/ws-close" || true
  local i
  for i in $(seq 1 "$WS_GRACE"); do
    sleep 1
    line="$(app_busy || true)"
    [ -n "$line" ] || break
    read -r busy ws _ parts <<<"$line"
    [ "$ws" = 0 ] && break
  done
  log "app: WebSocket clients closed with 1012 (left: ${ws:-?}); ready for recreate"
}

cmd_app_undrain() {
  app_exec "rm -f $APP_DRAIN_DIR/request $APP_DRAIN_DIR/ws-close" 2>/dev/null || true
  log "app: drain request removed"
}

verb="${1:-status}"; shift || true
case "$verb" in
status) cmd_status ;;
preflight) cmd_preflight "${1:?node}" ;;
edge-on) cmd_edge_on "${1:?node}" ;;
edge-off) cmd_edge_off "${1:?node}" "${2:-}" ;;
swap) cmd_swap "${1:?from node}" "${2:?to node}" ;;
local-probe) local_probe && echo ok || { echo fail; exit 1; } ;;
app-wait) cmd_app_wait ;;
app-undrain) cmd_app_undrain ;;
probe) probe "${1:?node}" && echo ok || { echo fail; exit 1; } ;;
*) die "usage: $0 status|preflight <node>|edge-on <node>|edge-off <node> [--wait]|swap <from> <to>|app-wait|app-undrain|probe <node>|local-probe" ;;
esac
