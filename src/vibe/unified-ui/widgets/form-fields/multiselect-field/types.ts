/**
 * MultiSelect Field Widget Types
 * Multiple selection from predefined options
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { ArrayWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";
import type { IconKey } from "../icon-field/icons";

export interface MultiSelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.MULTISELECT;
  options: ReadonlyArray<{
    value: string | number;
    label: NoInfer<TKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
    icon?: IconKey;
  }>;
  maxSelections?: number;
  searchable?: boolean;
}
