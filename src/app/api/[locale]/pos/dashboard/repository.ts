/**
 * POS Dashboard Repository
 * Returns KPI overview: terminals, active sessions, today's orders and sales
 */

import { and, eq, gte, inArray, sql, sum } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { posOrders, posSessions, posTerminals } from "../db";
import { PosOrderStatus, PosSessionStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import type { PosDashboardGetResponseOutput } from "./definition";

export class PosDashboardRepository {
  static async getDashboard(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosDashboardGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Resolve all companies this user is a member of
      const memberRows = await db
        .select({ companyId: companyMembers.companyId })
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.userId, userId),
            eq(companyMembers.isActive, true),
          ),
        );

      const companyIds = memberRows.map((m) => m.companyId);

      if (companyIds.length === 0) {
        return success({
          terminalsTotal: 0,
          terminalsActive: 0,
          openSessionsCount: 0,
          todayOrderCount: 0,
          todaySalesTotal: 0,
          currency: "EUR",
          terminals: [],
        });
      }

      // Verify membership (VIEWER+) for at least one company - use first as auth check
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        companyIds[0],
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Fetch all terminals for the user's companies
      const terminalRows = await db
        .select({
          id: posTerminals.id,
          name: posTerminals.name,
          location: posTerminals.location,
          currency: posTerminals.currency,
          isActive: posTerminals.isActive,
        })
        .from(posTerminals)
        .where(inArray(posTerminals.companyId, companyIds));

      const terminalIds = terminalRows.map((row) => row.id);

      // Determine default currency from first active terminal (or fallback to EUR)
      const firstActive = terminalRows.find((row) => row.isActive);
      const currency = firstActive?.currency ?? "EUR";

      // Fetch open sessions for these terminals
      const openSessionRows =
        terminalIds.length > 0
          ? await db
              .select({
                id: posSessions.id,
                terminalId: posSessions.terminalId,
              })
              .from(posSessions)
              .where(
                and(
                  inArray(posSessions.terminalId, terminalIds),
                  eq(posSessions.status, PosSessionStatus.OPEN),
                ),
              )
          : [];

      // Build map: terminalId → open sessionId
      const terminalSessionMap = new Map<string, string>();
      for (const session of openSessionRows) {
        terminalSessionMap.set(session.terminalId, session.id);
      }

      // Today's start (UTC midnight)
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      // Today's completed order count and revenue
      let todayOrderCount = 0;
      let todaySalesTotal = 0;

      if (openSessionRows.length > 0) {
        const sessionIds = openSessionRows.map((s) => s.id);

        // Count completed orders today across all open sessions
        const [countRow] = await db
          .select({ value: sql<number>`count(*)::int` })
          .from(posOrders)
          .where(
            and(
              inArray(posOrders.sessionId, sessionIds),
              eq(posOrders.status, PosOrderStatus.COMPLETED),
              gte(posOrders.createdAt, todayStart),
            ),
          );

        todayOrderCount = countRow?.value ?? 0;

        // Sum completed order totals today
        const [sumRow] = await db
          .select({ value: sum(posOrders.total) })
          .from(posOrders)
          .where(
            and(
              inArray(posOrders.sessionId, sessionIds),
              eq(posOrders.status, PosOrderStatus.COMPLETED),
              gte(posOrders.createdAt, todayStart),
            ),
          );

        todaySalesTotal = Number(sumRow?.value ?? 0);
      }

      // Assemble terminal rows with session info
      const terminals = terminalRows.map((terminal) => {
        const openSessionId = terminalSessionMap.get(terminal.id) ?? null;
        return {
          id: terminal.id,
          name: terminal.name,
          location: terminal.location,
          currency: terminal.currency,
          isActive: terminal.isActive,
          hasOpenSession: openSessionId !== null,
          openSessionId,
        };
      });

      // Sort: active first, then by name
      terminals.sort((a, b) => {
        if (a.isActive !== b.isActive) {
          return a.isActive ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      const terminalsActive = terminalRows.filter((row) => row.isActive).length;

      return success({
        terminalsTotal: terminalRows.length,
        terminalsActive,
        openSessionsCount: openSessionRows.length,
        todayOrderCount,
        todaySalesTotal,
        currency,
        terminals,
      });
    } catch (error) {
      logger.error("Error loading POS dashboard", parseError(error));
      return fail({
        message: t("dashboard.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
