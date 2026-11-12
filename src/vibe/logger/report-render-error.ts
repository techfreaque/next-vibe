/**
 * Report a React render crash caught by an error boundary (or a router
 * error component) to the error log, with the component stack and route.
 * Client-safe: no React, no server imports.
 */

import { claimErrorReport } from "./client-context";
import type { EndpointLogger, LoggerMetadata } from "./types";

export function reportRenderError({
  logger,
  boundary,
  error,
  componentStack,
  extra,
}: {
  logger: EndpointLogger;
  /** Which boundary caught it (root, widget, route, ...). */
  boundary: string;
  error: Error;
  componentStack?: string | null;
  extra?: Record<string, LoggerMetadata>;
}): void {
  if (!claimErrorReport(error)) {
    return;
  }
  const digest =
    "digest" in error && typeof error.digest === "string" ? error.digest : null;
  logger.error(`React render error (${boundary}): ${error.message}`, error, {
    boundary,
    digest,
    componentStack: componentStack ? componentStack.slice(0, 2000) : null,
    ...extra,
  });
}
