/**
 * POS Order Void Repository
 * Voids an open order
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { posOrders, posSessions, posTerminals } from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { PosOrderVoidPostRequestOutput } from "./definition";

export class PosOrderVoidRepository {
  static async voidOrder(
    data: PosOrderVoidPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { orderId } = data;

      const [order] = await db
        .select({
          id: posOrders.id,
          status: posOrders.status,
          sessionId: posOrders.sessionId,
        })
        .from(posOrders)
        .where(eq(posOrders.id, orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderVoid.post.errors.notFound.title"),
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
          message: t("orderVoid.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [updated] = await db
        .update(posOrders)
        .set({
          status: PosOrderStatus.VOIDED,
          updatedAt: new Date(),
        })
        .where(eq(posOrders.id, orderId))
        .returning({
          id: posOrders.id,
          status: posOrders.status,
        });

      if (!updated) {
        logger.error("Failed to void POS order");
        return fail({
          message: t("orderVoid.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: updated });
    } catch (error) {
      logger.error("Error voiding POS order", parseError(error));
      return fail({
        message: t("orderVoid.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
