/**
 * Text Widget Renderer
 *
 * Handles TEXT widget type for CLI display.
 * Displays text values with support for:
 * - Static content from field.ui.content
 * - Date/DateTime formatting via fieldType
 * - Single-line and multi-line text with wrapping
 * - Emphasis styling (bold, italic, underline)
 * - Variant styling (error, success, warning, info)
 * - Text truncation via maxLength
 * - Link formatting
 * - Label display control
 * - Empty state handling (—)
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction and logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractTextData,
  formatIfDate,
  formatText,
  getTextVariantColor,
  type TextVariant,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/text";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

/**
 * Renders TEXT widgets with comprehensive formatting options.
 * Supports all UI config options with consistent shared logic.
 */
export class TextWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.TEXT
> {
  readonly widgetType = WidgetType.TEXT;

  /**
   * Map variant color to CLI-supported color
   * Maps "gray" to "dim" and filters out "default"
   */
  private mapVariantColor(
    color: "red" | "green" | "yellow" | "blue" | "gray" | "default",
  ): "red" | "green" | "yellow" | "blue" | "dim" | null {
    if (color === "gray") {
      return "dim";
    }
    if (color === "default") {
      return null;
    }
    return color;
  }

  /**
   * Render text value with appropriate formatting based on configuration.
   *
   * Rendering Logic (priority order):
   * 1. Static content from field.ui.content
   * 2. Date formatting if fieldType is DATE or DATETIME
   * 3. Link formatting if format="link"
   * 4. Multi-line text with wrapping if multiline=true
   * 5. Single-line text with optional emphasis and variant styling
   *
   * Supports all UI config options:
   * - content: Static translation key for fixed text
   * - fieldType: Special formatting (DATE, DATETIME)
   * - label: Optional label display
   * - variant: Color styling (error, success, warning, info)
   * - multiline: Multi-line wrapping
   * - emphasis: Text styling (bold, italic, underline)
   * - maxLength: Text truncation
   * - format: Display format (link, plain)
   * - href: Link destination when format="link"
   *
   * @param props Widget properties with text data and config
   * @returns Formatted text string with appropriate styling
   */
  render(props: CLIWidgetProps<typeof WidgetType.TEXT, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);
    const {
      content,
      fieldType,
      variant,
      multiline,
      emphasis,
      maxLength,
      format,
      href,
    } = field.ui;

    // Handle static content from UI config
    if (content) {
      const translatedContent = context.t(content);
      const displayText = formatText(translatedContent, maxLength);
      return this.renderFormattedText(
        displayText,
        label,
        indent,
        variant,
        emphasis,
        context,
      );
    }

    // Handle date formatting if fieldType is DATE or DATETIME
    const dateFormatted = formatIfDate(value, fieldType, context.locale);
    if (dateFormatted) {
      const displayText = formatText(dateFormatted, maxLength);
      return this.renderFormattedText(
        displayText,
        label,
        indent,
        variant,
        emphasis,
        context,
      );
    }

    // Handle link format
    if (format === "link" && href) {
      const linkText = href;
      const displayText = formatText(linkText, maxLength);
      const variantColor = variant ? getTextVariantColor(variant) : "blue";
      const mappedColor = this.mapVariantColor(variantColor);
      const styledLink = mappedColor
        ? this.styleText(displayText, mappedColor, context)
        : displayText;
      return label
        ? `${indent}${label}: ${styledLink}`
        : `${indent}${styledLink}`;
    }

    // Extract data using shared logic with translation context
    const data = extractTextData(value, context);

    if (!data) {
      return `${indent}${label}: —`;
    }

    const formattedValue = context.formatValue(field, data.text);
    const displayText = formatText(formattedValue, maxLength || data.truncate);

    // Handle multiline rendering
    if (multiline) {
      return this.renderMultilineText(displayText, indent, label, context);
    }

    // Handle single-line rendering with variant and emphasis
    return this.renderFormattedText(
      displayText,
      label,
      indent,
      variant,
      emphasis,
      context,
    );
  }

  /**
   * Render formatted text with variant and emphasis styling
   *
   * @param text Text to render
   * @param label Optional label
   * @param indent Indentation string
   * @param variant Optional variant for color styling
   * @param emphasis Optional emphasis for text styling
   * @param context Rendering context
   * @returns Formatted string with styling
   */
  private renderFormattedText(
    text: string,
    label: string,
    indent: string,
    variant: TextVariant | undefined,
    emphasis: "bold" | "italic" | "underline" | undefined,
    context: WidgetRenderContext,
  ): string {
    const displayValue = text === "(not set)" ? "—" : text;

    // Apply variant color if specified
    if (variant && variant !== "default") {
      const variantColor = getTextVariantColor(variant);
      const mappedColor = this.mapVariantColor(variantColor);
      const styledValue = mappedColor
        ? this.styleText(displayValue, mappedColor, context)
        : displayValue;
      return label
        ? `${indent}${label}: ${styledValue}`
        : `${indent}${styledValue}`;
    }

    // Apply emphasis if specified
    if (emphasis) {
      const styledValue = this.styleText(displayValue, emphasis, context);
      return label
        ? `${indent}${label}: ${styledValue}`
        : `${indent}${styledValue}`;
    }

    return label
      ? `${indent}${label}: ${displayValue}`
      : `${indent}${displayValue}`;
  }

  /**
   * Render multi-line text with wrapping and indentation.
   * Displays label on first line, then each line of text indented with 2 spaces.
   *
   * Visual Layout:
   * ```
   * Label:
   *   First line of text that might be very long and wrap
   *   to multiple visual lines...
   *   Second line of text
   *   Third line
   * ```
   *
   * @param value Text value to render (possibly multi-line)
   * @param indent Base indentation for the widget
   * @param label Label text to display
   * @param context Rendering context with maxWidth for wrapping
   * @returns Formatted multi-line string with label and indented wrapped lines
   */
  private renderMultilineText(
    value: string,
    indent: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    if (!value) {
      // eslint-disable-next-line i18next/no-literal-string
      return `${indent}${label}: (empty)`;
    }

    const lines = value.split("\n");
    const result = [`${indent}${label}:`];

    for (const line of lines) {
      const wrappedLine = this.wrapText(
        line,
        context.options.maxWidth - indent.length - 2,
        `${indent}  `,
      );
      result.push(`${indent}  ${wrappedLine}`);
    }

    return result.join("\n");
  }
}
