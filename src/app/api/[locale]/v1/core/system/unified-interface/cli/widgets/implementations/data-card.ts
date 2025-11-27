/**
 * Data Card Widget Renderer
 * Handles DATA_CARD widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import { extractDataCardData } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/logic/data-card";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class DataCardWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_CARD;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
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
