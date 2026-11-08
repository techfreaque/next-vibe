export const DB_HEALTH_ALIAS = "db-health" as const;

/**
 * Health thresholds (tuned for a 16 GB server).
 * DB: "warn" = slow but alive (task still succeeds, warning is logged);
 * "critical" = alive but stalled (task fails). An unreachable DB always fails.
 * A cold PGlite routinely takes ~1s, so warn starts at 2s.
 */
export const DB_HEALTH_THRESHOLDS = {
  memWarnPct: 75,
  memCriticalPct: 90,
  diskWarnPct: 80,
  diskCriticalPct: 95,
  dbWarnMs: 2000,
  dbCriticalMs: 10000,
} as const;
