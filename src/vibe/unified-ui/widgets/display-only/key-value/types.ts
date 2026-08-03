/**
 * Key-Value Widget Types
 * Displays key-value pairs from object/record data
 */

import type { WidgetType } from "../../../../core/definition/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";
import type { z } from "zod";

/**
 * Key-value widget schema - must produce Record<string, string | number>
 */
export type KeyValueWidgetSchema = z.ZodType<Record<string, string | number>>;

/**
 * Key-Value Widget Configuration
 * Displays object data as formatted key-value pairs
 */
export interface KeyValueWidgetConfig<
  out TKey extends string,
  TSchema extends KeyValueWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.KEY_VALUE;

  /** Label/title for the key-value display */
  label?: NoInfer<TKey>;

  /** Number of columns for layout (future use) */
  columns?: number;

  /** Schema constraint for the field value */
  schema: TSchema;
}
