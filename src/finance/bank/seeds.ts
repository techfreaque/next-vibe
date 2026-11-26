import { and, eq, like } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  LineType,
} from "@/chart-of-accounts/enum";
import { findDemoCompany } from "@/companies/demo-company.repository";

import { bankStatementLines } from "./db";

export const priority = 8;

export async function dev(logger: EndpointLogger): Promise<void> {
  const company = await findDemoCompany();
  if (!company) {
    return;
  }
  const rows = await db
    .select({
      id: journalEntryLines.id,
      accountId: accountNodes.id,
      date: journalEntries.date,
      description: journalEntries.description,
      amount: journalEntryLines.amount,
      direction: journalEntryLines.type,
      currency: journalEntryLines.currency,
    })
    .from(journalEntryLines)
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .where(
      and(
        eq(journalEntries.companyId, company.id),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        eq(accountNodes.companyId, company.id),
        eq(accountNodes.subtype, AccountSubtype.BANK),
        like(journalEntries.entryNumber, "DEMO-%"),
      ),
    );
  if (rows.length === 0) {
    return;
  }
  await db
    .insert(bankStatementLines)
    .values(
      rows.map((row) => {
        const bookedDate = row.date.toISOString().slice(0, 10);
        return {
          companyId: company.id,
          accountId: row.accountId,
          transactionId: `demo-${row.id}`,
          bookedDate,
          valueDate: bookedDate,
          amount: (row.direction === LineType.DEBIT
            ? row.amount
            : -row.amount
          ).toFixed(4),
          currency: row.currency,
          sourceFormat: "normalized",
          sourceFeed: "synthetic-demo",
          description: row.description,
          counterparty:
            row.direction === LineType.DEBIT
              ? "Birch Street Design GmbH"
              : "Workshop Property Management GmbH",
          importedByUserId: company.adminId,
        } satisfies typeof bankStatementLines.$inferInsert;
      }),
    )
    .onConflictDoNothing();
  logger.debug("Synthetic ERP statement lines are ready", {
    companyId: company.id,
  });
}
