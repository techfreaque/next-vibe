/**
 * Core Endpoint Type Definitions
 *
 * Clean, DRY endpoint system with complete type inference from the 6 core types.
 * No legacy compatibility - this is the single source of truth.
 *
 * Features:
 * - Complete type inference from Zod schemas
 * - Zero any/unknown types
 * - Strict field enforcement
 * - Production-ready error handling
 * - Support for all 5 interfaces
 */

import type { z } from "zod";

import type {
  CategoryKey,
  SubCategoryKey,
} from "@/generated/categories/registry";

import type { UserRoleValue } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import type {
  ChannelDeclaration,
  EndpointEventsMap,
  EndpointEventsMapBase,
  EventEmitUrlPayloads,
  EventPayloads,
  EventPayloadTypes,
  EventRequestPayloads,
  EventResponsePayloads,
  EventTypes,
  EventUrlPayloads,
  HasClientDeliveredEventsOf,
  WithPayloadCtx,
} from "../../realtime/core/structured-events";
import type { UnifiedField } from "../../unified-ui/_shared/configs";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../unified-ui/_shared/types";
import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
} from "../../unified-ui/hooks/types";
import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "../i18n/core/config";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { TParams } from "../i18n/core/static-types";
import {
  buildDefinitionSchemas,
  makeRequiresAuthentication,
} from "./definition-schemas";
import type {
  EndpointExamples,
  ExtractInput,
  ExtractOutput,
  InferFormSchema,
  InferSchemaFromField,
  MergeFormValues,
} from "./endpoint";
import type { EndpointErrorTypes, Methods } from "./enums";
import type { FieldUsage } from "./enums";

/**
 * The `channel` config field requirement, derived from the events map:
 *   - has a client-delivered event → `channel` is REQUIRED (a definition that
 *     emits client events must declare where they ride).
 *   - no client-delivered events   → `channel` is forbidden (`?: never`).
 *   - abstract events map          → `channel` optional (keeps base types loose).
 * `events` is typed as `TEvents & WithPayloadCtx<TEvents,R,Q,U>`:
 * - The `TEvents` side is a direct inference site so `const TEvents` captures the
 *   full literal (requestFields/responseFields/payloadType all preserved concrete).
 * - The `WithPayloadCtx` intersection overlays onEvent with a concretely-typed ctx
 *   (requestData: TRequestOutput, responseData: TResponseOutput, etc.) eliminating
 *   implicit-any errors in callback parameters under noImplicitAny.
 */
export type ChannelConfigField<TResponse, TRequest, TUrl, TEvents, TChannel> =
  HasClientDeliveredEventsOf<TEvents> extends true
    ? {
        channel: TChannel;
        events?: TEvents & WithPayloadCtx<TEvents, TResponse, TRequest, TUrl>;
      }
    : HasClientDeliveredEventsOf<TEvents> extends boolean
      ? {
          channel?: TChannel;
          events?: TEvents & WithPayloadCtx<TEvents, TResponse, TRequest, TUrl>;
        }
      : {
          channel?: never;
          events?: TEvents & WithPayloadCtx<TEvents, TResponse, TRequest, TUrl>;
        };

/**
 * Pass-through translator for inline endpoints - hands the key straight back,
 * because for them the "key" IS the display text.
 *
 * This is NOT an i18n system: no locale handling, no lookup, no interpolation.
 * It exists purely so `scopedTranslation` can stay a required property, which
 * the widget/hook layer relies on to infer `TKey`. Inline definitions carry
 * their copy at the call site, so the key IS the text.
 */
const NO_TRANSLATION = {
  ScopedTranslationKey: "",
  scopedT: (): { t: (key: string) => TranslatedKeyType } => ({
    // oxlint-disable-next-line restricted/restricted-syntax
    t: (key: string): TranslatedKeyType => key as TranslatedKeyType,
  }),
};

// Extract schema type directly from field, bypassing complex field structure
type ExtractSchemaType<F> = F extends { schema: z.ZodType<infer T> }
  ? T
  : never;

// ============================================================================
// CACHED TYPE HELPERS - Compute schemas once and reuse
// ============================================================================

/**
 * Helper type to compute InferSchemaFromField once for a given TFields and Usage
 * These are used throughout to avoid recomputing the same types multiple times
 */
type InferRequestDataSchema<TFields> = InferSchemaFromField<
  TFields,
  FieldUsage.RequestData
