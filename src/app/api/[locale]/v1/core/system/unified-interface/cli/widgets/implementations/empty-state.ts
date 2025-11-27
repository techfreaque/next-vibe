/**
 * Empty State Widget Renderer
 * Handles EMPTY_STATE widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import { extractEmptyStateData } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/logic/empty-state";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class EmptyStateWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.EMPTY_STATE;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractEmptyStateData(value);

    // Handle null case
    if (!data) {
      return `${indent}—`;
    }

    const lines: string[] = [];

    // Icon (if present and emojis are enabled)
    const icon = data.icon && context.options.useEmojis ? `${data.icon} ` : "";

    // Title
    const title = this.styleText(`${icon}${data.title}`, "dim", context);
    lines.push(`${indent}${title}`);

    // Description
    if (data.description) {
      lines.push(`${indent}${this.styleText(data.description, "dim", context)}`);
    }

    // Action
    if (data.action) {
      lines.push("");
      lines.push(
        `${indent}${this.styleText(data.action.label, "blue", context)}`,
      );
    }

    return lines.join("\n");
  }
}
