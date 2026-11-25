/**
 * Credits Purchased - Repository
 * Server-only. DB access.
 *
 * Credits issued by PURCHASE / SUBSCRIPTION ledger rows per bucket, split by kind:
 * - paid rows carry the checkout's idempotency key (metadata.sessionId);
 * - gifted rows are PURCHASE rows without one: admin bonus packs (testers,
 *   creators, goodwill), written through the same PURCHASE type.
 * Duplicate grants neutralised by the uq_packs_session_id migration carry
 * metadata.duplicateOfSessionId instead and count as neither.
 * Unit: credits, not money (money lives in payment_transactions / finance).
 */

import "server-only";

import { and, eq, gte, inArray, lte, type SQL, sql, sum } from "drizzle-orm";
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

import { creditTransactions } from "../../db";
import { CreditTransactionType } from "../../enum";
import { CreditIssueKind, type CreditIssueKindValue } from "./enum";

const hasSession = sql`(${creditTransactions.metadata}->>'sessionId') IS NOT NULL`;
const hasDuplicateMarker = sql`(${creditTransactions.metadata}->>'duplicateOfSessionId') IS NOT NULL`;

function kindCondition(kind: typeof CreditIssueKindValue): SQL | undefined {
  switch (kind) {
    case CreditIssueKind.PACKS:
      return and(
        eq(creditTransactions.type, CreditTransactionType.PURCHASE),
        hasSession,
      );
    case CreditIssueKind.SUBSCRIPTIONS:
      return and(
        eq(creditTransactions.type, CreditTransactionType.SUBSCRIPTION),
        hasSession,
      );
    case CreditIssueKind.GIFTED:
      return and(
        eq(creditTransactions.type, CreditTransactionType.PURCHASE),
        sql`NOT ${hasSession}`,
        sql`NOT ${hasDuplicateMarker}`,
      );
    case CreditIssueKind.PAID:
      return and(
        inArray(creditTransactions.type, [
          CreditTransactionType.PURCHASE,
          CreditTransactionType.SUBSCRIPTION,
        ]),
        hasSession,
      );
  }
}

export class QueryCreditsPurchasedRepository {
  static async queryCreditsPurchased(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    kind?: typeof CreditIssueKindValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const kind = data.kind ?? CreditIssueKind.PAID;

    const rows = await db
      .select({
        bucket: resolutionBucketExpr(
          resolution,
          creditTransactions.createdAt,
        ).as("bucket"),
        total: sum(creditTransactions.amount),
      })
      .from(creditTransactions)
      .where(
        and(
          kindCondition(kind),
          sql`${creditTransactions.amount} > 0`,
          gte(creditTransactions.createdAt, range.from),
          lte(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.total ?? 0),
    }));

    const result = fillGaps(raw, range, resolution);
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
