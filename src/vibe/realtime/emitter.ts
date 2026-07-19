/**
 * Unified WS Event Emitter
 *
 * Single source of truth for all event broadcasting — local and remote:
 *   - Local delivery:   the WS proxy's socket registry (in-process when the
 *     proxy shares this process, else a loopback POST to /ws/broadcast)
 *   - Reverse-WS peers: published on the remote-event channel (peers subscribe)
 *   - Direct-http peers: relayed to each peer's remote-event-bridge
 *
 * The proxy owns the live sockets. When it runs in this same process it
 * registers its broadcast fns (see local-broadcast.ts) and we deliver directly;
 * otherwise (Next.js / proxy in separate processes) we POST to the proxy's
 * internal /ws/broadcast endpoint, which calls broadcastLocal() where the
 * sockets live.
 */

import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { SyncDomain } from "next-vibe/remote-connection/db";
import type {
  CacheKeyParams,
  CacheKeyParamValue,
  CacheKeyRequestData,
  CacheKeyRequestInput,
} from "next-vibe/unified-ui/hooks/query-key-builder";

import { buildUserWsChannel, buildWsChannel } from "./channel";
import { getLocalBroadcast } from "./local-broadcast";
import type { ResolvedRelayContext } from "./remote-event-bridge/relay-context";
import type {
  AnyEndpointEventEnvelope,
  EmitChannelKind,
  EmitDataRuntime,
  EmitResult,
  EndpointEmitter,
} from "./structured-events";
import type { WsWireMessage } from "./types";

// ─── Internal broadcast URL ───────────────────────────────────────────────────

function getBroadcastUrl(): string {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const wsPort =
      process.env["VIBE_DISABLE_PROXY"] === "true" ? mainPort + 1000 : mainPort;
    return `http://127.0.0.1:${wsPort}/ws/broadcast`;
  } catch {
    return "http://127.0.0.1:3000/ws/broadcast";
  }
}

let shuttingDown = false;

// ─── Low-level broadcast primitives ───────────────────────────────────────────

/**
 * Deliver a single WS event. Only the connection matching the user's identity
 * receives the event. In-process when the proxy shares this process; otherwise a
 * fire-and-forget loopback POST to the proxy.
 */
function publishWsEvent<T extends AnyEndpointEventEnvelope>(
  msg: Omit<WsWireMessage<T>, "seq">,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  const local = getLocalBroadcast();
  if (local) {
    local.broadcastToAll(msg.channel, msg.event, msg.data);
    return;
  }
  const url = getBroadcastUrl();
  // Cross-process fallback: the WS proxy runs in a SEPARATE process (see the
  // in-process fast path above). This loopback POST is the IPC to that proxy's
  // /ws/broadcast sink — an internal transport primitive, not an endpoint call.
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- internal WS-proxy IPC (separate process)
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...msg, user }),
  }).catch((err) => {
    if (!shuttingDown) {
      logger.warn("[WS Emitter] Failed to broadcast event", {
        error: err instanceof Error ? err.message : String(err),
        channel: msg.channel,
        event: msg.event,
        data: JSON.stringify(msg.data),
      });
    }
  });
}

// ─── Cross-instance relay payload types ─────────────────────────────────────

/**
 * Generic remote-event relay payload. One relay shape for every cross-instance
 * remote event. Identifies the target route + event and carries that event's own
 * envelope (all 4 fields together): endpointPath, endpointMethod, eventName,
 * urlPathParams, responseData, requestData, and payload — no duplication.
 */
export interface RemoteEventRelayPayload<TPayload = AnyEndpointEventEnvelope> {
  userId: string;
  logger: EndpointLogger;
  syncDomain?: SyncDomain;
  envelope: TPayload;
  /**
   * Point-to-point delivery: relay ONLY over the connection to this instance.
   * Broadcast semantics (thread mirroring etc.) leave it unset. Tool dispatch
   * (tool-execute-request/result) MUST set it — an account with several peers
   * would otherwise double-execute requests and leak results across peers.
   */
  targetInstanceId?: string;
  /**
   * Pre-resolved relay context for this session (originInstanceId + connections).
   * When provided, pushRemoteEvent skips both per-event DB queries entirely.
   * Resolve once at session/stream start via resolveRemoteEventContext().
   */
  resolvedRelayContext?: ResolvedRelayContext;
}

/**
 * Wire body of a relayed remote-event (what the bridge receives). Carried in the
 * bridge transport event's responseData. The envelope carries all 4 event fields
 * (responseData, requestData, urlPathParams, payload) plus endpointPath,
 * endpointMethod, eventName — no duplication of routing fields at the wire level.
 */
