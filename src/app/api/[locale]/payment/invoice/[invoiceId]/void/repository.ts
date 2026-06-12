/**
 * Invoice Void Repository
 * Transitions a DRAFT or OPEN invoice to VOID status.
 * If a journal entry exists, creates a reversal entry.
 *
 * Status transitions: DRAFT→VOID, OPEN→VOID
 * Blocked: PAID invoices cannot be voided.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  accountingPeriods,
  journalEntries,
  journalEntryLines,
} from "@/app/api/[locale]/chart-of-accounts/db";
import {
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/app/api/[locale]/chart-of-accounts/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { scopedTranslation } from "./i18n";
import type {
  InvoiceVoidUrlPathParams,
  InvoiceVoidResponseOutput,
} from "./definition";

export class InvoiceVoidRepository {
  static async voidInvoice(
    userId: string,
    urlPathParams: InvoiceVoidUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceVoidResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (invoice.userId !== userId) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // PAID invoices cannot be voided
      if (
        invoice.status !== InvoiceStatus.DRAFT &&
        invoice.status !== InvoiceStatus.OPEN
      ) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // --- Reverse journal entry if one exists (best-effort) ---
      if (invoice.journalEntryId && invoice.companyId) {
        try {
          await InvoiceVoidRepository.tryReverseJournalEntry(
            invoice.journalEntryId,
            invoice.id,
            invoice.companyId,
            invoice.currency,
            userId,
            logger,
          );
        } catch (journalError) {
          logger.warn("Journal reversal failed — invoice void continues", {
            invoiceId: invoice.id,
            journalEntryId: invoice.journalEntryId,
            error: parseError(journalError).message,
          });
        }
      }

      // --- Transition invoice to VOID ---
      await db
        .update(paymentInvoices)
        .set({
          status: InvoiceStatus.VOID,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId));

      logger.debug("Invoice voided", {
        invoiceId: urlPathParams.invoiceId,
        userId,
        previousStatus: invoice.status,
      });

      return success({
        success: true,
        message: null,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to void invoice", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Creates a reversal journal entry for the original invoice journal entry.
   * Mirrors the original lines with flipped DEBIT/CREDIT.
   * Never throws — caller wraps in try/catch.
   */
  private static async tryReverseJournalEntry(
    originalEntryId: string,
    invoiceId: string,
    companyId: string,
    currency: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    // Load original journal entry lines
    const originalLines = await db
      .select()
      .from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, originalEntryId));

    if (originalLines.length === 0) {
      logger.debug("No journal entry lines found for reversal", {
        originalEntryId,
      });
      return;
    }

    // Find an open accounting period for today
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
        "No open accounting period found — skipping journal reversal",
        { companyId, today },
      );
      return;
    }

    // Generate reversal entry number
    const year = today.getFullYear();
    const [{ value: existingCount }] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(journalEntries)
      .where(eq(journalEntries.periodId, openPeriod.id));

    const entrySeq = (existingCount ?? 0) + 1;
    const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

    // Mark the original entry as REVERSED
    await db
      .update(journalEntries)
      .set({
        status: JournalEntryStatus.REVERSED,
        updatedAt: today,
      })
      .where(eq(journalEntries.id, originalEntryId));

    // Insert reversal journal entry
    const [reversalEntry] = await db
      .insert(journalEntries)
      .values({
        companyId,
        periodId: openPeriod.id,
        entryNumber,
        date: today,
        description: `AR Invoice Void Reversal — ${invoiceId}`,
        status: JournalEntryStatus.DRAFT,
        sourceType: JournalSourceType.AR_INVOICE,
        sourceId: invoiceId,
      })
      .returning({ id: journalEntries.id });

    if (!reversalEntry) {
      return;
    }

    // Insert reversed lines (flip DEBIT↔CREDIT)
    for (const line of originalLines) {
      const flippedType =
        line.type === LineType.DEBIT ? LineType.CREDIT : LineType.DEBIT;

      await db.insert(journalEntryLines).values({
        journalEntryId: reversalEntry.id,
        accountId: line.accountId,
        type: flippedType,
        amount: line.amount,
        currency,
        description: `Reversal: ${line.description ?? ""}`,
        sortOrder: line.sortOrder ?? 0,
      });
    }

    // Mark reversal as POSTED
    await db
      .update(journalEntries)
      .set({
        status: JournalEntryStatus.POSTED,
        postedAt: today,
        postedByUserId: userId,
        updatedAt: today,
      })
      .where(eq(journalEntries.id, reversalEntry.id));

    logger.info("Journal entry reversed for voided AR invoice", {
      invoiceId,
      originalEntryId,
      reversalEntryId: reversalEntry.id,
      entryNumber,
    });
  }
}
