import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UserRoleValue } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { z } from "zod";

import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { SyncDomain } from "@/app/api/[locale]/remote-connection/db";

// ============================================================================
// DEEP PARTIAL
// ============================================================================

export type DeepPartial<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  ? T
  : T extends readonly (infer U)[]
    ? ReadonlyArray<DeepPartial<U>>
    : { [K in keyof T]?: DeepPartial<T[K]> };

// ============================================================================
// FIELD SPEC HELPERS
// ============================================================================

type NestedEventPayload<TResponseOutput, TSpec> = {
  readonly [K in keyof TSpec &
    keyof TResponseOutput]: TSpec[K] extends ReadonlyArray<infer SF>
    ? TResponseOutput[K] extends ReadonlyArray<infer U>
      ? Array<Pick<U, SF extends keyof U ? SF : never>>
      : TResponseOutput[K] extends Array<infer U>
        ? Array<Pick<U, SF extends keyof U ? SF : never>>
        : TResponseOutput[K]
    : TResponseOutput[K];
};

/**
 * Nested responseFields spec: per response-key, the sub-fields to project from
 * that key's element type. `{ messages: ["id", "content"] }` picks id+content
 * from each item of `responseData.messages`. Keys are constrained to
 * `keyof TResponseOutput`; each value is a readonly array of that key's item's
 * own keys. Fully inferred — the concrete literal spec drives NestedEventPayload.
 */
type NestedFieldSpec<TResponseOutput> = {
  readonly [K in keyof TResponseOutput]?: readonly PropertyKey[];
};

// ============================================================================
// EVENT OPERATION
// ============================================================================

/**
 * The mutation/action an event represents — drives cache-update semantics on the
 * client (append → add, merge → patch, remove → delete) plus non-cache signals
 * (listen/status/check/retry/send/tunnel).
 */
type EventOperation =
  | "append"
  | "merge"
  | "remove"
  | "check"
  | "listen"
  | "retry"
  | "send"
  | "status"
  | "tunnel";

// ============================================================================
// EVENT HANDLER CONTEXT
// ============================================================================

/**
 * The context passed to an event's `onEvent` handler. The four payload generics
 * carry the exact per-event projected types (from responseFields/requestFields/
 * urlPathParamsFields/payloadType), so `ctx.responseData.x` etc. infer concretely
 * with no widening. Framework members (user/logger/locale/envAvailability) are
 * the same as any route handler's context.
 */
interface EndpointEventHandlerContext<
  TResponseData,
  TRequestData,
  TUrlPathParams,
  TPayload,
> {
  readonly responseData: TResponseData;
  readonly requestData: TRequestData;
  readonly urlPathParams: TUrlPathParams;
  readonly payload: TPayload;
  readonly user: JwtPayloadType;
  readonly logger: EndpointLogger;
  readonly locale: CountryLanguage;
  readonly agentEnvAvailability: AgentEnvAvailability;
}

// ============================================================================
// EVENT DECLARATION
//
// Four independent payload generics — one per source field:
//   TResFields     — responseFields  (flat key array OR nested spec) → responseData
//   TReqFields     — requestFields   (flat key array) → requestData
//   TUrlFields     — urlPathParamsFields (flat key array) → urlPathParams
//   TPayloadSchema — payloadType (zod schema) → payload
//
// Each is computed independently from its own Output type.
// NOT used as EndpointEventsMap value type — see below.
// ============================================================================

export interface EndpointEventDeclaration<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
  TResFields extends
    | readonly (keyof TResponseOutput)[]
    | NestedFieldSpec<TResponseOutput>
    | undefined = undefined,
  TReqFields extends readonly (keyof TRequestOutput)[] | undefined = undefined,
  TUrlFields extends readonly (keyof TUrlVariablesOutput)[] | undefined =
    undefined,
  TPayloadSchema extends z.ZodTypeAny | undefined = undefined,
