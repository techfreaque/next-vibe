/**
 * Widget Helper Utilities
 * Shared business logic utilities for React widgets
 * Pure functions with no side effects - can be used in any environment
 */

import type { WidgetData } from "../widget-data";

/**
 * Layout Configuration Types
 */
export interface LayoutConfig {
  type: "grid" | "flex" | "stack";
  gap: string;
  columns?: number;
  alignItems?: "start" | "center" | "end";
}

/**
 * Trend direction types
 */
type TrendDirection = "up" | "down" | "neutral";

/**
 * Get layout class name from layout config
 * Used by: ContainerWidget
 */
export function getLayoutClassName(config: LayoutConfig): string {
  const { type, gap, columns, alignItems = "center" } = config;

  // JIT-safe gap classes mapping
  const gapClassMap: Record<string, string> = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "7": "gap-7",
    "8": "gap-8",
    "9": "gap-9",
    "10": "gap-10",
    "11": "gap-11",
    "12": "gap-12",
  };

  // JIT-safe grid-cols classes mapping
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  };

  // JIT-safe items alignment classes mapping
  const alignItemsClassMap: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  const gapClass = gapClassMap[gap] ?? "gap-4";
  const alignItemsClass = alignItemsClassMap[alignItems] ?? "items-center";

  switch (type) {
    case "grid": {
      const gridColsClass = columns
        ? (gridColsMap[columns] ?? "grid-cols-1")
        : "grid-cols-1";
      return `grid ${gapClass} ${gridColsClass}`;
    }
    case "flex":
      return `flex flex-row ${alignItemsClass} ${gapClass}`;
    case "stack":
    default:
      return `flex flex-col ${gapClass}`;
  }
}

/**
 * Check if URL is external (starts with http:// or https://)
 * Used by: LinkWidget, LinkCardWidget
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Extract unit from metric value
 * Used by: MetricCardWidget
 */
export function extractMetricUnit(value: WidgetData): string | undefined {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return undefined;
  }

  return "unit" in value && typeof value.unit === "string"
    ? value.unit
    : undefined;
}

/**
 * Get trend color class name
 * Used by: MetricCardWidget
 */
