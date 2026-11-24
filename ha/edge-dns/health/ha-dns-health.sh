#!/bin/sh
# ===========================================================================
# ha-dns-health — the health-check daemon that drives fast DNS failover.
#
# Runs ONE PER NODE (next to that node's PowerDNS). Every CHECK_INTERVAL it
# probes EVERY node's app over the public internet and rewrites THIS node's
# apex (and www) A record set to exactly the healthy node(s), then reloads pdns. Because
# each node runs its own independent daemon + pdns, the SURVIVING node keeps
# publishing a correct (dead-node-removed) apex A set even when the other box
# — and its daemon — is gone. That is the whole point: a box dying takes out
# one app AND one NS, but the other NS has already dropped the dead A, and
# resolvers simply fail over to the reachable NS.
#
# Production: GET /_ha/ready over verified public TLS. The addressed Caddy
# serves only its own app's writable-PG/renderer probe. Require its own
# X-HA-Upstream and the ready marker. Optional direct probes support older
# configurations; current production needs no guest identity or direct WG URL.
#
# Manual drain: a file drain.<node> next to the zone removes <node> at once.
#
# Flap damping: a node must FAIL fail_threshold consecutive probes to be
# removed, and PASS rise_threshold consecutive probes to be re-added. Prevents
# a single lost packet from yanking a node.
#
# If no check passes, publish only administratively eligible addresses. If
# every node is manually drained, keep the previously rendered zone.
#
# Env (set by docker-compose.health.yml):
#   NODES            space list of "name=ip" e.g. "s1=72.61.156.49 s2=179.198.214.41"
#   HEALTH_HOST      Host header + SNI for the probe (default unbottled.ai)
#   HEALTH_PATH      path to probe (default /robots.txt; prod: /_ha/ready)
#   HEALTH_EXPECT    substring the body must contain (prod: ready)
#   PROBE_COOKIE_FILE  file with one "lead_id=<uuid>" line for the probe lead
#   ZONE_FILE        rendered zone path (default /etc/powerdns/zones/unbottled.ai.zone)
#   ZONE_TMPL        template path (default /zone.tmpl)
#   CHECK_INTERVAL   seconds between sweeps (default 10)
#   PROBE_TIMEOUT    per-probe curl timeout (default 4)
#   FAIL_THRESHOLD   consecutive fails to drop a node (script default 2, prod 1)
#   RISE_THRESHOLD   consecutive passes to restore a node (default 2)
#   APEX_TTL         TTL on the apex A records (default 30)
#   SERVED_BY        space list "name=upstream[,upstream]" of each node's LOCAL
#                    Caddy upstream as reported in SERVED_BY_HEADER; empty
#                    disables the check (old behaviour)
#   SERVED_BY_HEADER response header carrying the upstream (default X-HA-Upstream)
#   DIRECT_URLS      space list "name=http://wg-ip:port" of each node's app
#   DIRECT_SCOPE     self (default) | all | off
#   SELF_NODE        this box's node name; empty = the node whose IP is SELF_IP
#   SELF_IP          this box's public IP (compose passes NODE_PUBLIC_IP)
#   DIRECT_TIMEOUT   per-request timeout of the direct probe (default PROBE_TIMEOUT)
#
# The host ha-dns-publish.path reloads the zone and purges apex + www
# immediately after the atomic rename. The 5 s BIND polling interval remains
# available when the path unit is stopped.
# ===========================================================================
set -u

NODES="${NODES:?set NODES='s1=IP s2=IP'}"
HEALTH_HOST="${HEALTH_HOST:-unbottled.ai}"
HEALTH_PATH="${HEALTH_PATH:-/robots.txt}"
ZONE_FILE="${ZONE_FILE:-/etc/powerdns/zones/unbottled.ai.zone}"
ZONE_TMPL="${ZONE_TMPL:-/zone.tmpl}"
CHECK_INTERVAL="${CHECK_INTERVAL:-10}"
PROBE_TIMEOUT="${PROBE_TIMEOUT:-4}"
FAIL_THRESHOLD="${FAIL_THRESHOLD:-2}"
RISE_THRESHOLD="${RISE_THRESHOLD:-2}"
APEX_TTL="${APEX_TTL:-30}"
SERVED_BY="${SERVED_BY:-}"
SERVED_BY_HEADER="${SERVED_BY_HEADER:-X-HA-Upstream}"
DIRECT_URLS="${DIRECT_URLS:-}"
DIRECT_SCOPE="${DIRECT_SCOPE:-self}"
DIRECT_TIMEOUT="${DIRECT_TIMEOUT:-$PROBE_TIMEOUT}"
SELF_IP="${SELF_IP:-}"

