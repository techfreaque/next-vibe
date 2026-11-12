/**
 * Logger decorator that stamps a fixed context record (request id, ...) onto
 * every log call, so each row a request produces can be correlated without
 * every call site repeating it. Debug/info lines get it too.
 */

import type { EndpointLogger, LoggerMetadata } from "./types";

export function withLogContext(
  logger: EndpointLogger,
  context: Record<string, string | number | boolean | null>,
): EndpointLogger {
  return {
    info(message: string, ...metadata: LoggerMetadata[]): void {
      logger.info(message, ...metadata, context);
    },
    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      logger.error(message, error, ...metadata, context);
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      logger.warn(message, ...metadata, context);
    },
    vibe(message: string, ...metadata: LoggerMetadata[]): void {
      logger.vibe(message, ...metadata, context);
    },
    debug(message: string, ...metadata: LoggerMetadata[]): void {
      logger.debug(message, ...metadata, context);
    },
    isDebugEnabled: logger.isDebugEnabled,
  };
}

/**
 * Correlation id for one client call. crypto.randomUUID only exists in
 * secure contexts (https / localhost) - plain-http LAN access and some
 * native runtimes lack it, so fall back to a random token there.
 */
function randomToken(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function mintRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `r${Date.now().toString(36)}-${randomToken()}${randomToken()}`;
}
