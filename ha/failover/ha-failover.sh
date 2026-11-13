#!/bin/bash
# ============================================================================
# ha-failover: Server 1 total-outage failover for unbottled.ai (2-box HA).
#
# Installed on BOTH boxes as /usr/local/sbin/ha-failover, config in
# /etc/ha-failover/ha.env (per box, see ha.env.s1 / ha.env.s2), secrets
# (SMTP, hosttech DNS token) in /etc/ha-failover/secrets.env (mode 600).
# The watchdog (`ha-failover watch`) runs as ha-failover-watch.service.
#
#   ha-failover status              roles, replication, peer reachability
#   ha-failover promote [--yes]     S2: make this box the primary (S1 is DEAD)
#   ha-failover hold <reason>       S2: pause AUTO failover (planned S1 work)
#   ha-failover unhold
#   ha-failover witness             ask check-host.net whether S1 is down
#   ha-failover watch               the watchdog loop (systemd runs it)
#   ha-failover drill-promote       S2: full promote + app drill on a CLONE
#   ha-failover drill-partition N [--witness=down] [--mode=full]
#                                   S2: hide S1 from S2 for N seconds (dry run)
#   ha-failover test-alert          send a test email
#
# ---------------------------------------------------------------------------
# Why "automatic, but only with a witness" (the split-brain trade-off):
# Two nodes cannot tell "S1 is dead" from "the S1<->S2 link is dead" on their
# own. S2 therefore promotes ONLY when ALL of these hold for HA_FAILOVER_AFTER
# seconds (default 180):
#   1. S1 is unreachable from S2 on EVERY path: WG ping, WG ssh/5432, public
#      443 and public 22;
#   2. S2 itself has internet (>=2 of 1.1.1.1 / 8.8.8.8 / 9.9.9.9 on 443);
#   3. an external witness (check-host.net, 3+ probe nodes in other networks)
#      also fails to reach S1:443 and nobody succeeds;
#   4. no maintenance hold is set (ha-failover hold).
# If the witness is unreachable or says S1 is up, S2 does NOT promote; it
# emails Max with the one command to run instead.
# Fencing: on promote S2 writes role=primary. S1's watchdog asks S2 for its
# role every 10 s over a restricted SSH key and fences itself (stops + disables
# next-vibe-app and prod-postgres) the moment it sees S2 primary; S2 also
# pushes `fence` to S1 whenever it can reach it. A fenced S1 stays fenced
# across reboots until the rejoin runbook (ha/README.md) is run by hand.
# ============================================================================
set -u
CONF=/etc/ha-failover/ha.env
SECRETS=/etc/ha-failover/secrets.env
[ -f "$CONF" ] && . "$CONF"

NODE="${HA_NODE:?set HA_NODE in $CONF}"
PEER="${HA_PEER:-peer}"
PEER_WG="${HA_PEER_WG:?}"
PEER_PUBLIC="${HA_PEER_PUBLIC:?}"
SELF_PUBLIC="${HA_SELF_PUBLIC:?}"
STATE_DIR="${HA_STATE_DIR:-/var/lib/ha-failover}"
PEER_KEY="${HA_PEER_KEY:-/root/.ssh/ha-peer}"
LOCAL_PG="${HA_LOCAL_PG:-}"
PG_DATA="${HA_PG_DATA:-/var/lib/postgresql/data}"
APP_DIR="${HA_APP_DIR:-/root/unbottled}"
INTERVAL="${HA_CHECK_INTERVAL:-15}"
ALERT_AFTER="${HA_ALERT_AFTER:-60}"
FAILOVER_AFTER="${HA_FAILOVER_AFTER:-180}"
AUTO="${HA_AUTO_FAILOVER:-0}"
MAIL="${HA_MAIL_BIN:-/usr/local/sbin/ha-mail}"
PEER_CMD="${HA_PEER_CMD_BIN:-/usr/local/sbin/ha-peer-cmd}"
mkdir -p "$STATE_DIR"

log() { printf '%s [ha-failover %s] %s\n' "$(date -u +%FT%TZ)" "$NODE" "$*"; }
role() { cat "$STATE_DIR/role" 2>/dev/null || echo "${HA_DEFAULT_ROLE:-standby}"; }
set_role() { echo "$1" > "$STATE_DIR/role.tmp" && mv "$STATE_DIR/role.tmp" "$STATE_DIR/role"; }

