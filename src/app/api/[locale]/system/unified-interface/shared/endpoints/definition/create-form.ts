/**
 * Create Form Endpoint Utility
 *
 * Utility for creating DRY form endpoints that support both GET and POST methods:
 * - GET: Fetches initial/current data (response-only fields)
 * - POST: Sends changed data, returns updated data (request+response fields)
 *
 * This eliminates duplication between GET and POST endpoints that share the same data structure.
 */

import { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type {
  ExamplesList,
  ExtractInput,
  ExtractOutput,
  FieldUsageConfig,
  InferInputFromFieldForMethod,
  InferOutputFromFieldForMethod,
  InferSchemaFromFieldForMethod,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { EndpointErrorTypes } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  FieldUsage,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetConfig } from "@/app/api/[locale]/system/unified-interface/shared/widgets/configs";
import { UserRole, type UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { simpleT } from "@/i18n/core/shared";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import { type CreateApiEndpoint } from "./create";

/**
 * Configuration for a single method in a form endpoint
 */
export interface FormMethodConfig<TScopedTranslationKey extends string> {
  readonly title: TScopedTranslationKey;
  readonly description: TScopedTranslationKey;
  readonly tags: TScopedTranslationKey[];
  readonly icon: IconKey;
  readonly aliases?: string[];
}

/**
 * Examples configuration for form endpoints
 */
/**
 * Cache schemas for a method to avoid repeated evaluation
 */
export interface CachedMethodSchemas<
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TMethod extends Methods,
> {
  requestData: InferSchemaFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestData
  >;
  response: InferSchemaFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.ResponseData
  >;
  urlParams: InferSchemaFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestUrlParams
  >;
}

/**
 * Build examples structure from cached schemas
 */
export interface MethodExamples<
  TSchemas extends CachedMethodSchemas<string, UnifiedField<string, z.ZodTypeAny>, Methods>,
  TExampleKey extends string,
> {
  requests?: ExtractInput<TSchemas["requestData"]> extends never
    ? undefined
    : ExamplesList<ExtractInput<TSchemas["requestData"]>, TExampleKey>;
  responses: ExamplesList<ExtractOutput<TSchemas["response"]>, TExampleKey>;
  urlPathParams?: ExtractInput<TSchemas["urlParams"]> extends never
    ? undefined
    : ExamplesList<ExtractInput<TSchemas["urlParams"]>, TExampleKey>;
}

/**
 * FormExamples - inlines the full structure to avoid intermediate type depth
 */
// oxlint-disable-next-line consistent-type-definitions
export type FormExamples<
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TExampleKey extends string,
  TMethods extends {
    GET?: FormMethodConfig<TScopedTranslationKey>;
    POST?: FormMethodConfig<TScopedTranslationKey>;
    PATCH?: FormMethodConfig<TScopedTranslationKey>;
    DELETE?: FormMethodConfig<TScopedTranslationKey>;
  } = {
    GET?: FormMethodConfig<TScopedTranslationKey>;
    POST?: FormMethodConfig<TScopedTranslationKey>;
    PATCH?: FormMethodConfig<TScopedTranslationKey>;
    DELETE?: FormMethodConfig<TScopedTranslationKey>;
  },
> = {
  GET?: "GET" extends keyof TMethods
    ? {
        requests?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.GET,
            FieldUsage.RequestData
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.GET,
                  FieldUsage.RequestData
                >
              >,
              TExampleKey
            >;
        responses: ExamplesList<
          ExtractOutput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              Methods.GET,
              FieldUsage.ResponseData
            >
          >,
          TExampleKey
        >;
        urlPathParams?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.GET,
            FieldUsage.RequestUrlParams
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.GET,
                  FieldUsage.RequestUrlParams
                >
              >,
              TExampleKey
            >;
      }
    : never;
  POST?: "POST" extends keyof TMethods
    ? {
        requests?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.POST,
            FieldUsage.RequestData
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.POST,
                  FieldUsage.RequestData
                >
              >,
              TExampleKey
            >;
        responses: ExamplesList<
          ExtractOutput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              Methods.POST,
              FieldUsage.ResponseData
            >
          >,
          TExampleKey
        >;
        urlPathParams?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.POST,
            FieldUsage.RequestUrlParams
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.POST,
                  FieldUsage.RequestUrlParams
                >
              >,
              TExampleKey
            >;
      }
    : never;
  PATCH?: "PATCH" extends keyof TMethods
    ? {
        requests?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.PATCH,
            FieldUsage.RequestData
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.PATCH,
                  FieldUsage.RequestData
                >
              >,
              TExampleKey
            >;
        responses: ExamplesList<
          ExtractOutput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              Methods.PATCH,
              FieldUsage.ResponseData
            >
          >,
          TExampleKey
        >;
        urlPathParams?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.PATCH,
            FieldUsage.RequestUrlParams
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.PATCH,
                  FieldUsage.RequestUrlParams
                >
              >,
              TExampleKey
            >;
      }
    : never;
  DELETE?: "DELETE" extends keyof TMethods
    ? {
        requests?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.DELETE,
            FieldUsage.RequestData
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.DELETE,
                  FieldUsage.RequestData
                >
              >,
              TExampleKey
            >;
        responses: ExamplesList<
          ExtractOutput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              Methods.DELETE,
              FieldUsage.ResponseData
            >
          >,
          TExampleKey
        >;
        urlPathParams?: ExtractInput<
          InferSchemaFromFieldForMethod<
            TScopedTranslationKey,
            TFields,
            Methods.DELETE,
            FieldUsage.RequestUrlParams
          >
        > extends never
          ? undefined
          : ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  Methods.DELETE,
                  FieldUsage.RequestUrlParams
                >
              >,
              TExampleKey
            >;
      }
    : never;
};

/**
 * Configuration for creating a form endpoint with GET, POST, PATCH, and DELETE methods
 */
export interface CreateFormEndpointConfig<
  TScopedTranslationKey extends string,
  TExampleKey extends string,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TMethods extends {
    GET?: FormMethodConfig<TScopedTranslationKey>;
    POST?: FormMethodConfig<TScopedTranslationKey>;
    PATCH?: FormMethodConfig<TScopedTranslationKey>;
    DELETE?: FormMethodConfig<TScopedTranslationKey>;
  },
> {
  // Shared configuration
  readonly path: readonly string[];
  readonly category: NoInfer<TScopedTranslationKey>;
  readonly allowedRoles: TUserRoleValue;

  readonly debug?: boolean;

  // Method-specific configuration
  readonly methods: TMethods;

  // Shared field definitions - will be automatically adapted for each method
  readonly fields: TFields;

  // Shared error and success configuration
  readonly errorTypes: Record<
    EndpointErrorTypes,
    {
      title: NoInfer<TScopedTranslationKey>;
      description: NoInfer<TScopedTranslationKey>;
    }
  >;
  readonly successTypes: {
    title: NoInfer<TScopedTranslationKey>;
    description: NoInfer<TScopedTranslationKey>;
  };

  // Method-specific examples
  readonly examples: NoInfer<FormExamples<TScopedTranslationKey, TFields, TExampleKey, TMethods>>;

  // Scoped translation
  readonly scopedTranslation?: {
    readonly ScopedTranslationKey: TScopedTranslationKey;
    readonly scopedT: (locale: CountryLanguage) => {
      t(key: TScopedTranslationKey, params?: TParams): TranslatedKeyType;
    };
  };
}

// ============================================================================
// METHOD-SPECIFIC TYPE FILTERING
// ============================================================================

/**
 * Enhanced usage matching that supports both old format and method-specific format
 */
type SupportsMethodAndUsage<
  TUsage extends FieldUsageConfig,
  TMethod extends Methods,
  TTargetUsage extends FieldUsage,
> =
  // Check if it's method-specific format first
  TMethod extends keyof TUsage
    ? TUsage[TMethod] extends infer TMethodUsage
      ? TTargetUsage extends FieldUsage.RequestData
        ? TMethodUsage extends { request: "data" | "data&urlPathParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.RequestUrlParams
          ? TMethodUsage extends {
              request: "urlPathParams" | "data&urlPathParams";
            }
            ? true
            : false
          : TTargetUsage extends FieldUsage.ResponseData
            ? TMethodUsage extends { response: true }
              ? true
              : false
            : false
      : false
    : // Fall back to original logic for backward compatibility
      TTargetUsage extends FieldUsage.RequestData
      ? TUsage extends { request: "data" | "data&urlPathParams" }
        ? true
        : false
      : TTargetUsage extends FieldUsage.RequestUrlParams
        ? TUsage extends { request: "urlPathParams" | "data&urlPathParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.ResponseData
          ? TUsage extends { response: true }
            ? true
            : false
          : false;

/**
 * Filter schema for a specific method and usage type
 */
export type FilterSchemaForMethod<
  TScopedTranslationKey extends string,
  TFields,
  TTargetUsage extends FieldUsage,
  TMethod extends Methods,
> =
  TFields extends PrimitiveField<
    infer TSchema,
    FieldUsageConfig,
    TScopedTranslationKey,
    WidgetConfig<TScopedTranslationKey>
  >
    ? SupportsMethodAndUsage<TFields["usage"], TMethod, TTargetUsage> extends true
      ? TSchema
      : z.ZodNever
    : TFields extends ObjectField<
          infer TChildren,
          FieldUsageConfig,
          TScopedTranslationKey,
          WidgetConfig<TScopedTranslationKey>
        >
      ? SupportsMethodAndUsage<TFields["usage"], TMethod, TTargetUsage> extends true
        ? z.ZodObject<{
            [K in keyof TChildren as FilterSchemaForMethod<
              TScopedTranslationKey,
              TChildren[K],
              TTargetUsage,
              TMethod
            > extends z.ZodNever
              ? never
              : K]: FilterSchemaForMethod<
              TScopedTranslationKey,
              TChildren[K],
              TTargetUsage,
              TMethod
            >;
          }>
        : z.ZodNever
      : z.ZodNever;

/**
 * Method-specific endpoint type that extends CreateApiEndpoint
 * This ensures perfect type inference for each HTTP method and compatibility with hooks
 */
export type MethodSpecificEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
> = CreateApiEndpoint<
  TExampleKey,
  TMethod,
  TUserRoleValue,
  TScopedTranslationKey,
  TFields,
  // Override type parameters with method-specific inference
  InferInputFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.RequestData>,
  InferOutputFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.RequestData>,
  InferInputFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.ResponseData>,
  InferOutputFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.ResponseData>,
  InferInputFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestUrlParams
  >,
  InferOutputFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestUrlParams
  >
>;

/**
 * Type Helper: Extract Request Schema from Fields for a specific Method
 * Combines data fields + URL path params for a specific HTTP method
 * Used for testing the request schema generation chain
 */
export type GetRequestSchemaFromFields<
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TMethod extends Methods,
> = z.ZodObject<{
  data: InferSchemaFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestData
  >;
  urlPathParams: InferSchemaFromFieldForMethod<
    TScopedTranslationKey,
    TFields,
    TMethod,
    FieldUsage.RequestUrlParams
  >;
}>;

/**
 * Type Helper: Extract Response Schema from Fields for a specific Method
 * Gets response-only fields for a specific HTTP method
 * Used for testing the response schema generation chain
 */
export type GetResponseSchemaFromFields<
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TMethod extends Methods,
> = InferSchemaFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.ResponseData>;

/**
 * Return type for createFormEndpoint - provides GET, POST, PATCH, and DELETE endpoints
 * Uses method-specific type inference for perfect type safety
 * Only includes methods that are actually defined in the config
 */
export type CreateFormEndpointReturn<
  TExampleKey extends string,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  TMethods extends {
    GET?: FormMethodConfig<TScopedTranslationKey>;
    POST?: FormMethodConfig<TScopedTranslationKey>;
    PATCH?: FormMethodConfig<TScopedTranslationKey>;
    DELETE?: FormMethodConfig<TScopedTranslationKey>;
  },
> = (TMethods["GET"] extends FormMethodConfig<string>
  ? {
      GET: MethodSpecificEndpoint<
        TExampleKey,
        Methods.GET,
        TUserRoleValue,
        TScopedTranslationKey,
        TFields
      >;
    }
  : Record<string, never>) &
  (TMethods["POST"] extends FormMethodConfig<string>
    ? {
        POST: MethodSpecificEndpoint<
          TExampleKey,
          Methods.POST,
          TUserRoleValue,
          TScopedTranslationKey,
          TFields
        >;
      }
    : Record<string, never>) &
  (TMethods["PATCH"] extends FormMethodConfig<string>
    ? {
        PATCH: MethodSpecificEndpoint<
          TExampleKey,
          Methods.PATCH,
          TUserRoleValue,
          TScopedTranslationKey,
          TFields
        >;
      }
    : Record<string, never>) &
  (TMethods["DELETE"] extends FormMethodConfig<string>
    ? {
        DELETE: MethodSpecificEndpoint<
          TExampleKey,
          Methods.DELETE,
          TUserRoleValue,
          TScopedTranslationKey,
          TFields
        >;
      }
    : Record<string, never>);

/**
 * ============================================================================
 * TYPE EXTRACTION UTILITIES
 * ============================================================================
 *
 * These utilities extract types from createFormEndpoint CONFIG (not return value).
 * They work around TypeScript's cross-module typeof limitation by inferring types
 * from the input config parameters instead of from the return value.
 *
 * Usage in definition files:
 * ```typescript
 * const config = { ... } as const;
 * export const { GET, POST } = createFormEndpoint(config);
 *
 * // Extract types from CONFIG, not return value
 * export type GetRequest = ExtractMethodRequestOutput<typeof config, "GET">;
 * export type PostResponse = ExtractMethodResponseOutput<typeof config, "POST">;
 * ```
 */

/**
 * Extract the Config type from a createFormEndpoint call
 */
export type ExtractConfig<T> =
  T extends CreateFormEndpointConfig<
    infer TScopedTranslationKey,
    infer TExampleKey,
    infer TUserRoleValue,
    infer TFields,
    infer TMethods
  >
    ? CreateFormEndpointConfig<
        TScopedTranslationKey,
        TExampleKey,
        TUserRoleValue,
        TFields,
        TMethods
      >
    : never;

/**
 * Extract RequestOutput type for a specific method from config
 */
export type ExtractMethodRequestOutput<
  TConfig extends {
    fields: UnifiedField<string, z.ZodTypeAny>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: Record<string, any>;
  },
  TMethodKey extends "GET" | "POST" | "PATCH" | "DELETE",
> = TConfig extends { fields: infer TFields; methods: infer TMethods }
  ? TFields extends UnifiedField<infer TScopedTranslationKey, z.ZodTypeAny>
    ? TMethodKey extends keyof TMethods
      ? InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethodKey extends "GET"
            ? Methods.GET
            : TMethodKey extends "POST"
              ? Methods.POST
              : TMethodKey extends "PATCH"
                ? Methods.PATCH
                : Methods.DELETE,
          FieldUsage.RequestData
        >
      : never
    : never
  : never;

/**
 * Extract ResponseOutput type for a specific method from config
 */
export type ExtractMethodResponseOutput<
  TConfig extends {
    fields: UnifiedField<string, z.ZodTypeAny>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: Record<string, any>;
  },
  TMethodKey extends "GET" | "POST" | "PATCH" | "DELETE",
> = TConfig extends { fields: infer TFields; methods: infer TMethods }
  ? TFields extends UnifiedField<infer TScopedTranslationKey, z.ZodTypeAny>
    ? TMethodKey extends keyof TMethods
      ? InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethodKey extends "GET"
            ? Methods.GET
            : TMethodKey extends "POST"
              ? Methods.POST
              : TMethodKey extends "PATCH"
                ? Methods.PATCH
                : Methods.DELETE,
          FieldUsage.ResponseData
        >
      : never
    : never
  : never;

/**
 * Extract UrlVariablesOutput type for a specific method from config
 */
export type ExtractMethodUrlVariablesOutput<
  TConfig extends {
    fields: UnifiedField<string, z.ZodTypeAny>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: Record<string, any>;
  },
  TMethodKey extends "GET" | "POST" | "PATCH" | "DELETE",
> = TConfig extends { fields: infer TFields; methods: infer TMethods }
  ? TFields extends UnifiedField<infer TScopedTranslationKey, z.ZodTypeAny>
    ? TMethodKey extends keyof TMethods
      ? InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethodKey extends "GET"
            ? Methods.GET
            : TMethodKey extends "POST"
              ? Methods.POST
              : TMethodKey extends "PATCH"
                ? Methods.PATCH
                : Methods.DELETE,
          FieldUsage.RequestUrlParams
        >
      : never
    : never
  : never;

// ============================================================================
// METHOD-SPECIFIC SCHEMA GENERATORS
// ============================================================================

/**
 * Transform method-specific field to simple field for a specific method
 * This converts fields with method-specific usage to simple usage patterns
 * @deprecated - Replaced by generateSchemaForMethodAndUsage
 * Note: This function is used recursively within itself
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transformFieldForMethod<F>(field: F, method: Methods): F {
  interface FieldWithType {
    type: "primitive" | "object" | "array";
    usage?: FieldUsageConfig;
    children?: Record<string, UnifiedField<string, z.ZodTypeAny>>;
    child?: UnifiedField<string, z.ZodTypeAny>;
  }

  const typedField = field as F & FieldWithType;

  if (typedField.type === "primitive") {
    // Check if field has method-specific usage
    if (typedField.usage && isMethodSpecificUsage(typedField.usage)) {
      const methodSpecificUsage = typedField.usage as Record<
        string,
        {
          request?: "data" | "urlPathParams" | "data&urlPathParams";
          response?: boolean;
        }
      >;
      const methodUsage = methodSpecificUsage[method];
      if (!methodUsage) {
        // Method not supported for this field - return field with empty usage that will result in z.never()
        return {
          ...field,
          usage: {},
        } as F;
      }
      return {
        ...field,
        usage: methodUsage,
      } as F;
    }
    // Return field with original usage (might be simple usage)
    return field;
  }

  if (typedField.type === "object") {
    // Transform object field usage
    let objectUsage = typedField.usage;
    if (typedField.usage && isMethodSpecificUsage(typedField.usage)) {
      const methodSpecificUsage = typedField.usage as Record<
        string,
        {
          request?: "data" | "urlPathParams" | "data&urlPathParams";
          response?: boolean;
        }
      >;
      const methodUsage = methodSpecificUsage[method];
      if (!methodUsage) {
        // Method not supported for this object - use empty usage
        objectUsage = {};
      } else {
        objectUsage = methodUsage as FieldUsageConfig;
      }
    }

    // Transform all children recursively
    const transformedChildren: Record<string, UnifiedField<string, z.ZodTypeAny>> = {};
    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        transformedChildren[key] = transformFieldForMethod(childField, method);
      }
    }

    return {
      ...field,
      usage: objectUsage,
      children: transformedChildren,
    } as F;
  }

  if (typedField.type === "array") {
    // Transform array field usage
    let arrayUsage = typedField.usage;
    if (typedField.usage && isMethodSpecificUsage(typedField.usage)) {
      const methodSpecificUsage = typedField.usage as Record<
        string,
        {
          request?: "data" | "urlPathParams" | "data&urlPathParams";
          response?: boolean;
        }
      >;
      const methodUsage = methodSpecificUsage[method];
      if (!methodUsage) {
        // Method not supported for this array - use empty usage
        arrayUsage = {};
      } else {
        arrayUsage = methodUsage as FieldUsageConfig;
      }
    }

    // Transform child field recursively
    const transformedChild = typedField.child
      ? transformFieldForMethod(typedField.child, method)
      : undefined;

    return {
      ...field,
      usage: arrayUsage,
      child: transformedChild,
    } as F;
  }

  return field;
}

/**
 * Generate schema for method-specific usage with proper field filtering
 * This function correctly handles method-specific usage patterns where individual fields
 * may have different usage patterns than their parent object
 */
export function generateSchemaForMethodAndUsage<F, Usage extends FieldUsage>(
  field: F,
  method: Methods,
  targetUsage: Usage,
): z.ZodTypeAny {
  interface FieldWithType {
    type: "primitive" | "object" | "array";
    usage?: FieldUsageConfig;
    schema?: z.ZodTypeAny;
    children?: Record<string, UnifiedField<string, z.ZodTypeAny>>;
    child?: UnifiedField<string, z.ZodTypeAny>;
  }

  const typedField = field as F & FieldWithType;
  const hasMethodSpecificUsage = (usage: FieldUsageConfig | undefined): boolean => {
    if (!usage) {
      return false;
    }

    // Check if the usage object has any method keys
    // Handle both computed property syntax [Methods.X] and string keys "X"
    const usageObj = usage as Record<string, FieldUsageConfig>;
    return (
      "GET" in usageObj ||
      "POST" in usageObj ||
      "PUT" in usageObj ||
      "PATCH" in usageObj ||
      "DELETE" in usageObj ||
      Methods.GET in usageObj ||
      Methods.POST in usageObj ||
      Methods.PUT in usageObj ||
      Methods.PATCH in usageObj ||
      Methods.DELETE in usageObj
    );
  };

  const getUsageForMethod = (
    usage: FieldUsageConfig | undefined,
    method: Methods,
  ): FieldUsageConfig | undefined => {
    if (!usage) {
      return undefined;
    }
    if (!hasMethodSpecificUsage(usage)) {
      return usage;
    }

    // Handle method-specific usage extraction with support for both formats
    // Use flexible Record type to handle both computed property syntax and string keys
    const methodSpecificUsage = usage as Record<
      string,
      {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: boolean;
      }
    >;

    // Try to get usage with both enum value and string key
    let methodUsage = methodSpecificUsage[method]; // Try enum value first (e.g., "POST")
    if (!methodUsage) {
      // Try string key as fallback (handles computed property syntax issues)
      const stringKey = method.toString();
      methodUsage = methodSpecificUsage[stringKey];
    }

    return methodUsage ? convertMethodUsageToStandard(methodUsage) : undefined;
  };

  const convertMethodUsageToStandard = (methodUsage: {
    request?: "data" | "urlPathParams" | "data&urlPathParams";
    response?: boolean;
  }): FieldUsageConfig => {
    if (methodUsage.request && methodUsage.response) {
      // Both request and response
      return {
        request: methodUsage.request,
        response: true,
      } as FieldUsageConfig;
    } else if (methodUsage.request) {
      // Request only
      return { request: methodUsage.request } as FieldUsageConfig;
    } else if (methodUsage.response) {
      // Response only
      return { response: true } as FieldUsageConfig;
    }

    // Empty usage
    return {} as FieldUsageConfig;
  };

  const hasTargetUsage = (usage: FieldUsageConfig | undefined): boolean => {
    if (!usage) {
      return false;
    }

    switch (targetUsage) {
      case FieldUsage.ResponseData:
        return "response" in usage && usage.response === true;
      case FieldUsage.RequestData:
        return (
          "request" in usage && (usage.request === "data" || usage.request === "data&urlPathParams")
        );
      case FieldUsage.RequestUrlParams:
        return (
          "request" in usage &&
          (usage.request === "urlPathParams" || usage.request === "data&urlPathParams")
        );
      default:
        return false;
    }
  };

  if (typedField.type === "primitive") {
    const methodUsage = getUsageForMethod(typedField.usage, method);
    if (methodUsage && hasTargetUsage(methodUsage)) {
      return typedField.schema ?? z.never();
    }
    return z.never();
  }

  if (typedField.type === "object") {
    // Build shape object by processing children FIRST
    // Children can have different usage than container (e.g., URL params even if container doesn't declare them)
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        const childSchema = generateSchemaForMethodAndUsage(childField, method, targetUsage);
        if (!(childSchema instanceof z.ZodNever)) {
          shape[key] = childSchema;
        }
      }
    }

    // If we have matching children, return the object
    if (Object.keys(shape).length > 0) {
      return z.object(shape);
    }

    // No matching children - check if container itself should be included
    const objectMethodUsage = getUsageForMethod(typedField.usage, method);
    if (!objectMethodUsage || !hasTargetUsage(objectMethodUsage)) {
      return z.never();
    }

    // Container matches but no children - return empty object
    return z.object({});
  }

  if (typedField.type === "array") {
    const methodUsage = getUsageForMethod(typedField.usage, method);
    if (methodUsage && hasTargetUsage(methodUsage) && typedField.child) {
      const childSchema = generateSchemaForMethodAndUsage(typedField.child, method, targetUsage);
      return childSchema instanceof z.ZodNever ? z.never() : z.array(childSchema);
    }
    return z.never();
  }

  return z.never();
}

/**
 * Generate request data schema for a specific HTTP method using proper method-specific filtering
 */
export function generateRequestDataSchemaForMethod<F>(field: F, method: Methods): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(field, method, FieldUsage.RequestData);
}

/**
 * Generate response schema for a specific HTTP method using proper method-specific filtering
 */
export function generateResponseSchemaForMethod<F>(field: F, method: Methods): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(field, method, FieldUsage.ResponseData);
}