>;
type InferResponseDataSchema<TFields> = InferSchemaFromField<
  TFields,
  FieldUsage.ResponseData
>;
type InferUrlParamsSchema<TFields> = InferSchemaFromField<
  TFields,
  FieldUsage.RequestUrlParams
>;

/**
 * Helper types that combine InferSchemaFromField + ExtractInput/Output
 * This reduces repetition and improves type performance
 */
type InferRequestInput<TFields> = z.input<InferRequestDataSchema<TFields>>;
export type InferRequestOutput<TFields> = z.output<
  InferRequestDataSchema<TFields>
>;
type InferResponseInput<TFields> = z.input<InferResponseDataSchema<TFields>>;
export type InferResponseOutput<TFields> = z.output<
  InferResponseDataSchema<TFields>
>;
type InferUrlVariablesInput<TFields> = z.input<InferUrlParamsSchema<TFields>>;
export type InferUrlVariablesOutput<TFields> = z.output<
  InferUrlParamsSchema<TFields>
>;

/**
 * Options for read (GET) operations at the endpoint level
 * These options will be merged with hook-provided options (hook options take priority)
 */
export interface EndpointReadOptions<TRequest, TResponse, TUrlVariables> {
  /** Form options for query forms (filtering, search, etc.) */
  formOptions?: ApiQueryFormOptions<TRequest> | ApiFormOptions<TRequest>;
  /** Query options for data fetching */
  queryOptions?: ApiQueryOptions<TRequest, TResponse, TUrlVariables>;
  /** Mutation options - not used for read endpoints */
  mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
  /** URL path parameters for the read endpoint */
  urlPathParams?: TUrlVariables;
  /** Data to auto-prefill the form with */
  autoPrefillData?: Partial<TRequest>;
  /** Initial state for the form */
  initialState?: Partial<TRequest>;
}

/**
 * Options for create/update (POST/PUT/PATCH) operations at the endpoint level
 * These options will be merged with hook-provided options (hook options take priority)
 */
interface EndpointCreateOptions<TRequest, TResponse, TUrlVariables> {
  /** Form options for mutation forms */
  formOptions?: ApiFormOptions<TRequest>;
  /** Mutation options for create/update operations */
  mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
  /** URL path parameters for the create endpoint */
  urlPathParams?: TUrlVariables;
  /** Data to auto-prefill the form with */
  autoPrefillData?: Partial<TRequest>;
  /** Initial state for the form */
  initialState?: Partial<TRequest>;
}

/**
 * Options for delete (DELETE) operations at the endpoint level
 * These options will be merged with hook-provided options (hook options take priority)
 */
interface EndpointDeleteOptions<TRequest, TResponse, TUrlVariables> {
  /** Form options - can be used if delete needs confirmation form */
  formOptions?: ApiFormOptions<TRequest>;
  /** Mutation options for delete operations */
  mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
  /** URL path parameters for the delete endpoint */
  urlPathParams?: TUrlVariables;
  /** Data to auto-prefill */
  autoPrefillData?: Partial<TRequest>;
  /** Initial state */
  initialState?: Partial<TRequest>;
}

/**
 * Core endpoint definition with complete type inference from TFields:
 * All Input/Output types are automatically inferred from the unified field structure:
 * - TRequestInput/Output: Inferred from fields with FieldUsage.RequestData
 * - TResponseInput/Output: Inferred from fields with FieldUsage.Response
 * - TUrlVariablesInput/Output: Inferred from fields with FieldUsage.RequestUrlParams
 *
 * Features:
 * - Zero any/unknown types - all types are properly inferred from TFields
 * - Strict field enforcement - missing required fields cause TypeScript errors
 * - Complete type safety with proper error handling
 * - Support for all 5 consumption interfaces
 * - Simplified type parameters - only 4 core types needed
 * - Optional scoped translation keys - use TScopedTranslationKey to restrict translation keys to a specific scope
 *
 */
/** Default timeout for endpoint handler execution (Next.js / TanStack route). 0 = no timeout. */
export const DEFAULT_ENDPOINT_TIMEOUT_MS = 90_000;

export interface ApiEndpoint<
  out TMethod extends Methods,
  out TUserRoleValue extends readonly UserRoleValue[],
  out TScopedTranslationKey extends string,
  out TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
