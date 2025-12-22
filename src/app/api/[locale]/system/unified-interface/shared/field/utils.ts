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
  WidgetField,
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
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard: Must accept unknown to narrow any value to z.ZodTypeAny. This is the standard TypeScript pattern for type guards.
function isZodSchema(value: unknown): value is z.ZodTypeAny {
  return typeof value === "object" && value !== null && "_def" in value;
}

// ============================================================================
// SCHEMA DEFAULT VALUE EXTRACTION
// ============================================================================

interface ZodDefShape {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard for Zod internal structure requires unknown type
  _def: Record<string, unknown>;
}

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
function getDefProperty<T>(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Generic type parameter for flexible property extraction
  def: Record<string, unknown>,
  key: string,
): T | undefined {
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
      const defaultValue =
        typeof defaultValueOrFn === "function"
          ? // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Zod callback pattern requires unknown return type
            (defaultValueOrFn as () => unknown)()
          : defaultValueOrFn;

      // If the inner type is an object, merge with extracted defaults from children
      const innerType = getDefProperty<z.ZodTypeAny>(def, "innerType");
      if (innerType && hasZodDef(innerType)) {
        const innerDefaults = extractSchemaDefaults<T>(
          innerType,
          logger,
          `${path}.inner`,
          forFormInit,
        );
        if (
          typeof defaultValue === "object" &&
          defaultValue !== null &&
          typeof innerDefaults === "object" &&
          innerDefaults !== null
        ) {
          return { ...innerDefaults, ...defaultValue } as Partial<T>;
        }
      }
      return defaultValue as Partial<T>;
    }

    // Handle ZodObject - recursively extract from all shape properties
    if (schema instanceof z.ZodObject) {
      const shapeFnOrObj = getDefProperty<
        (() => Record<string, z.ZodTypeAny>) | Record<string, z.ZodTypeAny>
      >(def, "shape");
      if (!shapeFnOrObj) {
        return {} as Partial<T>;
      }
      const shapeObj =
        typeof shapeFnOrObj === "function" ? shapeFnOrObj() : shapeFnOrObj;
      if (typeof shapeObj !== "object" || shapeObj === null) {
        return {} as Partial<T>;
      }

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Building dynamic object from Zod schema requires unknown values
      const result: Record<string, unknown> = {};
      for (const [key, fieldSchema] of Object.entries(shapeObj)) {
        if (hasZodDef(fieldSchema)) {
          const fieldDefaults = extractSchemaDefaults(
            fieldSchema,
            logger,
            `${path}.${key}`,
            forFormInit,
          );
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
        return extractSchemaDefaults<T>(
          innerType,
          logger,
          `${path}.optional`,
          forFormInit,
        );
      }
    }

    // Handle ZodNullable - check inner schema for defaults
    if (schema instanceof z.ZodNullable) {
      const innerType = getDefProperty<z.ZodTypeAny>(def, "innerType");
      if (innerType && hasZodDef(innerType)) {
        return extractSchemaDefaults<T>(
          innerType,
          logger,
          `${path}.nullable`,
          forFormInit,
        );
      }
    }

    // Handle ZodEffects (refinements, transforms)
    // In Zod v4, check typeName or use "effect" in traits
    const isZodEffects = typeName === "ZodEffects" || defType === "effect";
    if (isZodEffects) {
      const innerSchema = getDefProperty<z.ZodTypeAny>(def, "schema");
      if (innerSchema && hasZodDef(innerSchema)) {
        return extractSchemaDefaults<T>(
          innerSchema,
          logger,
          `${path}.effects`,
          forFormInit,
        );
      }
    }

    // Handle ZodPipeline (Zod v4 uses this for transforms)
    // In Zod v4, check def.type === "pipe"
    const isZodPipeline = typeName === "ZodPipeline" || defType === "pipe";
    if (isZodPipeline) {
      const inSchema = getDefProperty<z.ZodTypeAny>(def, "in");
      if (inSchema && hasZodDef(inSchema)) {
        return extractSchemaDefaults<T>(
          inSchema,
          logger,
          `${path}.pipeline`,
          forFormInit,
        );
      }
    }

    // Handle ZodLazy - evaluate and extract
    if (schema instanceof z.ZodLazy) {
      const getter = getDefProperty<() => z.ZodTypeAny>(def, "getter");
      if (typeof getter === "function") {
        const lazySchema = getter();
        if (hasZodDef(lazySchema)) {
          return extractSchemaDefaults<T>(
            lazySchema,
            logger,
            `${path}.lazy`,
            forFormInit,
          );
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
      if (
        schema instanceof z.ZodArray ||
        typeName === "ZodArray" ||
        defType === "array"
      ) {
        return [] as T;
      }
      if (
        schema instanceof z.ZodString ||
        typeName === "ZodString" ||
        defType === "string"
      ) {
        return "" as T;
      }
      if (
        schema instanceof z.ZodNumber ||
        typeName === "ZodNumber" ||
        defType === "number"
      ) {
        return 0 as T;
      }
      if (
        schema instanceof z.ZodBoolean ||
        typeName === "ZodBoolean" ||
        defType === "boolean"
      ) {
        return false as T;
      }
    }

    // For other types without defaults, return undefined
    return undefined;
  } catch (error) {
    if (logger) {
      logger.error("Error extracting schema defaults", {
        path,
        error: String(error),
      });
    }
    return undefined;
  }
}

// ============================================================================
// FIELD CREATORS
// ============================================================================

/**
 * Create a primitive field (string, number, boolean, etc.)
 * TKey is extracted from widget config properties using ExtractWidgetKey
 */
export function field<
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  const TUIConfig extends WidgetConfig<string>,
>(
  schema: TSchema,
  usage: TUsage,
  ui: TUIConfig,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, TUsage, ExtractWidgetKey<TUIConfig>, TUIConfig> {
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
 * TKey is extracted from widget config properties using ExtractWidgetKey
 */
export function requestResponseField<
  TSchema extends z.ZodTypeAny,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: false,
): PrimitiveField<
  TSchema,
  {
    request: "data";
    response: true;
  },
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
>;
// eslint-disable-next-line no-redeclare
export function requestResponseField<
  TSchema extends z.ZodTypeAny,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: true,
): PrimitiveField<
  TSchema,
  {
    request: "urlPathParams";
    response: true;
  },
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
>;
// eslint-disable-next-line no-redeclare
export function requestResponseField<
  TSchema extends z.ZodTypeAny,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
  requestAsUrlParams?: boolean,
): PrimitiveField<
  TSchema,
  {
    request: "data" | "urlPathParams";
    response: true;
  },
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
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
 * Extract ALL translation key types from widget config as a union
 * Looks at label, description, placeholder, helpText, title, content, and options
 * Returns never for properties that don't exist (filtered out in unions)
 */
