/**
 * Tabs Widget Logic
 * Shared data extraction and processing for TABS widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Tab item structure
 */
export interface TabItem {
  id: string;
  label: string;
  content: WidgetData;
  disabled?: boolean;
}

/**
 * Processed tabs data structure
 */
export interface ProcessedTabs {
  tabs: TabItem[];
  activeTab?: string;
  variant?: "default" | "pills" | "underline";
}

/**
 * Extract and validate tabs data from WidgetData
 */
export function extractTabsData(value: WidgetData): ProcessedTabs | null {
  // Handle object value with tabs properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const tabs = "tabs" in value && Array.isArray(value.tabs) ? value.tabs : [];
    const activeTab =
      "activeTab" in value && typeof value.activeTab === "string" ? value.activeTab : undefined;
    const variant =
      "variant" in value && typeof value.variant === "string"
        ? (value.variant as "default" | "pills" | "underline")
        : "default";

    // Validate tabs
    const validTabs = tabs
      .filter((t) => typeof t === "object" && t !== null)
      .map((t) => ({
        id: "id" in t && typeof t.id === "string" ? t.id : "",
        label: "label" in t && typeof t.label === "string" ? t.label : "",
        content: "content" in t ? t.content : null,
        disabled: "disabled" in t && typeof t.disabled === "boolean" ? t.disabled : false,
      }))
      .filter((t) => t.id && t.label);

    if (validTabs.length === 0) {
      return null;
    }

    return {
      tabs: validTabs,
      activeTab: activeTab || validTabs[0].id,
      variant,
    };
  }

  // Invalid type
  return null;
}

/**
 * Get active tab from tabs
 */
export function getActiveTab(data: ProcessedTabs): TabItem | null {
  return data.tabs.find((tab) => tab.id === data.activeTab) || data.tabs[0] || null;
}
