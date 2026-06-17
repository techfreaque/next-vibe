/**
 * Credit Note Create Repository
 * Creates a negative invoice linked to the original invoice.
 *
 * If no line items supplied → full credit: negates all lines from original invoice.
 * If line items supplied → partial credit: uses provided lines.
 *
 * Journal entry on create:
 *   Dr: Revenue (net amount, negative invoice = reduces revenue already posted)
 *   Cr: AR (reduces what customer owes)
 */

import "server-only";

import { and, eq, max, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/app/api/[locale]/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/app/api/[locale]/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { CurrenciesArr, defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  CreditNoteCreateRequestOutput,
  CreditNoteCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CreditNoteCreateRepository {
  static async createCreditNote(
    userId: string,
    data: CreditNoteCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CreditNoteCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Require ACCOUNTANT or higher
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Load the original invoice
      const [original] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, data.invoiceId))
        .limit(1);

      if (!original) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only OPEN or PAID invoices can be credited
      if (
        original.status !== InvoiceStatus.OPEN &&
        original.status !== InvoiceStatus.PAID
      ) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const rawCurrency = original.currency;
      const currency = (CurrenciesArr as readonly string[]).includes(
        rawCurrency,
      )
        ? (rawCurrency as (typeof CurrenciesArr)[number])
        : "EUR";

      // Determine credit lines (full or partial)
      interface CreditLine {
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        taxAmount: number;
        lineTotal: number;
      }

      let creditLines: CreditLine[] = [];

      if (!data.lineItems || data.lineItems.length === 0) {
        // Full credit — negate all lines from the original invoice
        const origLines = await db
          .select()
          .from(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.invoiceId, original.id));

        creditLines = origLines.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: -Math.abs(l.unitPrice),
          taxRate: l.taxRate ?? 0,
          taxAmount: -Math.abs(l.taxAmount),
          lineTotal: -Math.abs(l.lineTotal),
        }));
      } else {
        // Partial credit — compute from provided line items
        creditLines = data.lineItems.map((l) => {
          const qty = l.quantity;
          const price = -Math.abs(l.unitPrice);
          const taxRate = l.taxRate ?? 0;
          const lineNet = qty * price;
          const taxAmount = lineNet * (taxRate / 100);
          const lineTotal = lineNet + taxAmount;
          return {
            description: l.description,
            quantity: qty,
            unitPrice: price,
            taxRate,
            taxAmount,
            lineTotal,
          };
        });
      }

      const totalAmount = creditLines.reduce((s, l) => s + l.lineTotal, 0);

      // Auto-generate sequence number per company
      const [{ value: maxSeq }] = await db
        .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, data.companyId));

      const nextSeq = (maxSeq ?? 0) + 1;
      const cnId = `CN-${data.companyId.slice(0, 8)}-${String(nextSeq).padStart(6, "0")}`;

      // Insert credit note invoice (negative amount, OPEN status)
      const [creditNote] = await db
        .insert(paymentInvoices)
        .values({
          userId,
          companyId: data.companyId,
          providerInvoiceId: cnId,
          invoiceSequenceNumber: nextSeq,
          currency,
          status: InvoiceStatus.OPEN,
          amount: totalAmount.toString(),
          notes: `Credit note for invoice ${data.invoiceId}. Reason: ${data.reason}`,
          metadata: { originalInvoiceId: data.invoiceId, reason: data.reason },
        })
        .returning();

      if (!creditNote) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Insert credit lines
      for (let i = 0; i < creditLines.length; i++) {
        const cl = creditLines[i];
        if (!cl) {
          continue;
        }
        await db.insert(paymentInvoiceLines).values({
          invoiceId: creditNote.id,
          description: cl.description,
          quantity: cl.quantity,
          unitPrice: cl.unitPrice,
          taxRate: cl.taxRate,
          taxAmount: cl.taxAmount,
          lineTotal: cl.lineTotal,
          sortOrder: i,
        });
      }

      // Post reversal journal entry (best-effort)
      if (totalAmount !== 0) {
        try {
          await CreditNoteCreateRepository.tryPostReversalJournalEntry(
            creditNote.id,
            data.companyId,
            currency,
            totalAmount,
            userId,
            logger,
          );
        } catch (journalError) {
          logger.warn(
            "Credit note journal posting failed — credit note still created",
            {
              creditNoteId: creditNote.id,
              error: parseError(journalError).message,
            },
          );
        }
      }

      logger.debug("Credit note created", {
        creditNoteId: creditNote.id,
        originalInvoiceId: data.invoiceId,
        totalAmount,
        linesCount: creditLines.length,
      });

      return success({
        success: true,
        message: null,
        creditNote: {
          id: creditNote.id,
          invoiceId: data.invoiceId,
          companyId: creditNote.companyId ?? null,
          currency: creditNote.currency,
          status: creditNote.status,
          amount: totalAmount.toString(),
          reason: data.reason,
          createdAt: creditNote.createdAt.toISOString(),
          updatedAt: creditNote.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to create credit note", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Posts the reversal journal entry for a credit note.
   * Dr: Revenue (negative = reduces revenue)
   * Cr: AR (negative = reduces receivable)
   * Never throws.
   */
  private static async tryPostReversalJournalEntry(
    creditNoteId: string,
    companyId: string,
    currency: string,
    totalAmount: number,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    const absAmount = Math.abs(totalAmount);

    // Find AR account
    const [arAccount] = await db
      .select({ id: accountNodes.id })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_RECEIVABLE),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .limit(1);

    if (!arAccount) {
      logger.debug(
        "No AR account node found — skipping credit note journal entry",
        { companyId },
      );
      return;
    }

    // Find Revenue account
    const [revenueAccount] = await db
      .select({ id: accountNodes.id })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.subtype, AccountSubtype.REVENUE_SERVICE),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .limit(1);

    const [revenueFallback] = revenueAccount
      ? [revenueAccount]
      : await db
          .select({ id: accountNodes.id })
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.companyId, companyId),
              eq(accountNodes.subtype, AccountSubtype.REVENUE_SALES),
              eq(accountNodes.isActive, true),
              eq(accountNodes.isPostable, true),
            ),
          )
          .limit(1);

    const finalRevenueAccount = revenueAccount ?? revenueFallback;

    if (!finalRevenueAccount) {
      logger.debug(
        "No Revenue account node found — skipping credit note journal entry",
        { companyId },
      );
      return;
    }

    // Find open accounting period
    const today = new Date();
    const [openPeriod] = await db
      .select({ id: accountingPeriods.id })
      .from(accountingPeriods)
      .where(
        and(
          eq(accountingPeriods.companyId, companyId),
          eq(accountingPeriods.status, PeriodStatus.OPEN),
          sql`${accountingPeriods.startDate} <= ${today}`,
          sql`${accountingPeriods.endDate} >= ${today}`,
        ),
      )
      .limit(1);

    if (!openPeriod) {
      logger.debug(
        "No open accounting period — skipping credit note journal entry",
        { companyId },
      );
      return;
    }

    const year = today.getFullYear();
    const [{ value: existingCount }] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(journalEntries)
      .where(eq(journalEntries.periodId, openPeriod.id));

    const entrySeq = (existingCount ?? 0) + 1;
    const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

    const [entry] = await db
      .insert(journalEntries)
      .values({
        companyId,
        periodId: openPeriod.id,
        entryNumber,
        date: today,
        description: `AR Credit Note ${creditNoteId}`,
        status: JournalEntryStatus.DRAFT,
        sourceType: JournalSourceType.AR_INVOICE,
        sourceId: creditNoteId,
      })
      .returning({ id: journalEntries.id });

    if (!entry) {
      return;
    }

    // Dr: Revenue (credit note reduces revenue)
    await db.insert(journalEntryLines).values({
      journalEntryId: entry.id,
      accountId: finalRevenueAccount.id,
      type: LineType.DEBIT,
      amount: absAmount,
      currency,
      description: "Credit note — revenue reduction",
      sortOrder: 0,
    });

    // Cr: AR (credit note reduces receivable)
    await db.insert(journalEntryLines).values({
      journalEntryId: entry.id,
      accountId: arAccount.id,
      type: LineType.CREDIT,
      amount: absAmount,
      currency,
      description: "Credit note — AR reduction",
      sortOrder: 1,
    });

    await db
      .update(journalEntries)
      .set({
        status: JournalEntryStatus.POSTED,
        postedAt: today,
        postedByUserId: userId,
        updatedAt: today,
      })
      .where(eq(journalEntries.id, entry.id));

    logger.info("Credit note journal entry posted", {
      creditNoteId,
      journalEntryId: entry.id,
      entryNumber,
      amount: absAmount,
    });
  }
}
