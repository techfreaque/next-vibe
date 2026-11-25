import "server-only";

import { and, eq, isNull, lt, type SQL, sql } from "drizzle-orm";
import type { SubqueryWithSelection } from "drizzle-orm/pg-core";
import type { db } from "next-vibe/database";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

interface InvoiceOpenBalanceParts {
  payments: SubqueryWithSelection<
    {
      invoiceId: typeof journalEntries.sourceId;
      currency: typeof journalEntryLines.currency;
      companyId: typeof journalEntries.companyId;
      received: SQL.Aliased<string>;
    },
    "invoice_payments"
  >;
  credits: SubqueryWithSelection<
    {
      invoiceId: SQL.Aliased<string>;
      companyId: typeof paymentInvoices.companyId;
      currency: typeof paymentInvoices.currency;
      credited: SQL.Aliased<string>;
    },
    "invoice_credits"
  >;
  paymentJoin: SQL | undefined;
  creditJoin: SQL | undefined;
  amountPaid: SQL<string>;
  openAmount: SQL<string>;
}

export function getInvoiceOpenBalanceParts(
  client: Pick<typeof db, "select">,
  companyId?: string,
  currency?: string,
  asOfExclusive?: Date,
): InvoiceOpenBalanceParts {
  const payments = client
    .select({
      invoiceId: journalEntries.sourceId,
      currency: journalEntryLines.currency,
      companyId: journalEntries.companyId,
      received: sql<string>`sum(${journalEntryLines.amount})`.as("received"),
    })
    .from(journalEntries)
    .innerJoin(
      journalEntryLines,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(accountNodes.id, journalEntryLines.accountId))
    .where(
      and(
        companyId ? eq(journalEntries.companyId, companyId) : undefined,
        currency ? eq(journalEntryLines.currency, currency) : undefined,
        asOfExclusive ? lt(journalEntries.date, asOfExclusive) : undefined,
        eq(accountNodes.companyId, journalEntries.companyId),
        eq(journalEntries.sourceType, JournalSourceType.AR_PAYMENT),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        isNull(journalEntries.reversalOfId),
        isNull(journalEntries.reversedById),
        eq(journalEntryLines.type, LineType.CREDIT),
        eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_RECEIVABLE),
      ),
    )
    .groupBy(
      journalEntries.sourceId,
      journalEntries.companyId,
      journalEntryLines.currency,
    )
    .as("invoice_payments");

  const originalId = sql<string>`${paymentInvoices.metadata}->>'originalInvoiceId'`;
  const credits = client
    .select({
      invoiceId: originalId.as("original_invoice_id"),
      companyId: paymentInvoices.companyId,
      currency: paymentInvoices.currency,
      credited: sql<string>`sum(-${paymentInvoices.amount})`.as("credited"),
    })
    .from(paymentInvoices)
    .where(
      and(
        companyId ? eq(paymentInvoices.companyId, companyId) : undefined,
        currency ? sql`${paymentInvoices.currency} = ${currency}` : undefined,
        asOfExclusive
          ? lt(paymentInvoices.createdAt, asOfExclusive)
          : undefined,
        eq(paymentInvoices.status, InvoiceStatus.OPEN),
        sql`${paymentInvoices.amount} < 0`,
      ),
    )
    .groupBy(originalId, paymentInvoices.companyId, paymentInvoices.currency)
    .as("invoice_credits");

  const paymentJoin = and(
    eq(payments.invoiceId, paymentInvoices.id),
    eq(payments.companyId, paymentInvoices.companyId),
    sql`${payments.currency} = ${paymentInvoices.currency}`,
  );
  const creditJoin = and(
    sql`${credits.invoiceId} = ${paymentInvoices.id}::text`,
    eq(credits.companyId, paymentInvoices.companyId),
    eq(credits.currency, paymentInvoices.currency),
  );
  const amountPaid = sql<string>`coalesce(${payments.received}, 0)`;
  const openAmount = sql<string>`greatest(0, round(${paymentInvoices.amount} - ${amountPaid} - coalesce(${credits.credited}, 0), 2))`;

  return { payments, credits, paymentJoin, creditJoin, amountPaid, openAmount };
}
