/**
 * CodeOutput Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Code Output Widget Configuration
 */
export interface CodeOutputWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CODE_OUTPUT;
  title?: NoInfer<TKey>; // Optional title translation key
  description?: NoInfer<TKey>; // Optional description translation key
  code?: string; // Literal code snippet from data
  language?: string; // Programming language for syntax highlighting
  format?: "eslint" | "generic" | "json" | "table";
  outputFormat?: "eslint" | "generic" | "json" | "table";
  showSummary?: boolean;
  colorScheme?: "auto" | "light" | "dark";
  severityIcons?: Record<string, string>;
  groupBy?: string; // Field name to group output by
  sortBy?: string; // Field name to sort output by
  summaryTemplate?: string; // Template for summary rendering
  maxLines?: number; // Maximum lines to display
  showLineNumbers?: boolean; // Show line numbers in code output
  highlightLines?: number[]; // Line numbers to highlight
  wrapLines?: boolean; // Enable line wrapping
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Header padding */
  headerPadding?: SpacingSize;
  /** Language label size */
  languageLabelSize?: "xs" | "sm" | "base";
  /** Code block padding */
  codePadding?: SpacingSize;
  /** Code text size */
  codeTextSize?: "xs" | "sm" | "base" | "lg";
  /** Line number width */
  lineNumberWidth?: "sm" | "base" | "lg";
  /** Line number spacing */
  lineNumberSpacing?: SpacingSize;
  /** Border radius */
  borderRadius?: "none" | "sm" | "base" | "lg" | "xl";
}
