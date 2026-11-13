#!/bin/bash
set -euo pipefail
# ===========================================================================
# edge-up.sh — stage/start the self-hosted PowerDNS edge on ONE node.
#
# Idempotent + NON-DISRUPTIVE: it only opens :53 on this node's own public +
# WireGuard IP and writes under $EDGE_ZONE_DIR. It touches nothing the app /
# caddy / postgres stack uses. It does NOT make the edge live for the public
# domain — that happens only when the registrar NS delegation is pointed here
# (see README, "Registrar action").
#
# Run ON the node (it reads the node's own role from the arg):
#   ./edge-up.sh s1        # on Server 1  (ns1, public 72.61.156.49)
#   ./edge-up.sh s2        # on Server 2  (ns2, public 179.198.214.41)
#
# Or with --dry-run to just render + validate the zone locally and print what
# it WOULD start.
# ===========================================================================
ROLE="${1:?usage: edge-up.sh <s1|s2> [--dry-run]}"
DRY=0; [ "${2:-}" = "--dry-run" ] && DRY=1

case "$ROLE" in
  s1) NODE_PUBLIC_IP=72.61.156.49;  NODE_WG_IP=10.88.0.1 ;;
  s2) NODE_PUBLIC_IP=179.198.214.41; NODE_WG_IP=10.88.0.2 ;;
  *) echo "role must be s1 or s2" >&2; exit 2 ;;
esac
export NODE_PUBLIC_IP NODE_WG_IP
EDGE_ZONE_DIR="${EDGE_ZONE_DIR:-/srv/ha-edge/zones}"
export EDGE_ZONE_DIR
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "== edge-up ($ROLE) : public=$NODE_PUBLIC_IP wg=$NODE_WG_IP zonedir=$EDGE_ZONE_DIR dry=$DRY =="

# 1. Render the INITIAL zone with BOTH nodes healthy (the daemon takes over).
# World-readable so the in-container pdns user (setuid=pdns) can read it.
mkdir -p "$EDGE_ZONE_DIR"; chmod 755 "$EDGE_ZONE_DIR"
serial="$(( $(date -u +%s) - 1700000000 ))"   # uint32-safe, monotonic (see daemon note)
apex="@\t30\tIN A\t72.61.156.49\n@\t30\tIN A\t179.198.214.41\n"
www="www\t30\tIN A\t72.61.156.49\nwww\t30\tIN A\t179.198.214.41\n"
sed -e "s/@@SERIAL@@/${serial}/" "$HERE/zone.unbottled.ai.tmpl" \
  | awk -v apex="$apex" -v www="$www" '/^;;APEX_A_RECORDS;;$/ { printf apex; next } /^;;WWW_A_RECORDS;;$/ { printf www; next } { print }' \
  > "$EDGE_ZONE_DIR/unbottled.ai.zone"
chmod 644 "$EDGE_ZONE_DIR/unbottled.ai.zone"
echo "   rendered $EDGE_ZONE_DIR/unbottled.ai.zone (serial $serial, apex = both nodes)"

if [ "$DRY" = 1 ]; then
  echo "   DRY-RUN — would run:"
  echo "     docker compose -f $HERE/docker-compose.edge-dns.yml -f $HERE/docker-compose.health.yml up -d"
  echo "   zone preview (apex + NS):"
  grep -E '^(@|ns[12]|\*|www|s2)[[:space:]]' "$EDGE_ZONE_DIR/unbottled.ai.zone" | sed 's/^/     /'
  exit 0
fi

# 2. Bring up pdns + the health daemon (compose reads NODE_PUBLIC_IP/NODE_WG_IP
#    and EDGE_ZONE_DIR from the env we exported).
docker compose \
  -f "$HERE/docker-compose.edge-dns.yml" \
  -f "$HERE/docker-compose.health.yml" \
  up -d

echo "   waiting for pdns to answer locally…"
for i in $(seq 1 20); do
  if dig +short +time=2 +tries=1 @"$NODE_PUBLIC_IP" unbottled.ai A >/dev/null 2>&1; then
    ans="$(dig +short @"$NODE_PUBLIC_IP" unbottled.ai A | sort | tr '\n' ' ')"
    echo "   ✓ pdns answering on $NODE_PUBLIC_IP:53 — apex A = [$ans]"
    echo "   ✓ NS answer: $(dig +short @"$NODE_PUBLIC_IP" unbottled.ai NS | tr '\n' ' ')"
    exit 0
  fi
  sleep 1
done
echo "   ✗ pdns did not answer on $NODE_PUBLIC_IP:53 within 20s — check 'docker logs ha-edge-pdns'" >&2
exit 1
