/**
 * AP Bill Line Add Repository
 * Adds a line item to a draft bill, auto-calculating tax and updating bill totals
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { mailboxTaxPending } from "@/finance/supplier-evidence/tax-pending";
import { scopedTranslation as billDetailTranslation } from "@/payment/bill/[billId]/get/i18n";
import { getLineSettlementPolicy } from "@/tax/line-settlement";

import { paymentBillLines, paymentBills } from "../../../db";
import { BillStatus } from "../../../enum";
import {
  billLinesMatchHeader,
  calculateBillLine,
  hasBillSourceEvidence,
  summarizeBillLines,
} from "../../create/amounts";
import type {
  BillLineAddRequestOutput,
  BillLineAddResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillLineAddRepository {
  static async addLine(
    userId: string,
    data: BillLineAddRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillLineAddResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [observedBill] = await db
        .select({ companyId: paymentBills.companyId })
        .from(paymentBills)
        .where(eq(paymentBills.id, data.billId))
        .limit(1);

      if (!observedBill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ACCOUNTANT+ membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        observedBill.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, observedBill.companyId);
        const [bill] = await tx
          .select()
          .from(paymentBills)
          .where(
            and(
              eq(paymentBills.id, data.billId),
              eq(paymentBills.companyId, observedBill.companyId),
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

        if (mailboxTaxPending(bill.metadata)) {
          return fail({
            message: billDetailTranslation
              .scopedT(locale)
              .t("widget.taxPending"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        if (bill.status !== BillStatus.DRAFT || bill.journalEntryId) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const existingLines = await tx
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, data.billId));
        if (
          hasBillSourceEvidence(bill.metadata) ||
          !billLinesMatchHeader(bill, existingLines)
        ) {
          return fail({
            message: t("post.errors.evidenceReview"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const amounts = calculateBillLine(
          {
            quantity: data.quantity ?? 1,
            unitPrice: data.unitPrice,
            taxRate: data.taxRate ?? 0,
          },
          getLineSettlementPolicy(bill.currency, bill.metadata),
        );
        const totals = summarizeBillLines([...existingLines, amounts]);
        if (!totals.valid) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const maxSortOrder = existingLines.reduce(
          (max, l) => Math.max(max, l.sortOrder ?? 0),
          -1,
        );

        const [line] = await tx
          .insert(paymentBillLines)
          .values({
            billId: data.billId,
            description: data.description,
            productId: data.productId ?? null,
            ...amounts,
            expenseAccountId: data.expenseAccountId ?? null,
            sortOrder: maxSortOrder + 1,
          })
          .returning();

        if (!line) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        // Update bill totals by summing all lines
        await tx
          .update(paymentBills)
          .set({
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            total: totals.total,
            updatedAt: new Date(),
          })
          .where(eq(paymentBills.id, data.billId));

        logger.debug("Bill line added", {
          lineId: line.id,
          billId: data.billId,
          lineTotal: line.lineTotal,
        });

        return success({
          success: true,
          message: null,
          line: {
            currency: bill.currency,
            id: line.id,
            billId: line.billId,
            description: line.description,
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate,
            taxAmount: line.taxAmount,
            lineTotal: line.lineTotal,
            expenseAccountId: line.expenseAccountId,
            sortOrder: line.sortOrder,
            createdAt: line.createdAt,
            updatedAt: line.updatedAt,
          },
        });
      });
    } catch (error) {
      logger.error("Failed to add bill line", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
