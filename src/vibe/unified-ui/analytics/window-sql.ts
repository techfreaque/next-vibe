/**
 * Server-only SQL helpers for analytics windows (Drizzle / Postgres).
 */

import { type AnyColumn, type SQL, sql } from "drizzle-orm";

import type { AnalyticsBucket } from "./enum";
import type { AnalyticsWindow } from "./window";

/** `YYYY-MM-DD` key of the UTC bucket containing `column` (matches window.ts). */
export function bucketSql(
  column: AnyColumn | SQL,
  bucket: AnalyticsBucket,
): SQL<string> {
  return sql<string>`to_char(date_trunc(${sql.raw(`'${bucket}'`)}, (${column}) AT TIME ZONE 'UTC'), 'YYYY-MM-DD')`;
}

/**
 * UTC instant as a naive UTC timestamp literal. Passing a JS Date lets
 * node-postgres send a local-offset string, which Postgres truncates for
 * `timestamp without time zone` columns (the window shifts by the host TZ).
 */
export function utcSql(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz AT TIME ZONE 'UTC')`;
}

/** `column` inside [win.from, win.to). */
export function inWindowSql(
  column: AnyColumn | SQL,
  win: Pick<AnalyticsWindow, "from" | "to">,
): SQL {
  return sql`(${column}) >= ${utcSql(win.from)} AND (${column}) < ${utcSql(win.to)}`;
}

/** `column` inside the previous window; FALSE when there is none (all-time). */
export function inPreviousWindowSql(
  column: AnyColumn | SQL,
  win: Pick<AnalyticsWindow, "previousFrom" | "previousTo">,
): SQL {
  if (!win.previousFrom || !win.previousTo) {
    return sql`FALSE`;
  }
  return sql`(${column}) >= ${utcSql(win.previousFrom)} AND (${column}) < ${utcSql(win.previousTo)}`;
}
