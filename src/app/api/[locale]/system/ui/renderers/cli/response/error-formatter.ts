/**
 * CLI Error Formatter
 * Static class for formatting errors and error chains
 */

import { scopedTranslation as cliScopedTranslation } from "@/app/api/[locale]/system/unified-interface/cli/i18n";
import type { RouteExecutionResult } from "@/app/api/[locale]/system/unified-interface/cli/runtime/route-executor";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { formatValidationErrorDetails } from "@/app/api/[locale]/system/unified-interface/shared/utils/format-validation-error";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

/**
 * Static class for error formatting
 */
export class CliErrorFormatter {
  /**
   * Format error result with cause chain
   */
  static formatErrorResult(
    result: RouteExecutionResult,
    locale: CountryLanguage,
    verbose: boolean,
    endpoint?: CreateApiEndpointAny | null,
  ): string {
    const { t: cliT } = cliScopedTranslation.scopedT(locale);

    // Format validation errors nicely - each field on its own line
    const errorParams = result.errorParams;
    const isValidationError =
      errorParams && "error" in errorParams && "errorCount" in errorParams;

    // TranslatedKeyType values are already translated strings at runtime
    const errorMessage: string =
      result.error ?? cliT("vibe.errors.unknownError", result.errorParams);

    let detailedError = errorMessage;
    if (isValidationError) {
      const details = formatValidationErrorDetails(
        errorParams as Record<string, string | number>,
        endpoint,
        result.inputData,
      );
      if (details) {
        // Skip the redundant "Validation Error" title - details are self-explanatory
        detailedError = details;
      }
    } else if (errorParams && Object.keys(errorParams).length > 0) {
      // Generic params - show as before
      // eslint-disable-next-line i18next/no-literal-string
      detailedError += "\n\nDetails:";
      for (const [key, value] of Object.entries(errorParams)) {
        // eslint-disable-next-line i18next/no-literal-string
        detailedError += `\n  ${key}: ${value}`;
      }
    }

    const unknownErrorKey = cliT("vibe.errors.unknownError");

    // Handle error cause chain
    const causeChain = this.formatErrorCauseChain(
      result,
      verbose,
      0,
      unknownErrorKey,
    );
    if (causeChain) {
      detailedError += causeChain;
    }

    // eslint-disable-next-line i18next/no-literal-string
    const prefix = isValidationError ? "❌" : "❌ Error:";
    if (verbose) {
      // eslint-disable-next-line i18next/no-literal-string
      return `${prefix} ${detailedError}\n\nFull Response:\n${JSON.stringify(result, null, 2)}`;
    }
    // eslint-disable-next-line i18next/no-literal-string
    return `${prefix} ${detailedError}`;
  }

  /**
   * Format error cause chain recursively
   */
  private static formatErrorCauseChain(
    result: RouteExecutionResult,
    verbose: boolean,
    depth = 0,
    unknownErrorKey?: TranslatedKeyType,
  ): string {
    if (!result.cause || depth > 10) {
      // Prevent infinite recursion (increased limit for deep error chains)
      return "";
    }

    const indent = "  ".repeat(depth + 1);
    let output = "";

    // Format cause error message - TranslatedKeyType is already the translated string
    const causeMessage: string = result.cause.message || unknownErrorKey || "";

    // Show error type in verbose mode or for root cause
    const errorTypeInfo =
      verbose || !result.cause.cause
        ? ` [${result.cause.errorType.errorKey}]`
        : "";

    // eslint-disable-next-line i18next/no-literal-string
    output += `\n\n${indent}↳ Caused by${errorTypeInfo}: ${causeMessage}`;

    // Add cause error params - ErrorResponseType uses 'messageParams' field
    if (
      result.cause.messageParams &&
      Object.keys(result.cause.messageParams).length > 0
    ) {
      for (const [key, value] of Object.entries(result.cause.messageParams)) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `\n${indent}  • ${key}: ${value}`;
      }
    }

    // Recursively format nested causes
    if (result.cause.cause) {
      // Create a temporary RouteExecutionResult to continue recursion
      const nestedResult: RouteExecutionResult = {
        success: false,
        cause: result.cause.cause,
      };
      output += this.formatErrorCauseChain(
        nestedResult,
        verbose,
        depth + 1,
        unknownErrorKey,
      );
    }

    return output;
  }
}
