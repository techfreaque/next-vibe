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
#   ha-failover promote [--dry-run|--yes] S2: make this box the primary (S1 is DEAD)
#   ha-failover hold <reason>       S2: pause AUTO failover (planned S1 work)
#   ha-failover unhold
#   ha-failover witness             ask check-host.net whether S1 is down
#   ha-failover watch               the watchdog loop (systemd runs it)
#   ha-failover drill-promote       S2: full promote + app drill on a CLONE
#   ha-failover drill-partition N [--witness=down] [--mode=full]
#                                   S2: hide S1 from S2 for N seconds (dry run)
#   ha-failover test-alert          send a test email
#   ha-failover pg-conn-check       run the Postgres connection-slot check now
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
if [[ " $* " != *" --dry-run "* && "${1:-}" != observe-loss ]]; then mkdir -p "$STATE_DIR"; fi

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
  {
    (ping -c1 -W2 "$PEER_WG" >/dev/null 2>&1 && echo wg-icmp) &
    (tcp "$PEER_WG" 22 && echo wg-ssh) &
    if [ -n "${HA_PEER_PG_PORT:-}" ]; then (tcp "$PEER_WG" "$HA_PEER_PG_PORT" && echo wg-pg) & fi
    (tcp "$PEER_PUBLIC" 443 && echo pub-443) &
    (tcp "$PEER_PUBLIC" 22 && echo pub-22) &
    wait
  } | tr '\n' ' '
}
internet_ok() {
  local count
  count="$({
    for ip in 1.1.1.1 8.8.8.8 9.9.9.9; do (tcp "$ip" 443 && echo online) & done
    wait
  } | wc -l)"
  [ "$count" -ge 2 ]
}

witness() {
  timeout 26 python3 "${HA_WITNESS_BIN:-/usr/local/lib/unbottled-ha/witness.py}" "${1:-$PEER_PUBLIC}" || echo unknown
}

# During the planned physical power-off the real watcher is primary and held.
# Observe the same paths, interval, threshold and witness in memory only.
observe_loss() {
  [ "$NODE" = s2 ] && [ -n "$(peer_paths)" ] && internet_ok || { echo "need healthy S1 baseline from S2"; return 1; }
  local since=-1 sample w
  log "observer baseline healthy; awaiting physical loss"
  while :; do
    sample=$SECONDS
    if [ -n "$(peer_paths)" ] || ! internet_ok; then
      [ "$since" -lt 0 ] || log "observer continuity reset"
      since=-1
    else
      if [ "$since" -lt 0 ]; then since=$sample; log "observer first complete all-path loss"; fi
      if [ $((sample - since)) -ge "$FAILOVER_AFTER" ]; then
        w="$(witness)"
        log "observer witness=$w elapsed=$((SECONDS - since))s"
        if [ "$w" = down ] && [ -z "$(peer_paths)" ] && internet_ok; then
          log "observer final checks passed; decision only"; return 0
        fi
      fi
    fi
    sleep "$INTERVAL"
  done
}

pg_q() { docker exec "${2:-$LOCAL_PG}" psql -U postgres -Atc "$1" 2>/dev/null; }

replication_line() {
  pg_q "select 'in_recovery='||pg_is_in_recovery()||' receive='||coalesce(pg_last_wal_receive_lsn()::text,'-')||' replay='||coalesce(pg_last_wal_replay_lsn()::text,'-')||' last_xact_age='||coalesce(date_trunc('second',now()-pg_last_xact_replay_timestamp())::text,'-')||' receiver='||coalesce((select status from pg_stat_wal_receiver),'none')"
}

# promote_pg <container>: wait for replay to catch up with what was received,
# then pg_ctl promote and wait until writable. Used by promote AND the drill.
promote_pg() {
  local c="$1" i caught_up=false
  # The offline clone drill has no WAL receiver. A production standby must
  # know its receive position and finish replay before opening for writes.
  if [ "${2:-}" = offline-clone ]; then
    [ "$c" != "$LOCAL_PG" ] || return 1
  else
    for i in $(seq 1 30); do
      if [ "$(pg_q 'select pg_last_wal_replay_lsn() >= pg_last_wal_receive_lsn()' "$c")" = t ]; then
        caught_up=true; break
      fi
      sleep 1
    done
    [ "$caught_up" = true ] || { log "received WAL has not finished replaying; promotion refused"; return 1; }
  fi
  log "promoting $c ($(pg_q "select 'replay='||pg_last_wal_replay_lsn()" "$c"))"
  docker exec -u postgres "$c" pg_ctl promote -D "$PG_DATA" >/dev/null || return 1
  for i in $(seq 1 60); do
    [ "$(pg_q 'select pg_is_in_recovery()' "$c")" = "f" ] && { log "$c is now a WRITABLE primary"; return 0; }
    sleep 1
  done
  return 1
}

