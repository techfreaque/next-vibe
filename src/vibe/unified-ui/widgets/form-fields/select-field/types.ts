/**
 * Select Field Widget Types
 * Dropdown selection from predefined options
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { EnumWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface SelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends EnumWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.SELECT;
  options: ReadonlyArray<{
    value: string | number;
    label: NoInfer<TKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
  }>;
}
