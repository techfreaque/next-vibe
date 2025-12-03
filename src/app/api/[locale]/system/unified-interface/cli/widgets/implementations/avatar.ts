/**
 * Avatar Widget Renderer
 * Handles AVATAR widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { extractAvatarData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/avatar";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class AvatarWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.AVATAR;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;
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
