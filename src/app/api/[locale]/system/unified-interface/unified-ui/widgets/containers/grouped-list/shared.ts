/**
 * Grouped List Widget Logic
 * Shared data extraction and processing for GROUPED_LIST widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { isObject as checkIsObject } from "../../_shared/type-guards";

/**
 * Individual item in a grouped list
 */
interface GroupedListItem {
  [key: string]: WidgetData;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

/**
 * Processed grouped list data structure
 */
interface ProcessedGroupedList {
  groups: Array<{
    key: string;
    label: string;
    items: GroupedListItem[];
    summary?: Record<string, WidgetData>;
  }>;
  maxItemsPerGroup?: number;
  showGroupSummary: boolean;
}

/**
 * Group list data by specified field with sorting
 */
function groupListData(
  data: GroupedListItem[],
  groupBy: string,
): Map<string, GroupedListItem[]> {
  const groups = new Map<string, GroupedListItem[]>();

  for (const item of data) {
    const groupValue = item[groupBy];
    let groupKey = "unknown";
    if (typeof groupValue === "string") {
      groupKey = groupValue;
    } else if (typeof groupValue === "number") {
      groupKey = String(groupValue);
    } else if (typeof groupValue === "boolean") {
      groupKey = groupValue ? "true" : "false";
    } else if (groupValue !== null && groupValue !== undefined) {
      groupKey = "unknown";
    }
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }

  // Sort groups by key alphabetically
  return new Map(
    [...groups.entries()].toSorted((a, b) => a[0].localeCompare(b[0])),
  );
}

/**
 * Sort grouped items by specified field
 */
function sortGroupedItems(
  items: GroupedListItem[],
  sortBy: string,
): GroupedListItem[] {
  return items.toSorted((a, b) => {
    if (sortBy === "severity") {
      const severityOrder: Record<string, number> = {
        error: 0,
        warning: 1,
        info: 2,
      };
      const aSeverity = typeof a.severity === "string" ? a.severity : "info";
      const bSeverity = typeof b.severity === "string" ? b.severity : "info";
      const aOrder = severityOrder[aSeverity] ?? 3;
      const bOrder = severityOrder[bSeverity] ?? 3;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
    }

    // Secondary sort by line number
    if (typeof a.line === "number" && typeof b.line === "number") {
      return a.line - b.line;
    }

    return 0;
  });
}

/**
 * Extract and validate grouped list data from WidgetData
 */
export function extractGroupedListData(
  value: WidgetData,
  config?: { groupBy?: string; sortBy?: string },
): ProcessedGroupedList | null {
  // Handle direct array input
  if (Array.isArray(value)) {
    const items = value as GroupedListItem[];
    if (items.length === 0) {
      return null;
    }

    // Use groupBy from config, fallback to "status", or create single group
    const groupByField = config?.groupBy ?? "status";
    if (groupByField in items[0]) {
      const grouped = groupListData(items, groupByField);
      let autoGroups = [...grouped.entries()].map(([key, groupItems]) => ({
        key,
        label: key,
        items: groupItems,
      }));

      // Apply sorting if sortBy is specified
      const sortBy = config?.sortBy;
      if (sortBy) {
        autoGroups = autoGroups.map((group) => ({
          ...group,
          items: sortGroupedItems(group.items, sortBy),
        }));
      }

      return {
        groups: autoGroups,
        maxItemsPerGroup: undefined,
        showGroupSummary: false,
      };
    }
    // Single group with all items
    let allItems = items;
    if (config?.sortBy) {
      allItems = sortGroupedItems(items, config.sortBy);
    }

    return {
      groups: [
        {
          key: "all",
          label: "All Items",
          items: allItems,
        },
      ],
      maxItemsPerGroup: undefined,
      showGroupSummary: false,
    };
  }

  // Narrow to object type
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return null;
  }

  // Extract properties with explicit checks
  const groups = Array.isArray(value.groups) ? value.groups : [];
  const maxItemsPerGroup =
    "maxItemsPerGroup" in value && typeof value.maxItemsPerGroup === "number"
      ? value.maxItemsPerGroup
      : undefined;
  const showGroupSummary =
    "showGroupSummary" in value && typeof value.showGroupSummary === "boolean"
      ? value.showGroupSummary
      : false;

