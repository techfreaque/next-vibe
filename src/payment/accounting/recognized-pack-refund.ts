import "server-only";

import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";

import type { paymentTransactions } from "../db";
import { CheckoutMode } from "../enum";
import {
  paymentAccountingEvidence,
  type paymentAccountingOffers,
  type paymentAccountingPostings,
  paymentAccountingRecognitions,
} from "./db";
import { creditAtoms, recognitionMinor } from "./recognition-rules";

export interface RecognizedPackRefund {
  liabilityMinor: number;
  revenue: { account: typeof accountNodes.$inferSelect; minor: number }[];
}

const purchaseMetadata = z.object({ sessionId: z.string() });
const clawbackMetadata = z.object({
  reason: z.literal("payment_refund"),
  originalTransactionId: z.string(),
  revokedCredits: z.number(),
  unrecoveredCredits: z.number(),
});
const maxMovements = 1_000;

type EntryLine = Pick<
  typeof journalEntryLines.$inferSelect,
  "accountId" | "amount" | "currency" | "type"
>;

function matchesLine(
  line: EntryLine,
  accountId: string,
  type: EntryLine["type"],
  amountMinor: number,
  currency: string,
): boolean {
  return (
    line.accountId === accountId &&
    line.type === type &&
    line.amount === amountMinor / 100 &&
    line.currency === currency
  );
}

function matchesEntry(
  lines: EntryLine[] | undefined,
  expected: { accountId: string; type: EntryLine["type"]; minor: number }[],
  currency: string,
): boolean {
  return (
    !!lines &&
    lines.length === expected.length &&
    expected.every((row) =>
      lines.some((line) =>
        matchesLine(line, row.accountId, row.type, row.minor, currency),
      ),
    )
  );
}

