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
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import { generateSchemaForUsage as generateSchemaFromUtils } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type {
  EndpointExamples,
  ExtractInput,
  ExtractOutput,
  InferSchemaFromField,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type {
  EndpointErrorTypes,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { simpleT } from "@/i18n/core/shared";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

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
type InferRequestOutput<TFields> = z.output<InferRequestDataSchema<TFields>>;
type InferResponseInput<TFields> = z.input<InferResponseDataSchema<TFields>>;
export type InferResponseOutput<TFields> = z.output<
  InferResponseDataSchema<TFields>
>;
type InferUrlVariablesInput<TFields> = z.input<InferUrlParamsSchema<TFields>>;
type InferUrlVariablesOutput<TFields> = z.output<InferUrlParamsSchema<TFields>>;

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
export interface EndpointCreateOptions<TRequest, TResponse, TUrlVariables> {
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
export interface EndpointDeleteOptions<TRequest, TResponse, TUrlVariables> {
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
   * Roles allowed to access this endpoint in local mode (NEXT_PUBLIC_LOCAL_MODE=true).
   * - undefined (not set): falls back to allowedRoles with UserRole.PUBLIC stripped
   *   (except login and reset-password endpoints which keep PUBLIC)
   * - [] (empty array): endpoint is disabled for everyone in local mode
   * - [UserRole.ADMIN, ...]: explicit override — only those roles are allowed
   */
  readonly allowedLocalModeRoles?: readonly UserRoleValue[];

  /**
   * Roles allowed to use client-side route (localStorage/IndexedDB)
   * If not specified, only allowedRoles can access (must use server route)
   * Use [UserRole.PUBLIC] to allow unauthenticated access via client route
   */
  readonly allowedClientRoles?: readonly UserRoleValue[];

  // Translation keys use NoInfer to ensure they don't contribute to TScopedTranslationKey inference
  // This makes errors appear on the specific property with the invalid key
  readonly title: NoInfer<TScopedTranslationKey>;
  readonly description: NoInfer<TScopedTranslationKey>;
  readonly category: NoInfer<TScopedTranslationKey>;
  readonly tags: readonly NoInfer<TScopedTranslationKey>[];

  /**
   * Scoped translation function for this endpoint
   * Required on endpoint instances, but can be auto-generated by createEndpoint
   */
  readonly scopedTranslation?: {
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
  };

  /**
   * Credit cost for this endpoint (0 = free, undefined = free)
   */
  readonly credits?: number;
  /**
   * Whether this tool requires confirmation before execution when called by AI
   * Defaults to false (no confirmation required)
   */
  readonly requiresConfirmation?: boolean;
  /** Icon identifier */
  readonly icon: IconKey;

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
export type ExtractFieldCore<F> = F extends {
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
        -readonly [K in keyof C as InferFieldType<C[K], Usage> extends never
          ? never
          : K]: InferFieldType<C[K], Usage>;
      }
    : never;

// --- SCHEMA GENERATION FROM UNIFIED FIELDS ---
// Use the proper generateSchemaForUsage function from utils
const generateSchemaForUsage = generateSchemaFromUtils;

function generateRequestDataSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestData> {
  return generateSchemaForUsage<F, FieldUsage.RequestData>(
    field,
    FieldUsage.RequestData,
  );
}

function generateRequestUrlSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestUrlParams> {
  return generateSchemaForUsage<F, FieldUsage.RequestUrlParams>(
    field,
    FieldUsage.RequestUrlParams,
  );
}

function generateResponseSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.ResponseData> {
  return generateSchemaForUsage<F, FieldUsage.ResponseData>(
    field,
    FieldUsage.ResponseData,
  );
}

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
  RequestInput = InferRequestInput<TFields>,
  RequestOutput = InferRequestOutput<TFields>,
  ResponseInput = InferResponseInput<TFields>,
  ResponseOutput = InferResponseOutput<TFields>,
  UrlVariablesInput = InferUrlVariablesInput<TFields>,
  UrlVariablesOutput = InferUrlVariablesOutput<TFields>,
> extends ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields> {
  readonly scopedTranslation: {
    readonly ScopedTranslationKey: TScopedTranslationKey;
    readonly scopedT: (locale: CountryLanguage) => {
      t(key: TScopedTranslationKey, params?: TParams): TranslatedKeyType;
    };
  };
  readonly requestSchema: InferRequestDataSchema<TFields>;
  readonly requestUrlPathParamsSchema: InferUrlParamsSchema<TFields>;
  readonly responseSchema: InferResponseDataSchema<TFields>;

  readonly requiresAuthentication: () => boolean;

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
    RequestInput: RequestInput;
    RequestOutput: RequestOutput;
    ResponseInput: ResponseInput;
    ResponseOutput: ResponseOutput;
    UrlVariablesInput: UrlVariablesInput;
    UrlVariablesOutput: UrlVariablesOutput;
    Fields: TFields;
    Method: TMethod;
    UserRoleValue: TUserRoleValue;
    ScopedTranslationKey: TScopedTranslationKey;
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
> = {
  readonly [KMethod in TMethod]: CreateApiEndpoint<
    KMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  >;
};

/**
 * Create an endpoint definition with perfect type inference from unified fields
 * Returns both legacy format and new destructured format for maximum compatibility
 *
 * Translation key inference:
 * - TScopedTranslationKey is inferred from scopedTranslation.ScopedTranslationKey when provided
 * - Defaults to TranslationKey (global keys) when scopedTranslation is not provided
 */
export function createEndpoint<
  const TMethod extends Methods,
  const TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string = TranslationKey,
  const TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  > = UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
>(
  config: ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields>,
): CreateEndpointReturnInMethod<
  TMethod,
  TUserRoleValue,
  TScopedTranslationKey,
  TFields
> {
  // Generate schemas from unified fields
  // const fieldBuilder = createFieldBuilder<TScopedTranslationKey>();
  // const fields = typeof config.fields === "function" ? config.fields(fieldBuilder) : config.fields;
  const requestSchema = generateRequestDataSchema(config.fields);
  const responseSchema = generateResponseSchema(config.fields);
  const requestUrlSchema = generateRequestUrlSchema(config.fields);

  function requiresAuthentication(): boolean {
    // Endpoint requires authentication if PUBLIC role is NOT in the allowed roles
    return !config.allowedRoles.includes(UserRole.PUBLIC);
  }

  // Default scopedTranslation when none provided - uses global TranslationKey with simpleT
  const defaultScopedTranslation = {
    ScopedTranslationKey: "" as TScopedTranslationKey,
    scopedT: (
      locale: CountryLanguage,
    ): {
      t: (key: TScopedTranslationKey, params?: TParams) => TranslatedKeyType;
    } => ({
      t: (key: TScopedTranslationKey, params?: TParams): TranslatedKeyType =>
        simpleT(locale).t(key as TranslationKey, params) as TranslatedKeyType,
    }),
  };

  // Create endpoint with proper type inference - preserve actual schema types for input/output differentiation
  const endpointDefinition: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  > = {
    method: config.method,
    path: config.path,
    title: config.title,
    description: config.description,
    category: config.category,
    tags: config.tags,
    fields: config.fields,
    allowedRoles: config.allowedRoles,
    allowedLocalModeRoles: config.allowedLocalModeRoles,
    allowedClientRoles: config.allowedClientRoles,
    examples: config.examples,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    scopedTranslation: config.scopedTranslation ?? defaultScopedTranslation,
    debug: config.debug,
    aliases: config.aliases,
    cli: config.cli,
    credits: config.credits,
    icon: config.icon,
    options: config.options,
    requestSchema,
    responseSchema,
    requestUrlPathParamsSchema: requestUrlSchema,
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
      Fields: undefined! as TFields,
      Method: undefined! as TMethod,
      UserRoleValue: undefined! as TUserRoleValue,
      ScopedTranslationKey: undefined! as TScopedTranslationKey,
    },
  };

  // Return the method-keyed object with proper type inference
  return {
    [config.method]: endpointDefinition,
  } as CreateEndpointReturnInMethod<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  >;
}
