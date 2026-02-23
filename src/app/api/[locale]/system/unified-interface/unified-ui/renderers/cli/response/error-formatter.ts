/**
 * CLI Error Formatter
 * Static class for formatting errors and error chains
 */

import { scopedTranslation as cliScopedTranslation } from "@/app/api/[locale]/system/unified-interface/cli/i18n";
import type { RouteExecutionResult } from "@/app/api/[locale]/system/unified-interface/cli/runtime/route-executor";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

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
  ): string {
    const { t } = simpleT(locale);
    const { t: cliT } = cliScopedTranslation.scopedT(locale);

    let errorMessage = t(
      result.error ?? cliT("vibe.errors.unknownError", result.errorParams),
      result.errorParams,
    );

    let detailedError = errorMessage;

    // Always show error details from errorParams, even in non-verbose mode
    if (result.errorParams && Object.keys(result.errorParams).length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      detailedError += "\n\nDetails:";
      for (const [key, value] of Object.entries(result.errorParams)) {
        // eslint-disable-next-line i18next/no-literal-string
        detailedError += `\n  ${key}: ${value}`;
      }
    }

    const unknownErrorKey = cliT("vibe.errors.unknownError");

    // Handle error cause chain
    const causeChain = this.formatErrorCauseChain(
      result,
      t,
      verbose,
      0,
      unknownErrorKey,
    );
    if (causeChain) {
      detailedError += causeChain;
    }

    if (verbose) {
      // eslint-disable-next-line i18next/no-literal-string
      return `❌ Error: ${detailedError}\n\nFull Response:\n${JSON.stringify(result, null, 2)}`;
    }
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Error: ${detailedError}`;
  }

  /**
   * Format error cause chain recursively
   */
  private static formatErrorCauseChain(
    result: RouteExecutionResult,
    t: TFunction,
    verbose: boolean,
    depth = 0,
    unknownErrorKey?: TranslationKey,
  ): string {
    if (!result.cause || depth > 10) {
      // Prevent infinite recursion (increased limit for deep error chains)
      return "";
    }

    const indent = "  ".repeat(depth + 1);
    let output = "";

    // Format cause error message - ErrorResponseType uses 'message' field
    const causeTranslationKey: TranslationKey =
      result.cause.message || unknownErrorKey!;

    const causeMessage = t(causeTranslationKey, result.cause.messageParams);

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
        t,
        verbose,
        depth + 1,
        unknownErrorKey,
      );
    }

    return output;
  }
}
