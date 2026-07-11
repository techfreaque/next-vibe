# Remote Connection

Connects two next-vibe instances for one user. Any topology: local↔local, local↔remote, remote↔remote.

**Only ADMIN can create a connection.** The target instance auto-creates a reverse entry — system-managed, no UI, never user-initiated. Cloud instances (`NEXT_PUBLIC_VIBE_IS_CLOUD`) never open outbound sockets.

This spec owns the connection rows, lifecycle, transport negotiation, and routing. Two systems it rides on, specced elsewhere:

- **Transport & event relay** — every cross-instance event (tool dispatch, sync, cache invalidation, control) rides the one **remote-event-bridge** on channel `system/remote-event/{userId}`, with two legs (reverse-ws, direct-http) chosen per connection. See [`../system/unified-interface/websocket/spec.md`](../system/unified-interface/websocket/spec.md).
- **The remote-call primitive** — `RouteExecuteRepository.runInProcess` / `runInProcessTyped({ instanceId })` dispatch any tool/endpoint to another instance transparently (same input, same `ResponseType<T>`), including callback modes and capability gating. See [`../system/unified-interface/execute-tool/spec.md`](../system/unified-interface/execute-tool/spec.md).

Sub-spec: [`sync/spec.md`](sync/spec.md) — domain sync.

---

## Principles

