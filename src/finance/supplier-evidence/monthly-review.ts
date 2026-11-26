import "server-only";

import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import { journalEntries } from "@/chart-of-accounts/db";
import { JournalEntryStatus } from "@/chart-of-accounts/enum";
import { paymentBills } from "@/payment/db";

import { financeProviderSnapshots } from "../db";
import type { ProviderSources } from "../enum";
import { monthRange } from "../report-period";
import { supplierEvidenceRecords } from "./db";

export async function getMonthlyProviderReview(
  companyId: string,
  month: string,
  providers: (typeof ProviderSources)[number][],
): Promise<
  {
    provider: (typeof ProviderSources)[number];
    counterUsd: number | null;
    estimatedUsd: number | null;
    unclassifiedUsd: number | null;
    readings: number;
    missingReadings: number;
    receipts: {
      currency: string;
      savedGross: string;
      count: number;
      postedCount: number;
    }[];
  }[]
> {
  if (providers.length === 0) {
    return [];
  }
  const { start, end } = monthRange(month);
  const [observations, receipts] = await Promise.all([
    db
      .select({
        provider: financeProviderSnapshots.provider,
        counterUsd: sql<number | null>`SUM(${financeProviderSnapshots.spendUsd})
        FILTER (WHERE ${financeProviderSnapshots.spendEvidence} = 'counter')`,
        estimatedUsd: sql<
          number | null
        >`SUM(${financeProviderSnapshots.spendUsd})
        FILTER (WHERE ${financeProviderSnapshots.spendEvidence} IN ('balance-delta', 'usage-estimate'))`,
        unclassifiedUsd: sql<
          number | null
        >`SUM(${financeProviderSnapshots.spendUsd})
        FILTER (WHERE ${financeProviderSnapshots.spendEvidence} IS NULL)`,
        readings: sql<number>`COUNT(*)::integer`,
        missingReadings: sql<number>`COUNT(*) FILTER (WHERE ${financeProviderSnapshots.spendUsd} IS NULL)::integer`,
      })
      .from(financeProviderSnapshots)
      .where(
        and(
          inArray(financeProviderSnapshots.provider, providers),
          gte(financeProviderSnapshots.capturedAt, start),
          lt(financeProviderSnapshots.capturedAt, end),
        ),
      )
      .groupBy(financeProviderSnapshots.provider),
    db
      .select({
        provider: supplierEvidenceRecords.provider,
        currency: supplierEvidenceRecords.currency,
        savedGross: sql<string>`SUM(${supplierEvidenceRecords.grossAmount}::numeric(12,4))::text`,
        count: sql<number>`COUNT(*)::integer`,
        postedCount: sql<number>`COUNT(*) FILTER (WHERE ${journalEntries.status} = ${JournalEntryStatus.POSTED})::integer`,
      })
      .from(supplierEvidenceRecords)
      .leftJoin(
        paymentBills,
        and(
          eq(paymentBills.id, supplierEvidenceRecords.billId),
          eq(paymentBills.companyId, companyId),
        ),
      )
      .leftJoin(
        journalEntries,
        and(
          eq(journalEntries.companyId, companyId),
          sql`${journalEntries.id} = coalesce(${supplierEvidenceRecords.journalEntryId}, ${paymentBills.journalEntryId})`,
        ),
      )
      .where(
        and(
          eq(supplierEvidenceRecords.companyId, companyId),
          inArray(supplierEvidenceRecords.provider, providers),
          inArray(supplierEvidenceRecords.kind, ["fund", "fundBill"]),
          gte(supplierEvidenceRecords.date, start),
          lt(supplierEvidenceRecords.date, end),
        ),
      )
      .groupBy(
        supplierEvidenceRecords.provider,
        supplierEvidenceRecords.currency,
      )
      .orderBy(supplierEvidenceRecords.currency),
  ]);
  return providers.map((provider) => {
    const observation = observations.find((row) => row.provider === provider);
    return {
      provider,
      counterUsd: observation?.counterUsd ?? null,
      estimatedUsd: observation?.estimatedUsd ?? null,
      unclassifiedUsd: observation?.unclassifiedUsd ?? null,
      readings: observation?.readings ?? 0,
      missingReadings: observation?.missingReadings ?? 0,
      receipts: receipts
        .filter((row) => row.provider === provider)
        .map(({ currency, savedGross, count, postedCount }) => ({
          currency,
          savedGross,
          count,
          postedCount,
        })),
    };
  });
}
