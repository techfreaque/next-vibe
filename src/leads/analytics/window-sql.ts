import "server-only";

/**
 * Window helpers for lead analytics: data floor for all-time windows and the
 * "which leads can matter for this window" pre-filter on the `l` alias.
 */
import { type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

/** Earliest lead creation (bounds all-time windows). */
export async function leadDataFloor(): Promise<Date | null> {
  const { rows } = await db.execute<QueryResultRow & { floor: string | null }>(
    sql`SELECT min(created_at)::text AS floor FROM leads`,
  );
  const floor = rows[0]?.floor;
  return floor ? new Date(`${floor.replace(" ", "T")}Z`) : null;
}

/**
 * Leads that can contribute to [previousFrom ?? from, to): created in it, or
 * old leads with a later visit, signup, chat or payment. Keeps the per-lead
 * classification off the long tail of idle historical leads.
 */
export function relevantLeadsCondition(win: AnalyticsWindow): SQL {
  const start = win.previousFrom ?? win.from;
  return sql`(
    l.created_at >= ${utcSql(start)}
    OR l.converted_user_id IS NOT NULL
    OR EXISTS (SELECT 1 FROM growth_journeys rj WHERE rj.lead_id = l.id
      AND (rj.user_id IS NOT NULL OR rj.first_chat_at >= ${utcSql(start)} OR rj.first_paid_at >= ${utcSql(start)}))
    OR EXISTS (SELECT 1 FROM growth_visits rv WHERE rv.lead_id = l.id AND rv.visited_at >= ${utcSql(start)})
    OR EXISTS (SELECT 1 FROM chat_threads rt WHERE rt.lead_id = l.id AND rt.created_at >= ${utcSql(start)})
  ) AND l.created_at < ${utcSql(win.to)}`;
}