> {
  readonly responseFields?: TResFields;
  readonly requestFields?: TReqFields;
  readonly urlPathParamsFields?: TUrlFields;
  readonly operation?: EventOperation;
  readonly clientDelivery?: false;
  readonly remoteEvent?: true;
  readonly syncDomain?: SyncDomain;
  readonly allowedRoles?: readonly UserRoleValue[];
  readonly payloadType?: TPayloadSchema;
  onEvent?(
    ctx: EndpointEventHandlerContext<
      TResFields extends NestedFieldSpec<TResponseOutput>
        ? NestedEventPayload<TResponseOutput, TResFields>
        : TResFields extends readonly (keyof TResponseOutput)[]
          ? Pick<TResponseOutput, TResFields[number]>
          : Record<never, never>,
      TReqFields extends readonly (keyof TRequestOutput)[]
        ? Pick<TRequestOutput, TReqFields[number]>
        : Record<never, never>,
      TUrlFields extends readonly (keyof TUrlVariablesOutput)[]
        ? Pick<TUrlVariablesOutput, TUrlFields[number]>
        : TUrlVariablesOutput,
      TPayloadSchema extends z.ZodTypeAny ? z.infer<TPayloadSchema> : never
    >,
  ): void | Promise<void>;
}

// ============================================================================
// EVENTS MAP
//
// Structural constraint for the events config passed to createEndpoint().
// Intentionally NOT `Record<string, EndpointEventDeclaration<…wide…>>`: a value
// type carrying the declaration's wide field generics contextually types every
// onEvent with those wide generics, which makes the per-event narrowing
// (EventResponsePayloads / EventRequestPayloads, read by RemoteEventHandlerProps)
// collapse to `never`/`undefined` via distributive conditionals.
//
// Self-referential mapped type: `const TEvents extends EndpointEventsMap<R,Q,U,TEvents>`.
// TypeScript resolves the circularity by evaluating the constraint per-key against
// the inferred TEvents literal — each entry's `onEvent` payload is contextually
// typed from that same entry's `payloadType` field.
// ============================================================================

// Upper-bound shape for TEvents. onEvent uses any for all context fields so
// the upper bound is structurally compatible with any concrete handler.
// The concrete contextual type (TRequestOutput etc.) comes from the `extends`
// constraint EndpointEventsMap<R,Q,U,TEvents> in createEndpoint's generic.
export interface EndpointEventsMapBase {
  [K: string]: {
    // oxlint-disable-next-line no-explicit-any
    readonly responseFields?: readonly any[] | Record<string, any>;
    // oxlint-disable-next-line no-explicit-any
    readonly requestFields?: readonly any[];
    // oxlint-disable-next-line no-explicit-any
    readonly urlPathParamsFields?: readonly any[];
    readonly operation?: EventOperation;
    readonly clientDelivery?: false;
    readonly remoteEvent?: true;
    readonly syncDomain?: SyncDomain;
    readonly allowedRoles?: readonly UserRoleValue[];
    readonly payloadType?: z.ZodTypeAny;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEvent?(
      // oxlint-disable-next-line no-explicit-any
      ctx: EndpointEventHandlerContext<never, never, never, any>,
    ): void | Promise<void>;
  };
}

// Self-referential mapped constraint. Each entry's onEvent payload is narrowed
// to `z.output<TEntry["payloadType"]>` via the TEvents[K] lookup — TypeScript
// resolves this after inferring TEvents from the call-site literal.
export type EndpointEventsMap<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
  TEvents extends EndpointEventsMapBase = EndpointEventsMapBase,
> = {
  [K in keyof TEvents]: {
    // oxlint-disable-next-line no-explicit-any
    readonly responseFields?: readonly any[] | Record<string, any>;
    // oxlint-disable-next-line no-explicit-any
    readonly requestFields?: readonly any[];
    // oxlint-disable-next-line no-explicit-any
    readonly urlPathParamsFields?: readonly any[];
    readonly operation?: EventOperation;
    readonly clientDelivery?: false;
    readonly remoteEvent?: true;
    readonly syncDomain?: SyncDomain;
    readonly allowedRoles?: readonly UserRoleValue[];
    readonly payloadType?: z.ZodTypeAny;
    onEvent?(
      ctx: EndpointEventHandlerContext<
        TResponseOutput,
        TRequestOutput,
        TUrlVariablesOutput,
        TEvents[K] extends { payloadType?: infer S }
          ? Exclude<S, undefined> extends z.ZodTypeAny
            ? z.output<Exclude<S, undefined>>
            : never
          : never
      >,
    ): void | Promise<void>;
  };
};

