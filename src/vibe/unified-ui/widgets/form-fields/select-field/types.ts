/**
 * Select Field Widget Types
 * Dropdown selection from predefined options
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { EnumWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/widgets/form-fields/_shared/types";

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
