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
]);
