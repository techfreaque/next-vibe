/**
 * Link Widget Shared Logic
 * Data extraction and processing for LINK widget
 * Used by both React and CLI implementations
 */

import type { LinkWidgetSchema } from "./types";

/**
 * Processed link data structure
 */
export interface ProcessedLink {
  url: string;
  text: string;
  openInNewTab: boolean;
}

/**
 * Extract and validate link data from schema-validated value
 */
export function extractLinkData(value: LinkWidgetSchema): ProcessedLink | null {
  // Handle string value directly (simple URL)
  if (typeof value === "string") {
    return {
      url: value,
      text: value,
      openInNewTab: true,
    };
  }

  // Handle object value with link properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const url = typeof value.url === "string" ? value.url : "";
    const text = typeof value.text === "string" ? value.text : url;
    const openInNewTab =
      typeof value.openInNewTab === "boolean" ? value.openInNewTab : true;

    if (!url) {
      return null;
    }

    return {
      url,
      text,
      openInNewTab,
    };
  }

  // Invalid type
  return null;
}
