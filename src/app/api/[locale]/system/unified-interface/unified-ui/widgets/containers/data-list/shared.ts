/**
 * Data List Widget Logic
 * Shared data extraction and processing for DATA_LIST widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../../../../shared/widgets/widget-data";

/**
 * List item type
 */
export interface ListItem {
  [key: string]: WidgetData;
}

/**
 * Type guard to check if a value is a ListItem
 */
function isListItem(item: WidgetData): item is ListItem {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Processed data list structure
 */
interface ProcessedDataList {
  items: ListItem[];
  title?: string;
  showBullets: boolean;
  maxItems?: number;
}

/**
 * Extract and validate data list from WidgetData
 */
export function extractDataListData(
  value: WidgetData,
): ProcessedDataList | null {
  // Handle array of items directly
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    // Check if array contains simple values (strings, numbers) or objects
    const firstItem = value[0];
    const isSimpleValueArray =
      typeof firstItem !== "object" || firstItem === null;

    if (isSimpleValueArray) {
      // For simple value arrays, return them as-is
      // The DataListWidget will handle rendering via WidgetRenderer
      return {
        items: value as ListItem[],
        showBullets: true,
      };
    }

    const filteredItems: ListItem[] = [];
    for (const item of value) {
      if (isListItem(item)) {
        filteredItems.push(item);
      }
    }

    if (filteredItems.length === 0) {
      return null;
    }

    return {
      items: filteredItems,
      showBullets: true,
    };
  }

  // Handle object with items array
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const items = Array.isArray(value.items) ? value.items : [];
    const title = typeof value.title === "string" ? value.title : undefined;
    const showBullets =
      typeof value.showBullets === "boolean" ? value.showBullets : true;
    const maxItems =
      typeof value.maxItems === "number" ? value.maxItems : undefined;

    const validItems = items.filter(
      (item): item is ListItem =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );

    if (validItems.length === 0) {
      return null;
    }

    return {
      items: validItems,
      title,
      showBullets,
      maxItems,
    };
  }

  return null;
}

/**
 * Get display items based on maxItems limit
 */
export function getListDisplayItems(
  items: ListItem[],
  maxItems?: number,
): ListItem[] {
  if (!maxItems || items.length <= maxItems) {
    return items;
  }
  return items.slice(0, maxItems);
}

/**
 * Get remaining items count
 */
export function getRemainingListItemsCount(
  totalItems: number,
  maxItems?: number,
): number {
  if (!maxItems || totalItems <= maxItems) {
    return 0;
  }
  return totalItems - maxItems;
}