/**
 * Generate request URL params schema for a specific HTTP method using proper method-specific filtering
 */
export function generateRequestUrlSchemaForMethod<F>(field: F, method: Methods): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(field, method, FieldUsage.RequestUrlParams);
}

/**
 * Create a form endpoint with GET, POST, PATCH, and/or DELETE methods
 *
 * This utility creates multiple endpoints that share field definitions using method-specific usage patterns.
 * Each method can have different field usage (request/response) defined in the field's usage configuration.
 *
 * @param config Configuration for the form endpoint with method-specific settings
 * @returns Object with endpoint definitions for the specified HTTP methods
 */
export function createFormEndpoint<
  const TScopedTranslationKey extends string,
  const TFields extends UnifiedField<TScopedTranslationKey, z.ZodTypeAny>,
  const TExampleKey extends string,
  const TUserRoleValue extends readonly UserRoleValue[],
  const TMethods extends {
    GET?: FormMethodConfig<TScopedTranslationKey>;
    POST?: FormMethodConfig<TScopedTranslationKey>;
    PATCH?: FormMethodConfig<TScopedTranslationKey>;
    DELETE?: FormMethodConfig<TScopedTranslationKey>;
  },
>(
  config: CreateFormEndpointConfig<
    TScopedTranslationKey,
    TExampleKey,
    TUserRoleValue,
    TFields,
    TMethods
  >,
): CreateFormEndpointReturn<TExampleKey, TUserRoleValue, TScopedTranslationKey, TFields, TMethods> {
  // Generate schemas directly from the original fields with method-specific filtering

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

  // Helper function for authentication check
  const requiresAuthentication = (): boolean => {
    return !config.allowedRoles.includes(UserRole.PUBLIC);
  };

  // Helper to create properly typed endpoint
  const createMethodEndpoint = <TMethod extends Methods>(
    method: TMethod,
    methodConfig: FormMethodConfig<TScopedTranslationKey>,
    requestSchema: InferSchemaFromFieldForMethod<
      TScopedTranslationKey,
      TFields,
      TMethod,
      FieldUsage.RequestData
    >,
    responseSchema: InferSchemaFromFieldForMethod<
      TScopedTranslationKey,
      TFields,
      TMethod,
      FieldUsage.ResponseData
    >,
    urlSchema: InferSchemaFromFieldForMethod<
      TScopedTranslationKey,
      TFields,
      TMethod,
      FieldUsage.RequestUrlParams
    >,
    examples: (ExtractInput<
      InferSchemaFromFieldForMethod<TScopedTranslationKey, TFields, TMethod, FieldUsage.RequestData>
    > extends undefined
      ? { requests?: undefined }
      : ExtractInput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              TMethod,
              FieldUsage.RequestData
            >
          > extends never
        ? { requests?: undefined }
        : {
            requests: ExamplesList<
              ExtractInput<
                InferSchemaFromFieldForMethod<
                  TScopedTranslationKey,
                  TFields,
                  TMethod,
                  FieldUsage.RequestData
                >
              >,
              TExampleKey
            >;
          }) &
      (ExtractInput<
        InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.RequestUrlParams
        >
      > extends undefined
        ? { urlPathParams?: undefined }
        : ExtractInput<
              InferSchemaFromFieldForMethod<
                TScopedTranslationKey,
                TFields,
                TMethod,
                FieldUsage.RequestUrlParams
              >
            > extends never
          ? { urlPathParams?: undefined }
          : {
              urlPathParams: ExamplesList<
                ExtractInput<
                  InferSchemaFromFieldForMethod<
                    TScopedTranslationKey,
                    TFields,
                    TMethod,
                    FieldUsage.RequestUrlParams
                  >
                >,
                TExampleKey
              >;
            }) & {
        responses: ExamplesList<
          ExtractOutput<
            InferSchemaFromFieldForMethod<
              TScopedTranslationKey,
              TFields,
              TMethod,
              FieldUsage.ResponseData
            >
          >,
          TExampleKey
        >;
      },
  ): MethodSpecificEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  > => {
    return {
      method,
      path: config.path,
      title: methodConfig.title,
      description: methodConfig.description,
      category: config.category,
      tags: methodConfig.tags,
      allowedRoles: config.allowedRoles,
      debug: config.debug,
      aliases: methodConfig.aliases,
      icon: methodConfig.icon,
      fields: config.fields,
      errorTypes: config.errorTypes,
      successTypes: config.successTypes,
      examples: examples as never,
      requestSchema: requestSchema as never,
      responseSchema: responseSchema as never,
      requestUrlPathParamsSchema: urlSchema as never,
      requiresAuthentication,
      scopedTranslation: config.scopedTranslation ?? defaultScopedTranslation,
      types: {
        RequestInput: undefined! as InferInputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.RequestData
        >,
        RequestOutput: undefined! as InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.RequestData
        >,
        ResponseInput: undefined! as InferInputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.ResponseData
        >,
        ResponseOutput: undefined! as InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.ResponseData
        >,
        UrlVariablesInput: undefined! as InferInputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.RequestUrlParams
        >,
        UrlVariablesOutput: undefined! as InferOutputFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          TMethod,
          FieldUsage.RequestUrlParams
        >,
        Fields: undefined! as TFields,
        ExampleKey: undefined! as TExampleKey,
        Method: undefined! as TMethod,
        UserRoleValue: undefined! as TUserRoleValue,
        ScopedTranslationKey: undefined! as TScopedTranslationKey,
      },
    };
  };

  // Cast fields to TFields since the conditional type is for validation only
  const fields = config.fields as TFields;

  // Create endpoints using the helper function with proper type assertions
  const getEndpoint = config.methods.GET
    ? createMethodEndpoint(
        Methods.GET,
        config.methods.GET as FormMethodConfig<TScopedTranslationKey>,
        generateRequestDataSchemaForMethod(fields, Methods.GET) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.GET,
          FieldUsage.RequestData
        >,
        generateResponseSchemaForMethod(fields, Methods.GET) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.GET,
          FieldUsage.ResponseData
        >,
        generateRequestUrlSchemaForMethod(fields, Methods.GET) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.GET,
          FieldUsage.RequestUrlParams
        >,
        (config.examples.GET || {
          requests: undefined,
          responses: undefined as never,
          urlPathParams: undefined,
        }) as never,
      )
    : undefined;

  const postEndpoint = config.methods.POST
    ? createMethodEndpoint(
        Methods.POST,
        config.methods.POST as FormMethodConfig<TScopedTranslationKey>,
        generateRequestDataSchemaForMethod(fields, Methods.POST) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.POST,
          FieldUsage.RequestData
        >,
        generateResponseSchemaForMethod(fields, Methods.POST) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.POST,
          FieldUsage.ResponseData
        >,
        generateRequestUrlSchemaForMethod(fields, Methods.POST) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.POST,
          FieldUsage.RequestUrlParams
        >,
        (config.examples.POST || {
          requests: {} as never,
          responses: {} as never,
          urlPathParams: undefined,
        }) as never,
      )
    : undefined;

  const patchEndpoint = config.methods.PATCH
    ? createMethodEndpoint(
        Methods.PATCH,
        config.methods.PATCH as FormMethodConfig<TScopedTranslationKey>,
        generateRequestDataSchemaForMethod(fields, Methods.PATCH) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.PATCH,
          FieldUsage.RequestData
        >,
        generateResponseSchemaForMethod(fields, Methods.PATCH) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.PATCH,
          FieldUsage.ResponseData
        >,
        generateRequestUrlSchemaForMethod(fields, Methods.PATCH) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.PATCH,
          FieldUsage.RequestUrlParams
        >,
        (config.examples.PATCH || {
          requests: {} as never,
          responses: {} as never,
          urlPathParams: undefined,
        }) as never,
      )
    : undefined;

  const deleteEndpoint = config.methods.DELETE
    ? createMethodEndpoint(
        Methods.DELETE,
        config.methods.DELETE as FormMethodConfig<TScopedTranslationKey>,
        generateRequestDataSchemaForMethod(fields, Methods.DELETE) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.DELETE,
          FieldUsage.RequestData
        >,
        generateResponseSchemaForMethod(fields, Methods.DELETE) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.DELETE,
          FieldUsage.ResponseData
        >,
        generateRequestUrlSchemaForMethod(fields, Methods.DELETE) as InferSchemaFromFieldForMethod<
          TScopedTranslationKey,
          TFields,
          Methods.DELETE,
          FieldUsage.RequestUrlParams
        >,
        (config.examples.DELETE || {
          requests: {} as never,
          responses: {} as never,
          urlPathParams: undefined,
        }) as never,
      )
    : undefined;

  // Return object - let overload signatures provide the type
  return {
    ...(getEndpoint && { GET: getEndpoint }),
    ...(postEndpoint && { POST: postEndpoint }),
    ...(patchEndpoint && { PATCH: patchEndpoint }),
    ...(deleteEndpoint && { DELETE: deleteEndpoint }),
  } as CreateFormEndpointReturn<
    TExampleKey,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TMethods
  >;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Type guard to check if usage is method-specific format
 */
function isMethodSpecificUsage(usage: FieldUsageConfig): boolean {
  const hasMethodKeys =
    Methods.GET in usage ||
    Methods.POST in usage ||
    Methods.PUT in usage ||
    Methods.PATCH in usage ||
    Methods.DELETE in usage;

  return hasMethodKeys;
}
