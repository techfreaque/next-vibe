import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "next-vibe/database";

import { invoiceReminderDrafts } from "./db";

export async function listInvoiceReminders(
  invoiceId: string,
  companyId: string | null,
): Promise<
  {
    id: string;
    preparedAt: string;
    dueDate: string;
    currency: string;
    amount: string;
    note: string | null;
  }[]
> {
  const rows = await db
    .select({
      id: invoiceReminderDrafts.id,
      preparedAt: invoiceReminderDrafts.preparedAt,
      dueDate: invoiceReminderDrafts.dueDate,
      currency: invoiceReminderDrafts.currency,
      amount: invoiceReminderDrafts.amount,
      note: invoiceReminderDrafts.note,
    })
    .from(invoiceReminderDrafts)
    .where(
      and(
        eq(invoiceReminderDrafts.invoiceId, invoiceId),
        companyId
          ? eq(invoiceReminderDrafts.companyId, companyId)
          : isNull(invoiceReminderDrafts.companyId),
      ),
    )
    .orderBy(
      desc(invoiceReminderDrafts.preparedAt),
      desc(invoiceReminderDrafts.id),
    )
    .limit(20);
  return rows.map((row) => ({
    ...row,
    preparedAt: row.preparedAt.toISOString(),
  }));
}
