/**
 * Field Utilities
 *
 * Utility functions for creating and working with unified fields.
 * These utilities were moved from individual definition files for better organization.
 */

import { z } from "zod";

import type { EndpointLogger } from "../logger/endpoint";
import type {
  ArrayField,
  ArrayOptionalField,
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  ObjectOptionalField,
  ObjectUnionField,
  PrimitiveField,
  UnifiedField,
} from "../types/endpoint";
import type { CacheStrategy } from "../types/enums";
import { FieldUsage } from "../types/enums";
import type { TypedContainerWidgetConfig,WidgetConfig } from "../widgets/configs";

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a Zod schema
 */
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard: Must accept unknown to narrow any value to z.ZodTypeAny. This is the standard TypeScript pattern for type guards.
function isZodSchema(value: unknown): value is z.ZodTypeAny {
  return typeof value === "object" && value !== null && "_def" in value;
}

// ============================================================================
// SCHEMA DEFAULT VALUE EXTRACTION
// ============================================================================

// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard for Zod internal structure requires unknown type
interface ZodDefShape { _def: Record<string, unknown> }

/**
 * Type guard to check if a value is a Zod schema (has _def property)
 */
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard parameter must accept unknown to narrow any value
function hasZodDef(value: unknown): value is ZodDefShape {
  return typeof value === "object" && value !== null && "_def" in value;
}

/**
 * Safely get a property from an object if it exists
 */
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Generic type parameter for flexible property extraction
function getDefProperty<T>(def: Record<string, unknown>, key: string): T | undefined {
  if (key in def) {
    return def[key] as T;
  }
  return undefined;
}

/**
 * Recursively extracts default values from a Zod schema.
 * This traverses the entire schema tree and builds an object with all default values.
 *
 * Key behavior for nested objects:
 * - If a nested object has ANY child with defaults, the object itself is included
 * - This ensures required nested objects get populated with their children's defaults
 *
 * Handles:
 * - ZodDefault: Extracts the default value
 * - ZodOptional: Recursively checks inner schema for defaults
 * - ZodObject: Recursively extracts defaults from all properties
 * - ZodEffects (refinements/transforms): Unwraps to inner schema
 * - ZodNullable: Recursively checks inner schema
 *
 * @param schema - The Zod schema to extract defaults from
 * @param logger - Optional logger for error reporting
 * @param path - Current path in schema (for debugging)
 * @param forFormInit - When true, returns empty values for primitives (empty string, 0, false, [])
 *                      to properly initialize form fields and avoid "expected X, received undefined" errors
 * @returns An object containing all extracted default values, or undefined if no defaults
 */
