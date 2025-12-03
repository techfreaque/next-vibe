/**
 * Error Widget Logic
 * Shared data extraction and processing for ERROR widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed error data structure
 */
export interface ProcessedError {
  title: string;
  message?: string;
  code?: string;
  stack?: string;
  action?: {
    label: string;
    action: string;
  };
}

/**
 * Extract and validate error data from WidgetData
 */
export function extractErrorData(value: WidgetData): ProcessedError | null {
  // Handle string value directly (simple error message)
  if (typeof value === "string") {
    return {
      title: "Error",
      message: value,
    };
  }

  // Handle Error object
  if (value instanceof Error) {
    return {
      title: value.name || "Error",
      message: value.message,
      stack: value.stack,
    };
  }

  // Handle object value with error properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const title =
      "title" in value && typeof value.title === "string"
        ? value.title
        : "Error";
    const message =
      "message" in value && typeof value.message === "string"
        ? value.message
        : undefined;
    const code =
      "code" in value && typeof value.code === "string"
        ? value.code
        : undefined;
    const stack =
      "stack" in value && typeof value.stack === "string"
        ? value.stack
        : undefined;
    const action =
      "action" in value &&
      typeof value.action === "object" &&
      value.action !== null
        ? {
            label:
              "label" in value.action && typeof value.action.label === "string"
                ? value.action.label
                : "Retry",
            action:
              "action" in value.action &&
              typeof value.action.action === "string"
                ? value.action.action
                : "",
          }
        : undefined;

    return {
      title,
      message,
      code,
      stack,
      action,
    };
  }

  // Default error
  return {
    title: "Error",
    message: "An unknown error occurred",
  };
}
