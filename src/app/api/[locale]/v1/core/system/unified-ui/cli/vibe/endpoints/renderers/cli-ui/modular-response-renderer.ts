/**
 * Modular CLI Response Renderer
 * New modular response rendering system using widget registry
 */

import chalk from "chalk";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { FieldDataType } from "../../endpoint-types/core/enums";
import type {
  CLIRenderingOptions,
  DataFormatter,
  ResponseContainerMetadata,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./widgets/types";
import type { WidgetRegistry } from "./widgets/widget-registry";
import { defaultWidgetRegistry } from "./widgets/widget-registry";

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
    data: Record<string, any>,
    metadata: ResponseContainerMetadata | ResponseFieldMetadata[],
    locale: CountryLanguage,
  ): string {
    this.options.locale = locale;
    const { t } = simpleT(locale);

    const context: WidgetRenderContext = {
      options: this.options,
      depth: 0,
      translate: (key: string) => t(key),
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
    data: Record<string, any>,
    container: ResponseContainerMetadata,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    if (container.title) {
      const title = context.translate(container.title);
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
    data: Record<string, any>,
    fields: ResponseFieldMetadata[],
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    for (const field of fields) {
      const fieldValue = data[field.name];
      const fieldWithValue = { ...field, value: fieldValue };

      const renderedField = this.widgetRegistry.render(fieldWithValue, context);
      result.push(renderedField);
    }

    return result.join("\n");
  }

  /**
   * Format field value based on type and configuration
   */
  private formatFieldValue(
    field: ResponseFieldMetadata,
    value: string | number | boolean | null,
  ): string {
    if (value === null || value === undefined) {
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
  }

  /**
   * Render empty state message
   */
  private renderEmptyState(message: string): string {
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
    return value ? "✓" : "✗";
  }

  formatDate(value: Date | string): string {
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toLocaleDateString();
  }

  formatArray(
    value: any[],
    options?: { separator?: string; maxItems?: number },
  ): string {
    const separator = options?.separator ?? ", ";
    const maxItems = options?.maxItems ?? 10;

    const items = value.slice(0, maxItems);
    const formatted = items.map((item) => String(item)).join(separator);

    if (value.length > maxItems) {
      return `${formatted}... (+${value.length - maxItems} more)`;
    }

    return formatted;
  }

  formatObject(value: object): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Object]";
    }
  }
}

/**
 * Default modular renderer instance
 */
export const modularCLIResponseRenderer = new ModularCLIResponseRenderer();