> {
  // Core endpoint metadata - all required for type safety
  readonly method: TMethod;
  readonly path: readonly string[];
  readonly allowedRoles: TUserRoleValue;

  /**
   * Roles allowed to use client-side route (localStorage/IndexedDB)
   * If not specified, only allowedRoles can access (must use server route)
   * Use [UserRole.PUBLIC] to allow unauthenticated access via client route
   */
  readonly allowedClientRoles?: readonly UserRoleValue[];

  /**
   * Client-side routing decision callback.
   * Receives typed request data and returns true to route to the client handler
   * (route-client.ts), or false to fall through to the server.
   *
   * When true, callApi loads the matching route-client.ts handler via
   * getClientRouteHandler and executes it - same flow as allowedClientRoles.
   *
   * Use cases: localStorage-backed data (incognito), offline mode, conditional client routing.
   */
  readonly useClientRoute?: (props: {
    data: InferRequestOutput<TFields>;
    urlPathParams: InferUrlVariablesOutput<TFields>;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }) => boolean | Promise<boolean>;

  // Translation keys use NoInfer to ensure they don't contribute to TScopedTranslationKey inference
  // This makes errors appear on the specific property with the invalid key
  readonly title: NoInfer<TScopedTranslationKey>;
  readonly titleShort: NoInfer<TScopedTranslationKey>;
  readonly description: NoInfer<TScopedTranslationKey>;

  /**
   * Optional function that returns a context-specific display title based on request/response data.
   * Called on every render - as state transitions (loading → complete), the title updates reactively.
   * Return undefined to fall back to the static translated `title`.
   */
  readonly dynamicTitle?: (data: {
    request?: Partial<InferRequestInput<TFields>>;
    response?: Partial<InferResponseInput<TFields>>;
  }) =>
    | {
        message: NoInfer<TScopedTranslationKey>;
        messageParams?: TParams;
      }
    | undefined;

  /**
   * Optional status badge config for AI tool call display.
   * Overrides the default "Executing..." / "Complete" labels and colors
   * so each endpoint can declare its own loading/done state appearance.
   */
  readonly statusBadge?: {
    loading?: {
      /** Translation key for the loading state label */
      label: NoInfer<TScopedTranslationKey>;
      /** Tailwind color classes, e.g. "bg-indigo-500/10 text-indigo-500" */
      color: string;
    };
    done?: {
      /** Translation key for the done state label */
      label: NoInfer<TScopedTranslationKey>;
      /** Tailwind color classes, e.g. "bg-green-500/10 text-green-500" */
      color: string;
    };
  };

  readonly category: CategoryKey;
  readonly subCategory?: SubCategoryKey;
  readonly tags: readonly NoInfer<TScopedTranslationKey>[];

  /**
   * Scoped i18n for this endpoint.
   *
   * Real scope for endpoints built with `createEndpoint` from `create-i18n.ts`.
   * For inline endpoints (`./create`) this is {@link NO_TRANSLATION}, a
   * pass-through that hands the key straight back - the copy is already the
   * text. It exists only so the ~75 files that read
   * `TEndpoint["scopedTranslation"]["ScopedTranslationKey"]` keep inferring
   * `TKey`; making this optional breaks that inference framework-wide.
   */
  readonly scopedTranslation: {
    readonly ScopedTranslationKey: TScopedTranslationKey;
    readonly scopedT: (locale: CountryLanguage) => {
      t(key: TScopedTranslationKey, params?: TParams): TranslatedKeyType;
    };
  };

  readonly debug?: boolean;
  readonly aliases?: readonly string[];
  readonly cli?: {
    // TODO: use keyof TRequestInput, TResponseInput, TUrlVariablesInput
    firstCliArgKey?: string;
    /** Forces interactive Ink UI for this endpoint regardless of whether -i was passed */
    alwaysInteractive?: boolean;
  };

  /**
   * Credit cost for this endpoint (0 = free, undefined = free)
   */
  readonly credits?: number;

  /**
   * Optional function that computes the actual credit cost from the request/response data.
   * Called on every render - takes precedence over the static `credits` field.
   * Return undefined to fall back to `credits` or `toolCall.creditsUsed`.
   * Follows the same pattern as `dynamicTitle`.
   */
  readonly dynamicCredits?: (data: {
    request?: Partial<InferRequestInput<TFields>>;
    response?: Partial<InferResponseInput<TFields>>;
  }) => number | undefined;

  /**
   * Whether the tool call block starts expanded in the chat UI.
   * Defaults to false (collapsed). Set to true for tools whose output
   * should be immediately visible (e.g. image/music/video generation).
   */
  readonly defaultExpanded?: boolean;

  /**
   * Whether this tool requires confirmation before execution when called by AI
   * Defaults to false (no confirmation required)
   */
  readonly requiresConfirmation?: boolean;

  /**
   * Roles for which this tool is AI-pinned (always in context) by default.
   * Users can override per-favorite. The generator reads this to produce
   * the generated default-pins.ts file, replacing manual alias arrays in constants.ts.
   * Example: [UserRole.ADMIN, UserRole.CUSTOMER]
   */
  readonly defaultAiPinned?: readonly UserRoleValue[];

  /**
   * Roles for which this tool is web-sidebar-pinned by default.
   * Users can override via settings. The generator reads this to produce
   * the generated default-pins.ts file.
   * Example: [UserRole.ADMIN]
   */
  readonly defaultWebPinned?: readonly UserRoleValue[];
  /**
   * Stream timeout in milliseconds when this tool is called by AI and escalates
   * to a background task (via escalateToTask or remote queue).
   * Default: 90_000 (90s - covers a full cron pulse cycle).
   * Set to 0 for no timeout (long-running tools like claude-code, shell).
   */
  readonly streamTimeoutMs?: number;
  /**
   * Timeout in milliseconds for this endpoint's handler execution.
   * Enforced both by the route handler (Next.js / TanStack) and by execute-tool's
   * WAIT/END_LOOP modes (where exceeding the limit auto-upgrades to wakeUp).
   * Default: DEFAULT_ENDPOINT_TIMEOUT_MS (90s). Set to 0 for no timeout.
   */
  readonly timeoutMs?: number;
  /** Icon identifier */
  readonly icon: IconKey;

  /**
   * Optional function that returns a context-specific icon based on request/response data.
   * Called on every render - return undefined to fall back to the static `icon`.
   * Follows the same pattern as `dynamicTitle`.
   */
  readonly dynamicIcon?: (data: {
    request?: Partial<InferRequestInput<TFields>>;
    response?: Partial<InferResponseInput<TFields>>;
  }) => IconKey | undefined;

  /**
   * WebSocket event schemas for this endpoint.
   * When defined, the handler receives a typed `emit()` function that broadcasts
   * events to all connected clients subscribed to this endpoint's channel.
   *
   * Example:
   * ```ts
   * events: {
   *   contentDelta: z.object({ messageId: z.string(), delta: z.string() }),
   *   contentDone: z.object({ messageId: z.string(), content: z.string() }),
   * }
   * ```
   */

  // Unified fields for schema generation
  readonly fields: TFields;

  readonly examples: EndpointExamples<
    InferRequestInput<TFields>,
    InferUrlVariablesInput<TFields>,
    InferResponseInput<TFields>,
    string
  >;

  // Additional configuration - optional
  // readonly config: EndpointConfig;

  // Error handling configuration - NoInfer ensures errors appear on specific invalid keys
  readonly errorTypes: Record<
    EndpointErrorTypes,
    {
      title: NoInfer<TScopedTranslationKey>;
      description: NoInfer<TScopedTranslationKey>;
    }
  >;

  // Success handling configuration - NoInfer ensures errors appear on specific invalid keys
  readonly successTypes: {
    title: NoInfer<TScopedTranslationKey>;
    description: NoInfer<TScopedTranslationKey>;
  };

  // Method-specific options that will be merged with hook-provided options
  // Hook options take priority over endpoint options
  // oxlint-disable-next-line no-explicit-any
  readonly options?: TMethod extends any
    ? TMethod extends Methods.GET
      ? EndpointReadOptions<
          InferRequestOutput<TFields>,
          InferResponseOutput<TFields>,
          InferUrlVariablesOutput<TFields>
        >
      : TMethod extends Methods.POST | Methods.PUT | Methods.PATCH
        ? EndpointCreateOptions<
            InferRequestOutput<TFields>,
            InferResponseOutput<TFields>,
            InferUrlVariablesOutput<TFields>
          >
        : TMethod extends Methods.DELETE
          ? EndpointDeleteOptions<
              InferRequestOutput<TFields>,
              InferResponseOutput<TFields>,
              InferUrlVariablesOutput<TFields>
            >
          : never
    : never;
}

