/**
 * Realtime surface of a route handler: websocket channel resolution and
 * cross-instance remote-event handlers.
 *
 * Split out of `handler.ts` because it is OPTIONAL. An install that ships no
 * websocket server and no remote-event bridge (CLI/MCP-only builds) never
 * declares `channel`, `resolveChannel` or `onRemoteEvent` on any route, and the
 * ~250 lines of type machinery that enforce those declarations are dead weight
 * it would otherwise have to carry — or fork `handler.ts` to remove.
 *
 * These are TYPES ONLY: there is no runtime here, so importing this module costs
 * nothing at execution time. `handler.ts` consumes exactly three of them —
 * `ChannelResolverField`, `OnRemoteEventField` and `RealtimeHandlerFields` — and
 * composes them into its config/return types by intersection. A build without
 * realtime substitutes empty object types for those three and `handler.ts`
 * itself needs no edit.
 */

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { HasClientDeliveredEventsOf } from "../../realtime/core/structured-events";
import type { CacheKeyRequestInput } from "../../unified-ui/hooks/query-key-builder";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import type { WidgetData } from "../utils/json";

/**
 * The channel an endpoint's events ride on, decided per (resource, identity) at
 * runtime — NOT a static convention. Returned by `resolveChannel`.
 *
 *   - `user`     — deliver on / admit to the identity's own user-scoped channel
 *                  for this endpoint instance (`user/{id}/ws-…`).
 *                  The identity IS the authorization boundary; nothing shared.
 *                  Owner-private resources (the caller's own list/thread/skill).
 *   - `resource` — deliver on / admit to the shared `buildWsChannel` channel
 *                  (path + urlPathParams + keyBy requestData). Many identities
 *                  may share it; admission is whatever `resolveChannel` allows.
 *                  Public or shared resources.
 *   - `deny`     — no channel; the subscriber is rejected and the emit is dropped
 *                  for this identity.
 *
 * The resolver returns *intent* (a kind), never a channel string — the framework
 * builds the concrete channel (`buildUserWsChannel` / `buildWsChannel`) from the
 * kind so emit-side and subscribe-side construct byte-identical channels and
 * cannot drift.
 */
export type ChannelKind = "user" | "resource" | "deny";

/** A channel decision. A discriminated object so future kinds can carry data. */
export interface ChannelDecision {
  readonly kind: ChannelKind;
}

/**
 * Context handed to `resolveChannel`. Carries the exact tuple the channel is
 * keyed on — `urlPathParams` (typed) and `requestData` (the `includeInCacheKey`
 * request fields, typed via CacheKeyRequestData) — so the resolver authorizes
 * against the same identity the channel is built from, with no string parsing.
 *
 * Called in two contexts with the SAME logic:
 *   - emit-side, `user` = the resource owner → picks the delivery channel.
 *   - subscribe-side, `user` = the prospective subscriber → admit iff the
 *     resolved channel equals the one they asked to join.
 */
export type ChannelResolverFn<TEndpoint extends CreateApiEndpointAny> = {
  bivarianceHack(params: {
    user: JwtPayloadType;
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
    requestData: CacheKeyRequestInput<TEndpoint>;
    logger: EndpointLogger;
    locale: CountryLanguage;
  }): Promise<ChannelDecision> | ChannelDecision;
}["bivarianceHack"];

/**
 * Context passed to onRemoteEvent handlers — the non-data fields.
 * urlPathParams has been moved into the per-handler props (typed per-event).
 *
 * `user` is `JwtPrivatePayloadType` — a remote event is always a server-to-server
 * dispatch on behalf of an AUTHENTICATED user. The dispatch path enforces this:
 * a non-authenticated origin is rejected before any handler runs.
 */
export interface RemoteEventContext {
  /** THIS instance's configured id (self). */
  readonly instanceId: string;
  /**
   * The SENDING instance's id as stamped on the bridge wire. Instance names
   * are globally consistent (the echo-guard relies on the same invariant), so
   * appliers use this directly as the origin label for mirror rows.
   */
  readonly originInstanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}

type NeverToUndefined<T> = [T] extends [never] ? undefined : T;

