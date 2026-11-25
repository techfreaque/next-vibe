/**
 * POS Order Remove Item Repository
 * Removes a line item from an open order and recalculates totals
 */

import { and, eq, sum } from "drizzle-orm";
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

import { posOrderItems, posOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import { withOpenOrder } from "../../open-order";
import type { PosOrderRemoveItemPostRequestOutput } from "./definition";

export class PosOrderRemoveItemRepository {
  static async removeItem(
    data: PosOrderRemoveItemPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        orderId: string;
        orderTotal: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      // Verify order exists and is open
      return await withOpenOrder(
        details.orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderRemoveItem.post.errors.notFound.title"),
          conflict: t("orderRemoveItem.post.errors.conflict.title"),
        },
        async (tx) => {
          // Verify item belongs to this order
          const [item] = await tx
            .select({ id: posOrderItems.id })
            .from(posOrderItems)
            .where(
              and(
                eq(posOrderItems.id, details.itemId),
                eq(posOrderItems.orderId, details.orderId),
              ),
            )
            .limit(1);

          if (!item) {
            return fail({
              message: t("orderRemoveItem.post.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          // Delete the item
          await tx
            .delete(posOrderItems)
            .where(eq(posOrderItems.id, details.itemId));

          // Recalculate order totals
          const [totals] = await tx
            .select({
              subtotal: sum(posOrderItems.lineTotal),
              taxAmount: sum(posOrderItems.taxAmount),
            })
            .from(posOrderItems)
            .where(eq(posOrderItems.orderId, details.orderId));

          const newSubtotal = Number(totals?.subtotal ?? 0);
          const newTaxAmount = Number(totals?.taxAmount ?? 0);
          const newTotal = newSubtotal;

          await tx
            .update(posOrders)
            .set({
              subtotal:
                (Math.round(newSubtotal * 10_000) -
                  Math.round(newTaxAmount * 10_000)) /
                10_000,
              taxAmount: newTaxAmount,
              total: newTotal,
              updatedAt: new Date(),
            })
            .where(eq(posOrders.id, details.orderId));

          return success({
            result: {
              orderId: details.orderId,
              orderTotal: newTotal,
            },
          });
        },
        { beforeTender: t("orderVoid.post.widget.tendered") },
      );
    } catch (error) {
      logger.error("Error removing item from POS order", parseError(error));
      return fail({
        message: t("orderRemoveItem.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
