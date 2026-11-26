import "server-only";

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
import { getDocumentAccess } from "@/finance/document-company-scope";

import { paymentBillLines, paymentBills } from "../../../../../db";
import { BillStatus } from "../../../../../enum";
import {
  billLinesMatchHeader,
  hasBillSourceEvidence,
  summarizeBillLines,
} from "../../../../create/amounts";
import { scopedTranslation as addLineCopy } from "../../../add/i18n";
import type {
  BillLineRemoveResponseOutput,
  BillLineRemoveUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillLineRemoveRepository {
  static async removeLine(
    userId: string,
    { billId, lineId }: BillLineRemoveUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillLineRemoveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [observed] = await db
        .select({ companyId: paymentBills.companyId })
        .from(paymentBills)
        .where(eq(paymentBills.id, billId))
        .limit(1);
      if (!observed) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!(await getDocumentAccess(userId, observed))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, observed.companyId);
        const [bill] = await tx
          .select()
          .from(paymentBills)
          .where(
            and(
              eq(paymentBills.id, billId),
              eq(paymentBills.companyId, observed.companyId),
            ),
          )
          .limit(1)
          .for("update");
        if (!bill) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (!(await getDocumentAccess(userId, bill, tx))?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (bill.status !== BillStatus.DRAFT || bill.journalEntryId) {
          return fail({
            message: t("post.errors.conflict.description"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const lines = await tx
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, billId));
        if (
          hasBillSourceEvidence(bill.metadata) ||
          !billLinesMatchHeader(bill, lines)
        ) {
          return fail({
            message: addLineCopy
              .scopedT(locale)
              .t("post.errors.evidenceReview"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const [removed] = await tx
          .delete(paymentBillLines)
          .where(
            and(
              eq(paymentBillLines.id, lineId),
              eq(paymentBillLines.billId, billId),
            ),
          )
          .returning({ id: paymentBillLines.id });
        if (!removed) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const totals = summarizeBillLines(
          lines.filter((line) => line.id !== lineId),
        );
        await tx
          .update(paymentBills)
          .set({
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            total: totals.total,
            updatedAt: new Date(),
          })
          .where(eq(paymentBills.id, billId));
        return success({ success: true, message: null });
      });
    } catch (error) {
      logger.error("Failed to remove bill line", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
