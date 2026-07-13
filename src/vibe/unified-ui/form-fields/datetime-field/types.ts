/**
 * DateTime Field Widget Types
 * Handles DATETIME field type
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { DateWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

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
