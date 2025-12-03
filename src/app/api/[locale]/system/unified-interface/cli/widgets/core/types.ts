/**
 * Widget Types and Interfaces
 * CLI-specific widget rendering types
 */

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import type { UnifiedField } from "../../../shared/types/endpoint";
import type {
  WidgetData,
  WidgetInput,
  WidgetRenderContext as SharedWidgetRenderContext,
} from "../../../shared/widgets/types";

/**
 * CLI rendering options
 */
export interface CLIRenderingOptions {
  useColors: boolean;
  useEmojis: boolean;
  maxWidth: number;
  indentSize: number;
  locale: CountryLanguage;
}

export interface WidgetRenderContext extends SharedWidgetRenderContext {
  options: CLIRenderingOptions;
  depth: number;
  t: TFunction;
  formatValue: (field: UnifiedField, value: WidgetData) => string;
  getFieldIcon: (type: FieldDataType) => string;
  renderEmptyState: (message: string) => string;
  getRenderer: (widgetType: WidgetType) => WidgetRenderer;
}

export interface WidgetRenderer {
  canRender(widgetType: WidgetType): boolean;
  render(input: WidgetInput, context: WidgetRenderContext): string;
}

/**
 * Data formatting utilities
 */
export interface DataFormatter {
  formatText(value: string, options?: { maxLength?: number }): string;
  formatNumber(
    value: number,
    locale: CountryLanguage,
    options?: { precision?: number; unit?: string },
  ): string;
  formatBoolean(value: boolean): string;
  formatDate(value: Date | string, locale: CountryLanguage): string;
  formatArray(
    value: WidgetData[],
    options?: { separator?: string; maxItems?: number },
  ): string;
  formatObject(
    value: Record<string, WidgetData>,
    options?: { maxDepth?: number },
  ): string;
  formatDuration(milliseconds: number): string;
}

/**
 * Table rendering configuration
 */
export interface TableRenderConfig {
  columns: Array<{
    key: string;
    label: string;
    type: FieldDataType;
    width?: string;
    align?: "left" | "center" | "right";
    formatter?: (value: WidgetData) => string;
  }>;
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  sorting?: {
    enabled: boolean;
    defaultSort?: { key: string; direction: "asc" | "desc" };
  };
  filtering?: {
    enabled: boolean;
  };
}

/**
 * Code output rendering configuration
 */
export interface CodeOutputConfig {
  format: "eslint" | "generic" | "json" | "table";
  groupBy?: string; // Field name to group by (e.g., "file")
  showSummary?: boolean;
  showLineNumbers?: boolean;
  colorScheme?: "auto" | "light" | "dark";
  severityIcons?: Record<string, string>;
  summaryTemplate?: string;
}

/**
 * Metric display configuration
 */
export interface MetricConfig {
  icon?: string;
  unit?: string;
  precision?: number;
  threshold?: {
    warning?: number;
    error?: number;
  };
  format?: "number" | "percentage" | "currency" | "bytes";
}
