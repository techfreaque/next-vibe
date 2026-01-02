/**
 * Grouped List Widget Logic
 * Shared data extraction and processing for GROUPED_LIST widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Individual item in a grouped list
 */
export interface GroupedListItem {
  [key: string]: WidgetData;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

/**
 * Stat configuration for summary
 */
export interface StatConfig {
  field: string;
  value: string;
  label?: string;
  icon?: string;
  color?: string;
}

/**
 * Grouped list configuration
 */
export interface GroupedListConfig {
  groupBy: string;
  sortBy: string;
  showGroupSummary: boolean;
  maxItemsPerGroup: number;
  summaryTitle?: string;
  summaryStats?: StatConfig[];
  renderMode?: "code-quality" | "simple";
  hierarchical?: boolean;
}

/**
 * Tree node for hierarchical rendering
 */
export interface TreeNode {
  name: string;
  fullPath: string;
  items: GroupedListItem[];
  children: Map<string, TreeNode>;
}

/**
 * Processed grouped list data structure
 */
export interface ProcessedGroupedList {
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
 * Get grouped list configuration from field
 */
export function getGroupedListConfig(): GroupedListConfig {
  return {
    groupBy: "file",
    sortBy: "severity",
    showGroupSummary: true,
    maxItemsPerGroup: 50,
  };
}

/**
 * Group list data by specified field with sorting
 */
export function groupListData(
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
  return new Map([...groups.entries()].toSorted((a, b) => a[0].localeCompare(b[0])));
}

/**
 * Sort grouped items by specified field
 */
export function sortGroupedItems(items: GroupedListItem[], sortBy: string): GroupedListItem[] {
  return items.toSorted((a, b) => {
    if (sortBy === "severity") {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      const aOrder = severityOrder[a.severity as keyof typeof severityOrder] ?? 3;
      const bOrder = severityOrder[b.severity as keyof typeof severityOrder] ?? 3;
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
 * Build hierarchical tree structure from flat data
 */
export function buildHierarchicalTree(data: GroupedListItem[], groupBy: string): TreeNode {
  const root: TreeNode = {
    name: "",
    fullPath: "",
    items: [],
    children: new Map(),
  };

  // Group items by category path
  for (const item of data) {
    const categoryPath = item[groupBy];
    if (typeof categoryPath !== "string") {
      continue;
    }

    const parts = categoryPath.split("/").filter((p) => p.length);
    let currentNode = root;

    // Build/traverse tree
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const fullPath = parts.slice(0, i + 1).join("/");

      if (!currentNode.children.has(part)) {
        currentNode.children.set(part, {
          name: part,
          fullPath,
          items: [],
          children: new Map(),
        });
      }
      currentNode = currentNode.children.get(part)!;
    }

    // Add item to leaf node
    currentNode.items.push(item);
  }

  return root;
}

/**
 * Count items recursively including all children
 */
export function countItemsRecursive(node: TreeNode): number {
  let count = node.items.length;
  for (const childEntry of node.children) {
    const child = childEntry[1];
    count += countItemsRecursive(child);
  }
  return count;
}

/**
 * Calculate stat count for a specific field/value combination
 */
export function calculateStatCount(data: GroupedListItem[], stat: StatConfig): number {
  if (!stat.field || !stat.value) {
    return 0;
  }

  return data.filter((item) => {
    const fieldValue = item[stat.field];
    return fieldValue === stat.value;
  }).length;
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
  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return null;
  }

  // Extract properties with explicit checks
  const groups = "groups" in value && Array.isArray(value.groups) ? value.groups : [];
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
    let arrayKeys = Object.keys(value).filter((key) => Array.isArray(value[key]));

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
      const groupItems = "items" in group && Array.isArray(group.items) ? group.items : [];
      const groupSummary =
        "summary" in group && typeof group.summary === "object" && group.summary !== null
          ? (group.summary as Record<string, WidgetData>)
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
export function getRemainingItemsCount(totalItems: number, maxItems: number | undefined): number {
  if (!maxItems || totalItems <= maxItems) {
    return 0;
  }
  return totalItems - maxItems;
}
