/**
 * Field Utilities
 *
 * Utility functions for creating and working with unified fields.
 * These utilities were moved from individual definition files for better organization.
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../unified-ui/widgets/_shared/types";
import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";
import type { RangeSliderFieldWidgetConfig } from "../../unified-ui/widgets/form-fields/range-slider-field/types";
import type { NavigateButtonWidgetConfig } from "../../unified-ui/widgets/interactive/navigate-button/types";
import type { SubmitButtonWidgetConfig } from "../../unified-ui/widgets/interactive/submit-button/types";
import type { EndpointLogger } from "../logger/endpoint";
import type { InferSchemaFromField, UnifiedField } from "../types/endpoint";
import type { CreateApiEndpointAny } from "../types/endpoint-base";
import { FieldUsage, type SpacingSize, WidgetType } from "../types/enums";
import type {
  ArrayWidgetConfig,
  DisplayOnlyWidgetConfig,
  ObjectUnionWidgetConfig,
  ObjectWidgetConfig,
} from "../widgets/configs";

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
// FIELD CREATORS - Legacy Pattern (Kept for backwards compatibility)
// ============================================================================

/**
 * Create a request data range field (min/max)
 * Automatically wraps an enum schema in z.object({ min, max }) structure
 *
 * @example
 * requestDataRangeField(
 *   {
 *     type: WidgetType.FORM_FIELD,
 *     fieldType: FieldDataType.RANGE_SLIDER,
 *     label: "price.range.label",
 *     options: PRICE_OPTIONS,
 *   },
 *   z.enum(PriceLevelDB),
 * )
 */
export function requestDataRangeField<
  TKey extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEnum extends z.ZodEnum<any>,
>(
  config: Omit<
    RangeSliderFieldWidgetConfig<
      TKey,
      z.ZodOptional<
        z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
      >,
      { request: "data" }
    >,
    "schema" | "usage" | "schemaType"
  > & {
    schema: TEnum;
  },
): RangeSliderFieldWidgetConfig<
  TKey,
  z.ZodOptional<
    z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
  >,
  { request: "data" }
> {
  const rangeSchema = z
    .object({
      min: config.schema.optional(),
      max: config.schema.optional(),
    })
    .optional();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude schema from restConfig
  const { schema: _unusedSchema, ...restConfig } = config;
  return {
    ...restConfig,
    schemaType: "primitive" as const,
    schema: rangeSchema,
    usage: { request: "data" },
  };
}

export function requestResponseRangeField<
  TKey extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEnum extends z.ZodEnum<any>,
>(
  config: Omit<
    RangeSliderFieldWidgetConfig<
      TKey,
      z.ZodOptional<
        z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
      >,
      { request: "data"; response: true }
    >,
    "schema"
  > & {
    schema: TEnum;
  },
): RangeSliderFieldWidgetConfig<
  TKey,
  z.ZodOptional<
    z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
  >,
  { request: "data"; response: true }
> {
  const rangeSchema = z
    .object({
      min: config.schema.optional(),
      max: config.schema.optional(),
    })
    .optional();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude schema from restConfig
  const { schema: _unusedSchema, ...restConfig } = config;
  return {
    ...restConfig,
    schemaType: "primitive" as const,
    schema: rangeSchema,
    usage: { request: "data", response: true },
  };
}

export function responseRangeField<
  TKey extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEnum extends z.ZodEnum<any>,
>(
  config: Omit<
    RangeSliderFieldWidgetConfig<
      TKey,
      z.ZodOptional<
        z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
      >,
      { request?: never; response: true }
    >,
    "schema" | "usage" | "schemaType"
  > & {
    schema: TEnum;
  },
): RangeSliderFieldWidgetConfig<
  TKey,
  z.ZodOptional<
    z.ZodObject<{ min: z.ZodOptional<TEnum>; max: z.ZodOptional<TEnum> }>
  >,
  { request?: never; response: true }
> {
  const rangeSchema = z
    .object({
      min: config.schema.optional(),
      max: config.schema.optional(),
    })
    .optional();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude schema from restConfig
  const { schema: _unusedSchema, ...restConfig } = config;
  return {
    ...restConfig,
    schemaType: "primitive" as const,
    schema: rangeSchema,
    usage: { response: true },
  };
}

/**
 * Create a widget-only field (buttons, alerts, static content)
 */