alert() { # alert <subject> <body>
  local tag="[unbottled HA]"
  [ -f "$STATE_DIR/drill-dry" ] && tag="[unbottled HA DRILL]"
  log "ALERT: $1"
  printf '%s\n\n-- %s, %s UTC, role=%s\n' "$2" "$(hostname)" "$(date -u '+%F %T')" "$(role)" \
    | timeout 60 python3 "$MAIL" "$tag $1" - >/dev/null 2>&1 \
    || log "alert mail FAILED (check $SECRETS)"
}
# alert_once <key> <subject> <body>: one mail per key until clear_once <key>
alert_once() { [ -f "$STATE_DIR/alerted.$1" ] && return 0; alert "$2" "$3"; : > "$STATE_DIR/alerted.$1"; }
clear_once() { rm -f "$STATE_DIR/alerted.$1"; }
was_alerted() { [ -f "$STATE_DIR/alerted.$1" ]; }

tcp() { timeout "${3:-3}" bash -c ": </dev/tcp/$1/$2" 2>/dev/null; }

peer_ssh() { # peer_ssh <verb>
  timeout 12 ssh -i "$PEER_KEY" -o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=5 \
    -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile="$STATE_DIR/peer.known_hosts" \
    "root@$PEER_WG" "$1" 2>/dev/null
}

# Is the peer box alive on ANY path? Prints the paths that answered.
peer_paths() {
  local up=""
  ping -c1 -W2 "$PEER_WG" >/dev/null 2>&1 && up="$up wg-icmp"
  tcp "$PEER_WG" 22 && up="$up wg-ssh"
  [ -n "${HA_PEER_PG_PORT:-}" ] && tcp "$PEER_WG" "$HA_PEER_PG_PORT" && up="$up wg-pg"
  tcp "$PEER_PUBLIC" 443 && up="$up pub-443"
  tcp "$PEER_PUBLIC" 22 && up="$up pub-22"
  echo "$up"
}
internet_ok() {
  local n=0
  for ip in 1.1.1.1 8.8.8.8 9.9.9.9; do tcp "$ip" 443 && n=$((n + 1)); done
  [ "$n" -ge 2 ]
}

# External witness: check-host.net TCP probe of PEER_PUBLIC:443 from 3-4
# nodes in other networks. Prints down|up|unknown.
witness() {
  local id res target="${1:-$PEER_PUBLIC}"
  id="$(curl -s --max-time 15 -H 'Accept: application/json' \
    "https://check-host.net/check-tcp?host=${target}:443&max_nodes=4" \
    | python3 -c 'import json,sys; print(json.load(sys.stdin).get("request_id",""))' 2>/dev/null)"
  [ -n "$id" ] || { echo unknown; return; }
  sleep 20
  res="$(curl -s --max-time 15 -H 'Accept: application/json' "https://check-host.net/check-result/$id")"
  printf '%s' "$res" | python3 -c '
import json,sys
try: d=json.load(sys.stdin)
except Exception: print("unknown"); sys.exit()
ok=fail=0
for node,v in d.items():
    if not v: continue                 # pending / no answer from that node
    r=next((x for x in v if isinstance(x,dict)),{}) if isinstance(v,list) else {}
    if "time" in r: ok+=1
    elif "error" in r or "message" in r: fail+=1
print("up" if ok else ("down" if fail>=2 else "unknown"))' 2>/dev/null || echo unknown
}

pg_q() { docker exec "${2:-$LOCAL_PG}" psql -U postgres -Atc "$1" 2>/dev/null; }

replication_line() {
  pg_q "select 'in_recovery='||pg_is_in_recovery()||' receive='||coalesce(pg_last_wal_receive_lsn()::text,'-')||' replay='||coalesce(pg_last_wal_replay_lsn()::text,'-')||' last_xact_age='||coalesce(date_trunc('second',now()-pg_last_xact_replay_timestamp())::text,'-')||' receiver='||coalesce((select status from pg_stat_wal_receiver),'none')"
}

# promote_pg <container>: wait for replay to catch up with what was received,
# then pg_ctl promote and wait until writable. Used by promote AND the drill.
promote_pg() {
  local c="$1" i
  for i in $(seq 1 30); do
    [ "$(pg_q "select coalesce(pg_last_wal_replay_lsn() >= pg_last_wal_receive_lsn(), true)" "$c")" = "t" ] && break
    sleep 1
  done
  log "promoting $c ($(pg_q "select 'replay='||pg_last_wal_replay_lsn()" "$c"))"
  docker exec -u postgres "$c" pg_ctl promote -D "$PG_DATA" >/dev/null || return 1
  for i in $(seq 1 60); do
    [ "$(pg_q 'select pg_is_in_recovery()' "$c")" = "f" ] && { log "$c is now a WRITABLE primary"; return 0; }
    sleep 1
  done
  return 1
}

