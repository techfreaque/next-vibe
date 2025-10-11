/**
 * Widget Types and Interfaces
 * Core types for the modular CLI widget rendering system
 */

import chalk from "chalk";
import type { z } from "zod";

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

/**
 * Response field metadata extracted from endpoint definitions
 */
export interface ResponseFieldMetadata {
  name: string;
  type: FieldDataType;
  widgetType: WidgetType;
  value: any;
  label?: string;
  description?: string;
  required?: boolean;
  schema?: z.ZodTypeAny;
  // Additional metadata for rendering
  format?: string;
  unit?: string;
  precision?: number;
  choices?: string[];
  columns?: Array<{
    key: string;
    label: string;
    type: FieldDataType;
    width?: string;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  // Grouped list specific properties
  groupBy?: string;
  sortBy?: string;
  showGroupSummary?: boolean;
  maxItemsPerGroup?: number;
  // Widget-specific configuration
  config?: WidgetConfig;
}

/**
 * Widget configuration interface
 */
export interface WidgetConfig {
  [key: string]: any;
}

/**
 * Response container metadata
 */
export interface ResponseContainerMetadata {
  type: WidgetType;
  title?: string;
  description?: string;
  layout?: {
    columns?: number;
    spacing?: string;
  };
  fields: ResponseFieldMetadata[];
}

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

/**
 * Widget renderer context
 */
export interface WidgetRenderContext {
  options: CLIRenderingOptions;
  depth: number;
  translate: TFunction;
  formatValue: (field: ResponseFieldMetadata, value: any) => string;
  getFieldIcon: (type: FieldDataType) => string;
  renderEmptyState: (message: string) => string;
}

/**
 * Base widget renderer interface
 */
export interface WidgetRenderer {
  /**
   * Check if this renderer can handle the given widget type
   */
  canRender(widgetType: WidgetType): boolean;

  /**
   * Render the widget with the given field metadata and context
   */
  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string;
}

/**
 * Data formatting utilities
 */
export interface DataFormatter {
  formatText(value: string, options?: { maxLength?: number }): string;
  formatNumber(
    value: number,
    options?: { precision?: number; unit?: string },
  ): string;
  formatBoolean(value: boolean): string;
  formatDate(value: Date | string): string;
  formatArray(
    value: any[],
    options?: { separator?: string; maxItems?: number },
  ): string;
  formatObject(value: object, options?: { maxDepth?: number }): string;
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
    formatter?: (value: any) => string;
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

/**
 * Layout configuration
 */
export interface LayoutConfig {
  type: "vertical" | "horizontal" | "grid";
  columns?: number;
  spacing?: "compact" | "normal" | "loose";
  alignment?: "left" | "center" | "right";
}