# Point the S2 app at this box's backends and recreate it.
switch_app_local() (
  set -euo pipefail
  cd "$APP_DIR" || return 1
  local url ts img ref
  local -a compose=(docker compose -p unbottled --env-file .env -f docker-compose.prod.yml -f docker-compose.standalone.yml -f docker-compose.s2-ha.yml)
  ref="$("${compose[@]}" config --images app)" && img="$(docker image inspect -f '{{.Id}}' "$ref")" || return 1
  [ "$img" = "$(docker inspect -f '{{.Image}}' unbottled-app)" ] || { echo "app image drift"; return 1; }
  umask 077
  ts="$(date -u +%Y%m%d%H%M%S)"
  url="$(cat .ha-database-url)"
  cp .ha-database-url ".ha-database-url.bak-$ts"; cp .env ".env.bak.failover-$ts"
  [ -f .ha-overrides ] && cp .ha-overrides ".ha-overrides.bak-$ts"
  # postgres://s2app:<pw>@10.88.0.1:5432/... -> @pg-replica:5432/...
  [[ "$url" == postgres*://*@*/* ]] || return 1
  printf '%s\n' "$url" | sed -E "s#@[^/]+/#@${HA_LOCAL_DB_HOST:-pg-replica}:5432/#" > .ha-database-url.new
  mv .ha-database-url.new .ha-database-url; chmod 600 .ha-database-url
  local muser mpass
  muser="$(grep -E '^MINIO_ROOT_USER=' .env | tail -1 | cut -d= -f2-)"
  mpass="$(grep -E '^MINIO_ROOT_PASSWORD=' .env | tail -1 | cut -d= -f2-)"
  [ -n "$muser" ] && [ -n "$mpass" ] || return 1
  umask 077
  cat > .ha-overrides <<EOF
HA_ROLE=primary
HA_REDIS_URL=${HA_LOCAL_REDIS_URL:-redis://unbottled-redis:6379}
HA_S3_ENDPOINT=${HA_LOCAL_S3_ENDPOINT:-http://unbottled-minio:9000}
HA_S3_ACCESS_KEY_ID=$muser
HA_S3_SECRET_ACCESS_KEY=$mpass
HA_TASK_RUNNER=true
HA_DB_SETUP=false
EOF
  # Re-merge .env in place (same file as base + overrides) so compose sees it.
  python3 ha/scripts/merge-env.py .env .env .env.next .ha-database-url .ha-overrides >/dev/null \
    && chmod 600 .env.next && mv .env.next .env || return 1
  "${compose[@]}" up -d --no-build --pull never --no-deps --force-recreate app
)

# Optional prewarmed web, armed by an operator after capacity and image checks.
# The canonical app still starts the single task runner once PG is writable.
use_ready_warm_app() {
  local warm=unbottled-ha-warm dir="${HA_CADDY_DRAIN_DIR:-/root/caddy_data/ha-drain}" cmd image
  [ -f "$dir/warm-on-promote" ] || return 1
  image="$(docker inspect -f '{{.Image}}' unbottled-app)" && [ -n "$image" ] &&
    [ "$(docker inspect -f '{{.Image}}' "$warm")" = "$image" ] || return 1
  cmd="$(docker inspect -f '{{json .Config.Cmd}}' "$warm")"
  [ "$cmd" = '["bun","src/vibe/platforms/cli/vibe-runtime.ts","start","--seed=false","--db-setup=false","--task-runner=false"]' ] || return 1
  timeout 2 docker exec "$warm" bun -e '
    const r=await fetch("http://127.0.0.1:3099/_ha/ready");
    if(r.status!==200 || r.headers.get("x-ha-db-path")!=="local") process.exit(1)
  ' >/dev/null 2>&1 || return 1
  touch "$dir/use-warm"
}

# Interim DNS failover while unbottled.ai is still delegated to hosttech
# (before the registrar points at ns1/ns2.unbottled.ai): repoint the apex and
# www A records at this box via the hosttech API. With the self-hosted NS the
# health daemon already did this and nothing is changed here.
dns_failover() {
  local ns
  ns="$(dig +short NS unbottled.ai @1.1.1.1 2>/dev/null | tr '\n' ' ')"
  case " $ns" in
  *" ns1.unbottled.ai. "*|*" ns2.unbottled.ai. "*)
    local i apex www
    for i in $(seq 1 15); do
      apex="$(dig +time=1 +tries=1 +short @"$SELF_PUBLIC" unbottled.ai A)"
      www="$(dig +time=1 +tries=1 +short @"$SELF_PUBLIC" www.unbottled.ai A)"
      if [ "$apex" = "$SELF_PUBLIC" ] && [ "$www" = "$SELF_PUBLIC" ]; then
        log "DNS: surviving authority serves only $SELF_PUBLIC for apex and www"; return 0
      fi
      sleep 1
    done
    echo "surviving authority has not converged on $SELF_PUBLIC"; return 1 ;;

  *".hosttech.eu. "*|*".hosttech.ch. "*) ;;
  *) echo "DNS delegation unknown; verify authority before changing records"; return 1 ;;
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
  if [ "$APP_HEAL" = 1 ]; then
    local deg
    echo "app db (real query): $(app_db_ok && echo ok || echo FAILING)"
    deg="$(wg_link_degraded)" && echo "wg link: DEGRADED ($deg)" || echo "wg link: ok"
  fi
  echo "app self-heal: $( [ "$APP_HEAL" = 1 ] && echo on || echo off) ($HEAL_APP via $HEAL_URL)$( [ -f "$STATE_DIR/app-heal-hold" ] && echo ", HOLD set")$( [ -f "$STATE_DIR/app-bad-since" ] && echo ", failing since $(date -u -d @"$(cat "$STATE_DIR/app-bad-since")" +%T) UTC"), heals last 6h: $(awk -v c=$(( $(date +%s) - 21600 )) '$1 >= c' "$STATE_DIR/app-heal-log" 2>/dev/null | wc -l)"
  return 0
}

cmd_promote() (
  local yes=0 auto=0 force=0 dry=0 planned=0 target="" t0
  for a in "$@"; do case "$a" in --yes) yes=1 ;; --auto) auto=1; yes=1 ;; --force) force=1 ;; --dry-run) dry=1 ;; --planned) planned=1 ;; --target-lsn=*) target="${a#*=}" ;; *) echo "unsupported promote option"; return 2 ;; esac; done
  [ "$NODE" = "s2" ] || { echo "promote runs on Server 2 only"; return 2; }
  if [ "$dry" = 1 ]; then
    local rc=0 paths
    paths="$(peer_paths)"
    echo "READ ONLY: role=$(role), auto=$AUTO, hold=$([ -f "$STATE_DIR/hold" ] && echo yes || echo no), peer paths=[$paths]"
    echo "replication: $(replication_line)"
    [ "$(pg_q 'select pg_is_in_recovery() and pg_last_wal_replay_lsn() = pg_last_wal_receive_lsn()')" = t ] || rc=1
    for f in .env .ha-database-url ha/scripts/merge-env.py scripts/deploy-ha-node.sh docker-compose.s2-ha.yml; do
      [ -s "$APP_DIR/$f" ] || { echo "missing $f"; rc=1; }
    done
    if ! (cd "$APP_DIR" && docker compose -p unbottled --env-file .env -f docker-compose.prod.yml -f docker-compose.standalone.yml -f docker-compose.s2-ha.yml config -q); then rc=1; fi
    if [ "$(docker exec unbottled-redis redis-cli ping 2>/dev/null)" != PONG ]; then echo "local Redis unavailable"; rc=1; fi
    if ! docker exec unbottled-minio sh -c 'export MC_HOST_local="http://$MINIO_ROOT_USER:$MINIO_ROOT_PASSWORD@127.0.0.1:9000"; mc stat local/chat-media >/dev/null 2>&1'; then echo "local chat-media bucket unavailable"; rc=1; fi
    if ! docker exec unbottled-app bun -e '
      const u=new URL(process.env.DATABASE_URL); u.hostname=process.argv[1]; u.port="5432";
      const c=new (require("pg").Client)({connectionString:u.href,connectionTimeoutMillis:1500,query_timeout:1500});
      try {await c.connect(); const r=await c.query("select pg_is_in_recovery() as standby"); if(!r.rows[0].standby) process.exitCode=1;}
      catch {process.exitCode=1;} finally {await c.end();}
    ' "${HA_LOCAL_DB_HOST:-pg-replica}" >/dev/null 2>&1; then echo "app login on local standby failed"; rc=1; fi
    if ! timeout 8 docker exec unbottled-app bun -e '
      const {S3Client,HeadBucketCommand}=require("@aws-sdk/client-s3");
      const s3=new S3Client({endpoint:process.argv[1],region:"us-east-1",forcePathStyle:true,
        credentials:{accessKeyId:process.env.MINIO_ROOT_USER,secretAccessKey:process.env.MINIO_ROOT_PASSWORD}});
      const redis=new Bun.RedisClient(process.argv[2]);
      try {await s3.send(new HeadBucketCommand({Bucket:"chat-media"})); if(await redis.send("PING",[])!=="PONG") process.exitCode=1;}
      catch {process.exitCode=1;} finally {s3.destroy();redis.close();}
    ' "${HA_LOCAL_S3_ENDPOINT:-http://unbottled-minio:9000}" "${HA_LOCAL_REDIS_URL:-redis://unbottled-redis:6379}" >/dev/null 2>&1; then
      echo "app access to promotion storage or Redis failed"; rc=1
    fi
    echo "Delegated nameservers: $(dig +time=2 +tries=1 +short NS unbottled.ai @1.1.1.1 | tr '\n' ' ')"
    local vote
    vote="$(witness)"; echo "External witness: $vote"
    if [ -n "$paths" ]; then [ "$vote" = up ] || rc=1; else [ "$vote" = down ] || rc=1; fi
    internet_ok || { echo "S2 internet quorum unavailable"; rc=1; }
    [ -z "$paths" ] || echo "live promotion would refuse while S1 answers"
    echo "Plan: fence S1, replay received WAL, promote PG, switch app to local PG/Redis/MinIO, start one task runner on the replicated schema, verify app and DNS."
    echo "No fence, promotion, config write, service restart, mail or DNS update performed."
    return "$rc"
  fi
  exec 9>"$STATE_DIR/promotion.lock" && flock -n 9 || { echo "promotion already in progress"; return 3; }
  [ "$(role)" = standby ] || { echo "standby role required; verify database and app independently"; return 3; }
  [ "$(pg_q 'select pg_is_in_recovery()')" = t ] || { echo "local database is not in recovery"; return 3; }
  local fence paths
  if [ "$planned" = 1 ]; then
    [ "$auto$force$yes" = 001 ] && [ -s "$STATE_DIR/hold" ] && [[ "$target" =~ ^[A-F0-9]{1,8}/[A-F0-9]{1,8}$ ]] || {
      echo "planned promotion requires a hold, --yes and a final --target-lsn"; return 3; }
    fence="$(peer_ssh fence-proof)" || { echo "S1 durable fence or clean shutdown unverified"; return 3; }
    local proof='^s1-fenced ([0-9]+) ([0-9]+) ([0-9A-F]{1,8}/[0-9A-F]{1,8})$'
    [[ "$fence" =~ $proof ]] || { echo "invalid S1 fence proof"; return 3; }
    local sysid="${BASH_REMATCH[1]}" timeline="${BASH_REMATCH[2]}" checkpoint="${BASH_REMATCH[3]}"
    [ "$(pg_q "select pg_is_in_recovery() and (pg_control_system()).system_identifier::text = '$sysid' and (pg_control_checkpoint()).timeline_id = $timeline and pg_last_wal_replay_lsn() >= '$target'::pg_lsn and pg_last_wal_replay_lsn() > '$checkpoint'::pg_lsn")" = t ] || {
      echo "S2 has not proved replay through both final positions on S1's timeline"; return 3; }
  else
    [ -z "$target" ] || { echo "--target-lsn requires --planned"; return 2; }
    paths="$(peer_paths)"
    if [ -n "$paths" ] && [ "$force" != 1 ]; then
      echo "REFUSED: Server 1 still answers on [$paths]. A planned switch requires a verified fence."
      return 3
    fi
  fi
  if [ "$yes" != 1 ]; then
    echo "!! Promote Server 2 to PRIMARY. Server 1 must be DOWN. Replication: $(replication_line)"
    read -r -p "type PROMOTE to continue: " ok; [ "$ok" = "PROMOTE" ] || { echo aborted; return 1; }
  fi
  t0=$(date +%s)
  if [ "$auto" = 1 ]; then
    internet_ok && [ ! -f "$STATE_DIR/hold" ] || { echo "automatic promotion blocked"; return 3; }
  fi
  if [ "$planned" = 0 ]; then
    if ! fence="$(peer_ssh fence)"; then
      fence="fence unconfirmed"
      if [ -n "$(peer_paths)" ]; then echo "S1 reachable without a confirmed fence"; return 3; fi
    fi
  fi
  [ "$auto" = 0 ] || [ ! -f "$STATE_DIR/hold" ] || return 3
  set_role promoting || return 1
  if ! promote_pg "$LOCAL_PG"; then
    case "$(pg_q 'select pg_is_in_recovery()')" in
      t) set_role standby ;;
      f) set_role primary ;;
      *) log "cannot verify PG role; retain promoting state and keep S1 fenced" ;;
    esac
    alert "FAILOVER INCOMPLETE: verify PG role" "Replication: $(replication_line). Verify both roles before allowing writes."
    return 1
  fi
  set_role primary || { log "writable database but role persistence failed; keep S1 fenced"; return 1; }
  date -u +%s > "$STATE_DIR/promoted-at"
  local warm_active=0 dir="${HA_CADDY_DRAIN_DIR:-/root/caddy_data/ha-drain}"
  if [ -f "$dir/warm-on-promote" ]; then
    for delay in 1 2 3; do
      if use_ready_warm_app; then warm_active=1; log "prewarmed S2 web selected"; break; fi
      sleep 0.25
    done
  fi
  switch_app_local >/dev/null 2>&1; local app_rc=$?
  # App/deploy logs can contain credentials; keep only the return code in mail.
  local app_ready=0 i
  if [ "$app_rc" -eq 0 ]; then
    for i in $(seq 1 90); do
      if app_probe; then app_ready=1; break; fi
      sleep 1
    done
  fi
  if [ "$app_ready" -ne 1 ]; then
    alert "FAILOVER INCOMPLETE: S2 database is PRIMARY" "Application recreation or the DB-backed HTTP check failed (recreate rc=$app_rc). Keep S1 fenced; recover the app on S2."
    return 1
  fi
  # On the supervised path the operator verifies the canonical instance and
  # releases the HTTP pause independently. It may already serve warm traffic.
  if [ "$planned" = 0 ] && [ "$warm_active" = 1 ]; then
    mv "$dir/use-warm" "$STATE_DIR/last-warm-cut" || return 1
  fi
  local dns
  if ! dns="$(dns_failover 2>&1)"; then
    alert "FAILOVER INCOMPLETE: check authoritative DNS" "S2 database and app are primary. Keep S1 fenced and verify both nameservers."
    return 1
  fi
  alert "FAILOVER DONE: Server 2 is primary ($( [ $auto = 1 ] && echo automatic || echo manual))" \
