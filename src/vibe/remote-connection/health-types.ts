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
  "transportDrift",
  "transportMismatch",
  "peerToolsStale",
] as const;
export type ConnectionIssue = (typeof CONNECTION_ISSUES)[number];

export const LOOP_LOCATIONS = ["target", "caller"] as const;