export type ExtractWidgetKey<T> =
  | (T extends { label: infer L extends string } ? L : never)
  | (T extends { title: infer Ti extends string } ? Ti : never)
  | (T extends { description: infer D extends string } ? D : never)
  | (T extends { placeholder: infer P extends string } ? P : never)
  | (T extends { helpText: infer H extends string } ? H : never)
  | (T extends { content: infer C extends string } ? C : never)
  | (T extends { options: Array<{ label: infer OL extends string }> }
      ? OL
      : never);

/**
 * Create a request data field
 * TKey is inferred from TUIConfig through the constraint
 */
export function requestDataField<
  TSchema extends z.ZodTypeAny,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, { request: "data" }, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function requestUrlPathParamsField<
  TSchema extends z.ZodTypeAny,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, { request: "urlPathParams"; response?: never }, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function responseField<
  TSchema extends z.ZodTypeAny,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<TSchema, { response: true }, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function widgetField<
  TUsage extends FieldUsageConfig,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  usage: TUsage,
  cache?: CacheStrategy,
): WidgetField<TUsage, TKey, TUIConfig> {
  return {
    type: "widget" as const,
    usage,
    ui,
    cache,
  };
}

/**
 * Extract translation key from any field type by looking at its ui property
 * Returns never if no translation keys found
 */
type ExtractFieldKey<F> = F extends { ui: infer UI }
  ? ExtractWidgetKey<UI>
  : never;

/**
 * Extract all translation keys from children object using mapped type
 */
type ExtractChildrenKeys<TChildren> = {
  [K in keyof TChildren]: ExtractFieldKey<TChildren[K]>;
}[keyof TChildren];

