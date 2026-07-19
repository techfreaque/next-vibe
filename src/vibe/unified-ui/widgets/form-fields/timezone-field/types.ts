/**
 * Timezone Field Widget Types
 * Handles TIMEZONE field type - timezone selection
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

/**
 * Timezone field widget configuration
 */
export interface TimezoneFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TIMEZONE;
}
