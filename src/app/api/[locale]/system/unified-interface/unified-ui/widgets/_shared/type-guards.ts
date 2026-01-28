/**
 * Type Guards and Narrowing Helpers for Widget Type System
 *
 * These helpers allow safe property access on discriminated union types.
 * They enable TypeScript to narrow TWidgetConfig to specific shapes.
 */

import type { z } from "zod";

import type {
  BaseArrayWidgetConfig,
  BaseObjectUnionWidgetConfig,
  BaseObjectWidgetConfig,
  FieldUsageConfig,
} from "./types";

/**
 * Type predicate to check if config is an object widget (with children)
 * Narrows TConfig from discriminated union
 */
export function isObjectWidget<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TConfig extends
    | BaseArrayWidgetConfig<TKey, TUsage, any, any>
    | BaseObjectWidgetConfig<TKey, TUsage, any, any>
    | BaseObjectUnionWidgetConfig<TKey, TUsage, any, any>
    | unknown,
>(
  config: TConfig,
): config is TConfig & BaseObjectWidgetConfig<TKey, TUsage, any, any> {
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
 * Runtime check to safely access array widget's value as array
 * Useful in widget implementations to guard array access
 * Uses generic type parameter to preserve element type
 */
export function isArrayValue<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
