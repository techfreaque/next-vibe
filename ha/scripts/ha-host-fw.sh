#!/bin/bash
# ===========================================================================
# ha-host-fw.sh: host firewall for the unbottled.ai HA boxes (S1 + S2).
#
# Public surface after this script: 22, 80, 443 (tcp, + 443/udp for HTTP/3).
# WireGuard UDP 51820 is accepted ONLY from the peer box. Everything the HA
# layer needs (Postgres, Redis, MinIO, app 3000/3100/4000, PowerDNS) is
# reached over wg0 (10.88.0.0/24) or docker networks, never over eth0.
#
# What it blocks on the PUBLIC interface:
#   - udp 51820 from anyone but the peer
#   - tcp 3000/4000 (docker-published app ports that bypass Caddy)
#   - tcp/udp 53 (PowerDNS edge; not delegated yet; re-open only after it is
#     hardened with rate limiting, see ha/edge-dns/README.md)
#   - tcp/udp 5355 (systemd-resolved LLMNR)
#
# Docker-published v4 ports are DNATed in PREROUTING and never hit INPUT, so
# they are filtered in DOCKER-USER by their ORIGINAL dst port (conntrack).
# Docker here runs without ip6tables NAT, so v6 published ports go through
# docker-proxy and are filtered in INPUT.
#
# Idempotent: owns the chains HA-INPUT / HA-DOCKER, flushes + refills them.
# Rollback: systemctl disable --now ha-host-fw.service (ExecStop removes the
# jumps and chains), or run this script with "stop".
#
# Install (per box):
#   install -m 755 ha/scripts/ha-host-fw.sh /usr/local/sbin/ha-host-fw.sh
#   printf 'PEER_V4=<peer ipv4>\nPEER_V6=<peer ipv6>\nPUB_IF=eth0\n' > /etc/default/ha-host-fw
#   install -m 644 ha/scripts/ha-host-fw.service /etc/systemd/system/
#   systemctl daemon-reload && systemctl enable --now ha-host-fw.service
#
# NEVER add tunnelling tools (wstunnel, chisel, frp, ngrok, gost, ...) to these
# boxes: Hostinger's in-VM scanner flags them as malware and hard-stops the VPS
# (it did exactly that to S1 on 2026-11-12 for wstunnel). Plain WireGuard/UDP
# works between the two boxes (measured ~520 Mbit/s, 0% loss).
# ===========================================================================
set -u

[ -f /etc/default/ha-host-fw ] && . /etc/default/ha-host-fw
PEER_V4="${PEER_V4:?set PEER_V4 in /etc/default/ha-host-fw}"
PEER_V6="${PEER_V6:-}"
PUB_IF="${PUB_IF:-eth0}"
WG_PORT="${WG_PORT:-51820}"

unhook() {
  iptables -D INPUT -j HA-INPUT 2>/dev/null
  ip6tables -D INPUT -j HA-INPUT 2>/dev/null
  iptables -D DOCKER-USER -j HA-DOCKER 2>/dev/null
  for t in iptables ip6tables; do
    $t -F HA-INPUT 2>/dev/null; $t -X HA-INPUT 2>/dev/null
  done
  iptables -F HA-DOCKER 2>/dev/null; iptables -X HA-DOCKER 2>/dev/null
}

if [ "${1:-start}" = "stop" ]; then
  # loop because a double-start could have inserted the jump twice
  for _ in 1 2 3; do unhook; done
  exit 0
fi

# ---- INPUT (host sockets: WireGuard, LLMNR, v6 docker-proxy) ----
for t in iptables ip6tables; do
  $t -N HA-INPUT 2>/dev/null || $t -F HA-INPUT
done

iptables -A HA-INPUT -p udp --dport "$WG_PORT" -s "$PEER_V4" -j ACCEPT
iptables -A HA-INPUT -p udp --dport "$WG_PORT" -j DROP
if [ -n "$PEER_V6" ]; then
  ip6tables -A HA-INPUT -p udp --dport "$WG_PORT" -s "$PEER_V6" -j ACCEPT
fi
ip6tables -A HA-INPUT -p udp --dport "$WG_PORT" -j DROP
for t in iptables ip6tables; do
  $t -A HA-INPUT -i "$PUB_IF" -p udp --dport 5355 -j DROP
  $t -A HA-INPUT -i "$PUB_IF" -p tcp --dport 5355 -j DROP
done
ip6tables -A HA-INPUT -i "$PUB_IF" -p tcp -m multiport --dports 3000,4000,53 -j DROP
ip6tables -A HA-INPUT -i "$PUB_IF" -p udp --dport 53 -j DROP
for t in iptables ip6tables; do
  $t -A HA-INPUT -j RETURN
  $t -C INPUT -j HA-INPUT 2>/dev/null || $t -I INPUT 1 -j HA-INPUT
done

# ---- DOCKER-USER (v4 docker-published ports, DNATed before INPUT) ----
if iptables -n -L DOCKER-USER >/dev/null 2>&1; then
  iptables -N HA-DOCKER 2>/dev/null || iptables -F HA-DOCKER
  iptables -A HA-DOCKER -i "$PUB_IF" -p tcp -m conntrack --ctdir ORIGINAL \
    --ctorigdstport 3000 -j DROP
  iptables -A HA-DOCKER -i "$PUB_IF" -p tcp -m conntrack --ctdir ORIGINAL \
    --ctorigdstport 4000 -j DROP
  iptables -A HA-DOCKER -i "$PUB_IF" -p tcp -m conntrack --ctdir ORIGINAL \
    --ctorigdstport 53 -j DROP
  iptables -A HA-DOCKER -i "$PUB_IF" -p udp -m conntrack --ctdir ORIGINAL \
    --ctorigdstport 53 -j DROP
  iptables -A HA-DOCKER -j RETURN
  iptables -C DOCKER-USER -j HA-DOCKER 2>/dev/null || iptables -I DOCKER-USER 1 -j HA-DOCKER
else
  echo "ha-host-fw: DOCKER-USER chain missing (docker not up?); docker ports NOT filtered" >&2
  exit 1
fi
echo "ha-host-fw: applied (peer v4=$PEER_V4 v6=${PEER_V6:-none} if=$PUB_IF)"
