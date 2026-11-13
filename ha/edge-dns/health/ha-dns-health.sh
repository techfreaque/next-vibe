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
# Liveness signal: GET https://<host-header unbottled.ai>/robots.txt via the
# node's PUBLIC IP must return 200. /robots.txt is app-served, unauthenticated,
# and returns 200 only while the Next.js app is actually serving (the port
# refuses the connection while a container is down/restarting). The app's
# authenticated /health endpoint can't be used as an anonymous probe (401).
#
# Manual drain: a file drain.<node> next to the zone removes <node> at once.
#
# Flap damping: a node must FAIL fail_threshold consecutive probes to be
# removed, and PASS rise_threshold consecutive probes to be re-added. Prevents
# a single lost packet from yanking a node.
#
# Never-dark guard: if the computed healthy set is EMPTY (both probes failing —
# almost always a probe-side fault, e.g. this box's egress is down), publish
# BOTH anyway. A wrong-but-present A beats an empty apex.
#
# Env (set by docker-compose.health.yml):
#   NODES            space list of "name=ip" e.g. "s1=72.61.156.49 s2=179.198.214.41"
#   HEALTH_HOST      Host header + SNI for the probe (default unbottled.ai)
#   HEALTH_PATH      path to probe (default /robots.txt; prod: /api/en-US/credits)
#   HEALTH_EXPECT    substring the body must contain (prod: "success":true)
#   PROBE_COOKIE_FILE  file with one "lead_id=<uuid>" line for the probe lead
#   ZONE_FILE        rendered zone path (default /etc/powerdns/zones/unbottled.ai.zone)
#   ZONE_TMPL        template path (default /zone.tmpl)
#   CHECK_INTERVAL   seconds between sweeps (default 10)
#   PROBE_TIMEOUT    per-probe curl timeout (default 4)
#   FAIL_THRESHOLD   consecutive fails to drop a node (default 2  → ~20s)
#   RISE_THRESHOLD   consecutive passes to restore a node (default 2)
#   APEX_TTL         TTL on the apex A records (default 30)
#
# Reload: the daemon just REWRITES the zone file with a bumped serial. PowerDNS
# is configured with bind-check-interval=5, so it re-reads a changed zone within
# 5s — no control socket, no shared binary. This image needs only curl + awk.
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

log(){ printf '%s ha-dns-health: %s\n' "$(date -u +%H:%M:%S)" "$*"; }

# per-node consecutive counters + current membership, kept in /run files.
STATE_DIR=/run/ha-dns-health
mkdir -p "$STATE_DIR"

node_names(){ for kv in $NODES; do echo "${kv%%=*}"; done; }
node_ip(){ for kv in $NODES; do [ "${kv%%=*}" = "$1" ] && { echo "${kv#*=}"; return; }; done; }

probe(){ # probe <ip> → 0 if 200
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
  ip="$1"; cookie=""
  [ -n "${PROBE_COOKIE_FILE:-}" ] && [ -s "$PROBE_COOKIE_FILE" ] && cookie="$(head -1 "$PROBE_COOKIE_FILE")"
  set -- -s $insec -w '\n%{http_code}' --max-time "$PROBE_TIMEOUT" \
    -A "unbottled-ha-probe/1" --resolve "${HEALTH_HOST}:443:$ip"
  [ -n "$cookie" ] && set -- "$@" -H "Cookie: $cookie"
  body="$(curl "$@" "https://${HEALTH_HOST}${HEALTH_PATH}" 2>/dev/null)"
  code="$(printf '%s' "$body" | tail -n1)"
  [ "$code" = "200" ] || return 1
  [ -z "${HEALTH_EXPECT:-}" ] && return 0
  printf '%s' "$body" | grep -qF "$HEALTH_EXPECT"
}

getc(){ cat "$STATE_DIR/$1.$2" 2>/dev/null || echo 0; }
setc(){ echo "$2" > "$STATE_DIR/$1.$3"; }
member(){ [ -f "$STATE_DIR/$1.in" ]; }
join(){ : > "$STATE_DIR/$1.in"; }
leave(){ rm -f "$STATE_DIR/$1.in"; }

# Start optimistic: everyone in rotation.
for n in $(node_names); do join "$n"; done

render(){ # render the healthy A set into the zone; bump serial + rewrite only on change
  ips="$*"
  if [ -z "$ips" ]; then
    log "WARN computed healthy set EMPTY — never-dark fallback: publishing ALL nodes"
    for n in $(node_names); do ips="$ips $(node_ip "$n")"; done
  fi
  # canonical healthy set for change-detection (sorted, space-joined)
  newset="$(for ip in $ips; do echo "$ip"; done | sort | tr '\n' ' ')"
  oldset="$(grep -E '^@[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A' "$ZONE_FILE" 2>/dev/null | awk '{print $NF}' | sort | tr '\n' ' ')"
  # unchanged set AND template not edited since the last render → leave zone
  # (and serial) alone. Editing the template (static records) re-renders.
  [ "$newset" = "$oldset" ] && [ ! "$ZONE_TMPL" -nt "$ZONE_FILE" ] && return 0

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
  tmp="$(mktemp)"
  sed -e "s/@@SERIAL@@/${serial}/" "$ZONE_TMPL" \
    | awk -v apex="$apex" -v www="$www" '/^;;APEX_A_RECORDS;;$/ { printf apex; next } /^;;WWW_A_RECORDS;;$/ { printf www; next } { print }' > "$tmp"
  chmod 644 "$tmp"              # mktemp is 0600; pdns (setuid=pdns) must read it
  mv "$tmp" "$ZONE_FILE"
  log "apex A changed: [${oldset}] -> [${newset}] — zone rewritten (serial ${serial}); pdns auto-reloads ≤${CHECK_INTERVAL}s"
}

log "starting — nodes=[$NODES] host=$HEALTH_HOST path=$HEALTH_PATH interval=${CHECK_INTERVAL}s fail=${FAIL_THRESHOLD} rise=${RISE_THRESHOLD} apex-ttl=${APEX_TTL}"
while :; do
  healthy=""
  for n in $(node_names); do
    ip="$(node_ip "$n")"
    # Manual drain: `touch /srv/ha-edge/zones/drain.<node>` on a box makes
    # that box's daemon treat <node> as failed (e.g. while the two boxes run
    # different builds). Do it on BOTH boxes; rm the files to undrain.
    if [ -f "$(dirname "$ZONE_FILE")/drain.$n" ]; then
      setc "$n" "$FAIL_THRESHOLD" fail; setc "$n" 0 pass
      if member "$n"; then leave "$n"; log "node $n ($ip) DRAINED (manual drain file)"; fi
    elif probe "$ip"; then
      setc "$n" "$(( $(getc "$n" pass) + 1 ))" pass; setc "$n" 0 fail
      if ! member "$n" && [ "$(getc "$n" pass)" -ge "$RISE_THRESHOLD" ]; then
        join "$n"; log "node $n ($ip) RESTORED to rotation"
      fi
    else
      setc "$n" "$(( $(getc "$n" fail) + 1 ))" fail; setc "$n" 0 pass
      if member "$n" && [ "$(getc "$n" fail)" -ge "$FAIL_THRESHOLD" ]; then
        leave "$n"; log "node $n ($ip) REMOVED from rotation (failed $(getc "$n" fail) probes)"
      fi
    fi
    member "$n" && healthy="$healthy $ip"
  done
  render $healthy
  sleep "$CHECK_INTERVAL"
done
