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
import type { WidgetConfig } from "../widgets/configs";

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
            ? MakeOptional<
                Array<InferFieldType<Child, Usage>>,
                IsOptionalField<F>
              >
            : never
          : Usage extends FieldUsage.RequestData
            ? HasRequestDataUsage<U> extends true
              ? MakeOptional<
                  Array<InferFieldType<Child, Usage>>,
                  IsOptionalField<F>
                >
              : never
            : Usage extends FieldUsage.RequestUrlParams
              ? HasRequestUrlParamsUsage<U> extends true
                ? MakeOptional<
                    Array<InferFieldType<Child, Usage>>,
                    IsOptionalField<F>
                  >
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
    if (
      typedField.ui &&
      "optional" in typedField.ui &&
      typedField.ui.optional
    ) {
      return objectSchema
        .nullable()
        .optional() as unknown as InferSchemaFromField<F, Usage>;
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
      if (
        typedField.ui &&
        "optional" in typedField.ui &&
        typedField.ui.optional
      ) {
        return arraySchema
          .nullable()
          .optional() as unknown as InferSchemaFromField<F, Usage>;
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

// ============================================================================
// ZOD SCHEMA UTILITIES FOR JSON SCHEMA CONVERSION
// ============================================================================

/**
 * Type for Zod internal _def structure
 * These are Zod internals not exposed in public API
 */
interface ZodInternalDef {
  typeName: string;
  schema?: z.ZodTypeAny;
  type?: z.ZodTypeAny;
  defaultValue?: unknown;
  left?: z.ZodTypeAny;
  right?: z.ZodTypeAny;
  [key: string]: unknown;
}

/**
 * Type for Zod schema with internal properties
 * Extends z.ZodTypeAny to maintain compatibility
 */
type ZodSchemaWithInternals = z.ZodTypeAny & {
  _def: ZodInternalDef;
  unwrap?: () => z.ZodTypeAny;
  removeDefault?: () => z.ZodTypeAny;
  shape?: Record<string, z.ZodTypeAny>;
  element?: z.ZodTypeAny;
  options?: z.ZodTypeAny[];
};

/**
 * Type-safe helper to check if schema has a property
 */
function hasSchemaProperty<T extends string>(
  obj: unknown,
  prop: T,
): obj is Record<T, unknown> {
  return (
    obj !== null && obj !== undefined && typeof obj === "object" && prop in obj
  );
}

/**
 * Helper to access Zod internals safely
 * This function serves as a type guard to access Zod's internal properties
 * At runtime, all z.ZodTypeAny instances have these internal properties
 */
function accessZodInternals(schema: z.ZodTypeAny): ZodSchemaWithInternals {
  // TypeScript doesn't know z.ZodTypeAny has these properties, but at runtime it does
  // This is a safe narrowing because we're just exposing properties that exist
  return schema as z.ZodTypeAny & ZodSchemaWithInternals;
}

/**
 * Strip transforms and refinements from a Zod schema to make it JSON Schema compatible
 * This is needed for AI tools, MCP, and other platforms that need JSON Schema
 * Transforms and refinements are runtime-only features that can't be represented in JSON Schema
 *
 * This implementation uses runtime property checking instead of type guards
 * to avoid issues with Zod v4 internal type changes
 *
 * Used by: AI SDK tools, MCP tools, OpenAPI docs, tRPC, etc.
 */
export function stripTransformsAndRefinements(
  schema: z.ZodTypeAny,
): z.ZodTypeAny {
  // Access Zod internal _def - this is a Zod internal structure
  const schemaWithInternals = accessZodInternals(schema);
  const schemaDef = schemaWithInternals._def;

  if (!schemaDef || typeof schemaDef.typeName !== "string") {
    return schema;
  }

  // Handle ZodEffects (transforms, refinements, preprocessors)
  if (
    schemaDef.typeName === "ZodEffects" &&
    hasSchemaProperty(schemaDef, "schema")
  ) {
    return stripTransformsAndRefinements(schemaDef.schema as z.ZodTypeAny);
  }

  // Handle ZodBranded - unwrap to underlying type
  // This handles cases like: z.string() as z.ZodType<TranslationKey>
  if (
    schemaDef.typeName === "ZodBranded" &&
    hasSchemaProperty(schemaDef, "type")
  ) {
    return stripTransformsAndRefinements(schemaDef.type as z.ZodTypeAny);
  }

  // Handle ZodOptional - has unwrap() method
  if (
    schemaDef.typeName === "ZodOptional" &&
    hasSchemaProperty(schema, "unwrap")
  ) {
    // Zod internal method access - unwrap() is not in public API
    const schemaWithInternals = accessZodInternals(schema);
    const unwrapped = stripTransformsAndRefinements(
      schemaWithInternals.unwrap!(),
    );
    return unwrapped.optional();
  }

  // Handle ZodNullable - has unwrap() method
  if (
    schemaDef.typeName === "ZodNullable" &&
    hasSchemaProperty(schema, "unwrap")
  ) {
    // Zod internal method access - unwrap() is not in public API
    const schemaWithInternals = accessZodInternals(schema);
    const unwrapped = stripTransformsAndRefinements(
      schemaWithInternals.unwrap!(),
    );
    return unwrapped.nullable();
  }

  // Handle ZodDefault - has removeDefault() method
  if (
    schemaDef.typeName === "ZodDefault" &&
    hasSchemaProperty(schema, "removeDefault")
  ) {
    // Zod internal method access - removeDefault() is not in public API
    const schemaWithInternals = accessZodInternals(schema);
    const innerSchema = stripTransformsAndRefinements(
      schemaWithInternals.removeDefault!(),
    );
    // Get the default value from _def
    const defaultValue = schemaDef.defaultValue;
    const resolvedDefault =
      typeof defaultValue === "function" ? defaultValue() : defaultValue;
    return innerSchema.default(resolvedDefault);
  }

  // Handle ZodObject - recursively strip from all properties
  if (
    schemaDef.typeName === "ZodObject" &&
    hasSchemaProperty(schema, "shape")
  ) {
    // Zod internal property access - shape is not in public API for ZodTypeAny
    const schemaWithInternals = accessZodInternals(schema);
    const shape = schemaWithInternals.shape!;
    const strippedShape: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(shape)) {
      strippedShape[key] = stripTransformsAndRefinements(value);
    }

    return z.object(strippedShape);
  }

  // Handle ZodArray - has element property
  if (
    schemaDef.typeName === "ZodArray" &&
    hasSchemaProperty(schema, "element")
  ) {
    // Zod internal property access - element is not in public API for ZodTypeAny
    const schemaWithInternals = accessZodInternals(schema);
    const element = schemaWithInternals.element!;
    const stripped = stripTransformsAndRefinements(element);
    return z.array(stripped);
  }

  // Handle ZodUnion - has options property
  if (
    schemaDef.typeName === "ZodUnion" &&
    hasSchemaProperty(schema, "options")
  ) {
    // Zod internal property access - options is not in public API for ZodTypeAny
    const schemaWithInternals = accessZodInternals(schema);
    const options = schemaWithInternals.options!;
    const strippedOptions = options.map((option) =>
      stripTransformsAndRefinements(option),
    ) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];
    return z.union(strippedOptions);
  }

  // Handle ZodIntersection - access left and right through _def
  if (
    schemaDef.typeName === "ZodIntersection" &&
    hasSchemaProperty(schemaDef, "left") &&
    hasSchemaProperty(schemaDef, "right")
  ) {
    const left = schemaDef.left as z.ZodTypeAny;
    const right = schemaDef.right as z.ZodTypeAny;
    const strippedLeft = stripTransformsAndRefinements(left);
    const strippedRight = stripTransformsAndRefinements(right);
    return z.intersection(strippedLeft, strippedRight);
  }

  // For all other types (primitives, etc.), return as-is
  return schema;
}
