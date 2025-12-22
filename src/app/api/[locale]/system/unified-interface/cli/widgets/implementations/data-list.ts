/**
 * Data List Widget Renderer
 * Handles DATA_LIST widget type for simple list rendering
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractDataListData,
  type ListItem,
  type ProcessedDataList,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/data-list";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class DataListWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.DATA_LIST
> {
  readonly widgetType = WidgetType.DATA_LIST;

  render(props: CLIWidgetProps<typeof WidgetType.DATA_LIST, string>): string {
    const { value, context } = props;

    // Extract data using shared logic
    const data = extractDataListData(value);

    // Handle null case
    if (!data) {
      return "";
    }

    // Render using extracted data
    return this.renderDataList(data, context);
  }

  private renderDataList(
    data: ProcessedDataList,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    for (const item of data.items) {
      const rendered = this.renderListItem(item, context);
      if (rendered) {
        result.push(rendered);
      }
    }

    return result.join("\n");
  }

  private renderListItem(item: ListItem, context: WidgetRenderContext): string {
    // Special handling for command lists (command + description)
    if ("command" in item && "description" in item) {
      const command = String(item.command || "");
      const description = String(item.description || "");
      const commandPadded = command.padEnd(20);
      const commandStyled = this.styleText(commandPadded, "blue", context);
      return `  ${commandStyled} ${description}`;
    }

    // Special handling for option lists (flag + description)
    if ("flag" in item && "description" in item) {
      const flag = String(item.flag || "");
      const description = String(item.description || "");
      const flagPadded = flag.padEnd(25);
      const flagStyled = this.styleText(flagPadded, "yellow", context);
      return `  ${flagStyled} ${description}`;
    }

    // Fallback: render all fields
    const parts: string[] = [];
    for (const [key, value] of Object.entries(item)) {
      if (value !== null && value !== undefined) {
        parts.push(`${key}: ${value}`);
      }
    }
    return parts.length > 0 ? `  ${parts.join(", ")}` : "";
  }
}
