#!/bin/bash
# ===========================================================================
# ha-host-fw.sh: host firewall for the unbottled.ai HA boxes (S1 + S2).
#
# Public surface after this script: 22, 80, 443 (tcp, + 443/udp for HTTP/3),
# plus 53 tcp/udp (PowerDNS, per-source rate-limited; v4 only, pdns is not
# published on v6).
# WireGuard UDP 51820 is accepted ONLY from the peer box. Everything the HA
# layer needs (Postgres, Redis, MinIO, app 3000/3100/4000, PowerDNS) is
# reached over wg0 (10.88.0.0/24) or docker networks, never over eth0.
#
# What it blocks on the PUBLIC interface:
#   - udp 51820 from anyone but the peer
#   - tcp 3000/4000 (docker-published app ports that bypass Caddy)
#   - tcp/udp 53 above a per-source-IP rate (PowerDNS edge, authoritative only).
#     Since 2026-11-13 :53 is OPEN with hashlimit: per source IP max
#     DNS_UDP_QPS q/s (burst DNS_UDP_BURST) over UDP and DNS_TCP_CPS new TCP
#     conns/s; plus a global UDP ceiling DNS_UDP_TOTAL q/s. In a reflection
#     attack every spoofed query carries the VICTIM's address as source, so the
#     per-source cap bounds what this box can ever send to one victim
#     (~DNS_UDP_QPS x <=500 bytes). DNS_OPEN=0 in /etc/default/ha-host-fw
#     drops public :53 entirely again.
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
DNS_OPEN="${DNS_OPEN:-1}"
DNS_UDP_QPS="${DNS_UDP_QPS:-30}"
DNS_UDP_BURST="${DNS_UDP_BURST:-60}"
DNS_UDP_TOTAL="${DNS_UDP_TOTAL:-1500}"
DNS_TCP_CPS="${DNS_TCP_CPS:-5}"

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
  if [ "$DNS_OPEN" = "1" ]; then
    # PowerDNS edge (docker-published on the public IP): rate-limited, not dropped.
    iptables -A HA-DOCKER -i "$PUB_IF" -p udp -m conntrack --ctdir ORIGINAL \
      --ctorigdstport 53 -m hashlimit --hashlimit-name ha-dns-udp \
      --hashlimit-mode srcip --hashlimit-above "${DNS_UDP_QPS}/sec" \
      --hashlimit-burst "$DNS_UDP_BURST" --hashlimit-htable-expire 60000 -j DROP
    iptables -A HA-DOCKER -i "$PUB_IF" -p udp -m conntrack --ctdir ORIGINAL \
      --ctorigdstport 53 -m hashlimit --hashlimit-name ha-dns-udp-all \
      --hashlimit-above "${DNS_UDP_TOTAL}/sec" \
      --hashlimit-burst "$((DNS_UDP_TOTAL * 2))" -j DROP
    iptables -A HA-DOCKER -i "$PUB_IF" -p tcp -m conntrack --ctdir ORIGINAL \
      --ctorigdstport 53 --ctstate NEW -m hashlimit --hashlimit-name ha-dns-tcp \
      --hashlimit-mode srcip --hashlimit-above "${DNS_TCP_CPS}/sec" \
      --hashlimit-burst "$((DNS_TCP_CPS * 4))" -j DROP
  else
    iptables -A HA-DOCKER -i "$PUB_IF" -p tcp -m conntrack --ctdir ORIGINAL \
      --ctorigdstport 53 -j DROP
    iptables -A HA-DOCKER -i "$PUB_IF" -p udp -m conntrack --ctdir ORIGINAL \
      --ctorigdstport 53 -j DROP
  fi
  iptables -A HA-DOCKER -j RETURN
  iptables -C DOCKER-USER -j HA-DOCKER 2>/dev/null || iptables -I DOCKER-USER 1 -j HA-DOCKER
else
  echo "ha-host-fw: DOCKER-USER chain missing (docker not up?); docker ports NOT filtered" >&2
  exit 1
fi
echo "ha-host-fw: applied (peer v4=$PEER_V4 v6=${PEER_V6:-none} if=$PUB_IF dns_open=$DNS_OPEN)"
