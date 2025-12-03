/**
 * Accordion Widget Renderer
 * Handles ACCORDION widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { extractAccordionData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/accordion";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class AccordionWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.ACCORDION;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractAccordionData(value);

    // Handle null case
    if (!data) {
      return `${indent}—`;
    }

    const lines: string[] = [];

    // Render each accordion item
    for (const item of data.items) {
      // Item header with expand/collapse indicator
      const icon = context.options.useEmojis
        ? item.expanded
          ? "▼ "
          : "▶ "
        : item.expanded
          ? "- "
          : "+ ";

      const title = this.styleText(item.title, "bold", context);
      lines.push(`${indent}${icon}${title}`);

      // Item content (only if expanded)
      if (item.expanded && item.content !== null) {
        const contentStr =
          typeof item.content === "string"
            ? item.content
            : JSON.stringify(item.content, null, 2);

        // Indent content
        const contentLines = contentStr.split("\n");
        for (const line of contentLines) {
          lines.push(`${indent}  ${line}`);
        }
      }

      // Add separator between items
      if (data.variant === "separated" || data.variant === "bordered") {
        lines.push(`${indent}${this.createSeparator(60)}`);
      } else {
        lines.push("");
      }
    }

    // Remove trailing empty line
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    return lines.join("\n");
  }
}