# Point the S2 app at this box's backends and recreate it.
switch_app_local() {
  cd "$APP_DIR" || return 1
  local url ts
  ts="$(date -u +%Y%m%d%H%M%S)"
  url="$(cat .ha-database-url)"
  cp .ha-database-url ".ha-database-url.bak-$ts"; cp .env ".env.bak.failover-$ts"
  [ -f .ha-overrides ] && cp .ha-overrides ".ha-overrides.bak-$ts"
  # postgres://s2app:<pw>@10.88.0.1:5432/... -> @pg-replica:5432/...
  printf '%s\n' "$url" | sed -E "s#@[^/]+/#@${HA_LOCAL_DB_HOST:-pg-replica}:5432/#" > .ha-database-url.new
  mv .ha-database-url.new .ha-database-url; chmod 600 .ha-database-url
  local muser mpass
  muser="$(grep -E '^MINIO_ROOT_USER=' .env | tail -1 | cut -d= -f2-)"
  mpass="$(grep -E '^MINIO_ROOT_PASSWORD=' .env | tail -1 | cut -d= -f2-)"
  umask 077
  cat > .ha-overrides <<EOF
HA_ROLE=primary
HA_REDIS_URL=${HA_LOCAL_REDIS_URL:-redis://unbottled-redis:6379}
HA_S3_ENDPOINT=${HA_LOCAL_S3_ENDPOINT:-http://unbottled-minio:9000}
HA_S3_ACCESS_KEY_ID=$muser
HA_S3_SECRET_ACCESS_KEY=$mpass
HA_TASK_RUNNER=true
HA_DB_SETUP=true
EOF
  # Re-merge .env in place (same file as base + overrides) so compose sees it.
  python3 ha/scripts/merge-env.py .env .env .env.next .ha-database-url .ha-overrides >/dev/null \
    && chmod 600 .env.next && mv .env.next .env || return 1
  HA_NO_ROLLBACK=1 bash scripts/deploy-ha-node.sh
}

# Interim DNS failover while unbottled.ai is still delegated to hosttech
# (before the registrar points at ns1/ns2.unbottled.ai): repoint the apex and
# www A records at this box via the hosttech API. With the self-hosted NS the
# health daemon already did this and nothing is changed here.
dns_failover() {
  local ns
  ns="$(dig +short NS unbottled.ai @1.1.1.1 2>/dev/null | tr '\n' ' ')"
  case "$ns" in
  *unbottled.ai.*) log "DNS: self-hosted NS ($ns): health daemon handles the apex"; echo "self-hosted NS, health daemon removed $PEER"; return 0 ;;
  esac
  [ -f "$SECRETS" ] && { set -a; . "$SECRETS"; set +a; }
  [ -n "${HOSTTECH_DNS_KEY:-}" ] || { echo "hosttech NS but no HOSTTECH_DNS_KEY: change A records by hand"; return 1; }
  python3 - "$SELF_PUBLIC" "${HA_HOSTTECH_ZONE_ID:-391416}" <<'PY'
import json,os,sys,urllib.request
ip,zone=sys.argv[1],sys.argv[2]; key=os.environ["HOSTTECH_DNS_KEY"]
base=f"https://api.ns1.hosttech.eu/api/user/v1/zones/{zone}/records"
def req(method,url,body=None):
    r=urllib.request.Request(url,method=method,data=json.dumps(body).encode() if body else None,
      headers={"Authorization":"Bearer "+key,"Content-Type":"application/json","Accept":"application/json"})
    return json.load(urllib.request.urlopen(r,timeout=20))
done=[]
for rec in req("GET",base)["data"]:
    if rec["type"]=="A" and rec.get("name","") in ("","www") and rec["ipv4"]!=ip:
        req("PUT",f"{base}/{rec['id']}",{"type":"A","name":rec.get("name",""),"ipv4":ip,"ttl":rec["ttl"],"comment":"ha-failover"})
        done.append((rec.get("name") or "@")+" "+rec["ipv4"]+"->"+ip)
print("hosttech: "+(", ".join(done) or "already pointing here"))
PY
}

cmd_status() {
  echo "node=$NODE role=$(role) auto=$AUTO hold=$( [ -f "$STATE_DIR/hold" ] && cat "$STATE_DIR/hold" || echo no)"
  [ -n "$LOCAL_PG" ] && echo "local pg ($LOCAL_PG): $(replication_line)"
  echo "peer $PEER paths up: [$(peer_paths)]"
  echo "peer says: $(peer_ssh state || echo unreachable)"
  [ -f "$STATE_DIR/peer-down-since" ] && echo "peer down since $(date -u -d @"$(cat "$STATE_DIR/peer-down-since")" +%T) UTC"
  [ -d "$APP_DIR" ] && [ -f "$APP_DIR/.ha-overrides" ] && echo "app overrides: $(cut -d= -f1 "$APP_DIR/.ha-overrides" | tr '\n' ' ')"
  return 0
}

cmd_promote() {
  local yes=0 auto=0 force=0 t0 out
  for a in "$@"; do case "$a" in --yes) yes=1 ;; --auto) auto=1; yes=1 ;; --force) force=1 ;; esac; done
  [ "$NODE" = "s2" ] || { echo "promote runs on Server 2 only"; return 2; }
  [ "$(role)" = "primary" ] && { echo "already primary"; return 0; }
  local paths; paths="$(peer_paths)"
  if [ -n "$paths" ] && [ "$force" != 1 ]; then
    echo "REFUSED: Server 1 still answers on [$paths]. Promoting now would split the brain."
    echo "If S1 is truly broken but still pingable, stop its app + Postgres first, then rerun with --force."
    return 3
  fi
  if [ "$yes" != 1 ]; then
    echo "!! Promote Server 2 to PRIMARY. Server 1 must be DOWN. Replication: $(replication_line)"
    read -r -p "type PROMOTE to continue: " ok; [ "$ok" = "PROMOTE" ] || { echo aborted; return 1; }
  fi
  t0=$(date +%s)
  set_role promoting
  local fence; fence="$(peer_ssh fence || echo 'S1 unreachable (expected when dead)')"
  promote_pg "$LOCAL_PG" || { set_role standby; alert "FAILOVER FAILED: pg promote" "pg_ctl promote on $LOCAL_PG failed. Replication: $(replication_line)"; return 1; }
  set_role primary; date -u +%s > "$STATE_DIR/promoted-at"
  out="$(switch_app_local 2>&1)"; local app_rc=$?
  out="$(printf '%s\n' "$out" | tail -15)"
  local dns; dns="$(dns_failover 2>&1)"
  alert "FAILOVER DONE: Server 2 is primary ($( [ $auto = 1 ] && echo automatic || echo manual))" \
