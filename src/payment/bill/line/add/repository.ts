/**
 * AP Bill Line Add Repository
 * Adds a line item to a draft bill, auto-calculating tax and updating bill totals
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { paymentBillLines, paymentBills } from "../../../db";
import { BillStatus } from "../../../enum";
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
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, data.billId))
        .limit(1);

      if (!bill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ACCOUNTANT+ membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        bill.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (bill.status !== BillStatus.DRAFT) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const quantity = data.quantity ?? 1;
      const unitPrice = data.unitPrice;
      const taxRate = data.taxRate ?? 0;
      const taxAmount = quantity * unitPrice * taxRate;
      const lineTotal = quantity * unitPrice + taxAmount;

      // Get current max sort order
      const existingLines = await db
        .select({ sortOrder: paymentBillLines.sortOrder })
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, data.billId));

      const maxSortOrder = existingLines.reduce(
        (max, l) => Math.max(max, l.sortOrder ?? 0),
        -1,
      );

      const [line] = await db
        .insert(paymentBillLines)
        .values({
          billId: data.billId,
          description: data.description,
          productId: data.productId ?? null,
          quantity,
          unitPrice,
          taxRate,
          taxAmount,
          lineTotal,
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
      await db
        .update(paymentBills)
        .set({
          subtotal: sql`(
            SELECT SUM(line_total - tax_amount) FROM payment_bill_lines
            WHERE bill_id = ${data.billId}
          )`,
          taxAmount: sql`(
            SELECT SUM(tax_amount) FROM payment_bill_lines
            WHERE bill_id = ${data.billId}
          )`,
          total: sql`(
            SELECT SUM(line_total) FROM payment_bill_lines
            WHERE bill_id = ${data.billId}
          )`,
          updatedAt: new Date(),
        })
        .where(eq(paymentBills.id, data.billId));

      logger.debug("Bill line added", {
        lineId: line.id,
        billId: data.billId,
        lineTotal,
      });

      return success({
        success: true,
        message: null,
        line: {
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
    } catch (error) {
      logger.error("Failed to add bill line", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
