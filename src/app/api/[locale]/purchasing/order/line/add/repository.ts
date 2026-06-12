/**
 * Purchase Order Line Add Repository
 * Inserts a line item and recalculates PO subtotal/taxAmount/total
 */

import "server-only";

import { eq, sum } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchaseOrderLines, purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type {
  OrderLineAddRequestOutput,
  OrderLineAddResponseOutput,
} from "./definition";

export class OrderLineAddRepository {
  static async addLine(
    poId: string,
    userId: string,
    data: OrderLineAddRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderLineAddResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderLineAdd.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.status !== "DRAFT") {
        return fail({
          message: t("orderLineAdd.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        po.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderLineAdd.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const taxRate = data.taxRate ?? 0;
      const taxAmount = data.quantity * data.unitPrice * taxRate;
      const lineTotal = data.quantity * data.unitPrice * (1 + taxRate);

      // Count existing lines for sort order
      const existingLines = await db
        .select({ id: purchaseOrderLines.id })
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId));

      const sortOrder = existingLines.length;

      const [newLine] = await db
        .insert(purchaseOrderLines)
        .values({
          poId,
          productId: data.productId ?? null,
          description: data.itemDescription,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          taxRate,
          taxAmount,
          lineTotal,
          sortOrder,
        })
        .returning({ id: purchaseOrderLines.id });

      if (!newLine) {
        return fail({
          message: t("orderLineAdd.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Recalculate PO totals from all lines
      const totals = await db
        .select({
          subtotal: sum(purchaseOrderLines.lineTotal),
          taxAmount: sum(purchaseOrderLines.taxAmount),
        })
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId));

      const rawSubtotal = Number(totals[0]?.subtotal ?? 0);
      const rawTaxAmount = Number(totals[0]?.taxAmount ?? 0);
      // subtotal = line totals excluding tax = sum(qty * unitPrice)
      const newSubtotal = rawSubtotal - rawTaxAmount;
      const newTaxAmount = rawTaxAmount;
      const newTotal = rawSubtotal;

      await db
        .update(purchaseOrders)
        .set({
          subtotal: newSubtotal,
          taxAmount: newTaxAmount,
          total: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(purchaseOrders.id, poId));

      logger.info("Line added to purchase order", { poId, lineId: newLine.id });

      return success({
        result: {
          lineId: newLine.id,
          subtotal: newSubtotal,
          taxAmount: newTaxAmount,
          total: newTotal,
        },
      });
    } catch (error) {
      logger.error("Failed to add line to PO", parseError(error));
      return fail({
        message: t("orderLineAdd.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
