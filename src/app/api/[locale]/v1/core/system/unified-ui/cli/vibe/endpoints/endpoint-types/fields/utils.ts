/**
 * Field Utilities
 *
 * Utility functions for creating and working with unified fields.
 * These utilities were moved from individual definition files for better organization.
 */

import { z } from "zod";

import type { CacheStrategy } from "../core/enums";
import { FieldUsage } from "../core/enums";
import type {
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "../core/types";
import type { WidgetConfig } from "../types";

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
  ui: WidgetConfig,
  cache?: CacheStrategy,
): PrimitiveField<TSchema> & { usage: TUsage } {
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
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: false,
): PrimitiveField<TSchema> & {
  usage: {
    request: "data";
    response: true;
  };
};
export function requestResponseField<TSchema extends z.ZodTypeAny>(
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: true,
): PrimitiveField<TSchema> & {
  usage: {
    request: "urlParams";
    response: true;
  };
};
export function requestResponseField<TSchema extends z.ZodTypeAny>(
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: boolean,
): PrimitiveField<TSchema> & {
  usage: {
    request: "data" | "urlParams";
    response: true;
  };
} {
  const requestType = requestAsUrlParams ? "urlParams" : "data";
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
export function requestDataField<TSchema extends z.ZodTypeAny>(
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema> & {
  usage: { request: "data" };
} {
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
export function requestUrlParamsField<TSchema extends z.ZodTypeAny>(
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema> & {
  usage: { request: "urlParams"; response?: never };
} {
  return {
    type: "primitive" as const,
    schema,
    usage: { request: "urlParams" },
    ui,
    cache,
  };
}

/**
 * Create a response field
 */
export function responseField<TSchema extends z.ZodTypeAny>(
  ui: WidgetConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema> & { usage: { response: true } } {
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
 */
export function objectField<
  const C extends Record<string, UnifiedField<z.ZodTypeAny>>,
  const U extends FieldUsageConfig,
>(
  ui: WidgetConfig,
  usage: U,
  children: C,
  cache?: CacheStrategy,
): ObjectField<C> & { usage: U } {
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
export function arrayField<Child extends UnifiedField<z.ZodTypeAny>>(
  usage: FieldUsageConfig,
  ui: WidgetConfig,
  child: Child,
  cache?: CacheStrategy,
): {
  type: "array";
  child: Child;
  usage: FieldUsageConfig;
  ui: WidgetConfig;
  cache?: CacheStrategy;
} {
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
export function requestDataArrayField<Child extends UnifiedField<z.ZodTypeAny>>(
  ui: WidgetConfig,
  child: Child,
  cache?: CacheStrategy,
): {
  type: "array";
  child: Child;
  usage: { request: "data" };
  ui: WidgetConfig;
  cache?: CacheStrategy;
} & { usage: { request: "data" } } {
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
export function responseArrayField<Child extends UnifiedField<z.ZodTypeAny>>(
  ui: WidgetConfig,
  child: Child,
  cache?: CacheStrategy,
): {
  type: "array";
  child: Child;
  usage: { response: true };
  ui: WidgetConfig;
  cache?: CacheStrategy;
} & { usage: { response: true } } {
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
  : U extends { request: "data&urlParams" }
    ? true
    : false;

/**
 * Check if a field usage has request URL params capability
 */
export type HasRequestUrlParamsUsage<U> = U extends { request: "urlParams" }
  ? true
  : U extends { request: "data&urlParams" }
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
export function generateSchemaForUsage<
  F extends UnifiedField<z.ZodTypeAny>,
  Usage extends FieldUsage,
>(field: F, targetUsage: Usage): InferSchemaFromField<F, Usage> {
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
          (usage.request === "data" || usage.request === "data&urlParams")
        );
      case FieldUsage.RequestUrlParams:
        return (
          "request" in usage &&
          (usage.request === "urlParams" || usage.request === "data&urlParams")
        );
      default:
        return false;
    }
  };

  if (field.type === "primitive") {
    if (hasUsage(field.usage)) {
      return field.schema as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (field.type === "object") {
    // Check if the object itself has the required usage
    if (field.usage && !hasUsage(field.usage)) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Build shape object with proper typing to preserve schema types
    // We need to avoid using Record<string, z.ZodTypeAny> which loses type information
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const [key, childField] of Object.entries(field.children)) {
      const childSchema = generateSchemaForUsage(childField, targetUsage);
      if (!(childSchema instanceof z.ZodNever)) {
        shape[key] = childSchema;
      }
    }

    // Create the object schema and let TypeScript infer the exact type
    // This preserves the specific field types instead of collapsing to ZodTypeAny
    const objectSchema = z.object(shape);
    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (field.type === "array") {
    if (hasUsage(field.usage)) {
      const childSchema = generateSchemaForUsage(field.child, targetUsage);
      return (
        childSchema instanceof z.ZodNever ? z.never() : z.array(childSchema)
      ) as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  return z.never() as InferSchemaFromField<F, Usage>;
}

// Utility types that work with z.ZodType<Output, ZodTypeDef, Input> to properly infer types
// These preserve the input/output type differentiation from Zod schemas

export type InferFieldSchemaInputType<
  F extends UnifiedField<z.ZodTypeAny>,
  Usage extends FieldUsage,
> = z.input<ReturnType<typeof generateSchemaForUsage<F, Usage>>>;

export type InferFieldSchemaOutputType<
  F extends UnifiedField<z.ZodTypeAny>,
  Usage extends FieldUsage,
> = z.output<ReturnType<typeof generateSchemaForUsage<F, Usage>>>;

/**
 * Generate request data schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateRequestDataSchema<F extends UnifiedField<z.ZodTypeAny>>(
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
export function generateRequestUrlSchema<F extends UnifiedField<z.ZodTypeAny>>(
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
export function generateResponseSchema<F extends UnifiedField<z.ZodTypeAny>>(
  field: F,
): InferSchemaFromField<F, FieldUsage.Response> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage(field, FieldUsage.Response);

  // Return the schema with its actual runtime type preserved
  return baseSchema;
}
