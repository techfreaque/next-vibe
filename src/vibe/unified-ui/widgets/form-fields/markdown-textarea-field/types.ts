/**
 * Markdown Textarea Field Widget Types
 * WYSIWYG rich text editor with toolbar and optional markdown preview
 */

import type { ToolbarAction } from "next-vibe/ui/components/markdown-editor";

import type { FieldDataType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

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
