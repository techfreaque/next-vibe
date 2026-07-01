/**
 * Text Field Widget Types
 * Handles TEXT, EMAIL, URL, TEL field types
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";
import type { z } from "zod";

/**
 * Text field input type
 */
export type TextFieldInputType = "text" | "email" | "url" | "tel";

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

/**
 * Extract value type from text field schema
 */
export type TextFieldValue<TSchema extends z.ZodTypeAny> = z.output<TSchema>;