// --- COMPILE-TIME TYPE INFERENCE FROM UNIFIED FIELDS ---
// Ergonomic system that prevents requestData + requestUrlPathParams conflicts

// Extract core properties from UnifiedField - handle all the extra properties
type ExtractFieldCore<F> = F extends {
  type: "primitive";
  schema: infer Schema;
  usage: infer Usage;
}
  ? { type: "primitive"; schema: Schema; usage: Usage }
  : F extends { type: "object"; children: infer Children }
    ? { type: "object"; children: Children }
    : F extends { type: "array"; child: infer Child; usage: infer Usage }
      ? { type: "array"; child: Child; usage: Usage }
      : never;

// --- MAINTAINABLE SUB-TYPES FOR FIELD INFERENCE ---

// Extract field core structure
type FieldCore<F> = ExtractFieldCore<F>;

// Usage checking helpers
type HasResponseUsage<U> = U extends { response: true } ? true : false;
type HasRequestDataUsage<U> = U extends { request: "data" } ? true : false;
type HasRequestUrlParamsUsage<U> = U extends { request: "urlPathParams" }
  ? true
  : false;

// Direct field type inference that forces evaluation
export type InferFieldType<F, Usage extends FieldUsage> =
  FieldCore<F> extends { type: "primitive"; usage: infer U }
    ? Usage extends FieldUsage.ResponseData
      ? HasResponseUsage<U> extends true
        ? ExtractSchemaType<F>
        : never
      : Usage extends FieldUsage.RequestData
        ? HasRequestDataUsage<U> extends true
          ? ExtractSchemaType<F>
          : never
        : Usage extends FieldUsage.RequestUrlParams
          ? HasRequestUrlParamsUsage<U> extends true
            ? ExtractSchemaType<F>
            : never
          : never
    : FieldCore<F> extends { type: "object"; children: infer C }
      ? InferObjectType<C, Usage>
      : FieldCore<F> extends {
            type: "array";
            child: infer Child;
            usage: infer U;
          }
        ? Usage extends FieldUsage.ResponseData
          ? HasResponseUsage<U> extends true
            ? Array<InferFieldType<Child, Usage>>
            : never
          : Usage extends FieldUsage.RequestData
            ? HasRequestDataUsage<U> extends true
              ? Array<InferFieldType<Child, Usage>>
              : never
            : Usage extends FieldUsage.RequestUrlParams
              ? HasRequestUrlParamsUsage<U> extends true
                ? Array<InferFieldType<Child, Usage>>
                : never
              : never
        : never;

