/**
 * Filter Pills Field Widget Types
 * Single-select field displayed as pill buttons with optional icons
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { EnumWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";
import type { IconKey } from "../icon-field/icons";

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
