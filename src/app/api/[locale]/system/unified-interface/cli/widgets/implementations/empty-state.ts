/**
 * Empty State Widget Renderer
 *
 * Handles EMPTY_STATE widget type for CLI display.
 * Displays empty state messages when no data is available, with:
 * - Optional icon (when emojis enabled)
 * - Title message
 * - Optional description
 * - Optional action prompt
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractEmptyStateData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/empty-state";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class EmptyStateWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.EMPTY_STATE> {
  readonly widgetType = WidgetType.EMPTY_STATE;

  /**
   * Render empty state with title, description, and optional action.
   * Uses dimmed styling to indicate informational nature.
   * Action is displayed in blue as an interactive prompt.
   */
  render(props: CLIWidgetProps<typeof WidgetType.EMPTY_STATE, string>): string {
    const { value, context } = props;
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
      lines.push(`${indent}${this.styleText(data.action.label, "blue", context)}`);
    }

    return lines.join("\n");
  }
}
