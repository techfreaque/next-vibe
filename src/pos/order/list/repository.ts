/**
 * POS Order List Repository
 * Lists orders for a session with optional status filter and pagination
 */

import { and, count, desc, eq, inArray } from "drizzle-orm";
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

import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

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
      const conditions = [];

      if (sessionId) {
        // Verify company membership via session -> terminal -> company
        const [owner] = await db
          .select({ companyId: posTerminals.companyId })
          .from(posSessions)
          .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
          .where(eq(posSessions.id, sessionId))
          .limit(1);
        if (!owner) {
          return fail({
            message: t("orderList.get.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          owner.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
        conditions.push(eq(posOrders.sessionId, sessionId));
      } else if (data.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
        conditions.push(eq(posTerminals.companyId, data.companyId));
      } else {
        // Sales history across every company the user belongs to.
        const memberships = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );
        if (memberships.length === 0) {
          return success({ count: 0, orders: [] });
        }
        conditions.push(
          inArray(
            posTerminals.companyId,
            memberships.map((membership) => membership.companyId),
          ),
        );
      }

      if (data.input.status) {
        conditions.push(eq(posOrders.status, data.input.status));
      }

      const where = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(posOrders)
        .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
        .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
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
          terminalName: posTerminals.name,
        })
        .from(posOrders)
        .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
        .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
        .where(where)
        .orderBy(desc(posOrders.createdAt))
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