export function getTrendColorClassName(direction?: TrendDirection): string {
  switch (direction) {
    case "up":
      return "text-green-600 dark:text-green-400";
    case "down":
      return "text-red-600 dark:text-red-400";
    case "neutral":
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get format class name for text display
 * Used by: TextWidget
 */
export function getTextFormatClassName(
  format: "code" | "pre" | "normal" | undefined,
): string {
  switch (format) {
    case "code":
      return "font-mono text-sm bg-muted px-1 py-0.5 rounded";
    case "pre":
      return "font-mono text-sm whitespace-pre";
    case "normal":
    default:
      return "text-foreground";
  }
}

/**
 * Get text size CSS class name from config
 * Used by: TextWidget, TitleWidget, and other text-based widgets
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
export function getTextSizeClassName(
  size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | undefined,
): string {
  if (size === "xs") {
    return "text-xs";
  }
  if (size === "sm") {
    return "text-sm";
  }
  if (size === "lg") {
    return "text-lg";
  }
  if (size === "xl") {
    return "text-xl";
  }
  if (size === "2xl") {
    return "text-2xl";
  }
  if (size === "3xl") {
    return "text-3xl";
  }
  if (size === "4xl") {
    return "text-4xl";
  }
  return "text-base";
}

/**
 * Get icon size CSS class name from config
 * Used by: LinkWidget, IconWidget, and other icon-based widgets
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
export function getIconSizeClassName(
  size: "xs" | "sm" | "base" | "lg" | "xl" | undefined,
): string {
  if (size === "xs") {
    return "h-3 w-3";
  }
  if (size === "sm") {
    return "h-3.5 w-3.5";
  }
  if (size === "lg") {
    return "h-5 w-5";
  }
  if (size === "xl") {
    return "h-6 w-6";
  }
  return "h-4 w-4";
}

/**
 * Get spacing CSS class name from config (gap, padding, margin)
 * IMPORTANT: Returns FULL Tailwind class strings for purge to detect!
 */
export function getSpacingClassName(
  type: "gap" | "padding" | "margin",
  size: string | undefined,
): string {
  if (!size) {
    return "";
  }

  // Gap classes - FULL strings for Tailwind purge
  if (type === "gap") {
    if (size === "compact") {
      return "gap-1";
    }
    if (size === "normal") {
      return "gap-2";
    }
    if (size === "relaxed") {
      return "gap-4";
    }
    if (size === "0") {
      return "gap-0";
    }
    if (size === "1") {
      return "gap-1";
    }
    if (size === "2") {
      return "gap-2";
    }
    if (size === "3") {
      return "gap-3";
    }
    if (size === "4") {
      return "gap-4";
    }
    if (size === "6") {
      return "gap-6";
    }
    if (size === "8") {
      return "gap-8";
    }
  }

  // Padding classes - FULL strings for Tailwind purge
  if (type === "padding") {
    if (size === "compact") {
      return "p-1";
    }
    if (size === "normal") {
      return "p-2";
    }
    if (size === "relaxed") {
      return "p-4";
    }
    if (size === "0") {
      return "p-0";
    }
    if (size === "1") {
      return "p-1";
    }
    if (size === "2") {
      return "p-2";
    }
    if (size === "3") {
      return "p-3";
    }
    if (size === "4") {
      return "p-4";
    }
    if (size === "6") {
      return "p-6";
    }
    if (size === "8") {
      return "p-8";
    }
  }

  // Margin classes - FULL strings for Tailwind purge
  if (type === "margin") {
    if (size === "compact") {
      return "m-1";
    }
    if (size === "normal") {
      return "m-2";
    }
    if (size === "relaxed") {
      return "m-4";
    }
    if (size === "0") {
      return "m-0";
    }
    if (size === "1") {
      return "m-1";
    }
    if (size === "2") {
      return "m-2";
    }
    if (size === "3") {
      return "m-3";
    }
    if (size === "4") {
      return "m-4";
    }
    if (size === "6") {
      return "m-6";
    }
    if (size === "8") {
      return "m-8";
    }
  }

  return "";
}

/**
 * Get border radius CSS class name from config
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
export function getBorderRadiusClassName(
  size: "none" | "sm" | "base" | "lg" | "xl" | "2xl" | "full" | undefined,
): string {
  if (size === "none") {
    return "rounded-none";
  }
  if (size === "sm") {
    return "rounded-sm";
  }
  if (size === "base") {
    return "rounded";
  }
  if (size === "lg") {
    return "rounded-lg";
  }
  if (size === "xl") {
    return "rounded-xl";
  }
  if (size === "2xl") {
    return "rounded-2xl";
  }
  if (size === "full") {
    return "rounded-full";
  }
  return "";
}

/**
 * Get height CSS class name from config
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
export function getHeightClassName(
  size: "xs" | "sm" | "base" | "lg" | undefined,
): string {
  if (size === "xs") {
    return "h-1";
  }
  if (size === "sm") {
    return "h-1.5";
  }
  if (size === "lg") {
    return "h-2.5";
  }
  return "h-1.5";
}

/**
 * Get container size CSS class name from config
 * Used by: IconWidget and other widgets with sized containers
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
export function getContainerSizeClassName(
  size: "xs" | "sm" | "base" | "lg" | "xl" | undefined,
): string {
  if (size === "xs") {
    return "w-8 h-8";
  }
  if (size === "sm") {
    return "w-9 h-9";
  }
  if (size === "lg") {
    return "w-12 h-12";
  }
  if (size === "xl") {
    return "w-14 h-14";
  }
  return "w-11 h-11";
}
