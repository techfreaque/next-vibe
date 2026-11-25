/**
 * Credits Spent By Model - Repository
 * Server-only. DB access.
 *
 * Credits spent per bucket on one model family / media / tool group. Same
 * rows as credits-spent-total (USAGE minus signup carryover, every spender),
 * so the groups add up to all spend. Grouping happens in JS against the
 * model registry (model-group.ts): SQL sums per (bucket, model_id, feature).
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
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
import { notSignupCarryover } from "../../usage-filter";
import type { ModelSpendGroupValue } from "./enum";
import { modelSpendGroup } from "./model-group";

export class QueryCreditsSpentByModelRepository {
  static async queryCreditsSpentByModel(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    group: typeof ModelSpendGroupValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback, group } = data;

    const rows = await db
      .select({
        bucket: resolutionBucketExpr(
          resolution,
          creditTransactions.createdAt,
        ).as("bucket"),
        modelId: creditTransactions.modelId,
        feature: creditTransactions.feature,
        total: sql<string>`sum(-${creditTransactions.amount})`,
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.type, CreditTransactionType.USAGE),
          notSignupCarryover,
          gte(creditTransactions.createdAt, range.from),
          lte(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1, 2, 3`);

    const totals = new Map<number, number>();
    for (const r of rows) {
      if (modelSpendGroup(r.modelId, r.feature) !== group) {
        continue;
      }
      const ts = new Date(r.bucket).getTime();
      totals.set(ts, (totals.get(ts) ?? 0) + Number(r.total ?? 0));
    }
    const raw = [...totals].map(([ts, value]): DataPoint => ({
      timestamp: new Date(ts),
      value: Math.round(value * 100) / 100,
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
