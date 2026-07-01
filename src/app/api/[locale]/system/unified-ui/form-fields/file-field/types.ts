/**
 * File Field Widget Types
 * Handles FILE field type
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

/**
 * File field widget configuration
 */
export interface FileFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.FILE;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}