/**
 * Overlays per-entry payload inference onto an events map for use as the
 * contextual type of the `events` config field in createEndpoint. Each entry's
 * `onEvent` payload is narrowed to `z.output<TEvents[K]["payloadType"]>` while
 * all other fields remain structurally compatible with `EndpointEventsMap`.
 *
 * Used internally by ChannelConfigField — not needed at call-sites.
 */
export type WithPayloadCtx<
  TEvents,
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
> = {
  [K in keyof TEvents]: {
    onEvent?(
      ctx: EndpointEventHandlerContext<
        TResponseOutput,
        TRequestOutput,
        TUrlVariablesOutput,
        TEvents[K] extends { payloadType?: infer S extends z.ZodTypeAny }
          ? z.output<S>
          : never
      >,
    ): void | Promise<void>;
  };
};

// ============================================================================
// CHANNEL DECLARATION
//
// One declaration on the definition states WHERE an endpoint's events ride and
// HOW MUCH server code the route must supply. It is the readable, single-place
// answer to "who can hear these events?" — paired with `events` on the same
// definition. The route only writes code for the case that genuinely needs the
// database (scope: "resolved").
//
// The channel KEY SPACE is fully inferred — never declared. Every channel is
// built by `buildWsChannel(endpoint, urlPathParams, requestData)` from
// `UrlVariablesOutput` + `CacheKeyRequestData<TEndpoint>` (the includeInCacheKey
// request fields) — the exact same key the React Query cache uses. The ONLY
// per-endpoint decision is whether the user id ALSO partitions the channel:
//
//   scope: "user"     — channel is identity-partitioned: delivered on
//                       `user/{id}`. The identity IS the boundary. No route code
//                       (the type FORBIDS resolveChannel). The common case.
//   scope: "resource" — channel is the shared `buildWsChannel` key, WITHOUT a
//                       user id. Many identities share it. The route supplies a
//                       resolveChannel returning `resource` (admit) or `deny`.
//   scope: "resolved" — include-user-id-or-not decided per resource row at
//                       runtime. The route MUST supply resolveChannel returning
//                       `user` (owner → +userId) | `resource` (public → shared)
//                       | `deny`.
//
// So `{kind:"user"}` vs `{kind:"resource"}` is exactly "does the user id join the
// inferred channel key?" — nothing more to configure.
// ============================================================================

/**
 * WHERE an endpoint's events ride and how much server code the route must supply:
 *   "user"     — identity-partitioned channel (`user/{id}`); no route code.
 *   "resource" — shared channel key without user id; route supplies resolveChannel.
 *   "resolved" — decided per resource row at runtime; route MUST resolveChannel.
 */
type ChannelScope = "user" | "resource" | "resolved";

/**
 * The `channel` declaration on a definition. `scope` is the whole declaration —
 * it drives the route's type obligation (see ChannelResolverField in
 * route/handler.ts). The channel key itself is inferred from the endpoint; there
 * is nothing else to configure.
 */
export interface ChannelDeclaration {
  readonly scope: ChannelScope;
}

/** True only for the `any` type (the erased events map). */
type IsAnyEventsMap<T> = 0 extends 1 & T ? true : false;

