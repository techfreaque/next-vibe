/**
 * POS Order Get Repository
 * Retrieves a single order with items and payments, verifying company membership
 */

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
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  posOrderItems,
  posOrders,
  posPayments,
  posSessions,
  posTerminals,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { PosOrderGetResponseOutput } from "./definition";

export class PosOrderGetRepository {
  static async getOrder(
    orderId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosOrderGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [order] = await db
        .select()
        .from(posOrders)
        .where(eq(posOrders.id, orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership via session → terminal → company
      const [session] = await db
        .select({ terminalId: posSessions.terminalId })
        .from(posSessions)
        .where(eq(posSessions.id, order.sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("orderGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const [terminal] = await db
        .select({ companyId: posTerminals.companyId })
        .from(posTerminals)
        .where(eq(posTerminals.id, session.terminalId))
        .limit(1);

      if (!terminal) {
        return fail({
          message: t("orderGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        terminal.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      const items = await db
        .select()
        .from(posOrderItems)
        .where(eq(posOrderItems.orderId, orderId))
        .orderBy(posOrderItems.sortOrder);

      const payments = await db
        .select()
        .from(posPayments)
        .where(eq(posPayments.orderId, orderId));

      return success({
        result: {
          id: order.id,
          orderNumber: order.orderNumber,
          sessionId: order.sessionId,
          customerId: order.customerId ?? null,
          status: order.status,
          currency: order.currency,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          total: order.total,
          journalEntryId: order.journalEntryId ?? null,
          createdAt: order.createdAt,
          items: items.map((item) => ({
            itemId: item.id,
            productId: item.productId ?? null,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            taxAmountItem: item.taxAmount,
            lineTotal: item.lineTotal,
          })),
          payments: payments.map((pmt) => ({
            paymentId: pmt.id,
            method: pmt.method,
            amount: pmt.amount,
            change: pmt.change,
            reference: pmt.reference ?? null,
          })),
        },
      });
    } catch (error) {
      logger.error("Error getting POS order", parseError(error));
      return fail({
        message: t("orderGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
