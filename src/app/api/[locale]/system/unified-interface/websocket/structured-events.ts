import type { z } from "zod";

import type { SyncDomain } from "@/app/api/[locale]/remote-connection/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

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
 * Nested field spec: maps top-level response keys to sub-field tuples for
 * array fields, or `true` for scalar/object fields to include as-is.
 */
export type NestedFieldSpec<TResponseOutput> = {
  readonly [K in keyof TResponseOutput]?:
    | readonly (keyof ArrayItem<TResponseOutput[K]>)[]
    | true;
};

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
// EVENT HANDLER CONTEXT
// ============================================================================

/** Wide ctx — all responseData/requestData fields optional. Used as fallback. */
export interface EndpointEventHandlerContext<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
> {
  responseData: {
    readonly [K in keyof TResponseOutput]?: TResponseOutput[K];
  };
  requestData: {
    readonly [K in keyof TRequestOutput]?: TRequestOutput[K];
  };
  urlPathParams: TUrlVariablesOutput extends { readonly [K in string]: string }
    ? TUrlVariablesOutput
    : { readonly [K in string]: string };
  queryClient: QueryClient;
  logger: EndpointLogger;
  cacheKey: string | undefined;
  user: JwtPayloadType;
  locale: CountryLanguage;
  isServer?: boolean;
}

/**
 * Narrowed ctx: fields listed in TResFields/TReqFields are required;
 * unlisted fields remain optional.
 */
type NarrowedEventCtx<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
  TResFields extends
    | readonly (keyof TResponseOutput)[]
    | NestedFieldSpec<TResponseOutput>
    | undefined,
  TReqFields extends readonly (keyof TRequestOutput)[] | undefined,
> = {
  responseData: TResFields extends readonly (keyof TResponseOutput)[]
    ? { readonly [K in TResFields[number]]: TResponseOutput[K] } & {
        readonly [K in Exclude<
          keyof TResponseOutput,
          TResFields[number]
        >]?: TResponseOutput[K];
      }
    : { readonly [K in keyof TResponseOutput]?: TResponseOutput[K] };
  requestData: TReqFields extends readonly (keyof TRequestOutput)[]
    ? { readonly [K in TReqFields[number]]: TRequestOutput[K] } & {
        readonly [K in Exclude<
          keyof TRequestOutput,
          TReqFields[number]
        >]?: TRequestOutput[K];
      }
    : { readonly [K in keyof TRequestOutput]?: TRequestOutput[K] };
  urlPathParams: TUrlVariablesOutput extends { readonly [K in string]: string }
    ? TUrlVariablesOutput
    : { readonly [K in string]: string };
  logger: EndpointLogger;
  cacheKey: string | undefined;
  user: JwtPayloadType | undefined;
  locale: CountryLanguage;
  isServer?: boolean;
};

// ============================================================================
// EVENT DECLARATION — single unified interface
// ============================================================================

export type EventOperation = "merge" | "append" | "remove";

export interface EndpointEventDeclaration<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
  TResFields extends
    | readonly (keyof TResponseOutput)[]
    | NestedFieldSpec<TResponseOutput>
    | undefined = undefined,
  TReqFields extends readonly (keyof TRequestOutput)[] | undefined = undefined,
> {
  readonly responseFields?: TResFields;
  readonly requestFields?: TReqFields;
  readonly urlPathParamsFields?: readonly (keyof TUrlVariablesOutput)[];
  readonly operation?: EventOperation;
  readonly clientDelivery?: false;
  readonly remoteEvent?: true;
  readonly syncDomain?: SyncDomain;
  readonly allowedRoles?: readonly UserRoleValue[];
  readonly payloadType?: z.ZodTypeAny;
  onEvent?(
    ctx: NarrowedEventCtx<
      TResponseOutput,
      TRequestOutput,
      TUrlVariablesOutput,
      TResFields,
      TReqFields
    >,
  ): void | Promise<void>;
}

// ============================================================================
// EVENTS MAP
// ============================================================================

export interface EndpointEventsMap<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
> {
  [K: string]: EndpointEventDeclaration<
    TResponseOutput,
    TRequestOutput,
    TUrlVariablesOutput,
    | readonly (keyof TResponseOutput)[]
    | NestedFieldSpec<TResponseOutput>
    | undefined,
    readonly (keyof TRequestOutput)[] | undefined
  >;
}

