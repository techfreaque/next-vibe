/**
 * Modular CLI Response Renderer
 * New modular response rendering system using widget registry
 */

import chalk from "chalk";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { getBaseFormatter } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { WidgetData } from "../../../shared/widgets/types";
import type { WidgetRegistry } from "../core/registry";
import { defaultWidgetRegistry } from "../core/registry";
import type {
  CLIRenderingOptions,
  DataFormatter,
  WidgetRenderContext,
} from "../core/types";

/**
 * Data record type for response rendering
 */
type DataRecord = Record<string, WidgetData>;

/**
 * Modular CLI response renderer using widget system
 */
export class ModularCLIResponseRenderer {
  private widgetRegistry: WidgetRegistry;
  private options: CLIRenderingOptions;
  private formatter: DataFormatter;

  constructor(
    options: Partial<CLIRenderingOptions> = {},
    widgetRegistry?: WidgetRegistry,
  ) {
    this.widgetRegistry = widgetRegistry || defaultWidgetRegistry;
    this.options = {
      useColors: true,
      useEmojis: true,
      maxWidth: 120,
      indentSize: 2,
      locale: defaultLocale,
      ...options,
    };
    this.formatter = new DefaultDataFormatter();
  }

  /**
   * Render response data using endpoint definition metadata
   */
  render(
    data: DataRecord,
    fields: Array<[string, UnifiedField]>,
    locale: CountryLanguage,
  ): string {
    this.options.locale = locale;
    const { t } = simpleT(locale);

    const context: WidgetRenderContext = {
      options: this.options,
      depth: 0,
      t,
      formatValue: (field, value) => this.formatFieldValue(field, value),
      getFieldIcon: (type) => this.getFieldIcon(type),
      renderEmptyState: (message) => this.renderEmptyState(message),
      getRenderer: (widgetType) => this.widgetRegistry.getRenderer(widgetType),
      locale,
      isInteractive: false,
      permissions: [],
    };

    return this.renderFields(data, fields, context);
  }

  /**
   * Render multiple fields
   */
  private renderFields(
    data: DataRecord,
    fields: Array<[string, UnifiedField]>,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    // If no fields provided, auto-detect fields from data
    if (fields.length === 0 && data && typeof data === "object") {
      return this.renderAutoDetectedFields(data);
    }

    for (const [fieldName, field] of fields) {
      const fieldValue = data[fieldName];

      // Create WidgetInput for the widget renderer
      const widgetInput = { field, value: fieldValue, context };
      const renderedField = this.widgetRegistry.render(widgetInput, context);
      result.push(renderedField);
    }

    return result.join("\n");
  }

  /**
   * Auto-detect and render fields when no metadata is provided
   */
  private renderAutoDetectedFields(data: DataRecord): string {
    const result: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      // Skip null/undefined values
      if (value === null || value === undefined) {
        continue;
      }

      // Special handling for arrays (like issues)
      if (Array.isArray(value)) {
        if (value.length === 0) {
          continue; // Skip empty arrays
        }

        // Generic array rendering - use formatted field name directly
        const label = this.formatLabel(key);
        const formattedArray = this.formatter.formatArray(value);
        result.push(`${label}: ${formattedArray}`);
      }
      // Handle objects
      else if (typeof value === "object") {
        const label = this.formatLabel(key);
        const formattedObject = this.formatter.formatObject(
          value as Record<string, WidgetData>,
        );
        // eslint-disable-next-line i18next/no-literal-string
        result.push(`${label}:\n${formattedObject}`);
      }
      // Handle primitives
      else {
        const formattedValue = this.formatPrimitiveValue(value);
        const label = this.formatLabel(key);
        result.push(`${label}: ${formattedValue}`);
      }
    }

