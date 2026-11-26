/**
 * POS Order Remove Payment Repository
 * Takes one tender back off an open order
 */

import { and, eq, sql, sum } from "drizzle-orm";
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

import { posOrderItems, posOrders, posPayments } from "../../../db";
import { withOpenOrder } from "../../open-order";
import { posSettlementAmounts } from "../../settlement-amounts";
import type {
  PosOrderRemovePaymentPostRequestOutput,
  PosOrderRemovePaymentPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class PosOrderRemovePaymentRepository {
  static async removePayment(
    data: PosOrderRemovePaymentPostRequestOutput,
    orderId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosOrderRemovePaymentPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      return await withOpenOrder(
        orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("errors.notFound.title"),
          conflict: t("errors.conflict.title"),
        },
        async (tx, order) => {
          const [removed] = await tx
            .delete(posPayments)
            .where(
              and(
                eq(posPayments.id, data.paymentId),
                eq(posPayments.orderId, orderId),
              ),
            )
            .returning({ id: posPayments.id });
          if (!removed) {
            return fail({
              message: t("errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          const [paid] = await tx
            .select({
              count: sql<number>`count(*)::int`,
              total: sql<string>`coalesce(sum(${posPayments.amount} - ${posPayments.change}), 0)`,
            })
            .from(posPayments)
            .where(eq(posPayments.orderId, orderId));
          const remainingPayments = paid?.count ?? 0;

          // The first tender settles the order totals to cents. With no tender
          // left, the order is back to the item-edit state: settle from items
          // exactly like add-item and remove-item do.
          let total = order.total;
          if (remainingPayments === 0) {
            const [totals] = await tx
              .select({
                gross: sum(posOrderItems.lineTotal),
                taxAmount: sum(posOrderItems.taxAmount),
              })
              .from(posOrderItems)
              .where(eq(posOrderItems.orderId, orderId));
            const settlement = posSettlementAmounts(
              Number(totals?.gross ?? 0),
              Number(totals?.taxAmount ?? 0),
            );
            total = settlement.total;
            await tx
              .update(posOrders)
              .set({ ...settlement, updatedAt: new Date() })
              .where(eq(posOrders.id, orderId));
          }

          const paidUnits = Math.round(Number(paid?.total ?? 0) * 10_000);
          return success({
            result: {
              orderId,
              paymentId: removed.id,
              sessionId: order.sessionId,
              currency: order.currency,
              totalPaid: paidUnits / 10_000,
              outstanding:
                Math.max(0, Math.round(total * 10_000) - paidUnits) / 10_000,
              remainingPayments,
            },
          });
        },
      );
    } catch (error) {
      logger.error("Error removing payment from POS order", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
