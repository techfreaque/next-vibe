import "server-only";

import { and, eq, type SQL } from "drizzle-orm";
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
