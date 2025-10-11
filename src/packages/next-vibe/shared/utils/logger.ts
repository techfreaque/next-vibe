/* eslint-disable i18next/no-literal-string */
/* eslint-disable no-console */
// not using env-client because of circular dependency
/* eslint-disable no-restricted-syntax */
/* eslint-disable node/no-process-env */

import { debugApp, debugLibrary } from "../../../../config/debug";
import { Environment } from "./env-util";
import { parseError } from "./parse-error";

/**
 * Use domain loggers instead passed through logger prop of route
 * @deprecated
 */
export function debugLogger(message: string, ...other: unknown[]): void {
  if (
    (process.env.NODE_ENV !== Environment.PRODUCTION && debugApp) ||
    (process.env.NEXT_PUBLIC_DEBUG_PRODUCTION &&
      process.env.NODE_ENV === Environment.PRODUCTION)
  ) {
    console.log(`[vibe][DEBUG] ${message}`, ...other);
  }
}

/**
 * Use domain loggers instead passed through logger prop of route
 * @deprecated
 */
export function libDebugLogger(message: string, ...other: unknown[]): void {
  if (
    (process.env.NODE_ENV !== Environment.PRODUCTION && debugLibrary) ||
    (process.env.NEXT_PUBLIC_DEBUG_PRODUCTION &&
      process.env.NODE_ENV === Environment.PRODUCTION)
  ) {
    console.log(`[vibe][DEBUG] ${message}`, ...other);
  }
}
/**
 * Use domain loggers instead passed through logger prop of route
 * @deprecated
 */
export function libWarnLogger(message: string, ...other: unknown[]): void {
  if (
    process.env.NODE_ENV !== Environment.PRODUCTION ||
    process.env.NEXT_PUBLIC_DEBUG_PRODUCTION
  ) {
    console.warn(`[vibe][WARN] ${message}`, ...other);
  }
}
/**
 * Use domain loggers instead passed through logger prop of route
 * @deprecated
 */
export function infoLogger(message: string, ...other: unknown[]): void {
  if (
    process.env.NODE_ENV !== Environment.PRODUCTION ||
    process.env.NEXT_PUBLIC_DEBUG_PRODUCTION
  ) {
    console.log(`[vibe][INFO] ${message}`, ...other);
  }
}
/**
 * Use domain loggers instead passed through logger prop of route
 * @deprecated
 */
export function errorLogger(
  message: string,
  error?: unknown,
  ...other: unknown[]
): void {
  const typedError = parseError(error);
  if (process.env.NODE_ENV !== Environment.PRODUCTION) {
    console.error(`[vibe][ERROR] ${message}`, typedError, ...other);
  } else {
    // TODO send to sentry like
    console.error(`[vibe][ERROR] ${message}`, typedError, ...other);
  }
}
