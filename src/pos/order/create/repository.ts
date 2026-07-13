/**
 * POS Order Create Repository
 * Creates a new order in an open session
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

import { posOrders, posSessions, posTerminals } from "../../db";
import { PosOrderStatus, PosSessionStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type { PosOrderCreatePostRequestOutput } from "./definition";

export class PosOrderCreateRepository {
  static async createOrder(
    data: PosOrderCreatePostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        orderNumber: string;
        sessionId: string;
        status: string;
        currency: string;
        total: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      // Verify session exists and is open
      const [session] = await db
        .select({
          id: posSessions.id,
          status: posSessions.status,
          terminalId: posSessions.terminalId,
        })
        .from(posSessions)
        .where(eq(posSessions.id, details.sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("orderCreate.post.errors.notFound.title"),
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
          message: t("orderCreate.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Generate order number based on current timestamp
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const timeStr = now.getTime().toString().slice(-6);
      const orderNumber = `POS-${dateStr}-${timeStr}`;

      const [order] = await db
        .insert(posOrders)
        .values({
          sessionId: details.sessionId,
          customerId: details.customerId,
          currency: details.currency ?? "EUR",
          orderNumber,
          status: PosOrderStatus.OPEN,
          subtotal: 0,
          taxAmount: 0,
          total: 0,
        })
        .returning({
          id: posOrders.id,
          orderNumber: posOrders.orderNumber,
          sessionId: posOrders.sessionId,
          status: posOrders.status,
          currency: posOrders.currency,
          total: posOrders.total,
        });

      if (!order) {
        logger.error("Failed to insert POS order");
        return fail({
          message: t("orderCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: order });
    } catch (error) {
      logger.error("Error creating POS order", parseError(error));
      return fail({
        message: t("orderCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
