/**
 * Field Utilities
 *
 * Utility functions for creating and working with unified fields.
 * These utilities were moved from individual definition files for better organization.
 */

import { z } from "zod";

import type {
  ArrayField,
  ArrayOptionalField,
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  ObjectOptionalField,
  PrimitiveField,
  UnifiedField,
} from "../types/endpoint";
import type { CacheStrategy } from "../types/enums";
import { FieldUsage } from "../types/enums";
import type { WidgetConfig } from "../types/widget-configs";

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a Zod schema
 */
function isZodSchema(value: unknown): value is z.ZodTypeAny {
  return typeof value === "object" && value !== null && "_def" in value;
}

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
  ui: WidgetConfig,
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
  ui: WidgetConfig,
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
  ui: WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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
  TUIConfig extends WidgetConfig = WidgetConfig,
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

/**
 * Create an optional object field containing other fields
 * Use when the entire object can be absent/null/undefined
 */
export function objectOptionalField<
  C,
  U extends FieldUsageConfig,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  ui: TUIConfig,
  usage: U,
  children: C,
  cache?: CacheStrategy,
): ObjectOptionalField<C, U, TUIConfig> {
  return {
    type: "object-optional" as const,
    children,
    usage,
    ui,
    cache,
  };
}

/**
 * Create an optional array field containing repeated items
 * Use when the entire array can be absent/null/undefined
 */
export function arrayOptionalField<
  Child,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  usage: FieldUsageConfig,
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<Child, FieldUsageConfig, TUIConfig> {
  return {
    type: "array-optional" as const,
    child,
    usage,
    ui,
    cache,
  };
}

/**
 * Create an optional request array field with specific request usage
 */
export function requestDataArrayOptionalField<
  Child,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<Child, { request: "data" }, TUIConfig> {
  return {
    type: "array-optional" as const,
    child,
    usage: { request: "data" },
    ui,
    cache,
  };
}

/**
 * Create an optional response array field with specific response usage
 */
