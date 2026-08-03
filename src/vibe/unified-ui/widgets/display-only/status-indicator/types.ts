/**
 * Status Indicator Widget Type Definitions
 */

import type { WidgetType } from "../../../../core/definition/enums";
import type {
  EnumWidgetSchema,
  StringWidgetSchema,
} from "../../../_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";

/**
 * Status indicator schema - must be a string or enum
 */
export type StatusIndicatorWidgetSchema = StringWidgetSchema | EnumWidgetSchema;

/**
 * Status Indicator Widget Configuration
 */
export interface StatusIndicatorWidgetConfig<
  TKey extends string,
  TSchema extends StatusIndicatorWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.STATUS_INDICATOR;
  status: "success" | "warning" | "error" | "info" | "pending";
  label?: NoInfer<TKey>;
  schema: TSchema;
}