// Fixed object type inference - filter out never fields and remove readonly
// Uses flexible constraint that accepts both readonly and mutable properties
type InferObjectType<C, Usage extends FieldUsage> =
  C extends Record<
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig> | never
    >
  >
    ? {
        -readonly [
          K in keyof C as InferFieldType<C[K], Usage> extends never ? never : K
        ]: InferFieldType<C[K], Usage>;
      }
    : never;

export interface CreateApiEndpoint<
  out TMethod extends Methods,
  out TUserRoleValue extends readonly UserRoleValue[],
  out TScopedTranslationKey extends string,
  out TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  out TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>
  >,
  out TChannel extends ChannelDeclaration | undefined =
    | ChannelDeclaration
    | undefined,
  RequestInput = InferRequestInput<TFields>,
  RequestOutput = InferRequestOutput<TFields>,
  ResponseInput = InferResponseInput<TFields>,
  ResponseOutput = InferResponseOutput<TFields>,
  UrlVariablesInput = InferUrlVariablesInput<TFields>,
  UrlVariablesOutput = InferUrlVariablesOutput<TFields>,
> extends ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields> {
  readonly requestSchema: InferRequestDataSchema<TFields>;
  readonly requestUrlPathParamsSchema: InferUrlParamsSchema<TFields>;
  readonly responseSchema: InferResponseDataSchema<TFields>;

  /**
   * Combined form schema: request-data fields merged with url-path-param fields
   * into a single z.ZodObject. Forms validate and collect BOTH sets (a pure
   * url-path-param field still has a real form widget), then split the flat
   * values back into { data, urlPathParams } on submit. Always a concrete
   * z.ZodObject — including at the type-erased CreateApiEndpointAny boundary —
   * so @hookform/resolvers' zodResolver accepts it without a cast.
   */
  readonly formSchema: InferFormSchema<TFields>;

  readonly requiresAuthentication: () => boolean;

  /**
   * Named events this endpoint can emit.
   *
   * Each key is an event name. The value declares:
   * - `responseFields`: which ResponseOutput keys this event carries (typed Pick)
   * - `requestFields`: which RequestOutput keys to include in the payload
   * - `urlPathParamsFields`: which UrlVariablesOutput keys to include in handler context
   * - `onEvent`: optional handler for cross-endpoint side effects (runs after auto-merge)
   *   receives { responseData, requestData, urlPathParams, queryClient, logger, ... }
   *
   * Server emits via `props.emitEvent("event-name", payload)` - type-checked against declared fields.
   * Client subscribes via `useEndpoint({ subscribeToEvents: true })` - framework merges automatically.
   *
   * Usage:
   * ```ts
   * events: {
   *   "message-upserted": { responseFields: ["messages"] as const, operation: "merge" as const },
   *   "stream-finished":  { onEvent: ({ queryClient }) => { ... } },
   * } satisfies EndpointEventsMap<typeof GET.types.ResponseOutput>
   * ```
   */
  readonly events?: TEvents;

  /**
   * Declares WHERE this endpoint's events ride and how much server code the
   * route must supply. Required (at the type level, via ChannelResolverField)
   * whenever the endpoint has client-delivered events.
   *
   *   channel: { scope: "user" }     — events are the caller's own private data;
   *                                    delivered on user/{id}. No route code.
   *   channel: { scope: "resource" } — shared channel; route admits subscribers.
   *   channel: { scope: "resolved" } — owner/public decided per resource at
   *                                    runtime; route supplies resolveChannel.
   *
   * The channel KEY is always inferred (buildWsChannel from UrlVariablesOutput +
   * CacheKeyRequestData); `scope` only decides whether the user id also keys it.
   */
  readonly channel?: TChannel;

  // oxlint-disable-next-line no-explicit-any
  readonly options?: TMethod extends any
    ? TMethod extends Methods.GET
      ? EndpointReadOptions<
          InferRequestOutput<TFields>,
          InferResponseOutput<TFields>,
          InferUrlVariablesOutput<TFields>
        >
      : TMethod extends Methods.POST | Methods.PUT | Methods.PATCH
        ? EndpointCreateOptions<
            InferRequestOutput<TFields>,
            InferResponseOutput<TFields>,
            InferUrlVariablesOutput<TFields>
          >
        : TMethod extends Methods.DELETE
          ? EndpointDeleteOptions<
              InferRequestOutput<TFields>,
              InferResponseOutput<TFields>,
              InferUrlVariablesOutput<TFields>
            >
          : never
    : never;
  readonly types: {
    readonly RequestInput: RequestInput;
    readonly RequestOutput: RequestOutput;
    readonly ResponseInput: ResponseInput;
    readonly ResponseOutput: ResponseOutput;
    readonly UrlVariablesInput: UrlVariablesInput;
    readonly UrlVariablesOutput: UrlVariablesOutput;
    // Flat form value type: the union of request-data and url-path-param fields
    // (forms validate/collect both, then split on submit). `never` usages are
    // dropped from the union. Single source of truth shared with
    // EndpointFormValues. For the abstract endpoint both sides are `any`, so this
    // stays `any` — forms remain flexible there.
    readonly FormValues: MergeFormValues<RequestOutput, UrlVariablesOutput>;
    readonly Fields: TFields;
    readonly Method: TMethod;
    readonly UserRoleValue: TUserRoleValue;
    readonly ScopedTranslationKey: TScopedTranslationKey;
    readonly Events: TEvents;
    readonly Channel: TChannel;
    readonly EventPayloads: EventPayloads<TEvents>;
    // Event payload maps re-derive the output types from TFields rather than from
    // the RequestOutput/ResponseOutput/UrlVariablesOutput parameters. Those
    // parameters are then used ONLY covariantly (the readonly *Output members
    // above), so they can be annotated `out` — letting TypeScript trust covariance
    // and avoid the deep variance re-measurement that fails the whole-type
    // `extends CreateApiEndpointAny` check. The EMIT-side payloads embed the type
    // contravariantly, which would otherwise make these parameters invariant.
    readonly EventResponsePayloads: EventResponsePayloads<
      InferResponseOutput<TFields>,
      TEvents
    >;
    readonly EventRequestPayloads: EventRequestPayloads<
      InferRequestOutput<TFields>,
      TEvents
    >;
    readonly EventUrlPayloads: EventUrlPayloads<
      InferUrlVariablesOutput<TFields>,
      TEvents
    >;
    readonly EventEmitUrlPayloads: EventEmitUrlPayloads<
      InferUrlVariablesOutput<TFields>,
      TEvents
    >;
    readonly EventPayloadTypes: EventPayloadTypes<TEvents>;
    readonly EventTypes: EventTypes<TEvents>;
  };
}
/**
 * Return type for createEndpoint with full type inference from fields
 */
