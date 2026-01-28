/**
 * Model Display Widget Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Model Display Widget Configuration - Union of object and object-union variants
 */
export interface ModelDisplayWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.MODEL_DISPLAY;
}