/**
 * Classifies an events map by whether it has a CLIENT-DELIVERED event — one
 * whose declaration is not `{ clientDelivery: false }`. A client-delivered event
 * creates a subscribable WS channel, which is exactly what obligates a `channel`
 * declaration (on the definition) and a `resolveChannel` (on the route).
 *
 *   true    — at least one CONCRETE client-delivered event key.
 *   false   — no events, or every event is `clientDelivery: false`.
 *   boolean — ABSTRACT: either `any`, or the wide default whose keys are only an
 *             index signature (`string extends keyof TEvents`) — i.e. `events`
 *             was omitted, so TEvents is the unconstrained EndpointEventsMap.
 *             Presence is unknown; callers treat it as "optional" so plain
 *             endpoints get no channel/resolveChannel obligation and generic base
 *             types stay assignable.
 *
 * Single source of truth, read by both the definition config (createEndpoint
 * requires `channel` when true) and the route field (ChannelResolverField).
 */
export type HasClientDeliveredEventsOf<TEvents> =
  IsAnyEventsMap<TEvents> extends true
    ? boolean
    : string extends keyof TEvents
      ? boolean
      : keyof {
            [K in keyof TEvents as TEvents[K] extends { clientDelivery: false }
              ? never
              : K]: true;
          } extends never
        ? false
        : true;

// ============================================================================
// DERIVED MAP TYPES
//
// ComputeEventPayloads reads from the stored literal TEvents[K] via
// `extends { field: infer X }` conditionals. This works because createEndpoint
// captures `const TEvents` which preserves all literal types.
//
// Computed once at definition level → stored in types.EventPayloads.
// All consumers read TEndpoint["types"]["EventPayloads"][K] directly.
//
// Priority: payloadType → requestFields (+responseFields) → nested responseFields → flat responseFields → {}
// ============================================================================

// ============================================================================
// PER-SOURCE EVENT PAYLOAD MAPS
//
// Four separate fields, four separate computed maps. Each stored independently
// in types. Consumers read the specific map they need — never mixed.
//
//   responseData  → EventResponsePayloads  (responseFields → ResponseOutput)
//   requestData   → EventRequestPayloads   (requestFields  → RequestOutput)
//   urlPathParams → EventUrlPayloads       (urlPathParamsFields → UrlVariablesOutput)
//   payload       → EventPayloadTypes      (payloadType zod schema)
// ============================================================================

/** responseData per event: responseFields (nested or flat) → Record<never,never> */
// Extracts the flat-array branch from the responseFields union
// oxlint-disable-next-line no-explicit-any
type _ExtractArraySpec<TSpec> = Extract<TSpec, ReadonlyArray<any>>;
// Extracts the nested-object branch — anything NOT a readonly array
// oxlint-disable-next-line no-explicit-any
type _ExtractObjectSpec<TSpec> = Exclude<TSpec, ReadonlyArray<any>>;

type _FlatResponsePayload<TResponseOutput, TSpec> =
  // oxlint-disable-next-line no-explicit-any
  _ExtractArraySpec<TSpec> extends ReadonlyArray<any>
    ? _ExtractArraySpec<TSpec> extends ReadonlyArray<infer TKey>
      ? [TKey] extends [keyof TResponseOutput]
        ? Pick<TResponseOutput, TKey>
        : Record<never, never>
      : Record<never, never>
    : Record<never, never>;

type _NestedResponsePayload<TResponseOutput, TSpec> = [
  _ExtractObjectSpec<TSpec>,
] extends [never]
  ? Record<never, never>
  : NestedEventPayload<TResponseOutput, _ExtractObjectSpec<TSpec>>;

// Resolves an event's responseData payload from its responseFields spec.
type _EventResponsePayload<TResponseOutput, TArg> = TArg extends {
  responseFields: infer TSpec;
}
  ? [TSpec] extends [never]
    ? Record<never, never>
    : // Use Extract to isolate each branch without distributing the union
      [_ExtractArraySpec<TSpec>] extends [never]
      ? // No array branch → must be nested object spec
        _NestedResponsePayload<TResponseOutput, TSpec>
      : // Has array branch → flat Pick
        _FlatResponsePayload<TResponseOutput, TSpec>
  : Record<never, never>;

