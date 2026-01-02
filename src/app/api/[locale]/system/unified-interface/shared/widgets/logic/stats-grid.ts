/**
 * Stats Grid Widget Logic
 * Shared data extraction and processing for STATS_GRID widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";
import type { ProcessedMetricCard } from "./metric-card";
import { extractMetricCardData } from "./metric-card";

/**
 * Processed stats grid data structure
 */
export interface ProcessedStatsGrid {
  stats: ProcessedMetricCard[];
  columns: number;
  title?: string;
}

/**
 * Extract and validate stats grid data from WidgetData
 */
export function extractStatsGridData(value: WidgetData): ProcessedStatsGrid | null {
  // Narrow to object type first
  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return null;
  }

  // Extract stats array
  const stats = "stats" in value && Array.isArray(value.stats) ? value.stats : [];

  if (stats.length === 0) {
    return null;
  }

  // Extract optional properties
  const columns = "columns" in value && typeof value.columns === "number" ? value.columns : 3;
  const title = "title" in value && typeof value.title === "string" ? value.title : undefined;

  // Process each stat using metric card extractor
  const processedStats = stats
    .map((stat: WidgetData) => extractMetricCardData(stat))
    .filter((stat): stat is ProcessedMetricCard => stat !== null);

  if (processedStats.length === 0) {
    return null;
  }

  return {
    stats: processedStats,
    columns: Math.max(1, Math.min(4, columns)),
    title,
  };
}

/**
 * Get grid columns count
 */
export function getStatsGridColumns(columns: number): number {
  return Math.max(1, Math.min(4, columns));
}
