/**
 * Form Alert Widget Type Definitions
 */

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Form Alert Widget Configuration
 */
export interface FormAlertWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.FORM_ALERT;
}
