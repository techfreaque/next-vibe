/**
 * Base Widget Renderer
 * Abstract base class for all widget renderers with common utilities
 */

import chalk from "chalk";

import { getBaseFormatter } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/utils/formatting";
import type { CountryLanguage } from "@/i18n/core/config";
import type { WidgetData, WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";

import type {
  DataFormatter,
  WidgetRenderContext,
  WidgetRenderer,
} from "./types";

export abstract class BaseWidgetRenderer implements WidgetRenderer {
  protected formatter: DataFormatter;

  constructor() {
    this.formatter = new DefaultDataFormatter();
  }

  abstract canRender(widgetType: string): boolean;
  abstract render(input: WidgetInput, context: WidgetRenderContext): string;

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

  protected formatLabel(
    field: UnifiedField,
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
