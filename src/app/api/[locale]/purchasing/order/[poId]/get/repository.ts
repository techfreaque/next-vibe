/**
 * Purchase Order Get Repository
 * Retrieves a purchase order with all lines and receipt history
 */

import "server-only";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  purchaseOrderLines,
  purchaseOrders,
  purchaseReceiptLines,
  purchaseReceipts,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { OrderGetResponseOutput } from "./definition";

export class OrderGetRepository {
  static async getOrder(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        po.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderGet.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Fetch lines
      const lines = await db
        .select()
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId))
        .orderBy(purchaseOrderLines.sortOrder);

      // Fetch receipts with their lines
      const receipts = await db
        .select({
          id: purchaseReceipts.id,
          receivedAt: purchaseReceipts.receivedAt,
          notes: purchaseReceipts.notes,
          poLineId: purchaseReceiptLines.poLineId,
          quantityReceived: purchaseReceiptLines.quantityReceived,
        })
        .from(purchaseReceipts)
        .leftJoin(
          purchaseReceiptLines,
          eq(purchaseReceiptLines.receiptId, purchaseReceipts.id),
        )
        .where(eq(purchaseReceipts.poId, poId))
        .orderBy(purchaseReceipts.receivedAt);

      // Group receipt lines by receipt
      const receiptMap = new Map<
        string,
        {
          id: string;
          receivedAt: Date;
          notes: string | null;
          lines: { poLineId: string; quantityReceived: number }[];
        }
      >();

      for (const row of receipts) {
        const existing = receiptMap.get(row.id);
        if (!existing) {
          receiptMap.set(row.id, {
            id: row.id,
            receivedAt: row.receivedAt,
            notes: row.notes,
            lines:
              row.poLineId && row.quantityReceived !== null
                ? [
                    {
                      poLineId: row.poLineId,
                      quantityReceived: row.quantityReceived,
                    },
                  ]
                : [],
          });
        } else if (row.poLineId && row.quantityReceived !== null) {
          existing.lines.push({
            poLineId: row.poLineId,
            quantityReceived: row.quantityReceived,
          });
        }
      }

      return success({
        result: {
          id: po.id,
          companyId: po.companyId,
          vendorId: po.vendorId,
          poNumber: po.poNumber,
          status: po.status,
          currency: po.currency,
          expectedDeliveryDate: po.expectedDeliveryDate,
          deliveryWarehouseId: po.deliveryWarehouseId,
          notes: po.notes,
          subtotal: po.subtotal,
          taxAmount: po.taxAmount,
          total: po.total,
          billId: po.billId,
          confirmedAt: po.confirmedAt,
          receivedAt: po.receivedAt,
          createdAt: po.createdAt,
          updatedAt: po.updatedAt,
          lines: lines.map((l) => ({
            id: l.id,
            productId: l.productId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            taxRate: l.taxRate,
            taxAmount: l.taxAmount,
            lineTotal: l.lineTotal,
            quantityReceived: l.quantityReceived,
            sortOrder: l.sortOrder,
          })),
          receipts: [...receiptMap.values()],
        },
      });
    } catch (error) {
      logger.error("Failed to get purchase order", parseError(error));
      return fail({
        message: t("orderGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
