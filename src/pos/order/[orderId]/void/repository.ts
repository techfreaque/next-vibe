/**
 * POS Order Void Repository
 * Voids an open order
 */

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
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

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
