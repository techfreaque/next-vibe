/**
 * Alert Widget Type Definitions
 */

import type { WidgetType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";

/**
 * Alert widget schema - accepts string for alert content
 */
export type AlertWidgetSchema = StringWidgetSchema;

/**
 * Alert Widget Configuration
 */
export interface AlertWidgetConfig<
  TKey extends string,
  TSchema extends AlertWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.ALERT;
  content?: NoInfer<TKey>;
  variant?: "default" | "destructive" | "success" | "warning";
  schema: TSchema;
}
