/**
 * Markdown Editor Widget Types
 * Editable text field with inline editing capability
 */

import type { SpacingSize, WidgetType } from "next-vibe/core/definition/enums";
import type {
  NumberWidgetSchema,
  StringWidgetSchema,
} from "next-vibe/unified-ui/_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import { z } from "zod";

/**
 * Editable text object schema - for complex edit configurations
 */
export const EditableTextObjectSchema = z.object({
  value: z.union([z.string(), z.number()]),
  placeholder: z.string().optional(),
  multiline: z.boolean().optional(),
  maxLength: z.number().optional(),
  readonly: z.boolean().optional(),
});

/**
 * Markdown editor widget schema - accepts string, number, or editable text object
 */
export type MarkdownEditorWidgetSchema =
  | StringWidgetSchema
  | NumberWidgetSchema
  | typeof EditableTextObjectSchema;

/**
 * Markdown Editor Widget Configuration
 * Editable text field with inline editing
 */
export interface MarkdownEditorWidgetConfig<
  out TKey extends string,
  TSchema extends MarkdownEditorWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.MARKDOWN_EDITOR;

  /** Label translation key */
  label?: NoInfer<TKey>;

  /** Placeholder translation key */
  placeholder?: NoInfer<TKey>;

  /** Container gap */
  gap?: SpacingSize;

  /** Input height */
  inputHeight?: "xs" | "sm" | "base" | "lg";

  /** Button size */
  buttonSize?: "xs" | "sm" | "base" | "lg";

  /** Icon size for action buttons */
  actionIconSize?: "xs" | "sm" | "base" | "lg";

  /** Icon size for edit button */
  editIconSize?: "xs" | "sm" | "base";
}
