/**
 * Link Widget Logic
 * Shared data extraction and processing for LINK widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed link data structure
 */
export interface ProcessedLink {
  url: string;
  text: string;
  openInNewTab: boolean;
}

/**
 * Extract and validate link data from WidgetData
 */
export function extractLinkData(value: WidgetData): ProcessedLink | null {
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
    const url =
      "url" in value && typeof value.url === "string" ? value.url : "";
    const text =
      "text" in value && typeof value.text === "string" ? value.text : url;
    const openInNewTab =
      "openInNewTab" in value && typeof value.openInNewTab === "boolean"
        ? value.openInNewTab
        : true;

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

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    // oxlint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