"Server 2 promoted itself to primary in $(( $(date +%s) - t0 ))s.
Trigger: $( [ $auto = 1 ] && echo "automatic (S1 unreachable on all paths + external witness agreed)" || echo "manual ha-failover promote")
Fence S1: $fence
Postgres: $(replication_line)
App recreate (rc=$app_rc):
$out
DNS: $dns

S1 will fence itself (app + Postgres stopped, restart=no) as soon as it is back
and sees S2 primary. Rejoin is manual: ha/README.md 'Rejoin after failover'."
  return 0
}

watch_s2() {
  local r paths now since
  r="$(role)"
  if [ "$r" = "primary" ]; then
    # Keep the old primary fenced whenever it is reachable.
    paths="$(peer_paths)"
    if [ -n "$paths" ]; then
      local st; st="$(peer_ssh state)"
      case "$st" in
      *role=fenced*) alert_once s1-fenced "Server 1 is back and FENCED" "S1 is reachable again ($paths) and reports: $st
It serves nothing from its own data. Run the rejoin runbook when convenient (ha/README.md)." ;;
      *) st="$(peer_ssh fence)"; log "pushed fence to $PEER: ${st:-no answer}" ;;
      esac
    fi
    return
  fi
  [ "$r" = "promoting" ] && return
  now=$(date +%s)
  paths="$(peer_paths)"
  if [ -n "$paths" ]; then
    if [ -f "$STATE_DIR/peer-down-since" ]; then
      since=$(cat "$STATE_DIR/peer-down-since"); rm -f "$STATE_DIR/peer-down-since"
      was_alerted s1-down && alert "Server 1 reachable again" "S1 answers again on [$paths] after $((now - since))s. No failover happened."
      clear_once s1-down; clear_once witness-blocked
    fi
    # Replication health (S1 alive): alert if the standby stopped streaming.
    if [ -n "$LOCAL_PG" ]; then
      # Healthy = streaming AND heard from the primary within 60 s (wal
      # receiver keepalives arrive every ~10 s even when nothing is written).
      if [ "$(pg_q "select coalesce((select status||':'||(extract(epoch from now()-last_msg_receipt_time) < ${HA_REPL_MAX_SILENCE:-60}) from pg_stat_wal_receiver),'none')")" = "streaming:true" ]; then
        rm -f "$STATE_DIR/repl-bad-since"; was_alerted repl && alert "Replication streaming again" "$(replication_line)"; clear_once repl
      else
        [ -f "$STATE_DIR/repl-bad-since" ] || echo "$now" > "$STATE_DIR/repl-bad-since"
        [ $((now - $(cat "$STATE_DIR/repl-bad-since"))) -ge 300 ] && alert_once repl "Postgres standby NOT streaming / silent for 5+ min" "S1 is up but the S2 standby is not streaming (or heard nothing from S1 for >60 s): $(replication_line)
