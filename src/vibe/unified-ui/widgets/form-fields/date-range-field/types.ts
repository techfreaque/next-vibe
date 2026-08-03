/**
 * Date Range Field Widget Types
 * Handles DATE_RANGE field type
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Date range field widget configuration
 */
export interface DateRangeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.DATE_RANGE;
  minDate?: Date;
  maxDate?: Date;
}
