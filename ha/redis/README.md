# Redis HA — replica + Sentinel (Server 1 master → Server 2 replica)

Redis carries cross-instance WebSocket pub/sub (stream tokens, cache
invalidation). In the active-active pair BOTH app instances must publish/subscribe
to the SAME Redis so a token streamed by the node that owns a chat reaches a
client connected to the other node.

## Topology

```
          WireGuard 10.88.0.0/24
Server 1  redis-master  10.88.0.1:6379  ◀──replicates──  Server 2 redis-replica 10.88.0.2:6379
          sentinel      10.88.0.1:26379                   sentinel   10.88.0.2:26379
                         └──────────── monitor mymaster, quorum 2 ────────────┘
```

- **Master**: Server 1 (`10.88.0.1:6379`).
- **Replica**: Server 2 (`replicaof 10.88.0.1 6379`).
- **Sentinel** on BOTH nodes monitors `mymaster`. On master loss, Sentinel
  promotes the Server 2 replica and rewrites each node's view.

## App connection — how the app always reaches the live master

The app's Redis client is pointed at Redis through a **local HAProxy TCP
front** (`ha/redis/haproxy/`) that health-checks both Redis nodes with
`tcp-check send PING` + `info replication` and routes writes to whichever is
`role:master`. This keeps the app's `REDIS_URL` a single stable endpoint
(`redis://127.0.0.1:6379`) and removes the need for a Sentinel-aware client.

> Simpler alternative if you prefer Sentinel-native: set
> `REDIS_URL=redis-sentinel://10.88.0.1:26379,10.88.0.2:26379/mymaster` and use a
> Sentinel-aware client. The app's ioredis-based adapter supports this, but the
> HAProxy front needs zero app changes and is the chosen path.

## Quorum caveat (2 nodes)

Two Sentinels with `quorum 2` means BOTH must agree to fail over — safe against
split-brain but cannot fail over if one Sentinel is also down. For a true
tie-break, run a **third Sentinel** (an arbiter) — e.g. on Server 1 a second
sentinel bound to a second WG alias, or on any always-on box that is NOT Server
3 (mail). Until a 3rd arbiter exists, Redis failover with one node dead requires
the surviving Sentinel to be manually told (`SENTINEL failover mymaster`), which
the keepalived `notify` hook triggers (`ha/keepalived/notify-redis.sh`). This is
documented as a known 2-node limitation; adding node 3 later (provisioning
playbook) makes it fully automatic.

## Persistence

Master uses AOF (`appendonly yes`, already in the base compose). The replica
also enables AOF so a promoted replica keeps durability.
