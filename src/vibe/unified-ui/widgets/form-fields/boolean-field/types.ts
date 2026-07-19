/**
 * Boolean Field Widget Types
 * Handles BOOLEAN field type (checkbox/switch)
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { BooleanWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

export interface BooleanFieldWidgetConfig<
  out TKey extends string,
  TSchema extends BooleanWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.BOOLEAN;
  checkboxLabel?: TKey;
  switchLabel?: TKey;
  variant?: "checkbox" | "switch";
}
