/**
 * Error Widget Renderer
 * Handles ERROR widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { extractErrorData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/errors";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class ErrorWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.ERROR;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractErrorData(value);

    // Handle null case
    if (!data) {
      return `${indent}${this.styleText("Error", "red", context)}`;
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
      const codeText = this.styleText(`Code: ${data.code}`, "dim", context);
      lines.push(`${indent}${codeText}`);
    }

    // Stack trace (only in verbose mode or if explicitly shown)
    if (data.stack && context.depth === 0) {
      lines.push("");
      lines.push(`${indent}${this.styleText("Stack trace:", "dim", context)}`);
      const stackLines = data.stack.split("\n").slice(0, 5);
      for (const stackLine of stackLines) {
        lines.push(`${indent}  ${this.styleText(stackLine, "dim", context)}`);
      }
    }

    // Action
    if (data.action) {
      lines.push("");
      lines.push(
        `${indent}${this.styleText(data.action.label, "yellow", context)}`,
      );
    }

    return lines.join("\n");
  }
}