export interface RemoteEventWirePayload<TPayload = AnyEndpointEventEnvelope> {
  originInstanceId: string;
  syncDomain?: SyncDomain;
  envelope: TPayload;
  /**
   * Receiver ADDRESS for point-to-point frames on the shared reverse-ws hub
   * channel: the target connection's leadId (both sides know it — rename-proof,
   * unlike instance names). Set by the bridge per delivery leg.
   */
  targetLeadId?: string;
}

/**
 * The channel an emitter is bound to. Supplied ONCE at creation so one emitter
 * emits many events on a single, stable channel — never rebuilt per emit.
 *
 *   urlPathParams — the endpoint's full UrlVariablesOutput (channel routing key).
 *   requestData   — the endpoint's includeInCacheKey request fields (scope
 *                   disambiguation). Together they ARE the channel key, identical
 *                   to the React Query cache key the client subscribes on.
 *   kindOverride  — ONLY for `scope:"resolved"` endpoints, where owner-vs-public
 *                   is decided per resource row at runtime: the repository (which
 *                   holds the resource) passes the resolved kind here. For
 *                   `scope:"user"`/`"resource"` the kind comes from the definition
 *                   and this is ignored.
 */
/**
 * True when an endpoint declares NO url path params (UrlVariablesOutput is
 * `never` or an empty record) — `urlPathParams` then carries nothing and is
 * omittable from the binding.
 */
type HasNoUrlParams<TEndpoint extends CreateApiEndpointAny> = [
  TEndpoint["types"]["UrlVariablesOutput"],
] extends [never]
  ? true
  : [keyof TEndpoint["types"]["UrlVariablesOutput"]] extends [never]
    ? true
    : false;

/** The url-routing value of a binding when the endpoint HAS url params. */
type ChannelUrlParams<TEndpoint extends CreateApiEndpointAny> =
  TEndpoint["types"]["UrlVariablesOutput"];

/**
 * True when an endpoint declares NO includeInCacheKey request fields.
 * `CacheKeyRequestData` resolves to `undefined` exactly in that case (it's the
 * filtered map of cache-key fields), so we test it — NOT CacheKeyRequestInput,
 * whose concrete branch is a CacheKeyParams subtype and would match either way.
 */
type HasNoCacheKey<TEndpoint extends CreateApiEndpointAny> = [
  CacheKeyRequestData<TEndpoint>,
] extends [undefined]
  ? true
  : false;

/**
 * The cache-key value of a binding when the endpoint HAS cache-key fields. Each
 * declared field is kept (so a typo'd field name still errors) but made optional
 * — `buildWsChannel` keys on whichever are present, so a folder's *main* list
 * (no subFolderId/threadIds) keys exactly as the client that subscribed without
 * them. The value widens only as far as a CacheKeyParamValue, keeping the record
 * a CacheKeyParams subtype.
 */
type ChannelRequestData<TEndpoint extends CreateApiEndpointAny> = {
  readonly [K in keyof CacheKeyRequestInput<TEndpoint>]?: Extract<
    CacheKeyRequestInput<TEndpoint>[K],
    CacheKeyParamValue
  >;
};

/**
 * The channel an emitter is bound to. Supplied ONCE at creation so one emitter
 * emits many events on a single, stable channel — never rebuilt per emit.
 *
 *   urlPathParams — the endpoint's UrlVariablesOutput (channel routing key).
 *                   Present and REQUIRED only when the endpoint has url params;
 *                   the key is ABSENT entirely when it has none.
 *   requestData   — the endpoint's includeInCacheKey request fields. The key is
 *                   ABSENT when the endpoint declares none, and REQUIRED when it
 *                   does — you must pass the cache-key values that scope this
 *                   channel (each field's own value; a field not part of this
 *                   channel's key is the field's empty/absent value). Together
 *                   urlPathParams + requestData ARE the channel key — identical to
 *                   the React Query cache key the client subscribes on.
 *   kindOverride  — ONLY for `scope:"resolved"` endpoints, where owner-vs-public
 *                   is decided per resource row at runtime: the repository (which
 *                   holds the resource) passes the resolved kind here. For
 *                   `scope:"user"`/`"resource"` the kind comes from the definition.
 *
 * An endpoint with neither url params nor cache-key fields (e.g. a plain
 * `scope:"user"` list) has an empty binding — the whole `channel` argument is
 * then OPTIONAL and omitted entirely (see ChannelArgs), never passed as `{}`.
 */
/**
 * Emitter options carried ON the binding (so there is a single trailing argument,
 * conditionally optional). Independent of the endpoint's channel shape.
 */
