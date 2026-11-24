#!/bin/bash
# ============================================================================
# ha-peer-cmd: the ONLY thing the peer box may run over SSH on this box.
#
# Installed as /usr/local/sbin/ha-peer-cmd and bound to the peer's key in
# /root/.ssh/authorized_keys:
#   restrict,from="<peer WG IP>",command="/usr/local/sbin/ha-peer-cmd" ssh-ed25519 AAAA... ha-peer
# sshd puts the requested verb in SSH_ORIGINAL_COMMAND; anything else is
# refused. Plain sshd over WireGuard: no listener, no tunnel binary.
#
# Verbs:
#   state   print "node=<n> role=<role> pg=<primary|standby|down> ts=<epoch>"
#   fence   (only where HA_ALLOW_REMOTE_FENCE=1, i.e. Server 1) stop this box's
#           unbottled app + primary Postgres and mark the box fenced, so a
#           returning old primary can never take writes after Server 2 was
#           promoted. Idempotent. Undone only by the rejoin runbook
#           (ha/README.md "Rejoin"), never remotely.
# ============================================================================
set -u
[ -f /etc/ha-failover/ha.env ] && . /etc/ha-failover/ha.env
STATE_DIR="${HA_STATE_DIR:-/var/lib/ha-failover}"
NODE="${HA_NODE:-unknown}"
mkdir -p "$STATE_DIR"

role() { cat "$STATE_DIR/role" 2>/dev/null || echo "${HA_DEFAULT_ROLE:-unknown}"; }

pg_state() {
  local c="${HA_LOCAL_PG:-}"
  [ -n "$c" ] || { echo none; return; }
  local r
  r="$(timeout 5 docker exec "$c" psql -U postgres -Atc 'select pg_is_in_recovery()' 2>/dev/null)" || { echo down; return; }
  case "$r" in t) echo standby ;; f) echo primary ;; *) echo down ;; esac
}

fence_self() {
  # Mark first: even if a docker call below fails, the watchdog keeps enforcing.
  echo fenced > "$STATE_DIR/role.fence.$$" && mv "$STATE_DIR/role.fence.$$" "$STATE_DIR/role" || return 1
  date -u +%s > "$STATE_DIR/fenced-at" || return 1
  local c
  for c in ${HA_FENCE_CONTAINERS:?}; do
    docker update --restart=no "$c" >/dev/null || return 1
    docker stop -t "${HA_FENCE_STOP_TIMEOUT:-30}" "$c" >/dev/null || return 1
  done
  stopped_and_disabled || return 1
  logger -t ha-peer-cmd "FENCED: stopped ${HA_FENCE_CONTAINERS}"
}

stopped_and_disabled() {
  local c
  [[ " ${HA_FENCE_CONTAINERS:-} " == *" ${HA_LOCAL_PG:?} "* ]] || return 1
  [[ " ${HA_FENCE_CONTAINERS:-} " == *" next-vibe-app "* ]] || return 1
  for c in $HA_FENCE_CONTAINERS; do
    [ "$(docker inspect -f '{{.State.Status}} {{.HostConfig.RestartPolicy.Name}}' "$c")" = 'exited no' ] || return 1
  done
}

# Proof is generated afresh from the stopped writer's control file. The helper
# has a read-only data mount, no network and never starts PostgreSQL.
fence_proof() {
  [ "$NODE" = s1 ] && [ "$(role)" = fenced ] && stopped_and_disabled || return 1
  local c="$HA_LOCAL_PG" control image
  image="$(docker inspect -f '{{.Image}}' "$c")" || return 1
  control="$(docker run --rm --pull=never --network none --read-only --cap-drop ALL --user postgres \
    --volumes-from "$c:ro" -e LC_ALL=C --entrypoint pg_controldata "$image" "${HA_PG_DATA:-/var/lib/postgresql/data}")" || return 1
  awk -F ':[[:space:]]+' '
    /^Database system identifier:/ { id=$2 }
    /^Database cluster state:/ { state=$2 }
    /^Latest checkpoint location:/ { lsn=$2 }
    /^Latest checkpoint.s TimeLineID:/ { timeline=$2 }
    END {
      if (state != "shut down" || id !~ /^[0-9]+$/ || timeline !~ /^[0-9]+$/ || lsn !~ /^[0-9A-F]+\/[0-9A-F]+$/) exit 1
      print "s1-fenced", id, timeline, lsn
    }' <<< "$control"
}

case "${SSH_ORIGINAL_COMMAND:-${1:-}}" in
state)
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
fence)
  if [ "${HA_ALLOW_REMOTE_FENCE:-0}" != "1" ]; then
    echo "refused: remote fence not allowed on $NODE"; exit 3
  fi
  fence_self || { echo "fence incomplete"; exit 1; }
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
fence-proof) fence_proof ;;
fence-local)
  # Same as fence, for the local watchdog / an operator on this box.
  [ -z "${SSH_ORIGINAL_COMMAND:-}" ] || { echo refused; exit 3; }
  fence_self || { echo "fence incomplete"; exit 1; }
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
*)
  echo "refused"; exit 2
  ;;
esac