log(){ printf '%s ha-dns-health: %s\n' "$(date -u +%H:%M:%S)" "$*"; }

# per-node consecutive counters + current membership, kept in /run files.
STATE_DIR="${STATE_DIR:-/run/ha-dns-health}"
mkdir -p "$STATE_DIR"

node_names(){ for kv in $NODES; do echo "${kv%%=*}"; done; }
kv_get(){ # kv_get "<name=val list>" <name> → val (empty if absent)
  for kv in $1; do [ "${kv%%=*}" = "$2" ] && { echo "${kv#*=}"; return; }; done
}
node_ip(){ kv_get "$NODES" "$1"; }

SELF_NODE="${SELF_NODE:-}"
if [ -z "$SELF_NODE" ] && [ -n "$SELF_IP" ]; then
  for n in $(node_names); do [ "$(node_ip "$n")" = "$SELF_IP" ] && SELF_NODE="$n"; done
fi

# Why the last probe failed (for the log); set by probe().
REASON=""

probe_cookie(){
  [ -n "${PROBE_COOKIE_FILE:-}" ] && [ -s "$PROBE_COOKIE_FILE" ] && head -1 "$PROBE_COOKIE_FILE"
  return 0
}

# check_body <curl output with trailing "\n<http_code>"> <label> → 0 if 200 + expect
check_body(){
  code="$(printf '%s' "$1" | tail -n1)"
  if [ "$code" != "200" ]; then REASON="$2 http ${code:-none}"; return 1; fi
  [ -z "${HEALTH_EXPECT:-}" ] && return 0
  printf '%s' "$1" | grep -qF "$HEALTH_EXPECT" && return 0
  REASON="$2 body lacks expected marker"; return 1
}

probe(){ # probe <node> → 0 if healthy; REASON set on failure
  pnode="$1"; REASON=""
  public_probe "$pnode" "$(node_ip "$pnode")" || return 1
  case "$DIRECT_SCOPE" in
    all) ;;
    self) [ -n "$SELF_NODE" ] && [ "$pnode" = "$SELF_NODE" ] || return 0 ;;
    *) return 0 ;;
  esac
  direct_probe "$pnode"
}

direct_probe(){ # direct_probe <node>: DB-backed request straight to the app over WG
  url="$(kv_get "$DIRECT_URLS" "$1")"
  [ -z "$url" ] && return 0
  cookie="$(probe_cookie)"
  set -- -s -w '\n%{http_code}' --max-time "$DIRECT_TIMEOUT" -A "unbottled-ha-probe/1"
  [ -n "$cookie" ] && set -- "$@" -H "Cookie: $cookie"
  body="$(curl "$@" "${url}${HEALTH_PATH}" 2>/dev/null)"
  check_body "$body" "direct ${url}"
}

