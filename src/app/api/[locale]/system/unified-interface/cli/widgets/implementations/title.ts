/**
 * Title Widget Renderer
 * Handles TITLE widget type for prominent headings
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractTitleData,
  type ProcessedTitle,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/title";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";

export class TitleWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.TITLE;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;

    // Extract data using shared logic
    const data = extractTitleData(value);

    // Handle null case
    if (!data) {
      return "";
    }

    // Render using extracted data
    return this.renderTitle(data, context);
  }

  private renderTitle(
    data: ProcessedTitle,
    context: WidgetRenderContext,
  ): string {
    const styled = this.styleText(data.text, "bold", context);
    return styled;
  }
}
