/**
 * POS Order Remove Item Repository
 * Removes a line item from an open order and recalculates totals
 */

import { and, eq, sum } from "drizzle-orm";
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
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  posOrderItems,
  posOrders,
  posSessions,
  posTerminals,
} from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
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
      const [order] = await db
        .select({
          id: posOrders.id,
          status: posOrders.status,
          sessionId: posOrders.sessionId,
        })
        .from(posOrders)
        .where(eq(posOrders.id, details.orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderRemoveItem.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify user is a member of the order's company via session → terminal chain
      const [session] = await db
        .select({ terminalId: posSessions.terminalId })
        .from(posSessions)
        .where(eq(posSessions.id, order.sessionId))
        .limit(1);

      if (session) {
        const [terminal] = await db
          .select({ companyId: posTerminals.companyId })
          .from(posTerminals)
          .where(eq(posTerminals.id, session.terminalId))
          .limit(1);

        if (terminal) {
          const authResult = await CompanyAuthRepository.requireMember(
            userId,
            terminal.companyId,
            CompanyMemberRole.MEMBER,
            logger,
            locale,
          );
          if (!authResult.success) {
            return authResult;
          }
        }
      }

      if (order.status !== PosOrderStatus.OPEN) {
        return fail({
          message: t("orderRemoveItem.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Verify item belongs to this order
      const [item] = await db
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
      await db
        .delete(posOrderItems)
        .where(eq(posOrderItems.id, details.itemId));

      // Recalculate order totals
      const [totals] = await db
        .select({
          subtotal: sum(posOrderItems.lineTotal),
          taxAmount: sum(posOrderItems.taxAmount),
        })
        .from(posOrderItems)
        .where(eq(posOrderItems.orderId, details.orderId));

      const newSubtotal = Number(totals?.subtotal ?? 0);
      const newTaxAmount = Number(totals?.taxAmount ?? 0);
      const newTotal = newSubtotal;

      await db
        .update(posOrders)
        .set({
          subtotal: newSubtotal - newTaxAmount,
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
    } catch (error) {
      logger.error("Error removing item from POS order", parseError(error));
      return fail({
        message: t("orderRemoveItem.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
