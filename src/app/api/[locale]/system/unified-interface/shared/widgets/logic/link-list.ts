/**
 * Link List Widget Logic
 * Shared data extraction and processing for LINK_LIST widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Individual link item
 */
export interface LinkItem {
  url: string;
  title?: string;
  description?: string;
  icon?: string;
  favicon?: string;
  [key: string]: WidgetData;
}

/**
 * Processed link list data structure
 */
export interface ProcessedLinkList {
  items: LinkItem[];
  title?: string;
  description?: string;
  layout: "list" | "grid";
  columns: number;
}

/**
 * Extract and validate link list data from WidgetData
 */
export function extractLinkListData(
  value: WidgetData,
): ProcessedLinkList | null {
  let items: unknown[] = [];
  let title = "";
  let description = "";
  let layout = "list";
  let columns = 1;

  // Handle raw array format (from responseArrayField)
  if (Array.isArray(value)) {
    items = value;
  }
  // Handle object format with items property
  else if (typeof value === "object" && value !== null) {
    items = "items" in value && Array.isArray(value.items) ? value.items : [];
    title =
      "title" in value && typeof value.title === "string" ? value.title : "";
    description =
      "description" in value && typeof value.description === "string"
        ? value.description
        : "";
    layout =
      "layout" in value && typeof value.layout === "string"
        ? value.layout
        : "list";
    columns =
      "columns" in value && typeof value.columns === "number"
        ? value.columns
        : 1;
  } else {
    return null;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Validate and process items
  const validItems = items
    .map((item: unknown) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return null;
      }

      const url =
        "url" in item && typeof item.url === "string" ? item.url : "";
      if (!url) {
        return null;
      }

      const title =
        "title" in item && typeof item.title === "string" ? item.title : "";
      const description =
        "description" in item && typeof item.description === "string"
          ? item.description
          : "";
      const icon =
        "icon" in item && typeof item.icon === "string" ? item.icon : "";
      const favicon =
        "favicon" in item && typeof item.favicon === "string"
          ? item.favicon
          : "";

      return {
        url,
        title,
        description,
        icon,
        favicon,
        ...item,
      } as LinkItem;
    })
    .filter((item): item is LinkItem => item !== null);

  if (validItems.length === 0) {
    return null;
  }

  return {
    items: validItems,
    title,
    description,
    layout: layout === "grid" ? "grid" : "list",
    columns: Math.max(1, Math.min(4, columns)),
  };
}

/**
 * Get grid columns class based on column count
 */
export function getGridColumns(columns: number): number {
  return Math.max(1, Math.min(4, columns));
}
