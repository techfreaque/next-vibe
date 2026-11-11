# Public floating IP failover

The public address for `unbottled.ai` must survive a node death. Two cases:

## A. Provider floating IP (Hostinger / Hetzner) — recommended

Both VPS are Hostinger (`*.hstgr.cloud`). A provider **floating IP** is a single
public IP you can reassign between servers via the provider API/panel. DNS `A`
record → the floating IP (stable). On takeover, `VI_PUBLIC`'s `notify_master`
runs `floating-ip-attach.sh` which calls the provider API to reattach the
floating IP to the node that just became MASTER.

`/etc/keepalived/floating-ip-attach.sh` (template):

```bash
#!/bin/bash
# Reattach the provider floating IP to THIS node. Creds + IDs in the env file.
set -u
. /etc/keepalived/floating-ip.env   # FIP_ID, THIS_SERVER_ID, PROVIDER_TOKEN
curl -fsS -X POST \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  "https://api.<provider>/floating-ips/$FIP_ID/attach" \
  -d "server_id=$THIS_SERVER_ID" \
  && logger -t keepalived-fip "floating IP $FIP_ID attached to $1"
```

Hostinger's API differs per plan — if no floating-IP API is available, use
option B (DNS failover) or a small front LB (a tiny always-on 3rd box, NOT
Server 3/mail) that holds the public IP and VRRPs to the backends.

## B. DNS failover (fallback, slower)

Low-TTL `A` record (TTL 30–60s). `notify_master` calls the DNS provider API to
repoint `unbottled.ai` to the surviving node's public IP. Failover is bounded by
TTL + resolver caching (tens of seconds), vs. ~sub-second for a real floating IP.

## C. Pure-VRRP (same L2 only)

If both nodes shared an L2 segment with a routable VIP, keepalived moves it via
gratuitous ARP with no API. Hostinger VPS are generally NOT on a shared L2 for
public IPs, so A or B applies for the PUBLIC address. The **private** VIP
(`10.88.0.10` on wg0) IS pure-VRRP and needs no provider API — that is why the
DB/Redis primary VIP works out of the box over WireGuard.

```

```
