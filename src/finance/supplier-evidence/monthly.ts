import "server-only";

import { and, eq, gte, inArray, lt, type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { GraphResolution } from "next-vibe/dataflow/enum";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountType,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";

import { groupProviderCostUsd, PAID_FUNDING } from "../consumption";
import { ConsumptionRepository } from "../consumption-repository";
import { FLAT_RATE_PROVIDERS } from "../cost-providers";
import type { ProviderSources } from "../enum";
import { PROVIDER_ADAPTERS } from "../sources/providers";
import { supplierEvidenceRecords } from "./db";
import { aggregateModelCosts, type MonthlyModelEstimate } from "./model-costs";
import { areaValues } from "./rules";

function journalLineage(requireMatchingLine: boolean): SQL {
  const matchingLine = requireMatchingLine
    ? sql`AND EXISTS (
      SELECT 1 FROM ${journalEntryLines} AS matched_line
      WHERE matched_line.journal_entry_id = parent.id
        AND matched_line.currency = ${journalEntryLines.currency}
        AND matched_line.account_id = ${journalEntryLines.accountId}
    )`
    : sql``;
  return sql`WITH RECURSIVE lineage AS (
    SELECT ${journalEntries.id} AS id, ${journalEntries.reversalOfId} AS reversal_of_id,
      ${journalEntries.date} AS posting_date, ${journalEntries.sourceType} AS source_type,
      ${journalEntries.sourceId} AS source_id, ARRAY[${journalEntries.id}] AS visited
    UNION ALL
    SELECT parent.id, parent.reversal_of_id, parent.date, parent.source_type,
      parent.source_id, array_append(lineage.visited, parent.id)
    FROM lineage
    JOIN ${journalEntries} AS parent ON parent.id = lineage.reversal_of_id
    WHERE parent.company_id = ${journalEntries.companyId}
      AND parent.status IN (${sql.join(
        ledgerEntryStatuses.map((status) => sql`${status}`),
        sql`, `,
      )})
      AND parent.date <= lineage.posting_date
      AND NOT (parent.id = ANY(lineage.visited))
      ${matchingLine}
  )`;
}

export function excludePeriodClosing(): SQL {
  const sourceType = JournalSourceType.PERIOD_CLOSE;
  return sql`CASE
    WHEN ${journalEntries.sourceType} = ${sourceType} THEN false
    WHEN ${journalEntries.reversalOfId} IS NULL THEN true
    ELSE NOT EXISTS (
      ${journalLineage(false)}
      SELECT 1 FROM lineage WHERE source_type = ${sourceType}
    )
  END`;
}

export async function getMonthlySupplierExpenses(
  companyId: string,
  currency: string,
  month: string,
): Promise<{ area: (typeof areaValues)[number]; expense: string }[]> {
  const { start, end } = monthRange(month);

  const isSupplierEntry = sql`(
    lineage.source_type = ${JournalSourceType.SUPPLIER_EVIDENCE}
    AND ${supplierEvidenceRecords.id} = lineage.source_id
  ) OR (
    lineage.source_type = ${JournalSourceType.AP_BILL}
    AND ${supplierEvidenceRecords.billId} = lineage.source_id
  )`;
  // Prefer named sources over manual records when an invoice was reconciled.
  const area = sql<string>`COALESCE((
    ${journalLineage(true)}
    SELECT CASE
      WHEN ${supplierEvidenceRecords.kind} = 'sponsorship' THEN 'sponsorship'
      WHEN ${supplierEvidenceRecords.kind} = 'processorFee' THEN 'processor'
      WHEN ${supplierEvidenceRecords.kind} = 'referral' THEN 'referral'
      WHEN ${supplierEvidenceRecords.provider} IS NOT NULL THEN 'provider'
      ELSE 'supplier'
    END
    FROM lineage
    JOIN ${supplierEvidenceRecords} ON (${isSupplierEntry})
    WHERE ${supplierEvidenceRecords.companyId} = ${companyId}
    ORDER BY cardinality(lineage.visited) DESC, CASE
      WHEN ${supplierEvidenceRecords.kind} IN ('sponsorship', 'processorFee', 'referral')
        OR ${supplierEvidenceRecords.provider} IS NOT NULL THEN 0 ELSE 1
    END, ${supplierEvidenceRecords.id}
    LIMIT 1
  ), 'unallocated')`;
  const rows = await db
    .select({
      area,
      expense: sql<string>`SUM(CASE WHEN ${journalEntryLines.type} = ${LineType.DEBIT}
      THEN ${journalEntryLines.amount} ELSE -${journalEntryLines.amount} END)::text`,
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(
      accountNodes,
      and(
        eq(journalEntryLines.accountId, accountNodes.id),
        eq(accountNodes.companyId, companyId),
      ),
    )
    .where(
      and(
        eq(journalEntries.companyId, companyId),
        eq(accountNodes.type, AccountType.EXPENSE),
        eq(journalEntryLines.currency, currency),
        inArray(journalEntries.status, ledgerEntryStatuses),
        excludePeriodClosing(),
        gte(journalEntries.date, start),
        lt(journalEntries.date, end),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.flatMap((row) => {
    const areaKey = areaValues.find((value) => value === row.area);
    return areaKey ? [{ area: areaKey, expense: row.expense }] : [];
  });
}

export async function getMonthlyModelEstimates(
  month: string,
  providers: readonly (typeof ProviderSources)[number][],
): Promise<MonthlyModelEstimate[]> {
  if (providers.length === 0) {
    return [];
  }
  const allowed = new Set<string>(
    PROVIDER_ADAPTERS.filter(({ source }) =>
      providers.some((provider) => provider === source),
    ).flatMap(({ apiProviders }) => apiProviders),
  );
  const { start, end } = monthRange(month);
  const groups = await ConsumptionRepository.groups(GraphResolution.ONE_MONTH, {
    from: start,
    to: end,
    toInclusive: false,
  });
  const attributedGroups = groups
    .map((group) => ({
      group,
      ...groupProviderCostUsd(group),
    }))
    .filter(
      ({ provider }) =>
        allowed.has(provider) && FLAT_RATE_PROVIDERS[provider] === undefined,
    );
  const packIds = new Set<string>();
  for (const { group } of attributedGroups) {
    if (group.packId && PAID_FUNDING.has(group.funding)) {
      packIds.add(group.packId);
    }
  }
  const prices = await ConsumptionRepository.packPrices([...packIds], {
    exactUsdCheckoutOnly: true,
  });
  return aggregateModelCosts(attributedGroups, prices).slice(0, 20);
}

export function monthRange(month: string): { start: Date; end: Date } {
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
}
