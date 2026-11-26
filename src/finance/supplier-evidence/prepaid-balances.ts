import "server-only";

import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";
import { nextAccountingDay } from "@/chart-of-accounts/shared/journal-validation";

import type { ProviderSources } from "../enum";
import { supplierEvidenceRecords } from "./db";

export async function getSupplierPrepaidBalances(
  companyId: string,
  currency: string,
): Promise<
  { provider: (typeof ProviderSources)[number] | null; balance: string }[]
> {
  const taggedEntries = db
    .selectDistinct({
      entryId: journalEntries.id,
      provider: supplierEvidenceRecords.provider,
    })
    .from(journalEntries)
    .innerJoin(
      supplierEvidenceRecords,
      and(
        eq(supplierEvidenceRecords.companyId, companyId),
        or(
          and(
            eq(journalEntries.sourceType, JournalSourceType.SUPPLIER_EVIDENCE),
            eq(supplierEvidenceRecords.id, journalEntries.sourceId),
          ),
          and(
            eq(journalEntries.sourceType, JournalSourceType.AP_BILL),
            eq(supplierEvidenceRecords.billId, journalEntries.sourceId),
          ),
        ),
      ),
    )
    .where(
      and(
        eq(journalEntries.companyId, companyId),
        inArray(journalEntries.status, ledgerEntryStatuses),
        lt(journalEntries.date, nextAccountingDay(new Date())),
      ),
    )
    .as("supplier_tagged_entries");

  return await db
    .select({
      provider: taggedEntries.provider,
      balance: sql<string>`SUM(CASE WHEN ${journalEntryLines.type} = ${LineType.DEBIT}
        THEN ${journalEntryLines.amount} ELSE -${journalEntryLines.amount} END)::text`,
    })
    .from(taggedEntries)
    .innerJoin(
      journalEntryLines,
      eq(journalEntryLines.journalEntryId, taggedEntries.entryId),
    )
    .innerJoin(
      accountNodes,
      and(
        eq(accountNodes.id, journalEntryLines.accountId),
        eq(accountNodes.companyId, companyId),
      ),
    )
    .where(
      and(
        eq(accountNodes.type, AccountType.ASSET),
        eq(accountNodes.subtype, AccountSubtype.PREPAID),
        eq(journalEntryLines.currency, currency),
      ),
    )
    .groupBy(taggedEntries.provider);
}
