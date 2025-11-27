/**
 * Section Widget Logic
 * Shared data extraction and processing for SECTION widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed section data structure
 */
export interface ProcessedSection {
  title: string;
  content: WidgetData;
  description?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Check if section is empty (has no meaningful content)
 */
export function isSectionEmpty(value: Record<string, WidgetData>): boolean {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return true;
  }

  // Check if all values are empty/null/undefined
  return entries.every((entry) => {
    const val = entry[1];
    if (val === null || val === undefined) {
      return true;
    }
    if (Array.isArray(val) && val.length === 0) {
      return true;
    }
    if (typeof val === "object" && Object.keys(val).length === 0) {
      return true;
    }
    return false;
  });
}

/**
 * Extract and validate section data from WidgetData
 */
export function extractSectionData(value: WidgetData): ProcessedSection | null {
  // Section must be an object
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  // Extract required title
  const title =
    "title" in value && typeof value.title === "string" ? value.title : "";

  if (!title) {
    return null;
  }

  // Extract required content
  const content = "content" in value ? value.content : null;

  if (content === null || content === undefined) {
    return null;
  }

  // Extract optional properties
  const description =
    "description" in value && typeof value.description === "string"
      ? value.description
      : undefined;
  const collapsible =
    "collapsible" in value && typeof value.collapsible === "boolean"
      ? value.collapsible
      : false;
  const defaultExpanded =
    "defaultExpanded" in value && typeof value.defaultExpanded === "boolean"
      ? value.defaultExpanded
      : true;

  return {
    title,
    content,
    description,
    collapsible,
    defaultExpanded,
  };
}
