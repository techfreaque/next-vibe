/**
 * Modular CLI Response Renderer
 * New modular response rendering system using widget registry
 */

import chalk from "chalk";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { FieldDataType, WidgetType } from "../../endpoint-types/core/enums";
import type {
  CLIRenderingOptions,
  DataFormatter,
  RenderableValue,
  ResponseContainerMetadata,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./widgets/types";
import type { WidgetRegistry } from "./widgets/widget-registry";
import { defaultWidgetRegistry } from "./widgets/widget-registry";

/**
 * Data record type for response rendering
 */
type DataRecord = Record<string, RenderableValue>;

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
      locale: "en-GLOBAL" as CountryLanguage,
      ...options,
    };
    this.formatter = new DefaultDataFormatter();
  }

  /**
   * Render response data using endpoint definition metadata
   */
  render(
    data: DataRecord,
    metadata: ResponseContainerMetadata | ResponseFieldMetadata[],
    locale: CountryLanguage,
  ): string {
    this.options.locale = locale;
    const { t } = simpleT(locale);

    const context: WidgetRenderContext = {
      options: this.options,
      depth: 0,
      translate: (key: string, params?: Record<string, string | number>) =>
        t(key, params),
      formatValue: (field, value) =>
        this.formatFieldValue(field, value as string | number | boolean | null),
      getFieldIcon: (type) => this.getFieldIcon(type),
      renderEmptyState: (message) => this.renderEmptyState(message),
    };

    if (Array.isArray(metadata)) {
      return this.renderFields(data, metadata, context);
    } else {
      return this.renderContainer(data, metadata, context);
    }
  }

  /**
   * Render a container with multiple fields
   */
  private renderContainer(
    data: DataRecord,
    container: ResponseContainerMetadata,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    if (container.title) {
      const title = context.translate(container.title);
      // eslint-disable-next-line i18next/no-literal-string
      const titleIcon = "📋 ";
      const titleWithIcon = titleIcon + title;
      const styledTitle = this.styleText(titleWithIcon, "bold", context);
      result.push(styledTitle);
      result.push("");
    }

    if (container.description) {
      const description = context.translate(container.description);
      result.push(`   ${description}`);
      result.push("");
    }

    const fieldsOutput = this.renderFields(data, container.fields, context);
    result.push(fieldsOutput);

    return result.join("\n");
  }

  /**
   * Render multiple fields
   */
  private renderFields(
    data: DataRecord,
    fields: ResponseFieldMetadata[],
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    // If no metadata provided, auto-detect fields from data
    if (fields.length === 0 && data && typeof data === "object") {
      return this.renderAutoDetectedFields(data, context);
    }

    for (const field of fields) {
      const fieldValue = data[field.name];
      const fieldWithValue: ResponseFieldMetadata = {
        ...field,
        value: fieldValue,
      };

      const renderedField = this.widgetRegistry.render(fieldWithValue, context);
      result.push(renderedField);
    }

    return result.join("\n");
  }

  /**
   * Auto-detect and render fields when no metadata is provided
   */
  private renderAutoDetectedFields(
    data: DataRecord,
    context: WidgetRenderContext,
  ): string {
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

        // Check if this looks like a list of issues/errors
        if (this.looksLikeIssuesList(value)) {
          const field: ResponseFieldMetadata = {
            name: key,
            label: this.formatLabel(key),
            type: FieldDataType.ARRAY,
            widgetType: WidgetType.GROUPED_LIST,
            value: value as RenderableValue,
            groupBy: "file",
            sortBy: "severity",
            showGroupSummary: true,
          };
          const rendered = this.widgetRegistry.render(field, context);
          result.push(rendered);
        } else {
          // Generic array rendering
          const label = this.formatLabel(key);
          const formattedArray = this.formatter.formatArray(value);
          result.push(`${label}: ${formattedArray}`);
        }
      }
      // Handle objects
      else if (typeof value === "object") {
        const label = this.formatLabel(key);
        const formattedObject = this.formatter.formatObject(
          value as Record<string, RenderableValue>,
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
   * Check if an array looks like a list of issues/errors
   */
  private looksLikeIssuesList(arr: RenderableValue[]): boolean {
    if (arr.length === 0) {
      return false;
    }

    const firstItem = arr[0];
    if (typeof firstItem !== "object" || firstItem === null) {
      return false;
    }

    // Check for common issue/error fields
    const issueFields = [
      "file",
      "line",
      "column",
      "message",
      "severity",
      "code",
      "rule",
    ];
    const hasIssueFields = issueFields.some((field) => field in firstItem);

    return hasIssueFields;
  }

  /**
   * Format a field name into a readable label
   */
  private formatLabel(fieldName: string): string {
    /* eslint-disable i18next/no-literal-string */
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    /* eslint-enable i18next/no-literal-string */
  }

  /**
   * Format primitive values
   */
  private formatPrimitiveValue(value: RenderableValue): string {
    if (typeof value === "boolean") {
      return this.formatter.formatBoolean(value);
    }
    if (typeof value === "number") {
      return this.formatter.formatNumber(value);
    }
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return this.formatter.formatArray(value);
    }
    if (typeof value === "object" && value !== null) {
      return this.formatter.formatObject(
        value as Record<string, RenderableValue>,
      );
    }
    return "";
  }

  /**
   * Format field value based on type and configuration
   */
  private formatFieldValue(
    field: ResponseFieldMetadata,
    value: string | number | boolean | null,
  ): string {
    if (value === null || value === undefined) {
      // eslint-disable-next-line i18next/no-literal-string
      return this.styleText("(not set)", "dim", {
        options: this.options,
      } as WidgetRenderContext);
    }

    // Special handling for duration fields
    if (field.name === "duration" && typeof value === "number") {
      return this.formatter.formatDuration(value);
    }

    switch (field.type) {
      case FieldDataType.TEXT:
        return this.formatter.formatText(String(value), {
          maxLength: field.config?.maxLength,
        });
      case FieldDataType.NUMBER:
        return this.formatter.formatNumber(Number(value), {
          precision: field.precision,
          unit: field.unit,
        });
      case FieldDataType.BOOLEAN:
        return this.formatter.formatBoolean(Boolean(value));
      case FieldDataType.DATE:
        return this.formatter.formatDate(String(value));
      case FieldDataType.ARRAY:
        return this.formatter.formatArray(
          Array.isArray(value) ? value : [value],
          { maxItems: 5 },
        );
      case FieldDataType.OBJECT:
        return this.formatter.formatObject(
          typeof value === "object" && value !== null ? value : {},
        );
      default:
        return String(value);
    }
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
 */
class DefaultDataFormatter implements DataFormatter {
  formatText(value: string, options?: { maxLength?: number }): string {
    if (options?.maxLength && value.length > options.maxLength) {
      return `${value.substring(0, options.maxLength - 3)}...`;
    }
    return value;
  }

  formatNumber(
    value: number,
    options?: { precision?: number; unit?: string },
  ): string {
    const precision = options?.precision ?? 2;
    const formatted = value.toFixed(precision);
    return options?.unit ? `${formatted} ${options.unit}` : formatted;
  }

  formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)}s`;
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
   * Safely convert RenderableValue to string
   */
  private safeItemToString(item: RenderableValue): string {
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
    value: RenderableValue[],
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

  formatObject(value: Record<string, RenderableValue>): string {
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
