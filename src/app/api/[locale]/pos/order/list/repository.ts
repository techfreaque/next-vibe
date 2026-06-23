/**
 * POS Order List Repository
 * Lists orders for a session with optional status filter and pagination
 */

import { and, count, eq } from "drizzle-orm";
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

import { posOrders, posSessions, posTerminals } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  PosOrderListRequestOutput,
  PosOrderListResponseOutput,
} from "./definition";

export class PosOrderListRepository {
  static async listOrders(
    data: PosOrderListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosOrderListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const sessionId = data.input.sessionId;

      // Verify company membership via session → terminal → company
      const [session] = await db
        .select({ terminalId: posSessions.terminalId })
        .from(posSessions)
        .where(eq(posSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("orderList.get.errors.notFound.title"),
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
          message: t("orderList.get.errors.notFound.title"),
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

      const conditions = [eq(posOrders.sessionId, sessionId)];

      if (data.input.status) {
        conditions.push(eq(posOrders.status, data.input.status));
      }

      const where = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(posOrders)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          id: posOrders.id,
          orderNumber: posOrders.orderNumber,
          sessionId: posOrders.sessionId,
          status: posOrders.status,
          currency: posOrders.currency,
          total: posOrders.total,
          createdAt: posOrders.createdAt,
        })
        .from(posOrders)
        .where(where)
        .orderBy(posOrders.createdAt)
        .limit(pageSize)
        .offset(offset);

      return success({
        count: total ?? 0,
        orders: rows,
      });
    } catch (error) {
      logger.error("Error listing POS orders", parseError(error));
      return fail({
        message: t("orderList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
