/**
 * Error Widget Renderer
 *
 * Handles ERROR widget type for CLI display.
 * Displays error information with:
 * - Title with error icon (red styling)
 * - Error message
 * - Optional error code
 * - Optional stack trace (only at depth 0, limited to 5 lines)
 * - Optional action prompt
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractErrorData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/errors";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class ErrorWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.ERROR> {
  readonly widgetType = WidgetType.ERROR;

  /**
   * Render error with title, message, code, and optional stack trace.
   * Uses red styling for title to emphasize error state.
   * Stack trace is only shown at top level (depth 0) and limited to 5 lines.
   * Action is displayed in yellow as a recovery prompt.
   */
  render(props: CLIWidgetProps<typeof WidgetType.ERROR, string>): string {
    const { value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractErrorData(value);

    // Handle null case
    if (!data) {
      const errorText = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.error",
      );
      return `${indent}${this.styleText(errorText, "red", context)}`;
    }

    const lines: string[] = [];

    // Title with error icon
    const icon = context.options.useEmojis ? "❌ " : "";
    const title = this.styleText(`${icon}${data.title}`, "red", context);
    lines.push(`${indent}${title}`);

    // Message
    if (data.message) {
      lines.push(`${indent}${data.message}`);
    }

    // Error code
    if (data.code) {
      const codeLabel = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.errors.code",
      );
      const codeText = this.styleText(`${codeLabel}: ${data.code}`, "dim", context);
      lines.push(`${indent}${codeText}`);
    }

    // Stack trace (only in verbose mode or if explicitly shown)
    if (data.stack && context.depth === 0) {
      lines.push("");
      const stackTraceLabel = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.errors.stackTrace",
      );
      lines.push(`${indent}${this.styleText(`${stackTraceLabel}:`, "dim", context)}`);
      const stackLines = data.stack.split("\n").slice(0, 5);
      for (const stackLine of stackLines) {
        lines.push(`${indent}  ${this.styleText(stackLine, "dim", context)}`);
      }
    }

    // Action
    if (data.action) {
      lines.push("");
      lines.push(`${indent}${this.styleText(data.action.label, "yellow", context)}`);
    }

    return lines.join("\n");
  }
}
