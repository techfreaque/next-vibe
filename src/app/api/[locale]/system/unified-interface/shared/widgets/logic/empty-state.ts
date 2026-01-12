/**
 * Empty State Widget Logic
 * Shared data extraction and processing for EMPTY_STATE widget
 * Used by both React and CLI implementations
 */

import type { IconKey } from "../../../react/icons";
import type { WidgetData } from "../types";

/**
 * Processed empty state data structure
 */
export interface ProcessedEmptyState {
  title: string;
  description?: string;
  icon?: IconKey;
  action?: {
    label: string;
    action: string;
  };
}

/**
 * Extract and validate empty state data from WidgetData
 */
export function extractEmptyStateData(
  value: WidgetData,
): ProcessedEmptyState | null {
  // Handle string value directly (simple message)
  if (typeof value === "string") {
    return {
      title: value,
    };
  }

  // Handle object value with empty state properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const title =
      "title" in value && typeof value.title === "string"
        ? value.title
        : "No data";
    const description =
      "description" in value && typeof value.description === "string"
        ? value.description
        : undefined;
    // Type assertion for icon: widget configuration is trusted to provide valid IconKey strings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icon =
      "icon" in value && typeof value.icon === "string"
        ? (value.icon as IconKey)
        : undefined;
    const action =
      "action" in value &&
      typeof value.action === "object" &&
      value.action !== null
        ? {
            label:
              "label" in value.action && typeof value.action.label === "string"
                ? value.action.label
                : "Action",
            action:
              "action" in value.action &&
              typeof value.action.action === "string"
                ? value.action.action
                : "",
          }
        : undefined;

    return {
      title,
      description,
      icon,
      action,
    };
  }

  // Default empty state
  return {
    title: "No data",
  };
}
