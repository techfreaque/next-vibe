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
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import type {
  AnyChildrenConstrain,
  BaseArrayWidgetConfig,
  BaseObjectUnionWidgetConfig,
  BaseObjectWidgetConfig,
  BaseWidgetConfig,
  BaseWidgetContext,
  ConstrainedChildUsage,
  FieldUsageConfig,
  SchemaTypes,
  UnionObjectWidgetConfigConstrain,
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
 * Type predicate to check if config is an object widget (with children).
 * Narrows TConfig from discriminated union via schemaType.
 */
export function isObjectWidget<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TConfig extends
    | BaseArrayWidgetConfig<
        TKey,
        TUsage,
        "array" | "array-optional",
        AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>
      >
    | BaseObjectWidgetConfig<
        TKey,
        TUsage,
        "object" | "object-optional" | "widget-object",
        Record<
          string,
          AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>
        >
      >
    | BaseObjectUnionWidgetConfig<
        TKey,
        TUsage,
        "object-union",
        UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
      >,
>(
  config: TConfig,
): config is TConfig &
  BaseObjectWidgetConfig<
    TKey,
    TUsage,
    "object" | "object-optional" | "widget-object",
    Record<string, AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>>
  > {
  return (
    config.schemaType === "object" ||
    config.schemaType === "object-optional" ||
    config.schemaType === "widget-object"
  );
}

// ============================================================================
// UNIFIED FIELD TYPE GUARDS
// ============================================================================

/**
 * Type guard for ObjectUnionField — narrows to schemaType: "object-union"
 */
export function isObjectUnionField<TKey extends string>(
  field: UnifiedField<
    TKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TKey, FieldUsageConfig>
  >,
): field is UnifiedField<
  TKey,
  z.ZodTypeAny,
  FieldUsageConfig,
  AnyChildrenConstrain<TKey, FieldUsageConfig>
> & {
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
 * Type guard for PrimitiveField — narrows to schemaType: "primitive"
 */
export function isPrimitiveField<TKey extends string>(
  field: UnifiedField<
    TKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TKey, FieldUsageConfig>
  >,
): field is Extract<
  UnifiedField<
    TKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TKey, FieldUsageConfig>
  >,
  { schemaType: "primitive" }
> {
  return "schemaType" in field && field.schemaType === "primitive";
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
  child:
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>;
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

/**
 * Check if value is a boolean.
 */
export function isBoolean(value: WidgetData): value is boolean {
  return typeof value === "boolean";
}

/**
 * Check if value is null or undefined.
 */
export function isNullish(value: WidgetData): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Translate a value if it's a string key, otherwise return null.
 * Not a type guard — use for conditional translation in widgets.
 */
export function isString(
  value: WidgetData,
  t: BaseWidgetContext<CreateApiEndpointAny>["t"],
): string | null {
  return typeof value === "string" ? t(value) : null;
}

/**
 * Check if value is a number.
 */
export function isNumber(value: WidgetData): value is number {
  return typeof value === "number";
}
