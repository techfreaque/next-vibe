/**
 * Type Guards and Narrowing Helpers for Widget Type System
 *
 * Consolidated type guards for:
 * - Widget config shapes (object, array, union widgets)
 * - UnifiedField variants (primitive, object, array, union fields)
 * - Runtime value narrowing helpers
 *
 * All guards use discriminated union properties directly via schemaType.
 *
 * hasChildren / hasChild accept structural `{ schemaType: SchemaTypes }`
 * so that BaseWidgetFieldProps<TWidgetConfig> (an intersection that always
 * carries schemaType from BaseWidgetConfig) satisfies the input in generic
 * context — unlike UnifiedField which requires resolved conditional types.
 */

import type z from "zod";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import type {
  AnyChildrenConstrain,
  BaseWidgetConfig,
  FieldUsageConfig,
  SchemaTypes,
} from "./types";

// ============================================================================
// WIDGET CONFIG TYPE GUARDS
// ============================================================================

/**
 * Check if field is used for response (display output).
 * Accepts any field with a usage property.
 */
export function isResponseField(
  field:
    | BaseWidgetConfig<FieldUsageConfig, SchemaTypes>
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>,
): boolean {
  return "usage" in field && field.usage.response === true;
}

/**
 * Check if field has request usage (either exclusively or along with response).
 */
export function isRequestField(
  field:
    | BaseWidgetConfig<FieldUsageConfig, SchemaTypes>
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>,
): boolean {
  return "usage" in field && field.usage.request !== undefined;
}

/**
 * Type guard for fields with children (object, object-optional, or widget-object).
 *
 * Structural input: accepts any T.
 * This lets BaseWidgetFieldProps<TWidgetConfig> (which intersects BaseWidgetConfig
 * carrying schemaType) satisfy the guard in generic context without needing
 * resolved conditional types.
 *
 * Narrows both the structural shape (children Record) and the value type
 * to Record<string, WidgetData> for type-safe property access.
 *
 * IMPORTANT: This preserves ALL properties from T using intersection (&).
 * Custom widget properties (like getClassName in DataCards) are retained.
 *
 * The children type must extend Record to enable Object.entries() access.
 */
export function hasChildren<T>(field: T): field is T & {
  schemaType: "object" | "object-optional" | "widget-object";
  children: Record<
    string,
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>
  >;
  value: Record<string, WidgetData>;
} {
  return (
    typeof field === "object" &&
    field !== null &&
    "schemaType" in field &&
    (field.schemaType === "object" ||
      field.schemaType === "object-optional" ||
      field.schemaType === "widget-object")
  );
}

/**
 * Type guard for fields with child (array or array-optional).
 *
 * Structural input: accepts any T with `schemaType: SchemaTypes`.
 * Narrows to include `child` config and `value: WidgetData[]`.
 *
 * `child.children?` is included because array item templates may be object
 * widgets (with sub-fields). Consumers check `child.children` truthiness to
 * determine if items have structured sub-fields vs. simple values.
 *
 * The child type must be compatible with withValue() input constraints.
 */
export function hasChild<T extends { schemaType: SchemaTypes }>(
  field: T,
): field is T & {
  schemaType: "array" | "array-optional";
  child: T extends { child: infer TChild }
    ? TChild
    : AnyChildrenConstrain<string, FieldUsageConfig>;
  value: WidgetData[];
} {
  return field.schemaType === "array" || field.schemaType === "array-optional";
}

// ============================================================================
// RUNTIME VALUE HELPERS
// ============================================================================

/**
 * Check if value is an array.
 */
export function isArrayValue<T extends WidgetData>(
  value: WidgetData,
): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if value is a plain object (excludes arrays, primitives, null, undefined).
 */
export function isObject(
  value: WidgetData,
): value is { [key: string]: WidgetData } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
