# keepalived — VRRP failover for the public edge + the Postgres/Redis primary VIP

keepalived runs on BOTH nodes and manages two VRRP instances:

1. **`VI_PUBLIC`** — the **public floating IP** that the DNS `A` record for
   `unbottled.ai` points at. Whichever node is MASTER holds it, so the public
   address survives a node death. (On Hostinger/Hetzner a "floating IP" is
   assigned via the provider API when it moves — see `floating-ip.md` for the
   `notify_master` hook that calls the provider to reattach it. On a plain VRRP
   LAN the IP just moves via gratuitous ARP.)

2. **`VI_DB`** — the **private VIP `10.88.0.10`** on `wg0` that always sits on the
   current Postgres/Redis primary. PgBouncer + the Redis HAProxy target this VIP,
   so "the primary" is a stable address. Its `notify_master` hook promotes the DB
   stack on the node that takes over.

## Priorities / preemption

- Server 1: higher priority (150), the normal MASTER for both instances.
- Server 2: lower priority (100), BACKUP.
- `nopreempt` on `VI_DB`: once Server 2 has taken the DB primary role (and
  promoted its logical subscriber), Server 1 coming back must NOT auto-steal it
  (logical replication can't auto-resync — see `../postgres/failback.md`). The
  public IP (`VI_PUBLIC`) MAY preempt back to Server 1 safely (stateless edge).

## Health tracking

A `vrrp_script chk_app` curls the local app health endpoint
(`/vibe/platforms/web/health`, which fails during drain, DB-down, etc.). If the
local app is unhealthy the node lowers its VRRP priority so the healthy node
takes the VIP. This ties edge failover to real app health, not just liveness.

## Files

- `keepalived.server1.conf.template`, `keepalived.server2.conf.template`
- `chk_app.sh` — health check script (exit 0 healthy).
- `notify-pg.sh` — on `MASTER`: promote PG (disable subscription, PAUSE/RESUME
  PgBouncer). On `BACKUP`/`FAULT`: step down.
- `notify-redis.sh` — on `MASTER`: `SENTINEL failover mymaster` if needed.
- `floating-ip.md` — provider-API reattach for the public floating IP.
