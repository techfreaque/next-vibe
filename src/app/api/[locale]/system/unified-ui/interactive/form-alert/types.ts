/**
 * Form Alert Widget Type Definitions
 */

import type { WidgetType } from "next-vibe/core/definition/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";

/**
 * Form Alert Widget Configuration
 */
export interface FormAlertWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.FORM_ALERT;
}
