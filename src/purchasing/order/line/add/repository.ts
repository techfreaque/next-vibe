/**
 * Purchase Order Line Add Repository
 * Inserts a line item and recalculates PO subtotal/taxAmount/total
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
  OrderLineAddRequestOutput,
  OrderLineAddResponseOutput,
} from "./definition";

export class OrderLineAddRepository {
  static async addLine(
    poId: string,
    userId: string,
    data: Omit<OrderLineAddRequestOutput, "poId">,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderLineAddResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      return await withDraftOrder(
        poId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderLineAdd.post.errors.notFound.title"),
          conflict: t("orderLineAdd.post.errors.conflict.title"),
        },
        async (tx, po) => {
          const amounts = purchaseLineAmounts(data);
          if (
            !amounts ||
            !(await validOrderReferences(tx, po.companyId, userId, {
              productIds: data.productId ? [data.productId] : [],
            }))
          ) {
            return fail({
              message: t("orderLineAdd.post.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const { taxAmount, lineTotal } = amounts;
          const taxRate = data.taxRate ?? 0;
          // Count existing lines for sort order
          const existingLines = await tx
            .select({ sortOrder: purchaseOrderLines.sortOrder })
            .from(purchaseOrderLines)
            .where(eq(purchaseOrderLines.poId, poId));

          const sortOrder =
            existingLines.reduce(
              (highest, row) => Math.max(highest, row.sortOrder ?? 0),
              -1,
            ) + 1;

          const [newLine] = await tx
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

          const totals = await purchaseTotals(tx, poId);
          await tx
            .update(purchaseOrders)
            .set({
              ...totals,
              updatedAt: new Date(),
            })
            .where(eq(purchaseOrders.id, poId));

          logger.info("Line added to purchase order", {
            poId,
            lineId: newLine.id,
          });

          return success({
            result: {
              currency: po.currency,
              lineId: newLine.id,
              ...totals,
            },
          });
        },
      );
    } catch (error) {
      logger.error("Failed to add line to PO", parseError(error));
      return fail({
        message: t("orderLineAdd.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