"Server 2 promoted itself to primary in $(( $(date +%s) - t0 ))s.
Trigger: $( [ $auto = 1 ] && echo "automatic (S1 unreachable on all paths + external witness agreed)" || echo "manual ha-failover promote")
Fence S1: $fence
Postgres: $(replication_line)
App recreate rc=$app_rc; DB-backed HTTP probe passed.
DNS: $dns

S1 will fence itself (app + Postgres stopped, restart=no) as soon as it is back
and sees S2 primary. Rejoin is manual: ha/README.md 'Rejoin after failover'."
  return 0
)

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
    if [ -f "$STATE_DIR/peer-down-since" ]; then mv -f "$STATE_DIR/peer-down-since" "$STATE_DIR/last-isolated-sample"; fi
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

s2_role_ssh_alert_context() {
  {
    if ping -n -c1 -W2 "$PEER_WG" >/dev/null 2>&1; then
      echo "WG ICMP: replied"
    else
      echo "WG ICMP: no reply within 2s"
    fi
  } &
  {
    local code
    if code="$(curl -s --noproxy '*' --max-time 3 --resolve "unbottled.ai:443:$PEER_PUBLIC" \
      -o /dev/null -w '%{http_code}' https://unbottled.ai/robots.txt 2>/dev/null)"; then
      echo "S2 public HTTPS edge: HTTP $code"
    else
      echo "S2 public HTTPS edge: request failed within 3s"
    fi
  } &
  {
    local replication
    replication="$(timeout -k 1 3 docker exec "$LOCAL_PG" psql -U postgres -XAtqc "
      select coalesce((select 'slot_active=' || s.active
        || ' sender=' || coalesce(r.state, 'none')
        || ' replay_behind_bytes=' || coalesce(pg_wal_lsn_diff(pg_current_wal_lsn(), r.replay_lsn)::text, 'unknown')
        from pg_replication_slots s left join pg_stat_replication r on r.pid = s.active_pid
        where s.slot_name = 's2_replica'), 'slot missing')
    " 2>/dev/null)" || replication="query unavailable"
    echo "S1 PostgreSQL replication (S2 slot): ${replication:-query unavailable}"
  } &
  wait
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
    local now down; now=$(date +%s)
    [ -f "$STATE_DIR/peer-down-since" ] || echo "$now" > "$STATE_DIR/peer-down-since"
    down=$((now - $(cat "$STATE_DIR/peer-down-since")))
    if [ "$down" -ge "${HA_PEER_ALERT_AFTER:-300}" ] && ! was_alerted s2-down; then
      alert_once s2-down "Server 1: S2 role SSH probe failed" "S1 received no role response from S2 over WireGuard SSH for ${down}s.
Independent observations from S1 at $(date -u +%FT%TZ):
$(s2_role_ssh_alert_context)"
    fi
    ;;
  *)
    if [ -f "$STATE_DIR/peer-down-since" ]; then
      rm -f "$STATE_DIR/peer-down-since"
      was_alerted s2-down && alert "Server 1: S2 role SSH probe recovered" "S2 reports: $st"
      clear_once s2-down
    fi
    ;;
  esac
}

