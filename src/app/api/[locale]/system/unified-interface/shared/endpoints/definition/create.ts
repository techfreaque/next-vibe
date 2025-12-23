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

import type { IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { generateSchemaForUsage as generateSchemaFromUtils } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type {
  ExamplesList,
  ExtractInput,
  ExtractOutput,
  InferSchemaFromField,
  LifecycleActions,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type {
  EndpointErrorTypes,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

// Extract schema type directly from field, bypassing complex field structure
type ExtractSchemaType<F> = F extends { schema: z.ZodType<infer T> }
  ? T
  : never;

/**
 * Validate a translation key - produces error message type if invalid
 */
type ValidateTranslationKey<T, TKey extends string> = T extends TKey
  ? T
  : T extends string
    ? `[INVALID KEY] "${T}" is not a valid translation key`
    : T;

/**
 * Translation key property names that require validation
 */
type TranslationKeyProperty =
  | "label"
  | "title"
  | "description"
  | "placeholder"
  | "helpText";

/**
 * Validate ui config properties - replaces invalid keys with error message types
 */
type ValidateUIConfig<TUI, TKey extends string> = {
  [K in keyof TUI]: K extends TranslationKeyProperty
    ? TUI[K] extends string
      ? ValidateTranslationKey<TUI[K], TKey>
      : TUI[K]
    : TUI[K];
};

/**
 * Validate children record - recursively validates each child field
 */
type ValidateChildren<TChildren, TKey extends string> = {
  [K in keyof TChildren]: ValidateFieldUI<TChildren[K], TKey>;
};

/**
 * Validate a field's ui property recursively using mapped types.
 * When TKey is just `string`, no validation is needed - any string is valid.
 * This avoids structural type mismatches when using CreateApiEndpointAny.
 */
type ValidateFieldUI<TField, TKey extends string> = string extends TKey
  ? TField
  : {
      [K in keyof TField]: K extends "ui"
        ? ValidateUIConfig<TField[K], TKey>
        : K extends "children"
          ? TField[K] extends Record<string, UnifiedField<string>>
            ? ValidateChildren<TField[K], TKey>
            : TField[K]
          : TField[K];
    };

/**
 * Validation mode for forms
 */
export type ValidationMode =
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all";

/**
 * Options for read (GET) operations at the endpoint level
 * These options will be merged with hook-provided options (hook options take priority)
 */
export interface EndpointReadOptions<TRequest, TUrlVariables> {
  /** Form options for query forms (filtering, search, etc.) */
  formOptions?: {
    defaultValues?: Partial<TRequest>;
    persistForm?: boolean;
    persistenceKey?: string;
    autoSubmit?: boolean;
    debounceMs?: number;
  };
  /** Query options for data fetching */
  queryOptions?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    disableLocalCache?: boolean;
    cacheDuration?: number;
    deduplicateRequests?: boolean;
    refreshDelay?: number;
    forceRefresh?: boolean;
    backgroundRefresh?: boolean;
  };
  /** URL path parameters for the read endpoint */
  urlPathParams?: TUrlVariables;
  /** Initial state for the form */
  initialState?: Partial<TRequest>;
}

/**
 * Options for create/update (POST/PUT/PATCH) operations at the endpoint level
 * These options will be merged with hook-provided options (hook options take priority)
 */
export interface EndpointCreateOptions<TRequest, TUrlVariables> {
  /** Form options for mutation forms */
  formOptions?: {
    defaultValues?: Partial<TRequest>;
    persistForm?: boolean;
    persistenceKey?: string;
  };
  /** Mutation options for create/update operations */
  mutationOptions?: {
    invalidateQueries?: string[];
  };
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
export interface EndpointDeleteOptions<TUrlVariables> {
  /** Mutation options for delete operations */
  mutationOptions?: {
    invalidateQueries?: string[];
  };
  /** URL path parameters for the delete endpoint */
  urlPathParams?: TUrlVariables;
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
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields,
  TScopedTranslationKey extends string = TranslationKey,
> {
  // Core endpoint metadata - all required for type safety
  readonly method: TMethod;
  readonly path: readonly string[];
  readonly allowedRoles: TUserRoleValue;

  // Translation keys use NoInfer to ensure they don't contribute to TScopedTranslationKey inference
  // This makes errors appear on the specific property with the invalid key
  readonly title: NoInfer<TScopedTranslationKey>;
  readonly description: NoInfer<TScopedTranslationKey>;
  readonly category: NoInfer<TScopedTranslationKey>;
  readonly tags: readonly NoInfer<TScopedTranslationKey>[];

  /**
   * Scoped translation function for this endpoint
   * When provided, all translation keys in this endpoint are scoped to this function
   * This enables type-safe, module-specific translations
   *
   * The key type is automatically inferred from the ScopedTranslationKey property
   * of the scopedTranslation object.
   *
   * Example:
   * ```ts
   * import { scopedTranslation } from "./i18n";
   * createEndpoint({
   *   scopedT: scopedTranslation, // Pass the FULL object, not just the function
   *   title: "title", // Scoped key (relative to contact module)
   *   // ...
   * });
   * ```
   */
  readonly scopedTranslation?: {
    readonly ScopedTranslationKey: TScopedTranslationKey;
    readonly scopedT: (locale: CountryLanguage) => {
      // Uses method syntax for bivariance - allows both narrow (scoped) and broad (string) key types
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
  /** Icon identifier */
  readonly icon: IconValue;

  // Unified fields for schema generation
  // ValidateFieldUI produces error message types at property level for invalid translation keys
  readonly fields: ValidateFieldUI<TFields, TScopedTranslationKey>;

  lifecycle?: LifecycleActions;

  readonly examples: (ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  > extends undefined
    ? { requests?: undefined }
    : ExtractInput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        > extends never
      ? {
          requests?: undefined;
        }
      : {
          requests: ExamplesList<
            ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
            TExampleKey
          >;
        }) &
    (ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    > extends undefined
      ? { urlPathParams?: undefined }
      : ExtractInput<
            InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
          > extends never
        ? {
            urlPathParams?: undefined;
          }
        : {
            urlPathParams: ExamplesList<
              ExtractInput<
                InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
              >,
              TExampleKey
            >;
          }) &
    (ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.Response>
    > extends undefined
      ? { responses?: undefined }
      : ExtractInput<
            InferSchemaFromField<TFields, FieldUsage.Response>
          > extends never
        ? {
            responses?: undefined;
          }
        : {
            responses: ExamplesList<
              ExtractInput<InferSchemaFromField<TFields, FieldUsage.Response>>,
              TExampleKey
            >;
          });

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
  readonly options?: TMethod extends Methods.GET
    ? EndpointReadOptions<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
        ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >
      >
    : TMethod extends Methods.POST | Methods.PUT | Methods.PATCH
      ? EndpointCreateOptions<
          ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
          ExtractOutput<
            InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
          >
        >
      : TMethod extends Methods.DELETE
        ? EndpointDeleteOptions<
            ExtractOutput<
              InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
            >
          >
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
    ? Usage extends FieldUsage.Response
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
        ? Usage extends FieldUsage.Response
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
  C extends Record<string, UnifiedField<string, z.ZodTypeAny>>
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
): InferSchemaFromField<F, FieldUsage.Response> {
  return generateSchemaForUsage<F, FieldUsage.Response>(
    field,
    FieldUsage.Response,
  );
}

export type CreateApiEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<string, z.ZodTypeAny> = UnifiedField<
    string,
    z.ZodTypeAny
  >,
  RequestInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  >,
  RequestOutput = ExtractOutput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  >,
  ResponseInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.Response>
  >,
  ResponseOutput = ExtractOutput<
    InferSchemaFromField<TFields, FieldUsage.Response>
  >,
  UrlVariablesInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
  >,
  UrlVariablesOutput = ExtractOutput<
    InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
  >,
> = ApiEndpoint<
  TExampleKey,
  TMethod,
  TUserRoleValue,
  TFields,
  TScopedTranslationKey
> & {
  readonly requestSchema: InferSchemaFromField<TFields, FieldUsage.RequestData>;
  readonly requestUrlPathParamsSchema: InferSchemaFromField<
    TFields,
    FieldUsage.RequestUrlParams
  >;
  readonly responseSchema: InferSchemaFromField<TFields, FieldUsage.Response>;

  readonly requiresAuthentication: () => boolean;

  readonly types: {
    RequestInput: RequestInput;
    RequestOutput: RequestOutput;
    ResponseInput: ResponseInput;
    ResponseOutput: ResponseOutput;
    UrlVariablesInput: UrlVariablesInput;
    UrlVariablesOutput: UrlVariablesOutput;
    Fields: TFields;
    ExampleKey: TExampleKey;
    Method: TMethod;
    UserRoleValue: TUserRoleValue;
    ScopedTranslationKey: TScopedTranslationKey;
  };
};
/**
 * Return type for createEndpoint with full type inference from fields
 */
export type CreateEndpointReturnInMethod<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<string, z.ZodTypeAny>,
> = {
  readonly [KMethod in TMethod]: CreateApiEndpoint<
    TExampleKey,
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
 * Translation keys are automatically inferred:
 * - If scopedTranslation is provided: keys are constrained to scoped keys
 * - If no scopedTranslation: keys must be valid global TranslationKey
 *
 * Errors appear on the specific property with the invalid key, not as generic "no overload matches"
 */

// Implementation
// TFields captures the exact field structure for proper type inference
// TScopedTranslationKey is inferred from scopedTranslation and used to validate translation keys
export function createEndpoint<
  const TScopedTranslationKey extends string,
  const TFields extends UnifiedField<
    NoInfer<TScopedTranslationKey>,
    z.ZodTypeAny
  >,
  const TExampleKey extends string,
  const TMethod extends Methods,
  const TUserRoleValue extends readonly UserRoleValue[],
>(
  config: ApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TScopedTranslationKey
  >,
): CreateEndpointReturnInMethod<
  TExampleKey,
  TMethod,
  TUserRoleValue,
  TScopedTranslationKey,
  TFields
> {
  // Generate schemas from unified fields with type assertions for better TypeScript display
  // Cast fields to TFields since the conditional type is for validation only
  const fields = config.fields as TFields;
  const requestSchema = generateRequestDataSchema<TFields>(
    fields,
  ) as InferSchemaFromField<TFields, FieldUsage.RequestData>;
  const responseSchema = generateResponseSchema<TFields>(
    fields,
  ) as InferSchemaFromField<TFields, FieldUsage.Response>;
  const requestUrlSchema = generateRequestUrlSchema<TFields>(
    fields,
  ) as InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>;

  function requiresAuthentication(): boolean {
    // Endpoint requires authentication if PUBLIC role is NOT in the allowed roles
    return !config.allowedRoles.includes(UserRole.PUBLIC);
  }

  // Create endpoint with proper type inference - preserve actual schema types for input/output differentiation
  const endpointDefinition: CreateApiEndpoint<
    TExampleKey,
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
    fields: fields as typeof config.fields,
    allowedRoles: config.allowedRoles,
    examples: config.examples,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    scopedTranslation: config.scopedTranslation,
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
        InferSchemaFromField<TFields, FieldUsage.Response>
      >,
      ResponseOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.Response>
      >,
      UrlVariablesInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
      UrlVariablesOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
      Fields: undefined! as TFields,
      ExampleKey: undefined! as TExampleKey,
      Method: undefined! as TMethod,
      UserRoleValue: undefined! as TUserRoleValue,
      ScopedTranslationKey: undefined! as TScopedTranslationKey,
    },
  };

  // Return the method-keyed object with proper type inference
  return {
    [config.method]: endpointDefinition,
  } as CreateEndpointReturnInMethod<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  >;
}
