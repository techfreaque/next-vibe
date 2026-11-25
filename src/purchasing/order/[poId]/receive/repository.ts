/**
 * Purchase Order Receive Repository
 * Creates a goods receipt, updates quantityReceived on lines, updates PO status
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
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
import { withTransaction } from "next-vibe/database/utils/repository-helpers";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { warehouses } from "@/inventory/db";
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
      const [owner] = await db
        .select({ companyId: purchaseOrders.companyId })
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId));
      if (!owner) {
        return fail({
          message: t("orderReceive.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        owner.companyId,
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

      const conflict = fail({
        message: t("orderReceive.post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
      return await withTransaction<ResponseType<OrderReceiveResponseOutput>>(
        logger,
        async (tx) => {
          const [po] = await tx
            .select({
              companyId: purchaseOrders.companyId,
              status: purchaseOrders.status,
              warehouseId: purchaseOrders.deliveryWarehouseId,
              currency: purchaseOrders.currency,
              poNumber: purchaseOrders.poNumber,
              receivedAt: purchaseOrders.receivedAt,
            })
            .from(purchaseOrders)
            .where(
              and(
                eq(purchaseOrders.id, poId),
                eq(purchaseOrders.companyId, owner.companyId),
              ),
            )
            .for("update");
          if (
            !po ||
            !["CONFIRMED", "SENT", "PARTIALLY_RECEIVED"].includes(po.status)
          ) {
            return conflict;
          }
          const warehouseId = data.warehouseId ?? po.warehouseId;
          if (warehouseId) {
            const [warehouse] = await tx
              .select({ id: warehouses.id })
              .from(warehouses)
              .where(
                and(
                  eq(warehouses.id, warehouseId),
                  eq(warehouses.companyId, po.companyId),
                  eq(warehouses.isActive, true),
                ),
              )
              .for("update");
            if (!warehouse) {
              return conflict;
            }
          }
          const lines = await tx
            .select({
              id: purchaseOrderLines.id,
              productId: purchaseOrderLines.productId,
              quantity: purchaseOrderLines.quantity,
              received: purchaseOrderLines.quantityReceived,
              unitPrice: purchaseOrderLines.unitPrice,
            })
            .from(purchaseOrderLines)
            .where(eq(purchaseOrderLines.poId, poId))
            .for("update");
          const requested = new Map(
            data.lines.map((line) => [line.poLineId, line.quantityReceived]),
          );
          if (requested.size !== data.lines.length || !requested.size) {
            return conflict;
          }
          const byId = new Map(lines.map((line) => [line.id, line]));
          for (const [id, qty] of requested) {
            const line = byId.get(id);
            const units = Math.round(qty * 10_000);
            if (
              !line ||
              !Number.isSafeInteger(units) ||
              units <= 0 ||
              units / 10_000 !== qty ||
              units >
                Math.round(line.quantity * 10_000) -
                  Math.round(line.received * 10_000)
            ) {
              return conflict;
            }
          }
          if (
            warehouseId &&
            lines.some((line) => line.productId && requested.has(line.id))
          ) {
            const [company] = await tx
              .select({ currency: companies.currency })
              .from(companies)
              .where(eq(companies.id, po.companyId));
            if (!company?.currency || company.currency !== po.currency) {
              return conflict;
            }
          }
          const receiptId = crypto.randomUUID();
          const receivedAt = new Date();
          await tx.insert(purchaseReceipts).values({
            id: receiptId,
            poId,
            warehouseId,
            receivedByUserId: userId,
            notes: data.notes,
            receivedAt,
          });
          await tx
            .insert(purchaseReceiptLines)
            .values(data.lines.map((line) => ({ receiptId, ...line })));
          for (const line of lines) {
            const quantity = requested.get(line.id);
            if (!quantity) {
              continue;
            }
            await tx
              .update(purchaseOrderLines)
              .set({
                quantityReceived: sql`${purchaseOrderLines.quantityReceived} + ${quantity}::numeric`,
              })
              .where(
                and(
                  eq(purchaseOrderLines.poId, poId),
                  eq(purchaseOrderLines.id, line.id),
                ),
              );
            if (warehouseId && line.productId) {
              const movement = await applyStockMovement(
                {
                  warehouseId,
                  companyId: po.companyId,
                  productId: line.productId,
                  type: "RECEIPT",
                  quantity,
                  unitCost: line.unitPrice,
                  reference: po.poNumber,
                  sourceId: receiptId,
                  sourceType: "purchase_receipt",
                  userId,
                  logger,
                  insufficientStockError: t(
                    "orderReceive.post.errors.conflict.title",
                  ),
                },
                tx,
              );
              if (!movement.success) {
                tx.rollback();
              }
            }
          }
          const receivedAll = lines.every(
            (line) =>
              Math.round(line.received * 10_000) +
                Math.round((requested.get(line.id) ?? 0) * 10_000) ===
              Math.round(line.quantity * 10_000),
          );
          const status = receivedAll ? "RECEIVED" : "PARTIALLY_RECEIVED";
          await tx
            .update(purchaseOrders)
            .set({
              status,
              receivedAt: receivedAll ? receivedAt : po.receivedAt,
              updatedAt: receivedAt,
            })
            .where(eq(purchaseOrders.id, poId));
          return success({ result: { receiptId, status, receivedAt } });
        },
        () => conflict,
      );
    } catch (error) {
      logger.error("Failed to receive purchase order", parseError(error));
      return fail({
        message: t("orderReceive.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
