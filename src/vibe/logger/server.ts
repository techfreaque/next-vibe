/**
 * Server-side Logger
 * Wraps logger-core and injects file logging + DB persistence.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

import { hostname } from "node:os";

import type { CountryLanguage } from "../core/i18n/core/config";
import { createLogger } from "./create-logger";
import { persistErrorLog } from "./db-persist";
import { serverFileLog } from "./file";
import { resolveLogTarget } from "./log-target";
import type { EndpointLogger } from "./types";

/** Per-request context stamped on every persisted/file log row. */
export interface ServerLogContext {
  /** Correlation id from the client's x-request-id header (or minted here). */
  requestId: string;
}

/**
 * Per-request metadata keys that must not split one recurring server error
 * into one error_logs row per request (the row still stores the latest).
 */
export const SERVER_LOG_FINGERPRINT_IGNORE_KEYS: ReadonlySet<string> = new Set([
  "requestId",
  "node",
  // Per-occurrence measurements and snapshots. Each value is unique, so in
  // the fingerprint they turned every "[EventLoop] Elevated lag" and every
  // boot-time "[Proxy] Server not ready" into its own row (2026-11-15: ~45 of
  // 103 active rows). The row keeps the latest values; occurrences count up.
  "uptime",
  "maxMs",
  "meanMs",
  "stallMs",
  "stallStartedAt",
  "heapMb",
  "heapUsedMb",
  "prevHeapMb",
  "rssMb",
  "recentRequests",
  "taskTimings",
  "wsActivity",
  "recent",
  "elapsedMs",
  "durationMs",
  "lastUpstreamOkMsAgo",
  "cpuUserMs",
  "cpuSystemMs",
  "loadAvg1m",
  // Per-request usage figures ("[AI Stream] Upstream cost missing for cut-off
  // step"): one row per model + abort reason, not one per stopped message.
  "messageId",
  "promptTokens",
  "completionTokens",
  "imageOutputTokens",
  "modelCreditCost",
]);

/**
 * Which box/container wrote the row. Two app nodes (S1, S2) share one
 * error_logs table; without this a row could not be attributed to the node
 * that served the request (2026-11-13: a burst of stream 400s with no
 * server-side trace). Outside the fingerprint, so both nodes share one row.
 */
const SERVER_NODE = ((): string => {
  try {
    return hostname();
  } catch {
    return "unknown";
  }
})();

export function createEndpointLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  context?: ServerLogContext,
): EndpointLogger {
  // Read at call time so loadEnvironment() has already set VIBE_LOG_TARGET.
  // Never raw process.env: it stays unset in a process that has not loaded
  // logger/env.ts yet, which silently disabled DB persistence (log-target.ts).
  const persistToDb = resolveLogTarget() === "db";
  const requestId = context?.requestId;
  return createLogger(
    debugEnabled,
    locale,
    persistToDb
      ? (level, message, error, metadata, loc) => {
          persistErrorLog(
            level,
            message,
            error,
            requestId
              ? [...metadata, { requestId, node: SERVER_NODE }]
              : [...metadata, { node: SERVER_NODE }],
            loc,
            { fingerprintIgnoreKeys: SERVER_LOG_FINGERPRINT_IGNORE_KEYS },
          );
        }
      : undefined,
    requestId
      ? (message, data): void =>
          serverFileLog(message, data ? { ...data, requestId } : { requestId })
      : serverFileLog,
  );
}
