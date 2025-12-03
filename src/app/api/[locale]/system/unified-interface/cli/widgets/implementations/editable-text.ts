/**
 * Editable Text Widget Renderer
 * Handles EDITABLE_TEXT widget type for CLI display
 * Note: CLI renders this as readonly text since inline editing is not supported
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  extractEditableTextData,
  type ProcessedEditableText,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/editable-text";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class EditableTextWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.MARKDOWN_EDITOR;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;
    const t = context.t;

    // Extract data using shared logic
    const data = extractEditableTextData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderEditableText(data, field, context);
  }

  private renderEditableText(
    data: ProcessedEditableText,
    field: WidgetInput["field"],
    context: WidgetRenderContext,
  ): string {
    const { value, placeholder, multiline, maxLength, readonly } = data;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);

    // Display value or placeholder
    const displayValue = value || placeholder || "";

    // Show readonly indicator if applicable
    const readonlyIndicator = readonly
      ? this.styleText(" [readonly]", "dim", context)
      : "";

    // Show max length if specified
    const lengthInfo =
      maxLength && value
        ? this.styleText(` (${value.length}/${maxLength})`, "dim", context)
        : "";

    if (multiline) {
      // Multiline text
      const result: string[] = [];

      if (label) {
        // eslint-disable-next-line i18next/no-literal-string
        result.push(`${indent}${label}${readonlyIndicator}${lengthInfo}:`);
      }

      const lines = displayValue.split("\n");
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

    // Single-line text
    const formattedValue = context.formatValue(field, displayValue);

    if (!label) {
      // eslint-disable-next-line i18next/no-literal-string
      return `${indent}${formattedValue}${readonlyIndicator}${lengthInfo}`;
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${indent}${label}: ${formattedValue}${readonlyIndicator}${lengthInfo}`;
  }
}