    return result.join("\n\n");
  }

  /**
   * Format a field name into a readable label
   */
  private formatLabel(fieldName: string): string {
    /* eslint-disable i18next/no-literal-string */
    return fieldName
      .replaceAll(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    /* eslint-enable i18next/no-literal-string */
  }

  /**
   * Format primitive values
   */
  private formatPrimitiveValue(value: WidgetData): string {
    if (typeof value === "boolean") {
      return this.formatter.formatBoolean(value);
    }
    if (typeof value === "number") {
      return this.formatter.formatNumber(value, this.options.locale);
    }
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return this.formatter.formatArray(value);
    }
    if (typeof value === "object" && value !== null) {
      return this.formatter.formatObject(value as Record<string, WidgetData>);
    }
    return "";
  }

  /**
   * Format field value based on type and configuration
   */
  private formatFieldValue(field: UnifiedField, value: WidgetData): string {
    if (value === null || value === undefined) {
      // eslint-disable-next-line i18next/no-literal-string
      return this.styleText("(not set)", "dim", {
        options: this.options,
      } as WidgetRenderContext);
    }

    const fieldName = "name" in field ? field.name : undefined;

    // Special handling for duration fields
    if (fieldName === "duration" && typeof value === "number") {
      return this.formatter.formatDuration(value);
    }

    // Auto-detect boolean values even if field type is wrong
    if (typeof value === "boolean") {
      return this.formatter.formatBoolean(value);
    }

    // Handle based on actual value type since we don't have FieldDataType in UnifiedField
    if (typeof value === "string") {
      return this.formatter.formatText(value, {
        maxLength:
          field.ui.type === WidgetType.TEXT &&
          typeof field.ui.maxLength === "number"
            ? field.ui.maxLength
            : undefined,
      });
    }

    if (typeof value === "number") {
      return this.formatter.formatNumber(value, this.options.locale);
    }

    if (typeof value === "boolean") {
      return this.formatter.formatBoolean(value);
    }

    if (Array.isArray(value)) {
      return this.formatter.formatArray(value, { maxItems: 5 });
    }

    if (typeof value === "object" && value !== null) {
      return this.formatter.formatObject(value as Record<string, WidgetData>);
    }

    return String(value);
  }

  /**
   * Get icon for field type
   */
  private getFieldIcon(type: FieldDataType): string {
    if (!this.options.useEmojis) {
      return "";
    }

    /* eslint-disable i18next/no-literal-string */
    switch (type) {
      case FieldDataType.TEXT:
        return "📝 ";
      case FieldDataType.NUMBER:
        return "🔢 ";
      case FieldDataType.BOOLEAN:
        return "☑️ ";
      case FieldDataType.DATE:
        return "📅 ";
      case FieldDataType.ARRAY:
        return "📋 ";
      case FieldDataType.OBJECT:
        return "📦 ";
      default:
        return "• ";
    }
    /* eslint-enable i18next/no-literal-string */
  }

  /**
   * Render empty state message
   */
  private renderEmptyState(message: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    const icon = this.options.useEmojis ? "🔍 " : "";
    const styledMessage = this.styleText(message, "dim", {
      options: this.options,
    } as WidgetRenderContext);
    return `${icon}${styledMessage}`;
  }

  /**
   * Style text with colors if enabled
   */
  private styleText(
    text: string,
    style: "bold" | "dim" | "underline" | "red" | "green" | "yellow" | "blue",
    context: WidgetRenderContext,
  ): string {
    if (!context.options.useColors) {
      return text;
    }

    switch (style) {
      case "bold":
        return chalk.bold(text);
      case "dim":
        return chalk.dim(text);
      case "underline":
        return chalk.underline(text);
      case "red":
        return chalk.red(text);
      case "green":
        return chalk.green(text);
      case "yellow":
        return chalk.yellow(text);
      case "blue":
        return chalk.blue(text);
      default:
        return text;
    }
  }
}

/**
 * Default data formatter implementation
 * Uses shared base formatter to eliminate duplication
 */
class DefaultDataFormatter implements DataFormatter {
  private baseFormatter = getBaseFormatter();

  formatText(value: string, options?: { maxLength?: number }): string {
    return this.baseFormatter.formatText(value, {
      maxLength: options?.maxLength,
    });
  }

  formatNumber(
    value: number,
    locale: CountryLanguage,
    options?: { precision?: number; unit?: string },
  ): string {
    return this.baseFormatter.formatNumber(value, {
      precision: options?.precision,
      unit: options?.unit,
      locale,
    });
  }

  formatDuration(milliseconds: number): string {
    return this.baseFormatter.formatDuration(milliseconds, { unit: "s" });
  }

  formatBoolean(value: boolean): string {
    // eslint-disable-next-line i18next/no-literal-string
    return value ? "✓" : "✗";
  }

  formatDate(value: Date | string): string {
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toLocaleDateString();
  }

  /**
   * Safely convert WidgetData to string
   */
  private safeItemToString(item: WidgetData): string {
    if (typeof item === "string") {
      return item;
    }
    if (typeof item === "number" || typeof item === "boolean") {
      return String(item);
    }
    if (item === null) {
      return "null";
    }
    if (Array.isArray(item)) {
      return JSON.stringify(item);
    }
    if (typeof item === "object") {
      return JSON.stringify(item);
    }
    return "";
  }

  formatArray(
    value: WidgetData[],
    options?: { separator?: string; maxItems?: number },
  ): string {
    const separator = options?.separator ?? ", ";
    const maxItems = options?.maxItems ?? 10;

    const items = value.slice(0, maxItems);
    const formatted = items
      .map((item) => this.safeItemToString(item))
      .join(separator);

    if (value.length > maxItems) {
      // eslint-disable-next-line i18next/no-literal-string
      return `${formatted}... (+${value.length - maxItems} more)`;
    }

    return formatted;
  }

  formatObject(value: Record<string, WidgetData>): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      // eslint-disable-next-line i18next/no-literal-string
      return "[Object]";
    }
  }
}

/**
 * Default modular renderer instance
 */
export const modularCLIResponseRenderer = new ModularCLIResponseRenderer();
