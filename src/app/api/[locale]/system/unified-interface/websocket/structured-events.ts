import type { z } from "zod";

import type { SyncDomain } from "@/app/api/[locale]/remote-connection/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { AgentEnvAvailability } from "../../../agent/env-availability";

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

type ArrayItem<T> =
  T extends ReadonlyArray<infer U> ? U : T extends Array<infer U> ? U : T;

/**
 * Nested field spec: maps top-level response keys to sub-field arrays (for
 * array fields) or `true` (to include the field as-is).
 */
export type NestedFieldSpec<TResponseOutput> = {
  readonly [K in keyof TResponseOutput]?:
    | readonly (keyof ArrayItem<TResponseOutput[K]>)[]
    | true;
};

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

export type EventPayload<
  TResponseOutput,
  TFields extends
    | readonly (keyof TResponseOutput)[]
    | NestedFieldSpec<TResponseOutput>,
> = TFields extends readonly (keyof TResponseOutput)[]
  ? Pick<TResponseOutput, TFields[number]>
  : TFields extends NestedFieldSpec<TResponseOutput>
    ? NestedEventPayload<TResponseOutput, TFields>
    : never;

// ============================================================================
// EVENT OPERATION
// ============================================================================

export type EventOperation = "merge" | "append" | "remove";

// ============================================================================
// EVENT HANDLER CONTEXT
// ============================================================================

/**
 * Ctx passed to onEvent callbacks and remote event handlers.
 * Each field typed from its own independent source — never mixed:
 *   responseData  → responseFields → ResponseOutput
 *   requestData   → requestFields  → RequestOutput
 *   urlPathParams → urlPathParamsFields → UrlVariablesOutput
 *   payload       → payloadType zod schema (separate; not folded into the others)
 */
export interface EndpointEventHandlerContext<
  TResponseData,
  TRequestData,
  TUrlPathParams,
  TPayload = never,
> {
  responseData: TResponseData;
  requestData: TRequestData;
  urlPathParams: TUrlPathParams;

  payload: TPayload;
  logger: EndpointLogger;
  user: JwtPayloadType;
  locale: CountryLanguage;
  isServer?: boolean;
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
// Instead the value is a plain structural shape: the four field specs carry their
// real constraint types; onEvent accepts the FULL output types + `any` payload
// (so an author may reference any field at the constraint level). The actual
// per-event payloads flow from the `const TEvents` literal createEndpoint
// captures, read field-by-field by ComputeEventPayloads — never from this map.
// ============================================================================

export interface EndpointEventsMap<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
> {
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
    // oxlint-disable-next-line no-explicit-any
    readonly payloadType?: z.ZodType<any>;
    onEvent?(
      ctx: EndpointEventHandlerContext<
        TResponseOutput,
        TRequestOutput,
        TUrlVariablesOutput,
        // oxlint-disable-next-line no-explicit-any
        any
      >,
    ): void | Promise<void>;
  };
}

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

export type _EventResponsePayload<TResponseOutput, TEventDecl> =
  TEventDecl extends { responseFields: infer TSpec }
    ? // Use Extract to isolate each branch without distributing the union
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

// Helper used by per-endpoint emitter modules to build per-event overloads.
// Converts a union of function types to an intersection — producing TypeScript
// call-signature overloads from a distributive union (one fn per event key).
export type _UnionToIntersection<U> = (
  U extends infer V ? (_: V) => void : never
) extends (_: infer I) => void
  ? I
  : never;

type _IsNever<T> = [T] extends [never] ? true : false;
type _IsEmptyRecord<T> = [keyof T] extends [never] ? true : false;
type _RequiredIf<T> =
  _IsNever<T> extends true
    ? Record<never, never>
    : _IsEmptyRecord<T> extends true
      ? Record<never, never>
      : { readonly [_ in keyof T]: T[_] };

export type EmitData<TRes, TReq, TUrl, TPay> =
  (keyof _RequiredIf<TRes> extends never
    ? Record<never, never>
    : { responseData: TRes }) &
    (keyof _RequiredIf<TReq> extends never
      ? Record<never, never>
      : { requestData: TReq }) &
    (keyof _RequiredIf<TUrl> extends never
      ? Record<never, never>
      : { urlPathParams: TUrl }) &
    (_IsNever<TPay> extends true ? Record<never, never> : { payload: TPay });

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
) => void;

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
      ) => void
    : _UnionToIntersection<
        {
          [K in _SharedKeys<
            TResponsePayloads,
            TRequestPayloads,
            TUrlPayloads,
            TPayloadTypes
          >]: (
            event: K,
            data: EmitData<
              TResponsePayloads[K],
              TRequestPayloads[K],
              TUrlPayloads[K],
              TPayloadTypes[K]
            >,
          ) => void;
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

export function eventDeclarationHasFields<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
>(
  declaration: EndpointEventDeclaration<
    TResponseOutput,
    TRequestOutput,
    TUrlVariablesOutput
  >,
): boolean {
  if (declaration.responseFields === undefined) {
    return false;
  }
  const fields = declaration.responseFields as
    | readonly (keyof TResponseOutput)[]
    | Record<string, boolean | readonly string[]>;
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
