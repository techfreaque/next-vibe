/**
 * Queue a fiscal receipt for a completed POS order, inside the completion
 * transaction. The receipt number (poradové číslo) is sequential per company;
 * the provider row is locked so concurrent sales cannot take the same number.
 */

import "server-only";

import { asc, eq, max } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { companies } from "@/companies/db";

import { posOrderItems, posOrders, posPayments } from "../db";
import {
  DEFAULT_OFFLINE_DEADLINE_HOURS,
  type PosFiscalProvider,
  posFiscalProviders,
  posFiscalReceipts,
} from "./db";
import { FiscalReceiptStatus } from "./enum";
import { buildFiscalReceiptData } from "./receipt-data";

type FiscalTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const HOUR_MS = 3_600_000;

export function sendDeadlineFor(
  issuedAt: Date,
  settings: PosFiscalProvider["settings"] | null,
): Date {
  const hours =
    settings && settings.offlineDeadlineHours > 0
      ? settings.offlineDeadlineHours
      : DEFAULT_OFFLINE_DEADLINE_HOURS;
  return new Date(issuedAt.getTime() + hours * HOUR_MS);
}

export async function enqueueFiscalReceipt(
  tx: FiscalTransaction,
  input: {
    orderId: string;
    companyId: string;
    provider: PosFiscalProvider;
    issuedAt: Date;
  },
): Promise<{ receiptId: string; receiptNumber: number } | null> {
  const [provider] = await tx
    .select({ id: posFiscalProviders.id })
    .from(posFiscalProviders)
    .where(eq(posFiscalProviders.id, input.provider.id))
    .for("update");
  const [order] = await tx
    .select({
      orderNumber: posOrders.orderNumber,
      currency: posOrders.currency,
      total: posOrders.total,
    })
    .from(posOrders)
    .where(eq(posOrders.id, input.orderId));
  const [company] = await tx
    .select({
      name: companies.name,
      taxId: companies.taxId,
      registrationNumber: companies.registrationNumber,
      vatNumber: companies.vatNumber,
    })
    .from(companies)
    .where(eq(companies.id, input.companyId));
  if (!provider || !order || !company) {
    return null;
  }
  const items = await tx
    .select({
      description: posOrderItems.description,
      quantity: posOrderItems.quantity,
      unitPrice: posOrderItems.unitPrice,
      taxRate: posOrderItems.taxRate,
      taxAmount: posOrderItems.taxAmount,
      lineTotal: posOrderItems.lineTotal,
    })
    .from(posOrderItems)
    .where(eq(posOrderItems.orderId, input.orderId))
    .orderBy(asc(posOrderItems.sortOrder), asc(posOrderItems.createdAt));
  const payments = await tx
    .select({
      method: posPayments.method,
      amount: posPayments.amount,
      change: posPayments.change,
    })
    .from(posPayments)
    .where(eq(posPayments.orderId, input.orderId));
  const [last] = await tx
    .select({ value: max(posFiscalReceipts.receiptNumber) })
    .from(posFiscalReceipts)
    .where(eq(posFiscalReceipts.companyId, input.companyId));
  const receiptNumber = (last?.value ?? 0) + 1;
  const payload = buildFiscalReceiptData({
    order,
    items,
    payments,
    company,
    cashRegisterCode: input.provider.cashRegisterCode,
    receiptNumber,
    issuedAt: input.issuedAt,
  });
  const [receipt] = await tx
    .insert(posFiscalReceipts)
    .values({
      companyId: input.companyId,
      orderId: input.orderId,
      providerId: input.provider.id,
      status: FiscalReceiptStatus.PENDING,
      receiptNumber,
      issuedAt: input.issuedAt,
      payload,
      sendDeadline: sendDeadlineFor(input.issuedAt, input.provider.settings),
    })
    .returning({ id: posFiscalReceipts.id });
  return receipt ? { receiptId: receipt.id, receiptNumber } : null;
}
