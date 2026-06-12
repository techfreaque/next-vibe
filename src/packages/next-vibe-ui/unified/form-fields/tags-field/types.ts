/**
 * Tags Field Widget Types
 * Array of tags input with suggestions
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ArrayWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface TagsFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TAGS;
  suggestions?: Array<{
    value: string;
    label: NoInfer<TKey>;
    category?: string;
  }>;
  maxTags?: number;
  allowCustom?: boolean;
}
