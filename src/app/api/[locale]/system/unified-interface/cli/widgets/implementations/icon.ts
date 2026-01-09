/**
 * Icon Widget Renderer
 *
 * Handles ICON widget type for CLI display.
 * Displays icons using emoji or text representations.
 *
 * In CLI, icons are represented as text/emoji symbols.
 * The icon key is used as-is if it's a single character,
 * otherwise it's rendered as [icon-name] when emojis are disabled.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractIconData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/icon";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class IconWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.ICON> {
  readonly widgetType = WidgetType.ICON;

  /**
   * Render icon with appropriate representation for CLI.
   *
   * Rendering Logic:
   * 1. Extract icon key from value
   * 2. If emojis enabled and key is single char, render as-is
   * 3. Otherwise render as [icon-name] format
   *
   * @param props Widget properties with icon data
   * @returns Formatted icon string
   */
  render(props: CLIWidgetProps<typeof WidgetType.ICON, string>): string {
    const { value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractIconData(value);

    // Handle null case
    if (!data) {
      return `${indent}—`;
    }

    const { icon } = data;

    // If emojis are enabled and it's a single character (likely emoji), use it directly
    if (context.options.useEmojis && icon.length <= 2) {
      return `${indent}${icon}`;
    }

    // Otherwise, render as text representation
    return `${indent}[${icon}]`;
  }
}
