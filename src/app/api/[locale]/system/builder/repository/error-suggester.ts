/**
 * Error Suggester Service
 * Provides actionable suggestions based on error messages
 */

import type { scopedTranslation } from "../i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// ============================================================================
// Interface
// ============================================================================

export interface IErrorSuggester {
  /**
   * Get actionable suggestions based on an error message
   */
  getSuggestions(errorMessage: string, t: ModuleT): string[];
}

// ============================================================================
// Implementation
// ============================================================================

export class ErrorSuggester implements IErrorSuggester {
  getSuggestions(errorMessage: string, t: ModuleT): string[] {
    const suggestions: string[] = [];
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes("not found") || lowerError.includes("enoent")) {
      suggestions.push(t("suggestions.checkFilePaths"));
      suggestions.push(t("suggestions.runFromProjectRoot"));
    }

    if (lowerError.includes("permission") || lowerError.includes("eacces")) {
      suggestions.push(t("suggestions.checkPermissions"));
    }

    if (lowerError.includes("module") || lowerError.includes("import")) {
      suggestions.push(t("suggestions.checkDependencies"));
      suggestions.push(t("suggestions.runInstall"));
    }

    if (lowerError.includes("memory") || lowerError.includes("heap")) {
      suggestions.push(t("suggestions.increaseMemory"));
      suggestions.push(t("suggestions.useExternals"));
    }

    if (lowerError.includes("syntax") || lowerError.includes("parse")) {
      suggestions.push(t("suggestions.checkSyntax"));
      suggestions.push(t("suggestions.runTypecheck"));
    }

    if (lowerError.includes("timeout")) {
      suggestions.push(t("suggestions.increaseTimeout"));
      suggestions.push(t("suggestions.checkNetworkConnection"));
    }

    if (lowerError.includes("disk") || lowerError.includes("enospc")) {
      suggestions.push(t("suggestions.checkDiskSpace"));
      suggestions.push(t("suggestions.cleanBuildCache"));
    }

    return suggestions;
  }
}

// Singleton instance
export const errorSuggester = new ErrorSuggester();
