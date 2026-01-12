/**
 * Base Widget Renderer
 * Abstract base class for all widget renderers with common utilities
 */

import chalk from "chalk";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { getBaseFormatter } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CLIWidgetProps,
  DataFormatter,
  WidgetRenderContext,
  WidgetRenderer,
} from "./types";

/**
 * Base widget renderer with common utilities.
 * TWidget is the specific widget type this renderer handles.
 */
export abstract class BaseWidgetRenderer<
  TWidget extends WidgetType = WidgetType,
> implements WidgetRenderer<TWidget> {
  abstract readonly widgetType: TWidget;
  protected formatter: DataFormatter;

  constructor() {
    this.formatter = new DefaultDataFormatter();
  }

  abstract render(props: CLIWidgetProps<TWidget, string>): string;

  /**
   * Create indentation for the given depth
   */
  protected createIndent(depth: number, context: WidgetRenderContext): string {
    return " ".repeat(depth * context.options.indentSize);
  }

  /**
   * Style text with colors if enabled
   */
  protected styleText(
    text: string,
    style:
      | "bold"
      | "dim"
      | "underline"
      | "italic"
      | "red"
      | "green"
      | "yellow"
      | "blue",
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
      case "italic":
        return chalk.italic(text);
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

  /**
   * Add icon if emojis are enabled
   */
  protected addIcon(
    icon: string,
    text: string,
    context: WidgetRenderContext,
  ): string {
    if (!context.options.useEmojis) {
      return text;
    }
    return `${icon} ${text}`;
  }

  protected formatLabel<const TKey extends string>(
    field: UnifiedField<TKey>,
    context: WidgetRenderContext,
  ): string {
    // Check if ui config has a label property
    if ("label" in field.ui && field.ui.label) {
      return this.styleText(context.t(field.ui.label), "bold", context);
    }
    return "";
  }

  /**
   * Wrap text to fit within max width
   */
  protected wrapText(text: string, maxWidth: number, indent = ""): string {
    // Safety check for text parameter
    if (!text || typeof text !== "string") {
      return "";
    }

    if (text.length <= maxWidth) {
      return text;
    }

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = `${indent + word} `;
        } else {
          // Word is longer than max width, force break
          lines.push(word);
        }
      } else {
        currentLine += `${word} `;
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines.join("\n");
  }

  /**
   * Create a separator line
   */
  protected createSeparator(width: number, char = "─"): string {
    return char.repeat(width);
  }

  /**
   * Pad text to a specific width
   */
  protected padText(
    text: string,
    width: number,
    align: "left" | "center" | "right" = "left",
  ): string {
    if (text.length >= width) {
      return text;
    }

    const padding = width - text.length;

    switch (align) {
      case "center": {
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return " ".repeat(leftPad) + text + " ".repeat(rightPad);
      }
      case "right":
        return " ".repeat(padding) + text;
      default:
        return text + " ".repeat(padding);
    }
  }

  /**
   * Render children fields recursively (widget-in-widget rendering).
   * Eliminates duplicated child rendering logic across widgets.
   *
   * @param field - Parent field with children definitions
   * @param value - Object value containing child data
   * @param context - Rendering context
   * @param options - Rendering options
   * @returns Array of rendered child strings
   */
  protected renderChildren<const TKey extends string>(
    field: UnifiedField<TKey>,
    value: { [key: string]: WidgetData },
    context: WidgetRenderContext,
    options?: {
      skipKeys?: string[];
      separator?: string;
    },
  ): string[] {
    const result: string[] = [];
    const skipKeys = new Set(options?.skipKeys || []);

    // Check if field has children
    if (field.type !== "object" || !field.children) {
      return result;
    }

    // Render each child
    for (const [key, val] of Object.entries(value)) {
      // Skip explicitly excluded keys
      if (skipKeys.has(key)) {
        continue;
      }

      // Skip null/undefined
      if (val === undefined || val === null) {
        continue;
      }

      const childField = field.children[key];
      if (childField) {
        const rendered = context.renderWidget(
          childField.ui.type,
          childField,
          val,
        );
        if (rendered) {
          result.push(rendered);
        }
      }
    }

    return result;
  }

  /**
   * Render any value type generically (any-type-in-any-widget support).
   * Provides consistent fallback rendering for unexpected data types.
   *
   * @param value - Any widget data value
   * @param context - Rendering context
   * @param options - Formatting options
   * @returns Formatted string representation
   */
  protected renderValue(
    value: WidgetData,
    context: WidgetRenderContext,
    options?: {
      maxLength?: number;
      showType?: boolean;
      separator?: string;
    },
  ): string {
    // Handle null/undefined
    if (value === null) {
      return this.styleText("—", "dim", context);
    }
    if (value === undefined) {
      return this.styleText("—", "dim", context);
    }

    // Handle boolean
    if (typeof value === "boolean") {
      return this.formatter.formatBoolean(value);
    }

    // Handle number
    if (typeof value === "number") {
      return this.formatter.formatNumber(value, context.locale, {
        precision: 2,
      });
    }

    // Handle string
    if (typeof value === "string") {
      return this.formatter.formatText(value, {
        maxLength: options?.maxLength,
      });
    }

    // Handle array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return this.styleText(
          `[${context.t("app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.empty")}]`,
          "dim",
          context,
        );
      }
      const separator = options?.separator ?? ", ";
      return this.formatter.formatArray(value, { separator, maxItems: 5 });
    }

    // Handle object
    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return this.styleText("{}", "dim", context);
      }
      return this.formatter.formatObject(value as Record<string, WidgetData>);
    }

    // Fallback for unknown types
    return String(value);
  }

  /**
   * Get appropriate icon for a value based on its type and content.
   * Provides consistent icon selection across widgets.
   *
   * @param value - The value to get an icon for
   * @param context - Rendering context
   * @returns Icon string (empty if emojis disabled)
   */
  protected getValueIcon(
    value: WidgetData,
    context: WidgetRenderContext,
  ): string {
    if (!context.options.useEmojis) {
      return "";
    }

    // Handle null/undefined
    if (value === null || value === undefined) {
      // eslint-disable-next-line i18next/no-literal-string
      return "○ ";
    }

    // Handle boolean
    if (typeof value === "boolean") {
      // eslint-disable-next-line i18next/no-literal-string
      return value ? "✓ " : "✗ ";
    }

    // Handle number
    if (typeof value === "number") {
      if (value === 0) {
        // eslint-disable-next-line i18next/no-literal-string
        return "⚪ ";
      }
      if (value > 0) {
        // eslint-disable-next-line i18next/no-literal-string
        return "🟢 ";
      }
      // eslint-disable-next-line i18next/no-literal-string
      return "🔴 ";
    }

    // Handle string
    if (typeof value === "string") {
      // eslint-disable-next-line i18next/no-literal-string
      return "💬 ";
    }

    // Handle array
    if (Array.isArray(value)) {
      // eslint-disable-next-line i18next/no-literal-string
      return "📋 ";
    }

    // Handle object
    if (typeof value === "object") {
      // eslint-disable-next-line i18next/no-literal-string
      return "📊 ";
    }

    // Fallback
    // eslint-disable-next-line i18next/no-literal-string
    return "ℹ️ ";
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

  formatBoolean(value: boolean): string {
    return this.baseFormatter.formatBoolean(value, { style: "emoji" });
  }

  formatDate(value: Date | string, locale: CountryLanguage): string {
    return this.baseFormatter.formatDate(value, locale, {});
  }

  formatArray(
    value: WidgetData[],
    options?: { separator?: string; maxItems?: number },
  ): string {
    const separator = options?.separator ?? ", ";
    const maxItems = options?.maxItems ?? 10;

    const items = value.slice(0, maxItems);
    const formatted = items
      .map((item) => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          return JSON.stringify(item);
        }
        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          return String(item);
        }
        if (item === null || item === undefined) {
          return String(item);
        }
        if (Array.isArray(item)) {
          return JSON.stringify(item);
        }
        return "";
      })
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

  formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)}s`;
  }
}
