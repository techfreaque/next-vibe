/**
 * Text Array Field Widget Types
 * Handles TEXT_ARRAY field type - array of text strings
 */

import type { TagOption } from "next-vibe/ui/ui/tags-field";

import type { FieldDataType } from "../../../../core/definition/enums";
import type { ArrayWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

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
