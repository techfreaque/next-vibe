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
  echo fenced > "$STATE_DIR/role"
  date -u +%s > "$STATE_DIR/fenced-at"
  for c in ${HA_FENCE_CONTAINERS:-}; do
    docker inspect "$c" >/dev/null 2>&1 || continue
    docker update --restart=no "$c" >/dev/null 2>&1 || true
    if [ "$(docker inspect -f '{{.State.Running}}' "$c" 2>/dev/null)" = "true" ]; then
      docker stop -t "${HA_FENCE_STOP_TIMEOUT:-30}" "$c" >/dev/null 2>&1 || true
    fi
  done
  logger -t ha-peer-cmd "FENCED: stopped ${HA_FENCE_CONTAINERS:-<none>}"
}

case "${SSH_ORIGINAL_COMMAND:-${1:-}}" in
state)
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
fence)
  if [ "${HA_ALLOW_REMOTE_FENCE:-0}" != "1" ]; then
    echo "refused: remote fence not allowed on $NODE"; exit 3
  fi
  fence_self
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
fence-local)
  # Same as fence, for the local watchdog / an operator on this box.
  [ -z "${SSH_ORIGINAL_COMMAND:-}" ] || { echo refused; exit 3; }
  fence_self
  echo "node=$NODE role=$(role) pg=$(pg_state) ts=$(date -u +%s)"
  ;;
*)
  echo "refused"; exit 2
  ;;
esac