export function widgetField<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  const TUIConfig extends Omit<
    DisplayOnlyWidgetConfig<TKey, TUsage, "widget">,
    "schemaType" | "schema"
  >,
>(ui: TUIConfig): TUIConfig & { schemaType: "widget"; schema: never } {
  return {
    schemaType: "widget" as const,
    schema: undefined as never,
    ...ui,
  };
}

/**
 * Create a widget-only object field (container with only widget children like button groups)
 * This is like widgetField but for grouped widgets - renders based on usage pattern, not response data
 */
export function widgetObjectField<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends Omit<
    ObjectWidgetConfig<TKey, TUsage, "widget-object", TChildren>,
    "usage" | "children" | "schemaType"
  >,
>(
  ui: TUIConfig,
  usage: TUsage,
  children: TChildren,
): TUIConfig & {
  schemaType: "widget-object";
  children: TChildren;
  usage: TUsage;
} {
  return {
    schemaType: "widget-object" as const,
    children,
    usage,
    ...ui,
  };
}

/**
 * Create an object field containing other fields
 *
 * Uses TranslationKey by default for automatic validation.
 * For scoped translations, use scopedObjectField<ScopedKeyType> instead.
 */
export function objectField<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends Omit<
    ObjectWidgetConfig<TKey, TUsage, "object", TChildren>,
    "children" | "usage" | "schemaType"
  >,
>(
  uiConfig: TUIConfig,
  usage: TUsage,
  children: TChildren,
): TUIConfig & {
  schemaType: "object";
  usage: TUsage;
  children: TChildren;
} {
  return {
    schemaType: "object" as const,
    ...uiConfig,
    usage,
    children,
  };
}

/**
 * Scoped translation object type for type inference
 */
interface ScopedTranslationType<TKey extends string = string> {
  ScopedTranslationKey: TKey;
}

/**
 * Create an object field for scoped translations with full type checking.
 * Pass the scopedTranslation object to infer the key type and enable validation.
 *
 * @example
 * scopedObjectField(
 *   scopedTranslation,
 *   { type: WidgetType.CONTAINER, title: "form.label", ... },
 *   { request: "data", response: true },
 *   { name: scopedRequestField(scopedTranslation, { label: "form.name.label", ... }, z.string()) }
 * )
 */
export function scopedObjectField<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends Omit<
    ObjectWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "object",
      TChildren
    >,
    "usage" | "children" | "schemaType"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  usage: TUsage,
  children: TChildren,
): TUIConfig & {
  schemaType: "object";
  children: TChildren;
  usage: TUsage;
} {
  return {
    ...ui,
    schemaType: "object" as const,
    children,
    usage,
  };
}

/**
 * Create a response array optional field for scoped translations with full type checking.
 */
export function scopedResponseArrayOptionalField<
  TScopedTranslation extends ScopedTranslationType,
  TChild extends ArrayChildConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TUIConfig extends ArrayWidgetConfig<
    TScopedTranslation["ScopedTranslationKey"],
    { response: true },
    "array-optional",
    TChild
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array-optional";
  child: TChild;
  usage: { request?: never; response: true };
} {
  return {
    ...ui,
    schemaType: "array-optional" as const,
    child,
    usage: { response: true },
  };
}

/**
 * Create an array field containing repeated items
 */
export function arrayField<
  TKey extends string,
  TChild extends AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>,
  TUsage extends FieldUsageConfig,
  const TUIConfig extends ArrayWidgetConfig<TKey, TUsage, "array", TChild>,
>(
  usage: TUsage,
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array";
  child: TChild;
  usage: TUsage;
} {
  return {
    ...ui,
    schemaType: "array" as const,
    child,
    usage,
  };
}

/**
 * Create a request array field
 */
export function requestDataArrayField<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >, // oxlint-disable-line typescript/no-explicit-any
  const TUIConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request: "data"; response?: never },
      "array",
      TChild
    >,
    "child" | "schemaType" | "usage"
  >,
>(
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array";
  child: TChild;
  usage: { request: "data"; response?: never };
} {
  return {
    ...ui,
    schemaType: "array" as const,
    child,
    usage: { request: "data" },
  };
}

/**
 * Create a response array field
 */
export function responseArrayField<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ response: true }>
  >,
  const TUIConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request?: never; response: true },
      "array",
      TChild
    >,
    "child" | "schemaType" | "usage"
  >,
