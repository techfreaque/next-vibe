/**
 * Data List Widget Renderer
 * Handles DATA_LIST widget type for simple list rendering
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  RenderableValue,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

/**
 * Data list widget renderer for simple lists
 */
export class DataListWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.DATA_LIST;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const value = field.value;

    if (!Array.isArray(value)) {
      return "";
    }

    if (value.length === 0) {
      return "";
    }

    const result: string[] = [];

    for (const item of value) {
      const rendered = this.renderListItem(item, field, context);
      if (rendered) {
        result.push(rendered);
      }
    }

    return result.join("\n");
  }

  /**
   * Render a single list item
   */
  private renderListItem(
    item: RenderableValue,
    field: ResponseFieldMetadata,
    context: WidgetRenderContext,
  ): string {
    // Handle primitive values
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
    ) {
      return `  ${item}`;
    }

    // Handle objects (like command/description pairs)
    if (typeof item === "object" && item !== null && !Array.isArray(item)) {
      const obj = item as { [key: string]: RenderableValue };

      // Special handling for command lists (command + description)
      if ("command" in obj && "description" in obj) {
        const command = String(obj.command || "");
        const description = String(obj.description || "");
        const commandPadded = command.padEnd(20);
        const commandStyled = this.styleText(commandPadded, "blue", context);
        return `  ${commandStyled} ${description}`;
      }

      // Special handling for option lists (flag + description)
      if ("flag" in obj && "description" in obj) {
        const flag = String(obj.flag || "");
        const description = String(obj.description || "");
        const flagPadded = flag.padEnd(25);
        const flagStyled = this.styleText(flagPadded, "yellow", context);
        return `  ${flagStyled} ${description}`;
      }

      // Fallback: render all fields
      const parts: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          parts.push(`${key}: ${value}`);
        }
      }
      return parts.length > 0 ? `  ${parts.join(", ")}` : "";
    }

    // Fallback
    return `  ${JSON.stringify(item)}`;
  }
}
