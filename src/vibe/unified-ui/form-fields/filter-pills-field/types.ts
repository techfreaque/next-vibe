/**
 * Filter Pills Field Widget Types
 * Single-select field displayed as pill buttons with optional icons
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { EnumWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";

export interface FilterPillsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends EnumWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.FILTER_PILLS;
  options: Array<{
    label: TKey;
    value: string | number;
    icon?: IconKey;
    description?: TKey;
  }>;
}
