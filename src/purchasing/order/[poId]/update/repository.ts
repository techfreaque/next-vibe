/**
 * Purchase Order Update Repository
 * Edit a Draft PO — scalar fields and optionally replace all lines
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { purchaseOrderLines, purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import {
  purchaseLineAmounts,
  purchaseTotals,
  validOrderReferences,
  withDraftOrder,
} from "../../draft";
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
      return await withDraftOrder(
        poId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderUpdate.patch.errors.notFound.title"),
          conflict: t("orderUpdate.patch.errors.conflict.title"),
        },
        async (tx, po) => {
          const valid = await validOrderReferences(tx, po.companyId, userId, {
            vendorId: data.vendorId,
            warehouseId: data.deliveryWarehouseId,
            productIds: data.lines?.flatMap((line) =>
              line.productId ? [line.productId] : [],
            ),
          });
          if (!valid) {
            return fail({
              message: t("orderUpdate.patch.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (data.lines) {
            const prepared = [];
            for (const [index, line] of data.lines.entries()) {
              const amounts = purchaseLineAmounts(line);
              if (!amounts) {
                return fail({
                  message: t("orderUpdate.patch.errors.validation.title"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              prepared.push({
                poId,
                ...line,
                ...amounts,
                sortOrder: line.sortOrder ?? index,
                quantityReceived: 0,
              });
            }
            await tx
              .delete(purchaseOrderLines)
              .where(eq(purchaseOrderLines.poId, poId));
            if (prepared.length) {
              await tx.insert(purchaseOrderLines).values(prepared);
            }
          }
          const totals = await purchaseTotals(tx, poId);
          const [updated] = await tx
            .update(purchaseOrders)
            .set({
              ...(data.vendorId !== undefined
                ? { vendorId: data.vendorId }
                : {}),
              ...(data.currency !== undefined
                ? { currency: data.currency }
                : {}),
              ...(data.expectedDeliveryDate !== undefined
                ? { expectedDeliveryDate: data.expectedDeliveryDate }
                : {}),
              ...(data.deliveryWarehouseId !== undefined
                ? { deliveryWarehouseId: data.deliveryWarehouseId }
                : {}),
              ...(data.notes !== undefined ? { notes: data.notes } : {}),
              ...totals,
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
        },
      );
    } catch (error) {
      logger.error("Failed to update purchase order", parseError(error));
      return fail({
        message: t("orderUpdate.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