1. **One bridge, many consumers.** Tool calls, sync, control, cache invalidation all relay over the single `system/remote-event/{userId}` channel (reverse-ws) or a direct-http POST. No per-purpose channel.
2. **Transport is auto-negotiated, never user-set.** `transportMode` (our send leg) and `remoteTransportMode` (the peer's send leg) are caches of what worked, detected at connect by an authenticated ping. The connector opens an outbound socket on a side **iff the peer reaches it via reverse-ws** (`remoteTransportMode === "reverse-ws"`).
3. **No remote tasks.** Each instance manages only its own tasks; task state never crosses the wire. A remote call's tool message (running → completed/failed) is the caller's only record; the result arrives as a `tool-execute-result` event resolved via an in-memory pending-call registry.
4. **Sync is connection-lifecycle driven.** Bidirectional push-pull when the channel opens; live per-event relay while it is up; catch-up on next open. No background jobs. See [`sync/spec.md`](sync/spec.md).
5. **Routing is by folder ancestry, not config.** No routing-rules table.

---

## Transport

Two modes (`transportMode` enum: `reverse-ws | direct-http | cloud-only`):

- **`reverse-ws`** — the side behind NAT opens one persistent outbound WS to the peer and subscribes to `system/remote-event/self`. All relay traffic multiplexes on it. Default for `transportMode`.
- **`direct-http`** — peer is publicly reachable; each relay is an independent HTTP POST to the peer's bridge/execute-tool route. No persistent socket. Default for `remoteTransportMode`.

**Negotiation (at register time, callee→initiator):** the target pings the initiator's `localUrl` health endpoint with the reverse token. Reachable → the target records `transportMode = direct-http`; unreachable (NAT) → leaves `reverse-ws`. Each side's own `transportMode` is the peer's `remoteTransportMode`; settings PATCH mirrors a `transportMode` change to the peer as its `remoteTransportMode`.

**No dispatch-time failover — by design.** Negotiation runs only at connect/edit time; a leg reflects the peer's reachability, which doesn't change between calls. Failover is not architecturally possible: reverse-ws can't be opened on demand (the NAT'd peer holds it open, the caller can't conjure it), and a reverse-ws peer is unreachable over HTTP by definition (else direct-http would already be the negotiated leg). A down leg hard-fails. See [`../system/unified-interface/execute-tool/spec.md`](../system/unified-interface/execute-tool/spec.md) → Transport Failover.

**Who opens the socket:** exactly the side whose row has `remoteTransportMode === "reverse-ws"` runs a connector. Cloud never opens one. The connector is ref-counted; idle close 5 min after last release; reconnect with exponential backoff (1s→30s cap), re-reading the row each retry (deleted/inactive → stop; token/url changed → reconnect with new values). `wsConnectedAt` set on open, cleared on close.

---

## Routing

`RemoteTransport.resolveTarget()` — first match wins:

1. Explicit `instanceId` at call time.
2. Thread under a `REMOTE/{instanceId}/` subfolder → that connection (folder-ancestry match, deterministic).
3. `null` → run locally.

Only `isActive = true` rows with a token are candidates. `forceSystemProvider` / `isInferenceProvider` are **not** resolved here — they are ws-provider concerns handled in ai-stream routing.

---

## Lifecycle

**Connect (ADMIN, initiator):** SSRF-guard `remoteUrl` (private IPs rejected; bypassed in dev/test/preview) → ping remote for lead cookie → login to remote (store encrypted token + leadId) → mint a reverse token (self-login to `localUrl`, fallback signed JWT) → register on remote (POST `connect-reverse`, get back `remoteInstanceId`) → local collision check → store row (`isReverseEntry: false`, `threadMirrorMode: "both"`; `transportMode`/`remoteTransportMode` take DB defaults) → upsert self-identity → create `REMOTE/{instanceId}/` subfolder → hot-open connector if `transportMode === "reverse-ws"`. Failure cleans up prior steps.

**Register (system, on target):** validate self-collision → require reverse creds → encrypt reverse token → upsert reverse entry (`isReverseEntry: true`, `remoteUrl = localUrl`, `localUrl` stored, `syncScope` = all-on so the serve filter doesn't drop everything) → fire-and-forget transport ping back to `localUrl`; reachable → set this row's `transportMode = direct-http` → create subfolder. Never opens a socket.

**Reauth (PATCH with email+password):** re-login → mint+push a fresh reverse token to the peer (bounded retries) → update token/leadId → `restartConnection`. An empty leadId from login never overwrites the stored one.

**Rename:** PATCH `[instanceId]` renames our local label for a remote (row, cron targets, subfolder, connector re-key; propagated to peer with `propagate: false`). `self/rename` renames our own identity (instance-identity row, cron targets, every outbound row's `remoteInstanceId`; fans out to peers unless `propagate: false`).

**DELETE / disconnect:** delete row → invalidate caches → close connector → archive subfolder (`"{instanceId} (disconnected)"`) → DELETE on remote to drop the reverse entry (bounded retries; 401/404 stop).

**Settings PATCH (`[instanceId]`):** editable fields are `newInstanceId`, `email`+`password` (reauth), `transportMode`, `isInferenceProvider`, `forceSystemProvider`, `syncScope`, `reconnectNow`. `transportMode`/`isInferenceProvider`/`forceSystemProvider` are ADMIN-only; `forceSystemProvider = true` is cleared on all other connections first (single winner). Changes to `syncScope`/`transportMode` mirror to the peer (`connect-reverse/update`), which re-runs its connector decision on `remoteTransportMode`.

---

## DB Schema

Two tables.

**`instance_identities`** — per-user self-id (who am I?). `(userId, instanceId)` unique, one `isDefault`. Self-id falls back to `hermes` (preview) / `thea` (non-localhost URL) / `atlas`.

**`remote_connections`** — outbound connections and reverse entries. `(userId, instanceId)` unique.

| Column                    | Type            | Notes                                                                                               |
| ------------------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `userId`                  | uuid FK         | Cascade delete                                                                                      |
| `instanceId`              | text            | Our label for the remote (e.g. `hermes`)                                                            |
| `remoteUrl`               | text            | Reverse entry: equals the initiator's `localUrl`                                                    |
| `token`                   | text            | AES-256-GCM encrypted JWT (`enc:iv:tag:ct`); decrypt tolerates legacy plaintext                     |
| `leadId`                  | text            |                                                                                                     |
| `localUrl`                | text\|null      | Reverse entry only: initiator's public URL                                                          |
| `remoteInstanceId`        | text\|null      | The id the peer uses for itself                                                                     |
| `isReverseEntry`          | boolean         | System-created on target; no UI; never opens a socket                                               |
| `transportMode`           | enum            | Our send leg. `reverse-ws \| direct-http \| cloud-only`. Default `reverse-ws`                       |
| `remoteTransportMode`     | enum            | Peer's send leg (mirror of peer's `transportMode`). Default `direct-http`. Drives connector opening |
| `threadMirrorMode`        | enum            | `cloud \| local \| both \| none`. Default `cloud`; connect/register set `both`                      |
| `loopLocation`            | enum            | `client \| server`. Default `server`. Not editable via any endpoint                                 |
| `toolSource`              | enum            | `local \| remote \| both`. Default `local`. Not editable via any endpoint                           |
| `isInferenceProvider`     | boolean         | ws-provider selection — see ws-provider routing                                                     |
| `forceSystemProvider`     | boolean         | Admin-only; at most one `true` per user                                                             |
| `syncScope`               | jsonb\|null     | Per-domain booleans — see [sync/spec.md](sync/spec.md)                                              |
| `syncCursors`             | jsonb           | Per-domain pull cursors — see [sync/spec.md](sync/spec.md)                                          |
| `pushCursors`             | jsonb           | Per-domain push high-water — see [sync/spec.md](sync/spec.md)                                       |
| `isActive`                | boolean         | false after 401                                                                                     |
| `capabilities`            | jsonb           | Tool snapshot                                                                                       |
| `capabilitiesVersion`     | text\|null      | Peer's snapshot version we hold                                                                     |
| `sentCapabilitiesVersion` | text\|null      | Version of OUR snapshot the peer has confirmed; gates resend                                        |
| `wsConnectedAt`           | timestamp\|null | Set on open, cleared on close                                                                       |
| `lastSyncedAt`            | timestamp\|null | Advanced by sync                                                                                    |

**Removed concepts — do not reintroduce:** `routingRules` (routing is folder-ancestry), `allowTaskQueue`, `isSystemProvider`, `connectionDirection`, `taskCursor`, `syncHashes`, and the `system/tool-dispatch` / `system/sync` / `system/control` channels (all relay rides `system/remote-event/{userId}`).

---

## Security

- Only ADMIN creates connections; reverse entries are system-created.
- The opening side is decided by `remoteTransportMode`; cloud never opens an outbound socket.
- JWT encrypted AES-256-GCM per connection.
- Capability snapshots validated fail-closed before every remote AI tool dispatch — see [`../system/unified-interface/execute-tool/spec.md`](../system/unified-interface/execute-tool/spec.md).
- SSRF guard on `remoteUrl` (loopback/private allowed only in dev/test/preview); reachability checks are authenticated calls.
- Cross-instance relay echo-guarded by `originInstanceId`; per-connection `syncDomain`/`syncScope` gate applied at both sender and receiver.
- `localUrl` server-side only, never in client responses. WS auth via URL params, server-to-server only. Inbound payloads schema-validated and dropped on mismatch.
