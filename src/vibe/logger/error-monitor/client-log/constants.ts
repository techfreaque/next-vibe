export const CLIENT_LOG_PATH = [
  "vibe",
  "logger",
  "error-monitor",
  "client-log",
];

/** Metadata key the client logger uses to flush a deduplicated occurrence count. */
export const CLIENT_LOG_OCCURRENCES_KEY = "occurrences";

/**
 * Per-occurrence client metadata that must not split one error into many
 * error_logs rows (fingerprint ignores them; the row still stores them).
 * Includes the per-user ids the server stamps on, so one bug hitting many
 * users is one row with a high occurrence count.
 */
export const CLIENT_LOG_FINGERPRINT_IGNORE_KEYS: ReadonlySet<string> = new Set([
  "tabId",
  // Per-call correlation id (matches the server rows of that request)
  "requestId",
  CLIENT_LOG_OCCURRENCES_KEY,
  "dedupWindowMs",
  "userAgent",
  "viewport",
  "online",
  "visibility",
  "pageTranslated",
  "userId",
  "leadId",
  "userRoles",
  "isPublic",
  "errorStack",
  "componentStack",
  "callerStack",
  "stack",
  // Per-occurrence measurements. Each value is unique, so keeping them in the
  // fingerprint turned one failure into one row per occurrence (586 rows for a
  // single stuck unread-count poll on 2026-11-13). The latest value is still
  // stored on the row; occurrences are counted instead of split.
  "durationMs",
  "offlineMs",
  "elapsedMs",
  "ageMs",
  "valueLength",
  "audioDataLength",
  "connectedForMs",
  "sinceLastFrameMs",
  "transferSize",
  "requestBodySize",
]);
