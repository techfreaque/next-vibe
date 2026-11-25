/** Creates a draft supplier bill and its line items atomically. */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountType } from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { purchasingVendors } from "@/purchasing/db";

import { paymentBillLines, paymentBills } from "../../db";
import { calculateBillLine, summarizeBillLines } from "./amounts";
import { billDateToday, billDueDateFromTerms } from "./dates";
import type {
  BillCreateRequestOutput,
  BillCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillCreateRepository {
  static async createBill(
    userId: string,
    data: BillCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const auth = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!auth.success) {
        return auth;
      }

      const billDate = data.billDate
        ? new Date(data.billDate)
        : billDateToday();
      const suppliedDueDate = data.dueDate
        ? new Date(data.dueDate)
        : data.dueDate;
      if (
        !Number.isFinite(billDate.getTime()) ||
        (suppliedDueDate && !Number.isFinite(suppliedDueDate.getTime()))
      ) {
        return fail({
          message: t("post.errors.dates"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const lines = (data.lineItems ?? []).map((line, sortOrder) => ({
        ...calculateBillLine(line),
        description: line.description,
        productId: line.productId ?? null,
        expenseAccountId: line.expenseAccountId ?? null,
        sortOrder,
      }));
      const totals = summarizeBillLines(lines);
      if (!totals.valid) {
        return fail({
          message: t("post.errors.amounts"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      return await db.transaction(async (tx) => {
        const [vendor] = data.vendorId
          ? await tx
              .select({
                id: purchasingVendors.id,
                name: purchasingVendors.name,
                vatNumber: purchasingVendors.vatNumber,
                paymentTermsDays: purchasingVendors.defaultPaymentTermsDays,
              })
              .from(purchasingVendors)
              .where(
                and(
                  eq(purchasingVendors.id, data.vendorId),
                  eq(purchasingVendors.companyId, data.companyId),
                  eq(purchasingVendors.isActive, true),
                ),
              )
              .limit(1)
              .for("share")
          : [];
        if (data.vendorId && !vendor) {
          return fail({
            message: t("post.errors.vendor"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const dueDate =
          suppliedDueDate === undefined
            ? (billDueDateFromTerms(billDate, vendor?.paymentTermsDays) ?? null)
            : suppliedDueDate;
        const supplierName = vendor?.name ?? data.supplierName?.trim();
        if (!supplierName) {
          return fail({
            message: t("post.errors.supplier"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const expenseAccountIds = [
          ...new Set(
            lines.flatMap((line) =>
              line.expenseAccountId ? [line.expenseAccountId] : [],
            ),
          ),
        ];
        if (expenseAccountIds.length > 0) {
          const accounts = await tx
            .select({ id: accountNodes.id })
            .from(accountNodes)
            .where(
              and(
                inArray(accountNodes.id, expenseAccountIds),
                eq(accountNodes.companyId, data.companyId),
                eq(accountNodes.type, AccountType.EXPENSE),
                eq(accountNodes.isActive, true),
                eq(accountNodes.isPostable, true),
              ),
            )
            .orderBy(accountNodes.id)
            .for("share");
          if (accounts.length !== expenseAccountIds.length) {
            return fail({
              message: t("post.errors.expenseAccount"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
        }

        const [bill] = await tx
          .insert(paymentBills)
          .values({
            companyId: data.companyId,
            supplierName,
            supplierVatNumber:
              data.supplierVatNumber?.trim() || vendor?.vatNumber || null,
            billNumber: data.billNumber?.trim() || null,
            billDate,
            dueDate,
            currency: data.currency,
            notes: data.notes ?? null,
            metadata: vendor ? { vendorId: vendor.id } : null,
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            total: totals.total,
          })
          .returning();
        if (!bill) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        if (lines.length > 0) {
          await tx
            .insert(paymentBillLines)
            .values(lines.map((line) => ({ ...line, billId: bill.id })));
        }

        logger.info("AP bill created", {
          billId: bill.id,
          companyId: bill.companyId,
          lineCount: lines.length,
        });
        return success({
          id: bill.id,
          companyIdResponse: bill.companyId,
          supplierNameResponse: bill.supplierName,
          billNumberResponse: bill.billNumber,
          status: bill.status,
          subtotal: bill.subtotal,
          taxAmount: bill.taxAmount,
          total: bill.total,
          currencyResponse: bill.currency,
          createdAt: bill.createdAt,
        });
      });
    } catch (error) {
      logger.error("Failed to create AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
