import { and, eq, gte, lt } from "drizzle-orm";
import { db } from "next-vibe/database";

import { demoRecordId } from "@/companies/demo-company.repository";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "./db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  LineType,
} from "./enum";
import { nextAccountingDay } from "./shared/journal-validation";
import { findOpenPeriod, lockLedgerCompany } from "./shared/ledger-write";

export async function seedDemoLedger({
  id: companyId,
  adminId,
}: {
  id: string;
  adminId: string;
}): Promise<void> {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  await db.transaction(async (tx) => {
    const company = await lockLedgerCompany(tx, companyId);
    if (company?.currency !== "EUR") {
      return;
    }

    await tx
      .insert(accountNodes)
      .values([
        {
          companyId,
          code: "1170",
          name: "Processor Clearing",
          type: AccountType.ASSET,
          subtype: AccountSubtype.CURRENT_ASSET,
          sortOrder: 85,
        },
        {
          companyId,
          code: "2135",
          name: "Deferred Studio Credits",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCRUED_LIABILITY,
          sortOrder: 245,
        },
      ])
      .onConflictDoNothing();

    const accounts = await tx
      .select({ id: accountNodes.id, subtype: accountNodes.subtype })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .orderBy(accountNodes.sortOrder, accountNodes.code);
    const bank = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.BANK,
    );
    const revenue = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.REVENUE_SERVICE,
    );
    const rent = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.RENT,
    );
    // A demo company that has been given a custom chart may not have these
    // accounts. Leave that chart alone.
    if (!bank || !revenue || !rent) {
      return;
    }

    for (const offset of [-1, 0]) {
      const startDate = new Date(Date.UTC(year, month + offset, 1));
      const endDate = new Date(Date.UTC(year, month + offset + 1, 0));
      const monthKey = startDate.toISOString().slice(0, 7);
      const date = new Date(
        Date.UTC(year, month + offset, Math.min(now.getUTCDate(), 5)),
      );
      const openPeriod = await findOpenPeriod(tx, companyId, date);
      const periodId =
        openPeriod?.id ?? demoRecordId(companyId, `period:${monthKey}`);
      if (!openPeriod) {
        const [overlap] = await tx
          .select({ id: accountingPeriods.id })
          .from(accountingPeriods)
          .where(
            and(
              eq(accountingPeriods.companyId, companyId),
              gte(accountingPeriods.endDate, startDate),
              lt(accountingPeriods.startDate, nextAccountingDay(endDate)),
            ),
          )
          .limit(1);
        if (overlap) {
          continue;
        }
        await tx.insert(accountingPeriods).values({
          id: periodId,
          companyId,
          name: monthKey,
          startDate,
          endDate,
        });
      }

      for (const sample of [
        {
          key: "service",
          description: "Studio workshop sales",
          debit: bank.id,
          credit: revenue.id,
          amount: offset === 0 ? 2800 : 2400,
        },
        {
          key: "rent",
          description: "Studio rent",
          debit: rent.id,
          credit: bank.id,
          amount: 950,
        },
      ]) {
        const entryNumber = `DEMO-${monthKey}-${sample.key.toUpperCase()}`;
        const id = demoRecordId(companyId, entryNumber);
        const [entry] = await tx
          .insert(journalEntries)
          .values({
            id,
            companyId,
            periodId,
            entryNumber,
            date,
            description: sample.description,
            status: JournalEntryStatus.POSTED,
            postedAt: date,
            postedByUserId: adminId,
          })
          .onConflictDoNothing()
          .returning({ id: journalEntries.id });
        if (entry) {
          await tx.insert(journalEntryLines).values([
            {
              journalEntryId: id,
              accountId: sample.debit,
              type: LineType.DEBIT,
              amount: sample.amount,
              currency: "EUR",
            },
            {
              journalEntryId: id,
              accountId: sample.credit,
              type: LineType.CREDIT,
              amount: sample.amount,
              currency: "EUR",
              sortOrder: 1,
            },
          ]);
        }
      }
    }
  });
}
