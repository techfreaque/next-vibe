/**
 * Text Widget Renderer
 * Handles TEXT widget type with various formatting options
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Text widget renderer for simple text display
 */
export class TextWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.TEXT;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const indent = this.createIndent(context.depth, context);
    const icon = context.getFieldIcon(field.type);
    const label = this.formatLabel(field, context);
    const formattedValue = context.formatValue(field, field.value);

    // Handle different text formatting based on field configuration
    const config = field.config || {};

    if (config.multiline) {
      return this.renderMultilineText(
        field,
        formattedValue,
        indent,
        icon,
        label,
        context,
      );
    }

    if (config.emphasis) {
      return this.renderEmphasizedText(
        field,
        formattedValue,
        indent,
        icon,
        label,
        context,
      );
    }

    // Default single-line text with improved formatting
    const displayValue = formattedValue === "(not set)" ? "—" : formattedValue;

    // If no label is explicitly set, just render the value without a label
    if (!field.label) {
      return `${indent}${displayValue}`;
    }

    return `${indent}${icon}${label}: ${displayValue}`;
  }

  private renderMultilineText(
    field: ResponseFieldMetadata,
    value: string,
    indent: string,
    icon: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    // Safety check for value parameter
    if (!value || typeof value !== "string") {
      // eslint-disable-next-line i18next/no-literal-string
      return `${indent}${icon}${label}: (empty)`;
    }

    const lines = value.split("\n");
    const result = [`${indent}${icon}${label}:`];

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

  private renderEmphasizedText(
    field: ResponseFieldMetadata,
    value: string,
    indent: string,
    icon: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    const config = field.config || {};
    const emphasis = config.emphasis as
      | "bold"
      | "dim"
      | "underline"
      | "red"
      | "green"
      | "yellow"
      | "blue";
    const styledValue = this.styleText(value, emphasis, context);

    return `${indent}${icon}${label}: ${styledValue}`;
  }
}
