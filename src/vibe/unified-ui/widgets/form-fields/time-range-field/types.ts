/**
 * Time Range Field Widget Types
 * Handles TIME_RANGE field type
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Time range field widget configuration
 */
export interface TimeRangeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TIME_RANGE;
  minTime?: string;
  maxTime?: string;
  step?: number;
}
