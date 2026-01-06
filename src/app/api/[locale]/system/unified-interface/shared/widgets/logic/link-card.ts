/**
 * Link Card Widget Logic
 * Shared data extraction and processing for LINK_CARD widget
 * Used by both React and CLI implementations
 */

import type { IconKey } from "../../../react/icons";
import type { WidgetData } from "../types";

/**
 * Processed link card data structure
 */
export interface ProcessedLinkCard {
  url: string;
  title: string;
  description?: string;
  icon?: IconKey;
  favicon?: IconKey;
  metadata?: Record<string, string>;
  snippet?: string;
  age?: string;
  source?: string;
  thumbnail?: string;
  openInNewTab?: boolean;
}

/**
 * Extract and validate link card data from WidgetData
 */
export function extractLinkCardData(value: WidgetData): ProcessedLinkCard | null {
  // Narrow to object type first
  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return null;
  }

  // Extract required url
  const url = "url" in value && typeof value.url === "string" ? value.url : "";
  if (!url) {
    return null;
  }

  // Extract optional properties
  const title = "title" in value && typeof value.title === "string" ? value.title : url;
  const description =
    "description" in value && typeof value.description === "string" ? value.description : undefined;
  const icon = "icon" in value && typeof value.icon === "string" ? value.icon : undefined;
  const favicon =
    "favicon" in value && typeof value.favicon === "string" ? value.favicon : undefined;

  // Extract metadata if present
  let metadata: Record<string, string> | undefined;
  if (
    "metadata" in value &&
    typeof value.metadata === "object" &&
    value.metadata !== null &&
    !Array.isArray(value.metadata)
  ) {
    metadata = {};
    for (const [key, val] of Object.entries(value.metadata)) {
      if (typeof val === "string") {
        metadata[key] = val;
      }
    }
  }

  // Extract additional optional properties
  const snippet =
    "snippet" in value && typeof value.snippet === "string" ? value.snippet : undefined;
  const age = "age" in value && typeof value.age === "string" ? value.age : undefined;
  const source = "source" in value && typeof value.source === "string" ? value.source : undefined;
  const thumbnail =
    "thumbnail" in value && typeof value.thumbnail === "string" ? value.thumbnail : undefined;
  const openInNewTab =
    "openInNewTab" in value && typeof value.openInNewTab === "boolean" ? value.openInNewTab : true;

  return {
    url,
    title,
    description,
    icon: icon as IconKey | undefined,
    favicon: favicon as IconKey | undefined,
    metadata,
    snippet,
    age,
    source,
    thumbnail,
    openInNewTab,
  };
}

/**
 * Get display URL (shortened for UI)
 */
export function getDisplayUrl(url: string, maxLength = 50): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");
    if (domain.length > maxLength) {
      // oxlint-disable-next-line prefer-template
      return domain.slice(0, maxLength - 3) + "...";
    }
    return domain;
  } catch {
    if (url.length > maxLength) {
      // oxlint-disable-next-line prefer-template
      return url.slice(0, maxLength - 3) + "...";
    }
    return url;
  }
}
