/**
 * Boolean Field Widget Types
 * Handles BOOLEAN field type (checkbox/switch)
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { BooleanWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

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
