/**
 * Production-ready error handling for Vibe CLI
 */

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../shared/types/node.d.ts" />

import type { EndpointLogger } from "../shared/logger/endpoint";

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
export abstract class CliError extends Error {
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
 * Command not found error
 */
export class CommandNotFoundError extends CliError {
  readonly code = "COMMAND_NOT_FOUND";
  readonly statusCode = 404;

  constructor(command: string, availableCommands?: string[]) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Command '${command}' not found`;
    super(message, { command, availableCommands });
  }

  getUserMessage(): string {
    // Type guard for availableCommands
    const commands = this.context?.availableCommands;
    const isStringArray =
      Array.isArray(commands) &&
      commands.every((cmd) => typeof cmd === "string");

    /* eslint-disable i18next/no-literal-string */
    const suggestions = isStringArray
      ? `\n\nAvailable commands:\n${commands
          .slice(0, 10)
          .map((cmd) => `  - ${cmd}`)
          .join("\n")}`
      : "";

    return `❌ ${this.message}${suggestions}`;
    /* eslint-enable i18next/no-literal-string */
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
 * Validation error
 */
export class ValidationError extends CliError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  constructor(
    field: string,
    value: string | number | boolean | undefined,
    expectedType: string,
    details?: string,
  ) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Validation failed for field '${field}': expected ${expectedType}, got ${typeof value}`;
    super(message, { field, value, expectedType, details });
  }

  getUserMessage(): string {
    const field = this.getContextString("field");
    const expectedType = this.getContextString("expectedType");
    const detailsValue = this.getContextString("details", "");
    // eslint-disable-next-line i18next/no-literal-string
    const details = detailsValue ? ` (${detailsValue})` : "";
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Invalid input for '${field}': expected ${expectedType}${details}`;
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends CliError {
  readonly code = "CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(configKey: string, issue: string, context?: ErrorContext) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Configuration error for '${configKey}': ${issue}`;
    super(message, { configKey, issue, ...context });
  }

  getUserMessage(): string {
    const issue = this.getContextString("issue");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Configuration error: ${issue}`;
  }
}

/**
 * Route discovery error
 */
export class RouteDiscoveryError extends CliError {
  readonly code = "ROUTE_DISCOVERY_ERROR";
  readonly statusCode = 500;

  constructor(directory: string, originalError: Error) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Failed to discover routes in '${directory}': ${originalError.message}`;
    super(message, { directory, originalError: originalError.message });
  }

  getUserMessage(): string {
    const directory = this.getContextString("directory");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Failed to discover routes in: ${directory}`;
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends CliError {
  readonly code = "TIMEOUT_ERROR";
  readonly statusCode = 408;

  constructor(operation: string, timeout: number) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Operation '${operation}' timed out after ${timeout}ms`;
    super(message, { operation, timeout });
  }

  getUserMessage(): string {
    const operation = this.getContextString("operation");
    const timeout = this.getContextString("timeout");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Operation timed out: ${operation} (${timeout}ms)`;
  }
}

/**
 * Permission error
 */
export class PermissionError extends CliError {
  readonly code = "PERMISSION_ERROR";
  readonly statusCode = 403;

  constructor(resource: string, action: string, context?: ErrorContext) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `Permission denied: cannot ${action} ${resource}`;
    super(message, { resource, action, ...context });
  }

  getUserMessage(): string {
    const action = this.getContextString("action");
    const resource = this.getContextString("resource");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ Permission denied: cannot ${action} ${resource}`;
  }
}

/**
 * Resource not found error
 */
export class ResourceNotFoundError extends CliError {
  readonly code = "RESOURCE_NOT_FOUND";
  readonly statusCode = 404;

  constructor(
    resourceType: string,
    identifier: string,
    context?: ErrorContext,
  ) {
    // eslint-disable-next-line i18next/no-literal-string
    const message = `${resourceType} '${identifier}' not found`;
    super(message, { resourceType, identifier, ...context });
  }

  getUserMessage(): string {
    // eslint-disable-next-line i18next/no-literal-string
    const resourceType = this.getContextString("resourceType", "Resource");
    const identifier = this.getContextString("identifier");
    // eslint-disable-next-line i18next/no-literal-string
    return `❌ ${resourceType} not found: ${identifier}`;
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

  /**
   * Create error from unknown value
   */
  export function createError(
    error: UnknownError,
    context?: ErrorContext,
  ): CliError {
    if (error instanceof CliError) {
      return error;
    }

    if (error instanceof Error) {
      return new RouteExecutionError("unknown", error, context);
    }

    return new RouteExecutionError(
      "unknown",
      new Error(errorToString(error)),
      context,
    );
  }

  /**
   * Wrap async function with error handling
   */
  export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: ErrorContext,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Infrastructure code requires throwing for system-level errors and initialization failures
      throw createError(error as UnknownError, context);
    }
  }

  /**
   * Check if error is recoverable
   */
  export function isRecoverable(error: CliError): boolean {
    const recoverableCodes = [
      "VALIDATION_ERROR",
      "COMMAND_NOT_FOUND",
      "RESOURCE_NOT_FOUND",
    ];

    return recoverableCodes.includes(error.code);
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
