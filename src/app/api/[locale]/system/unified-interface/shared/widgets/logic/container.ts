/**
 * Container Widget Logic
 * Shared data extraction and processing for CONTAINER widget
 * Used by both React and CLI implementations
 */

import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";
import type { WidgetData } from "../types";

/**
 * Container layout configuration
 */
export interface ContainerLayout {
  type: "vertical" | "horizontal" | "grid";
  columns?: number;
}

/**
 * Container configuration
 */
export interface ContainerConfig {
  layout?: ContainerLayout;
  icon?: string;
  border?: boolean;
  spacing?: "compact" | "normal" | "relaxed";
}

/**
 * Processed container data structure
 */
export interface ProcessedContainer {
  children: WidgetData[];
  title?: string;
  layout?: "vertical" | "horizontal" | "grid";
  spacing?: number;
}

/**
 * Extract and validate container data from WidgetData
 */
export function extractContainerData(
  value: WidgetData,
): ProcessedContainer | null {
  // Handle array value directly (children only)
  if (Array.isArray(value)) {
    return {
      children: value,
      layout: "vertical",
    };
  }

  // Handle object value with container properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const children =
      "children" in value && Array.isArray(value.children)
        ? value.children
        : [];
    const title =
      "title" in value && typeof value.title === "string"
        ? value.title
        : undefined;
    const layout =
      "layout" in value && typeof value.layout === "string"
        ? value.layout
        : "vertical";
    const spacing =
      "spacing" in value && typeof value.spacing === "number"
        ? value.spacing
        : undefined;

    if (children.length === 0) {
      return null;
    }

    return {
      children,
      title,
      layout:
        layout === "horizontal" || layout === "grid" || layout === "vertical"
          ? layout
          : "vertical",
      spacing,
    };
  }

  return null;
}

/**
 * Get container configuration from field
 */
export function getContainerConfig<TKey extends string>(
  field: UnifiedField<TKey>,
): ContainerConfig {
  const defaultConfig: ContainerConfig = {
    spacing: "normal",
  };

  if (field.ui.type !== WidgetType.CONTAINER) {
    return defaultConfig;
  }

  const config = field.ui;

  const layout =
    config.layout &&
    typeof config.layout === "object" &&
    !Array.isArray(config.layout) &&
    "type" in config.layout
      ? (config.layout as ContainerLayout)
      : { type: "vertical" as const, columns: 1 };

  const icon = typeof config.icon === "string" ? config.icon : undefined;
  const border = typeof config.border === "boolean" ? config.border : false;
  const spacing =
    config.spacing === "compact" ||
    config.spacing === "normal" ||
    config.spacing === "relaxed"
      ? config.spacing
      : "normal";

  return {
    layout,
    icon,
    border,
    spacing,
  };
}
