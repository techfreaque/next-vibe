/**
 * Output Formatter Service
 * Formats console output for build operations
 */

import { SIZE_THRESHOLDS } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IOutputFormatter {
  /** Format a header with decorative lines */
  formatHeader(text: string): string;

  /** Format a section title */
  formatSection(text: string): string;

  /** Format a step description */
  formatStep(text: string): string;

  /** Format an item with name and detail */
  formatItem(name: string, detail: string): string;

  /** Format a success message */
  formatSuccess(text: string): string;

  /** Format a warning message */
  formatWarning(text: string): string;

  /** Format an error message */
  formatError(text: string): string;

  /** Format verbose/debug output */
  formatVerbose(text: string): string;

  /** Format bytes to human readable string */
  formatBytes(bytes: number): string;

  /** Get size indicator based on thresholds */
  getSizeIndicator(size: number): string;
}

// ============================================================================
// Implementation
// ============================================================================

export class OutputFormatter implements IOutputFormatter {
  formatHeader(text: string): string {
    const line = "═".repeat(60);
    return `\n${line}\n  ${text}\n${line}`;
  }

  formatSection(text: string): string {
    return `\n▸ ${text}`;
  }

  formatStep(text: string): string {
    return `  ${text}`;
  }

  formatItem(name: string, detail: string): string {
    return `    ${name} ${detail}`;
  }

  formatSuccess(text: string): string {
    return `\n  ${text}`;
  }

  formatWarning(text: string): string {
    return `  ⚠ ${text}`;
  }

  formatError(text: string): string {
    return `\n  ✖ ${text}`;
  }

  formatVerbose(text: string): string {
    return `    ┊ ${text}`;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  getSizeIndicator(size: number): string {
    if (size > SIZE_THRESHOLDS.CRITICAL) {
      return "⚠️";
    }
    if (size > SIZE_THRESHOLDS.WARNING) {
      return "⚡";
    }
    return "✓";
  }
}

// Singleton instance
export const outputFormatter = new OutputFormatter();