export type CreateEndpointReturnInMethod<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>
  >,
  TChannel extends ChannelDeclaration | undefined =
    | ChannelDeclaration
    | undefined,
> = {
  readonly [KMethod in TMethod]: CreateApiEndpoint<
    KMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents,
    TChannel
  >;
};

/**
 * Shared endpoint builder behind `createEndpoint` here and the scoped
 * `createEndpoint` in `create-i18n.ts`.
 *
 * `scopedTranslation` is taken as a separate parameter rather than read off
 * `config` so both wrappers can pass a config typed WITHOUT it. Reconstructing
 * `Omit<ApiEndpoint<...>, "scopedTranslation"> & { scopedTranslation }` back
 * into `ApiEndpoint<...>` is not provable while the type params are unresolved,
 * and splitting the argument avoids needing a cast to paper over it.
 */
export function buildEndpoint<
  const TMethod extends Methods,
  const TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  const TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  // TEvents captures the call-site events literal. The `events` config field is
  // typed as EndpointEventsMap<R,Q,U,TEvents> so each entry's onEvent handler is
  // contextually typed: requestData/responseData/urlPathParams from the endpoint's
  // concrete output types, payload from z.output<TEvents[K]["payloadType"]>.
  // TypeScript infers TEvents from the mapped type's fields (payloadType, requestFields
  // etc. are all inference sites), then validates the constraint.
  const TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>,
    TEvents
  > = EndpointEventsMapBase,
  const TChannel extends ChannelDeclaration | undefined = undefined,
