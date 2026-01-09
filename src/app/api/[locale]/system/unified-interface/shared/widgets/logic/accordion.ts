/**
 * Accordion Widget Logic
 * Shared data extraction and processing for ACCORDION widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Accordion item structure
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: WidgetData;
  expanded?: boolean;
  disabled?: boolean;
}

/**
 * Processed accordion data structure
 */
export interface ProcessedAccordion {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
}

/**
 * Extract and validate accordion data from WidgetData
 */
export function extractAccordionData(value: WidgetData): ProcessedAccordion | null {
  // Handle object value with accordion properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const items = "items" in value && Array.isArray(value.items) ? value.items : [];
    const allowMultiple =
      "allowMultiple" in value && typeof value.allowMultiple === "boolean"
        ? value.allowMultiple
        : false;
    const variant =
      "variant" in value && typeof value.variant === "string"
        ? (value.variant as "default" | "bordered" | "separated")
        : "default";

    // Validate items
    const validItems = items
      .filter((item) => typeof item === "object" && item !== null)
      .map((item) => ({
        id: "id" in item && typeof item.id === "string" ? item.id : "",
        title: "title" in item && typeof item.title === "string" ? item.title : "",
        content: "content" in item ? item.content : null,
        expanded: "expanded" in item && typeof item.expanded === "boolean" ? item.expanded : false,
        disabled: "disabled" in item && typeof item.disabled === "boolean" ? item.disabled : false,
      }))
      .filter((item) => item.id && item.title);

    if (validItems.length === 0) {
      return null;
    }

    return {
      items: validItems,
      allowMultiple,
      variant,
    };
  }

  // Invalid type
  return null;
}

/**
 * Get expanded items from accordion
 */
export function getExpandedItems(data: ProcessedAccordion): AccordionItem[] {
  return data.items.filter((item) => item.expanded);
}