export type EventResponsePayloads<TResponseOutput, TEvents> = [
  TEvents,
] extends [never]
  ? // never events → index-signature so structural checks against Record<string,any> pass
    Record<string, Record<never, never>>
  : {
      // `as string extends K ? never : K` strips the [K: string] index signature from
      // EndpointEventsMap, keeping only concrete literal event keys. Without this,
      // the mapped type inherits the index signature and _IsStringIndexed triggers
      // the generic emitter fallback for all events (losing responseData typing).
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        responseFields: infer TSpec;
      }
        ? _EventResponsePayload<TResponseOutput, { responseFields: TSpec }>
        : Record<never, never>;
    };

/** requestData per event: requestFields → RequestOutput → Record<never,never> */
export type EventRequestPayloads<TRequestOutput, TEvents> = [TEvents] extends [
  never,
]
  ? Record<string, Record<never, never>>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        requestFields: infer TSpec;
      }
        ? TSpec extends readonly (keyof TRequestOutput)[]
          ? Pick<TRequestOutput, TSpec[number]>
          : Record<never, never>
        : Record<never, never>;
    };

/** urlPathParams per event: urlPathParamsFields → UrlVariablesOutput (full output if not declared) */
export type EventUrlPayloads<TUrlVariablesOutput, TEvents> = [TEvents] extends [
  never,
]
  ? Record<string, Record<never, never>>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        urlPathParamsFields: infer TSpec;
      }
        ? TSpec extends readonly (keyof TUrlVariablesOutput)[]
          ? Pick<TUrlVariablesOutput, TSpec[number]>
          : TUrlVariablesOutput
        : TUrlVariablesOutput;
    };

/**
 * Emit-side urlPathParams per event.
 * When urlPathParamsFields is declared → Pick of those fields (caller must pass them).
 * When urlPathParamsFields is absent  → full TUrlVariablesOutput (always required for channel routing).
 * All 4 fields (responseData, requestData, urlPathParams, payload) are always part of EmitData.
 */
export type EventEmitUrlPayloads<TUrlVariablesOutput, TEvents> = [
  TEvents,
] extends [never]
  ? Record<string, Record<never, never>>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        urlPathParamsFields: infer TSpec;
      }
        ? TSpec extends readonly (keyof TUrlVariablesOutput)[]
          ? Pick<TUrlVariablesOutput, TSpec[number]>
          : TUrlVariablesOutput
        : TUrlVariablesOutput;
    };

/** payload per event: payloadType zod schema → inferred type → never if not declared */
export type EventPayloadTypes<TEvents> = [TEvents] extends [never]
  ? Record<string, never>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        payloadType: infer TSchema;
      }
        ? TSchema extends z.ZodTypeAny
          ? z.infer<TSchema>
          : never
        : never;
    };

// Legacy — reads from types.payload if present, otherwise never.
export type EventPayloads<TEvents> = [TEvents] extends [never]
  ? Record<string, never>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        types: { payload: infer P };
      }
        ? P
        : never;
    };

export type EventTypes<TEvents> = [TEvents] extends [never]
  ? Record<string, never>
  : {
      [K in keyof TEvents as string extends K ? never : K]: TEvents[K] extends {
        types?:
          | {
              ResponseData: infer RD;
              RequestData: infer ReqD;
              UrlPathParams: infer UP;
            }
          | undefined;
      }
        ? { ResponseData: RD; RequestData: ReqD; UrlPathParams: UP }
        : TEvents[K] extends {
              types: {
                ResponseData: infer RD;
                RequestData: infer ReqD;
                UrlPathParams: infer UP;
              };
            }
          ? { ResponseData: RD; RequestData: ReqD; UrlPathParams: UP }
          : never;
    };

// ============================================================================
// TYPED EMIT
//
// Single-object arg. All 4 fields (responseData, requestData, urlPathParams,
// payload) — each required only when it doesn't resolve to never/Record<never,never>.
// ============================================================================

