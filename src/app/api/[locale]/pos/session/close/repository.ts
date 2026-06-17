/**
 * POS Session Close Repository
 * Closes an open cashier session
 */

import { and, eq, inArray, sum } from "drizzle-orm";
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

import { posOrders, posPayments, posSessions, posTerminals } from "../../db";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type { PosSessionClosePostRequestOutput } from "./definition";

export class PosSessionCloseRepository {
  static async closeSession(
    data: PosSessionClosePostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
        closedAt: Date | null;
        closingFloat: number | null;
        expectedFloat: number;
        cashSalesTotal: number;
        variance: number;
        orderCount: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      const [session] = await db
        .select({
          id: posSessions.id,
          status: posSessions.status,
          terminalId: posSessions.terminalId,
          openingFloat: posSessions.openingFloat,
        })
        .from(posSessions)
        .where(eq(posSessions.id, details.sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("sessionClose.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify user is a member of the terminal's company
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

      if (session.status !== PosSessionStatus.OPEN) {
        return fail({
          message: t("sessionClose.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Fail if any orders in this session are still OPEN
      const [openOrder] = await db
        .select({ id: posOrders.id })
        .from(posOrders)
        .where(
          and(
            eq(posOrders.sessionId, details.sessionId),
            eq(posOrders.status, PosOrderStatus.OPEN),
          ),
        )
        .limit(1);

      if (openOrder) {
        return fail({
          message: t("sessionClose.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const closedAt = new Date();

      const [updated] = await db
        .update(posSessions)
        .set({
          status: PosSessionStatus.CLOSED,
          closedAt,
          closingFloat: details.closingFloat,
        })
        .where(eq(posSessions.id, details.sessionId))
        .returning({
          id: posSessions.id,
          status: posSessions.status,
          closedAt: posSessions.closedAt,
          closingFloat: posSessions.closingFloat,
        });

      if (!updated) {
        logger.error("Failed to close POS session");
        return fail({
          message: t("sessionClose.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Compute reconciliation: sum CASH payments on COMPLETED orders in this session
      const completedOrders = await db
        .select({ id: posOrders.id })
        .from(posOrders)
        .where(
          and(
            eq(posOrders.sessionId, details.sessionId),
            eq(posOrders.status, PosOrderStatus.COMPLETED),
          ),
        );

      const orderCount = completedOrders.length;
      const completedOrderIds = completedOrders.map((o) => o.id);

      let cashSalesTotal = 0;

      if (completedOrderIds.length > 0) {
        const [cashRow] = await db
          .select({ total: sum(posPayments.amount) })
          .from(posPayments)
          .where(
            and(
              inArray(posPayments.orderId, completedOrderIds),
              eq(posPayments.method, PosPaymentMethod.CASH),
            ),
          );
        cashSalesTotal = Number(cashRow?.total ?? 0);
      }

      const openingFloat = session.openingFloat;
      const expectedFloat = openingFloat + cashSalesTotal;
      const variance = details.closingFloat - expectedFloat;

      return success({
        result: {
          ...updated,
          expectedFloat,
          cashSalesTotal,
          variance,
          orderCount,
        },
      });
    } catch (error) {
      logger.error("Error closing POS session", parseError(error));
      return fail({
        message: t("sessionClose.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
