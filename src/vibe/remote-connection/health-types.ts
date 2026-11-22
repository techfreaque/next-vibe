/**
 * Client-safe health vocabulary shared by the classifier (health-summary.ts)
 * and the list/ report schema.
 */

export const CONNECTION_ISSUES = [
  "reauthRequired",
  "inactive",
  "noToken",
  "accessDenied",
  "neverSynced",
  "staleSync",
  "transportDrift",
  "transportMismatch",
  "peerToolsStale",
] as const;
export type ConnectionIssue = (typeof CONNECTION_ISSUES)[number];

/** Event-driven peers can go quiet for days between successful syncs. */
export const STALE_SYNC_MS = 7 * 86_400_000;

export function getSyncHealthIssue(
  lastSyncMs: number | null,
  now = Date.now(),
): "neverSynced" | "staleSync" | null {
  if (lastSyncMs === null) {
    return "neverSynced";
  }
  return now - lastSyncMs >= STALE_SYNC_MS ? "staleSync" : null;
}

export const LOOP_LOCATIONS = ["target", "caller"] as const;
