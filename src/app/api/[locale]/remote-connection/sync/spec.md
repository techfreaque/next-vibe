# Remote Connection — Domain Sync

> Part of the remote connection system. See [`../spec.md`](../spec.md) for transport, lifecycle, and routing.

---

## The Model

Two mechanisms, no others:

1. **Push-pull on connect** — every channel open runs one bidirectional HTTP exchange against the peer's `/remote-connection/sync` endpoint. The caller sends its pull cursors (`syncCursors`) _and_ its own changes since `pushCursors`; the server applies the pushed changes first, then returns its changes since the caller's cursors plus fresh cursors. Both cursor sets advance. One round trip.
2. **Live per-event relay while the channel is up** — every mutating endpoint declares its events with `remoteEvent: true, syncDomain: "<domain>"`. On mutation the emitter relays the typed event over the remote-event-bridge; the peer re-runs it via that route's `onRemoteEvent`. This is **not** a serialized sync payload on a sync channel — it is the endpoint's own event, scope-gated by `syncDomain`. See the Cross-Instance Relay section of [`../../system/unified-interface/websocket/spec.md`](../../system/unified-interface/websocket/spec.md).

Missed live relays are caught by the next connect's push-pull. No background jobs, no cron pulls, no hash-diff layer. Task state never syncs.

**Loop prevention:** the bridge stamps `originInstanceId` and drops any event whose origin equals this instance's self-id (echo-guard) — there is no `syncSource` write-context flag.

---

## SyncProvider Interface

Each domain registers a `SyncProvider` (`sync/provider.ts`), auto-discovered via `ensureProvidersRegistered()`. A failed registration is retried on the next sync (never cached as rejected).

```typescript
interface SyncProvider {
  readonly key: string; // domain key, e.g. "memories"
  readonly labelKey: string; // i18n toggle label in connection settings
  readonly domain?: string; // optional live-event domain tag
  getCursor(userId: string): Promise<SyncCursor>;
  serializeFromCursor(
    userId: string,
    cursor: SyncCursor | null,
    logger: EndpointLogger,
  ): Promise<SyncSerializeResult>; // { json, cursor } — cursor derived from last item served
  upsertFromJson(
    json: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<number>;
}
```

`serializeFromCursor` returns records newer than `cursor` (or all if `null`) **and** the new high-water cursor — the connector advances cursors from this, not a separate `getCursor` call. `SyncCursor` is a union: `StandardSyncCursor = { updatedAt }` or `ThreadsSyncCursor = { threadsCursor, messageCursors }`. `pushCursors` vs `syncCursors` is a connection-level concern; a provider is unaware of push vs pull.

---

## Sync Scope

`syncScope` — one boolean per domain key, default `false` (opt-in) on initiator rows; reverse entries are created all-on (no UI to toggle). A `connect-reverse/update` mirror propagates changes to the peer. Scope is enforced on both sides: a domain disabled on either side is excluded from payloads, and the live relay is gated by `syncScope[syncDomain]` at both sender and receiver. Disabling stops future sync; already-synced data is kept.

---

## Connect-Time Push-Pull

For each enabled domain, in one POST to remote `/remote-connection/sync`:

1. Caller serializes its changes since `pushCursors[domain]` (drops empty/disabled) and reads `syncCursors`.
2. POST `{ instanceId, syncCursors, pushPayloads?, capabilitiesVersion, senderCapabilitiesVersion, capabilitiesJson? }`.
3. Server applies `pushPayloads` via `upsertFromJson` **before** serializing its own response, then serializes its changes since the caller's `syncCursors`.
4. Server returns `{ syncPayloads, syncCounts, remoteCursors, remoteCapabilitiesVersion, capabilities, serverTime }`.
5. Caller applies `syncPayloads`; advances `syncCursors ← remoteCursors` and `pushCursors ← the high-water it just pushed`; updates `lastSyncedAt` and capability versions.

One exchange per connection (sync-slot claim). Capability snapshot exchange rides the same request, gated by version.

---

## Conflict Resolution

Last-writer-wins on `updatedAt`; tie → incoming/remote wins (`>=`). Tombstones (`isDeleted`) propagate as hard deletes (cortex, skills). Favorites carry no tombstones — deletes are instance-local. Mirrored (REMOTE-folder) threads are **owner-authoritative**: the owner's version always wins, `parentId` is never overwritten on update, and empty assistant placeholders are skipped.

---

## Registered Domains

| Domain        | Table                                                  | Cursor                                                               | Notes                                                                                                                                     |
| ------------- | ------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **memories**  | `cortex_nodes` under memories path, `syncPolicy SYNC`  | `{ updatedAt }`                                                      | `LOCAL` nodes never leave. Match by `syncId`→`path`.                                                                                      |
| **documents** | `cortex_nodes` under documents path, `syncPolicy SYNC` | `{ updatedAt }`                                                      | Split from memories so users opt in independently.                                                                                        |
| **skills**    | `customSkills`                                         | `{ updatedAt }`                                                      | Lossless full-column upsert by UUID; community metrics excluded.                                                                          |
| **favorites** | `chatFavorites`                                        | `{ updatedAt }`                                                      | Dedup key `(skillId, variantId)`; no tombstones; `useCount`/`lastUsedAt` excluded.                                                        |
| **threads**   | `chatThreads` + `chatMessages`                         | `{ threadsCursor, messageCursors: { [threadId]: maxMsgUpdatedAt } }` | Connect-time only (no generic live push; out-of-band writes use `pushThreadSync`). Lands in `REMOTE/{instanceId}/`. Messages append-only. |

Cursor comparison serializes with millisecond-truncated `updatedAt` (raw SQL literal, dodges pg timezone conversion) so a current cursor short-circuits to empty instead of re-syncing forever.
