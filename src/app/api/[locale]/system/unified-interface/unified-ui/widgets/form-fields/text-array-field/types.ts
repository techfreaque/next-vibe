/**
 * Text Array Field Widget Types
 * Handles TEXT_ARRAY field type - array of text strings
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ArrayWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { TagOption } from "@/packages/next-vibe-ui/web/ui/tags-field";

import type { FieldUsageConfig } from "../../_shared/types";
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
