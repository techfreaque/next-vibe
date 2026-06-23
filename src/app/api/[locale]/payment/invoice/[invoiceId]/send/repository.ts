/**
 * Invoice Send Repository
 * Transitions a draft invoice to Open status and posts a journal entry
 *
 * Journal posting on send (DRAFT → OPEN):
 *   Dr: AR accountNode (company's ACCOUNTS_RECEIVABLE node)
 *   Cr: Revenue accountNode (REVENUE_SERVICE or REVENUE_SALES)
 *   Cr: VAT Payable (if tax amount > 0)
 *
 * Only posts if accounts are found. Never blocks the send if accounts missing.
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
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { generateInvoiceViewToken } from "../../token";
import type {
  InvoiceSendResponseOutput,
  InvoiceSendUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceSendRepository {
  static async sendInvoice(
    userId: string,
    urlPathParams: InvoiceSendUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceSendResponseOutput>> {
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

      if (invoice.status !== InvoiceStatus.DRAFT) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // --- Journal entry posting (best-effort, never blocks send) ---
      let journalEntryId: string | null = null;

      if (invoice.companyId) {
        try {
          journalEntryId = await InvoiceSendRepository.tryPostJournalEntry(
            invoice.id,
            invoice.companyId,
            invoice.currency,
            userId,
            logger,
          );
        } catch (journalError) {
          logger.warn("Journal entry posting failed — invoice send continues", {
            invoiceId: invoice.id,
            error: parseError(journalError).message,
          });
        }
      }

      // --- Transition invoice to OPEN ---
      await db
        .update(paymentInvoices)
        .set({
          status: InvoiceStatus.OPEN,
          journalEntryId: journalEntryId ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId));

      // Generate public view token for customer link
      const viewToken = generateInvoiceViewToken(urlPathParams.invoiceId);
      const viewUrl = `${env.NEXT_PUBLIC_APP_URL}/invoice/${urlPathParams.invoiceId}?token=${viewToken}`;

      logger.debug("Invoice sent", {
        invoiceId: urlPathParams.invoiceId,
        userId,
        journalEntryId,
        viewUrl,
      });

      return success({
        success: true,
        message: null,
        viewUrl,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to send invoice", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Attempts to create and post a journal entry for this AR invoice.
   * Returns the journal entry ID on success, null if accounts or period not found.
   * Never throws — caller wraps in try/catch.
   */
  private static async tryPostJournalEntry(
    invoiceId: string,
    companyId: string,
    currency: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    // Sum all line totals (gross) and tax amounts from invoice lines
    const lines = await db
      .select({
        lineTotal: paymentInvoiceLines.lineTotal,
        taxAmount: paymentInvoiceLines.taxAmount,
      })
      .from(paymentInvoiceLines)
      .where(eq(paymentInvoiceLines.invoiceId, invoiceId));

    if (lines.length === 0) {
      return null;
    }

    const totalGross = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const totalTax = lines.reduce((sum, l) => sum + l.taxAmount, 0);
    const totalNet = totalGross - totalTax;

    if (totalGross <= 0) {
      return null;
    }

    // Find AR account node for this company
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
      logger.debug("No AR account node found — skipping journal entry", {
        companyId,
      });
      return null;
    }

    // Find Revenue account (prefer REVENUE_SERVICE, fall back to REVENUE_SALES)
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

    const [revenueSalesAccount] = revenueAccount
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

    const finalRevenueAccount = revenueAccount ?? revenueSalesAccount;

    if (!finalRevenueAccount) {
      logger.debug("No Revenue account node found — skipping journal entry", {
        companyId,
      });
      return null;
    }

    // Find VAT Payable account (only needed if tax > 0)
    let vatAccount: { id: string } | undefined;
    if (totalTax > 0) {
      const [vat] = await db
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.subtype, AccountSubtype.VAT_PAYABLE),
            eq(accountNodes.isActive, true),
            eq(accountNodes.isPostable, true),
          ),
        )
        .limit(1);
      vatAccount = vat;
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
      logger.debug("No open accounting period found — skipping journal entry", {
        companyId,
        today,
      });
      return null;
    }

    // Generate entry number
    const year = today.getFullYear();
    const [{ value: existingCount }] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(journalEntries)
      .where(eq(journalEntries.periodId, openPeriod.id));

    const entrySeq = (existingCount ?? 0) + 1;
    const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

    // Insert journal entry (DRAFT then immediately POSTED)
    const [entry] = await db
      .insert(journalEntries)
      .values({
        companyId,
        periodId: openPeriod.id,
        entryNumber,
        date: today,
        description: `AR Invoice ${invoiceId}`,
        status: JournalEntryStatus.DRAFT,
        sourceType: JournalSourceType.AR_INVOICE,
        sourceId: invoiceId,
      })
      .returning({ id: journalEntries.id });

    if (!entry) {
      return null;
    }

    let sortOrder = 0;

    // Dr: AR (total gross)
    await db.insert(journalEntryLines).values({
      journalEntryId: entry.id,
      accountId: arAccount.id,
      type: LineType.DEBIT,
      amount: totalGross,
      currency,
      description: "AR Invoice — receivable",
      sortOrder: sortOrder++,
    });

    // Cr: Revenue (net of tax)
    await db.insert(journalEntryLines).values({
      journalEntryId: entry.id,
      accountId: finalRevenueAccount.id,
      type: LineType.CREDIT,
      amount: totalTax > 0 ? totalNet : totalGross,
      currency,
      description: "AR Invoice — revenue",
      sortOrder: sortOrder++,
    });

    // Cr: VAT Payable (if tax > 0 and account found)
    if (totalTax > 0 && vatAccount) {
      await db.insert(journalEntryLines).values({
        journalEntryId: entry.id,
        accountId: vatAccount.id,
        type: LineType.CREDIT,
        amount: totalTax,
        currency,
        description: "AR Invoice — VAT payable",
        sortOrder: sortOrder++,
      });
    } else if (totalTax > 0 && !vatAccount) {
      // No VAT account — credit all to revenue to keep books balanced
      await db
        .update(journalEntryLines)
        .set({
          amount: totalGross,
        })
        .where(
          and(
            eq(journalEntryLines.journalEntryId, entry.id),
            eq(journalEntryLines.accountId, finalRevenueAccount.id),
          ),
        );
    }

    // Mark as POSTED
    await db
      .update(journalEntries)
      .set({
        status: JournalEntryStatus.POSTED,
        postedAt: today,
        postedByUserId: userId,
        updatedAt: today,
      })
      .where(eq(journalEntries.id, entry.id));

    logger.info("Journal entry posted for AR invoice", {
      invoiceId,
      journalEntryId: entry.id,
      entryNumber,
    });

    return entry.id;
  }
}
