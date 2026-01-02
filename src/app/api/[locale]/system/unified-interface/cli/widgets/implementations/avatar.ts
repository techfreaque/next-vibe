/**
 * Avatar Widget Renderer
 * Handles AVATAR widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractAvatarData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/avatar";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class AvatarWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.AVATAR> {
  readonly widgetType = WidgetType.AVATAR;

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
