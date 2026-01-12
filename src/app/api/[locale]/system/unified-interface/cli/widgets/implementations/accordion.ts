/**
 * Accordion Widget Renderer
 * Handles ACCORDION widget type for CLI display
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractAccordionData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/accordion";
import { isWidgetDataString } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class AccordionWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.ACCORDION
> {
  readonly widgetType = WidgetType.ACCORDION;

  /**
   * Render accordion widget with expandable/collapsible sections.
   * Each item displays a title with expand/collapse indicator and optional content.
   * Supports different variants: separated (with separators) or simple (with blank lines).
   */
  render(props: CLIWidgetProps<typeof WidgetType.ACCORDION, string>): string {
    const { value, context } = props;
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

      const translatedTitle = isWidgetDataString(item.title, context);
      const title = this.styleText(
        translatedTitle || item.title,
        "bold",
        context,
      );
      lines.push(`${indent}${icon}${title}`);

      // Item content (only if expanded)
      if (item.expanded && item.content !== null) {
        const translatedContent = isWidgetDataString(item.content, context);
        const contentStr =
          translatedContent || JSON.stringify(item.content, null, 2);

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
    if (lines.at(-1) === "") {
      lines.pop();
    }

    return lines.join("\n");
  }
}