interface EmitterOptions {
  /** When provided, local delivery goes through the batcher instead of direct publish. */
  readonly batcher?: {
    emit: (channel: string, event: string, data: WsWireMessage["data"]) => void;
  };
  /** Set false to suppress remote relay (e.g. connector replaying a peer stream). Default true. */
  readonly fanOut?: boolean;
  /**
   * Point-to-point remote relay: deliver ONLY over the connection to this
   * instance (see RemoteEventRelayPayload.targetInstanceId).
   */
  readonly targetInstanceId?: string;
  /**
   * Pre-resolved relay context (originInstanceId + active connections).
   * When set, every remoteEvent emit on this emitter skips both per-event DB
   * queries. Resolve once per session via resolveRemoteEventContext().
   */
  readonly resolvedRelayContext?: ResolvedRelayContext;
}

export type ChannelBinding<TEndpoint extends CreateApiEndpointAny> =
  (HasNoUrlParams<TEndpoint> extends true
    ? Record<never, never>
    : { readonly urlPathParams: ChannelUrlParams<TEndpoint> }) &
    (HasNoCacheKey<TEndpoint> extends true
      ? Record<never, never>
      : { readonly requestData: ChannelRequestData<TEndpoint> }) & {
      readonly kindOverride?: EmitChannelKind;
    } & EmitterOptions;

/**
 * The single trailing argument of `createEndpointEmitter`, conditional on the
 * endpoint:
 *   - endpoint with NO url params AND NO cache-key fields → the binding has no
 *     REQUIRED member (only optional kindOverride / batcher / fanOut), so the
 *     whole `channel` argument is OPTIONAL — omit it entirely, never pass `{}`.
 *   - otherwise → `channel` is REQUIRED and must carry the endpoint's url params /
 *     cache-key fields (the channel key).
 * A rest tuple so the single channel param flips optional/required; emitter
 * options (batcher/fanOut) ride on the same object, so there is never a separate
 * arg forcing an empty channel slot.
 */
export type ChannelArgs<TEndpoint extends CreateApiEndpointAny> =
  HasNoUrlParams<TEndpoint> extends true
    ? HasNoCacheKey<TEndpoint> extends true
      ? [channel?: ChannelBinding<TEndpoint>]
      : [channel: ChannelBinding<TEndpoint>]
    : [channel: ChannelBinding<TEndpoint>];

/**
 * The two channel-key fields a binding can carry. Every concrete ChannelBinding
 * is assignable to this (its fields, when present, are exactly these shapes), so
 * the emitter body reads the binding through it without a cast — `urlPathParams`
 * and `requestData` are each present only when the endpoint declares them.
 */
export interface ChannelKeyView {
  readonly urlPathParams?: Record<string, string>;
  readonly requestData?: CacheKeyParams;
  readonly kindOverride?: EmitChannelKind;
}

/**
 * Create a typed emit function bound to one endpoint channel.
 *
 * The channel is built ONCE here from `channel.urlPathParams` (routing) + the
 * includeInCacheKey fields in `channel.requestData` (scope) — the same key the
 * React Query cache uses, so server and client always match. The returned emitter
 * fires many events on that one channel; each emit carries ONLY the event's
 * declared payload (responseData/requestData/urlPathParams/payload).
 *
 * The delivery channel-kind comes from the definition's `channel.scope`
 * (user→own user/{id}, resource→shared ws-channel). `scope:"resolved"` endpoints
 * pass `channel.kindOverride` (the repository already holds the resource — no DB
 * re-read at emit time).
 *
 * Each emit delivers on all three paths simultaneously:
 *   1. Local WS (in-process or loopback to the proxy)
 *   2. Reverse-WS peers (the remote-event channel; peers subscribe)
 *   3. Direct-HTTP peers (relayed to each peer's remote-event-bridge)
 */