Without streaming, a failover would lose everything since the last replayed WAL."
      fi
    fi
    return
  fi
  if ! internet_ok; then
    log "S1 unreachable but so is the internet from here: S2 is the isolated one, doing nothing"
    return
  fi
  [ -f "$STATE_DIR/peer-down-since" ] || { echo "$now" > "$STATE_DIR/peer-down-since"; log "S1 unreachable on all paths"; }
  since=$(cat "$STATE_DIR/peer-down-since")
  local down=$((now - since))
  [ "$down" -ge "$ALERT_AFTER" ] && alert_once s1-down "Server 1 UNREACHABLE (${down}s)" "S2 cannot reach S1 on any path (WG icmp/ssh, public 443/22) for ${down}s; S2 has internet.
Auto failover: $( [ "$AUTO" = 1 ] && echo "ON, after ${FAILOVER_AFTER}s if check-host.net agrees" || echo OFF)$( [ -f "$STATE_DIR/hold" ] && echo " (HOLD set: $(cat "$STATE_DIR/hold"))")
Manual: ssh S2, run: ha-failover promote"
  [ "$down" -ge "$FAILOVER_AFTER" ] || return
  [ "$AUTO" = 1 ] || return
  if [ -f "$STATE_DIR/hold" ]; then log "hold set, not promoting"; return; fi
  local w; w="$(witness)"
  # Drill only: pretend the witness agrees, to exercise the would-promote path.
  [ -f "$STATE_DIR/drill-dry" ] && [ -f "$STATE_DIR/drill-witness-down" ] && w="down (drill override, real: $w)"
  log "witness says S1 is: $w"
  if [ "${w%% *}" != "down" ]; then
    alert_once witness-blocked "Auto failover BLOCKED (witness: $w)" "S1 has been unreachable from S2 for ${down}s, but the external witness says '$w', so S2 will not promote on its own (split-brain guard).
If S1 is really dead: ssh S2 and run: ha-failover promote"
    return
  fi
  if [ -f "$STATE_DIR/drill-dry" ]; then
    log "DRILL: all failover conditions met, WOULD PROMOTE now (dry run, nothing changed)"
    alert_once drill-would-promote "DRILL: auto failover WOULD promote now" "Dry run: S1 hidden from S2 for ${down}s, witness=$w. Nothing was changed."
    return
  fi
  cmd_promote --auto
}

watch_s1() {
  local r st
  r="$(role)"
  if [ "$r" = "fenced" ]; then
    local c
    for c in ${HA_FENCE_CONTAINERS:-}; do
      if [ "$(docker inspect -f '{{.State.Running}}' "$c" 2>/dev/null)" = "true" ]; then
        log "fenced but $c is running: stopping it"
        "$PEER_CMD" fence-local >/dev/null
        alert "Fenced Server 1: stopped $c again" "S1 is fenced (S2 is primary) but $c was running (reboot or manual start). Stopped it. Rejoin: ha/README.md."
      fi
    done
    return
  fi
  st="$(peer_ssh state)"
  case "$st" in
  *role=primary*)
    "$PEER_CMD" fence-local >/dev/null
    alert "Server 1 FENCED itself: Server 2 is primary" "S2 reports: $st
S1 stopped and disabled: ${HA_FENCE_CONTAINERS:-}. Its Caddy now serves unbottled.ai from S2's app over WG.
Rejoin S1 as a standby: ha/README.md 'Rejoin after failover'."
    ;;
  "")
    local now; now=$(date +%s)
    [ -f "$STATE_DIR/peer-down-since" ] || echo "$now" > "$STATE_DIR/peer-down-since"
    [ $((now - $(cat "$STATE_DIR/peer-down-since"))) -ge "${HA_PEER_ALERT_AFTER:-300}" ] && alert_once s2-down "Server 2 unreachable from Server 1" "S1 cannot reach S2 over WG for 5+ min. S1 keeps serving alone; the standby and failover target are gone until S2 is back."
    ;;
  *)
    if [ -f "$STATE_DIR/peer-down-since" ]; then
      rm -f "$STATE_DIR/peer-down-since"
      was_alerted s2-down && alert "Server 2 reachable again" "S2 reports: $st"
      clear_once s2-down
    fi
    ;;
  esac
}