export function responseArrayOptionalField<
  Child,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<Child, { response: true }, TUIConfig> {
  return {
    type: "array-optional" as const,
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
 * Check if a field has optional flag in UI config
 * This type checks at the VALUE level, not just the type level
 * It preserves literal types when the UI config is passed with proper inference
 */
type IsOptionalField<F> =
  // Check if field type is explicitly optional (array-optional, object-optional)
  F extends { type: "array-optional" | "object-optional" }
    ? true
    : // Otherwise check ui.optional flag
      F extends {
          ui: infer UI;
        }
      ? UI extends { optional?: infer O }
        ? [O] extends [true]
          ? true
          : [O] extends [false]
            ? false
            : false
        : false
      : false;

/**
 * Make type optional with nullable support (T | null | undefined)
 */
type MakeOptional<T, IsOptional extends boolean> = IsOptional extends true
  ? T | null | undefined
  : T;

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
            type: "array" | "array-optional";
            child: infer Child;
            usage: infer U;
          }
        ? Usage extends FieldUsage.Response
          ? HasResponseUsage<U> extends true
            ? MakeOptional<Array<InferFieldType<Child, Usage>>, IsOptionalField<F>>
            : never
          : Usage extends FieldUsage.RequestData
            ? HasRequestDataUsage<U> extends true
              ? MakeOptional<Array<InferFieldType<Child, Usage>>, IsOptionalField<F>>
              : never
            : Usage extends FieldUsage.RequestUrlParams
              ? HasRequestUrlParamsUsage<U> extends true
                ? MakeOptional<Array<InferFieldType<Child, Usage>>, IsOptionalField<F>>
                : never
              : never
        : F extends {
              type: "object" | "object-optional";
              children: infer C;
              usage: infer U;
            }
          ? Usage extends FieldUsage.Response
            ? HasResponseUsage<U> extends true
              ? MakeOptional<InferObjectType<C, Usage>, IsOptionalField<F>>
              : never
            : Usage extends FieldUsage.RequestData
              ? HasRequestDataUsage<U> extends true
                ? MakeOptional<InferObjectType<C, Usage>, IsOptionalField<F>>
                : never
              : Usage extends FieldUsage.RequestUrlParams
                ? HasRequestUrlParamsUsage<U> extends true
                  ? MakeOptional<InferObjectType<C, Usage>, IsOptionalField<F>>
                  : never
                : never
          : F extends { type: "object" | "object-optional"; children: infer C }
            ? MakeOptional<InferObjectType<C, Usage>, IsOptionalField<F>>
            : never
    : never;

/**
 * Infer object type from children fields
 * Uses flexible constraint that accepts both readonly and mutable properties
 * Checks each field's optional flag to make properties optional in the resulting type
 */
export type InferObjectType<C, Usage extends FieldUsage> =
  C extends Record<string, UnifiedField<z.ZodTypeAny>>
    ? {
        -readonly [K in keyof C as InferFieldType<C[K], Usage> extends never
          ? never
          : IsOptionalField<C[K]> extends true
            ? never
            : K]: InferFieldType<C[K], Usage>;
      } & {
        -readonly [K in keyof C as InferFieldType<C[K], Usage> extends never
          ? never
          : IsOptionalField<C[K]> extends true
            ? K
            : never]?: InferFieldType<C[K], Usage>;
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
    type: "primitive" | "object" | "array" | "array-optional";
    usage?: FieldUsageConfig;
    schema?: z.ZodTypeAny;
    children?: Record<string, UnifiedField<z.ZodTypeAny>>;
    child?: UnifiedField<z.ZodTypeAny>;
    ui?: WidgetConfig;
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
    let objectSchema = z.object(shape);

    // Apply optional modifier if specified in UI config
    if (typedField.ui && "optional" in typedField.ui && typedField.ui.optional) {
      return objectSchema.nullable().optional() as unknown as InferSchemaFromField<F, Usage>;
    }

    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "array") {
    if (hasUsage(typedField.usage)) {
      // Check if child exists
      if (!typedField.child) {
        return z.never() as InferSchemaFromField<F, Usage>;
      }

      let childSchema: z.ZodTypeAny;
      if (isZodSchema(typedField.child)) {
        // Child is already a Zod schema, use it directly
        childSchema = typedField.child;
      } else {
        // Child is a UnifiedField, generate schema from it
        childSchema = generateSchemaForUsage(typedField.child, targetUsage);
        // Check if schema is z.never() using instanceof check
        if (childSchema instanceof z.ZodNever) {
          return z.never() as InferSchemaFromField<F, Usage>;
        }
      }

      let arraySchema = z.array(childSchema);

      // Apply optional modifier if specified in UI config
      if (typedField.ui && "optional" in typedField.ui && typedField.ui.optional) {
        return arraySchema.nullable().optional() as unknown as InferSchemaFromField<F, Usage>;
      }

      return arraySchema as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "array-optional") {
    if (hasUsage(typedField.usage)) {
      // Check if child exists
      if (!typedField.child) {
        return z.never() as InferSchemaFromField<F, Usage>;
      }

      let childSchema: z.ZodTypeAny;
      if (isZodSchema(typedField.child)) {
        // Child is already a Zod schema, use it directly
        childSchema = typedField.child;
      } else {
        // Child is a UnifiedField, generate schema from it
        childSchema = generateSchemaForUsage(typedField.child, targetUsage);
        // Check if schema is z.never() using instanceof check
        if (childSchema instanceof z.ZodNever) {
          return z.never() as InferSchemaFromField<F, Usage>;
        }
      }

      // For array-optional, always apply nullable and optional
      const arraySchema = z.array(childSchema).nullable().optional();

      return arraySchema as unknown as InferSchemaFromField<F, Usage>;
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
