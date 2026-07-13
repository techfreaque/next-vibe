/**
 * Tags Field Widget Types
 * Array of tags input with suggestions
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { ArrayWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

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