# WireGuard path failover: plain WG between the public IPv6 and IPv4
# addresses (HA_WG_ENDPOINTS, preferred first). When the handshake is older
# than HA_WG_STALE_AFTER (default 300 s; a live link re-handshakes every 2-3 min,
# observed up to ~200 s under one-way bulk traffic, so 180 s false-triggered),
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
  if [ "$age" -lt "${HA_WG_STALE_AFTER:-300}" ]; then
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

# ---------------------------------------------------------------------------
# App self-heal (added 2026-11-17). After the 06:10-07:30 WireGuard outage the
# S2 app stayed broken for 30 min after the link was back (its Next.js server
# crash-looped inside the container; proxy ECONNREFUSED, DB-backed probe
# timing out) until a manual `docker restart unbottled-app`. The edge DNS
# probe could not see it: it goes through this box's Caddy, which falls back
# to S1's app. This check probes the app DIRECTLY (same DB-backed credits
# probe as `ha-node-drain.sh local-probe`) and restarts ONLY this node's
# unbottled app container when:
#   - the probe has failed continuously for HA_APP_HEAL_AFTER s (default 300),
#   - while the app's database answers a real query (as the app's user, over
#     the same path the app uses, ~16 KB result, short timeout) and the WG
#     link is not degraded (handshake age, full-size ping loss), so a restart
#     can actually help (a dead or lossy link is left alone; 2026-11-18),
#   - the container is running and older than HA_APP_HEAL_GRACE s (240),
#   - no deploy is in progress (app drain request / Caddy drain file) and no
#     $STATE_DIR/app-heal-hold file exists,
#   - rate limit: >= HA_APP_HEAL_GAP s (900) since the last heal and at most
#     HA_APP_HEAL_MAX (3) heals per 6 h; beyond that it only alerts.
# The container name is fixed per node and never configurable: S2 co-hosts
# heilpraktiker, whose app is ALSO called next-vibe-app there.
# Default on for s2, off for s1 (HA_APP_HEAL=1 enables it there).
# ---------------------------------------------------------------------------
APP_HEAL="${HA_APP_HEAL:-$([ "$NODE" = s2 ] && echo 1 || echo 0)}"
case "$NODE" in
s1) HEAL_APP=next-vibe-app; HEAL_URL="${HA_APP_LOCAL_URL:-http://127.0.0.1:3000}"; HEAL_DRAIN_DIR="${HA_CADDY_DRAIN_DIR:-/caddy/data/ha-drain}" ;;
*) HEAL_APP=unbottled-app; HEAL_URL="${HA_APP_LOCAL_URL:-http://10.88.0.2:3100}"; HEAL_DRAIN_DIR="${HA_CADDY_DRAIN_DIR:-/root/caddy_data/ha-drain}" ;;
esac
HEAL_COOKIE_FILE="${HA_PROBE_COOKIE_FILE:-/root/ha-edge/edge-dns/probe-cookie}"
HEAL_PROBE_PATH="${HA_PROBE_PATH:-/api/en-US/credits}"