  // If no groups found, try to find an array property to auto-group
  if (!groups || groups.length === 0) {
    // Look for array properties in the value object (direct or nested)
    let arrayKeys = Object.keys(value).filter((key) =>
      Array.isArray(value[key]),
    );

    // If no direct arrays found, check nested objects (common pattern: { response: { items: [...] } })
    if (arrayKeys.length === 0) {
      for (const key of Object.keys(value)) {
        const nestedValue = value[key];
        if (
          typeof nestedValue === "object" &&
          nestedValue !== null &&
          !Array.isArray(nestedValue)
        ) {
          const nestedArrayKeys = Object.keys(nestedValue).filter((nestedKey) =>
            Array.isArray(nestedValue[nestedKey]),
          );
          if (nestedArrayKeys.length > 0) {
            // Found nested array, use the nested object as the value
            return extractGroupedListData(nestedValue, config);
          }
        }
      }
    }

    if (arrayKeys.length > 0) {
      // Use the first array found (commonly: leads, items, results, etc.)
      const arrayKey = arrayKeys[0];
      const items = value[arrayKey] as GroupedListItem[];

      if (items.length > 0) {
        // Use groupBy from config, fallback to "status", or create single group
        const groupByField = config?.groupBy || "status";
        if (groupByField in items[0]) {
          const grouped = groupListData(items, groupByField);
          let autoGroups = [...grouped.entries()].map(([key, groupItems]) => ({
            key,
            label: key,
            items: groupItems,
          }));

          // Apply sorting if sortBy is specified
          const sortBy = config?.sortBy;
          if (sortBy) {
            autoGroups = autoGroups.map((group) => ({
              ...group,
              items: sortGroupedItems(group.items, sortBy),
            }));
          }

          return {
            groups: autoGroups,
            maxItemsPerGroup,
            showGroupSummary: false,
          };
        }
        // Single group with all items
        let allItems = items;
        if (config?.sortBy) {
          allItems = sortGroupedItems(items, config.sortBy);
        }

        return {
          groups: [
            {
              key: "all",
              label: "All Items",
              items: allItems,
            },
          ],
          maxItemsPerGroup,
          showGroupSummary: false,
        };
      }
    }

    return null;
  }

  // Process and validate groups
  const processedGroups = groups
    .map((group: WidgetData) => {
      if (typeof group !== "object" || group === null) {
        return null;
      }

      const groupKey = "key" in group ? String(group.key) : "";
      const groupLabel = "label" in group ? String(group.label) : "";

      // Type assertion needed since WidgetData is a union type
      const maybeGroup = group as { items?: WidgetData; summary?: WidgetData };
      const groupItems = Array.isArray(maybeGroup.items)
        ? maybeGroup.items
        : [];

      const groupSummary =
        maybeGroup.summary && checkIsObject(maybeGroup.summary)
          ? maybeGroup.summary
          : undefined;

      // Filter items to only valid objects
      const validItems = groupItems.filter(
        (item): item is GroupedListItem =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      );

      return {
        key: groupKey,
        label: groupLabel,
        items: validItems,
        summary: groupSummary,
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);

  if (processedGroups.length === 0) {
    return null;
  }

  return {
    groups: processedGroups,
    maxItemsPerGroup,
    showGroupSummary,
  };
}

/**
 * Get items to display based on maxItemsPerGroup
 */
export function getDisplayItems(
  items: GroupedListItem[],
  maxItems: number | undefined,
  isExpanded: boolean,
): GroupedListItem[] {
  if (!maxItems || isExpanded) {
    return items;
  }
  return items.slice(0, maxItems);
}

/**
 * Calculate remaining items count
 */
export function getRemainingItemsCount(
  totalItems: number,
  maxItems: number | undefined,
): number {
  if (!maxItems || totalItems <= maxItems) {
    return 0;
  }
  return totalItems - maxItems;
}
