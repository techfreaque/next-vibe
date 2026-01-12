/**
 * Data Card Widget Renderer
 *
 * Handles DATA_CARD widget type for CLI display.
 * Displays structured information in a card format with title, description, fields, and optional actions.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractDataCardData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/data-card";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class DataCardWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.DATA_CARD
> {
  readonly widgetType = WidgetType.DATA_CARD;

  /**
   * Render data card with title, optional description, field list, and actions.
   * Displays in a structured format with separators and styled text.
   */
  render(props: CLIWidgetProps<typeof WidgetType.DATA_CARD, string>): string {
    const { value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractDataCardData(value);

    // Handle null case
    if (!data) {
      return `${indent}—`;
    }

    const lines: string[] = [];

    // Title
    const title = this.styleText(data.title, "bold", context);
    lines.push(`${indent}${title}`);

    // Description
    if (data.description) {
      const desc = this.styleText(data.description, "dim", context);
      lines.push(`${indent}${desc}`);
    }

    // Separator
    if (data.fields.length > 0) {
      lines.push(`${indent}${this.createSeparator(40)}`);
    }

    // Fields
    for (const field of data.fields) {
      const label = this.styleText(`${field.label}:`, "bold", context);
      const fieldValue =
        field.value !== null && field.value !== undefined
          ? String(field.value)
          : "—";
      lines.push(`${indent}  ${label} ${fieldValue}`);
    }

    // Actions
    if (data.actions && data.actions.length > 0) {
      lines.push("");
      const actionsText = data.actions.map((a) => a.label).join(" | ");
      lines.push(`${indent}  ${this.styleText(actionsText, "blue", context)}`);
    }

    return lines.join("\n");
  }
}
