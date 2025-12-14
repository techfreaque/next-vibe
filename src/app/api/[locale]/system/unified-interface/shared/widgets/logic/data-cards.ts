/**
 * Data Cards Widget Logic
 * Shared data extraction and processing for DATA_CARDS widget
 * Used by both React and CLI implementations
 */

import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";
import type { WidgetData } from "../types";

/**
 * Individual card item
 */
export interface CardItem {
  [key: string]: WidgetData;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

/**
 * Type guard to check if a value is a CardItem
 */
function isCardItem(item: WidgetData): item is CardItem {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Card configuration
 */
export interface CardConfig {
  layout: {
    columns: number;
    spacing: string;
  };
  groupBy?: string;
  cardTemplate: string;
  showSummary: boolean;
  summaryTemplate?: string;
  itemConfig: {
    template: string;
    size: string;
    spacing: string;
  };
}

/**
 * Processed data cards structure
 */
export interface ProcessedDataCards {
  cards: CardItem[];
  columns: number;
  title?: string;
}

/**
 * Get card configuration from field
 */
export function getCardsConfig(field: UnifiedField): CardConfig {
  const defaultConfig: CardConfig = {
    layout: { columns: 2, spacing: "normal" },
    cardTemplate: "default",
    showSummary: false,
    itemConfig: { template: "default", size: "medium", spacing: "normal" },
  };

  if (field.ui.type !== WidgetType.DATA_CARDS) {
    return defaultConfig;
  }

  const config = field.ui;

  // Handle layout config - ensure it's an object
  let layout: { columns: number; spacing: string } = {
    columns: 2,
    spacing: "normal",
  };
  if (
    config.layout &&
    typeof config.layout === "object" &&
    "columns" in config.layout &&
    "spacing" in config.layout
  ) {
    layout = {
      columns:
        typeof config.layout.columns === "number" ? config.layout.columns : 2,
      spacing:
        typeof config.layout.spacing === "string"
          ? config.layout.spacing
          : "normal",
    };
  }

  return {
    layout,
    groupBy: config.groupBy !== undefined ? String(config.groupBy) : undefined,
    cardTemplate:
      config.cardTemplate !== undefined
        ? String(config.cardTemplate)
        : "default",
    showSummary:
      config.showSummary !== undefined ? Boolean(config.showSummary) : false,
    summaryTemplate:
      config.summaryTemplate !== undefined
        ? String(config.summaryTemplate)
        : undefined,
    itemConfig:
      config.itemConfig &&
      typeof config.itemConfig === "object" &&
      "template" in config.itemConfig &&
      "size" in config.itemConfig &&
      "spacing" in config.itemConfig
        ? {
            template:
              typeof config.itemConfig.template === "string"
                ? config.itemConfig.template
                : "default",
            size:
              typeof config.itemConfig.size === "string"
                ? config.itemConfig.size
                : "medium",
            spacing:
              typeof config.itemConfig.spacing === "string"
                ? config.itemConfig.spacing
                : "normal",
          }
        : {
            template: "default",
            size: "medium",
            spacing: "normal",
          },
  };
}

/**
 * Group card data by specified field
 */
export function groupCardData(
  data: CardItem[],
  groupBy: string,
): Map<string, CardItem[]> {
  const groups = new Map<string, CardItem[]>();

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

  return groups;
}

/**
 * Count cards by severity
 */
export function countBySeverity(data: CardItem[]): Record<string, number> {
  const counts: Record<string, number> = { error: 0, warning: 0, info: 0 };

  for (const item of data) {
    const severityValue = item.severity;
    let severity = "info";
    if (typeof severityValue === "string") {
      severity = severityValue;
    }
    if (severity in counts) {
      counts[severity]++;
    } else {
      counts[severity] = 1;
    }
  }

  return counts;
}

/**
 * Extract and validate data cards from WidgetData
 */
export function extractDataCardsData(
  value: WidgetData,
): ProcessedDataCards | null {
  // Handle array of cards directly
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    const filteredCards: CardItem[] = [];
    for (const item of value) {
      if (isCardItem(item)) {
        filteredCards.push(item);
      }
    }

    if (filteredCards.length === 0) {
      return null;
    }

    return {
      cards: filteredCards,
      columns: 3,
    };
  }

  // Handle object with cards array
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const cards =
      "cards" in value && Array.isArray(value.cards) ? value.cards : [];
    const columns =
      "columns" in value && typeof value.columns === "number"
        ? value.columns
        : 3;
    const title =
      "title" in value && typeof value.title === "string"
        ? value.title
        : undefined;

    const validCards = cards.filter(
      (item): item is CardItem =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );

    if (validCards.length === 0) {
      return null;
    }

    return {
      cards: validCards,
      columns: Math.max(1, Math.min(4, columns)),
      title,
    };
  }

  return null;
}

/**
 * Get grid columns count
 */
export function getDataCardsColumns(columns: number): number {
  return Math.max(1, Math.min(4, columns));
}
