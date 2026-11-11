# Exposing Postgres to the peer over WireGuard only

The app reaches its DB in-container (`prod-postgres:5432` on the docker
network). **Replication** needs the subscriber (Server 2) to reach the
publisher (Server 1) at `10.88.0.1:5432`. Expose 5432 bound to the WG IP ONLY —
never `0.0.0.0`.

## Server 1 (publisher) — publish 5432 on the WG IP

Add a host port binding to the `postgres` service (prod compose) scoped to the
WG address:

```yaml
# docker-compose.ha.srv1.override.yml  (apply only on Server 1)
services:
  postgres:
    ports:
      - "10.88.0.1:5432:5432"
```

Bringing it up: `docker compose -f docker-compose.prod.yml -f docker-compose.ha.srv1.override.yml up -d postgres`.
Verify it is NOT public: `ss -tlnp | grep 5432` shows only `10.88.0.1:5432`.

> The template file is `ha/postgres/srv1.pg-wg.override.yml`.

## Server 2 (subscriber) — shared container reachable on WG

Server 2's `prod-postgres` is reachable from Server 1 at `10.88.0.2:5432` the
same way (needed for FAILBACK, when Server 1 subscribes back). Add the same WG
port binding to heilpraktiker's compose `postgres` service, or publish it with a
one-off `docker network`/`iptables` rule. Because it is bound to `10.88.0.2`
(a WG address), it is only reachable through the tunnel.

## Firewall

```bash
ufw allow from 10.88.0.0/24 to any port 5432 proto tcp
ufw deny 5432           # belt-and-suspenders: never public
```