/**
 * The typed single-object arg for one emit. Each of the four event fields carries
 * its exact per-event projected type; a field that resolves to never/empty is
 * optional (via _EmitField) so `_EmitArgs` can drop it from the required set.
 * Consumers read `EmitData<…>["responseData"]` etc. directly, so the concrete
 * field type is always inferred — no widening, fully type-safe.
 */
// A field is present-and-required only when it carries real data. Empty
// (never / Record<never,never>) fields become optional so the caller may omit
// them — `emit("skill-deleted", { responseData })` with no requestData/payload.
type _EmitField<K extends string, T> = [T] extends [never]
  ? { readonly [_ in K]?: never }
  : [keyof T] extends [never]
    ? { readonly [_ in K]?: Record<never, never> }
    : { readonly [_ in K]: T };

export type EmitData<TResponseData, TRequestData, TUrlPathParams, TPayload> =
  _EmitField<"responseData", TResponseData> &
    _EmitField<"requestData", TRequestData> &
    // urlPathParams is derived from channel routing at emit time, so it is never
    // a REQUIRED emit arg — always optional (present type when the event scopes
    // to specific path fields, still omittable by the caller).
    { readonly urlPathParams?: TUrlPathParams } & _EmitField<
      "payload",
      TPayload
    >;

/**
 * Union → intersection. Turns the union of per-event emit call signatures into an
 * intersection, which TypeScript reads as an overload set — so each event key gets
 * its own precisely-typed `(event, data)` signature with no indexed-access widening.
 */
type _UnionToIntersection<U> = // oxlint-disable-next-line no-explicit-any
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

/** The channel-kind an emit rides on. Mirrors the route resolver's decision. */
export type EmitChannelKind = "user" | "resource";
export interface EmitChannelDecision {
  readonly kind: EmitChannelKind;
}

/**
 * The type-erased shape the emitter's runtime body reads — every field optional,
 * the records serialisable. The typed `EmitData` facade (per-event) guarantees
 * presence/types at the call site; inside the emitter the endpoint is erased to
 * CreateApiEndpointAny, so this is the honest runtime view (no `any`, no cast).
 */
export interface EmitDataRuntime {
  readonly responseData?: WidgetData;
  readonly requestData?: Record<string, WidgetData>;
  readonly urlPathParams?: Record<string, string>;
  readonly payload?: WidgetData;
}

/**
 * What an emit did. Lets a repository skip building expensive follow-up payloads
 * when nothing was delivered or relayed.
 *   delivered — handed to ≥1 local subscriber (or batched for delivery).
 *   relayed   — fanned out cross-instance (remoteEvent + fanOut).
 *   dropped   — neither: no local subscribers and no remote relay.
 */
export interface EmitResult {
  readonly delivered: boolean;
  readonly relayed: boolean;
  readonly dropped: boolean;
}

// Single per-event call signature — keyed on a concrete literal K.
// Used as the building block for EmitEventNamed via union-to-intersection.
// oxlint-disable-next-line no-unused-vars
type _EmitSignature<
  TResponsePayloads,
  TRequestPayloads,
  TUrlPayloads,
  TPayloadTypes,
  K extends string,
> = (
  event: K,
  data: EmitData<
    K extends keyof TResponsePayloads
      ? TResponsePayloads[K]
      : Record<never, never>,
    K extends keyof TRequestPayloads
      ? TRequestPayloads[K]
      : Record<never, never>,
    K extends keyof TUrlPayloads ? TUrlPayloads[K] : Record<never, never>,
    K extends keyof TPayloadTypes ? TPayloadTypes[K] : never
  >,
) => EmitResult;

/**
 * The argument tuple for one emit. When the event's EmitData has NO required
 * member (e.g. a side-effect event with only urlPathParamsFields, or no fields at
 * all), the `data` argument is OMITTED entirely — `emit("skill-deleted")` — never
 * called with an empty `{}`. Otherwise `data` is required.
 */
type _EmitArgs<K extends string, TData> = [
  keyof {
    [P in keyof TData as Record<never, never> extends Pick<TData, P>
      ? never
      : P]: 1;
  },
] extends [never]
  ? [event: K, data?: TData]
  : [event: K, data: TData];

