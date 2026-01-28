/**
 * Section Widget Logic
 * Shared data extraction and processing for SECTION widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../../../../shared/widgets/widget-data";

/**
 * Processed section data structure
 */
interface ProcessedSection {
  title: string;
  content: WidgetData;
  description?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
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
  const title = typeof value.title === "string" ? value.title : "";

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
    typeof value.description === "string" ? value.description : undefined;
  const collapsible =
    typeof value.collapsible === "boolean" ? value.collapsible : false;
  const defaultExpanded =
    typeof value.defaultExpanded === "boolean" ? value.defaultExpanded : true;

  return {
    title,
    content,
    description,
    collapsible,
    defaultExpanded,
  };
}
