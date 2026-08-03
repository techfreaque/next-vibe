/**
 * DateTime Field Widget Types
 * Handles DATETIME field type
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { DateWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * DateTime field widget configuration
 */
export interface DateTimeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.DATETIME;
  minDateTime?: Date;
  maxDateTime?: Date;
}