app_probe() {
  local cookie body
  cookie="$(head -1 "$HEAL_COOKIE_FILE" 2>/dev/null || true)"
  body="$(curl -s --max-time 6 -A unbottled-ha-probe/1 ${cookie:+-H "Cookie: $cookie"} \
    "${HEAL_URL}${HEAL_PROBE_PATH}" 2>/dev/null)"
  printf '%s' "$body" | grep -qF '"success":true'
}

# Does the database the app is configured for answer a REAL query?
# S2 standby: S1's Postgres via 10.88.0.1:5432 (HAProxy over WG). 2026-11-18:
# pg_isready passed over a lossy WG link (its tiny packets got through) while
# the app's bigger query packets were lost, so the watchdog restarted the app
# mid-outage and S1 kept the old pool's sessions. Now: log in exactly like the
# app (its DATABASE_URL from $APP_DB_URL_FILE, user s2app, same HAProxy
# forward) from the replica container, which shares the app's network path,
# and pull a ~16 KB row (several full-MTU packets) under a short timeout.
# The URL is passed on stdin, never on a command line. S2 primary / S1: local.
APP_DB_URL_FILE="${HA_APP_DB_URL_FILE:-$APP_DIR/.ha-database-url}"
APP_DB_PROBE_BYTES="${HA_APP_DB_PROBE_BYTES:-16000}"
app_db_query_ok() {
  local url n deadline="${HA_APP_DB_PROBE_TIMEOUT:-10}"
  url="$(head -1 "$APP_DB_URL_FILE" 2>/dev/null)"; url="${url%%\?*}"
  [ -n "$url" ] || return 1
  # Bound psql inside the container as well: timing out the Docker CLI alone
  # does not terminate a client blocked reading from the WireGuard socket.
  n="$(printf '%s' "$url" | timeout -k 2 "$deadline" docker exec -i -e PGCONNECT_TIMEOUT=4 \
    -e PGOPTIONS="-c statement_timeout=4000" "$LOCAL_PG" sh -c \
    'timeout -k 2 "$1" psql "$(cat)" -XAtq -v ON_ERROR_STOP=1 -c "select repeat(chr(120), $2)" | wc -c' \
    sh "$deadline" "$APP_DB_PROBE_BYTES" 2>/dev/null)"
  [ "${n:-0}" -eq $((APP_DB_PROBE_BYTES + 1)) ] 2>/dev/null
}

