/**
 * Data Card Widget Logic
 * Shared data extraction and processing for DATA_CARD widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed data card structure
 */
export interface ProcessedDataCard {
  title: string;
  description?: string;
  fields: Array<{
    label: string;
    value: WidgetData;
  }>;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

/**
 * Extract and validate data card from WidgetData
 */
export function extractDataCardData(
  value: WidgetData,
): ProcessedDataCard | null {
  // Handle object value with card properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const title =
      "title" in value && typeof value.title === "string" ? value.title : "";
    const description =
      "description" in value && typeof value.description === "string"
        ? value.description
        : undefined;
    const fields =
      "fields" in value && Array.isArray(value.fields) ? value.fields : [];
    const actions =
      "actions" in value && Array.isArray(value.actions)
        ? value.actions
        : undefined;

    if (!title) {
      return null;
    }

    // Validate fields
    const validFields = fields
      .filter((f) => typeof f === "object" && f !== null)
      .map((f) => ({
        label:
          "label" in f && typeof f.label === "string" ? f.label : "Unknown",
        value: "value" in f ? f.value : null,
      }));

    // Validate actions if present
    const validActions = actions
      ? actions
          .filter((a) => typeof a === "object" && a !== null)
          .map((a) => ({
            label:
              "label" in a && typeof a.label === "string" ? a.label : "Action",
            action:
              "action" in a && typeof a.action === "string" ? a.action : "",
          }))
      : undefined;

    return {
      title,
      description,
      fields: validFields,
      actions: validActions,
    };
  }

  // Invalid type
  return null;
}
