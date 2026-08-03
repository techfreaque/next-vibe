/**
 * CLI Error Formatter
 * Static class for formatting errors and error chains
 */

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { TranslatedKeyType } from "../../../../core/i18n/core/scoped-translation";
import { ErrorResponseTypes } from "../../../../core/route/response.schema";
import { scopedTranslation as cliScopedTranslation } from "../../../../platforms/cli/i18n";
import type { RouteExecutionResult } from "../../../../platforms/cli/runtime/route-executor";

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
    const { t: cliT } = cliScopedTranslation.scopedT(locale);

    // Keyed off the error type, not the message text. Validation errors arrive
    // fully formatted (bullets + example command) from validateData, so there is
    // nothing left to reconstruct here - only the prefix differs.
    const isValidationError =
      result.errorType?.errorKey ===
      ErrorResponseTypes.VALIDATION_ERROR.errorKey;

    // TranslatedKeyType values are already translated strings at runtime
    let detailedError: string =
      result.error ?? cliT("vibe.errors.unknownError");

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