# Sample the standby's actual DB path even while the fixed-lead HTTP probe
# passes. A large row uses several WireGuard packets. Record transitions for
# comparison with app read timeouts without feeding the result into failover.
sample_app_db_path() {
  local start elapsed result previous
  start=$(date +%s%3N)
  if app_db_query_ok; then result=ok; else result=failed; fi
  elapsed=$(( $(date +%s%3N) - start ))
  previous=$(cat "$STATE_DIR/app-db-sample.state" 2>/dev/null || true)
  [ "$previous" != "$result" ] || return 0
  printf '%s\n' "$result" > "$STATE_DIR/app-db-sample.state.tmp" &&
    mv "$STATE_DIR/app-db-sample.state.tmp" "$STATE_DIR/app-db-sample.state"
  if [ "$result" = failed ] || [ "$previous" = failed ]; then
    log "standby app DB path sample: result=$result elapsed_ms=$elapsed bytes=$APP_DB_PROBE_BYTES"
  fi
}

app_db_ok() {
  if [ "$NODE" = "s2" ] && [ "$(role)" != "primary" ]; then
    if [ -n "$LOCAL_PG" ] && [ -f "$APP_DB_URL_FILE" ]; then
      app_db_query_ok
    elif [ -n "$LOCAL_PG" ]; then
      log "no $APP_DB_URL_FILE: falling back to pg_isready for the app DB check"
      docker exec "$LOCAL_PG" pg_isready -q -t 3 -h "$PEER_WG" -p "${HA_PEER_PG_PORT:-5432}" >/dev/null 2>&1
    else
      tcp "$PEER_WG" "${HA_PEER_PG_PORT:-5432}"
    fi
    return
  fi
  [ -n "$LOCAL_PG" ] || return 0
  docker exec "$LOCAL_PG" psql -U postgres -XAtqc 'select 1' >/dev/null 2>&1
}

# Is the WG link degraded? Prints the reason and returns 0 when it is.
# Only meaningful where the app's DB runs over WG (S2 standby). Signals:
# handshake older than HA_WG_HEAL_MAX_HS_AGE s (240; a live link re-handshakes
# every ~2 min), or >= HA_WG_HEAL_MAX_LOSS_PCT % (10) loss on 10 full-size
# pings (lossy links drop big packets first, see 2026-11-18).
wg_link_degraded() {
  [ "$NODE" = "s2" ] && [ "$(role)" != "primary" ] || return 1
  local hs age loss
  if command -v wg >/dev/null 2>&1 && [ -n "$(wg show wg0 peers 2>/dev/null)" ]; then
    hs="$(wg show wg0 latest-handshakes 2>/dev/null | awk '{print $2}' | head -1)"
    age=$(( $(date +%s) - ${hs:-0} ))
    if [ "$age" -ge "${HA_WG_HEAL_MAX_HS_AGE:-240}" ]; then echo "handshake ${age}s old"; return 0; fi
  fi
  loss="$(ping -q -n -c 10 -i 0.2 -W 1 -s "${HA_WG_HEAL_PING_SIZE:-1300}" "$PEER_WG" 2>/dev/null \
    | sed -n 's/.* \([0-9.]*\)% packet loss.*/\1/p')"
  loss="${loss%%.*}"
  if [ "${loss:-100}" -ge "${HA_WG_HEAL_MAX_LOSS_PCT:-10}" ]; then echo "${loss:-100}% loss on full-size pings to $PEER_WG"; return 0; fi
  return 1
}

app_deploy_in_progress() {
  [ -e "$HEAL_DRAIN_DIR/$NODE" ] && return 0
  docker exec "$HEAL_APP" test -e /app/.tmp/drain/request >/dev/null 2>&1
}

