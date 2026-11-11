#!/bin/bash
set -euo pipefail
# ============================================================================
# Node provisioning — install the SAFE, additive prerequisites on a node so it
# can join the unbottled HA pair. Idempotent. Run per node.
#
#   ha/scripts/provision-node.sh <node>      node ∈ { server1, server2 }
#
# Installs: wireguard-tools, keepalived, (docker assumed present on both).
# Generates WireGuard keys (private key stays on the node), renders wg0.conf,
# brings up the tunnel. Does NOT start replication/keepalived services (those
# are enabled explicitly during cutover) and NEVER touches heilpraktiker.
#
# What it deliberately does NOT do (flagged, not forced):
#   - set wal_level=logical / restart any Postgres (cutover runbook, Server 1)
#   - take ports 3000/4000 on Server 2 (app binds 3100/4100 on the WG IP)
#   - modify heilpraktiker containers, DB, or caddy vhost
# ============================================================================
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO/.env}"
NODE="${1:?usage: provision-node.sh <server1|server2>}"

getenv() { python3 - "$1" "$ENV_FILE" <<'PY'
import re,sys
k,f=sys.argv[1],sys.argv[2]
m=re.search(r'^'+re.escape(k)+r'=(.*)$',open(f).read(),re.M)
v=m.group(1).strip() if m else ''
if len(v)>=2 and v[0]==v[-1] and v[0] in '"\'': v=v[1:-1]
print(v)
PY
}
case "$NODE" in
  server1) HOST="$(getenv SSH_SERVER)";  PWD_="$(getenv SSH_SERVER_PWD)";  WGIP=10.88.0.1; PEER=server2 ;;
  server2) HOST="$(getenv SSH_SERVER2)"; PWD_="$(getenv SSH_SERVER2_PWD)"; WGIP=10.88.0.2; PEER=server1 ;;
  *) echo "unknown node $NODE" >&2; exit 1 ;;
esac
SSH="sshpass -p $PWD_ ssh -o StrictHostKeyChecking=accept-new $HOST"

echo "== [$NODE] installing wireguard-tools + keepalived (additive) =="
$SSH 'export DEBIAN_FRONTEND=noninteractive; apt-get update -qq && apt-get install -y -qq wireguard-tools keepalived curl >/dev/null && echo installed'

echo "== [$NODE] generating WireGuard keys (idempotent) =="
$SSH 'umask 077; mkdir -p /etc/wireguard; [ -f /etc/wireguard/privatekey ] || (wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey); echo "pubkey: $(cat /etc/wireguard/publickey)"'

echo "== [$NODE] done. Public key above — feed both nodes' pubkeys to render wg0.conf =="
echo "   Next: ha/scripts/wg-mesh-up.sh  (exchanges keys + brings up wg0 on both)"
