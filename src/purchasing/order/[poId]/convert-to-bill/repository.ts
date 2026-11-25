import "server-only";

import { and, eq } from "drizzle-orm";
import {
  type CountryLanguage,
  CurrenciesArr,
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
import { z } from "zod";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";

import {
  purchaseOrderLines,
  purchaseOrders,
  purchasingVendors,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type definition from "./definition";

export class OrderConvertToBillRepository {
  static async convertToBill(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<typeof definition.POST.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [owner] = await db
        .select({ companyId: purchaseOrders.companyId })
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId));
      if (!owner) {
        return fail({
          message: t("orderConvertToBill.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const access = await CompanyAuthRepository.requireMember(
        userId,
        owner.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!access.success) {
        return access;
      }

      return await db.transaction(async (tx) => {
        const [order] = await tx
          .select({
            poNumber: purchaseOrders.poNumber,
            status: purchaseOrders.status,
            currency: purchaseOrders.currency,
            billId: purchaseOrders.billId,
            subtotal: purchaseOrders.subtotal,
            taxAmount: purchaseOrders.taxAmount,
            total: purchaseOrders.total,
            supplier: purchasingVendors.name,
            vatNumber: purchasingVendors.vatNumber,
            terms: purchasingVendors.defaultPaymentTermsDays,
          })
          .from(purchaseOrders)
          .innerJoin(
            purchasingVendors,
            and(
              eq(purchaseOrders.vendorId, purchasingVendors.id),
              eq(purchaseOrders.companyId, purchasingVendors.companyId),
            ),
          )
          .where(
            and(
              eq(purchaseOrders.id, poId),
              eq(purchaseOrders.companyId, owner.companyId),
            ),
          )
          .for("update", { of: purchaseOrders });
        if (!order || order.status !== "RECEIVED" || order.billId) {
          return fail({
            message: t("orderConvertToBill.post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const currency = z.enum(CurrenciesArr).safeParse(order.currency);
        const lines = await tx
          .select({
            description: purchaseOrderLines.description,
            productId: purchaseOrderLines.productId,
            quantity: purchaseOrderLines.quantity,
            unitPrice: purchaseOrderLines.unitPrice,
            taxRate: purchaseOrderLines.taxRate,
            taxAmount: purchaseOrderLines.taxAmount,
            lineTotal: purchaseOrderLines.lineTotal,
            sortOrder: purchaseOrderLines.sortOrder,
          })
          .from(purchaseOrderLines)
          .where(eq(purchaseOrderLines.poId, poId))
          .orderBy(purchaseOrderLines.sortOrder, purchaseOrderLines.id);
        const grossUnits = lines.reduce(
          (sum, line) => sum + Math.round(line.lineTotal * 10_000),
          0,
        );
        const taxUnits = lines.reduce(
          (sum, line) => sum + Math.round(line.taxAmount * 10_000),
          0,
        );
        if (
          !currency.success ||
          !lines.length ||
          grossUnits !== Math.round(order.total * 10_000) ||
          taxUnits !== Math.round(order.taxAmount * 10_000) ||
          grossUnits - taxUnits !== Math.round(order.subtotal * 10_000)
        ) {
          return fail({
            message: t("orderConvertToBill.post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const billId = crypto.randomUUID();
        const billDate = new Date();
        const dueDate = order.terms === null ? null : new Date(billDate);
        if (dueDate && order.terms !== null) {
          dueDate.setUTCDate(dueDate.getUTCDate() + order.terms);
        }
        const billNumber = order.poNumber;
        await tx.insert(paymentBills).values({
          id: billId,
          companyId: owner.companyId,
          supplierName: order.supplier,
          supplierVatNumber: order.vatNumber,
          billNumber,
          billDate,
          dueDate,
          currency: currency.data,
          status: BillStatus.RECEIVED,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          total: order.total,
          metadata: { purchaseOrderId: poId },
        });
        await tx.insert(paymentBillLines).values(
          lines.map((line) => ({
            ...line,
            sortOrder: line.sortOrder ?? 0,
            billId,
          })),
        );
        // Bill approval owns the first payable posting.
        await tx
          .update(purchaseOrders)
          .set({ billId, status: "BILLED", updatedAt: billDate })
          .where(eq(purchaseOrders.id, poId));
        return success({ result: { billId, billNumber, poId } });
      });
    } catch (error) {
      logger.error(
        "Failed to convert purchase order to bill",
        parseError(error),
      );
      return fail({
        message: t("orderConvertToBill.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
