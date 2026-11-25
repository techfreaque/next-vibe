/**
 * Lead Funnel Stage - Repository
 * Server-only. Same cohort rules as the Leads funnel report: a lead belongs to
 * the bucket it was created in, stages after "all leads" skip known bots and
 * count people (one account once), not lead rows.
 */

import "server-only";

import { sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { stepCounts, type StepRow } from "@/leads/analytics/funnel/repository";
import { leadFactsSql } from "@/leads/analytics/segment-sql";

import { LeadFunnelStage, type LeadFunnelStageValue } from "./enum";

type BucketRow = QueryResultRow & StepRow & { bucket: string };

const STAGE_COLUMN: Record<typeof LeadFunnelStageValue, keyof StepRow> = {
  [LeadFunnelStage.LEADS]: "leads",
  [LeadFunnelStage.HUMANS]: "humans",
  [LeadFunnelStage.FIRST_CHATS]: "firstChats",
  [LeadFunnelStage.SIGNUPS]: "signups",
  [LeadFunnelStage.EMAIL_CONFIRMED]: "emailConfirmed",
  [LeadFunnelStage.PAYERS]: "payers",
};

/**
 * A graph asks once per stage node with the same range. All stages come from
 * one scan, so concurrent/consecutive nodes share it for a few seconds.
 */
const SHARE_MS = 15_000;
const shared = new Map<string, { at: number; rows: Promise<BucketRow[]> }>();

function stageRows(
  resolution: Resolution,
  range: TimeRange,
): Promise<BucketRow[]> {
  const key = `${resolution}|${range.from.toISOString()}|${range.to.toISOString()}`;
  const now = Date.now();
  for (const [k, entry] of shared) {
    if (now - entry.at > SHARE_MS) {
      shared.delete(k);
    }
  }
  const hit = shared.get(key);
  if (hit) {
    return hit.rows;
  }
  const rows = db
    .execute<BucketRow>(
      // MATERIALIZED: the bot-family regexes run once per lead instead of
      // once per stage FILTER (32 s -> 6 s for 300 days on prod).
      sql`WITH s AS MATERIALIZED (${leadFactsSql(
        sql`l.created_at >= ${utcSql(range.from)} AND l.created_at <= ${utcSql(range.to)}`,
      )})
        SELECT f.bucket, ${stepCounts(sql`f.`)}
        FROM (
          SELECT ${resolutionBucketExpr(resolution, sql`s.created_at`)} AS bucket, s.*
          FROM s
        ) f
        GROUP BY 1 ORDER BY 1`,
    )
    .then((result) => result.rows);
  // A failed scan must not be served to the next caller.
  rows.catch(() => shared.delete(key));
  shared.set(key, { at: now, rows });
  return rows;
}

export class LeadFunnelStageRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    stage: typeof LeadFunnelStageValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const column = STAGE_COLUMN[data.stage];
    const rows = await stageRows(resolution, range);
    const raw = rows.map((row): DataPoint => ({
      timestamp: new Date(row.bucket),
      value: Number(row[column]),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