/** Props passed to each onRemoteEvent handler. K narrows requestData/responseData to the event's payload. */
export interface RemoteEventHandlerProps<
  TEndpoint extends CreateApiEndpointAny,
  K extends keyof TEndpoint["types"]["Events"] =
    keyof TEndpoint["types"]["Events"],
> {
  readonly responseData: NeverToUndefined<
    TEndpoint["types"]["EventResponsePayloads"][K &
      keyof TEndpoint["types"]["EventResponsePayloads"]]
  >;
  readonly requestData: NeverToUndefined<
    TEndpoint["types"]["EventRequestPayloads"][K &
      keyof TEndpoint["types"]["EventRequestPayloads"]]
  >;
  readonly urlPathParams: NeverToUndefined<
    TEndpoint["types"]["EventUrlPayloads"][K &
      keyof TEndpoint["types"]["EventUrlPayloads"]]
  >;
  readonly payload: NeverToUndefined<
    TEndpoint["types"]["EventPayloadTypes"][K &
      keyof TEndpoint["types"]["EventPayloadTypes"]]
  >;
  readonly instanceId: string;
  /** The SENDING instance's id (globally-consistent name) — see RemoteEventContext. */
  readonly originInstanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}

/**
 * Map of server-side remote event handlers, keyed by event name.
 * Only events declared with `remoteEvent: true` on the definition are valid keys.
 *
 * Each handler is declared via a method declaration (`bivarianceHack`) for the
 * same reason ChannelResolverFn is: a route's CONCRETE handler — props narrowed
 * to its own endpoint and event name — must stay assignable to the type-erased
 * `OnRemoteEventMap<CreateApiEndpointAny>` the registries consume. Plain function
 * properties are contravariant in their params under strictFunctionTypes, which
 * would reject every concrete route at that erased boundary; method params are
 * bivariant, which is the variance we want here.
 */
export type OnRemoteEventMap<TEndpoint extends CreateApiEndpointAny> = {
  [K in keyof TEndpoint["types"]["Events"] as TEndpoint["types"]["Events"][K] extends {
    remoteEvent: true;
  }
    ? K
    : never]: {
    bivarianceHack(
      props: RemoteEventHandlerProps<
        TEndpoint,
        K & keyof TEndpoint["types"]["Events"]
      >,
    ): Promise<void> | void;
  }["bivarianceHack"];
};

/**
 * The props a relayed event carries at the DISPATCH boundary, in wire shape.
 *
 * `OnRemoteEventMap<CreateApiEndpointAny>` is not usable for dispatch: the erased
 * endpoint has `TEvents = any`, so its per-event payload types collapse and no
 * concrete envelope satisfies them. The bridge parses the envelope against the
 * event declaration's schemas and hands handlers exactly this shape instead —
 * the same data, typed as what actually came off the wire.
 *
 * The four payload fields are `WidgetData` — the JSON union — rather than a
 * record: an event that declares no `responseFields` types its handler's
 * `responseData` as `undefined`, and only the union that already spans both a
 * parsed record and `undefined` can describe every declared handler at once.
 * Handlers still see their own precise types; this is only the erased view the
 * registry dispatches through.
 */
export interface RemoteEventDispatchProps {
  readonly responseData: WidgetData;
  readonly requestData: WidgetData;
  readonly urlPathParams: WidgetData;
  readonly payload: WidgetData;
  readonly instanceId: string;
  readonly originInstanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}

/**
 * A route's `onRemoteEvent` as the registry consumes it — keyed by event name,
 * props erased to wire shape. Handlers are declared as methods (`bivarianceHack`)
 * so a route's CONCRETE map assigns here: its narrower per-event props relate to
 * the wire shape in one direction, which bivariance accepts. Same trick, and same
 * reason, as ChannelResolverFn.
 */
export type OnRemoteEventDispatchMap = Record<
  string,
  {
    bivarianceHack(props: RemoteEventDispatchProps): Promise<void> | void;
  }["bivarianceHack"]
>;

type _IsAnyEvents<T> = 0 extends 1 & T ? true : false;

