import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";

import type {
  bankAccountReconciliationSettings,
  bankStatementLines,
} from "./db";
import type { BankMatchPlan } from "./reconciliation-plan";

export async function postBankAdjustment(
  tx: LedgerTransaction,
  statement: typeof bankStatementLines.$inferSelect,
  settings: typeof bankAccountReconciliationSettings.$inferSelect,
  plan: BankMatchPlan,
  userId: string,
  description: string,
  logger: EndpointLogger,
): Promise<string | null> {
  const balances = [
    {
      id: statement.accountId,
      units: plan.fee + plan.fx,
      type: AccountType.ASSET,
    },
    { id: settings.feeAccountId, units: -plan.fee, type: AccountType.EXPENSE },
    {
      id: plan.fx > BigInt(0) ? settings.gainAccountId : settings.lossAccountId,
      units: -plan.fx,
      type: plan.fx > BigInt(0) ? AccountType.REVENUE : AccountType.EXPENSE,
    },
  ].filter(({ units }) => units !== BigInt(0));

  const ids = balances.flatMap(({ id }) => (id ? [id] : []));
  if (ids.length !== balances.length || new Set(ids).size !== ids.length) {
    return null;
  }
  const accounts = await tx
    .select()
    .from(accountNodes)
    .where(
      and(
        inArray(accountNodes.id, ids),
        eq(accountNodes.companyId, statement.companyId),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    )
    .orderBy(accountNodes.id)
    .for("share");
  const lines: AutoPostLine[] = [];
  for (const { id, units, type } of balances) {
    const account = accounts.find((row) => row.id === id && row.type === type);
    if (
      !account ||
      (id === statement.accountId && account.subtype !== AccountSubtype.BANK)
    ) {
      return null;
    }
    lines.push({
      accountNodeId: account.id,
      subtype: account.subtype,
      type: units > BigInt(0) ? LineType.DEBIT : LineType.CREDIT,
      amount: Math.abs(Number(units)) / 10_000,
      currency: statement.currency,
    });
  }
  return postJournalEntry(
    {
      companyId: statement.companyId,
      sourceId: statement.id,
      date: new Date(statement.bookedDate),
      sourceType: JournalSourceType.BANK_RECONCILIATION,
      postedByUserId: userId,
      lines,
      description,
      logger,
    },
    tx,
  );
}
