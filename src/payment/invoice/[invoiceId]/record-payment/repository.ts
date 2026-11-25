/**
 * Records a manual payment against an open receivable.
 */

import "server-only";

import { createHash } from "node:crypto";

import { and, eq, inArray } from "drizzle-orm";
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
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentInvoiceReceipts, paymentInvoices } from "../../../db";
import { InvoiceStatus, ManualPaymentMethod } from "../../../enum";
import type {
  InvoiceRecordPaymentRequestOutput,
  InvoiceRecordPaymentResponseOutput,
  InvoiceRecordPaymentUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceRecordPaymentRepository {
  static async recordPayment(
    userId: string,
    urlPathParams: InvoiceRecordPaymentUrlPathParams,
    data: InvoiceRecordPaymentRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceRecordPaymentResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const paidCents = Math.round(data.amount * 100);
      if (
        !Number.isSafeInteger(paidCents) ||
        paidCents <= 0 ||
        paidCents / 100 !== data.amount
      ) {
        return fail({
          message: t("post.errors.paymentPrecision"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const requestedPaidAt = data.paidAt ? new Date(data.paidAt) : undefined;
      if (requestedPaidAt && !Number.isFinite(requestedPaidAt.getTime())) {
        return fail({
          message: t("post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

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
        const receiptIdentity = data.receiptKey
          ? {
              scopeId: invoice.companyId ?? invoice.id,
              isCompanyScope: invoice.companyId !== null,
              receiptKey: data.receiptKey,
              requestDigest: createHash("sha256")
                .update(
                  JSON.stringify([
                    "v1",
                    invoice.id,
                    paidCents,
                    data.method,
                    requestedPaidAt?.toISOString() ?? null,
                    data.accountNodeId?.toLowerCase() ?? null,
                  ]),
                )
                .digest("hex"),
            }
          : undefined;
        if (receiptIdentity) {
          const [prior] = await tx
            .select({
              invoiceId: paymentInvoiceReceipts.invoiceId,
              requestDigest: paymentInvoiceReceipts.requestDigest,
              response: paymentInvoiceReceipts.response,
            })
            .from(paymentInvoiceReceipts)
            .where(
              and(
                eq(paymentInvoiceReceipts.scopeId, receiptIdentity.scopeId),
                eq(
                  paymentInvoiceReceipts.isCompanyScope,
                  receiptIdentity.isCompanyScope,
                ),
                eq(
                  paymentInvoiceReceipts.receiptKey,
                  receiptIdentity.receiptKey,
                ),
              ),
            )
            .limit(1);

          if (prior) {
            if (
              prior.invoiceId !== invoice.id ||
              prior.requestDigest !== receiptIdentity.requestDigest
            ) {
              return fail({
                message: t("post.errors.receiptKeyConflict"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
            return success(prior.response);
          }
        }

        if (
          invoice.status !== InvoiceStatus.OPEN ||
          Number(invoice.amount) <= 0
        ) {
          return fail({
            message: t("post.errors.paymentStatus"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const paidAt = requestedPaidAt ?? new Date();
        let openCents = Math.round(Number(invoice.amount) * 100);
        if (invoice.companyId) {
          const { payments, credits, paymentJoin, creditJoin, openAmount } =
            getInvoiceOpenBalanceParts(tx, invoice.companyId, invoice.currency);
          const [balance] = await tx
            .select({ openAmount })
            .from(paymentInvoices)
            .leftJoin(payments, paymentJoin)
            .leftJoin(credits, creditJoin)
            .where(eq(paymentInvoices.id, invoice.id));
          openCents = Math.round(Number(balance?.openAmount ?? 0) * 100);
        }

        if (
          paidCents > openCents ||
          (!invoice.companyId && paidCents !== openCents)
        ) {
          return fail({
            message: t(
              invoice.companyId
                ? "post.errors.overpayment"
                : "post.errors.fullPayment",
            ),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        let journalEntryId: string | null = null;
        if (invoice.companyId) {
          const receivableLines = invoice.journalEntryId
            ? await tx
                .select({
                  accountId: journalEntryLines.accountId,
                  amount: journalEntryLines.amount,
                })
                .from(journalEntryLines)
                .innerJoin(
                  journalEntries,
                  eq(journalEntries.id, journalEntryLines.journalEntryId),
                )
                .innerJoin(
                  accountNodes,
                  eq(accountNodes.id, journalEntryLines.accountId),
                )
                .where(
                  and(
                    eq(journalEntries.id, invoice.journalEntryId),
                    eq(journalEntries.companyId, invoice.companyId),
                    eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
                    eq(journalEntries.sourceId, invoice.id),
                    eq(journalEntries.status, JournalEntryStatus.POSTED),
                    eq(journalEntryLines.type, LineType.DEBIT),
                    eq(journalEntryLines.currency, invoice.currency),
                    eq(accountNodes.companyId, invoice.companyId),
                    eq(
                      accountNodes.subtype,
                      AccountSubtype.ACCOUNTS_RECEIVABLE,
                    ),
                  ),
                )
            : [];
          const [receivable] = receivableLines;
          if (
            receivableLines.length !== 1 ||
            receivable?.amount !== Number(invoice.amount)
          ) {
            return fail({
              message: t("post.errors.issuancePosting"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          if (data.accountNodeId) {
            const [account] = await tx
              .select({ id: accountNodes.id })
              .from(accountNodes)
              .where(
                and(
                  eq(accountNodes.id, data.accountNodeId),
                  eq(accountNodes.companyId, invoice.companyId),
                  eq(accountNodes.isActive, true),
                  eq(accountNodes.isPostable, true),
                  inArray(accountNodes.subtype, [
                    AccountSubtype.BANK,
                    AccountSubtype.CASH,
                  ]),
                ),
              )
              .limit(1)
              .for("share");
            if (!account || account.id === receivable.accountId) {
              return fail({
                message: t("post.errors.paymentAccount"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
          }

          journalEntryId = await postJournalEntry(
            {
              logger,
              companyId: invoice.companyId,
              date: paidAt,
              description: `AR payment: ${invoice.id}`,
              sourceType: JournalSourceType.AR_PAYMENT,
              sourceId: invoice.id,
              postedByUserId: userId,
              lines: [
                {
                  subtype:
                    data.method === ManualPaymentMethod.CASH
                      ? AccountSubtype.CASH
                      : AccountSubtype.BANK,
                  accountNodeId: data.accountNodeId,
                  type: LineType.DEBIT,
                  amount: data.amount,
                  currency: invoice.currency,
                },
                {
                  subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                  accountNodeId: receivable.accountId,
                  type: LineType.CREDIT,
                  amount: data.amount,
                  currency: invoice.currency,
                },
              ],
            },
            tx,
          );

          if (!journalEntryId) {
            return fail({
              message: t("post.errors.paymentPosting"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
        }

        const settled = paidCents === openCents;
        await tx
          .update(paymentInvoices)
          .set({
            status: settled ? InvoiceStatus.PAID : InvoiceStatus.OPEN,
            paidAt: settled ? paidAt : invoice.paidAt,
            updatedAt: new Date(),
          })
          .where(eq(paymentInvoices.id, invoice.id));

        const response = {
          success: true,
          message: null,
        } satisfies (typeof paymentInvoiceReceipts.$inferSelect)["response"];
        if (receiptIdentity) {
          await tx.insert(paymentInvoiceReceipts).values({
            ...receiptIdentity,
            invoiceId: invoice.id,
            journalEntryId,
            response,
          });
        }

        logger.debug("Manual payment recorded", {
          invoiceId: invoice.id,
          amount: data.amount,
          method: data.method,
          settled,
        });

        return success(response);
      });
    } catch (error) {
      logger.error("Failed to record manual payment", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
