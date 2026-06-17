/**
 * POS Order Add Payment Repository
 * Records a payment against an open order
 */

import { eq, sum } from "drizzle-orm";
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

import { posOrders, posPayments, posSessions, posTerminals } from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { PosOrderAddPaymentPostRequestOutput } from "./definition";

export class PosOrderAddPaymentRepository {
  static async addPayment(
    data: PosOrderAddPaymentPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        method: string;
        amount: number;
        change: number;
        totalPaid: number;
        outstanding: number;
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
          total: posOrders.total,
          sessionId: posOrders.sessionId,
        })
        .from(posOrders)
        .where(eq(posOrders.id, details.orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderAddPayment.post.errors.notFound.title"),
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
          message: t("orderAddPayment.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [payment] = await db
        .insert(posPayments)
        .values({
          orderId: details.orderId,
          method: details.method,
          amount: details.amount,
          change: details.change ?? 0,
          reference: details.reference,
          accountNodeId: details.accountNodeId,
        })
        .returning({
          id: posPayments.id,
          method: posPayments.method,
          amount: posPayments.amount,
          change: posPayments.change,
        });

      if (!payment) {
        logger.error("Failed to insert payment");
        return fail({
          message: t("orderAddPayment.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Calculate total paid so far
      const [paidTotals] = await db
        .select({ totalPaid: sum(posPayments.amount) })
        .from(posPayments)
        .where(eq(posPayments.orderId, details.orderId));

      const totalPaid = Number(paidTotals?.totalPaid ?? 0);
      const outstanding = Math.max(0, order.total - totalPaid);

      return success({
        result: {
          id: payment.id,
          method: payment.method,
          amount: payment.amount,
          change: payment.change,
          totalPaid,
          outstanding,
        },
      });
    } catch (error) {
      logger.error("Error adding payment to POS order", parseError(error));
      return fail({
        message: t("orderAddPayment.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