# WireGuard path failover: plain WG between the public IPv6 and IPv4
# addresses (HA_WG_ENDPOINTS, preferred first). When the handshake is older
# than HA_WG_STALE_AFTER (WG re-handshakes every 2 min while traffic flows),
# point the peer at the next address. WG roams, so the peer follows as soon
# as one handshake gets through. Added 2026-11-13 after the provider started
# dropping IPv4 UDP S1->S2 while IPv6 kept working. No tunnel, no new port.
wg_path_check() {
  [ -n "${HA_WG_ENDPOINTS:-}" ] || return 0
  local peer hs now age last cur next first e found=0
  peer="$(wg show wg0 peers 2>/dev/null | head -1)"; [ -n "$peer" ] || return 0
  now=$(date +%s)
  hs="$(wg show wg0 latest-handshakes 2>/dev/null | awk '{print $2}' | head -1)"
  age=$((now - ${hs:-0}))
  cur="$(wg show wg0 endpoints 2>/dev/null | awk '{print $2}' | head -1)"
  if [ "$age" -lt "${HA_WG_STALE_AFTER:-180}" ]; then
    was_alerted wg-stale && alert "WireGuard link up again" "Handshake ${age}s ago via $cur."
    clear_once wg-stale
    return 0
  fi
  last=$(cat "$STATE_DIR/wg-flip-at" 2>/dev/null || echo 0)
  [ $((now - last)) -ge "${HA_WG_FLIP_EVERY:-60}" ] || return 0
  for e in $HA_WG_ENDPOINTS; do
    [ -z "${first:-}" ] && first="$e"
    if [ "$found" = 1 ]; then next="$e"; break; fi
    [ "$e" = "$cur" ] && found=1
  done
  next="${next:-$first}"
  [ "$next" = "$cur" ] && return 0
  wg set wg0 peer "$peer" endpoint "$next" && echo "$now" > "$STATE_DIR/wg-flip-at"
  log "WG handshake ${age}s old via $cur: switched peer endpoint to $next"
  alert_once wg-stale "WireGuard link stale, switching path" "No WG handshake for ${age}s via $cur. Switched the peer endpoint to $next (will keep alternating every ${HA_WG_FLIP_EVERY:-60}s until a handshake succeeds).
While the link is down: S2 app has no DB (DNS probe pulls S2), the standby does not stream, MinIO replication queues."
}

cmd_watch() {
  log "watchdog start: role=$(role) auto=$AUTO interval=${INTERVAL}s failover_after=${FAILOVER_AFTER}s"
  while :; do
    wg_path_check
    if [ "$NODE" = "s2" ]; then watch_s2; else watch_s1; fi
    sleep "$INTERVAL"
  done
}

# ---------------------------------------------------------------------------
# Drills (never touch prod data or the live app)
# ---------------------------------------------------------------------------
DRILL_NET=ha-drill
DRILL_PG=unbottled-pg-drill
DRILL_REDIS=unbottled-redis-drill
DRILL_APP=unbottled-app-drill
DRILL_DATA=/srv/unbottled/drill-pg

drill_cleanup() {
  docker rm -f "$DRILL_APP" "$DRILL_PG" "$DRILL_REDIS" >/dev/null 2>&1
  docker network disconnect "$DRILL_NET" unbottled-minio >/dev/null 2>&1
  docker network rm "$DRILL_NET" >/dev/null 2>&1
  if [ -d "$DRILL_DATA" ]; then
    mkdir -p /root/.tmp/todelete; mv "$DRILL_DATA" "/root/.tmp/todelete/drill-pg-$(date -u +%s)"
  fi
}

