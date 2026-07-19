/**
 * Int Field Widget Types
 * Handles INT field type (integer numbers)
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { NumberWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

/**
 * Int field widget configuration
 */
export interface IntFieldWidgetConfig<
  out TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.INT;
  min?: number;
  max?: number;
  step?: number;
}
