/**
 * Markdown Textarea Field Widget Types
 * WYSIWYG rich text editor with toolbar and optional markdown preview
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { ToolbarAction } from "next-vibe/ui/ui/markdown-editor";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

export interface MarkdownTextareaFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.MARKDOWN_TEXTAREA;
  rows?: number;
  maxLength?: number;
  /** Which toolbar buttons to show. Defaults to all. */
  toolbar?: ToolbarAction[];
}
