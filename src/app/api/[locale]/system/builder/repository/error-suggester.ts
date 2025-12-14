/**
 * Error Suggester Service
 * Provides actionable suggestions based on error messages
 */

import type { TranslateFunction } from "./types";

// ============================================================================
// Interface
// ============================================================================

export interface IErrorSuggester {
  /**
   * Get actionable suggestions based on an error message
   */
  getSuggestions(errorMessage: string, t: TranslateFunction): string[];
}

// ============================================================================
// Implementation
// ============================================================================

export class ErrorSuggester implements IErrorSuggester {
  getSuggestions(errorMessage: string, t: TranslateFunction): string[] {
    const suggestions: string[] = [];
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes("not found") || lowerError.includes("enoent")) {
      suggestions.push(t("app.api.system.builder.suggestions.checkFilePaths"));
      suggestions.push(t("app.api.system.builder.suggestions.runFromProjectRoot"));
    }

    if (lowerError.includes("permission") || lowerError.includes("eacces")) {
      suggestions.push(t("app.api.system.builder.suggestions.checkPermissions"));
    }

    if (lowerError.includes("module") || lowerError.includes("import")) {
      suggestions.push(t("app.api.system.builder.suggestions.checkDependencies"));
      suggestions.push(t("app.api.system.builder.suggestions.runInstall"));
    }

    if (lowerError.includes("memory") || lowerError.includes("heap")) {
      suggestions.push(t("app.api.system.builder.suggestions.increaseMemory"));
      suggestions.push(t("app.api.system.builder.suggestions.useExternals"));
    }

    if (lowerError.includes("syntax") || lowerError.includes("parse")) {
      suggestions.push(t("app.api.system.builder.suggestions.checkSyntax"));
      suggestions.push(t("app.api.system.builder.suggestions.runTypecheck"));
    }

    if (lowerError.includes("timeout")) {
      suggestions.push(t("app.api.system.builder.suggestions.increaseTimeout"));
      suggestions.push(t("app.api.system.builder.suggestions.checkNetworkConnection"));
    }

    if (lowerError.includes("disk") || lowerError.includes("enospc")) {
      suggestions.push(t("app.api.system.builder.suggestions.checkDiskSpace"));
      suggestions.push(t("app.api.system.builder.suggestions.cleanBuildCache"));
    }

    return suggestions;
  }
}

// Singleton instance
export const errorSuggester = new ErrorSuggester();
