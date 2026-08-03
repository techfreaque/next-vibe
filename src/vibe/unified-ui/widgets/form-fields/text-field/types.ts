/**
 * Text Field Widget Types
 * Handles TEXT, EMAIL, URL, TEL field types
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Text field widget configuration
 */
export interface TextFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType:
    | FieldDataType.TEXT
    | FieldDataType.EMAIL
    | FieldDataType.URL
    | FieldDataType.TEL;
}
