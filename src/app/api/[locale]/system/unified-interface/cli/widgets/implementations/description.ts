/**
 * Description Widget Renderer
 *
 * Handles DESCRIPTION widget type for CLI display.
 * Displays descriptive text with muted styling and word wrapping.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractDescriptionData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/description";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class DescriptionWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.DESCRIPTION
> {
  readonly widgetType = WidgetType.DESCRIPTION;

  /**
   * Render description with muted styling and wrapping.
   *
   * Rendering Logic:
   * 1. Extract description text from value (with translation)
   * 2. Apply dim styling for secondary content
   * 3. Wrap text to fit terminal width
   *
   * @param props Widget properties with description data
   * @returns Formatted description string with wrapping
   */
  render(props: CLIWidgetProps<typeof WidgetType.DESCRIPTION, string>): string {
    const { value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic with translation context
    const data = extractDescriptionData(value, context);

    // Handle null case
    if (!data) {
      return `${indent}${this.styleText("—", "dim", context)}`;
    }

    const { text } = data;

    // Apply muted styling and wrap text
    const maxWidth = context.options.maxWidth - indent.length;
    const wrappedText = this.wrapText(text, maxWidth, indent);
    const styledText = this.styleText(wrappedText, "dim", context);

    return `${indent}${styledText}`;
  }
}