cmd_drill_promote() {
  [ "$NODE" = "s2" ] || { echo "S2 only"; return 2; }
  [ -e "$DRILL_DATA" ] && { echo "$DRILL_DATA exists; run: ha-failover drill-cleanup"; return 1; }
  local img t0 t1 t2 url
  img="$(docker inspect -f '{{.Config.Image}}' "$LOCAL_PG")"
  t0=$(date +%s)
  log "drill: base backup of the live standby (read-only for it) -> $DRILL_DATA"
  mkdir -p "$DRILL_DATA"
  docker exec -u postgres "$LOCAL_PG" pg_basebackup -D - -Ft -X fetch -c fast 2>/dev/null | tar -x -C "$DRILL_DATA" || { echo "base backup failed"; return 1; }
  # Clone must never talk to S1: drop the streaming config, keep it a standby.
  sed -i -E '/^(primary_conninfo|primary_slot_name)/d' "$DRILL_DATA/postgresql.auto.conf" "$DRILL_DATA/postgresql.conf" 2>/dev/null
  echo "primary_conninfo = ''" >> "$DRILL_DATA/postgresql.auto.conf"
  : > "$DRILL_DATA/standby.signal"
  chown -R 999:999 "$DRILL_DATA"; chmod 700 "$DRILL_DATA"
  # --internal: the drill network has NO route out (no Stripe, mail, S1, ...).
  docker network create --internal "$DRILL_NET" >/dev/null
  docker run -d --name "$DRILL_PG" --network "$DRILL_NET" --network-alias pg-drill \
    -v "$DRILL_DATA":/var/lib/postgresql/data "$img" postgres -c hot_standby=on >/dev/null
  docker run -d --name "$DRILL_REDIS" --network "$DRILL_NET" --network-alias redis-drill redis:7-alpine >/dev/null
  docker network connect --alias minio-drill "$DRILL_NET" unbottled-minio
  local i; for i in $(seq 1 60); do [ "$(pg_q 'select pg_is_in_recovery()' "$DRILL_PG")" = "t" ] && break; sleep 1; done
  log "drill: clone up as standby ($(pg_q "select 'replay='||pg_last_wal_replay_lsn()" "$DRILL_PG")), clone took $(( $(date +%s) - t0 ))s"
  t1=$(date +%s)
  promote_pg "$DRILL_PG" || { echo "drill promote FAILED"; return 1; }
  pg_q "create table ha_drill_probe(x int); insert into ha_drill_probe values (1); drop table ha_drill_probe; select 'write-ok'" "$DRILL_PG"
  local tp=$(( $(date +%s) - t1 ))
  # Drill app = the real S2 app image + .env with the post-failover overrides,
  # on the internal network only, task runner OFF (no crons, no mail).
  url="$(sed -E "s#@[^/]+/#@pg-drill:5432/#" "$APP_DIR/.ha-database-url")"
  local muser mpass appimg
  muser="$(grep -E '^MINIO_ROOT_USER=' "$APP_DIR/.env" | tail -1 | cut -d= -f2- | tr -d '"')"
  mpass="$(grep -E '^MINIO_ROOT_PASSWORD=' "$APP_DIR/.env" | tail -1 | cut -d= -f2- | tr -d '"')"
  appimg="$(docker inspect -f '{{.Config.Image}}' unbottled-app)"
  t2=$(date +%s)
  # docker run --env-file keeps quotes literally (compose strips them), which
  # breaks the app's runtime env patch: write a quote-stripped copy (600).
  local envf; envf="$(mktemp /root/.ha-drill-env.XXXXXX)"
  python3 -c '
import re,sys
for l in open(sys.argv[1]):
    m=re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", l.rstrip("\n"))
    if not m: continue
    v=m.group(2).strip()
    if len(v)>=2 and v[0]==v[-1] and v[0] in "\"\x27": v=v[1:-1]
    print(m.group(1)+"="+v)' "$APP_DIR/.env" > "$envf"
  docker run -d --name "$DRILL_APP" --network "$DRILL_NET" --env-file "$envf" \
    -e NODE_ENV=production -e DATABASE_URL="$url" -e WS_PUBSUB_TYPE=redis -e REDIS_URL=redis://redis-drill:6379 \
    -e CHAT_STORAGE_TYPE=s3 -e S3_ENDPOINT=http://minio-drill:9000 -e S3_ACCESS_KEY_ID="$muser" -e S3_SECRET_ACCESS_KEY="$mpass" \
    -e S3_BUCKET=chat-media -e S3_REGION=us-east-1 -e VIBE_DISABLE_PROXY=false \
    -e NEXT_PUBLIC_APP_URL=https://unbottled.ai -e NEXT_PUBLIC_PROJECT_URL=https://unbottled.ai \
    "$appimg" bun src/vibe/platforms/cli/vibe-runtime.ts start --seed=false --db-setup=true --task-runner=false >/dev/null
  mv "$envf" /root/.tmp/todelete/ 2>/dev/null || { mkdir -p /root/.tmp/todelete && mv "$envf" /root/.tmp/todelete/; }
  local code=000
  for i in $(seq 1 120); do
    code="$(docker exec "$DRILL_APP" wget -q -S -O /dev/null http://127.0.0.1:3000/robots.txt 2>&1 | awk '/^  HTTP\//{print $2}' | tail -1)"
    [ "$code" = "200" ] && break; sleep 2
  done
  local ta=$(( $(date +%s) - t2 ))
  echo "=== DRILL RESULT ==="
  echo "clone+start standby: $(( t1 - t0 ))s | promote+write test: ${tp}s | app on promoted DB serving robots=$code after ${ta}s"
  for p in /robots.txt /en-US /en-US/models /en-US/story/blog /sitemap.xml; do
    printf '  %-22s %s\n' "$p" "$(docker exec "$DRILL_APP" wget -q -S -O /dev/null "http://127.0.0.1:3000$p" 2>&1 | awk '/^  HTTP\//{print $2}' | tail -1)"
  done
  echo "  db rows (users): $(pg_q 'select count(*) from users' "$DRILL_PG")"
  echo "  app log tail:"; docker logs --tail 8 "$DRILL_APP" 2>&1 | sed 's/^/    /' | cut -c1-200
  [ "${KEEP:-0}" = 1 ] || drill_cleanup
}

