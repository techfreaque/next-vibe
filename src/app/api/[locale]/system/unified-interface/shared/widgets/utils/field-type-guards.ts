/**
 * Field Type Guards
 *
 * Type-safe utilities for narrowing UnifiedField discriminated union types.
 * Eliminates the need for type assertions when working with field variants.
 */

import type { z } from "zod";

import type { UnifiedField } from "../../types/endpoint";

/**
 * Type guard for ObjectField - has children property
 */
export function isObjectField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object" }> {
  return field.type === "object";
}

/**
 * Type guard for ObjectOptionalField - has children property
 */
export function isObjectOptionalField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<
  UnifiedField<TKey, z.ZodTypeAny>,
  { type: "object-optional" }
> {
  return field.type === "object-optional";
}

/**
 * Type guard for ObjectUnionField - has discriminator and variants
 */
export function isObjectUnionField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<
  UnifiedField<TKey, z.ZodTypeAny>,
  { type: "object-union" }
> {
  return field.type === "object-union";
}

/**
 * Type guard for PrimitiveField - has schema property
 */
export function isPrimitiveField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "primitive" }> {
  return field.type === "primitive";
}

/**
 * Type guard for ArrayField - has child property
 */
export function isArrayField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "array" }> {
  return field.type === "array";
}

/**
 * Type guard for ArrayOptionalField - has child property
 */
export function isArrayOptionalField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<
  UnifiedField<TKey, z.ZodTypeAny>,
  { type: "array-optional" }
> {
  return field.type === "array-optional";
}

/**
 * Type guard for WidgetField - UI-only field with no schema
 */
export function isWidgetField<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "widget" }> {
  return field.type === "widget";
}

/**
 * Combined type guard for fields with children (object or object-optional)
 */
export function hasChildren<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is
  | Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object" }>
  | Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object-optional" }> {
  return field.type === "object" || field.type === "object-optional";
}

/**
 * Combined type guard for any field that can contain children (object, object-optional, or object-union)
 */
export function canHaveChildren<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): field is
  | Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object" }>
  | Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object-optional" }>
  | Extract<UnifiedField<TKey, z.ZodTypeAny>, { type: "object-union" }> {
  return (
    field.type === "object" ||
    field.type === "object-optional" ||
    field.type === "object-union"
  );
}

/**
 * Get children from a field that supports them (returns empty object if no children)
 */
export function getFieldChildren<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
): Record<string, UnifiedField<TKey, z.ZodTypeAny>> {
  if (hasChildren(field)) {
    return field.children;
  }
  return {};
}

/**
 * Check if field has a specific widget type in its UI config
 */
export function hasWidgetType<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
  widgetType: string,
): boolean {
  return field.ui?.type === widgetType;
}

/**
 * Recursively check if field or any of its children has a specific widget type
 */
export function hasWidgetTypeInTree<TKey extends string>(
  field: UnifiedField<TKey, z.ZodTypeAny>,
  widgetType: string,
): boolean {
  // Check direct field
  if (hasWidgetType(field, widgetType)) {
    return true;
  }

  // Check children
  if (hasChildren(field)) {
    return Object.values(field.children).some((child) =>
      hasWidgetTypeInTree(child, widgetType),
    );
  }

  // Check union variants
  if (isObjectUnionField(field)) {
    return field.variants.some((variant) =>
      hasWidgetTypeInTree(variant, widgetType),
    );
  }

  return false;
}

// ============================================================================
// WIDGETDATA TYPE GUARDS
// ============================================================================

/**
 * Import WidgetData type for type guards
 */
import type { WidgetData } from "../types";

/**
 * Type guard for WidgetData plain objects (excludes arrays, primitives, null, undefined)
 * Useful for safely narrowing to Record<string, WidgetData> type
 */
export function isWidgetDataObject(
  value: WidgetData,
): value is Record<string, WidgetData> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard for WidgetData arrays (excludes typed arrays like string[], number[])
 */
export function isWidgetDataArray(value: WidgetData): value is WidgetData[] {
  return Array.isArray(value);
}

export function isWidgetDataString(
  value: WidgetData,
  context: { t: (key: string) => string },
): string | null {
  const isString = typeof value === "string";
  return isString ? context.t(value) : null;
}

/**
 * Type guard for WidgetData number values
 */
export function isWidgetDataNumber(value: WidgetData): value is number {
  return typeof value === "number";
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
 * Type guard for WidgetData primitive values (string, number, boolean, null, undefined)
 */
export function isWidgetDataPrimitive(
  value: WidgetData,
): value is string | number | boolean | null | undefined {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}