export function extractSchemaDefaults<T>(
  schema: z.ZodTypeAny,
  logger?: EndpointLogger,
  path = "",
  forFormInit = false,
): T | Partial<T> | undefined {
  try {
    if (!hasZodDef(schema)) {
      return undefined;
    }
    const def = schema._def;
    const typeName = getDefProperty<string>(def, "typeName");
    // In Zod v4, typeName is undefined but def.type exists
    const defType = getDefProperty<string>(def, "type");

    // Handle ZodDefault - has a defaultValue (can be value or function depending on Zod version)
    if (schema instanceof z.ZodDefault) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod internal _def structure requires unknown type, no definition.ts type available
      const defaultValueOrFn = getDefProperty<unknown>(def, "defaultValue");
      // In Zod v4, defaultValue is the actual value; in older versions it may be a function
      const defaultValue = typeof defaultValueOrFn === "function"
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod callback pattern requires unknown return type
        ? (defaultValueOrFn as () => unknown)()
        : defaultValueOrFn;

      // If the inner type is an object, merge with extracted defaults from children
      const innerType = getDefProperty<z.ZodTypeAny>(def, "innerType");
      if (innerType && hasZodDef(innerType)) {
        const innerDefaults = extractSchemaDefaults<T>(innerType, logger, `${path}.inner`, forFormInit);
        if (typeof defaultValue === "object" && defaultValue !== null && typeof innerDefaults === "object" && innerDefaults !== null) {
          return { ...innerDefaults, ...defaultValue } as Partial<T>;
        }
      }
      return defaultValue as Partial<T>;
    }

    // Handle ZodObject - recursively extract from all shape properties
    if (schema instanceof z.ZodObject) {
      const shapeFnOrObj = getDefProperty<(() => Record<string, z.ZodTypeAny>) | Record<string, z.ZodTypeAny>>(def, "shape");
      if (!shapeFnOrObj) {
        return {} as Partial<T>;
      }
      const shapeObj = typeof shapeFnOrObj === "function" ? shapeFnOrObj() : shapeFnOrObj;
      if (typeof shapeObj !== "object" || shapeObj === null) {
        return {} as Partial<T>;
      }

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Building dynamic object from Zod schema requires unknown values
      const result: Record<string, unknown> = {};
      for (const [key, fieldSchema] of Object.entries(shapeObj)) {
        if (hasZodDef(fieldSchema)) {
          const fieldDefaults = extractSchemaDefaults(fieldSchema, logger, `${path}.${key}`, forFormInit);
          if (fieldDefaults !== undefined) {
            result[key] = fieldDefaults;
          }
        }
      }
      // Always return the result object for ZodObject (even if empty)
      return result as Partial<T>;
    }

    // Handle ZodOptional - check inner schema for defaults
    if (schema instanceof z.ZodOptional) {
      const innerType = getDefProperty<z.ZodTypeAny>(def, "innerType");
      if (innerType && hasZodDef(innerType)) {
        return extractSchemaDefaults<T>(innerType, logger, `${path}.optional`, forFormInit);
      }
    }

    // Handle ZodNullable - check inner schema for defaults
    if (schema instanceof z.ZodNullable) {
      const innerType = getDefProperty<z.ZodTypeAny>(def, "innerType");
      if (innerType && hasZodDef(innerType)) {
        return extractSchemaDefaults<T>(innerType, logger, `${path}.nullable`, forFormInit);
      }
    }

    // Handle ZodEffects (refinements, transforms)
    // In Zod v4, check typeName or use "effect" in traits
    const isZodEffects = typeName === "ZodEffects" || defType === "effect";
    if (isZodEffects) {
      const innerSchema = getDefProperty<z.ZodTypeAny>(def, "schema");
      if (innerSchema && hasZodDef(innerSchema)) {
        return extractSchemaDefaults<T>(innerSchema, logger, `${path}.effects`, forFormInit);
      }
    }

    // Handle ZodPipeline (Zod v4 uses this for transforms)
    // In Zod v4, check def.type === "pipe"
    const isZodPipeline = typeName === "ZodPipeline" || defType === "pipe";
    if (isZodPipeline) {
      const inSchema = getDefProperty<z.ZodTypeAny>(def, "in");
      if (inSchema && hasZodDef(inSchema)) {
        return extractSchemaDefaults<T>(inSchema, logger, `${path}.pipeline`, forFormInit);
      }
    }

    // Handle ZodLazy - evaluate and extract
    if (schema instanceof z.ZodLazy) {
      const getter = getDefProperty<() => z.ZodTypeAny>(def, "getter");
      if (typeof getter === "function") {
        const lazySchema = getter();
        if (hasZodDef(lazySchema)) {
          return extractSchemaDefaults<T>(lazySchema, logger, `${path}.lazy`, forFormInit);
        }
      }
    }

    // For form initialization, return appropriate empty defaults for primitives
    // This ensures form fields start with valid values instead of undefined,
    // which prevents "expected string, received undefined" validation errors
    if (forFormInit) {
      // Use both instanceof and def.type for Zod v4 compatibility
      // Note: Type assertions are necessary here because we're doing runtime schema introspection
      // and TypeScript can't verify at compile time that T matches the schema type
      if (schema instanceof z.ZodArray || typeName === "ZodArray" || defType === "array") {
        return [] as T;
      }
      if (schema instanceof z.ZodString || typeName === "ZodString" || defType === "string") {
        return "" as T;
      }
      if (schema instanceof z.ZodNumber || typeName === "ZodNumber" || defType === "number") {
        return 0 as T;
      }
      if (schema instanceof z.ZodBoolean || typeName === "ZodBoolean" || defType === "boolean") {
        return false as T;
      }
    }

    // For other types without defaults, return undefined
    return undefined;
  } catch (error) {
    if (logger) {
      logger.error("Error extracting schema defaults", { path, error: String(error) });
    }
    return undefined;
  }
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
 * Create a widget-only field that has no schema validation
 * Use for interactive widgets like buttons, alerts, static content that don't process data
 */
export function widgetField<
  TUsage extends FieldUsageConfig,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  ui: TUIConfig,
  usage: TUsage,
  cache?: CacheStrategy,
): {
  type: "widget";
  usage: TUsage;
  ui: TUIConfig;
  cache?: CacheStrategy;
} {
  return {
    type: "widget" as const,
    usage,
    ui,
    cache,
  };
}

