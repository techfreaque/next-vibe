/**
 * Purchase Order Update Repository
 * Edit a Draft PO — scalar fields and optionally replace all lines
 */

import "server-only";

import { eq } from "drizzle-orm";
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
  OrderUpdateRequestOutput,
  OrderUpdateResponseOutput,
} from "./definition";

export class OrderUpdateRepository {
  static async updateOrder(
    poId: string,
    userId: string,
    data: OrderUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderUpdate.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.status !== "DRAFT") {
        return fail({
          message: t("orderUpdate.patch.errors.conflict.title"),
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
          message: t("orderUpdate.patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Calculate line totals if lines are being replaced
      let subtotal = po.subtotal;
      let taxAmount = po.taxAmount;
      let total = po.total;

      if (data.lines !== undefined) {
        // Replace all lines
        await db
          .delete(purchaseOrderLines)
          .where(eq(purchaseOrderLines.poId, poId));

        if (data.lines.length > 0) {
          const lineInserts = data.lines.map((line, idx) => {
            const lineTaxAmount =
              Math.round(
                line.quantity * line.unitPrice * line.taxRate * 10000,
              ) / 10000;
            const lineTotal =
              Math.round(line.quantity * line.unitPrice * 10000) / 10000 +
              lineTaxAmount;
            return {
              poId,
              description: line.description,
              productId: line.productId ?? null,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              taxRate: line.taxRate,
              taxAmount: lineTaxAmount,
              lineTotal,
              quantityReceived: 0,
              sortOrder: line.sortOrder ?? idx,
            };
          });

          await db.insert(purchaseOrderLines).values(lineInserts);

          subtotal = lineInserts.reduce(
            (sum, l) => sum + l.quantity * l.unitPrice,
            0,
          );
          taxAmount = lineInserts.reduce((sum, l) => sum + l.taxAmount, 0);
          total = subtotal + taxAmount;
        } else {
          subtotal = 0;
          taxAmount = 0;
          total = 0;
        }
      }

      const [updated] = await db
        .update(purchaseOrders)
        .set({
          ...(data.vendorId !== undefined ? { vendorId: data.vendorId } : {}),
          ...(data.currency !== undefined ? { currency: data.currency } : {}),
          ...(data.expectedDeliveryDate !== undefined
            ? { expectedDeliveryDate: data.expectedDeliveryDate }
            : {}),
          ...(data.deliveryWarehouseId !== undefined
            ? { deliveryWarehouseId: data.deliveryWarehouseId }
            : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          subtotal,
          taxAmount,
          total,
          updatedAt: new Date(),
        })
        .where(eq(purchaseOrders.id, poId))
        .returning();

      if (!updated) {
        return fail({
          message: t("orderUpdate.patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Purchase order updated", { poId });

      return success({
        result: {
          id: updated.id,
          status: updated.status,
          subtotal: updated.subtotal,
          taxAmount: updated.taxAmount,
          total: updated.total,
          updatedAt: updated.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to update purchase order", parseError(error));
      return fail({
        message: t("orderUpdate.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
