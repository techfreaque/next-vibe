import "server-only";

import { and, eq, type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import { companies } from "@/companies/db";
import { getDocumentCompanies } from "@/finance/document-company-scope";

import { accountNodes, journalEntries, journalEntryLines } from "../db";

export async function findLedgerReportCompany(
  userId: string,
  companyId?: string,
): Promise<{ id: string; name: string; currency: string | null } | undefined> {
  if (companyId) {
    const [company] = await db
      .select({
        id: companies.id,
        name: companies.name,
        currency: companies.currency,
      })
      .from(companies)
      .where(eq(companies.id, companyId));
    return company;
  }

  const candidates = await getDocumentCompanies(userId);
  return candidates.length === 1 ? candidates[0] : undefined;
}

export interface LedgerReportCurrencyScope {
  reportCurrency: string;
  useFunctionalAmount: boolean;
  filterCurrency: string | null;
}

/**
 * An explicit currency reports original amounts. Without a filter, use the
 * company's functional currency when each line can be stated in that currency.
 * Historical entries in a single original currency can still be read as booked.
 */
export async function resolveLedgerReportScope(
  companyCurrency: string | null,
  conditions: SQL[],
  requestedCurrency?: string,
): Promise<LedgerReportCurrencyScope | null> {
  if (requestedCurrency) {
    const code = requestedCurrency.trim().toUpperCase();
    return {
      reportCurrency: code,
      useFunctionalAmount: false,
      filterCurrency: code,
    };
  }

  const currencies = await db
    .selectDistinct({
      currency: journalEntryLines.currency,
      functionalCurrency: journalEntryLines.functionalCurrency,
      hasFunctionalAmount: sql<boolean>`${journalEntryLines.functionalAmount} is not null`,
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .where(and(...conditions));

  const functionalCurrency = (companyCurrency ?? "EUR").toUpperCase();
  const originalCurrencies = new Set(currencies.map((row) => row.currency));
  const useFunctionalAmount =
    originalCurrencies.size > 1 ||
    currencies.some(
      (row) =>
        row.currency !== functionalCurrency &&
        row.hasFunctionalAmount &&
        row.functionalCurrency === functionalCurrency,
    );
  if (useFunctionalAmount) {
    const hasUnvaluedLines = currencies.some(
      (row) =>
        (row.hasFunctionalAmount ? row.functionalCurrency : row.currency) !==
        functionalCurrency,
    );
    if (hasUnvaluedLines) {
      return null;
    }
    return {
      reportCurrency: functionalCurrency,
      useFunctionalAmount: true,
      filterCurrency: null,
    };
  }

  const [historical] = originalCurrencies;
  const reportCurrency = historical ?? functionalCurrency;
  return {
    reportCurrency,
    useFunctionalAmount: false,
    filterCurrency: reportCurrency,
  };
}

/** Infer one historical currency. A mixed scope needs an explicit selection. */
export async function resolveLedgerReportCurrency(
  companyCurrency: string | null,
  conditions: SQL[],
  requestedCurrency?: string,
): Promise<string | null> {
  if (requestedCurrency) {
    return requestedCurrency;
  }

  const currencies = await db
    .selectDistinct({ currency: journalEntryLines.currency })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .where(and(...conditions))
    .limit(2);

  if (currencies.length > 1) {
    return null;
  }

  const [historical] = currencies;
  if (historical) {
    return historical.currency;
  }

  return companyCurrency ?? "EUR";
}
