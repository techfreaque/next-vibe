/**
 * Loading Widget Renderer
 * Handles LOADING widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import {
  extractLoadingData,
  formatProgressBar,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/logic/loading";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class LoadingWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.LOADING;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractLoadingData(value);

    const lines: string[] = [];

    // Loading message
    const message = data.message || "Loading...";

    if (data.indeterminate) {
      // Indeterminate loading (spinner)
      const spinner = context.options.useEmojis ? "⏳ " : "... ";
      lines.push(`${indent}${spinner}${this.styleText(message, "blue", context)}`);
    } else if (data.progress !== undefined) {
      // Progress bar
      const progressBar = formatProgressBar(data.progress, 30);
      lines.push(`${indent}${this.styleText(message, "blue", context)}`);
      lines.push(`${indent}${progressBar}`);
    } else {
      // Default loading
      lines.push(`${indent}${this.styleText(message, "blue", context)}`);
    }

    return lines.join("\n");
  }
}
