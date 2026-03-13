/**
 * Invoices Paid — Repository
 * Server-only. DB access.
 * Count of paid invoices per resolution bucket (bucketed by paidAt).
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { paymentInvoices } from "../../db";

export async function queryPaymentsInvoicesPaid({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${paymentInvoices.paidAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(paymentInvoices)
    .where(
      and(
        isNotNull(paymentInvoices.paidAt),
        gte(paymentInvoices.paidAt, timeRange.from),
        lte(paymentInvoices.paidAt, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
    }),
  );
}
