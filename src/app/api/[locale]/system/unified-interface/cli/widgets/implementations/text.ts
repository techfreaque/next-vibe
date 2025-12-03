/**
 * Text Widget Renderer
 * Handles TEXT widget type with various formatting options
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { extractTextData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/text";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class TextWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.TEXT;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);

    // Extract data using shared logic
    const data = extractTextData(value);

    // Handle null case
    if (!data) {
      return `${indent}${label}: —`;
    }

    const formattedValue = context.formatValue(field, data.text);

    if (field.ui.type !== WidgetType.TEXT) {
      return `${indent}${label}: ${formattedValue}`;
    }

    const config = field.ui;

    if (config.multiline) {
      return this.renderMultilineText(
        field,
        formattedValue,
        indent,
        label,
        context,
      );
    }

    if (config.emphasis) {
      return this.renderEmphasizedText(
        field,
        formattedValue,
        indent,
        label,
        context,
      );
    }

    // Default single-line text with improved formatting
    const displayValue = formattedValue === "(not set)" ? "—" : formattedValue;

    if (!field.ui.label) {
      return `${indent}${displayValue}`;
    }

    return `${indent}${label}: ${displayValue}`;
  }

  private renderMultilineText(
    field: UnifiedField,
    value: string,
    indent: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    // Safety check for value parameter
    if (!value || typeof value !== "string") {
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

  private renderEmphasizedText(
    field: UnifiedField,
    value: string,
    indent: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    if (field.ui.type !== WidgetType.TEXT) {
      return `${indent}${label}: ${value}`;
    }
    const config = field.ui;
    const emphasis = config.emphasis as
      | "bold"
      | "dim"
      | "underline"
      | "red"
      | "green"
      | "yellow"
      | "blue";
    const styledValue = this.styleText(value, emphasis, context);

    return `${indent}${label}: ${styledValue}`;
  }
}
