#!/bin/bash
# Run on S2 as root, after installing this script at the stable path below.
# Drop only the readiness process's real PG traffic in unbottled-app's network
# namespace. Accepted user writes, replication, Redis and MinIO stay connected.
set -euo pipefail
app=unbottled-app
unit=ha-db-path-drill
program=/usr/local/lib/unbottled-ha/drill-db-path.sh
state=/run/unbottled-ha-db-path-drill
marker=/root/caddy_data/ha-drain/probe.s2
rule=(-p tcp -d 10.88.0.1 --dport 5432 -m owner --uid-owner 64193 -m comment --comment unbottled-ha-readiness-drill -j DROP)
[[ "$(id -u)" = 0 ]] && grep -qx HA_NODE=s2 /etc/ha-failover/ha.env || exit 2
case "${1:-}" in
undo)
  [[ -f "$state/container" ]] || exit 0
  read -r old_id old_ns < "$state/container"
  id="$(docker inspect -f '{{.Id}}' "$app" 2>/dev/null || true)"
  if [[ "$id" = "$old_id" ]]; then
    pid="$(docker inspect -f '{{.State.Pid}}' "$app")"
    if [[ "$(readlink "/proc/$pid/ns/net")" = "$old_ns" ]] && nsenter -t "$pid" -n iptables -w 3 -C OUTPUT "${rule[@]}" 2>/dev/null; then
      nsenter -t "$pid" -n iptables -w 3 -D OUTPUT "${rule[@]}"
    fi
  fi
  dest="/root/.tmp/todelete/ha-db-path-$(date -u +%Y%m%dT%H%M%S%N)"
  mkdir -p "$dest"
  [[ ! -f "$marker" ]] || mv "$marker" "$dest/"
  mv "$state" "$dest/state"
  echo "Scoped fault cleared at $(date -u +%FT%TZ)"
  ;;
begin)
  [[ ! -e "$state" && ! -e "$marker" && ! -e /root/caddy_data/ha-drain/s2 && ! -e /srv/ha-edge/zones/drain.s1 && ! -e /srv/ha-edge/zones/drain.s2 ]]
  [[ "$(cat /var/lib/ha-failover/role 2>/dev/null || echo standby)" = standby ]]
  systemctl is-active --quiet "ha-app-readiness@$app"
  [[ "$(docker exec "$app" id -u)" != 64193 ]]
  docker exec "$app" bun -e 'process.exitCode=Number(new URL(process.env.DATABASE_URL).hostname!=="10.88.0.1")'
  for ip in 72.61.156.49 179.198.214.41; do
    curl --max-time 3 --resolve "unbottled.ai:443:$ip" -fsS https://unbottled.ai/_ha/ready | grep -qx ready
  done
  id="$(docker inspect -f '{{.Id}}' "$app")"
  pid="$(docker inspect -f '{{.State.Pid}}' "$app")"
  if nsenter -t "$pid" -n iptables -w 3 -C OUTPUT "${rule[@]}" 2>/dev/null; then echo "Existing rule; stopping"; exit 1; fi
  mkdir -m 700 "$state"
  printf '%s %s\n' "$id" "$(readlink "/proc/$pid/ns/net")" > "$state/container"
  trap '"$program" undo' ERR
  systemd-run --quiet --collect --unit="$unit-$(date +%s)" --on-active=60s --timer-property=AccuracySec=100ms "$program" undo
  touch "$marker"
  nsenter -t "$pid" -n iptables -w 3 -I OUTPUT 1 "${rule[@]}"
  echo "S2 readiness PG fault active at $(date -u +%FT%TZ); automatic undo in 60 s"
  ;;
*) echo "usage: $0 begin|undo" >&2; exit 2 ;;
esac