>(
  config: Omit<
    ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields>,
    "scopedTranslation"
  > &
    ChannelConfigField<
      InferResponseOutput<TFields>,
      InferRequestOutput<TFields>,
      InferUrlVariablesOutput<TFields>,
      TEvents,
      TChannel
    >,
  scopedTranslation: ApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  >["scopedTranslation"],
): CreateEndpointReturnInMethod<
  TMethod,
  TUserRoleValue,
  TScopedTranslationKey,
  TFields,
  TEvents,
  TChannel
> {
  // Definition-build context (which roles and which platform the static schemas
  // are built for, and what "needs auth" means) lives in ./definition-schemas so
  // this builder stays free of any deployment-shaped assumption.
  const { requestSchema, responseSchema, requestUrlSchema, formSchema } =
    buildDefinitionSchemas(config.fields, config.allowedRoles);
  const requiresAuthentication = makeRequiresAuthentication(
    config.allowedRoles,
  );

  const endpointDefinition: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents,
    TChannel,
    InferRequestInput<TFields>,
    InferRequestOutput<TFields>,
    InferResponseInput<TFields>,
    InferResponseOutput<TFields>,
    InferUrlVariablesInput<TFields>,
    InferUrlVariablesOutput<TFields>
  > = {
    method: config.method,
    path: config.path,
    title: config.title,
    titleShort: config.titleShort,
    description: config.description,
    dynamicTitle: config.dynamicTitle,
    category: config.category,
    subCategory: config.subCategory,
    tags: config.tags,
    fields: config.fields,
    allowedRoles: config.allowedRoles,
    allowedClientRoles: config.allowedClientRoles,
    useClientRoute: config.useClientRoute,
    examples: config.examples,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    scopedTranslation,
    debug: config.debug,
    aliases: config.aliases,
    cli: config.cli,
    credits: config.credits,
    dynamicCredits: config.dynamicCredits,
    defaultExpanded: config.defaultExpanded,
    requiresConfirmation: config.requiresConfirmation,
    streamTimeoutMs: config.streamTimeoutMs,
    timeoutMs: config.timeoutMs,
    defaultAiPinned: config.defaultAiPinned,
    defaultWebPinned: config.defaultWebPinned,
    events: config.events as TEvents | undefined,
    channel: config.channel as TChannel,
    icon: config.icon,
    dynamicIcon: config.dynamicIcon,
    options: config.options,
    requestSchema,
    responseSchema,
    requestUrlPathParamsSchema: requestUrlSchema,
    formSchema,
    requiresAuthentication,
    types: {
      RequestInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.RequestData>
      >,
      RequestOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestData>
      >,
      ResponseInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.ResponseData>
      >,
      ResponseOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.ResponseData>
      >,
      UrlVariablesInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
      UrlVariablesOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
      FormValues: undefined! as MergeFormValues<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
        ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >
      >,
      Fields: undefined! as TFields,
      Method: undefined! as TMethod,
      UserRoleValue: undefined! as TUserRoleValue,
      ScopedTranslationKey: undefined! as TScopedTranslationKey,
      Events: undefined! as TEvents,
      Channel: undefined! as TChannel,
      EventPayloads: undefined! as EventPayloads<TEvents>,
      EventResponsePayloads: undefined! as EventResponsePayloads<
        InferResponseOutput<TFields>,
        TEvents
      >,
      EventRequestPayloads: undefined! as EventRequestPayloads<
        InferRequestOutput<TFields>,
        TEvents
      >,
      EventUrlPayloads: undefined! as EventUrlPayloads<
        InferUrlVariablesOutput<TFields>,
        TEvents
      >,
      EventEmitUrlPayloads: undefined! as EventEmitUrlPayloads<
        InferUrlVariablesOutput<TFields>,
        TEvents
      >,
      EventPayloadTypes: undefined! as EventPayloadTypes<TEvents>,
      EventTypes: undefined! as EventTypes<TEvents>,
    },
  };

  return {
    [config.method]: endpointDefinition,
  } as CreateEndpointReturnInMethod<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents,
    TChannel
  >;
}