>(
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array";
  child: TChild;
  usage: { request?: never; response: true };
} {
  return {
    ...ui,
    schemaType: "array" as const,
    child,
    usage: { response: true },
  };
}

/**
 * Create an optional object field
 */
export function objectOptionalField<
  TKey extends string,
  TFieldUsageConfig extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TFieldUsageConfig>
  >,
  const TUIConfig extends Omit<
    ObjectWidgetConfig<TKey, TFieldUsageConfig, "object-optional", TChildren>,
    "usage" | "children" | "schemaType"
  >,
>(
  ui: TUIConfig,
  usage: TFieldUsageConfig,
  children: TChildren,
): TUIConfig & {
  schemaType: "object-optional";
  children: TChildren;
  usage: TFieldUsageConfig;
} {
  return {
    schemaType: "object-optional" as const,
    children,
    usage,
    ...ui,
  };
}

/**
 * Create a discriminated union object field
 */
export function objectUnionField<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TDiscriminator extends string,
  const TVariants extends UnionObjectWidgetConfigConstrain<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends Omit<
    ObjectUnionWidgetConfig<TKey, TUsage, TVariants>,
    "usage" | "discriminator" | "variants" | "schemaType"
  >,
>(
  ui: TUIConfig,
  usage: TUsage,
  discriminator: TDiscriminator,
  variants: TVariants,
): TUIConfig & {
  schemaType: "object-union";
  discriminator: TDiscriminator;
  variants: TVariants;
  usage: TUsage;
} {
  return {
    schemaType: "object-union" as const,
    discriminator,
    variants,
    usage,
    ...ui,
  };
}

/**
 * Create an optional array field
 */
export function arrayOptionalField<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
  const TUIConfig extends ArrayWidgetConfig<
    TKey,
    TUsage,
    "array-optional",
    TChild
  >,
>(
  usage: TUsage,
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array-optional";
  child: TChild;
  usage: TUsage;
} {
  return {
    ...ui,
    schemaType: "array-optional" as const,
    child,
    usage,
  };
}

/**
 * Create an optional request array field
 */
export function requestDataArrayOptionalField<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >,
  TUIConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request: "data"; response?: never },
      "array-optional",
      TChild
    >,
    "child" | "schemaType" | "usage"
  >,
>(
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array-optional";
  child: TChild;
  usage: { request: "data"; response?: never };
} {
  return {
    ...ui,
    schemaType: "array-optional" as const,
    child,
    usage: { request: "data" },
  };
}

/**
 * Create an optional response array field
 */
export function responseArrayOptionalField<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TUIConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request?: never; response: true },
      "array-optional",
      TChild
    >,
    "child" | "schemaType" | "usage"
  >,
