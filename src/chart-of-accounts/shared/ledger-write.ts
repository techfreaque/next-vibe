import "server-only";

import { and, asc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { companies } from "@/companies/db";

import { accountingPeriods, accountNodes, journalEntries } from "../db";
import { PeriodStatus } from "../enum";
import type { ChartOfAccountsTranslationKey } from "../i18n";
import { accountingDay, nextAccountingDay } from "./journal-validation";

export type LedgerTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export const journalValidationMessages = {
  empty: "journalCreate.errorEmptyLines",
  line: "journalCreate.errorInvalidLine",
  currency: "journalCreate.errorCurrency",
  balance: "journalCreate.errorNotBalanced",
} satisfies Record<string, ChartOfAccountsTranslationKey>;

/** All journal mutations and period transitions must acquire this lock first. */
export async function lockLedgerCompany(
  tx: LedgerTransaction,
  companyId: string,
): Promise<{ currency: string | null } | undefined> {
  const [company] = await tx
    .select({ currency: companies.currency })
    .from(companies)
    .where(eq(companies.id, companyId))
    .for("update");
  return company;
}

export async function findOpenPeriod(
  tx: LedgerTransaction,
  companyId: string,
  date: Date,
): Promise<{ id: string } | undefined> {
  const [period] = await tx
    .select({ id: accountingPeriods.id })
    .from(accountingPeriods)
    .where(
      and(
        eq(accountingPeriods.companyId, companyId),
        eq(accountingPeriods.status, PeriodStatus.OPEN),
        lt(accountingPeriods.startDate, nextAccountingDay(date)),
        gte(accountingPeriods.endDate, accountingDay(date)),
      ),
    )
    .orderBy(asc(accountingPeriods.startDate), asc(accountingPeriods.id))
    .limit(1);
  return period;
}

export async function haveCompanyAccounts(
  tx: LedgerTransaction,
  companyId: string,
  accountIds: string[],
  options?: { historical: boolean },
): Promise<boolean> {
  const uniqueIds = [...new Set(accountIds)];
  const accounts = await tx
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, companyId),
        options?.historical ? undefined : eq(accountNodes.isActive, true),
        options?.historical ? undefined : eq(accountNodes.isPostable, true),
        inArray(accountNodes.id, uniqueIds),
      ),
    )
    .orderBy(asc(accountNodes.id))
    .for("share");

  return accounts.length === uniqueIds.length;
}

/** Allocate the next company-wide annual number while holding the company lock. */
export async function nextJournalEntryNumber(
  tx: LedgerTransaction,
  companyId: string,
  date: Date,
): Promise<string> {
  const prefix = `JE-${date.getUTCFullYear()}-`;
  const [result] = await tx
    .select({
      sequence: sql<string>`coalesce(max(substring(${journalEntries.entryNumber} from '[0-9]+$')::bigint), 0)`,
    })
    .from(journalEntries)
    .where(
      and(
        eq(journalEntries.companyId, companyId),
        sql`${journalEntries.entryNumber} ~ ${`^${prefix}[0-9]{1,15}$`}`,
      ),
    );

  return `${prefix}${(BigInt(result?.sequence ?? "0") + BigInt(1)).toString().padStart(4, "0")}`;
}
