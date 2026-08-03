/**
 * Cross-instance sync domains.
 *
 * Lives in realtime/core — NOT in remote-connection/db — because every event
 * declaration may tag itself with a `syncDomain`, and `structured-events.ts` is
 * the one module a CLI/MCP-only install must be able to import. Sourcing the
 * type from `remote-connection/db` dragged drizzle (and therefore a database)
 * into that install for what is a five-element string union.
 *
 * Every consumer imports from here directly — `remote-connection/db` keeps only
 * the syncScope schema and the `isSyncDomainEnabled` gate that reads it.
 */

/**
 * The complete set of cross-instance sync domains. Each has a syncScope toggle on
 * the connection and a SyncProvider. An event's `syncDomain` must be one of these
 * — a non-existent domain (one without settings) is a compile error.
 */
export const SYNC_DOMAINS = [
  "memories",
  "documents",
  "skills",
  "favorites",
  "threads",
] as const;

export type SyncDomain = (typeof SYNC_DOMAINS)[number];
