/**
 * Markdown Widget Types
 * Displays markdown-formatted content with GitHub-flavored styling
 */

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Markdown Widget Configuration
 * Renders markdown content with syntax highlighting and sanitization
 */
export interface MarkdownWidgetConfig<
  TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.MARKDOWN;

  /** Static markdown content (for hardcoded content, not field values) */
  content?: TKey;

  /** Number of columns for layout */
  columns?: number;

  /** Label for the markdown section */
  label?: TKey;

  /** Description for the markdown section */
  description?: TKey;

  /** Schema constraint for the field value */
  schema: TSchema;
}
