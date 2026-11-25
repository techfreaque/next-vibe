import "server-only";

import { eq } from "drizzle-orm";

import {
  journalEntries,
  type JournalEntry,
  type JournalEntryLine,
  journalEntryLines,
} from "../db";
import { JournalEntryStatus, LineType } from "../enum";
import { type LedgerTransaction, nextJournalEntryNumber } from "./ledger-write";

/** Mirror a validated, locked original inside the caller's transaction. */
export async function writeJournalReversal(
  tx: LedgerTransaction,
  original: JournalEntry,
  lines: JournalEntryLine[],
  reversal: {
    periodId: string;
    date: Date;
    userId: string;
    memo: string | null;
    description?: string;
  },
): Promise<{ id: string; entryNumber: string } | undefined> {
  const entryNumber = await nextJournalEntryNumber(
    tx,
    original.companyId,
    reversal.date,
  );
  const now = new Date();
  const [entry] = await tx
    .insert(journalEntries)
    .values({
      companyId: original.companyId,
      periodId: reversal.periodId,
      entryNumber,
      date: reversal.date,
      description: reversal.description ?? original.description,
      memo: reversal.memo,
      status: JournalEntryStatus.POSTED,
      reversalOfId: original.id,
      postedAt: now,
      postedByUserId: reversal.userId,
      sourceType: original.sourceType,
    })
    .returning({
      id: journalEntries.id,
      entryNumber: journalEntries.entryNumber,
    });
  if (!entry) {
    return undefined;
  }

  await tx.insert(journalEntryLines).values(
    lines.map((line) => ({
      journalEntryId: entry.id,
      accountId: line.accountId,
      type: line.type === LineType.DEBIT ? LineType.CREDIT : LineType.DEBIT,
      amount: line.amount,
      currency: line.currency,
      description: line.description,
      sortOrder: line.sortOrder,
    })),
  );

  await tx
    .update(journalEntries)
    .set({
      reversedById: entry.id,
      status: JournalEntryStatus.REVERSED,
      updatedAt: now,
    })
    .where(eq(journalEntries.id, original.id));

  return entry;
}
