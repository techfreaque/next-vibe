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

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { type CreateApiEndpoint } from "../endpoint/create";
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
} from "../types/endpoint";
import type { EndpointErrorTypes } from "../types/enums";
import { FieldUsage, Methods } from "../types/enums";

/**
 * Configuration for a single method in a form endpoint
 */
export interface FormMethodConfig {
  readonly title: TranslationKey;
  readonly description: TranslationKey;
  readonly tags: TranslationKey[];
  readonly aliases?: string[];
}

/**
 * Examples configuration for form endpoints
 * ✅ FIXED: Now uses method-specific type inference
 */
export interface FormExamples<
  TFields extends UnifiedField<z.ZodTypeAny>,
  TExampleKey extends string,
> {
  readonly GET?: {
    requests?: ExtractInput<
      InferSchemaFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestData
      >
    > extends never
      ? undefined
      : ExamplesList<
          ExtractInput<
            InferSchemaFromFieldForMethod<
              TFields,
              Methods.GET,
              FieldUsage.RequestData
            >
          >,
          TExampleKey
        >;
    responses: ExamplesList<
      ExtractOutput<
        InferSchemaFromFieldForMethod<TFields, Methods.GET, FieldUsage.Response>
      >,
      TExampleKey
    >;
    urlPathParams?: ExtractInput<
      InferSchemaFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestUrlParams
      >
    > extends never
      ? undefined
      : ExamplesList<
          ExtractInput<
            InferSchemaFromFieldForMethod<
              TFields,
              Methods.GET,
              FieldUsage.RequestUrlParams
            >
          >,
          TExampleKey
        >;
  };
  readonly POST?: {
    requests?: ExtractInput<
      InferSchemaFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestData
      >
    > extends never
      ? undefined
      : ExamplesList<
          ExtractInput<
            InferSchemaFromFieldForMethod<
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
          TFields,
          Methods.POST,
          FieldUsage.Response
        >
      >,
      TExampleKey
    >;
    urlPathParams?: ExtractInput<
      InferSchemaFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestUrlParams
      >
    > extends never
      ? undefined
      : ExamplesList<
          ExtractInput<
            InferSchemaFromFieldForMethod<
              TFields,
              Methods.POST,
              FieldUsage.RequestUrlParams
            >
          >,
          TExampleKey
        >;
  };
}

/**
 * Configuration for creating a form endpoint with GET and POST methods
 */
export interface CreateFormEndpointConfig<
  TExampleKey extends string,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
