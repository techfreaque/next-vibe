# WebSocket — Unified Real-Time Event System

One WebSocket system for the whole platform. Every real-time event — AI stream
chunks, cache updates, sidebar state, cross-instance relay, tool dispatch — flows
through this layer. **Definition-driven and typesafe end to end:** an endpoint
declares its events once in `definition.ts`; the payload type, the emit signature,
the channel authorization, and the relay configuration are all derived from it.

---

## Principles

1. **One declaration.** Events live in `events: { ... }` on the endpoint
   definition. Everything downstream — emit signature, client subscription type,
   remote relay, channel auth — is derived from it. No parallel schema.
2. **Four fields, always together.** Every emit takes the same envelope:
   `{ responseData, requestData, urlPathParams, payload }`. Each is typed and
   omitted only when its event declares no fields for it.
3. **Channel key inferred, never declared.** The channel is always
   `buildWsChannel(endpoint, urlPathParams, requestData)` — `[param]` segments
   plus `includeInCacheKey` request fields, mirroring the React Query cache key.
   The definition's `channel: { scope }` only decides whether the user id ALSO
   keys it (`kind:"user"` → `buildUserWsChannel`, the same key under the
   owner's `user/{id}/` prefix) or not (`kind:"resource"` → shared). Every
   channel is unique per endpoint + params (+ user) — there is NO bundled
   per-user firehose; delivery only reaches sockets subscribed to exactly that
   endpoint instance.
4. **One socket per tab, virtual channels.** The browser opens exactly one `/ws`
   connection. Subscribe frames carry a structured descriptor for endpoint
   channels (`{endpointPath, method, urlPathParams, requestData}`); the server
   rebuilds the canonical channel from it (anti-spoof). Reconnect re-subscribes.
5. **Authorization is definition-driven and type-enforced.** A method with
   client-delivered events MUST declare `channel: { scope }` (compile error
   otherwise). `scope:"user"` → owner channel, no route code. `scope:"resource"`
   / `"resolved"` → the route MUST supply `resolveChannel` (also a compile
   error if missing) — it both authorizes a subscriber AND decides the channel
   kind, so emit-delivery and subscribe-admission can never disagree. Fail-closed
   at build (`vibe gen`) and runtime (missing resolver → deny).
6. **One delivery path.** Route handlers never touch sockets. They call the
   emitter, which delivers in-process when the proxy shares this process, else
   POSTs to the proxy's `/ws/broadcast`.
7. **The cross-instance transport is just an event.** Every cross-instance event
   — cache invalidation, execute-tool, sync, control — rides the
   **remote-event-bridge**'s single regular `scope:"user"` `remote-event` event on
   the bridge endpoint's own user-scoped channel. No bespoke channel, no special
   event name: the peer's connector subscribes to it like any client — and it is
   the ONLY subscriber, because browser tabs subscribe to the endpoints they
   render, never the bridge. Work items (tool-execute-request) therefore reach
   exactly the connector, with no delivery heuristics. Two legs (direct-http,
   reverse-ws) chosen per connection; sync, execute-tool, etc. are consumers on
   top, never hand-rolling transport.

---

## Architecture

```
Browser ─ one /ws socket ──► Bun proxy
                               │  • upgrade + channel auth + fan-out
                               │  • HTTP proxy → Next.js
                               ▼
route handler ─► emitter ─► proxy sockets (in-process, or loopback POST)
                               │
                               └─ PubSubAdapter (local | redis) for multi-instance
```

**Layout — three folders, one dependency direction:**

`core/` ← `server/`, `core/` ← `client/`. Nothing in `core/` imports from
`server/` or `client/`, and that is the whole point: `core/` is what a CLI/MCP
install takes. It reaches no WS server, no database, and no Next.js, so event
declarations, emitting, and in-process observation all work with nothing else
installed. Capabilities that DO need those things register themselves into core
at module init (`local-broadcast.ts`, `relay-hook.ts`) rather than being imported
by it.

**`core/`:**

- `structured-events.ts` — the event type system + `AnyEndpointEventEnvelope`.
- `types.ts` — wire frames and channel descriptors.
- `emitter.ts` — `createEndpointEmitter(endpoint, logger, user, channel, opts?)`
  binds the channel ONCE and returns a typed `emit(name, data)` that fires many
  events on it; low-level `publishWsEvent`.
- `channel.ts` — single source of truth for channel names: `buildWsChannel`,
  `buildUserWsChannel`. Only two channel kinds — `ws-…` and `user/{uid}/ws-…`;
  no bespoke cross-instance channel.
- `local-broadcast.ts` — in-process bridge. When the proxy boots in this process
  the emitter delivers directly; otherwise it falls back to the loopback POST.
- `relay-hook.ts` — the same inversion for cross-instance relay: the bridge
  registers, the emitter calls through. Keeps the DB out of core and breaks the
  emitter ↔ bridge cycle.
- `event-observers.ts` / `cli-event-tap.ts` — passive in-process taps. The CLI's
  entire realtime story, with no socket anywhere.
- `relay-context.ts` — pre-resolved relay context (session-scoped).
- `sync-domain.ts` — `SYNC_DOMAINS` / `SyncDomain`, re-exported by
  `remote-connection/db` so the drizzle module stays off core's import graph.
- `env-availability.ts` — the augmentable env slot on the event handler context.

**`server/`:**

- `server.ts` — Bun `serve()`: `/ws` upgrade, subscription sets, `broadcastLocal*`,
  the `/ws/broadcast` POST sink, channel auth. Registers its broadcast fns into
  `core/local-broadcast.ts` on boot for in-process delivery.
- `connector.ts` — reverse-ws connection manager (`WsConnection` + registry).
  One outbound socket per remote connection, opened on demand. Also runs the
  sync pull-on-connect over HTTP (bootstrap, before the socket is up).
- `http-proxy.ts`, `proxy-loading-page.ts`, `ws-channel-auth.ts`,
  `ws-channel-registry.ts`, `keyed-signal.ts`, `env.ts`.
- `pubsub/` — `local` (in-process) and `redis` adapters behind `PubSubAdapter`.
- `remote-event-bridge/` — the cross-instance transport. One `repository.ts`
  (`RemoteEventBridgeRepository`) + `definition.ts` + `route.ts`.

**`client/`:**

- `client.ts` — single shared browser socket + imperative subscribe API.

---

## Event Declaration

```typescript
events: {
  "message-created": {
    remoteEvent: true,
    syncDomain: "chat",
    responseFields: { messages: ["id", "content", "role"] },
    operation: "merge",
    onEvent: async (ctx) => { /* client-side side effect */ },
  },
}
```

| Field                 | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `responseFields`      | Response fields carried. Flat `["a","b"]` or nested `{ key: ["sub"] }`.   |
| `requestFields`       | Request fields included in the envelope's `requestData`.                  |
| `urlPathParamsFields` | URL param keys required; absent → full URL params type required.          |
| `operation`           | `merge` \| `append` \| `remove` — how the client cache-merger applies it. |
| `remoteEvent: true`   | Relayed cross-instance via the remote-event-bridge.                       |
| `syncDomain`          | Tags the event for per-connection `syncScope` filtering.                  |
| `onEvent`             | Client callback after the cache merger applies the payload.               |
| `allowedRoles`        | Roles allowed to trigger this remote event.                               |

`createEndpoint` derives four pre-typed maps onto `definition.types`
(`EventResponsePayloads`, `EventRequestPayloads`, `EventEmitUrlPayloads`,
`EventPayloadTypes`); `EmitEventNamed` builds the typed `emit(name, data)` union.

---

## Emit

The channel binds ONCE at creation — `urlPathParams` + the includeInCacheKey
`requestData` ARE the channel key (identical to the client's subscription key).
The returned emitter fires many events on that one channel; each emit carries only
the event's declared payload.

The binding is **type-safe per endpoint**: `urlPathParams` is REQUIRED when the
endpoint has url params and ABSENT (cannot be passed) when it has none;
`requestData` is REQUIRED when the endpoint declares includeInCacheKey fields and
ABSENT otherwise. There is no empty `{}` — a `scope:"user"` list with neither has
a binding of just `{}` (or `{ kindOverride }`). This makes emit-side and
subscribe-side build identical channel keys, enforced at compile time on both.

```typescript
const emit = createEndpointEmitter(messagesDefinitions.GET, logger, user, {
  urlPathParams: { threadId },     // required: messages GET has a url param
  requestData: { rootFolderId },   // required: messages GET keys on rootFolderId
  // kindOverride?: "user" | "resource"  — only for scope:"resolved" (see below)
});
emit("message-created", {
  responseData: { messages: [...] }, // when event has responseFields
  requestData: { ... },              // when event DELIVERS requestFields as payload
  payload: undefined,                // when event has a payload type
  // urlPathParams is optional per-emit — the binding already supplies it
});
```

**Delivery on every emit:**

1. **Local** — the delivery channel is the binding's CHANNEL KIND (the same
   decision `resolveChannel` makes for subscribers): `kind:"user"` → the owner's
   user-scoped channel for this endpoint instance (`buildUserWsChannel`);
   `kind:"resource"` → the shared `buildWsChannel`
   channel (PUBLIC/SHARED). The kind comes from the definition's `channel.scope`;
   a `scope:"resolved"` endpoint resolves owner-vs-public per resource row, so its
   repository (which already holds the mutated resource) passes the resolved kind
   as the binding's `kindOverride`. No DB read at emit time. Delivery is
   **presence-gated**: skipped when the proxy
   is in-process and the channel has zero local subscribers. Emit returns
   `{ delivered, relayed, dropped }`.
2. **Remote relay** — if `remoteEvent: true` and `fanOut !== false`,
   `RemoteEventBridgeRepository.pushRemoteEvent` fans the envelope to the user's
   peer connections (see Cross-Instance Relay). Relay is independent of the local
   channel kind: the reverse-ws leg emits the bridge `remote-event` event on the
   bridge endpoint's user-scoped channel, where the peer's connector is the only
   subscriber.

`options.fanOut = false` suppresses remote relay (used in `onRemoteEvent` handlers
to re-emit locally without a loop). `options.batcher` routes local delivery through
a batching emitter (high-frequency stream deltas). There is no `broadcast` flag —
`{ kind: "resource" }` replaces it.

---

## Channels

| Channel                                | Builder              | Purpose                                                                                                                       |
| -------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ws-{path}-{method}[-…]`               | `buildWsChannel`     | The shared (`kind:"resource"`) channel — path + urlPathParams + cache-key request fields                                      |
| `user/{userId}/ws-{path}-{method}[-…]` | `buildUserWsChannel` | The SAME canonical key under the owner's identity prefix — a user's own (`kind:"user"`) events for that one endpoint instance |

Both kinds are unique per endpoint + params; the user kind is additionally
partitioned by identity. There is NO bundled per-user firehose and NO bespoke
`system/…` transport. Cross-instance events ride the bridge endpoint's regular
`scope:"user"` `remote-event` event on the bridge's own user-scoped channel (see
Cross-Instance Relay). execute-tool, sync, cache invalidation, and control are
all just events relayed through it. All channel names come from `channel.ts`; no
magic strings.

---

## Wire Format

```typescript
interface WsWireMessage {
  channel: string; // routing key
  event: "__event__"; // every endpoint event rides one envelope shape
  data: AnyEndpointEventEnvelope; // the one wire payload type
  seq: number; // monotonic — receivers dedupe by (channel, seq)
}
// Batch frame:  { type: "batch", events: WsWireMessage[] }
// Client→server: { type:"subscribe", channel, locale, descriptor? }
//              | { type:"unsubscribe", channel }
//   For endpoint (ws-*) channels the subscribe frame carries a structured
//   `descriptor` { endpointPath, method, urlPathParams, requestData }; the server
//   rebuilds the canonical channel from it and never parses params out of the
//   channel string. Inbound frames are Zod-validated (parseWsClientMessage), not
//   cast.
```

Connection control (rename, settings/syncScope updates) is not a bespoke frame:
it is a normal remote call to the peer's own endpoint (`connect-reverse/update`,
`self/rename`) via `runInProcessTyped({ instanceId })`, which resolves to the same
relay legs — see [`../../../remote-connection/spec.md`](../../../remote-connection/spec.md).

Batching: `createBatchingEmitter` accumulates for ~16ms or 50 events, then sends
one batch frame; `flush()` drains at stream end.

---

## Channel Authorization

The definition declares a `channel: { scope }` for every method that emits
client-delivered events (required at the type level — a method with such events
will not compile without it):

- **`scope: "user"`** — events are the caller's own private data, delivered on
  the endpoint's user-scoped channel (`user/{id}/ws-…`). The identity IS the
  boundary; the route declares no resolver.
- **`scope: "resource"` / `"resolved"`** — a shared channel; the route MUST supply
  `resolveChannel(ctx)` which decides, per resource + identity, the channel kind:
  `{ kind: "user" | "resource" | "deny" }`.

On subscribe, `server.ts` → `authorizeWsChannel`:

1. `user/{userId}/…` — allowed iff the uid segment is the caller's own id.
   Everything the emitter delivers under that prefix is the owner's own data by
   construction, so no per-endpoint resolver runs.
2. Endpoint (ws-\*) channel — look the endpoint up by the descriptor's
   `endpointPath + method`, **rebuild the canonical channel** from the descriptor
   and deny if it does not equal the channel the client asked to join (anti-spoof),
   run `allowedRoles`, then `resolveChannel({ user, urlPathParams, requestData })`
   — admit iff the verdict is not `deny`. **Fail-closed:** a registered channel
   whose route declares no resolver is denied (and the generator refuses to build
   it).

`resolveChannel` lives on the route as a one-line delegate to the resource's
repository (skills: owner→user, PUBLIC/SYSTEM→resource; chat: PRIVATE→user,
PUBLIC/SHARED→resource by folder trust). The SAME repository decision drives the
emitter's delivery channel kind, so subscribe-admission and emit-delivery can
never disagree.

---

## Client

`client.ts` keeps one `WebSocket` per tab. `useEndpointSubscription(endpoint, opts)`
derives the channel, subscribes to every declared event, and applies payloads to
the React Query cache via `cache-merger.ts` per the event's `operation`. `onEvent`
runs after the merge. Reconnect uses exponential backoff (1s→30s) and re-subscribes.

---

## Cross-Instance Relay

The transport is **a regular endpoint event** — not a bespoke channel. The bridge
endpoint (`remote-event-bridge`) declares one `scope:"user"` client-delivered
event, `remote-event`, whose `responseData` carries any route's relayed envelope
(`{ originInstanceId, syncDomain, envelope }`). It rides the bridge endpoint's
own user-scoped channel like any other user event — a channel only connectors
subscribe to, so bridge frames (including execution requests) never reach
browser tabs or other sockets of the same user.

Events with `remoteEvent: true` are forwarded by
`RemoteEventBridgeRepository.pushRemoteEvent`, which resolves each peer's leg from
its `remoteConnections.transportMode`:

- **direct-http** — `RouteExecuteRepository.runInProcessTyped({ instanceId })`
  POSTs the relayed wire to the peer's bridge endpoint (the one canonical
  remote-call path; auth applied there). Fire-and-forget (`DETACH`).
- **reverse-ws** — the sender EMITS the bridge `remote-event` event AS the peer
  user (one emit per qualifying connection); the emitter delivers it on the
  bridge endpoint's user-scoped channel for that identity. The peer's connector,
  subscribed to exactly that channel, receives a normal `__event__` envelope and
  dispatches it. The connector is opened only when the peer is **not** directly
  reachable.

`remoteUserId` is the peer-side userId (the same account's id on the peer's DB),
learned once on the connect/register handshake and stored on `remoteConnections`.
The connector subscribes to the bridge endpoint's user-scoped channel for that
identity (`buildUserWsChannel(bridge.POST, remoteUserId, …)`) — the peer's WS
auth admits it because the connector's token authenticates as exactly that user.
There is no `self` sentinel and no `system/…` channel.

Both legs land at `RemoteEventBridgeRepository.handleRemoteEvent`, which dispatches
to the target route's `onRemoteEvent` via the generated registry (keyed by
`endpointPath:method:eventName`).

**Authorization is the connection's identity, not a channel check.** A remote
connection is **one account across two instances** (a different userId per
instance). A relayed event is therefore the connection's user's OWN data syncing
to their own instance. It is authorized by exactly three things, all already in
the path — there is no extra resource gate:

- **The user.** The connector subscribes to the bridge endpoint's user-scoped
  channel for the peer identity (`remoteUserId`) and dispatches `onRemoteEvent`
  AS the connection's user (`config.userId` locally), resolved with their REAL
  roles on this instance. The handler scopes its writes to that user.
- **The instance.** Echo prevention drops events whose `originInstanceId` equals
  this instance's configured self-id — no A→B→A loops.
- **The domain.** `syncDomain` is gated at the sender per connection: a domained
  event relays only where the peer enabled it in `syncScope`.

A subscribe-time `resolveChannel` is deliberately NOT run here: it does a resource
lookup, but a relayed `*-created`/`*-updated` event's resource does not exist on
the receiving instance yet — that is the very state the sync creates.

```typescript
onRemoteEvent: {
  "message-created": (props) => MessagesRepository.applyRemoteMessageCreated(props),
}
```

The handler typically (1) writes DB state idempotently as the connection's user,
then (2) re-emits locally with `fanOut: false` when clients on this instance need
the update — the re-emit uses the same channel kind a fresh local mutation would.

---

## Pub/Sub (multi-instance)

`broadcastLocalToAll` fans out to sockets on this process. `PubSubAdapter`
(`WS_PUBSUB_TYPE=redis`) relays publishes to other app instances, each calling
`broadcastLocalToAll`. `local` (default) is a direct in-process call. The adapter
choice is the only difference between single- and multi-instance deployments.
