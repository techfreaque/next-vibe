/**
 * Credits Spent By Source - Repository
 * Server-only. DB access.
 *
 * Usage = credit_transactions of type USAGE (amount < 0), minus signup
 * carryover rows (same rows as credits-spent-total, so the sources add up to
 * it). Each row lands in exactly one source:
 * - INTERNAL: the spender (wallet user, or the user the spending lead was
 *   linked to at the time) is an admin account. Any funding.
 * - PUBLIC: free credits (allowance / signup + newsletter bonus) spent by a
 *   lead not linked to an account at the time of the spend.
 * - USERS_FREE: free credits spent by a signed-in account, plus referral
 *   credits (earned packs, referral bonus grants).
 * - PAID: subscription credits and purchased packs.
 * - GIFTED: admin-granted bonus packs (tester / creator grants, goodwill
 *   compensation; admin-add records no reason, so they stay one series).
 * - UNATTRIBUTED: historic pack debits whose pack bucket could not be derived.
 * Funding comes from credit_transactions.funding_type, stamped at write time
 * by the deduction walk since 2026-11-22; older rows were backfilled by the
 * 20261121232835 and 20261125151752 migrations. Rows without a stamp fall
 * back to the pack join.
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
  CreditFundingType,
  type CreditFundingTypeDBValue,
  CreditPackType,
  CreditTransactionType,
} from "../../enum";
import { notSignupCarryoverRaw } from "../../usage-filter";
import type { UsageSourceValue } from "./enum";
import { UsageSource } from "./enum";

const FREE_FUNDING: readonly CreditFundingTypeDBValue[] = [
  CreditFundingType.FREE_ALLOWANCE,
  CreditFundingType.FREE_BONUS,
  CreditFundingType.FREE_UNKNOWN,
];

function list(values: readonly CreditFundingTypeDBValue[]): SQL {
  return sql.join(
    values.map((value) => sql`${value}`),
    sql`, `,
  );
}

/** Timestamp literal comparable with UTC timestamp-without-time-zone columns. */
function ts(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz AT TIME ZONE 'UTC')`;
}

/** SQL CASE mapping a classified usage row (alias b) to its UsageSource. */
export function usageSourceSql(): SQL {
  return sql`CASE
    WHEN b.internal THEN ${UsageSource.INTERNAL}
    WHEN b.bucket IN (${list(FREE_FUNDING)}) AND b.spender IS NULL THEN ${UsageSource.PUBLIC}
    WHEN b.bucket IN (${list([...FREE_FUNDING, CreditFundingType.REFERRAL])}) THEN ${UsageSource.USERS_FREE}
    WHEN b.bucket IN (${list([CreditFundingType.PURCHASED, CreditFundingType.SUBSCRIPTION])}) THEN ${UsageSource.PAID}
    WHEN b.bucket = ${CreditFundingType.ADMIN_GRANT} THEN ${UsageSource.GIFTED}
    ELSE ${UsageSource.UNATTRIBUTED} END`;
}

/**
 * `WITH base AS (...)`: one row per real usage debit in [from, to] with its
 * credits, funding bucket, spender user id (null for guests) and internal flag.
 */
export function usageSourceBaseCte(range: TimeRange): SQL {
  return sql`
    WITH base AS (
      SELECT
        t.created_at AS at,
        (-t.amount)::numeric AS credits,
        fund.bucket,
        COALESCE(w.user_id, link.user_id) AS spender,
        COALESCE(COALESCE(w.user_id, link.user_id) IN (
          SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN}
        ), false) AS internal
      FROM credit_transactions t
      JOIN credit_wallets w ON w.id = t.wallet_id
      LEFT JOIN credit_packs pk ON pk.id = t.pack_id
      LEFT JOIN LATERAL (
        -- Unstamped rows (written by a build before funding_type existed).
        SELECT COALESCE(t.funding_type, CASE
          WHEN pk.type = ${CreditPackType.SUBSCRIPTION} THEN ${CreditFundingType.SUBSCRIPTION}
          WHEN pk.type = ${CreditPackType.PERMANENT} THEN ${CreditFundingType.PURCHASED}
          WHEN pk.type = ${CreditPackType.EARNED} THEN ${CreditFundingType.REFERRAL}
          WHEN pk.type = ${CreditPackType.BONUS} THEN ${CreditFundingType.ADMIN_GRANT}
          WHEN w.lead_id IS NOT NULL
            AND COALESCE((t.metadata->>'packCreditsUsed')::numeric, 0) = 0
            THEN ${CreditFundingType.FREE_UNKNOWN}
          ELSE ${CreditFundingType.PACK_UNKNOWN} END) AS bucket
      ) fund ON true
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
    )`;
}

export class QueryCreditsSpentBySourceRepository {
  static async queryCreditsSpentBySource(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    source: typeof UsageSourceValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback, source } = data;
    const rows = await db.execute<
      QueryResultRow & { bucket: string; total: string | null }
    >(sql`${usageSourceBaseCte(range)}
        SELECT ${resolutionBucketExpr(resolution, sql`b.at`)} AS bucket,
          sum(b.credits) AS total
        FROM base b
        WHERE ${usageSourceSql()} = ${source}
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
