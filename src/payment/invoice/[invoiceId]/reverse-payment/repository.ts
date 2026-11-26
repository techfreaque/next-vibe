import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

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
import {
  accountingDay,
  validateJournalLines,
} from "@/chart-of-accounts/shared/journal-validation";
import { writeJournalReversal } from "@/chart-of-accounts/shared/ledger-reversal";
import {
  findOpenPeriod,
  haveCompanyAccounts,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { scopedTranslation as bankTranslation } from "@/finance/bank/i18n";
import { hasMatchedBankJournalEntry } from "@/finance/bank/reversal-guard";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceReversePaymentRequest,
  InvoiceReversePaymentResponse,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceReversePaymentRepository {
  static async reversePayment(
    invoiceId: string,
    data: InvoiceReversePaymentRequest,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InvoiceReversePaymentResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const reason = data.reason.trim();
    if (!reason || reason.length > 500) {
      return fail({
        message: t("errors.validation.description"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      const [observedInvoice] = await db
        .select({ companyId: paymentInvoices.companyId })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      const companyId = observedInvoice?.companyId;
      if (!companyId) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const scope = { companyId };
      if (!(await getDocumentAccess(userId, scope))?.canManage) {
        return fail({
          message: t("errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        if (!(await lockLedgerCompany(tx, companyId))) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(
            and(
              eq(paymentInvoices.id, invoiceId),
              eq(paymentInvoices.companyId, companyId),
            ),
          )
          .for("update");
        if (!(await getDocumentAccess(userId, scope, tx))?.canManage) {
          return fail({
            message: t("errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        const [original] = await tx
          .select()
          .from(journalEntries)
          .where(
            and(
              eq(journalEntries.id, data.paymentEntryId),
              eq(journalEntries.companyId, companyId),
              eq(journalEntries.sourceId, invoiceId),
              eq(journalEntries.sourceType, JournalSourceType.AR_PAYMENT),
            ),
          )
          .for("update");
        if (!invoice || !original || original.reversalOfId) {
          return fail({
            message: t("invalidReceipt"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (original.reversedById) {
          const [existing] = await tx
            .select({
              id: journalEntries.id,
              entryNumber: journalEntries.entryNumber,
            })
            .from(journalEntries)
            .where(
              and(
                eq(journalEntries.id, original.reversedById),
                eq(journalEntries.reversalOfId, original.id),
                eq(journalEntries.companyId, companyId),
                eq(journalEntries.sourceType, JournalSourceType.AR_PAYMENT),
                eq(journalEntries.status, JournalEntryStatus.POSTED),
              ),
            );
          if (existing) {
            return success({
              reversalId: existing.id,
              reversalEntryNumber: existing.entryNumber,
            });
          }
        }

        if (
          original.status !== JournalEntryStatus.POSTED ||
          original.reversedById ||
          Number(invoice.amount) <= 0 ||
          (invoice.status !== InvoiceStatus.OPEN &&
            invoice.status !== InvoiceStatus.PAID)
        ) {
          return fail({
            message: t("invalidReceipt"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (await hasMatchedBankJournalEntry(tx, companyId, original.id)) {
          return fail({
            message: bankTranslation.scopedT(locale).t("adjustment.release"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const now = new Date();
        const reversalDate = data.reversalDate ?? now;
        if (
          !Number.isFinite(reversalDate.getTime()) ||
          accountingDay(reversalDate) < accountingDay(original.date) ||
          accountingDay(reversalDate) > accountingDay(now)
        ) {
          return fail({
            message: t("invalidDate"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const period = await findOpenPeriod(tx, companyId, reversalDate);
        if (!period) {
          return fail({
            message: t("noPeriod"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const lines = await tx
          .select()
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, original.id))
          .orderBy(journalEntryLines.sortOrder);
        const creditLine = lines.find((line) => line.type === LineType.CREDIT);
        if (
          lines.length !== 2 ||
          !creditLine ||
          validateJournalLines(lines, invoice.currency) ||
          !(await haveCompanyAccounts(
            tx,
            companyId,
            lines.map((line) => line.accountId),
            { historical: true },
          ))
        ) {
          return fail({
            message: t("invalidLines"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [receivable] = await tx
          .select({ id: accountNodes.id })
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.id, creditLine.accountId),
              eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_RECEIVABLE),
            ),
          );
        if (
          !receivable ||
          lines.some(
            (line) =>
              line.type === LineType.DEBIT && line.accountId === receivable.id,
          )
        ) {
          return fail({
            message: t("invalidLines"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const reversal = await writeJournalReversal(tx, original, lines, {
          periodId: period.id,
          date: reversalDate,
          userId,
          memo: reason,
        });
        if (!reversal) {
          return fail({
            message: t("errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        const { payments, credits, paymentJoin, creditJoin, openAmount } =
          getInvoiceOpenBalanceParts(tx, companyId, invoice.currency);
        const [balance] = await tx
          .select({ openAmount })
          .from(paymentInvoices)
          .leftJoin(payments, paymentJoin)
          .leftJoin(credits, creditJoin)
          .where(eq(paymentInvoices.id, invoice.id));
        if (
          invoice.status === InvoiceStatus.PAID &&
          Number(balance?.openAmount) > 0
        ) {
          await tx
            .update(paymentInvoices)
            .set({ status: InvoiceStatus.OPEN, paidAt: null, updatedAt: now })
            .where(eq(paymentInvoices.id, invoice.id));
        }

        return success({
          reversalId: reversal.id,
          reversalEntryNumber: reversal.entryNumber,
        });
      });
    } catch (error) {
      logger.error("Failed to reverse invoice receipt", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
