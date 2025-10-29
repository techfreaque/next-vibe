/**
 * Title Widget Renderer
 * Handles TITLE widget type for prominent headings
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

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

    // Handle different value types properly
    let text: string;
    if (typeof value === "string") {
      text = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      text = String(value);
    } else if (Array.isArray(value)) {
      text = value
        .map((item) => {
          if (
            typeof item === "string" ||
            typeof item === "number" ||
            typeof item === "boolean"
          ) {
            return String(item);
          }
          return JSON.stringify(item);
        })
        .join(", ");
    } else if (typeof value === "object") {
      text = JSON.stringify(value);
    } else {
      text = "";
    }

    const styled = this.styleText(text, "bold", context);

    return styled;
  }
}
