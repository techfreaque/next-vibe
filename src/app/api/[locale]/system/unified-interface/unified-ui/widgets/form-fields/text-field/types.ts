/**
 * Text Field Widget Types
 * Handles TEXT, EMAIL, URL, TEL field types
 */

import type { z } from "zod";

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

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