> {
  // Shared configuration
  readonly path: readonly string[];
  readonly category: TranslationKey;
  readonly allowedRoles: TUserRoleValue;

  readonly debug?: boolean;

  // Method-specific configuration
  readonly methods: {
    readonly GET: FormMethodConfig;
    readonly POST: FormMethodConfig;
  };

  // Shared field definitions - will be automatically adapted for each method
  readonly fields: TFields;

  // Shared error and success configuration
  readonly errorTypes: Record<
    EndpointErrorTypes,
    {
      title: TranslationKey;
      description: TranslationKey;
    }
  >;
  readonly successTypes: {
    title: TranslationKey;
    description: TranslationKey;
  };

  // Method-specific examples
  readonly examples: FormExamples<TFields, TExampleKey>;
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
          : TTargetUsage extends FieldUsage.Response
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
        : TTargetUsage extends FieldUsage.Response
          ? TUsage extends { response: true }
            ? true
            : false
          : false;

/**
 * Filter schema for a specific method and usage type
 */
export type FilterSchemaForMethod<
  TFields,
  TTargetUsage extends FieldUsage,
  TMethod extends Methods,
> =
  TFields extends PrimitiveField<infer TSchema, FieldUsageConfig>
    ? SupportsMethodAndUsage<
        TFields["usage"],
        TMethod,
        TTargetUsage
      > extends true
      ? TSchema
      : z.ZodNever
    : TFields extends ObjectField<infer TChildren, FieldUsageConfig>
      ? SupportsMethodAndUsage<
          TFields["usage"],
          TMethod,
          TTargetUsage
        > extends true
        ? z.ZodObject<{
            [K in keyof TChildren as FilterSchemaForMethod<
              TChildren[K],
              TTargetUsage,
              TMethod
            > extends z.ZodNever
              ? never
              : K]: FilterSchemaForMethod<TChildren[K], TTargetUsage, TMethod>;
          }>
        : z.ZodNever
      : z.ZodNever;

/**
 * Method-specific endpoint type that extends CreateApiEndpoint
 * This ensures perfect type inference for each HTTP method and compatibility with hooks
 */
export type MethodSpecificEndpoint<
  TFields extends UnifiedField<z.ZodTypeAny>,
  TMethod extends Methods,
  TExampleKey extends string,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> = CreateApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>;

/**
 * Return type for createFormEndpoint - provides both GET and POST endpoints
 * Uses method-specific type inference for perfect type safety
 */
export interface CreateFormEndpointReturn<
  TFields extends UnifiedField<z.ZodTypeAny>,
  TExampleKey extends string,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> {
  readonly GET: MethodSpecificEndpoint<
    TFields,
    Methods.GET,
    TExampleKey,
    TUserRoleValue
  >;
  readonly POST: MethodSpecificEndpoint<
    TFields,
    Methods.POST,
    TExampleKey,
    TUserRoleValue
  >;
}

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
    children?: Record<string, UnifiedField<z.ZodTypeAny>>;
    child?: UnifiedField<z.ZodTypeAny>;
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
    const transformedChildren: Record<string, UnifiedField<z.ZodTypeAny>> = {};
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
    children?: Record<string, UnifiedField<z.ZodTypeAny>>;
    child?: UnifiedField<z.ZodTypeAny>;
  }

  const typedField = field as F & FieldWithType;
  const hasMethodSpecificUsage = (
    usage: FieldUsageConfig | undefined,
  ): boolean => {
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
      case FieldUsage.Response:
        return "response" in usage && usage.response === true;
      case FieldUsage.RequestData:
        return (
          "request" in usage &&
          (usage.request === "data" || usage.request === "data&urlPathParams")
        );
      case FieldUsage.RequestUrlParams:
        return (
          "request" in usage &&
          (usage.request === "urlPathParams" ||
            usage.request === "data&urlPathParams")
        );
      default:
        return false;
    }
  };

  if (typedField.type === "primitive") {
    const methodUsage = getUsageForMethod(typedField.usage, method);
    if (methodUsage && hasTargetUsage(methodUsage)) {
      return (
        typedField.schema ??
        (targetUsage === FieldUsage.RequestData ? z.undefined() : z.never())
      );
    }
    return targetUsage === FieldUsage.RequestData ? z.undefined() : z.never();
  }

  if (typedField.type === "object") {
    // Check if the object itself should be included for this method and usage
    const objectMethodUsage = getUsageForMethod(typedField.usage, method);
    if (!objectMethodUsage || !hasTargetUsage(objectMethodUsage)) {
      return targetUsage === FieldUsage.RequestData ? z.undefined() : z.never();
    }

    // Build shape object by recursively processing children
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        const childSchema = generateSchemaForMethodAndUsage(
          childField,
          method,
          targetUsage,
        );
        if (!(childSchema instanceof z.ZodNever)) {
          shape[key] = childSchema;
        }
      }
    }

    // If no children match this usage, return z.undefined() for request data, z.never() for others
    if (Object.keys(shape).length === 0) {
      return targetUsage === FieldUsage.RequestData ? z.undefined() : z.never();
    }

    return z.object(shape);
  }

  if (typedField.type === "array") {
    const methodUsage = getUsageForMethod(typedField.usage, method);
    if (methodUsage && hasTargetUsage(methodUsage) && typedField.child) {
      const childSchema = generateSchemaForMethodAndUsage(
        typedField.child,
        method,
        targetUsage,
      );
      return childSchema instanceof z.ZodNever
        ? targetUsage === FieldUsage.RequestData
          ? z.undefined()
          : z.never()
        : z.array(childSchema);
    }
    return targetUsage === FieldUsage.RequestData ? z.undefined() : z.never();
  }

  return targetUsage === FieldUsage.RequestData ? z.undefined() : z.never();
}

/**
 * Generate request data schema for a specific HTTP method using proper method-specific filtering
 */
export function generateRequestDataSchemaForMethod<F>(
  field: F,
  method: Methods,
): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(field, method, FieldUsage.RequestData);
}

/**
 * Generate response schema for a specific HTTP method using proper method-specific filtering
 */
export function generateResponseSchemaForMethod<F>(
  field: F,
  method: Methods,
): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(field, method, FieldUsage.Response);
}

