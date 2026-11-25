/**
 * Purchase Order Line Remove Repository
 * Deletes a line item and recalculates PO subtotal/taxAmount/total
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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
import { purchaseTotals, withDraftOrder } from "../../draft";
import type { OrderLineRemoveResponseOutput } from "./definition";

export class OrderLineRemoveRepository {
  static async removeLine(
    poId: string,
    lineId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderLineRemoveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      return await withDraftOrder(
        poId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderLineRemove.post.errors.notFound.title"),
          conflict: t("orderLineRemove.post.errors.conflict.title"),
        },
        async (tx, po) => {
          const [line] = await tx
            .select({ id: purchaseOrderLines.id })
            .from(purchaseOrderLines)
            .where(
              and(
                eq(purchaseOrderLines.id, lineId),
                eq(purchaseOrderLines.poId, poId),
              ),
            )
            .limit(1);

          if (!line) {
            return fail({
              message: t("orderLineRemove.post.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          // Delete the line
          await tx
            .delete(purchaseOrderLines)
            .where(eq(purchaseOrderLines.id, lineId));

          const totals = await purchaseTotals(tx, poId);
          await tx
            .update(purchaseOrders)
            .set({
              ...totals,
              updatedAt: new Date(),
            })
            .where(eq(purchaseOrders.id, poId));

          logger.info("Line removed from purchase order", { poId, lineId });

          return success({
            result: {
              currency: po.currency,
              ...totals,
            },
          });
        },
      );
    } catch (error) {
      logger.error("Failed to remove line from PO", parseError(error));
      return fail({
        message: t("orderLineRemove.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