/**
 * Create an object field containing other fields
 * Accepts any object-like structure where all values are UnifiedFields
 */
export function objectField<
  const TUI extends WidgetConfig,
  const TUsage extends FieldUsageConfig,
  const TChildren,
>(
  ui: TUI extends TypedContainerWidgetConfig<infer TExistingChildren, infer TExistingUsage>
    ? TypedContainerWidgetConfig<TChildren, TUsage> & TUI & { _phantom?: TExistingChildren & TExistingUsage }
    : TUI,
  usage: TUsage,
  children: TChildren,
  cache?: CacheStrategy,
): ObjectField<TChildren, TUsage, TUI> {
  return {
    type: "object" as const,
    children,
    usage,
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Using unknown to break complex union type that TypeScript cannot represent
    ui: ui as unknown as TUI,
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
 * Create a discriminated union object field
 * Use for types that can be one of multiple shapes based on a discriminator field
 *
 * @example
 * ```typescript
 * objectUnionField(
 *   { widget: "container" },
 *   { response: true },
 *   "isPublic",
 *   [
 *     objectField(
 *       { widget: "container" },
 *       { response: true },
 *       {
 *         isPublic: responseField({ widget: "boolean" }, z.literal(true)),
 *         leadId: responseField({ widget: "text" }, z.uuid()),
 *       }
 *     ),
 *     objectField(
 *       { widget: "container" },
 *       { response: true },
 *       {
 *         isPublic: responseField({ widget: "boolean" }, z.literal(false)),
 *         id: responseField({ widget: "text" }, z.uuid()),
 *         leadId: responseField({ widget: "text" }, z.uuid()),
 *       }
 *     ),
 *   ]
 * )
 * ```
 */
export function objectUnionField<
  TDiscriminator extends string,
  TVariants extends readonly [
    ObjectField<Record<string, UnifiedField<z.ZodTypeAny>>, FieldUsageConfig>,
    ...ObjectField<Record<string, UnifiedField<z.ZodTypeAny>>, FieldUsageConfig>[],
  ],
  TUsage extends FieldUsageConfig,
  TUIConfig extends WidgetConfig = WidgetConfig,
>(
  ui: TUIConfig,
  usage: TUsage,
  discriminator: TDiscriminator,
  variants: TVariants,
  cache?: CacheStrategy,
): ObjectUnionField<TDiscriminator, TVariants, TUsage, TUIConfig> {
  return {
    type: "object-union" as const,
    discriminator,
    variants,
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
 * Infer union type from ObjectUnionField variants
 */
export type InferUnionType<
  TVariants extends readonly ObjectField<
    Record<string, UnifiedField<z.ZodTypeAny>>,
    FieldUsageConfig
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Head extends ObjectField<
      Record<string, UnifiedField<z.ZodTypeAny>>,
      FieldUsageConfig
    >
    ? Tail extends ObjectField<
        Record<string, UnifiedField<z.ZodTypeAny>>,
        FieldUsageConfig
      >[]
      ?
          | InferFieldType<Head, Usage>
          | InferUnionType<Tail, Usage>
      : InferFieldType<Head, Usage>
    : never
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
              type: "object-union";
              variants: infer TVariants;
              usage: infer U;
            }
          ? TVariants extends readonly ObjectField<
              Record<string, UnifiedField<z.ZodTypeAny>>,
              FieldUsageConfig
            >[]
            ? Usage extends FieldUsage.Response
              ? HasResponseUsage<U> extends true
                ? InferUnionType<TVariants, Usage>
                : never
              : Usage extends FieldUsage.RequestData
                ? HasRequestDataUsage<U> extends true
                  ? InferUnionType<TVariants, Usage>
                  : never
                : Usage extends FieldUsage.RequestUrlParams
                  ? HasRequestUrlParamsUsage<U> extends true
                    ? InferUnionType<TVariants, Usage>
                    : never
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
    type:
      | "primitive"
      | "widget"
      | "object"
      | "object-optional"
      | "object-union"
      | "array"
      | "array-optional";
    usage?: FieldUsageConfig;
    schema?: z.ZodTypeAny;
    children?: Record<string, UnifiedField<z.ZodTypeAny>>;
    child?: UnifiedField<z.ZodTypeAny>;
    discriminator?: string;
    variants?: readonly ObjectField<
      Record<string, UnifiedField<z.ZodTypeAny>>,
      FieldUsageConfig
    >[];
    ui?: WidgetConfig;
  }

  const typedField = field as F & FieldWithType;

  // Create a reference z.never() type for comparison - ensures runtime correctness
  const neverType = z.never()._def.type;

  // Widget-only fields have no schema and are skipped during schema generation
  if (typedField.type === "widget") {
    return z.never() as InferSchemaFromField<F, Usage>;
  }

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
        // CRITICAL: Skip widget fields completely - they should NEVER be in validation schemas
        // Widget fields (formAlert, submitButton, etc.) are UI-only and don't send/receive data
        const isWidgetField = 'type' in childField && childField.type === 'widget';
        if (isWidgetField) {
          continue;
        }

        // CRITICAL: Skip objectFields that only contain widget children - they're UI-only containers
        // Examples: footerLinks container with only widget links inside
        const isObjectFieldWithOnlyWidgets =
          childField.type === 'object' &&
          childField.children &&
          Object.values(childField.children).every(
            grandchild => 'type' in grandchild && grandchild.type === 'widget'
          );
        if (isObjectFieldWithOnlyWidgets) {
          continue;
        }

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
        // Check if schema is z.never() by comparing type to actual z.never() instance
        if (childSchema._def.type !== neverType) {
          shape[key] = childSchema;
        }
      }
    }

    // If no children matched the usage, return z.never()
    // This handles cases like container fields with only widget children
    // These UI-only containers shouldn't be in validation schemas
    if (Object.keys(shape).length === 0) {
      return z.never() as InferSchemaFromField<F, Usage>;
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
      const optionalSchema = objectSchema.nullable().optional();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
      return optionalSchema as unknown as InferSchemaFromField<F, Usage>;
    }

    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "object-optional") {
    // Check if the object itself has the required usage
    const objectHasUsage = typedField.usage ? hasUsage(typedField.usage) : true;

    if (typedField.usage && !objectHasUsage) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Build shape object with proper typing to preserve schema types
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        // Skip widget fields - they're UI-only
        const isWidgetField = 'type' in childField && childField.type === 'widget';
        if (isWidgetField) {
          continue;
        }

        const childSchema = generateSchemaForUsage(childField, targetUsage);
        if (childSchema._def.type !== neverType) {
          shape[key] = childSchema;
        }
      }
    }

    // If no children matched the usage, return z.never()
    if (Object.keys(shape).length === 0) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Create the object schema and wrap in nullable().optional() for object-optional
    const objectSchema = z.object(shape).nullable().optional();
    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (typedField.type === "object-union") {
    // Check if the union itself has the required usage
    const unionHasUsage = typedField.usage ? hasUsage(typedField.usage) : true;

    if (typedField.usage && !unionHasUsage) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Validate discriminator and variants exist
    if (!typedField.discriminator || !typedField.variants) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // Generate schemas for each variant
    const variantSchemas: z.ZodObject<z.ZodRawShape>[] = [];

    for (const variant of typedField.variants) {
      // Generate schema for this variant using the same target usage
      const variantSchema = generateSchemaForUsage(variant, targetUsage);

      // Skip variants that don't match the usage
      if (variantSchema._def.type === neverType) {
        continue;
      }

      // Ensure the variant schema is a ZodObject (required for discriminated unions)
      if (variantSchema instanceof z.ZodObject) {
        variantSchemas.push(variantSchema);
      }
    }

    // If no variants matched the usage, return z.never()
    if (variantSchemas.length === 0) {
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // If only one variant, just return it (no need for union)
    if (variantSchemas.length === 1) {
      return variantSchemas[0] as InferSchemaFromField<F, Usage>;
    }

    // Create discriminated union with at least 2 variants
    const unionSchema = z.discriminatedUnion(
      typedField.discriminator,
      variantSchemas as [z.ZodObject<z.ZodRawShape>, z.ZodObject<z.ZodRawShape>, ...z.ZodObject<z.ZodRawShape>[]],
    );

    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, @typescript-eslint/no-explicit-any -- Schema generation requires type assertion for proper inference
    return unionSchema as any as InferSchemaFromField<F, Usage>;
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
        // Check if schema is z.never() using _def.type check
        if (childSchema._def.type === neverType) {
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
        const optionalArraySchema = arraySchema.nullable().optional();
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
        return optionalArraySchema as unknown as InferSchemaFromField<F, Usage>;
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
        // Check if schema is z.never() using _def.type check
        if (childSchema._def.type === neverType) {
          return z.never() as InferSchemaFromField<F, Usage>;
        }
      }

      // For array-optional, always apply nullable and optional
      const arrayOptionalSchema = z.array(childSchema).nullable().optional();

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
      return arrayOptionalSchema as unknown as InferSchemaFromField<F, Usage>;
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