/**
 * Generate request URL params schema for a specific HTTP method using proper method-specific filtering
 */
export function generateRequestUrlSchemaForMethod<F>(
  field: F,
  method: Methods,
): z.ZodTypeAny {
  return generateSchemaForMethodAndUsage(
    field,
    method,
    FieldUsage.RequestUrlParams,
  );
}

/**
 * Create a form endpoint with both GET and POST methods
 *
 * This utility creates two endpoints that share field definitions:
 * - GET: Uses fields as response-only (for fetching current data)
 * - POST: Uses fields as request+response (for updating data)
 *
 * ✅ FIXED: Now properly filters fields based on method-specific usage
 *
 * @param config Configuration for the form endpoint
 * @returns Object with GET and POST endpoint definitions
 */
export function createFormEndpoint<
  const TFields extends UnifiedField<z.ZodTypeAny>,
  TExampleKey extends string,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
>(
  config: CreateFormEndpointConfig<TExampleKey, TUserRoleValue, TFields>,
): CreateFormEndpointReturn<TFields, TExampleKey, TUserRoleValue> {
  // Generate schemas directly from the original fields with method-specific filtering
  const getRequestSchema = generateRequestDataSchemaForMethod(
    config.fields,
    Methods.GET,
  );
  const getResponseSchema = generateResponseSchemaForMethod(
    config.fields,
    Methods.GET,
  );
  const getUrlSchema = generateRequestUrlSchemaForMethod(
    config.fields,
    Methods.GET,
  );

  // Create GET endpoint with method-specific type inference
  const getEndpoint = {
    method: Methods.GET,
    path: config.path,
    title: config.methods.GET.title,
    description: config.methods.GET.description,
    category: config.category,
    tags: config.methods.GET.tags,
    allowedRoles: config.allowedRoles,
    debug: config.debug,
    aliases: config.methods.GET.aliases,
    fields: config.fields,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    examples: config.examples.GET || {
      requests: undefined,
      responses: undefined,
      urlPathParams: undefined,
    },
    requestSchema: getRequestSchema,
    responseSchema: getResponseSchema,
    requestUrlPathParamsSchema: getUrlSchema,
    types: {
      RequestInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestData
      >,
      RequestOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestData
      >,
      ResponseInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.Response
      >,
      ResponseOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.Response
      >,
      UrlVariablesInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestUrlParams
      >,
      UrlVariablesOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.GET,
        FieldUsage.RequestUrlParams
      >,
    },
  };

  // Generate schemas for POST method using original fields
  const postRequestSchema = generateRequestDataSchemaForMethod(
    config.fields,
    Methods.POST,
  );
  const postResponseSchema = generateResponseSchemaForMethod(
    config.fields,
    Methods.POST,
  );
  const postRequestUrlSchema = generateRequestUrlSchemaForMethod(
    config.fields,
    Methods.POST,
  );

  // Create POST endpoint with method-specific type inference
  const postEndpoint = {
    method: Methods.POST,
    path: config.path,
    title: config.methods.POST.title,
    description: config.methods.POST.description,
    category: config.category,
    tags: config.methods.POST.tags,
    allowedRoles: config.allowedRoles,
    debug: config.debug,
    aliases: config.methods.POST.aliases,
    fields: config.fields,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    examples: config.examples.POST || {
      requests: {},
      responses: {},
      urlPathParams: undefined,
    },
    requestSchema: postRequestSchema,
    responseSchema: postResponseSchema,
    requestUrlPathParamsSchema: postRequestUrlSchema,
    types: {
      RequestInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestData
      >,
      RequestOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestData
      >,
      ResponseInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.Response
      >,
      ResponseOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.Response
      >,
      UrlVariablesInput: null as InferInputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestUrlParams
      >,
      UrlVariablesOutput: null as InferOutputFromFieldForMethod<
        TFields,
        Methods.POST,
        FieldUsage.RequestUrlParams
      >,
    },
  };

  // Return the form endpoints
  // Type assertion needed: method-specific types are structurally compatible but TypeScript can't verify
  return {
    GET: getEndpoint as MethodSpecificEndpoint<
      TFields,
      Methods.GET,
      TExampleKey,
      TUserRoleValue
    >,

    POST: postEndpoint as MethodSpecificEndpoint<
      TFields,
      Methods.POST,
      TExampleKey,
      TUserRoleValue
    >,
  };
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
