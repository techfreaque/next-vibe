/**
 * Vibe Sense - Query Utilities
 *
 * Server-side helpers for data source query functions.
 * Used in repositories (server-only) - safe to import drizzle-orm here.
 */

import type { SQL, SQLWrapper } from "drizzle-orm";
import { sql } from "drizzle-orm";

import { GraphResolution } from "../enum";
import type { Resolution } from "./fields";

/**
 * Returns a Drizzle SQL expression that buckets a timestamp column by the
 * given resolution.
 *
 * - Calendar-aligned resolutions (1d, 1w, 1M) use date_trunc.
 * - Fixed-interval resolutions (1m, 3m, 5m, 15m, 30m, 1h, 4h) use date_bin
 *   anchored to 2000-01-01 UTC for stable, predictable bucketing.
 *
 * Usage:
 *   resolutionBucketExpr(resolution, table.createdAt).as("bucket")
 */
export function resolutionBucketExpr(
  resolution: Resolution,
  col: SQLWrapper,
): SQL<string> {
  switch (resolution) {
    case GraphResolution.ONE_MINUTE:
      return sql<string>`date_bin('1 minute', ${col}, '2000-01-01')`;
    case GraphResolution.THREE_MINUTES:
      return sql<string>`date_bin('3 minutes', ${col}, '2000-01-01')`;
    case GraphResolution.FIVE_MINUTES:
      return sql<string>`date_bin('5 minutes', ${col}, '2000-01-01')`;
    case GraphResolution.FIFTEEN_MINUTES:
      return sql<string>`date_bin('15 minutes', ${col}, '2000-01-01')`;
    case GraphResolution.THIRTY_MINUTES:
      return sql<string>`date_bin('30 minutes', ${col}, '2000-01-01')`;
    case GraphResolution.ONE_HOUR:
      return sql<string>`date_bin('1 hour', ${col}, '2000-01-01')`;
    case GraphResolution.FOUR_HOURS:
      return sql<string>`date_bin('4 hours', ${col}, '2000-01-01')`;
    case GraphResolution.ONE_DAY:
      return sql<string>`date_trunc('day', ${col})`;
    case GraphResolution.ONE_WEEK:
      return sql<string>`date_trunc('week', ${col})`;
    case GraphResolution.ONE_MONTH:
      return sql<string>`date_trunc('month', ${col})`;
  }
}
