/**
 * MultiSelect Field Widget Types
 * Multiple selection from predefined options
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ArrayWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface MultiSelectFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.MULTISELECT;
  options: Array<{
    value: string | number;
    label: NoInfer<TKey>;
    labelParams?: Record<string, string | number>;
    disabled?: boolean;
    icon?: IconKey;
  }>;
  maxSelections?: number;
  searchable?: boolean;
}
