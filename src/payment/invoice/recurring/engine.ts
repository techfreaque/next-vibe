/**
 * Recurring Invoices Engine
 *
 * Pure date advancement + transactional schedule runner.
 * Disabled by default per company (`company_payment_settings.recurring_invoices_enabled`)
 * AND per schedule (`recurring_invoice_schedules.is_enabled`).
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, asc, eq, lte, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  companyPaymentSettings,
  paymentInvoiceLines,
  paymentInvoices,
  recurringInvoiceSchedules,
} from "@/payment/db";
import { DocumentDeliveryService } from "@/payment/document-delivery/service";
import { InvoiceStatus } from "@/payment/enum";
import { InvoiceSendRepository } from "@/payment/invoice/[invoiceId]/send/repository";

export type RecurringFrequency = "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * Advances a YYYY-MM-DD date by 1 month, 3 months, or 12 months,
 * clamping to the last valid day of the target month (e.g. Jan 31 -> Feb 28).
 */
export function advanceRecurringDate(
  isoDate: string,
  frequency: RecurringFrequency,
): string {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr); // 1-12
  const day = Number(dayStr);

  const monthsToAdd =
    frequency === "YEARLY" ? 12 : frequency === "QUARTERLY" ? 3 : 1;
  const totalMonths = year * 12 + (month - 1) + monthsToAdd;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = (totalMonths % 12) + 1; // 1-12
  const daysInTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth, 0),
  ).getUTCDate();
  const clampedDay = Math.min(day, daysInTargetMonth);

  return `${String(targetYear).padStart(4, "0")}-${String(targetMonth).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`;
}

export interface RecurringRunItem {
  scheduleId: string;
  companyId: string;
  title: string;
  runDate: string;
  nextRunDate: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  status: "preview" | "created" | "issued" | "skipped_ended" | "failed";
  error?: string;
}

export interface RecurringRunSummary {
  preview: boolean;
  processedCount: number;
  issuedCount: number;
  failedCount: number;
  items: RecurringRunItem[];
}

