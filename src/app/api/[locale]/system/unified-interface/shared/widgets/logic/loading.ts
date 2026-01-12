/**
 * Loading Widget Logic
 * Shared data extraction and processing for LOADING widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed loading data structure
 */
export interface ProcessedLoading {
  message?: string;
  progress?: number;
  indeterminate: boolean;
}

/**
 * Extract and validate loading data from WidgetData
 */
export function extractLoadingData(value: WidgetData): ProcessedLoading {
  // Handle string value directly (loading message)
  if (typeof value === "string") {
    return {
      message: value,
      indeterminate: true,
    };
  }

  // Handle number value (progress percentage)
  if (typeof value === "number") {
    return {
      progress: Math.max(0, Math.min(100, value)),
      indeterminate: false,
    };
  }

  // Handle object value with loading properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const message =
      "message" in value && typeof value.message === "string"
        ? value.message
        : undefined;
    const progress =
      "progress" in value && typeof value.progress === "number"
        ? Math.max(0, Math.min(100, value.progress))
        : undefined;
    const indeterminate =
      "indeterminate" in value && typeof value.indeterminate === "boolean"
        ? value.indeterminate
        : progress === undefined;

    return {
      message,
      progress,
      indeterminate,
    };
  }

  // Default loading state
  return {
    indeterminate: true,
  };
}

/**
 * Get loading spinner frame for CLI animation
 */
export function getSpinnerFrame(frameIndex: number): string {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  return frames[frameIndex % frames.length];
}

/**
 * Format progress bar for CLI display
 */
export function formatProgressBar(progress: number, width = 20): string {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  return `[${"=".repeat(filled)}${" ".repeat(empty)}] ${progress}%`;
}