/** Resolve a single full refund only when the original credits and postings reconcile exactly. */
export async function resolveRecognizedPackRefund(
  tx: LedgerTransaction,
  sale: typeof paymentAccountingPostings.$inferSelect,
  offer: typeof paymentAccountingOffers.$inferSelect,
  evidence: typeof paymentAccountingEvidence.$inferSelect,
  transaction: typeof paymentTransactions.$inferSelect,
): Promise<RecognizedPackRefund | undefined> {
  const { providerSessionId, providerPaymentIntentId } = transaction;
  if (
    transaction.mode !== CheckoutMode.PAYMENT ||
    !providerSessionId ||
    !providerPaymentIntentId ||
    evidence.paymentIntentId !== providerPaymentIntentId ||
    !sale.invoiceId ||
    !sale.receiptEntryId ||
    evidence.sourceDate < sale.sourceDate
  ) {
    return undefined;
  }

  const refundSources = await tx
    .select({ id: paymentAccountingEvidence.id })
    .from(paymentAccountingEvidence)
    .where(
      and(
        eq(paymentAccountingEvidence.provider, sale.provider),
        eq(paymentAccountingEvidence.merchantId, sale.merchantId),
        eq(paymentAccountingEvidence.sourceKind, "refund"),
        eq(paymentAccountingEvidence.paymentIntentId, providerPaymentIntentId),
      ),
    )
    .limit(2);
  if (refundSources.length !== 1 || refundSources[0]?.id !== evidence.id) {
    return undefined;
  }

  const packs = await tx
    .select({
      id: creditPacks.id,
      walletId: creditPacks.walletId,
      granted: sql<string>`cast(${creditPacks.originalAmount} as text)`,
      remaining: sql<string>`cast(${creditPacks.remaining} as text)`,
    })
    .from(creditPacks)
    .innerJoin(creditWallets, eq(creditWallets.id, creditPacks.walletId))
    .where(
      and(
        eq(creditWallets.userId, transaction.userId),
        eq(creditPacks.type, CreditPackType.PERMANENT),
        sql`${creditPacks.metadata}->>'sessionId' = ${providerSessionId}`,
      ),
    )
    .limit(2)
    .for("share");
  const [pack] = packs;
  const grant = pack && creditAtoms(pack.granted);
  if (
    !pack ||
    packs.length !== 1 ||
    creditAtoms(pack.remaining) !== BigInt(0) ||
    !grant
  ) {
    return undefined;
  }

  const movements = await tx
    .select({
      id: creditTransactions.id,
      packId: creditTransactions.packId,
      type: creditTransactions.type,
      amount: sql<string>`cast(${creditTransactions.amount} as text)`,
      metadata: creditTransactions.metadata,
      createdAt: creditTransactions.createdAt,
    })
    .from(creditTransactions)
    .where(
      and(
        eq(creditTransactions.walletId, pack.walletId),
        or(
          eq(creditTransactions.packId, pack.id),
          and(
            eq(creditTransactions.type, CreditTransactionType.REFUND),
            sql`${creditTransactions.metadata}->>'originalTransactionId' = ${transaction.id}`,
          ),
        ),
      ),
    )
    .orderBy(asc(creditTransactions.createdAt), asc(creditTransactions.id))
    .limit(maxMovements + 1);
  if (movements.length > maxMovements) {
    return undefined;
  }
  const use = movements.filter(
    (row) => row.type === CreditTransactionType.USAGE,
  );
  const purchases = movements.filter(
    (row) => row.type === CreditTransactionType.PURCHASE,
  );
  const clawbacks = movements.filter(
    (row) => row.type === CreditTransactionType.REFUND,
  );
  const [purchase] = purchases;
  const [clawback] = clawbacks;
  const purchaseData = purchaseMetadata.safeParse(purchase?.metadata);
  const clawbackData = clawbackMetadata.safeParse(clawback?.metadata);
  if (
    !purchase ||
    purchases.length !== 1 ||
    !purchaseData.success ||
    purchaseData.data.sessionId !== providerSessionId ||
    creditAtoms(purchase.amount) !== grant ||
    !clawback ||
    clawbacks.length !== 1 ||
    !clawbackData.success ||
    clawback.packId !== pack.id ||
    clawbackData.data.originalTransactionId !== transaction.id ||
    creditAtoms(String(clawbackData.data.revokedCredits)) !== grant ||
    movements.length !== use.length + 2 ||
    !use.length
  ) {
    return undefined;
  }

  const recognized = await tx
    .select()
    .from(paymentAccountingRecognitions)
    .where(eq(paymentAccountingRecognitions.postingId, sale.id))
    .limit(maxMovements + 1);
  if (recognized.length !== use.length) {
    return undefined;
  }
  const byMovement = new Map(
    recognized.map((row) => [row.creditTransactionId, row]),
  );
  const eventIds = [
    sale.journalEntryId,
    sale.receiptEntryId,
    ...recognized.flatMap((row) =>
      row.journalEntryId ? [row.journalEntryId] : [],
    ),
  ];
  const entries = await tx
    .select()
    .from(journalEntries)
    .where(
      and(
        eq(journalEntries.companyId, sale.companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        inArray(journalEntries.id, eventIds),
      ),
    );
  if (
    entries.length !== eventIds.length ||
    entries.some((entry) => entry.reversalOfId || entry.reversedById)
  ) {
    return undefined;
  }
  const headers = new Map(entries.map((entry) => [entry.id, entry]));
  const lineRows = await tx
    .select()
    .from(journalEntryLines)
    .where(inArray(journalEntryLines.journalEntryId, eventIds));
  const lines = new Map<string, EntryLine[]>();
  for (const row of lineRows) {
    const list = lines.get(row.journalEntryId) ?? [];
    list.push(row);
    lines.set(row.journalEntryId, list);
  }

  const saleHeader = headers.get(sale.journalEntryId);
  const receiptHeader = headers.get(sale.receiptEntryId);
  if (
    saleHeader?.sourceType !== JournalSourceType.AR_INVOICE ||
    saleHeader.sourceId !== sale.invoiceId ||
    receiptHeader?.sourceType !== JournalSourceType.AR_PAYMENT ||
    receiptHeader.sourceId !== sale.invoiceId ||
    (sale.taxMinor > 0 && !offer.vatAccountId) ||
    !matchesEntry(
      lines.get(sale.journalEntryId),
      [
        {
          accountId: offer.receivableAccountId,
          type: LineType.DEBIT,
          minor: sale.grossMinor,
        },
        {
          accountId: offer.considerationAccountId,
          type: LineType.CREDIT,
          minor: sale.netMinor,
        },
        ...(sale.taxMinor > 0 && offer.vatAccountId
          ? [
              {
                accountId: offer.vatAccountId,
                type: LineType.CREDIT,
                minor: sale.taxMinor,
              },
            ]
          : []),
      ],
      sale.currency,
    ) ||
    !matchesEntry(
      lines.get(sale.receiptEntryId),
      [
        {
          accountId: offer.clearingAccountId,
          type: LineType.DEBIT,
          minor: sale.grossMinor,
        },
        {
          accountId: offer.receivableAccountId,
          type: LineType.CREDIT,
          minor: sale.grossMinor,
        },
      ],
      sale.currency,
    )
  ) {
    return undefined;
  }

  let consumed = BigInt(0);
  let recognizedMinor = 0;
  const revenue = new Map<string, number>();
  for (const movement of use) {
    const atoms = movement.amount.startsWith("-")
      ? creditAtoms(movement.amount.slice(1))
      : undefined;
    const record = byMovement.get(movement.id);
    if (
      !atoms ||
      movement.createdAt < purchase.createdAt ||
      movement.createdAt > evidence.sourceDate ||
      movement.createdAt >= clawback.createdAt ||
      !record ||
      record.sourceDate.getTime() !== movement.createdAt.getTime() ||
      record.creditsAtomic !== atoms.toString()
    ) {
      return undefined;
    }
    const minor = recognitionMinor(
      sale.netMinor,
      grant,
      consumed,
      recognizedMinor,
      atoms,
    );
    if (minor === undefined || minor !== record.netMinor) {
      return undefined;
    }
    if (minor > 0) {
      const journal = record.journalEntryId
        ? headers.get(record.journalEntryId)
        : undefined;
      const allocationLines = record.journalEntryId
        ? lines.get(record.journalEntryId)
        : undefined;
      const revenueLine = allocationLines?.find(
        (row) => row.type === LineType.CREDIT,
      );
      if (
        journal?.sourceType !== JournalSourceType.CREDIT_TRANSACTION ||
        journal.sourceId !== movement.id ||
        !revenueLine ||
        !matchesEntry(
          allocationLines,
          [
            {
              accountId: offer.considerationAccountId,
              type: LineType.DEBIT,
              minor,
            },
            { accountId: revenueLine.accountId, type: LineType.CREDIT, minor },
          ],
          sale.currency,
        )
      ) {
        return undefined;
      }
      revenue.set(
        revenueLine.accountId,
        (revenue.get(revenueLine.accountId) ?? 0) + minor,
      );
    } else if (record.journalEntryId) {
      return undefined;
    }
    consumed += atoms;
    recognizedMinor += minor;
  }
  const recovered = clawback.amount.startsWith("-")
    ? creditAtoms(clawback.amount.slice(1))
    : undefined;
  if (
    !recovered ||
    recovered + consumed !== grant ||
    creditAtoms(String(clawbackData.data.unrecoveredCredits)) !== consumed
  ) {
    return undefined;
  }

  const accounts = revenue.size
    ? await tx
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, sale.companyId),
            eq(accountNodes.type, AccountType.REVENUE),
            eq(accountNodes.isActive, true),
            eq(accountNodes.isPostable, true),
            inArray(accountNodes.id, [...revenue.keys()]),
          ),
        )
    : [];
  if (accounts.length !== revenue.size) {
    return undefined;
  }
  return {
    liabilityMinor: sale.netMinor - recognizedMinor,
    revenue: accounts.map((account) => ({
      account,
      minor: revenue.get(account.id) ?? 0,
    })),
  };
}