// All keys shared across the four maps.
type _SharedKeys<TRes, TReq, TUrl, TPay> = keyof TRes &
  keyof TReq &
  keyof TUrl &
  keyof TPay &
  string;

// True when T has a string index signature (i.e. keyof T widens to string).
// Guards against infinite unions from wide/index-signature event maps.
// The payload maps above strip index keys via `as string extends K ? never : K`,
// so by the time we reach EmitEventNamed the payload types have only literal keys.
type _IsStringIndexed<T> = string extends keyof T ? true : false;

// Emit function type with a per-event overload for each named event.
// Uses union-to-intersection: one (event: K, data: EmitData<...K...>) signature
// per event key → intersection = TypeScript overloads.
// Callers get precise per-event payload type checking with no indexed-access widening.
//
// Guard: when TResponsePayloads has a string index signature with no concrete keys
// (truly wide/untyped maps), _SharedKeys resolves to `string` — an infinite union.
// Fall back to a generic call signature so non-typed emitter paths still compile.
//
// EAGER evaluation: per-event data is built in a mapped type (where K is a concrete
// literal key from the mapped-type iteration), NOT in a generic alias (where K would be
// a generic parameter causing TypeScript to widen TResponsePayloads[K] to the constraint).
export type EmitEventNamed<
  TResponsePayloads,
  TRequestPayloads,
  TUrlPayloads,
  TPayloadTypes,
> =
  _IsStringIndexed<TResponsePayloads> extends true
    ? // Wide/index-signature map — generic callable for non-typed emitter paths.
      <K extends string>(
        ...args: _EmitArgs<
          K,
          EmitData<
            K extends keyof TResponsePayloads
              ? TResponsePayloads[K]
              : Record<never, never>,
            K extends keyof TRequestPayloads
              ? TRequestPayloads[K]
              : Record<never, never>,
            K extends keyof TUrlPayloads
              ? TUrlPayloads[K]
              : Record<never, never>,
            K extends keyof TPayloadTypes ? TPayloadTypes[K] : never
          >
        >
      ) => EmitResult
    : _UnionToIntersection<
        {
          [K in _SharedKeys<
            TResponsePayloads,
            TRequestPayloads,
            TUrlPayloads,
            TPayloadTypes
          >]: (
            ...args: _EmitArgs<
              K,
              EmitData<
                TResponsePayloads[K],
                TRequestPayloads[K],
                TUrlPayloads[K],
                TPayloadTypes[K]
              >
            >
          ) => EmitResult;
        }[_SharedKeys<
          TResponsePayloads,
          TRequestPayloads,
          TUrlPayloads,
          TPayloadTypes
        >]
      >;

// ============================================================================
// RUNTIME HELPERS
// ============================================================================

interface _AnyEventDecl {
  // oxlint-disable-next-line no-explicit-any
  responseFields?: readonly any[] | Record<string, any>;
}

export function eventDeclarationHasFields(declaration: _AnyEventDecl): boolean {
  if (declaration.responseFields === undefined) {
    return false;
  }
  const fields = declaration.responseFields;
  if (Array.isArray(fields)) {
    return fields.length > 0;
  }
  return Object.keys(fields).length > 0;
}

// ============================================================================
// WIRE ENVELOPE (server → client)
// ============================================================================

export interface EndpointEventEnvelope<
  TResponseData,
  TRequestData,
  TUrlPathParams,
  TPayload,
> {
  readonly endpointPath: readonly string[];
  readonly endpointMethod: string;
  readonly eventName: string;
  readonly responseData: TResponseData;
  readonly requestData: TRequestData;
  readonly urlPathParams: TUrlPathParams;
  readonly payload: TPayload;
  readonly channel?: string;
}

/** Wide alias for use-sites that don't need per-field types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// oxlint-disable-next-line no-explicit-any
export type AnyEndpointEventEnvelope = EndpointEventEnvelope<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