app_heal_check() {
  [ "$APP_HEAL" = 1 ] || return 0
  local r now since started started_s up_s recent last
  r="$(role)"
  case "$r" in promoting|fenced) return 0 ;; esac
  now=$(date +%s)
  if app_probe; then
    if [ -f "$STATE_DIR/app-bad-since" ]; then
      since=$(cat "$STATE_DIR/app-bad-since"); rm -f "$STATE_DIR/app-bad-since"
      log "app probe ok again after $((now - since))s"
    fi
    was_alerted app-healed && alert "$NODE app healthy again after self-heal" "$HEAL_APP answers the DB-backed probe ($HEAL_URL$HEAL_PROBE_PATH) again."
    clear_once app-healed; clear_once app-heal-blocked
    return 0
  fi
  [ "$(docker inspect -f '{{.State.Running}}' "$HEAL_APP" 2>/dev/null)" = "true" ] || { rm -f "$STATE_DIR/app-bad-since"; return 0; }
  started="$(docker inspect -f '{{.State.StartedAt}}' "$HEAL_APP" 2>/dev/null)"
  started_s="$(date -d "$started" +%s 2>/dev/null || echo "$now")"
  up_s=$((now - started_s))
  if [ "$up_s" -lt "${HA_APP_HEAL_GRACE:-240}" ]; then rm -f "$STATE_DIR/app-bad-since"; return 0; fi
  if app_deploy_in_progress; then rm -f "$STATE_DIR/app-bad-since"; return 0; fi
  local degraded
  if degraded="$(wg_link_degraded)"; then
    # Lossy/dead link: a restart cannot help and leaks the old pool's
    # sessions on S1; the clock restarts once the link is clean again.
    log "app probe failing but the WG link is degraded ($degraded): not counting towards self-heal"
    rm -f "$STATE_DIR/app-bad-since"
    return 0
  fi
  if ! app_db_ok; then
    # Link/DB problem: restarting the app cannot help; the clock restarts
    # once the database answers again.
    log "app probe failing but its database does not answer a real query: not counting towards self-heal"
    rm -f "$STATE_DIR/app-bad-since"
    return 0
  fi
  [ -f "$STATE_DIR/app-bad-since" ] || { echo "$now" > "$STATE_DIR/app-bad-since"; log "app probe failing while its database answers"; }
  since=$(cat "$STATE_DIR/app-bad-since")
  [ $((now - since)) -ge "${HA_APP_HEAL_AFTER:-300}" ] || return 0
  [ -f "$STATE_DIR/app-heal-hold" ] && { log "app unhealthy $((now - since))s but app-heal-hold is set"; return 0; }

  # Rate limit (heal timestamps of the last 6 h).
  touch "$STATE_DIR/app-heal-log"
  awk -v c=$((now - 21600)) '$1 >= c' "$STATE_DIR/app-heal-log" > "$STATE_DIR/app-heal-log.tmp" && mv "$STATE_DIR/app-heal-log.tmp" "$STATE_DIR/app-heal-log"
  recent=$(wc -l < "$STATE_DIR/app-heal-log")
  last=$(tail -1 "$STATE_DIR/app-heal-log" 2>/dev/null || echo 0); last=${last:-0}
  if [ "$recent" -ge "${HA_APP_HEAL_MAX:-3}" ]; then
    alert_once app-heal-blocked "$NODE app unhealthy, self-heal EXHAUSTED" "$HEAL_APP has failed the DB-backed probe for $((now - since))s while its database answers. Already restarted $recent time(s) in 6 h, so the watchdog stops restarting it.
Look at: docker logs --tail 200 $HEAL_APP (on $NODE). Restart by hand: docker restart $HEAL_APP"
    return 0
  fi
  [ $((now - last)) -ge "${HA_APP_HEAL_GAP:-900}" ] || return 0

  # Hard guard: only ever this node's unbottled app (never heilpraktiker).
  case "$NODE:$HEAL_APP" in s2:unbottled-app|s1:next-vibe-app) ;; *) log "refusing to heal unexpected container $HEAL_APP"; return 0 ;; esac
  echo "$now" >> "$STATE_DIR/app-heal-log"
  rm -f "$STATE_DIR/app-bad-since"
  log "SELF-HEAL: $HEAL_APP failed the DB-backed probe for $((now - since))s while its database answers: docker restart $HEAL_APP"
  # Background: the restart waits up to the stop timeout for the app's drain,
  # the watchdog loop (failover, fencing) must keep running meanwhile.
  nohup docker restart -t "${HA_APP_HEAL_STOP_TIMEOUT:-120}" "$HEAL_APP" >> "$STATE_DIR/app-heal.out" 2>&1 &
  : > "$STATE_DIR/alerted.app-healed"
  alert "$NODE app self-heal: restarted $HEAL_APP" "$HEAL_APP failed the DB-backed probe ($HEAL_URL$HEAL_PROBE_PATH) for $((now - since))s while its database answered (role=$r, container up ${up_s}s). The watchdog ran: docker restart $HEAL_APP.
Heals in the last 6 h: $((recent + 1)) of ${HA_APP_HEAL_MAX:-3}. A follow-up mail says when the probe passes again.
Disable: touch $STATE_DIR/app-heal-hold (rm to re-enable)."
}

