/**
 * Field Utilities
 *
 * Utility functions for creating and working with unified fields.
 * These utilities were moved from individual definition files for better organization.
 */

import { z } from "zod";

import type {
  ArrayField,
  FieldUIConfig,
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "./core-types";
import type { CacheStrategy } from "./enums";
import { FieldUsage } from "./enums";

// ============================================================================
// FIELD CREATORS
// ============================================================================

/**
 * Create a primitive field (string, number, boolean, etc.)
 */
export function field<
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
>(
  schema: TSchema,
  usage: TUsage,
  ui: FieldUIConfig,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, TUsage> {
  return {
    type: "primitive" as const,
    schema,
    usage,
    ui,
    cache,
  };
}

/**
 * Create a field that can be both request and response
 */
export function requestResponseField<TSchema extends z.ZodTypeAny>(
  ui: FieldUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: false,
): PrimitiveField<
  TSchema,
  {
    request: "data";
    response: true;
  }
>;
// eslint-disable-next-line no-redeclare
export function requestResponseField<TSchema extends z.ZodTypeAny>(
  ui: FieldUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: true,
): PrimitiveField<
  TSchema,
  {
    request: "urlPathParams";
    response: true;
  }
>;
// eslint-disable-next-line no-redeclare
export function requestResponseField<TSchema extends z.ZodTypeAny>(
  ui: FieldUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: boolean,
): PrimitiveField<
  TSchema,
  {
    request: "data" | "urlPathParams";
    response: true;
  }
> {
  const requestType = requestAsUrlParams ? "urlPathParams" : "data";
  return {
    type: "primitive" as const,
    schema,
    usage: { request: requestType, response: true },
    ui,
    cache,
  };
}

/**
 * Create a request data field
 */
export function requestDataField<
  TSchema extends z.ZodTypeAny,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, { request: "data" }, TUIConfig> {
  return {
    type: "primitive" as const,
    schema,
    usage: { request: "data" },
    ui,
    cache,
  };
}

/**
 * Create a request URL params field
 */
export function requestUrlPathParamsField<
  TSchema extends z.ZodTypeAny,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<
  TSchema,
  { request: "urlPathParams"; response?: never },
  TUIConfig
> {
  return {
    type: "primitive" as const,
    schema,
    usage: { request: "urlPathParams" },
    ui,
    cache,
  };
}

/**
 * Create a response field
 */
export function responseField<
  TSchema extends z.ZodTypeAny,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, { response: true }, TUIConfig> {
  return {
    type: "primitive" as const,
    schema,
    usage: { response: true },
    ui,
    cache,
  };
}

/**
 * Create an object field containing other fields
 * Accepts any object-like structure where all values are UnifiedFields
 */
export function objectField<
  C,
  U extends FieldUsageConfig,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  usage: U,
  children: C,
  cache?: CacheStrategy,
): ObjectField<C, U, TUIConfig> {
  return {
    type: "object" as const,
    children,
    usage,
    ui,
    cache,
  };
}

/**
 * Create an array field containing repeated items
 */
export function arrayField<
  Child,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  usage: FieldUsageConfig,
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, FieldUsageConfig, TUIConfig> {
  return {
    type: "array" as const,
    child,
    usage,
    ui,
    cache,
  };
}

/**
 * Create a request array field with specific request usage
 */
export function requestDataArrayField<
  Child,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, { request: "data" }, TUIConfig> {
  return {
    type: "array" as const,
    child,
    usage: { request: "data" },
    ui,
    cache,
  };
}

/**
 * Create a response array field with specific response usage
 */
export function responseArrayField<
  Child,
  TUIConfig extends FieldUIConfig = FieldUIConfig,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, { response: true }, TUIConfig> {
  return {
    type: "array" as const,
    child,
    usage: { response: true },
    ui,
    cache,
  };
}

// ============================================================================
// FIELD TYPE INFERENCE UTILITIES
// ============================================================================

/**
 * Check if a field usage has response capability
 */
export type HasResponseUsage<U> = U extends { response: true } ? true : false;

/**
 * Check if a field usage has request data capability
 */
export type HasRequestDataUsage<U> = U extends { request: "data" }
  ? true
  : U extends { request: "data&urlPathParams" }
    ? true
    : false;

/**
 * Check if a field usage has request URL params capability
 */
export type HasRequestUrlParamsUsage<U> = U extends { request: "urlPathParams" }
  ? true
  : U extends { request: "data&urlPathParams" }
    ? true
    : false;

/**
 * Extract the core properties of a field
 */
export type FieldCore<F> = F extends {
  type: infer T;
  usage: infer U;
  schema: infer S;
}
  ? { type: T; usage: U; schema: S }
  : F extends {
        type: infer T;
        usage: infer U;
      }
    ? { type: T; usage: U }
    : F extends {
          type: infer T;
          schema: infer S;
        }
      ? { type: T; schema: S }
      : F extends {
            type: infer T;
          }
        ? { type: T }
        : never;
/**
 * Infer field type based on usage
 */
export type InferFieldType<F, Usage extends FieldUsage> =
  F extends UnifiedField<infer TSchema>
    ? F extends {
        type: "primitive";
        usage: infer U;
      }
      ? Usage extends FieldUsage.Response
        ? HasResponseUsage<U> extends true
          ? z.output<TSchema>
          : never
        : Usage extends FieldUsage.RequestData
          ? HasRequestDataUsage<U> extends true
            ? z.output<TSchema>
            : never
          : Usage extends FieldUsage.RequestUrlParams
            ? HasRequestUrlParamsUsage<U> extends true
              ? z.output<TSchema>
              : never
            : never
      : F extends {
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
        : F extends {
              type: "object";
              children: infer C;
              usage: infer U;
            }
          ? Usage extends FieldUsage.Response
            ? HasResponseUsage<U> extends true
              ? InferObjectType<C, Usage>
              : never
            : Usage extends FieldUsage.RequestData
              ? HasRequestDataUsage<U> extends true
                ? InferObjectType<C, Usage>
                : never
              : Usage extends FieldUsage.RequestUrlParams
                ? HasRequestUrlParamsUsage<U> extends true
                  ? InferObjectType<C, Usage>
                  : never
                : never
          : F extends { type: "object"; children: infer C }
            ? InferObjectType<C, Usage>
            : never
    : never;

/**
 * Infer object type from children fields
 * Uses flexible constraint that accepts both readonly and mutable properties
 */
export type InferObjectType<C, Usage extends FieldUsage> =
  C extends Record<string, UnifiedField<z.ZodTypeAny>>
    ? {
        -readonly [K in keyof C as InferFieldType<C[K], Usage> extends never
          ? never
          : K]: InferFieldType<C[K], Usage>;
      }
    : never;

// ============================================================================
// SCHEMA GENERATION UTILITIES
// ============================================================================

/**
 * Generate schema for a specific usage from unified fields
 * CRITICAL: This function must preserve the actual Zod schema types to enable
 * proper input/output type differentiation using z.ZodType<Output, ZodTypeDef, Input>.
 *
 * We return the actual inferred schema type to preserve input/output differentiation.
 */
export function generateSchemaForUsage<F, Usage extends FieldUsage>(
  field: F,
  targetUsage: Usage,
): InferSchemaFromField<F, Usage> {
  // Defensive check: ensure field is defined
  if (!field || typeof field !== "object") {
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  const hasUsage = (usage: FieldUsageConfig | undefined): boolean => {
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

  interface FieldWithType {
    type: "primitive" | "object" | "array";
    usage?: FieldUsageConfig;
    schema?: z.ZodTypeAny;
    children?: Record<string, UnifiedField<z.ZodTypeAny>>;
    child?: UnifiedField<z.ZodTypeAny>;
  }

  const typedField = field as F & FieldWithType;

  if (typedField.type === "primitive") {
    if (hasUsage(typedField.usage)) {
      return typedField.schema as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "object") {
    // Check if the object itself has the required usage
    // If it has explicit usage that doesn't match, skip processing children
    const objectHasUsage = typedField.usage ? hasUsage(typedField.usage) : true;

    if (typedField.usage && !objectHasUsage) {
      // For request data, return empty object (endpoints with no parameters)
      // This is critical for OpenAI function calling which requires type: "object"
      if (targetUsage === FieldUsage.RequestData) {
        const emptySchema = z.object({});
        return emptySchema as InferSchemaFromField<F, Usage>;
      }
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Build shape object with proper typing to preserve schema types
    // We need to avoid using Record<string, z.ZodTypeAny> which loses type information
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        // Check if the child field has the required usage BEFORE generating the schema
        // This is more efficient and avoids issues with z.never() detection
        if (childField.usage) {
          const childHasUsage =
            targetUsage === FieldUsage.Response
              ? "response" in childField.usage &&
                childField.usage.response === true
              : targetUsage === FieldUsage.RequestData
                ? "request" in childField.usage &&
                  (childField.usage.request === "data" ||
                    childField.usage.request === "data&urlPathParams")
                : targetUsage === FieldUsage.RequestUrlParams
                  ? "request" in childField.usage &&
                    (childField.usage.request === "urlPathParams" ||
                      childField.usage.request === "data&urlPathParams")
                  : false;

          // Skip fields that don't have the required usage
          if (!childHasUsage) {
            continue;
          }
        }

        const childSchema = generateSchemaForUsage(childField, targetUsage);
        // Check if schema is z.never() using instanceof check
        if (!(childSchema instanceof z.ZodNever)) {
          shape[key] = childSchema;
        }
      }
    }

    // If no children matched the usage, return appropriate schema
    if (Object.keys(shape).length === 0) {
      // For request data, empty object is valid (endpoints with no parameters)
      // For other usages, z.never() is appropriate
      const emptySchema = z.object({});
      return (
        targetUsage === FieldUsage.RequestData ? emptySchema : z.never()
      ) as InferSchemaFromField<F, Usage>;
    }

    // Create the object schema and let TypeScript infer the exact type
    // This preserves the specific field types instead of collapsing to ZodTypeAny
    const objectSchema = z.object(shape);
    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "array") {
    if (hasUsage(typedField.usage)) {
      const childSchema = generateSchemaForUsage(typedField.child, targetUsage);
      // Check if schema is z.never() using instanceof check
      if (childSchema instanceof z.ZodNever) {
        return z.never() as InferSchemaFromField<F, Usage>;
      }
      return z.array(childSchema) as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  return z.never() as InferSchemaFromField<F, Usage>;
}

// Utility types that work with z.ZodType<Output, ZodTypeDef, Input> to properly infer types
// These preserve the input/output type differentiation from Zod schemas

export type InferFieldSchemaInputType<F, Usage extends FieldUsage> = z.input<
  ReturnType<typeof generateSchemaForUsage<F, Usage>>
>;

export type InferFieldSchemaOutputType<F, Usage extends FieldUsage> = z.output<
  ReturnType<typeof generateSchemaForUsage<F, Usage>>
>;

/**
 * Generate request data schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateRequestDataSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestData> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage(field, FieldUsage.RequestData);

  // Return the schema with its actual runtime type preserved
  // This is critical for ExtractInput<> and ExtractOutput<> to work correctly
  return baseSchema;
}

/**
 * Generate request URL params schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateRequestUrlSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestUrlParams> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage(field, FieldUsage.RequestUrlParams);

  // Return the schema with its actual runtime type preserved
  return baseSchema;
}

/**
 * Generate response schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateResponseSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.Response> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage(field, FieldUsage.Response);

  // Return the schema with its actual runtime type preserved
  return baseSchema;
}
