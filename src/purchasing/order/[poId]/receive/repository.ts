/**
 * Purchase Order Receive Repository
 * Creates a goods receipt, updates quantityReceived on lines, updates PO status
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
import { applyStockMovement } from "@/inventory/stock/shared-helpers";

import {
  purchaseOrderLines,
  purchaseOrders,
  purchaseReceiptLines,
  purchaseReceipts,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type {
  OrderReceiveRequestOutput,
  OrderReceiveResponseOutput,
} from "./definition";

export class OrderReceiveRepository {
  static async receiveOrder(
    poId: string,
    userId: string,
    data: OrderReceiveRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderReceiveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderReceive.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const receivableStatuses = ["CONFIRMED", "SENT", "PARTIALLY_RECEIVED"];
      if (!receivableStatuses.includes(po.status)) {
        return fail({
          message: t("orderReceive.post.errors.conflict.title"),
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
          message: t("orderReceive.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Create receipt
      const [receipt] = await db
        .insert(purchaseReceipts)
        .values({
          poId,
          warehouseId: data.warehouseId ?? null,
          receivedByUserId: userId,
          notes: data.notes ?? null,
        })
        .returning();

      if (!receipt) {
        return fail({
          message: t("orderReceive.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Insert receipt lines and update PO line quantities
      for (const line of data.lines) {
        await db.insert(purchaseReceiptLines).values({
          receiptId: receipt.id,
          poLineId: line.poLineId,
          quantityReceived: line.quantityReceived,
        });

        await db
          .update(purchaseOrderLines)
          .set({
            quantityReceived: sql`${purchaseOrderLines.quantityReceived} + ${line.quantityReceived}`,
          })
          .where(eq(purchaseOrderLines.id, line.poLineId));
      }

      // Determine new PO status by checking if all lines are fully received
      const allLines = await db
        .select({
          quantity: purchaseOrderLines.quantity,
          quantityReceived: purchaseOrderLines.quantityReceived,
        })
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId));

      const allFullyReceived =
        allLines.length > 0 &&
        allLines.every((l) => l.quantityReceived >= l.quantity);
      const newStatus: "RECEIVED" | "PARTIALLY_RECEIVED" = allFullyReceived
        ? "RECEIVED"
        : "PARTIALLY_RECEIVED";

      const now = new Date();
      await db
        .update(purchaseOrders)
        .set({
          status: newStatus,
          receivedAt: newStatus === "RECEIVED" ? now : po.receivedAt,
          updatedAt: now,
        })
        .where(eq(purchaseOrders.id, poId));

      // Apply stock movements if PO has a delivery warehouse
      if (po.deliveryWarehouseId) {
        // Fetch all PO lines with a productId for stock movement
        const allPoLines = await db
          .select()
          .from(purchaseOrderLines)
          .where(eq(purchaseOrderLines.poId, poId));

        for (const line of allPoLines) {
          if (!line.productId) {
            continue;
          }
          // Only move stock for lines that were received in this receipt
          const receivedLine = data.lines.find((l) => l.poLineId === line.id);
          if (!receivedLine) {
            continue;
          }
          await applyStockMovement({
            warehouseId: po.deliveryWarehouseId,
            productId: line.productId,
            type: "RECEIPT",
            quantity: receivedLine.quantityReceived,
            unitCost: line.unitPrice,
            reference: po.poNumber,
            sourceId: receipt.id,
            sourceType: "purchase_receipt",
            userId,
            logger,
            insufficientStockError: t("orderReceive.post.errors.server.title"),
          });
        }
      }

      logger.info("Purchase order receipt recorded", {
        poId,
        receiptId: receipt.id,
        newStatus,
      });

      return success({
        result: {
          receiptId: receipt.id,
          status: newStatus,
          receivedAt: receipt.receivedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to receive purchase order", parseError(error));
      return fail({
        message: t("orderReceive.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
