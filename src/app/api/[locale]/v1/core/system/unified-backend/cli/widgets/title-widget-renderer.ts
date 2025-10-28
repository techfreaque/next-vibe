/**
 * Title Widget Renderer
 * Handles TITLE widget type for prominent headings
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Title widget renderer for headings
 */
export class TitleWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.TITLE;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const value = field.value;

    if (!value) {
      return "";
    }

    const text = String(value);
    const styled = this.styleText(text, "bold", context);

    return styled;
  }
}
