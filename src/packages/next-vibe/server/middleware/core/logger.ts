/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
/* eslint-disable node/no-process-env */

import { Environment } from "next-vibe/shared/utils";

import { debugMiddleware } from "../../../../../config/debug";

export function middlewareInfoLogger(
  message: string,
  ...args: MiddlewareLoggableValue[]
): void {
  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    return;
  }
  console.log(`[Middleware][INFO] ${message}`, ...args);
}

/**
 * Loggable value types for middleware operations
 */
// eslint-disable-next-line no-restricted-syntax
type MiddlewareLoggableValue = unknown;

export function middlewareDebugLogger(
  message: string,
  ...args: MiddlewareLoggableValue[]
): void {
  if (process.env.NODE_ENV === Environment.PRODUCTION || !debugMiddleware) {
    return;
  }
  console.log(`[Middleware][DEBUG] ${message}`, ...args);
}

export function middlewareErrorLogger(
  message: string,
  error?: MiddlewareLoggableValue,
): void {
  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    // TODO: send to sentry like
    return;
  }
  console.error(`[Middleware][ERROR] ${message}`, error || "");
}
