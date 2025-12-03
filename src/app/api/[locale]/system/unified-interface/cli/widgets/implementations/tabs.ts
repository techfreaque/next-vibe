/**
 * Tabs Widget Renderer
 * Handles TABS widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  extractTabsData,
  getActiveTab,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/tabs";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class TabsWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.TABS;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const indent = this.createIndent(context.depth, context);

    // Extract data using shared logic
    const data = extractTabsData(value);

    // Handle null case
    if (!data) {
      return `${indent}—`;
    }

    const lines: string[] = [];

    // Tab headers
    const headers = data.tabs.map((tab) => {
      const isActive = tab.id === data.activeTab;
      const label = tab.disabled
        ? this.styleText(tab.label, "dim", context)
        : isActive
          ? this.styleText(tab.label, "bold", context)
          : tab.label;

      return isActive ? `[${label}]` : ` ${label} `;
    });

    lines.push(`${indent}${headers.join(" ")}`);
    lines.push(`${indent}${this.createSeparator(60)}`);

    // Active tab content
    const activeTab = getActiveTab(data);
    if (activeTab && activeTab.content !== null) {
      const contentStr =
        typeof activeTab.content === "string"
          ? activeTab.content
          : JSON.stringify(activeTab.content);
      lines.push(`${indent}${contentStr}`);
    }

    return lines.join("\n");
  }
}