public_probe(){ # public_probe <node> <ip> → 0 if 200 (+ expect, + own upstream)
  # PROBE_INSECURE=1 accepts a self-signed/internal cert for HEALTH_HOST. This is
  # for the PRE-CUTOVER phase ONLY: the peer box serves unbottled.ai with Caddy's
  # internal CA because a public LE cert can't be issued until the registrar
  # delegates. The liveness signal (app returns 200 on /robots.txt) is unchanged;
  # only cert-chain validation is skipped. Set PROBE_INSECURE=0 (default) at
  # cutover once both boxes hold real LE certs.
  insec=""; [ "${PROBE_INSECURE:-0}" = "1" ] && insec="-k"
  # DB-backed probe (2026-11-13): HEALTH_PATH=/api/en-US/credits with a fixed
  # probe lead cookie (PROBE_COOKIE_FILE, one line "lead_id=<uuid>", kept on
  # the box, not in the repo) makes the app resolve the lead and read its
  # balance from Postgres. A node whose app cannot reach its database (dead
  # WG link, wedged pool) then fails the probe and leaves the A set, instead
  # of passing on the static /robots.txt while every real page hangs.
  pn="$1"; ip="$2"; cookie="$(probe_cookie)"
  hdr="$STATE_DIR/$pn.hdr"; : > "$hdr"
  set -- -s $insec -D "$hdr" -w '\n%{http_code}' --max-time "$PROBE_TIMEOUT" \
    -A "unbottled-ha-probe/1" --resolve "${HEALTH_HOST}:443:$ip"
  [ -n "$cookie" ] && set -- "$@" -H "Cookie: $cookie"
  body="$(curl "$@" "https://${HEALTH_HOST}${HEALTH_PATH}" 2>/dev/null)"
  check_body "$body" "public" || return 1
  # Served-by: the response must come from THIS node's local upstream, not
  # from the peer via Caddy's fallback.
  want="$(kv_get "$SERVED_BY" "$pn")"
  [ -z "$want" ] && return 0
  hl="$(printf '%s' "$SERVED_BY_HEADER" | tr 'A-Z' 'a-z')"
  got="$(tr -d '\r' < "$hdr" | awk -v h="$hl" '{ i = index($0, ":"); if (i && tolower(substr($0, 1, i - 1)) == h) { v = substr($0, i + 1); sub(/^[ \t]+/, "", v); sub(/[ \t]+$/, "", v) } } END { print v }')"
  case ",$want," in
    *",$got,"*) [ -n "$got" ] && return 0 ;;
  esac
  REASON="public served by '${got:-<no $SERVED_BY_HEADER header>}', not $pn's own app ($want)"
  return 1
}

getc(){ cat "$STATE_DIR/$1.$2" 2>/dev/null || echo 0; }
setc(){ echo "$2" > "$STATE_DIR/$1.$3"; }
member(){ [ -f "$STATE_DIR/$1.in" ]; }
join(){ : > "$STATE_DIR/$1.in"; }
leave(){ rm -f "$STATE_DIR/$1.in"; }

# Log a failing probe's reason once per change (not every sweep).
note_fail(){
  [ "$(cat "$STATE_DIR/$1.why" 2>/dev/null)" = "$2" ] && return 0
  printf '%s' "$2" > "$STATE_DIR/$1.why"; log "node $1 probe failing: $2"
}
note_pass(){
  [ -s "$STATE_DIR/$1.why" ] || return 0
  rm -f "$STATE_DIR/$1.why"; log "node $1 probe passing again"
}

render(){ # render the healthy A set into the zone; bump serial + rewrite only on change
  ips="$*"
  if [ -z "$ips" ]; then
    log "no passing origin; keeping administratively eligible addresses"
    for n in $(node_names); do
      [ -f "$(dirname "$ZONE_FILE")/drain.$n" ] || ips="$ips $(node_ip "$n")"
    done
    # An operator drained both nodes. Preserve the last published zone.
    [ -n "$ips" ] || return 0
  fi
  # canonical healthy set for change-detection (sorted, space-joined)
  newset="$(for ip in $ips; do echo "$ip"; done | sort | tr '\n' ' ')"
  oldset="$(grep -E '^@[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A' "$ZONE_FILE" 2>/dev/null | awk '{print $NF}' | sort | tr '\n' ' ')"
  # unchanged set AND template not edited since the last render → leave zone
  # (and serial) alone. Editing the template (static records) re-renders.
  oldttl="$(awk '$1=="@" && $3=="IN" && $4=="A" {print $2; exit}' "$ZONE_FILE" 2>/dev/null)"
  [ "$newset" = "$oldset" ] && [ "$oldttl" = "$APEX_TTL" ] && [ ! "$ZONE_TMPL" -nt "$ZONE_FILE" ] && return 0

  # Build the apex + www A blocks (PowerDNS BIND parser accepts "name TTL IN A ip").
  apex=""; www=""
  for ip in $(echo "$newset"); do
    apex="${apex}@\t${APEX_TTL}\tIN A\t${ip}\n"
    www="${www}www\t${APEX_TTL}\tIN A\t${ip}\n"
  done
  # Serial: epoch-offset seconds — strictly monotonic, fits DNS's uint32 (a
  # YYYYMMDDHHMM serial is 12 digits and OVERFLOWS uint32 → pdns rejects the
  # SOA). ~133 years of headroom. (Cosmetic anyway: no AXFR secondaries; pdns
  # reloads on mtime via bind-check-interval.)
  serial="$(( $(date -u +%s) - 1700000000 ))"
  # Same mount: the path unit sees a complete zone in a single rename.
  tmp="$(mktemp "$(dirname "$ZONE_FILE")/.unbottled-zone.XXXXXX")"
  sed -e "s/@@SERIAL@@/${serial}/" "$ZONE_TMPL" \
    | awk -v apex="$apex" -v www="$www" '/^;;APEX_A_RECORDS;;$/ { printf apex; next } /^;;WWW_A_RECORDS;;$/ { printf www; next } { print }' > "$tmp"
  chmod 644 "$tmp"              # mktemp is 0600; pdns (setuid=pdns) must read it
  mv "$tmp" "$ZONE_FILE"
  log "apex A changed: [${oldset}] -> [${newset}] — zone rewritten (serial ${serial}); ha-dns-publish reloads the zone and purges cached address answers"
}