/**
 * Create an object field containing other fields
 * TKey is inferred from TUI through the constraint
 */
export function objectField<
  const TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>,
  const TUsage extends FieldUsageConfig,
  TKey extends string,
  const TUI extends WidgetConfig<TKey>,
>(
  ui: TUI,
  usage: TUsage,
  children: TChildren,
  cache?: CacheStrategy,
): ObjectField<TChildren, TUsage, TKey | ExtractChildrenKeys<TChildren>, TUI> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function arrayField<
  Child,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  usage: FieldUsageConfig,
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, FieldUsageConfig, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function requestDataArrayField<
  Child,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, { request: "data" }, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function responseArrayField<
  Child,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayField<Child, { response: true }, TKey, TUIConfig> {
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
 * TKey is inferred from TUIConfig through the constraint
 */
export function objectOptionalField<
  C,
  U extends FieldUsageConfig,
  TKey extends string,
  const TUIConfig extends WidgetConfig<TKey>,
>(
  ui: TUIConfig,
  usage: U,
  children: C,
  cache?: CacheStrategy,
): ObjectOptionalField<C, U, TKey, TUIConfig> {
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
 * TKey is extracted from widget config properties using ExtractWidgetKey
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
    ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string
    >,
    ...ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string
    >[],
  ],
  TUsage extends FieldUsageConfig,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  usage: TUsage,
  discriminator: TDiscriminator,
  variants: TVariants,
  cache?: CacheStrategy,
): ObjectUnionField<TDiscriminator, string, TVariants, TUsage, TUIConfig> {
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
 * TKey is extracted from widget config properties using ExtractWidgetKey
 */
export function arrayOptionalField<
  Child,
  const TUIConfig extends WidgetConfig<string>,
>(
  usage: FieldUsageConfig,
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<
  Child,
  FieldUsageConfig,
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
> {
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
 * TKey is extracted from widget config properties using ExtractWidgetKey
 */
export function requestDataArrayOptionalField<
  Child,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<
  Child,
  { request: "data" },
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
> {
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
 * TKey is extracted from widget config properties using ExtractWidgetKey
 */
export function responseArrayOptionalField<
  Child,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  child: Child,
  cache?: CacheStrategy,
): ArrayOptionalField<
  Child,
  { response: true },
  ExtractWidgetKey<TUIConfig>,
  WidgetConfig<ExtractWidgetKey<TUIConfig>>
> {
  return {
    type: "array-optional" as const,
    child,
    usage: { response: true },
    ui: ui as WidgetConfig<ExtractWidgetKey<TUIConfig>>,
    cache,
  };
}

// ============================================================================
// SPECIALIZED FIELD HELPERS
// ============================================================================

/**
 * Create a filter pills field for form input
 * Provides a visual pill/chip radio button group for single-selection enums
 * This is a specialized version of requestDataField with FilterPills widget type
 *
 * @param ui - FilterPills widget configuration (label, options with icons, layout)
 * @param schema - Zod enum schema for validation
 * @param cache - Optional cache strategy
 * @returns A primitive field configured for FilterPills widget
 *
 * @example
 * ```typescript
 * intelligence: filterPillsField(
 *   {
 *     type: WidgetType.FILTER_PILLS,
 *     label: "app.api.agent.chat.personas.post.intelligence.label",
 *     options: [
 *       { label: "app.filters.smart", value: "smart", icon: "brain" },
 *       { label: "app.filters.genius", value: "genius", icon: "sparkles" },
 *     ],
 *   },
 *   z.enum(["smart", "genius"]),
 * )
 * ```
 */
export function filterPillsField<
  TSchema extends z.ZodTypeAny,
  const TUIConfig extends WidgetConfig<string>,
>(
  ui: TUIConfig,
  schema: TSchema,
  cache?: CacheStrategy,
): PrimitiveField<
  TSchema,
  { request: "data" },
  ExtractWidgetKey<TUIConfig>,
  TUIConfig
> {
  return {
    type: "primitive" as const,
    schema,
    usage: { request: "data" },
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
  TTranslatedKey extends string,
  TVariants extends readonly ObjectField<
    Record<string, UnifiedField<TTranslatedKey, z.ZodTypeAny>>,
    FieldUsageConfig,
    TTranslatedKey
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Head extends ObjectField<
      Record<string, UnifiedField<TTranslatedKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TTranslatedKey
    >
    ? Tail extends ObjectField<
        Record<string, UnifiedField<TTranslatedKey, z.ZodTypeAny>>,
        FieldUsageConfig,
        TTranslatedKey
      >[]
      ?
          | InferFieldType<Head, Usage, TTranslatedKey>
          | InferUnionType<TTranslatedKey, Tail, Usage>
      : InferFieldType<Head, Usage, TTranslatedKey>
    : never
  : never;

/**
 * Infer field type based on usage
 */
export type InferFieldType<F, Usage extends FieldUsage, TKey extends string> =
  F extends UnifiedField<TKey, infer TSchema>
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
                Array<InferFieldType<Child, Usage, TKey>>,
                IsOptionalField<F>
              >
            : never
          : Usage extends FieldUsage.RequestData
            ? HasRequestDataUsage<U> extends true
              ? MakeOptional<
                  Array<InferFieldType<Child, Usage, TKey>>,
                  IsOptionalField<F>
                >
              : never
            : Usage extends FieldUsage.RequestUrlParams
              ? HasRequestUrlParamsUsage<U> extends true
                ? MakeOptional<
                    Array<InferFieldType<Child, Usage, TKey>>,
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
              Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
              FieldUsageConfig,
              TKey
            >[]
            ? Usage extends FieldUsage.Response
              ? HasResponseUsage<U> extends true
                ? InferUnionType<TKey, TVariants, Usage>
                : never
              : Usage extends FieldUsage.RequestData
                ? HasRequestDataUsage<U> extends true
                  ? InferUnionType<TKey, TVariants, Usage>
                  : never
                : Usage extends FieldUsage.RequestUrlParams
                  ? HasRequestUrlParamsUsage<U> extends true
                    ? InferUnionType<TKey, TVariants, Usage>
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
                ? MakeOptional<
                    InferObjectType<C, Usage, TKey>,
                    IsOptionalField<F>
                  >
                : never
              : Usage extends FieldUsage.RequestData
                ? HasRequestDataUsage<U> extends true
                  ? MakeOptional<
                      InferObjectType<C, Usage, TKey>,
                      IsOptionalField<F>
                    >
                  : never
                : Usage extends FieldUsage.RequestUrlParams
                  ? HasRequestUrlParamsUsage<U> extends true
                    ? MakeOptional<
                        InferObjectType<C, Usage, TKey>,
                        IsOptionalField<F>
                      >
                    : never
                  : never
            : F extends {
                  type: "object" | "object-optional";
                  children: infer C;
                }
              ? MakeOptional<
                  InferObjectType<C, Usage, TKey>,
                  IsOptionalField<F>
                >
              : never
    : never;

/**
 * Infer object type from children fields
 * Uses flexible constraint that accepts both readonly and mutable properties
 * Checks each field's optional flag to make properties optional in the resulting type
 */
export type InferObjectType<C, Usage extends FieldUsage, TKey extends string> =
  C extends Record<string, UnifiedField<TKey, z.ZodTypeAny>>
    ? {
        -readonly [K in keyof C as InferFieldType<
          C[K],
          Usage,
          TKey
        > extends never
          ? never
          : IsOptionalField<C[K]> extends true
            ? never
            : K]: InferFieldType<C[K], Usage, TKey>;
      } & {
        -readonly [K in keyof C as InferFieldType<
          C[K],
          Usage,
          TKey
        > extends never
          ? never
          : IsOptionalField<C[K]> extends true
            ? K
            : never]?: InferFieldType<C[K], Usage, TKey>;
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
  F,
  Usage extends FieldUsage,
  TKey extends string,
>(field: F, targetUsage: Usage): InferSchemaFromField<F, Usage, TKey> {
  // Defensive check: ensure field is defined
  if (!field || typeof field !== "object") {
    return z.never() as InferSchemaFromField<F, Usage, TKey>;
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
    children?: Record<string, UnifiedField<TKey, z.ZodTypeAny>>;
    child?: UnifiedField<TKey, z.ZodTypeAny>;
    discriminator?: string;
    variants?: readonly ObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey
    >[];
    ui?: WidgetConfig<TKey>;
  }

  const typedField = field as F & FieldWithType;

  // Create a reference z.never() type for comparison - ensures runtime correctness
  const neverType = z.never()._def.type;

  // Widget-only fields have no schema and are skipped during schema generation
  if (typedField.type === "widget") {
    return z.never() as InferSchemaFromField<F, Usage, TKey>;
  }

  if (typedField.type === "primitive") {
    if (hasUsage(typedField.usage)) {
      return typedField.schema as InferSchemaFromField<F, Usage, TKey>;
    }
    return z.never() as InferSchemaFromField<F, Usage, TKey>;
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
        return emptySchema as InferSchemaFromField<F, Usage, TKey>;
      }
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // Build shape object with proper typing to preserve schema types
    // We need to avoid using Record<string, z.ZodTypeAny> which loses type information
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        // CRITICAL: Skip widget fields completely - they should NEVER be in validation schemas
        // Widget fields (formAlert, submitButton, etc.) are UI-only and don't send/receive data
        const isWidgetField =
          "type" in childField && childField.type === "widget";
        if (isWidgetField) {
          continue;
        }

        // CRITICAL: Skip objectFields that only contain widget children - they're UI-only containers
        // Examples: footerLinks container with only widget links inside
        const isObjectFieldWithOnlyWidgets =
          childField.type === "object" &&
          childField.children &&
          Object.values(childField.children).every(
            (grandchild) =>
              "type" in grandchild && grandchild.type === "widget",
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

        const childSchema = generateSchemaForUsage<
          typeof childField,
          Usage,
          TKey
        >(childField, targetUsage);
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
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
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
      return optionalSchema as unknown as InferSchemaFromField<F, Usage, TKey>;
    }

    return objectSchema as InferSchemaFromField<F, Usage, TKey>;
  }

  if (typedField.type === "object-optional") {
    // Check if the object itself has the required usage
    const objectHasUsage = typedField.usage ? hasUsage(typedField.usage) : true;

    if (typedField.usage && !objectHasUsage) {
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // Build shape object with proper typing to preserve schema types
    const shape: Record<string, z.ZodTypeAny> = {};

    if (typedField.children) {
      for (const [key, childField] of Object.entries(typedField.children)) {
        // Skip widget fields - they're UI-only
        const isWidgetField =
          "type" in childField && childField.type === "widget";
        if (isWidgetField) {
          continue;
        }

        const childSchema = generateSchemaForUsage<
          typeof childField,
          Usage,
          TKey
        >(childField, targetUsage);
        if (childSchema._def.type !== neverType) {
          shape[key] = childSchema;
        }
      }
    }

    // If no children matched the usage, return z.never()
    if (Object.keys(shape).length === 0) {
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // Create the object schema and wrap in nullable().optional() for object-optional
    const objectSchema = z.object(shape).nullable().optional();
    return objectSchema as InferSchemaFromField<F, Usage, TKey>;
  }

  if (typedField.type === "object-union") {
    // Check if the union itself has the required usage
    const unionHasUsage = typedField.usage ? hasUsage(typedField.usage) : true;

    if (typedField.usage && !unionHasUsage) {
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // Validate discriminator and variants exist
    if (!typedField.discriminator || !typedField.variants) {
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // Generate schemas for each variant
    const variantSchemas: z.ZodObject<z.ZodRawShape>[] = [];

    for (const variant of typedField.variants) {
      // Generate schema for this variant using the same target usage
      const variantSchema = generateSchemaForUsage<typeof variant, Usage, TKey>(
        variant,
        targetUsage,
      );

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
      return z.never() as InferSchemaFromField<F, Usage, TKey>;
    }

    // If only one variant, just return it (no need for union)
    if (variantSchemas.length === 1) {
      return variantSchemas[0] as InferSchemaFromField<F, Usage, TKey>;
    }

    // Create discriminated union with at least 2 variants
    const unionSchema = z.discriminatedUnion(
      typedField.discriminator,
      variantSchemas as [
        z.ZodObject<z.ZodRawShape>,
        z.ZodObject<z.ZodRawShape>,
        ...z.ZodObject<z.ZodRawShape>[],
      ],
    );

    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, @typescript-eslint/no-explicit-any -- Schema generation requires type assertion for proper inference
    return unionSchema as any as InferSchemaFromField<F, Usage, TKey>;
  }

  if (typedField.type === "array") {
    if (hasUsage(typedField.usage)) {
      // Check if child exists
      if (!typedField.child) {
        return z.never() as InferSchemaFromField<F, Usage, TKey>;
      }

      let childSchema: z.ZodTypeAny;
      if (isZodSchema(typedField.child)) {
        // Child is already a Zod schema, use it directly
        childSchema = typedField.child;
      } else {
        // Child is a UnifiedField, generate schema from it
        childSchema = generateSchemaForUsage<
          typeof typedField.child,
          Usage,
          TKey
        >(typedField.child, targetUsage);
        // Check if schema is z.never() using _def.type check
        if (childSchema._def.type === neverType) {
          return z.never() as InferSchemaFromField<F, Usage, TKey>;
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
        return optionalArraySchema as unknown as InferSchemaFromField<
          F,
          Usage,
          TKey
        >;
      }

      return arraySchema as InferSchemaFromField<F, Usage, TKey>;
    }
    return z.never() as InferSchemaFromField<F, Usage, TKey>;
  }

  if (typedField.type === "array-optional") {
    if (hasUsage(typedField.usage)) {
      // Check if child exists
      if (!typedField.child) {
        return z.never() as InferSchemaFromField<F, Usage, TKey>;
      }

      let childSchema: z.ZodTypeAny;
      if (isZodSchema(typedField.child)) {
        // Child is already a Zod schema, use it directly
        childSchema = typedField.child;
      } else {
        // Child is a UnifiedField, generate schema from it
        childSchema = generateSchemaForUsage<
          typeof typedField.child,
          Usage,
          TKey
        >(typedField.child, targetUsage);
        // Check if schema is z.never() using _def.type check
        if (childSchema._def.type === neverType) {
          return z.never() as InferSchemaFromField<F, Usage, TKey>;
        }
      }

      // For array-optional, always apply nullable and optional
      const arrayOptionalSchema = z.array(childSchema).nullable().optional();

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
      return arrayOptionalSchema as unknown as InferSchemaFromField<
        F,
        Usage,
        TKey
      >;
    }
    return z.never() as InferSchemaFromField<F, Usage, TKey>;
  }

  return z.never() as InferSchemaFromField<F, Usage, TKey>;
}

// Utility types that work with z.ZodType<Output, ZodTypeDef, Input> to properly infer types
// These preserve the input/output type differentiation from Zod schemas

export type InferFieldSchemaInputType<
  F,
  Usage extends FieldUsage,
  TKey extends string,
> = z.input<ReturnType<typeof generateSchemaForUsage<F, Usage, TKey>>>;

export type InferFieldSchemaOutputType<
  F,
  Usage extends FieldUsage,
  TKey extends string,
> = z.output<ReturnType<typeof generateSchemaForUsage<F, Usage, TKey>>>;

/**
 * Generate request data schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateRequestDataSchema<F, TKey extends string>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestData, TKey> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage<F, FieldUsage.RequestData, TKey>(
    field,
    FieldUsage.RequestData,
  );

  // Return the schema with its actual runtime type preserved
  // This is critical for ExtractInput<> and ExtractOutput<> to work correctly
  return baseSchema;
}

/**
 * Generate request URL params schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateRequestUrlSchema<F, TKey extends string>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestUrlParams, TKey> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage<
    F,
    FieldUsage.RequestUrlParams,
    TKey
  >(field, FieldUsage.RequestUrlParams);

  // Return the schema with its actual runtime type preserved
  return baseSchema;
}

/**
 * Generate response schema with proper input/output type differentiation
 * CRITICAL: This function must preserve the actual schema types for z.input<>/z.output<>
 */
export function generateResponseSchema<F, TKey extends string>(
  field: F,
): InferSchemaFromField<F, FieldUsage.Response, TKey> {
  // Generate the base schema - the runtime schema preserves its actual type
  const baseSchema = generateSchemaForUsage<F, FieldUsage.Response, TKey>(
    field,
    FieldUsage.Response,
  );

  // Return the schema with its actual runtime type preserved
  return baseSchema;
}