/** True when TEndpoint has at least one remoteEvent: true event. */
type HasRemoteEvents<TEndpoint extends CreateApiEndpointAny> =
  _IsAnyEvents<TEndpoint["types"]["Events"]> extends true
    ? boolean
    : keyof {
          [K in keyof TEndpoint["types"]["Events"] as TEndpoint["types"]["Events"][K] extends {
            remoteEvent: true;
          }
            ? K
            : never]: true;
        } extends never
      ? false
      : true;

/** Requires onRemoteEvent when the endpoint declares remoteEvent: true events; forbids it otherwise. */
export type OnRemoteEventField<TEndpoint extends CreateApiEndpointAny> =
  HasRemoteEvents<TEndpoint> extends true
    ? { onRemoteEvent: OnRemoteEventMap<TEndpoint> }
    : HasRemoteEvents<TEndpoint> extends boolean
      ? { onRemoteEvent?: OnRemoteEventMap<TEndpoint> }
      : { onRemoteEvent?: never };

/**
 * True when TEndpoint declares at least one CLIENT-DELIVERED event. Delegates to
 * the single source of truth (HasClientDeliveredEventsOf) so the route's
 * resolveChannel obligation and the definition's channel obligation are derived
 * from the same classifier.
 */
type HasClientDeliveredEvents<TEndpoint extends CreateApiEndpointAny> =
  HasClientDeliveredEventsOf<TEndpoint["types"]["Events"]>;

/** The declared channel scope, or undefined when no `channel` is declared. */
type ScopeOf<TEndpoint extends CreateApiEndpointAny> =
  TEndpoint["types"]["Channel"] extends { scope: infer S } ? S : undefined;

/**
 * Forces a readable compile error when an endpoint has client-delivered events
 * but no `channel` declaration on its definition. The route field becomes a
 * branded never-ish requirement that no value satisfies, with the brand string
 * naming the fix.
 */
export interface MissingChannelDeclaration {
  readonly __error: "This method emits client-delivered events but its definition has no `channel` declaration. Add `channel: { scope: 'user' | 'resource' | 'resolved' }` to the definition.";
}

/**
 * Requires `resolveChannel` exactly when the definition's channel scope needs
 * server-side logic, and FORBIDS it when the definition already decided the
 * channel. This is the TYPE-LEVEL enforcement of the fail-closed model — derived
 * from the definition's `channel.scope`, on the emitting method, with no
 * generator round-trip:
 *
 *   scope "user"              → resolveChannel forbidden (definition decided it).
 *   scope "resource"/"resolved" → resolveChannel REQUIRED.
 *   client events, no channel → MissingChannelDeclaration (unsatisfiable → error).
 *   abstract (any)            → optional (keeps GenericHandlerReturnType assignable).
 *
 * `resolveChannel` subsumes the old `canSubscribe`: it both authorizes a
 * subscription AND decides the channel an event rides on, from one declaration,
 * so emit-side delivery and subscribe-side admission can never disagree.
 */
export type ChannelResolverField<TEndpoint extends CreateApiEndpointAny> =
  HasClientDeliveredEvents<TEndpoint> extends true
    ? ScopeOf<TEndpoint> extends "user"
      ? { resolveChannel?: never }
      : ScopeOf<TEndpoint> extends "resource" | "resolved"
        ? { resolveChannel: ChannelResolverFn<TEndpoint> }
        : { resolveChannel: MissingChannelDeclaration }
    : HasClientDeliveredEvents<TEndpoint> extends boolean
      ? { resolveChannel?: ChannelResolverFn<TEndpoint> }
      : { resolveChannel?: never };

/**
 * The realtime fields as they appear on a CONSTRUCTED handler (the runtime
 * object), as opposed to on its input config. Both are optional here because the
 * dispatcher checks presence at runtime; author-time exhaustiveness is enforced
 * on the input side via `ChannelResolverField` / `OnRemoteEventField`.
 */
export interface RealtimeHandlerFields<TEndpoint extends CreateApiEndpointAny> {
  resolveChannel?: ChannelResolverFn<TEndpoint>;
  onRemoteEvent?: OnRemoteEventMap<TEndpoint>;
}
