# WireGuard private mesh (Server 1 ⇄ Server 2)

A point-to-point encrypted link so **all** replication traffic (Postgres logical
replication, Redis replication + Sentinel, MinIO site replication) and
inter-node control traffic travels over a private network, never the public
internet.

| Node     | Role           | WG address  | Public endpoint (example)      |
| -------- | -------------- | ----------- | ------------------------------ |
| Server 1 | primary / srv1 | `10.88.0.1` | `unbottled.ai:51820`           |
| Server 2 | replica / srv2 | `10.88.0.2` | `srv2016195.hstgr.cloud:51820` |

- Interface: `wg0`, UDP `51820`.
- Subnet: `10.88.0.0/24` (reserve `.1`/`.2` for nodes; `.10` is the keepalived
  **private VIP** that always points at the live Postgres/Redis primary — see
  `../keepalived/`).
- Keys are generated **on each node** (`wg genkey`); the private key never
  leaves its node. The templates below use `__PLACEHOLDERS__` the provisioning
  script fills in.

## Install (both nodes) — done by `ha/scripts/provision-node.sh`

```bash
apt-get update && apt-get install -y wireguard wireguard-tools
```

## Generate keys (each node)

```bash
umask 077
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
```

Exchange the two **public** keys between nodes (the provisioning script does
this over the existing SSH channel), then render `wg0.conf` from the matching
template and:

```bash
systemctl enable --now wg-quick@wg0
wg show            # verify handshake + transfer counters
ping -c3 10.88.0.2 # from srv1 (and 10.88.0.1 from srv2)
```

## Firewall

Open **only** UDP 51820 to the peer's public IP. Everything else
(5432/6379/9000/26379) binds to `10.88.0.0/24` and is never exposed publicly.

```bash
ufw allow from <PEER_PUBLIC_IP> to any port 51820 proto udp
```

> Both boxes verified `modprobe wireguard` succeeds, so the kernel module is
> present; only `wireguard-tools` (the `wg`/`wg-quick` userspace) needs
> installing.
