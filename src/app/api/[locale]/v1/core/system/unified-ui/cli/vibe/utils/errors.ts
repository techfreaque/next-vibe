/**
 * Production-ready error handling for Vibe CLI
 */

import type { EndpointLogger } from "../endpoints/endpoint-handler/logger";

/**
 * Base CLI error class
 */
export abstract class CliError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly timestamp: Date;
  readonly context?: Record<string, any>;

  constructor(message: string, context?: Record<string, any>) {
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
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, any> {
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
    const message = `Command '${command}' not found`;
    super(message, { command, availableCommands });
  }

  getUserMessage(): string {
    const suggestions = this.context?.availableCommands
      ? `\n\nAvailable commands:\n${this.context.availableCommands
          .slice(0, 10)
          .map((cmd: string) => `  - ${cmd}`)
          .join("\n")}`
      : "";

    return `❌ ${this.message}${suggestions}`;
  }
}

/**
 * Route execution error
 */
export class RouteExecutionError extends CliError {
  readonly code = "ROUTE_EXECUTION_ERROR";
  readonly statusCode = 500;

  constructor(
    route: string,
    originalError: Error,
    context?: Record<string, any>,
  ) {
    const message = `Failed to execute route '${route}': ${originalError.message}`;
    super(message, { route, originalError: originalError.message, ...context });

    // Preserve original stack trace
    if (originalError.stack) {
      this.stack = originalError.stack;
    }
  }

  getUserMessage(): string {
    return `❌ Route execution failed: ${this.context?.route}\n   ${this.context?.originalError}`;
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
    value: any,
    expectedType: string,
    details?: string,
  ) {
    const message = `Validation failed for field '${field}': expected ${expectedType}, got ${typeof value}`;
    super(message, { field, value, expectedType, details });
  }

  getUserMessage(): string {
    const details = this.context?.details ? ` (${this.context.details})` : "";
    return `❌ Invalid input for '${this.context?.field}': expected ${this.context?.expectedType}${details}`;
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends CliError {
  readonly code = "CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(configKey: string, issue: string, context?: Record<string, any>) {
    const message = `Configuration error for '${configKey}': ${issue}`;
    super(message, { configKey, issue, ...context });
  }

  getUserMessage(): string {
    return `❌ Configuration error: ${this.context?.issue}`;
  }
}

/**
 * Route discovery error
 */
export class RouteDiscoveryError extends CliError {
  readonly code = "ROUTE_DISCOVERY_ERROR";
  readonly statusCode = 500;

  constructor(directory: string, originalError: Error) {
    const message = `Failed to discover routes in '${directory}': ${originalError.message}`;
    super(message, { directory, originalError: originalError.message });
  }

  getUserMessage(): string {
    return `❌ Failed to discover routes in: ${this.context?.directory}`;
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends CliError {
  readonly code = "TIMEOUT_ERROR";
  readonly statusCode = 408;

  constructor(operation: string, timeout: number) {
    const message = `Operation '${operation}' timed out after ${timeout}ms`;
    super(message, { operation, timeout });
  }

  getUserMessage(): string {
    return `❌ Operation timed out: ${this.context?.operation} (${this.context?.timeout}ms)`;
  }
}

/**
 * Permission error
 */
export class PermissionError extends CliError {
  readonly code = "PERMISSION_ERROR";
  readonly statusCode = 403;

  constructor(resource: string, action: string, context?: Record<string, any>) {
    const message = `Permission denied: cannot ${action} ${resource}`;
    super(message, { resource, action, ...context });
  }

  getUserMessage(): string {
    return `❌ Permission denied: cannot ${this.context?.action} ${this.context?.resource}`;
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
    context?: Record<string, any>,
  ) {
    const message = `${resourceType} '${identifier}' not found`;
    super(message, { resourceType, identifier, ...context });
  }

  getUserMessage(): string {
    return `❌ ${this.context?.resourceType} not found: ${this.context?.identifier}`;
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  /**
   * Handle and format error for CLI output
   */
  static handleError(
    error: unknown,
    logger: EndpointLogger,
  ): {
    message: string;
    exitCode: number;
    shouldExit: boolean;
  } {
    if (error instanceof CliError) {
      return {
        message: logger.isDebugEnabled
          ? this.formatVerboseError(error)
          : error.getUserMessage(),
        exitCode: this.getExitCode(error.statusCode),
        shouldExit: true,
      };
    }

    if (error instanceof Error) {
      const cliError = new RouteExecutionError("unknown", error);
      return {
        message: logger.isDebugEnabled
          ? this.formatVerboseError(cliError)
          : cliError.getUserMessage(),
        exitCode: 1,
        shouldExit: true,
      };
    }

    // Unknown error type
    const message = `❌ Unknown error: ${String(error)}`;
    return {
      message: logger.isDebugEnabled
        ? `${message}\n${JSON.stringify(error, null, 2)}`
        : message,
      exitCode: 1,
      shouldExit: true,
    };
  }

  /**
   * Format error with full details for verbose output
   */
  private static formatVerboseError(error: CliError): string {
    let output = `❌ ${error.name}: ${error.message}\n`;
    output += `   Code: ${error.code}\n`;
    output += `   Status: ${error.statusCode}\n`;
    output += `   Time: ${error.timestamp.toISOString()}\n`;

    if (error.context && Object.keys(error.context).length > 0) {
      output += `   Context: ${JSON.stringify(error.context, null, 4)}\n`;
    }

    if (error.stack) {
      output += `   Stack Trace:\n${error.stack}`;
    }

    return output;
  }

  /**
   * Convert HTTP status code to process exit code
   */
  private static getExitCode(statusCode: number): number {
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
  static createError(error: unknown, context?: Record<string, any>): CliError {
    if (error instanceof CliError) {
      return error;
    }

    if (error instanceof Error) {
      return new RouteExecutionError("unknown", error, context);
    }

    return new RouteExecutionError(
      "unknown",
      new Error(String(error)),
      context,
    );
  }

  /**
   * Wrap async function with error handling
   */
  static async withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: Record<string, any>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw this.createError(error, context);
    }
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: CliError): boolean {
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
  process.on("uncaughtException", (error) => {
    const handled = ErrorHandler.handleError(error, logger);
    logger.error(handled.message);
    process.exit(handled.exitCode);
  });

  process.on("unhandledRejection", (reason) => {
    const handled = ErrorHandler.handleError(reason, logger);
    logger.error(handled.message);
    process.exit(handled.exitCode);
  });
}
