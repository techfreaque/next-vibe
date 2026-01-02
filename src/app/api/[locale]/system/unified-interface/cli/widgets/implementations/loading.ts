/**
 * Loading Widget Renderer
 * Handles LOADING widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractLoadingData,
  formatProgressBar,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/loading";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class LoadingWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.LOADING> {
  readonly widgetType = WidgetType.LOADING;

  render(props: CLIWidgetProps<typeof WidgetType.LOADING, string>): string {
    const { value, context } = props;
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
