/**
 * POS Dashboard Repository
 * Returns KPI overview: terminals, active sessions, today's orders and sales
 */

import { and, asc, eq, gte, inArray, lt, sql, sum } from "drizzle-orm";
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

import { getDocumentCompanies } from "@/finance/document-company-scope";

import { posOrders, posRefunds, posSessions, posTerminals } from "../db";
import { PosOrderStatus, PosSessionStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import type { PosDashboardGetResponseOutput } from "./definition";

export class PosDashboardRepository {
  static async getDashboard(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    companyId?: string,
  ): Promise<ResponseType<PosDashboardGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const companies = await getDocumentCompanies(userId, companyId);
      const companyIds = companies.map((company) => company.id);
      if (companyId && !companies.length) {
        return fail({
          message: t("dashboard.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (companyIds.length === 0) {
        return success({
          terminalsTotal: 0,
          terminalsActive: 0,
          openSessionsCount: 0,
          todayOrderCount: 0,
          todaySalesTotal: 0,
          refundsToday: { amount: 0, count: 0 },
          currency: "EUR",
          terminals: [],
        });
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
        .where(inArray(posTerminals.companyId, companyIds))
        .orderBy(asc(posTerminals.id));

      const terminalIds = terminalRows.map((row) => row.id);

      // Determine default currency from first active terminal (or fallback to EUR)
      const firstActive = terminalRows.find((row) => row.isActive);
      const currency =
        (companies.length === 1 ? companies[0]?.currency : null) ??
        firstActive?.currency ??
        "EUR";

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

      const tomorrow = new Date(todayStart.getTime() + 86_400_000);
      const sales =
        terminalIds.length === 0
          ? []
          : await db
              .select({
                currency: posOrders.currency,
                amount: sum(posOrders.total).mapWith(Number),
                orders: sql<number>`count(*)::int`,
              })
              .from(posOrders)
              .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
              .where(
                and(
                  inArray(posSessions.terminalId, terminalIds),
                  eq(posOrders.status, PosOrderStatus.COMPLETED),
                  gte(posOrders.updatedAt, todayStart),
                  lt(posOrders.updatedAt, tomorrow),
                ),
              )
              .groupBy(posOrders.currency)
              .orderBy(asc(posOrders.currency));
      const refunds =
        terminalIds.length === 0
          ? []
          : await db
              .select({
                currency: posRefunds.currency,
                amount: sum(posRefunds.total).mapWith(Number),
                count: sql<number>`count(*)::int`,
              })
              .from(posRefunds)
              .innerJoin(posOrders, eq(posOrders.id, posRefunds.orderId))
              .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
              .where(
                and(
                  inArray(posSessions.terminalId, terminalIds),
                  gte(posRefunds.createdAt, todayStart),
                  lt(posRefunds.createdAt, tomorrow),
                ),
              )
              .groupBy(posRefunds.currency);
      const refundsToday = {
        amount:
          refunds.find((group) => group.currency === currency)?.amount ?? 0,
        count: refunds.reduce((count, group) => count + group.count, 0),
      };
      const todayOrderCount = sales.reduce(
        (count, group) => count + group.orders,
        0,
      );
      const todaySalesTotal =
        sales.find((group) => group.currency === currency)?.amount ?? 0;

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
        refundsToday,
        salesByCurrency: sales.map((row) => ({
          currency: row.currency,
          amount: row.amount,
        })),
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
