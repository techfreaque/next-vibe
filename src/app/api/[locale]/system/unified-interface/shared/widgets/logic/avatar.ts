/**
 * Avatar Widget Logic
 * Shared data extraction and processing for AVATAR widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed avatar data structure
 */
export interface ProcessedAvatar {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Extract and validate avatar data from WidgetData
 */
export function extractAvatarData(value: WidgetData): ProcessedAvatar | null {
  // Handle string value directly (image URL)
  if (typeof value === "string") {
    return {
      src: value,
      alt: "Avatar",
      fallback: getInitials(value),
      size: "md",
    };
  }

  // Handle object value with avatar properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const src = "src" in value && typeof value.src === "string" ? value.src : "";
    const alt =
      "alt" in value && typeof value.alt === "string" ? value.alt : "Avatar";
    const fallback =
      "fallback" in value && typeof value.fallback === "string"
        ? value.fallback
        : getInitials(alt);
    const size =
      "size" in value && typeof value.size === "string"
        ? (value.size as "sm" | "md" | "lg")
        : "md";

    return {
      src: src || undefined,
      alt,
      fallback,
      size,
    };
  }

  // Invalid type
  return null;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
