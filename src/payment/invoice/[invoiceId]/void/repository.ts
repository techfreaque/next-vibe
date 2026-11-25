/**
 * Voids an unapplied invoice and reverses its receivable in the same transaction.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { accountingDay } from "@/chart-of-accounts/shared/journal-validation";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceVoidResponseOutput,
  InvoiceVoidUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceVoidRepository {
  static async voidInvoice(
    userId: string,
    urlPathParams: InvoiceVoidUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceVoidResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [observedInvoice] = await db
        .select({
          companyId: paymentInvoices.companyId,
          userId: paymentInvoices.userId,
        })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);
      if (!observedInvoice) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!(await getDocumentAccess(userId, observedInvoice))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        if (observedInvoice.companyId) {
          await lockLedgerCompany(tx, observedInvoice.companyId);
        }
        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
          .limit(1)
          .for("update");
        if (!invoice) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (
          invoice.companyId !== observedInvoice.companyId ||
          !(await getDocumentAccess(userId, invoice, tx))?.canManage
        ) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (
          (invoice.status !== InvoiceStatus.DRAFT &&
            invoice.status !== InvoiceStatus.OPEN) ||
          Number(invoice.amount) < 0
        ) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const today = new Date();
        if (invoice.companyId && invoice.status === InvoiceStatus.OPEN) {
          const { payments, credits, paymentJoin, creditJoin, amountPaid } =
            getInvoiceOpenBalanceParts(tx, invoice.companyId, invoice.currency);
          const [balance] = await tx
            .select({ amountPaid, credited: credits.credited })
            .from(paymentInvoices)
            .leftJoin(payments, paymentJoin)
            .leftJoin(credits, creditJoin)
            .where(eq(paymentInvoices.id, invoice.id));
          if (
            Number(balance?.amountPaid ?? 0) > 0 ||
            Number(balance?.credited ?? 0) > 0
          ) {
            return fail({
              message: t("post.errors.appliedPayments"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          const [original] = invoice.journalEntryId
            ? await tx
                .select()
                .from(journalEntries)
                .where(
                  and(
                    eq(journalEntries.id, invoice.journalEntryId),
                    eq(journalEntries.companyId, invoice.companyId),
                    eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
                    eq(journalEntries.sourceId, invoice.id),
                    eq(journalEntries.status, JournalEntryStatus.POSTED),
                  ),
                )
                .for("update")
            : [];
          if (
            !original ||
            original.reversedById ||
            original.reversalOfId ||
            accountingDay(today) < accountingDay(original.date)
          ) {
            return fail({
              message: t("post.errors.reversalPosting"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          const lines = await tx
            .select()
            .from(journalEntryLines)
            .where(eq(journalEntryLines.journalEntryId, original.id))
            .orderBy(journalEntryLines.sortOrder, journalEntryLines.id);

          const reversalId = await postJournalEntry(
            {
              companyId: invoice.companyId,
              date: today,
              description: `AR invoice reversal: ${invoice.id}`,
              sourceType: JournalSourceType.AR_INVOICE,
              sourceId: invoice.id,
              postedByUserId: userId,
              lines: lines.map((line) => ({
                subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                accountNodeId: line.accountId,
                type:
                  line.type === LineType.DEBIT
                    ? LineType.CREDIT
                    : LineType.DEBIT,
                currency: line.currency,
                amount: line.amount,
                description: line.description ?? undefined,
              })),
              logger,
            },
            tx,
          );
          if (!reversalId) {
            return fail({
              message: t("post.errors.reversalPosting"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          await tx
            .update(journalEntries)
            .set({ reversalOfId: original.id, updatedAt: today })
            .where(eq(journalEntries.id, reversalId));
          await tx
            .update(journalEntries)
            .set({
              reversedById: reversalId,
              status: JournalEntryStatus.REVERSED,
              updatedAt: today,
            })
            .where(eq(journalEntries.id, original.id));
        }

        await tx
          .update(paymentInvoices)
          .set({ status: InvoiceStatus.VOID, updatedAt: today })
          .where(eq(paymentInvoices.id, invoice.id));

        logger.debug("Invoice voided", { invoiceId: invoice.id, userId });
        return success({ success: true, message: null });
      });
    } catch (error) {
      logger.error("Failed to void invoice", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