/**
 * Given a concrete event declaration type E (with literal requestFields/responseFields),
 * constructs the same declaration with onEvent contextually typed to only the declared fields.
 * Used in createEndpoint's events config to enable per-field type narrowing without wrappers.
 */
export type EventDeclWithNarrowedCtx<
  TResponseOutput,
  TRequestOutput,
  TUrlVariablesOutput,
  E,
> = Omit<E, "onEvent"> & {
  onEvent?(
    ctx: NarrowedEventCtx<
      TResponseOutput,
      TRequestOutput,
      TUrlVariablesOutput,
      E extends {
        responseFields: infer RF extends
          | readonly (keyof TResponseOutput)[]
          | NestedFieldSpec<TResponseOutput>;
      }
        ? RF
        : undefined,
      E extends {
        requestFields: infer RqF extends readonly (keyof TRequestOutput)[];
      }
        ? RqF
        : undefined
    >,
  ): void | Promise<void>;
};

// ============================================================================
// DERIVED MAP TYPES — read from responseFields/requestFields/payloadType
// ============================================================================

type _IsAny<T> = 0 extends 1 & T ? true : false;

export type EventPayloads<TEvents> =
  _IsAny<TEvents> extends true
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Record<string, any>
    : {
        [K in keyof TEvents]: TEvents[K] extends {
          types?: { payload: infer P } | undefined;
        }
          ? P
          : TEvents[K] extends { types: { payload: infer P } }
            ? P
            : never;
      };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// oxlint-disable-next-line no-explicit-any
type AnyEventTypesRecord = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { ResponseData: any; RequestData: any; UrlPathParams: any }
>;
export type EventTypes<TEvents> =
  _IsAny<TEvents> extends true
    ? AnyEventTypesRecord
    : {
        [K in keyof TEvents]: TEvents[K] extends {
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

/**
 * Compute payload map from responseFields/requestFields/payloadType directly.
 * Priority: payloadType → requestFields (+ optional responseFields) → nested responseFields → flat responseFields → {}
 */
export type ComputeEventPayloads<TResponseOutput, TRequestOutput, TEvents> =
  _IsAny<TEvents> extends true
    ? // oxlint-disable-next-line no-explicit-any
      Record<string, any>
    : {
        [K in keyof TEvents]: TEvents[K] extends {
          payloadType: infer TSchema extends z.ZodTypeAny;
        }
          ? z.infer<TSchema>
          : TEvents[K] extends {
                requestFields: infer TReqFields extends
                  readonly (keyof TRequestOutput)[];
              }
            ? Pick<TRequestOutput, TReqFields[number]> &
                (TEvents[K] extends {
                  responseFields: infer TResSpec extends
                    NestedFieldSpec<TResponseOutput>;
                }
                  ? NestedEventPayload<TResponseOutput, TResSpec>
                  : TEvents[K] extends {
                        responseFields: infer TResFields extends
                          readonly (keyof TResponseOutput)[];
                      }
                    ? Pick<TResponseOutput, TResFields[number]>
                    : Record<never, never>)
            : TEvents[K] extends {
                  responseFields: infer TSpec extends
                    NestedFieldSpec<TResponseOutput>;
                }
              ? NestedEventPayload<TResponseOutput, TSpec>
              : TEvents[K] extends {
                    responseFields: infer TFields extends
                      readonly (keyof TResponseOutput)[];
                  }
                ? Pick<TResponseOutput, TFields[number]>
                : Record<never, never>;
      };

export type ComputeEventTypes<TResponseOutput, TRequestOutput, TEvents> = {
  [K in keyof ComputeEventPayloads<TResponseOutput, TRequestOutput, TEvents>]: {
    ResponseData: ComputeEventPayloads<
      TResponseOutput,
      TRequestOutput,
      TEvents
    >[K];
    RequestData: ComputeEventPayloads<
      TResponseOutput,
      TRequestOutput,
      TEvents
    >[K];
    UrlPathParams: Record<string, string>;
  };
};

// ============================================================================
// TYPED EMIT
// ============================================================================

export interface EmitEventNamed<TEventPayloads> {
  <K extends keyof TEventPayloads & string>(
    event: K,
    payload: TEventPayloads[K],
  ): void;
}

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
  if (Array.isArray(declaration.responseFields)) {
    return declaration.responseFields.length > 0;
  }
  return Object.keys(declaration.responseFields).length > 0;
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
