# MinIO HA — bucket replication (Server 1 ⇄ Server 2)

Chat media (images, audio, generated files) must survive a node loss. Each node
runs its own MinIO (already in `docker-compose.prod.yml`), and we replicate the
`chat-media` bucket between them over WireGuard.

## Mode: active-active bucket replication

`mc replicate` two-way between `srv1/chat-media` and `srv2/chat-media`. Either
node can take writes (the app on each node writes to its LOCAL MinIO), and the
object lands on the peer asynchronously. A read on either node finds the object
once replicated; the app proxies every file, so a brief replication lag only
affects a file created on the far node milliseconds ago (rare; the app writes
locally and reads locally for its own uploads).

> MinIO's richer "site replication" (`mc admin replicate add`) mirrors users,
> policies and bucket config too, but requires both sites to start empty or
> identical. Since Server 1 already holds data (post-migration), **bucket
> replication** (`mc replicate add`) is the safe, incremental choice and is what
> `setup-replication.sh` configures. Versioning is enabled on both buckets
> (required for replication).

## Endpoints (over WireGuard)

- Server 1 MinIO API: `http://10.88.0.1:9000`
- Server 2 MinIO API: `http://10.88.0.2:9000`

Both are bound to the WG IP only (see `minio-wg.override.yml`); the app still
talks to its LOCAL minio at `http://minio:9000` on the docker network, so no
public exposure.

## Failover

MinIO replication is data-level, not a VIP: each app instance uses its LOCAL
MinIO, so if Server 1 dies, Server 2's app keeps serving from Server 2's MinIO
(which holds the replicated copy). No promotion step. When Server 1 returns,
replication catches it up (and `mc replicate resync` can force a full
reconciliation if it was down long enough to miss objects — the replication
queue is best-effort, resync guarantees convergence).

## Files

- `minio-wg.override.yml` — bind each MinIO API/console to the WG IP + enable
  bucket versioning via the init container.
- `setup-replication.sh` — enable versioning + add two-way bucket replication
  (idempotent).
