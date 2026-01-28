/**
 * Type Guards and Narrowing Helpers for Widget Type System
 *
 * Consolidated type guards for:
 * - Widget config shapes (object, array, union widgets)
 * - UnifiedField variants (primitive, object, array, union fields)
 * - Widget data runtime checks (objects, arrays, nullish values)
 *
 * These helpers enable safe property access on discriminated union types
 * and allow TypeScript to narrow types to specific shapes.
 */

import type z from "zod";
import type { ZodTypeAny } from "zod";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import type {
  AnyChildrenConstrain,
  BaseArrayWidgetConfig,
  BaseObjectUnionWidgetConfig,
  BaseObjectWidgetConfig,
  BaseWidgetContext,
  ConstrainedChildUsage,
  FieldUsageConfig,
  UnionObjectWidgetConfigConstrain,
} from "./types";

// ============================================================================
// WIDGET CONFIG TYPE GUARDS
// ============================================================================

/**
 * Check if field is used for response (display output)
 */
export function isResponseField<TKey extends string>(
  field: UnifiedField<
    TKey,
    ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TKey, FieldUsageConfig>
  >,
): boolean {
  if (
    "usage" in field &&
    field.usage &&
    typeof field.usage === "object" &&
    "response" in field.usage &&
    field.usage.response === true
  ) {
    return true;
  }
  return false;
}

/**
 * Check if field has request usage (either exclusively or along with response)
 */
export function isRequestField<TKey extends string>(
  field: UnifiedField<
    TKey,
    ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TKey, FieldUsageConfig>
  >,
): boolean {
  if (
    "usage" in field &&
    field.usage &&
    typeof field.usage === "object" &&
    "request" in field.usage &&
    field.usage.request !== undefined
  ) {
    return true;
  }
  return false;
}

/**
 * Type predicate to check if config is an object widget (with children)
 * Narrows TConfig from discriminated union
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
    config &&
    typeof config === "object" &&
    "schemaType" in config &&
    "children" in config &&
    (config.schemaType === "object" ||
      config.schemaType === "object-optional" ||
      config.schemaType === "widget-object")
  );
}

/**
 * Type guard for widget config objects with children property
 * Used when checking variant configs from unions
 */
export function isConfigWithChildren<
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  config: { [key: string]: WidgetData } | WidgetData,
): config is {
  schemaType: "object" | "object-optional" | "widget-object";
  children: Record<
    string,
    AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>
  >;
} & { [key: string]: WidgetData } {
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

// ============================================================================
// UNIFIED FIELD TYPE GUARDS
// ============================================================================

/**
 * Type guard for ObjectUnionField - has discriminator and variants
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
 * Type guard for PrimitiveField - has schema property
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
 * Combined type guard for fields with children (object or object-optional)
 * Properly constrains children to ObjectChildrenConstraint for type safety
 */
export function hasChildren<
  TKey extends string,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
>(
  field: UnifiedField<
    TKey,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<TKey, TUsage>
  >,
): field is UnifiedField<
  TKey,
  z.ZodTypeAny,
  TUsage,
  AnyChildrenConstrain<TKey, TUsage>
> & {
  schemaType: "object" | "object-optional" | "widget-object";
  children: Record<
    string,
    UnifiedField<TKey, z.ZodTypeAny, TUsage, AnyChildrenConstrain<TKey, TUsage>>
  >;
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
  schemaType: "array" | "array-optional";
  child: UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >;
} {
  return (
    "schemaType" in field &&
    (field.schemaType === "array" || field.schemaType === "array-optional")
  );
}

// ============================================================================
// RUNTIME VALUE TYPE GUARDS
// ============================================================================

/**
 * Type guard for value arrays
 * Useful in widget implementations to guard array access
 * Uses generic type parameter to preserve element type
 */
export function isArrayValue<T extends WidgetData>(
  value: WidgetData,
): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard for plain objects (excludes arrays, primitives, null, undefined)
 * Useful for safely narrowing to object type
 */
export function isObject(
  value: WidgetData,
): value is { [key: string]: WidgetData } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard for boolean values
 */
export function isBoolean(value: WidgetData): value is boolean {
  return typeof value === "boolean";
}

/**
 * Type guard for null/undefined values
 */
export function isNullish(value: WidgetData): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard for string values
 */
export function isString(
  value: WidgetData,
  context: BaseWidgetContext<CreateApiEndpointAny>,
): null | string {
  return typeof value === "string" ? context.t(value) : null;
}

/**
 * Type guard for number values
 */
export function isNumber(value: WidgetData): value is number {
  return typeof value === "number";
}