sweep(){ # one probe round over all nodes + render
  healthy=""
  for n in $(node_names); do
    ip="$(node_ip "$n")"
    # Manual drain: `touch /srv/ha-edge/zones/drain.<node>` on a box makes
    # that box's daemon treat <node> as failed (e.g. while the two boxes run
    # different builds). Do it on BOTH boxes; rm the files to undrain.
    if [ -f "$(dirname "$ZONE_FILE")/drain.$n" ]; then
      setc "$n" "$FAIL_THRESHOLD" fail; setc "$n" 0 pass
      if member "$n"; then leave "$n"; log "node $n ($ip) DRAINED (manual drain file)"; fi
    elif probe "$n"; then
      note_pass "$n"
      setc "$n" "$(( $(getc "$n" pass) + 1 ))" pass; setc "$n" 0 fail
      if ! member "$n" && [ "$(getc "$n" pass)" -ge "$RISE_THRESHOLD" ]; then
        join "$n"; log "node $n ($ip) RESTORED to rotation"
      fi
    else
      note_fail "$n" "$REASON"
      setc "$n" "$(( $(getc "$n" fail) + 1 ))" fail; setc "$n" 0 pass
      if member "$n" && [ "$(getc "$n" fail)" -ge "$FAIL_THRESHOLD" ]; then
        leave "$n"; log "node $n ($ip) REMOVED from rotation (failed $(getc "$n" fail) probes)"
      fi
    fi
    member "$n" && healthy="$healthy $ip"
  done
  render $healthy
}

# Tests source the script with HA_DNS_HEALTH_LIB=1 to drive sweep() by hand.
[ "${HA_DNS_HEALTH_LIB:-0}" = "1" ] && return 0 2>/dev/null

# Start optimistic: everyone in rotation.
for n in $(node_names); do join "$n"; done

log "starting — nodes=[$NODES] host=$HEALTH_HOST path=$HEALTH_PATH interval=${CHECK_INTERVAL}s fail=${FAIL_THRESHOLD} rise=${RISE_THRESHOLD} apex-ttl=${APEX_TTL} self=${SELF_NODE:-?} served-by=[${SERVED_BY}] direct=${DIRECT_SCOPE}:[${DIRECT_URLS}]"
[ -n "$SERVED_BY" ] || log "WARN SERVED_BY empty: a node whose app is dead but whose Caddy falls back to the peer still passes"
[ "$DIRECT_SCOPE" = "off" ] || [ -n "$SELF_NODE" ] || [ "$DIRECT_SCOPE" = "all" ] || log "WARN self node unknown (set SELF_NODE or SELF_IP): direct app probe disabled"
while :; do
  sweep
  sleep "$CHECK_INTERVAL"
done
