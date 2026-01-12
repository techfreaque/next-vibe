/**
 * Tabs Widget Renderer
 *
 * Handles TABS widget type for CLI display.
 * Displays tabbed navigation with:
 * - Tab headers with active/inactive/disabled states
 * - Active tab highlighted with bold style and brackets [Active]
 * - Inactive tabs shown as plain text with spacing  Tab
 * - Disabled tabs shown in dim style
 * - Separator line below headers
 * - Active tab content displayed below separator
 *
 * Visual Layout:
 * ```
 * [Active Tab]  Other Tab   Disabled Tab
 * ────────────────────────────────────────
 * Active tab content here...
 * ```
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction and type guards imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractTabsData,
  getActiveTab,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/tabs";
import { isWidgetDataString } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class TabsWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.TABS
> {
  readonly widgetType = WidgetType.TABS;

  /**
   * Render tabs with headers and active tab content.
   * Uses shared extraction logic to process tabs data,
   * then renders tab headers with appropriate styling and the active tab's content.
   *
   * Rendering Process:
   * 1. Extract tabs data (tabs array, activeTab id)
   * 2. Render tab headers with state-based styling:
   *    - Active tab: [Label] (bold, brackets)
   *    - Inactive tab:  Label  (normal, spacing)
   *    - Disabled tab:  Label  (dim, spacing)
   * 3. Add separator line below headers
   * 4. Render active tab content (if present)
   *
   * Tab Label Translation:
   * - Labels support translation keys (checked with isWidgetDataString)
   * - Falls back to raw label if not a translation key
   *
   * Tab Content Translation:
   * - Content supports translation keys (checked with isWidgetDataString)
   * - Falls back to JSON.stringify for non-string content
   *
   * @param props Widget properties with tabs data and rendering context
   * @returns Formatted tabs string with headers, separator, and content
   */
  render(props: CLIWidgetProps<typeof WidgetType.TABS, string>): string {
    const { value, context } = props;
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
      const translatedLabel = isWidgetDataString(tab.label, context);
      const labelText = translatedLabel || tab.label;
      const label = tab.disabled
        ? this.styleText(labelText, "dim", context)
        : isActive
          ? this.styleText(labelText, "bold", context)
          : labelText;

      return isActive ? `[${label}]` : ` ${label} `;
    });

    lines.push(`${indent}${headers.join(" ")}`);
    lines.push(`${indent}${this.createSeparator(60)}`);

    // Active tab content
    const activeTab = getActiveTab(data);
    if (activeTab && activeTab.content !== null) {
      const translatedContent = isWidgetDataString(activeTab.content, context);
      const contentStr = translatedContent || JSON.stringify(activeTab.content);
      lines.push(`${indent}${contentStr}`);
    }

    return lines.join("\n");
  }
}
