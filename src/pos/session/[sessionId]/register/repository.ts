/**
 * POS Register Repository
 * Loads the till state for one session: terminal, company, today's takings
 * and the sales still open (parked) in this session.
 */

import { and, count, desc, eq, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import {
  posOrderItems,
  posOrders,
  posSessions,
  posTerminals,
} from "../../../db";
import { PosOrderStatus } from "../../../enum";
import type { PosRegisterGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class PosRegisterRepository {
  static async getRegister(
    sessionId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosRegisterGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [session] = await db
        .select({
          id: posSessions.id,
          status: posSessions.status,
          terminalId: posSessions.terminalId,
          terminalName: posTerminals.name,
          companyId: posTerminals.companyId,
          companyName: companies.name,
          currency: posTerminals.currency,
          openedAt: posSessions.openedAt,
          openingFloat: posSessions.openingFloat,
        })
        .from(posSessions)
        .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
        .innerJoin(companies, eq(companies.id, posTerminals.companyId))
        .where(eq(posSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const access = await CompanyAuthRepository.requireMember(
        userId,
        session.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!access.success) {
        return access;
      }

      const [takings] = await db
        .select({
          salesCount: count(),
          salesTotal: sql<string>`coalesce(sum(${posOrders.total}), 0)`,
        })
        .from(posOrders)
        .where(
          and(
            eq(posOrders.sessionId, sessionId),
            eq(posOrders.status, PosOrderStatus.COMPLETED),
          ),
        );

      const openOrders = await db
        .select({
          id: posOrders.id,
          orderNumber: posOrders.orderNumber,
          total: posOrders.total,
          createdAt: posOrders.createdAt,
          itemCount: sql<string>`coalesce(sum(${posOrderItems.quantity}), 0)`,
        })
        .from(posOrders)
        .leftJoin(posOrderItems, eq(posOrderItems.orderId, posOrders.id))
        .where(
          and(
            eq(posOrders.sessionId, sessionId),
            eq(posOrders.status, PosOrderStatus.OPEN),
          ),
        )
        .groupBy(posOrders.id)
        .orderBy(desc(posOrders.createdAt))
        .limit(21);
      // An open sale without items is an empty cart: reuse it instead of
      // listing it as parked or creating another one.
      const emptyOrder = openOrders.find(
        (order) => Number(order.itemCount) === 0,
      );

      return success({
        session: {
          ...session,
          salesCount: takings?.salesCount ?? 0,
          salesTotal: Number(takings?.salesTotal ?? 0),
        },
        emptyOrderId: emptyOrder?.id ?? null,
        openOrders: openOrders
          .filter((order) => Number(order.itemCount) > 0)
          .slice(0, 20)
          .map((order) => ({
            ...order,
            itemCount: Number(order.itemCount),
          })),
      });
    } catch (error) {
      logger.error("Error loading POS register", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