export async function runDueRecurringInvoices(params: {
  companyId?: string;
  asOfDate?: string;
  dryRun: boolean;
  actorUserId?: string;
  logger: EndpointLogger;
  locale?: CountryLanguage;
}): Promise<RecurringRunSummary> {
  const locale = params.locale ?? defaultLocale;
  const todayIso = params.asOfDate ?? new Date().toISOString().slice(0, 10);

  const dueRows = await db
    .select({
      schedule: recurringInvoiceSchedules,
      companyEnabled: companyPaymentSettings.recurringInvoicesEnabled,
    })
    .from(recurringInvoiceSchedules)
    .innerJoin(
      companyPaymentSettings,
      eq(companyPaymentSettings.companyId, recurringInvoiceSchedules.companyId),
    )
    .where(
      and(
        eq(companyPaymentSettings.recurringInvoicesEnabled, true),
        eq(recurringInvoiceSchedules.isEnabled, true),
        lte(recurringInvoiceSchedules.nextRunDate, todayIso),
        params.companyId
          ? eq(recurringInvoiceSchedules.companyId, params.companyId)
          : undefined,
      ),
    )
    .orderBy(asc(recurringInvoiceSchedules.nextRunDate));

  const items: RecurringRunItem[] = [];
  let issuedCount = 0;
  let failedCount = 0;

  for (const row of dueRows) {
    const sched = row.schedule;
    if (sched.endDate && sched.nextRunDate > sched.endDate) {
      if (!params.dryRun) {
        await db
          .update(recurringInvoiceSchedules)
          .set({ isEnabled: false, updatedAt: new Date() })
          .where(eq(recurringInvoiceSchedules.id, sched.id));
      }
      items.push({
        scheduleId: sched.id,
        companyId: sched.companyId,
        title: sched.title,
        runDate: sched.nextRunDate,
        nextRunDate: sched.nextRunDate,
        invoiceId: null,
        invoiceNumber: null,
        status: "skipped_ended",
      });
      continue;
    }

    const nextDate = advanceRecurringDate(sched.nextRunDate, sched.frequency);
    const willEnd = Boolean(sched.endDate && nextDate > sched.endDate);

    if (params.dryRun) {
      items.push({
        scheduleId: sched.id,
        companyId: sched.companyId,
        title: sched.title,
        runDate: sched.nextRunDate,
        nextRunDate: nextDate,
        invoiceId: null,
        invoiceNumber: null,
        status: "preview",
      });
      continue;
    }

    const actorId = params.actorUserId ?? sched.createdByUserId;
    if (!actorId) {
      failedCount += 1;
      items.push({
        scheduleId: sched.id,
        companyId: sched.companyId,
        title: sched.title,
        runDate: sched.nextRunDate,
        nextRunDate: nextDate,
        invoiceId: null,
        invoiceNumber: null,
        status: "failed",
        error: "No actor user configured for schedule",
      });
      continue;
    }

    const computedLines = sched.lineTemplates.map((tmpl, idx) => {
      const net = Math.round(tmpl.quantity * tmpl.unitPrice * 100) / 100;
      const tax = Math.round(net * tmpl.taxRate * 100) / 100;
      const gross = Math.round((net + tax) * 100) / 100;
      return {
        description: tmpl.description,
        productId: tmpl.productId ?? null,
        quantity: tmpl.quantity,
        unitPrice: tmpl.unitPrice,
        taxRate: tmpl.taxRate,
        taxAmount: tax,
        lineTotal: gross,
        sortOrder: idx,
      };
    });

    const totalCents = computedLines.reduce(
      (sum, l) => sum + Math.round(l.lineTotal * 100),
      0,
    );
    const totalAmount = (totalCents / 100).toFixed(2);

    const [seqRow] = await db
      .select({
        maxSeq: sql<number>`coalesce(max(${paymentInvoices.invoiceSequenceNumber}), 0)::int`,
      })
      .from(paymentInvoices)
      .where(eq(paymentInvoices.companyId, sched.companyId));
    const nextSeq = (seqRow?.maxSeq ?? 0) + 1;
    const invoiceNumber = `INV-${sched.nextRunDate.slice(0, 4)}-${String(nextSeq).padStart(4, "0")}`;
    const invoiceId = randomUUID();
    const dueDate = new Date(
      new Date(`${sched.nextRunDate}T00:00:00Z`).getTime() +
        sched.dueDays * 86_400_000,
    );

    await db.insert(paymentInvoices).values({
      id: invoiceId,
      userId: actorId,
      companyId: sched.companyId,
      providerInvoiceId: `rec-${invoiceId}`,
      invoiceNumber,
      invoiceSequenceNumber: nextSeq,
      amount: totalAmount,
      currency: sched.currency,
      status: InvoiceStatus.DRAFT,
      dueDate,
      notes: sched.notes,
      metadata: {
        customerId: sched.customerId ?? undefined,
        customerName: sched.customerName,
        customerEmail: sched.customerEmail ?? undefined,
        recurringScheduleId: sched.id,
      },
    });

    await db.insert(paymentInvoiceLines).values(
      computedLines.map((line) => ({
        invoiceId,
        description: line.description,
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate,
        taxAmount: line.taxAmount,
        lineTotal: line.lineTotal,
        sortOrder: line.sortOrder,
      })),
    );

    let status: RecurringRunItem["status"] = "created";
    let errMsg: string | undefined;

    if (sched.autoIssue) {
      const issued = await InvoiceSendRepository.sendInvoice(
        actorId,
        { invoiceId },
        params.logger,
        locale,
      );
      if (issued.success) {
        status = "issued";
        issuedCount += 1;
        if (sched.autoSendEmail && sched.customerEmail) {
          await DocumentDeliveryService.sendDocumentEmail({
            documentType: "invoice",
            documentId: invoiceId,
            recipientEmail: sched.customerEmail,
            recipientName: sched.customerName,
            userId: actorId,
            locale,
            logger: params.logger,
          });
        }
      } else {
        status = "failed";
        failedCount += 1;
        errMsg = issued.message;
      }
    }

    await db
      .update(recurringInvoiceSchedules)
      .set({
        lastRunAt: new Date(),
        lastInvoiceId: invoiceId,
        nextRunDate: nextDate,
        isEnabled: willEnd ? false : sched.isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(recurringInvoiceSchedules.id, sched.id));

    items.push({
      scheduleId: sched.id,
      companyId: sched.companyId,
      title: sched.title,
      runDate: sched.nextRunDate,
      nextRunDate: nextDate,
      invoiceId,
      invoiceNumber,
      status,
      error: errMsg,
    });
  }

  return {
    preview: params.dryRun,
    processedCount: items.length,
    issuedCount,
    failedCount,
    items,
  };
}
