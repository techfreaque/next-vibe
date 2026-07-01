/**
 * Text Array Field Widget Types
 * Handles TEXT_ARRAY field type - array of text strings
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { TagOption } from "next-vibe/ui/web/ui/tags-field";
import type { ArrayWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

/**
 * Text array field widget configuration
 */
export interface TextArrayFieldWidgetConfig<
  out TKey extends string,
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TEXT_ARRAY;
  suggestions?: TagOption<TKey>[];
  maxTags?: number;
  allowCustom?: boolean;
}
