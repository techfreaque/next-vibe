/**
 * Base Widget Renderer
 * Abstract base class for all widget renderers with common utilities
 */

import chalk from "chalk";

import { FieldDataType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type {
  DataFormatter,
  ResponseFieldMetadata,
  WidgetRenderContext,
  WidgetRenderer,
} from "./types";

/**
 * Abstract base widget renderer with common utilities
 */
export abstract class BaseWidgetRenderer implements WidgetRenderer {
  protected formatter: DataFormatter;

  constructor() {
    this.formatter = new DefaultDataFormatter();
  }

  abstract canRender(widgetType: any): boolean;
  abstract render(
    field: ResponseFieldMetadata,
    context: WidgetRenderContext,
  ): string;

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

  /**
   * Format field label with translation
   */
  protected formatLabel(
    field: ResponseFieldMetadata,
    context: WidgetRenderContext,
  ): string {
    const rawLabel = field.label || field.name;
    const label = rawLabel.includes(".")
      ? context.translate(rawLabel)
      : rawLabel;
    return this.styleText(label, "bold", context);
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
      case "center":
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return " ".repeat(leftPad) + text + " ".repeat(rightPad);
      case "right":
        return " ".repeat(padding) + text;
      default:
        return text + " ".repeat(padding);
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

  formatObject(value: object, options?: { maxDepth?: number }): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Object]";
    }
  }

  formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)}s`;
  }
}
