/**
 * Credits Active Spenders - Repository
 * Server-only. DB access.
 *
 * Distinct people who used AI (at least one USAGE debit, signup carryover
 * excluded) per bucket. Covers incognito chats, which chat_messages never
 * stores. Same spender attribution as credits-spent-by-source:
 * - signed in: the wallet's user, or the user the spending lead
 *   (metadata.actorLeadId, else the wallet lead) was linked to at the time;
 *   admin accounts excluded;
 * - guest: the spending lead when it had no account at the time; leads whose
 *   user agent is a known bot are excluded (lead analytics bot rule).
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
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
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { QueryResultRow } from "pg";

import {
  botFamilySql,
  leadUserAgentSql,
  notBotFamilySql,
} from "@/leads/analytics/bot-sql";

import { CreditTransactionType } from "../../enum";
import { notSignupCarryoverRaw } from "../../usage-filter";
import { SpenderKind, type SpenderKindValue } from "./enum";

/** Timestamp literal comparable with UTC timestamp-without-time-zone columns. */
function ts(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz AT TIME ZONE 'UTC')`;
}

export class QueryCreditsActiveSpendersRepository {
  static async queryCreditsActiveSpenders(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    who: typeof SpenderKindValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback, who } = data;
    const counted =
      who === SpenderKind.SIGNED_IN
        ? sql`count(DISTINCT b.spender) FILTER (WHERE b.spender IS NOT NULL
            AND b.spender NOT IN (SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN}))`
        : sql`count(DISTINCT b.actor) FILTER (WHERE b.spender IS NULL AND b.actor IS NOT NULL
            AND ${notBotFamilySql(botFamilySql(leadUserAgentSql("ld"), sql`false`))})`;

    const rows = await db.execute<
      QueryResultRow & { bucket: string; total: string | null }
    >(sql`
      WITH base AS MATERIALIZED (
        SELECT t.created_at AS at,
          COALESCE(actor.lead_id, w.lead_id) AS actor,
          COALESCE(w.user_id, link.user_id) AS spender
        FROM credit_transactions t
        JOIN credit_wallets w ON w.id = t.wallet_id
        LEFT JOIN LATERAL (
          SELECT CASE WHEN t.metadata->>'actorLeadId' ~ '^[0-9a-fA-F-]{36}$'
            THEN (t.metadata->>'actorLeadId')::uuid END AS lead_id
        ) actor ON true
        LEFT JOIN LATERAL (
          SELECT l.user_id FROM user_lead_links l
          WHERE w.user_id IS NULL
            AND l.lead_id = COALESCE(actor.lead_id, w.lead_id)
            AND l.linked_at <= t.created_at
          ORDER BY l.linked_at
          LIMIT 1
        ) link ON true
        WHERE t.type = ${CreditTransactionType.USAGE}
          AND t.amount < 0
          AND ${sql.raw(notSignupCarryoverRaw("t"))}
          AND t.created_at >= ${ts(range.from)}
          AND t.created_at <= ${ts(range.to)}
      )
      SELECT ${resolutionBucketExpr(resolution, sql`b.at`)} AS bucket,
        ${counted} AS total
      FROM base b
      LEFT JOIN leads ld ON ld.id = b.actor
      GROUP BY 1
      ORDER BY 1`);

    const raw = rows.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.total ?? 0),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
