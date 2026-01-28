/**
 * Field Type Guards
 *
 * Type-safe utilities for narrowing UnifiedField discriminated union types.
 * Eliminates the need for type assertions when working with field variants.
 */

import type { z } from "zod";

import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-ui/widgets/_shared/types";
import type { UnifiedField } from "../../types/endpoint";
import type { WidgetData } from "../widget-data";

/**
 * Type guard for ObjectUnionField - has discriminator and variants
 */
export function isObjectUnionField<TKey extends string>(
  // oxlint-disable-next-line typescript/no-explicit-any
  field: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>,
  // oxlint-disable-next-line typescript/no-explicit-any
): field is UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any> & {
  schemaType: "object-union";
  variants: readonly UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    never
  >[];
} {
  return "schemaType" in field && field.schemaType === "object-union";
}

/**
 * Type guard for PrimitiveField - has schema property
 */
export function isPrimitiveField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any,
): field is Extract<
  UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any,
  { schemaType: "primitive" }
> {
  return "schemaType" in field && field.schemaType === "primitive";
}

/**
 * Combined type guard for fields with children (object or object-optional)
 * Properly constrains children to ObjectChildrenConstraint for type safety
 */
export function hasChildren<
  TKey extends string,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
>(
  // oxlint-disable-next-line typescript/no-explicit-any
  field: UnifiedField<TKey, z.ZodTypeAny, TUsage, any>,
  // oxlint-disable-next-line typescript/no-explicit-any
): field is UnifiedField<TKey, z.ZodTypeAny, TUsage, any> & {
  schemaType: "object" | "object-optional" | "widget-object";
  // oxlint-disable-next-line typescript/no-explicit-any
  children: Record<string, UnifiedField<TKey, z.ZodTypeAny, TUsage, any>>;
} {
  return (
    "schemaType" in field &&
    (field.schemaType === "object" ||
      field.schemaType === "object-optional" ||
      field.schemaType === "widget-object")
  );
}

/**
 * Type guard for fields with child (array or array-optional)
 */
export function hasChild<TKey extends string>(
  // oxlint-disable-next-line typescript/no-explicit-any
  field: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>,
  // oxlint-disable-next-line typescript/no-explicit-any
): field is UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any> & {
  schemaType: "array" | "array-optional";
  // oxlint-disable-next-line typescript/no-explicit-any
  child: UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any>;
} {
  return (
    "schemaType" in field &&
    (field.schemaType === "array" || field.schemaType === "array-optional")
  );
}

/**
 * Type guard for WidgetData plain objects (excludes arrays, primitives, null, undefined)
 * Useful for safely narrowing to Record<string, WidgetData> type
 */
export function isWidgetDataObject(
  value: WidgetData,
): value is Record<string, WidgetData> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isWidgetDataString(
  value: WidgetData,
  context: { t: (key: string) => string },
): string | null {
  const isString = typeof value === "string";
  return isString ? context.t(value) : null;
}

/**
 * Type guard for WidgetData boolean values
 */
export function isWidgetDataBoolean(value: WidgetData): value is boolean {
  return typeof value === "boolean";
}

/**
 * Type guard for WidgetData null/undefined values
 */
export function isWidgetDataNullish(
  value: WidgetData,
): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard for widget config objects with children property
 * Used when checking variant configs from unions
 */
export function isConfigWithChildren<
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  config: unknown,
): config is {
  schemaType: "object" | "object-optional" | "widget-object";
  children: Record<string, AnyChildrenConstrain<TKey, TUsage>>;
} {
  return (
    config !== null &&
    typeof config === "object" &&
    "schemaType" in config &&
    (config.schemaType === "object" ||
      config.schemaType === "object-optional" ||
      config.schemaType === "widget-object") &&
    "children" in config &&
    config.children !== undefined &&
    typeof config.children === "object" &&
    !Array.isArray(config.children)
  );
}