/**
 * Config for {@link createEndpoint} - every translation key widened to `string`,
 * because the copy is literal text rather than i18n keys.
 */
export type EndpointConfig<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> = Omit<
  ApiEndpoint<TMethod, TUserRoleValue, string, TFields>,
  "scopedTranslation"
>;

/**
 * Create an endpoint whose copy lives inline - the default.
 *
 * Titles, descriptions, tags, error/success types and field labels are plain
 * strings that render verbatim on every surface (web, CLI, MCP, AI, native).
 * The endpoint has NO `scopedTranslation`, so nothing in this module depends on
 * the i18n folder at runtime.
 *
 * Use the field helpers from `next-vibe/unified-ui/_shared/utils` (NOT
 * `utils-i18n`) - they take no `scopedTranslation` argument and already type
 * their labels as `string`.
 *
 * For an endpoint that must ship in DE/PL, use `createEndpoint` from
 * `next-vibe/core/definition/create-i18n` instead.
 *
 * ```ts
 * export const { POST } = createEndpoint({
 *   method: Methods.POST,
 *   title: "Create company",
 *   description: "Register a new company under your account.",
 *   tags: ["companies", "onboarding"],
 *   fields: objectField({
 *     type: WidgetType.CONTAINER,
 *     usage: { request: "data", response: true },
 *     children: {
 *       name: requestField({
 *         type: WidgetType.FORM_FIELD,
 *         fieldType: FieldDataType.TEXT,
 *         label: "Company name",
 *         schema: z.string().min(2),
 *       }),
 *     },
 *   }),
 *   // ...remaining required config, unchanged
 * });
 * ```
 *
 * Trade-off: inline copy is single-language. Switch to the `create-i18n`
 * variant as soon as an endpoint has to ship in DE/PL.
 */
export function createEndpoint<
  const TMethod extends Methods,
  const TUserRoleValue extends readonly UserRoleValue[],
  const TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
  const TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>,
    TEvents
  > = EndpointEventsMapBase,
  const TChannel extends ChannelDeclaration | undefined = undefined,
>(
  config: EndpointConfig<TMethod, TUserRoleValue, TFields> &
    ChannelConfigField<
      InferResponseOutput<TFields>,
      InferRequestOutput<TFields>,
      InferUrlVariablesOutput<TFields>,
      TEvents,
      TChannel
    >,
): CreateEndpointReturnInMethod<
  TMethod,
  TUserRoleValue,
  string,
  TFields,
  TEvents,
  TChannel
> {
  // Pass-through translator: the config's strings are already display text.
  return buildEndpoint<
    TMethod,
    TUserRoleValue,
    string,
    TFields,
    TEvents,
    TChannel
  >(config, NO_TRANSLATION);
}
