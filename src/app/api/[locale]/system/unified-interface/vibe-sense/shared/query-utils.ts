/**
 * Vibe Sense — Query Utilities
 *
 * Server-only helpers for data source query functions.
 * Client+server safe — no DB imports.
 */

import { GraphResolution } from "../enum";
import type { Resolution } from "./fields";

/**
 * Maps a vibe-sense Resolution to a PostgreSQL date_trunc precision string.
 * Use in data source queries: date_trunc(resolutionToTrunc(resolution), col)
 */
export function resolutionToTrunc(resolution: Resolution): string {
  switch (resolution) {
    case GraphResolution.ONE_MINUTE:
    case GraphResolution.THREE_MINUTES:
    case GraphResolution.FIVE_MINUTES:
    case GraphResolution.FIFTEEN_MINUTES:
    case GraphResolution.THIRTY_MINUTES:
      return "minute";
    case GraphResolution.ONE_HOUR:
    case GraphResolution.FOUR_HOURS:
      return "hour";
    case GraphResolution.ONE_DAY:
      return "day";
    case GraphResolution.ONE_WEEK:
      return "week";
    case GraphResolution.ONE_MONTH:
      return "month";
  }
}