# ---------------------------------------------------------------------------
# Postgres connection-slot alert (added 2026-11-18). S2's app leaked 92 of
# S1's 100 connections (idle sessions held open by the WG forwarder after the
# link went lossy), S1's own app then got "remaining connection slots are
# reserved". Runs on whichever box holds the WRITABLE primary (S1 normally,
# S2 after a failover) every HA_PG_CONN_CHECK_EVERY s (60): alerts once when
# the total or any single role reaches HA_PG_CONN_ALERT_PCT % (70) of
# max_connections, clears below HA_PG_CONN_CLEAR_PCT % (50).
# ---------------------------------------------------------------------------
pg_conn_check() {
  [ -n "$LOCAL_PG" ] || return 0
  case "$(role)" in fenced|promoting) return 0 ;; esac
  local now last max rows total worst worst_role pct alert_pct clear_pct
  now=$(date +%s)
  last=$(cat "$STATE_DIR/pg-conn-checked-at" 2>/dev/null || echo 0)
  [ $((now - last)) -ge "${HA_PG_CONN_CHECK_EVERY:-60}" ] || return 0
  echo "$now" > "$STATE_DIR/pg-conn-checked-at"
  [ "$(pg_q 'select pg_is_in_recovery()')" = "f" ] || return 0
  max="$(pg_q 'show max_connections')"
  case "$max" in ''|*[!0-9]*) return 0 ;; esac
  # role|count per role (client backends only; walsenders have own slots).
  rows="$(pg_q "select coalesce(usename,'?')||'|'||count(*) from pg_stat_activity where backend_type='client backend' group by usename order by count(*) desc")"
  [ -n "$rows" ] || return 0
  total=$(printf '%s\n' "$rows" | awk -F'|' '{s+=$2} END {print s+0}')
  worst=$(printf '%s\n' "$rows" | head -1 | cut -d'|' -f2)
  worst_role=$(printf '%s\n' "$rows" | head -1 | cut -d'|' -f1)
  alert_pct="${HA_PG_CONN_ALERT_PCT:-70}"; clear_pct="${HA_PG_CONN_CLEAR_PCT:-50}"
  pct=$((total * 100 / max))
  if [ "$pct" -ge "$alert_pct" ] || [ $((worst * 100 / max)) -ge "$alert_pct" ]; then
    alert_once pg-conn "Postgres connections at ${pct}% (${total}/${max}, top role ${worst_role}=${worst})" "Postgres on $NODE ($LOCAL_PG) uses ${total} of max_connections=${max} client slots (alert at ${alert_pct}%). Per role:
$(printf '%s\n' "$rows" | sed 's/^/  /')

By role/state/client (oldest backend):
$(pg_q "select '  '||coalesce(usename,'?')||' '||coalesce(state,'-')||' '||coalesce(host(client_addr),'local')||': '||count(*)||' (oldest '||date_trunc('second',now()-min(backend_start))||')' from pg_stat_activity where backend_type='client backend' group by usename,state,client_addr order by count(*) desc limit 15")

Runbook (ha/README.md 'Postgres connection leak'): s2app sessions come
through pg-wg-forward (S2 app). Free slots: docker exec $LOCAL_PG psql -U postgres -c \"select pg_terminate_backend(pid) from pg_stat_activity where usename='s2app' and state='idle' and state_change < now()-interval '2 min'\""
  elif [ "$pct" -lt "$clear_pct" ] && [ $((worst * 100 / max)) -lt "$clear_pct" ]; then
    was_alerted pg-conn && alert "Postgres connections back to normal (${total}/${max})" "Per role:
$(printf '%s\n' "$rows" | sed 's/^/  /')"
    clear_once pg-conn
  fi
  return 0
}

cmd_watch() {
  local sample_after=0 sample_pid=""
  log "watchdog start: role=$(role) auto=$AUTO interval=${INTERVAL}s failover_after=${FAILOVER_AFTER}s app_heal=$APP_HEAL"
  while :; do
    if [ "$NODE" = s2 ] && [ "$SECONDS" -ge "$sample_after" ]; then
      sample_after=$((SECONDS + 60))
      if [ "$(role)" = standby ] && [ -n "$LOCAL_PG" ] && [ -s "$APP_DB_URL_FILE" ] &&
        { [ -z "$sample_pid" ] || ! kill -0 "$sample_pid" 2>/dev/null; }; then
        # A slow read must never delay fencing, witness checks, or app recovery.
        sample_app_db_path &
        sample_pid=$!
      fi
    fi
    wg_path_check
    if [ "$NODE" = "s2" ]; then watch_s2; else watch_s1; fi
    pg_conn_check
    app_heal_check
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
  promote_pg "$DRILL_PG" offline-clone || { echo "drill promote FAILED"; return 1; }
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
hold)
  shift
  exec 9>"$STATE_DIR/promotion.lock" && flock -n 9 || { echo "promotion in progress; check PG role now"; exit 3; }
  echo "${*:-manual hold} (set $(date -u +%FT%TZ))" > "$STATE_DIR/hold.new" && mv "$STATE_DIR/hold.new" "$STATE_DIR/hold" || exit 1
  echo "auto failover on hold" ;;
unhold) if [ -f "$STATE_DIR/hold" ]; then mv "$STATE_DIR/hold" "$STATE_DIR/last-hold" || exit 1; fi; echo "hold cleared" ;;
witness) shift; witness "$@" ;;
observe-loss) observe_loss ;;
q104-promote-fixture)
  [ "$NODE" = s2 ] && [ "$LOCAL_PG" != q104-pg-standby ] &&
    [ "$(docker inspect -f '{{index .Config.Labels "ai.unbottled.q104"}} {{.HostConfig.NetworkMode}}' q104-pg-standby)" = 'fixture q104-isolated' ] &&
    [ "$(docker inspect -f '{{index .Config.Labels "ai.unbottled.q104"}} {{.State.Status}}' q104-pg-writer)" = 'fixture exited' ] &&
    PG_DATA=/var/lib/postgresql/data/q104 promote_pg q104-pg-standby ;;
watch) cmd_watch ;;
dns-failover) dns_failover ;;
drill-promote) cmd_drill_promote ;;
drill-cleanup) drill_cleanup ;;
drill-partition) shift; cmd_drill_partition "$@" ;;
drill-partition-undo) cmd_drill_partition_undo ;;
pg-conn-check) HA_PG_CONN_CHECK_EVERY=0 pg_conn_check ;;
test-alert) alert "test alert from $NODE" "If you read this, HA alert mail works. $(cmd_status 2>&1)" ;;
*) sed -n '2,20p' "$0"; exit 2 ;;
esac
