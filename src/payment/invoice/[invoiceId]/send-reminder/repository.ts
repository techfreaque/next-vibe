import "server-only";

import { createHash } from "node:crypto";

import { and, eq } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { invoiceReminderDrafts } from "./db";
import type {
  InvoiceSendReminderRequestOutput,
  InvoiceSendReminderResponseOutput,
  InvoiceSendReminderUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceSendReminderRepository {
  static async sendReminder(
    userId: string,
    { invoiceId }: InvoiceSendReminderUrlPathParams,
    data: InvoiceSendReminderRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceSendReminderResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [observed] = await db
        .select({
          companyId: paymentInvoices.companyId,
          userId: paymentInvoices.userId,
        })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      if (!observed) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const authorized = await getDocumentAccess(userId, observed);
      if (!authorized?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      return await db.transaction(async (tx) => {
        if (observed.companyId) {
          await lockLedgerCompany(tx, observed.companyId);
        }
        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId))
          .for("update");
        if (!invoice || invoice.companyId !== observed.companyId) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const access = await getDocumentAccess(userId, invoice, tx);
        if (!access?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const day = new Date().toISOString().slice(0, 10);
        const dueDate = invoice.dueDate?.toISOString().slice(0, 10);
        const conflict = fail({
          message: t("post.errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
        if (
          invoice.status !== InvoiceStatus.OPEN ||
          !dueDate ||
          dueDate >= day ||
          Number(invoice.amount) <= 0
        ) {
          return conflict;
        }
        const balance = getInvoiceOpenBalanceParts(
          tx,
          invoice.companyId ?? undefined,
          invoice.currency,
        );
        const [row] = await tx
          .select({ openAmount: balance.openAmount })
          .from(paymentInvoices)
          .leftJoin(balance.payments, balance.paymentJoin)
          .leftJoin(balance.credits, balance.creditJoin)
          .where(eq(paymentInvoices.id, invoice.id));
        const amount = Number(row?.openAmount);
        if (!Number.isFinite(amount) || amount <= 0) {
          return conflict;
        }
        const note = data.message?.trim() || null;
        const snapshot = {
          dueDate,
          currency: invoice.currency,
          amount: amount.toFixed(2),
          note,
          issuerName: access.companyName,
          invoiceNumber:
            invoice.invoiceNumber?.trim() ||
            (invoice.invoiceSequenceNumber === null
              ? invoice.providerInvoiceId
              : `INV-${invoice.invoiceSequenceNumber}`),
        };
        const signature = createHash("sha256")
          .update(JSON.stringify(snapshot))
          .digest("hex");
        const [existing] = await tx
          .select({ id: invoiceReminderDrafts.id })
          .from(invoiceReminderDrafts)
          .where(
            and(
              eq(invoiceReminderDrafts.invoiceId, invoice.id),
              eq(invoiceReminderDrafts.draftDay, day),
              eq(invoiceReminderDrafts.signature, signature),
            ),
          );
        const draft =
          existing ??
          (
            await tx
              .insert(invoiceReminderDrafts)
              .values({
                ...snapshot,
                invoiceId: invoice.id,
                companyId: invoice.companyId,
                preparedBy: userId,
                draftDay: day,
                signature,
              })
              .returning({ id: invoiceReminderDrafts.id })
          )[0];
        if (!draft) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        return success({
          success: true,
          responseMessage: null,
          draft: { ...snapshot, id: draft.id },
        });
      });
    } catch (error) {
      logger.error("Failed to prepare invoice reminder", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
