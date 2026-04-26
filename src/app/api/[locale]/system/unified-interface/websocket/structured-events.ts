/**
 * Definition-Driven Event Types
 *
 * Events declare which fields from ResponseOutput they carry.
 * The payload IS exactly those fields - no partial, no wrapping.
 * Types are computed once in createEndpoint and stored in types.EventPayloads.
 */

import type { QueryClient } from "@tanstack/react-query";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { EndpointLogger } from "../shared/logger/endpoint";

// ============================================================================
// DEEP PARTIAL - used only internally by cache-merger
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
// EVENT PAYLOAD - derived from declared fields, computed once on definition
// ============================================================================

type ArrayItem<T> =
  T extends ReadonlyArray<infer U> ? U : T extends Array<infer U> ? U : T;

/**
 * Nested field spec: maps top-level response keys to sub-field tuples for
 * array fields, or `true` for scalar/object fields to include as-is.
 */
export type NestedFieldSpec<TResponseOutput> = {
  readonly [K in keyof TResponseOutput]?:
    | readonly (keyof ArrayItem<TResponseOutput[K]>)[]
    | true;
};

/**
 * Derive the payload type from a nested field spec.
 * - Array key with sub-fields → Array<Pick<Item, subfields>>
 * - Key with `true` → the full field type
 */
type NestedEventPayload<
  TResponseOutput,
  TSpec extends NestedFieldSpec<TResponseOutput>,
> = {
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
 * Compute the payload type for an event from its declared fields.
 * Flat:   fields: ["audioData", "chunkIndex"] → Pick<Response, "audioData" | "chunkIndex">
 * Nested: fields: { messages: ["id", "content"], streamingState: true }
 *         → { messages: Array<Pick<Message, "id"|"content">>, streamingState: ... }
 */
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

/**
 * Compute EventPayload for every event in the map - stored once on types.EventPayloads.
 */
export type ComputeEventPayloads<
  TResponseOutput,
  TEvents extends EndpointEventsMap<TResponseOutput>,
> = {
  [K in keyof TEvents]: TEvents[K] extends { fields: infer F }
    ? F extends
        | readonly (keyof TResponseOutput)[]
        | NestedFieldSpec<TResponseOutput>
      ? EventPayload<TResponseOutput, F>
      : { readonly [key: string]: never }
    : { readonly [key: string]: never };
};

// ============================================================================
// OPERATION
// ============================================================================

export type EventOperation = "merge" | "append" | "remove";

// ============================================================================
// EVENT HANDLER CONTEXT
// ============================================================================

/**
 * Context passed to onEvent callbacks. The `partial` field is typed as the
 * event's declared payload - computed from fields via ComputeEventPayloads
 * and indexed per event name.
 *
 * For the single-event declaration interfaces below, `partial` is typed as
 * a safe structural subset of TResponseOutput. The precise per-event type
 * flows from types.EventPayloads[K] at the subscription hook level.
 */
export interface EndpointEventHandlerContext<
  TResponseOutput,
  TRequestOutput = Record<string, WidgetData>,
> {
  partial: { readonly [K in keyof TResponseOutput]?: TResponseOutput[K] };
  urlPathParams: { readonly [K in string]: string };
  requestData: TRequestOutput;
  queryClient: QueryClient;
  logger: EndpointLogger;
}

// ============================================================================
// SINGLE EVENT DECLARATION
// ============================================================================

export interface EndpointEventDeclarationWithFlatFields<
  TResponseOutput,
  TFields extends readonly [
    keyof TResponseOutput,
    ...(keyof TResponseOutput)[],
  ],
  TRequestOutput = Record<string, WidgetData>,
> {
  readonly fields: TFields;
  readonly operation: EventOperation;
  onEvent?(
    ctx: EndpointEventHandlerContext<TResponseOutput, TRequestOutput>,
  ): void | Promise<void>;
}

export interface EndpointEventDeclarationWithNestedFields<
  TResponseOutput,
  TSpec extends NestedFieldSpec<TResponseOutput>,
  TRequestOutput = Record<string, WidgetData>,
> {
  readonly fields: TSpec;
  readonly operation: EventOperation;
  onEvent?(
    ctx: EndpointEventHandlerContext<TResponseOutput, TRequestOutput>,
  ): void | Promise<void>;
}

export interface EndpointEventDeclarationSideEffect<
  TResponseOutput,
  TRequestOutput = Record<string, WidgetData>,
> {
  onEvent(
    ctx: EndpointEventHandlerContext<TResponseOutput, TRequestOutput>,
  ): void | Promise<void>;
  readonly fields?: undefined;
  readonly operation?: undefined;
}

export type EndpointEventDeclaration<
  TResponseOutput,
  TRequestOutput = Record<string, WidgetData>,
> =
  | EndpointEventDeclarationWithFlatFields<
      TResponseOutput,
      readonly [keyof TResponseOutput, ...(keyof TResponseOutput)[]],
      TRequestOutput
    >
  | EndpointEventDeclarationWithNestedFields<
      TResponseOutput,
      NestedFieldSpec<TResponseOutput>,
      TRequestOutput
    >
  | EndpointEventDeclarationSideEffect<TResponseOutput, TRequestOutput>;

// ============================================================================
// EVENTS MAP
// ============================================================================

export interface EndpointEventsMap<
  TResponseOutput,
  TRequestOutput = Record<string, WidgetData>,
> {
  [K: string]: EndpointEventDeclaration<TResponseOutput, TRequestOutput>;
}

// ============================================================================
// TYPED EMIT - uses EventPayloads stored on types
// ============================================================================

/**
 * Typed emit function. TEventPayloads is types.EventPayloads - computed once on definition.
 * Each event name maps to its exact payload shape, no recomputation.
 */
export interface EmitEventNamed<
  TEventPayloads extends ComputeEventPayloads<
    TResponseOutput,
    EndpointEventsMap<TResponseOutput>
  >,
  TResponseOutput = TEventPayloads extends ComputeEventPayloads<
    infer R,
    EndpointEventsMap<infer R>
  >
    ? R
    : never,
> {
  <K extends keyof TEventPayloads & string>(
    event: K,
    payload: TEventPayloads[K],
  ): void;
}

// ============================================================================
// RUNTIME HELPERS
// ============================================================================

export function eventDeclarationHasFields<TResponseOutput>(
  declaration: EndpointEventDeclaration<TResponseOutput>,
): boolean {
  if (declaration.fields === undefined) {
    return false;
  }
  if (Array.isArray(declaration.fields)) {
    return declaration.fields.length > 0;
  }
  return Object.keys(declaration.fields).length > 0;
}

// ============================================================================
// WIRE ENVELOPE (server → client)
// ============================================================================

export interface EndpointEventEnvelope<TPayload> {
  endpointPath: readonly string[];
  endpointMethod: string;
  urlPathParams: { readonly [K in string]: string };
  eventName: string;
  payload: TPayload;
  /** Original path-based channel, present when event is routed via user channel */
  channel?: string;
}
