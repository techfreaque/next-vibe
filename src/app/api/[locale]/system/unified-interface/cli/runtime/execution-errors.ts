/**
 * Production-ready error handling for Vibe CLI
 */

import type { EndpointLogger } from "../../shared/logger/endpoint";

/**
 * Error context type
 */
interface ErrorContext {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | undefined
    | Record<string, never>;
}

/**
 * Unknown error type for error handling
 */
type UnknownError = Error | CliError | Record<string, never>;

/**
 * Base CLI error class
 */
abstract class CliError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly timestamp: Date;
  readonly context?: ErrorContext;

  constructor(message: string, context?: ErrorContext) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Safely get a string value from context
   */
  protected getContextString(key: string, fallback = "unknown"): string {
    const value = this.context?.[key];
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return fallback;
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, string | number | ErrorContext | undefined> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.message;
  }
}

/**
 * Route execution error
 */
export class RouteExecutionError extends CliError {
  readonly code = "ROUTE_EXECUTION_ERROR";
  readonly statusCode = 500;

  constructor(route: string, originalError: Error, context?: ErrorContext) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Failed to execute route '${route}': ${originalError.message}`;
    super(message, { route, originalError: originalError.message, ...context });

    // Preserve original stack trace
    if (originalError.stack) {
      this.stack = originalError.stack;
    }
  }

  getUserMessage(): string {
    const route = this.getContextString("route");
    const error = this.getContextString("originalError");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Route execution failed: ${route}\n   ${error}`;
  }
}

/**
 * Error handler utility
 */
export namespace ErrorHandler {
  /**
   * Safely convert error to string
   */
  function errorToString(error: UnknownError): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    if (typeof error === "object" && error !== null) {
      return JSON.stringify(error);
    }
    return String(error);
  }

  /**
   * Handle and format error for CLI output
   */
  export function handleError(
    error: UnknownError,
    logger: EndpointLogger,
  ): {
    message: string;
    exitCode: number;
    shouldExit: boolean;
  } {
    if (error instanceof CliError) {
      return {
        message: logger.isDebugEnabled
          ? formatVerboseError(error)
          : error.getUserMessage(),
        exitCode: getExitCode(error.statusCode),
        shouldExit: true,
      };
    }

    if (error instanceof Error) {
      const cliError = new RouteExecutionError("unknown", error);
      return {
        message: logger.isDebugEnabled
          ? formatVerboseError(cliError)
          : cliError.getUserMessage(),
        exitCode: 1,
        shouldExit: true,
      };
    }

    // Unknown error type
    // eslint-disable-next-line i18next/no-literal-string
    const message = `❌ Unknown error: ${errorToString(error)}`;
    return {
      message: logger.isDebugEnabled
        ? // eslint-disable-next-line i18next/no-literal-string
          `${message}\n${JSON.stringify(error, null, 2)}`
        : message,
      exitCode: 1,
      shouldExit: true,
    };
  }

  /**
   * Format error with full details for verbose output
   */
  function formatVerboseError(error: CliError): string {
    // eslint-disable-next-line i18next/no-literal-string
    let output = `❌ ${error.name}: ${error.message}\n`;
    // eslint-disable-next-line i18next/no-literal-string
    output += `   Code: ${error.code}\n`;
    // eslint-disable-next-line i18next/no-literal-string
    output += `   Status: ${error.statusCode}\n`;
    // eslint-disable-next-line i18next/no-literal-string
    output += `   Time: ${error.timestamp.toISOString()}\n`;

    if (error.context && Object.keys(error.context).length > 0) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `   Context: ${JSON.stringify(error.context, null, 4)}\n`;
    }

    if (error.stack) {
      // eslint-disable-next-line i18next/no-literal-string
      output += `   Stack Trace:\n${error.stack}`;
    }

    return output;
  }

  /**
   * Convert HTTP status code to process exit code
   */
  function getExitCode(statusCode: number): number {
    if (statusCode >= 400 && statusCode < 500) {
      return 2; // Client error
    }
    if (statusCode >= 500) {
      return 3; // Server error
    }
    return 1; // General error
  }
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandlers(logger: EndpointLogger): void {
  process.on("uncaughtException", (error: Error): void => {
    const handled = ErrorHandler.handleError(error, logger);
    logger.error(handled.message);
    process.exit(handled.exitCode);
  });

  process.on(
    "unhandledRejection",
    (reason: Error | Record<string, never>): void => {
      const handled = ErrorHandler.handleError(reason, logger);
      logger.error(handled.message);
      process.exit(handled.exitCode);
    },
  );
}
