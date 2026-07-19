/**
 * Time Field Widget Types
 * Handles TIME field type
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { DateWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

/**
 * Time field widget configuration
 */
export interface TimeFieldWidgetConfig<
  out TKey extends string,
  TSchema extends DateWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TIME;
  minTime?: string;
  maxTime?: string;
  step?: number;
}
