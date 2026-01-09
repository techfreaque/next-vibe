/**
 * Avatar Widget Renderer
 *
 * Handles AVATAR widget type for CLI display.
 * Displays user initials in a styled bracket format since images aren't supported in CLI.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractAvatarData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/avatar";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class AvatarWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.AVATAR> {
  readonly widgetType = WidgetType.AVATAR;

  /**
   * Render avatar as styled initials in brackets.
   * In CLI, displays fallback text (initials) since images aren't supported.
   */
  render(props: CLIWidgetProps<typeof WidgetType.AVATAR, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);

    // Extract data using shared logic
    const data = extractAvatarData(value);

    // Handle null case
    if (!data) {
      return `${indent}${label}: —`;
    }

    // In CLI, we show the fallback (initials) in a styled format
    const avatarDisplay = this.styleText(`[${data.fallback}]`, "blue", context);

    if (label) {
      return `${indent}${label}: ${avatarDisplay}`;
    }

    return `${indent}${avatarDisplay}`;
  }
}