# Hide S1 from S2 for N seconds (iptables on S2 only, auto-removed by a
# systemd timer even if this shell dies) with the watchdog in dry-run mode.
#   default (--mode=watch): only S2's HOST stack loses S1 (OUTPUT chain, WG
#     encapsulation exempt). The watchdog sees a dead S1; the apps, the WG link,
#     replication and Caddy keep working, so no user notices. Safe any time.
#   --mode=full: S2 loses S1 entirely (host + containers + WG), like a real
#     S1 death as seen from S2: S2-served requests FAIL meanwhile. Only before
#     the NS delegation (nobody is routed to S2) or in a quiet window.
cmd_drill_partition() {
  local secs="${1:-270}" a mode=watch
  [ "$NODE" = "s2" ] || { echo "S2 only"; return 2; }
  for a in "${@:2}"; do case "$a" in
    --witness=down) : > "$STATE_DIR/drill-witness-down" ;;
    --mode=full) mode=full ;;
  esac; done
  : > "$STATE_DIR/drill-dry"
  iptables -N HA-DRILL 2>/dev/null || iptables -F HA-DRILL
  if [ "$mode" = full ]; then
    iptables -A HA-DRILL -s "$PEER_PUBLIC" -j DROP; iptables -A HA-DRILL -d "$PEER_PUBLIC" -j DROP
    iptables -A HA-DRILL -s "$PEER_WG" -j DROP; iptables -A HA-DRILL -d "$PEER_WG" -j DROP
    for ch in INPUT OUTPUT FORWARD; do iptables -I "$ch" 1 -j HA-DRILL; done
  else
    iptables -A HA-DRILL -d "$PEER_PUBLIC" -p udp --dport "${HA_WG_PORT:-51820}" -j RETURN
    iptables -A HA-DRILL -d "$PEER_PUBLIC" -j DROP; iptables -A HA-DRILL -d "$PEER_WG" -j DROP
    iptables -I OUTPUT 1 -j HA-DRILL
  fi
  # Freeze this box's DNS health daemon so ns2 keeps publishing S1 during the
  # drill (otherwise, once delegated, ns2 would drop S1 for everyone).
  docker pause ha-edge-dns-health >/dev/null 2>&1 || true
  systemd-run --unit="ha-drill-undo-$(date +%s)" --on-active="${secs}s" /usr/local/sbin/ha-failover drill-partition-undo >/dev/null 2>&1 \
    || log "WARN: could not schedule auto-undo; run: ha-failover drill-partition-undo"
  log "DRILL ($mode): S1 hidden from S2 for ${secs}s (auto-undo scheduled)"
}
cmd_drill_partition_undo() {
  for ch in INPUT OUTPUT FORWARD; do while iptables -D "$ch" -j HA-DRILL 2>/dev/null; do :; done; done
  iptables -F HA-DRILL 2>/dev/null; iptables -X HA-DRILL 2>/dev/null
  rm -f "$STATE_DIR/drill-dry" "$STATE_DIR/drill-witness-down" "$STATE_DIR/peer-down-since"
  rm -f "$STATE_DIR"/alerted.drill-would-promote "$STATE_DIR"/alerted.s1-down "$STATE_DIR"/alerted.witness-blocked
  docker unpause ha-edge-dns-health >/dev/null 2>&1 || true
  log "DRILL: partition removed"
}

case "${1:-status}" in
status) cmd_status ;;
promote) shift; cmd_promote "$@" ;;
hold) shift; echo "${*:-manual hold} (set $(date -u +%FT%TZ))" > "$STATE_DIR/hold"; echo "auto failover on hold" ;;
unhold) rm -f "$STATE_DIR/hold"; echo "hold cleared" ;;
witness) shift; witness "$@" ;;
watch) cmd_watch ;;
dns-failover) dns_failover ;;
drill-promote) cmd_drill_promote ;;
drill-cleanup) drill_cleanup ;;
drill-partition) shift; cmd_drill_partition "$@" ;;
drill-partition-undo) cmd_drill_partition_undo ;;
test-alert) alert "test alert from $NODE" "If you read this, HA alert mail works. $(cmd_status 2>&1)" ;;
*) sed -n '2,20p' "$0"; exit 2 ;;
esac