export function createEndpointEmitter<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  ...rest: ChannelArgs<TEndpoint>
): EndpointEmitter<TEndpoint> {
  const [channel] = rest;
  const options: EmitterOptions = channel ?? {};
  const userId = user.isPublic ? user.leadId : user.id;

  // ── Channel resolved ONCE from the binding ──────────────────────────────────
  // The call site already type-checked the binding against the concrete endpoint
  // (correct field names, correct kinds). Inside the body the endpoint is erased,
  // so we read the binding's two channel-key fields through their honest erased
  // shape — both are optional flat records buildWsChannel consumes (it keys on
  // present url params + present cache fields). The binding is a per-endpoint
  // conditional and may be omitted entirely (no-key endpoint), so default it.
  const erasedEndpoint: CreateApiEndpointAny = endpoint;
  const erasedBinding: ChannelKeyView = channel ?? {};
  const boundUrlParams: Record<string, string> =
    erasedBinding.urlPathParams ?? {};
  // urlPathParams + the includeInCacheKey requestData ARE the channel key — the
  // same key the client subscribes on. buildWsChannel keys on whichever cache
  // fields are present, so it matches a client that subscribed without them.
  const pathChannel = buildWsChannel(
    erasedEndpoint,
    boundUrlParams,
    erasedBinding.requestData,
    logger,
  );
  // kind "user"     → the owner's user-scoped channel for THIS endpoint instance
  //                   (user/{id}/ + the same canonical key — unique per endpoint
  //                   + params + user, so delivery never reaches a socket that
  //                   subscribed to a different endpoint).
  // kind "resource" → the shared ws-channel (path + params + requestData).
  // For scope:"resolved" the repository passes the resolved kind via kindOverride;
  // otherwise the definition's static scope decides.
  const kind = resolveEmitKind(endpoint, erasedBinding.kindOverride);
  const deliveryChannel =
    kind === "resource"
      ? pathChannel
      : buildUserWsChannel(
          erasedEndpoint,
          userId,
          boundUrlParams,
          erasedBinding.requestData,
          logger,
        );

  // `data` is omitted for a side-effect event that declares no request/response
  // fields (e.g. `favorite-deleted`, whose only payload is the channel's
  // urlPathParams). Those callers invoke the emitter as `emit("event-name")`, so
  // the runtime arg is genuinely absent — read every field through optional access.
  return ((eventName: string, data?: EmitDataRuntime) => {
    const envelope: AnyEndpointEventEnvelope = {
      endpointPath: endpoint.path,
      endpointMethod: endpoint.method,
      eventName,
      responseData: data?.responseData,
      requestData: data?.requestData,
      // Per-emit urlPathParams (an event may DELIVER url fields as payload) fall
      // back to the channel binding's params, which always carry the routing key.
      urlPathParams: data?.urlPathParams ?? boundUrlParams,
      payload: data?.payload,
      channel: pathChannel,
    };

    // Presence gate — skip local delivery when we can SEE there are zero local
    // subscribers. Only possible when the proxy runs in-process; across the
    // loopback POST the count is unknowable, so we always attempt delivery.
    const local = getLocalBroadcast();
    const knownEmpty =
      local !== null && local.getChannelSize(deliveryChannel) === 0;

    let delivered = false;
    if (!knownEmpty) {
      if (options?.batcher) {
        options.batcher.emit(deliveryChannel, "__event__", envelope);
      } else {
        publishWsEvent(
          {
            channel: deliveryChannel,
            event: "__event__",
            data: envelope,
          },
          logger,
          user,
        );
      }
      delivered = true;
    }

    // 2. Cross-instance relay — ONLY remoteEvents cross the wire.
    let relayed = false;
    // `!user.isPublic` narrows the JwtPayloadType union to the private variant,
    // so `user.id` is available without a cast.
    if (!user.isPublic && options?.fanOut !== false) {
      const eventsMap = endpoint.events;
      const eventDecl = eventsMap?.[eventName];
      if (eventDecl?.remoteEvent === true) {
        const remoteEvent: RemoteEventRelayPayload<AnyEndpointEventEnvelope> = {
          userId: user.id,
          logger,
          syncDomain: eventDecl.syncDomain,
          envelope,
          targetInstanceId: options?.targetInstanceId,
          resolvedRelayContext: options?.resolvedRelayContext,
        };
        void import("next-vibe/realtime/remote-event-bridge/repository").then(
          ({ RemoteEventBridgeRepository }) =>
            RemoteEventBridgeRepository.pushRemoteEvent(remoteEvent),
        );
        relayed = true;
      }
    }

    return {
      delivered,
      relayed,
      dropped: !delivered && !relayed,
    } satisfies EmitResult;
    // Irreducible impl→facade boundary: one runtime function (EmitDataRuntime →
    // EmitResult) cannot be statically assigned to EmitEventNamed, which is a
    // UNION of per-event overloads. TypeScript has no way to widen a single
    // signature to an overload union, so this is the one place the erased impl is
    // re-typed as its typed facade — through `any` per the standard pattern.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as EndpointEmitter<TEndpoint>;
}

/**
 * Resolve the ChannelKind for an emitter. Precedence:
 *   1. the binding's `kindOverride` — supplied by a `scope:"resolved"`
 *      repository that already holds the resource and knows owner-vs-public.
 *   2. else the definition's static `channel.scope`: "resource" → shared channel,
 *      "user" → the owner's own channel.
 *
 * A `scope:"resolved"` endpoint that omits `kindOverride` falls back to "user" —
 * the safe, owner-private channel — so a missing decision never leaks to a shared
 * channel, and the omission surfaces in review/tests rather than as a leak.
 */
function resolveEmitKind(
  endpoint: CreateApiEndpointAny,
  kindOverride: EmitChannelKind | undefined,
): EmitChannelKind {
  if (kindOverride) {
    return kindOverride;
  }
  return endpoint.channel?.scope === "resource" ? "resource" : "user";
}