>(
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array-optional";
  child: TChild;
  usage: { request?: never; response: true };
} {
  return {
    ...ui,
    schemaType: "array-optional" as const,
    child,
    usage: { response: true },
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
  TVariants extends readonly ObjectWidgetConfig<
    string,
    FieldUsageConfig,
    "object",
    ObjectChildrenConstraint<string, FieldUsageConfig>
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Head extends ObjectWidgetConfig<
      string,
      FieldUsageConfig,
      "object",
      ObjectChildrenConstraint<string, FieldUsageConfig>
    >
    ? Tail extends ObjectWidgetConfig<
        string,
        FieldUsageConfig,
        "object",
        ObjectChildrenConstraint<string, FieldUsageConfig>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Type parameters used for narrowing
  F extends UnifiedField<TKey, infer TSchema, infer _TUsage, infer _TChildren>
    ? F extends {
        type: "primitive";
        usage: infer U;
      }
      ? Usage extends FieldUsage.ResponseData
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
        ? Usage extends FieldUsage.ResponseData
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
              usage: infer U extends FieldUsageConfig;
            }
          ? U extends FieldUsageConfig
            ? TVariants extends UnionObjectWidgetConfigConstrain<
                TKey,
                ConstrainedChildUsage<U>
              >
              ? Usage extends FieldUsage.ResponseData
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
            : never
          : F extends {
                type: "object" | "object-optional";
                children: infer C;
                usage: infer U;
              }
            ? Usage extends FieldUsage.ResponseData
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
  C extends Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  >
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
      case FieldUsage.ResponseData:
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
    schemaType?:
      | "primitive"
      | "widget"
      | "widget-object"
      | "object"
      | "object-optional"
      | "object-union"
      | "array"
      | "array-optional";
    usage?: FieldUsageConfig;
    schema?: z.ZodTypeAny;
    children?: Record<
      string,
      UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
    >;
    child?: UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    discriminator?: string;
    variants?: readonly ObjectWidgetConfig<
      string,
      FieldUsageConfig,
      "object",
      ObjectChildrenConstraint<string, FieldUsageConfig>
    >[];
    optional?: boolean;
  }

  const typedField = field as F & FieldWithType;

  // Create a reference z.never() type for comparison - ensures runtime correctness
  const neverType = z.never()._def.type;

  // Widget-only fields have no schema and are skipped during schema generation
  if (typedField.schemaType === "widget") {
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (typedField.schemaType === "primitive") {
    if (hasUsage(typedField.usage)) {
      return typedField.schema as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (typedField.schemaType === "object") {
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
        const field = childField;

        // CRITICAL: Skip widget fields completely - they should NEVER be in validation schemas
        // Widget fields (formAlert, submitButton, etc.) are UI-only and don't send/receive data
        const isWidgetField =
          "schemaType" in field && field.schemaType === "widget";
        if (isWidgetField) {
          continue;
        }

        // CRITICAL: Skip objectFields that only contain widget children - they're UI-only containers
        // Examples: footerLinks container with only widget links inside
        const isObjectFieldWithOnlyWidgets =
          "schemaType" in field &&
          field.schemaType === "object" &&
          "children" in field &&
          field.children &&
          Object.values(
            field.children as Record<
              string,
              UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
            >,
          ).every(
            (grandchild) =>
              "schemaType" in grandchild && grandchild.schemaType === "widget",
          );
        if (isObjectFieldWithOnlyWidgets) {
          continue;
        }

        // Check if the child field has the required usage BEFORE generating the schema
        // This is more efficient and avoids issues with z.never() detection
        if (
          "usage" in field &&
          field.usage &&
          typeof field.usage === "object" &&
          field.usage !== null
        ) {
          const childHasUsage =
            targetUsage === FieldUsage.ResponseData
              ? "response" in field.usage && field.usage.response === true
              : targetUsage === FieldUsage.RequestData
                ? "request" in field.usage &&
                  (field.usage.request === "data" ||
                    field.usage.request === "data&urlPathParams")
                : targetUsage === FieldUsage.RequestUrlParams
                  ? "request" in field.usage &&
                    (field.usage.request === "urlPathParams" ||
                      field.usage.request === "data&urlPathParams")
                  : false;

          // Skip fields that don't have the required usage
          if (!childHasUsage) {
            continue;
          }
        }

        const childSchema = generateSchemaForUsage<typeof childField, Usage>(
          childField,
          targetUsage,
        );
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

    // Apply optional modifier if specified in widget config
    if ("optional" in typedField && typedField.optional) {
      const optionalSchema = objectSchema.nullable().optional();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
      return optionalSchema as unknown as InferSchemaFromField<F, Usage>;
    }

    return objectSchema as InferSchemaFromField<F, Usage>;
  }

  if (typedField.schemaType === "object-optional") {
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
        const isWidgetField =
          "schemaType" in childField && childField.schemaType === "widget";
        if (isWidgetField) {
          continue;
        }

        const childSchema = generateSchemaForUsage<typeof childField, Usage>(
          childField,
          targetUsage,
        );
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

  if (typedField.schemaType === "object-union") {
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
      const variantSchema = generateSchemaForUsage<typeof variant, Usage>(
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
      return z.never() as InferSchemaFromField<F, Usage>;
    }

    // If only one variant, just return it (no need for union)
    if (variantSchemas.length === 1) {
      return variantSchemas[0] as InferSchemaFromField<F, Usage>;
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
    return unionSchema as any as InferSchemaFromField<F, Usage>;
  }

  if (typedField.schemaType === "array") {
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
        childSchema = generateSchemaForUsage<typeof typedField.child, Usage>(
          typedField.child,
          targetUsage,
        );
        // Check if schema is z.never() using _def.type check
        if (childSchema._def.type === neverType) {
          return z.never() as InferSchemaFromField<F, Usage>;
        }
      }

      let arraySchema = z.array(childSchema);

      // Apply optional modifier if specified in config
      if (typedField.optional) {
        const optionalArraySchema = arraySchema.nullable().optional();
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type casting: Complex Zod schema inference requires unknown as intermediate step for type safety between incompatible generic structures.
        return optionalArraySchema as unknown as InferSchemaFromField<F, Usage>;
      }

      return arraySchema as InferSchemaFromField<F, Usage>;
    }
    return z.never() as InferSchemaFromField<F, Usage>;
  }

  if (typedField.schemaType === "array-optional") {
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
        childSchema = generateSchemaForUsage<typeof typedField.child, Usage>(
          typedField.child,
          targetUsage,
        );
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
 */
export function generateRequestDataSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestData> {
  return generateSchemaForUsage<F, FieldUsage.RequestData>(
    field,
    FieldUsage.RequestData,
  );
}

/**
 * Generate request URL params schema with proper input/output type differentiation
 */
export function generateRequestUrlSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestUrlParams> {
  return generateSchemaForUsage<F, FieldUsage.RequestUrlParams>(
    field,
    FieldUsage.RequestUrlParams,
  );
}

/**
 * Generate response schema with proper input/output type differentiation
 */
export function generateResponseSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.ResponseData> {
  return generateSchemaForUsage<F, FieldUsage.ResponseData>(
    field,
    FieldUsage.ResponseData,
  );
}

// ============================================================================
// NAVIGATION BUTTON FIELD HELPERS
// ============================================================================

/**
 * Create a navigation button field for cross-definition navigation
 * This is a UI-only field (no schema) that triggers navigation to another endpoint
 *
 * @template TSourceData - The data available in the source context (e.g., list item data)
 * @template TTargetEndpoint - The target endpoint to navigate to
 * @template TKey - Translation key type
 *
 * @param config - Navigation button configuration with type-safe parameter extraction
 * @returns WidgetField configured for navigation
 *
 * @example
 * ```typescript
 * // In a list definition
 * favorites: responseArrayField({
 *   children: {
 *     viewButton: navigateButtonField({
 *       targetEndpoint: favoriteDetailEndpoint,
 *       extractParams: (favorite) => ({ id: favorite.id }),
 *       label: "view",
 *       variant: "outline"
 *     })
 *   }
 * })
 * ```
 */
export function navigateButtonField<
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny,
  TGetEndpoint extends CreateApiEndpointAny | undefined = undefined,
>(
  config: Omit<
    NavigateButtonWidgetConfig<
      TranslationKey,
      TUsage,
      "widget",
      TTargetEndpoint,
      TGetEndpoint
    >,
    "schemaType" | "type"
  >,
): NavigateButtonWidgetConfig<
  TranslationKey,
  TUsage,
  "widget",
  TTargetEndpoint,
  TGetEndpoint
> {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.NAVIGATE_BUTTON,
    label: config.label,
    icon: config.icon,
    variant: config.variant ?? "outline",
    size: config.size,
    className: config.className,
    inline: config.inline,
    hidden: config.hidden,
    order: config.order,
    columns: config.columns,
    // Store navigation config in metadata for widget access
    targetEndpoint: config.targetEndpoint,
    extractParams: config.extractParams,
    prefillFromGet: config.prefillFromGet,
    getEndpoint: config.getEndpoint,
    renderInModal: config.renderInModal,
    popNavigationOnSuccess: config.popNavigationOnSuccess,
  };
}

/**
 * Convenience helper for creating an edit button that navigates to an edit endpoint
 * Automatically sets prefillFromGet: true to fetch current data before showing form
 *
 * @template TSourceData - The data available in the source context
 * @template TTargetEndpoint - The edit endpoint to navigate to
 * @template TKey - Translation key type
 *
 * @example
 * ```typescript
 * editButton: editButton({
 *   targetEndpoint: favoriteEditEndpoint,
 *   extractParams: (favorite) => ({ id: favorite.id })
 * })
 * ```
 */
export function editButton<
  TTargetEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TGetEndpoint extends CreateApiEndpointAny | undefined = undefined,
>(
  config: NavigateButtonWidgetConfig<
    TranslationKey,
    TUsage,
    "widget",
    TTargetEndpoint,
    TGetEndpoint
  >,
): NavigateButtonWidgetConfig<
  TranslationKey,
  TUsage,
  "widget",
  TTargetEndpoint,
  TGetEndpoint
> {
  return navigateButtonField<TUsage, TTargetEndpoint, TGetEndpoint>({
    ...config,
    prefillFromGet: true,
  });
}

/**
 * Convenience helper for creating a delete button that opens DELETE endpoint in a modal popover
 * The back button closes the modal instead of navigating back
 * On successful deletion, optionally pops the navigation stack N times
 *
 * @template TTargetEndpoint - The delete endpoint to use
 * @template TKey - Translation key type
 *
 * @example Delete from list (stays on list)
 * ```typescript
 * deleteButton: deleteButton({
 *   targetEndpoint: favoriteDeleteEndpoint,
 *   extractParams: (favorite) => ({ urlPathParams: { id: favorite.id } })
 * })
 * ```
 *
 * @example Delete from details page (navigate back to list)
 * ```typescript
 * deleteButton: deleteButton({
 *   targetEndpoint: favoriteDeleteEndpoint,
 *   extractParams: (data) => ({ urlPathParams: { id: data.id } }),
 *   popNavigationOnSuccess: 1 // Pop once to go back to list
 * })
 * ```
 */
export function deleteButton<
  TTargetEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>(
  config: Omit<
    NavigateButtonWidgetConfig<
      TranslationKey,
      TUsage,
      "widget",
      TTargetEndpoint,
      undefined
    >,
    "schemaType" | "type" | "getEndpoint" | "prefillFromGet"
  >,
): NavigateButtonWidgetConfig<
  TranslationKey,
  TUsage,
  "widget",
  TTargetEndpoint,
  undefined
> {
  return navigateButtonField<TUsage, TTargetEndpoint, undefined>({
    ...config,
    renderInModal: true,
    icon: config.icon ?? "trash",
    variant: config.variant ?? "destructive",
    popNavigationOnSuccess: config.popNavigationOnSuccess,
  });
}

/**
 * Convenience helper for creating a back button that pops the navigation stack
 * Sets targetEndpoint to null to trigger navigation.pop()
 *
 * @template TKey - Translation key type
 *
 * @example
 * ```typescript
 * backButton: backButton({ label: "back_to_list" })
 * ```
 */
export function backButton<
  TUsage extends FieldUsageConfig,
  const TConfig extends Omit<
    NavigateButtonWidgetConfig<
      TranslationKey,
      TUsage,
      "widget",
      undefined,
      undefined
    >,
    "schemaType" | "type" | "targetEndpoint" | "getEndpoint" | "prefillFromGet"
  >,
>(
  config: TConfig,
): TConfig & {
  schemaType: "widget";
  type: WidgetType.NAVIGATE_BUTTON;
  targetEndpoint: undefined;
  getEndpoint: undefined;
  prefillFromGet: false;
} {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.NAVIGATE_BUTTON,
    label: config?.label,
    icon: config?.icon ?? ("arrow-left" as const),
    variant: config?.variant ?? ("outline" as const),
    size: config?.size,
    className: config?.className,
    inline: config?.inline,
    hidden: config?.hidden,
    order: config?.order,
    columns: config?.columns,
    targetEndpoint: undefined,
    extractParams: undefined,
    prefillFromGet: false,
    getEndpoint: undefined,
    renderInModal: false,
    popNavigationOnSuccess: undefined,
  } as TConfig & {
    schemaType: "widget";
    type: WidgetType.NAVIGATE_BUTTON;
    targetEndpoint: undefined;
    getEndpoint: undefined;
    prefillFromGet: false;
  };
}

/**
 * Convenience helper for creating a submit button
 * Renders a button that triggers form submission
 *
 * @template TKey - Translation key type
 *
 * @example
 * ```typescript
 * submitButton: submitButton({
 *   label: "app.api.user.public.login.actions.submit",
 *   loadingText: "app.api.user.public.login.actions.submitting",
 *   icon: "save",
 *   variant: "primary",
 *   className: "ml-auto"
 * })
 * ```
 */
export function submitButton<TUsage extends FieldUsageConfig>(config: {
  label?: TranslationKey;
  loadingText?: TranslationKey;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconSize?: "xs" | "sm" | "base" | "lg";
  iconSpacing?: SpacingSize;
  usage: TUsage;
  className?: string;
  inline?: boolean;
}): SubmitButtonWidgetConfig<TranslationKey, TUsage, "widget"> {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.SUBMIT_BUTTON,
    text: config.label,
    loadingText: config.loadingText,
    icon: config.icon,
    variant: config.variant ?? "default",
    size: config.size ?? "default",
    iconSize: config.iconSize,
    iconSpacing: config.iconSpacing,
    className: config.className,
    inline: config.inline,
  };
}
