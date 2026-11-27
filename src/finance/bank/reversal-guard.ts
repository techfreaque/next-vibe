import "server-only";

import { and, eq } from "drizzle-orm";

import { journalEntryLines } from "@/chart-of-accounts/db";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";

import { bankStatementLines, bankStatementLineSplits } from "./db";

/** Call while the company lock serializes matches, release and source reversal. */
export async function hasMatchedBankJournalEntry(
  tx: LedgerTransaction,
  companyId: string,
  journalEntryId: string,
): Promise<boolean> {
  const [statement] = await tx
    .select({ id: bankStatementLines.id })
    .from(bankStatementLines)
    .innerJoin(
      journalEntryLines,
      eq(journalEntryLines.id, bankStatementLines.matchedJournalLineId),
    )
    .where(
      and(
        eq(bankStatementLines.companyId, companyId),
        eq(journalEntryLines.journalEntryId, journalEntryId),
      ),
    )
    .limit(1);
  if (statement) {
    return true;
  }
  const [split] = await tx
    .select({ id: bankStatementLineSplits.id })
    .from(bankStatementLineSplits)
    .innerJoin(
      journalEntryLines,
      eq(journalEntryLines.id, bankStatementLineSplits.journalLineId),
    )
    .where(
      and(
        eq(bankStatementLineSplits.companyId, companyId),
        eq(journalEntryLines.journalEntryId, journalEntryId),
      ),
    )
    .limit(1);
  return !!split;
}
