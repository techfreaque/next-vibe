/**
 * POS Session Close Repository
 * Closes an open cashier session
 */

import { and, eq, ne, sql } from "drizzle-orm";
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
  posPayments,
  posSessions,
  posTerminals,
} from "../../db";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { isPosMinorUnitAmount } from "../../order/settlement-amounts";
import { getPosSessionCash } from "../cash-totals";
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
        currency: string;
        terminalName?: string;
        companyName?: string;
        id: string;
        status: string;
        closedAt: Date | null;
        closingFloat: number | null;
        openingFloat: number;
        expectedFloat: number;
        cashSalesTotal: number;
        cashRefundsTotal: number;
        variance: number;
        orderCount: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;
      if (
        details.closingFloat !== undefined &&
        !isPosMinorUnitAmount(details.closingFloat)
      ) {
        return fail({
          message: t("workflow.tenderMinorUnits"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

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
        .select({
          companyId: posTerminals.companyId,
          terminalName: posTerminals.name,
          companyName: companies.name,
          currency: posTerminals.currency,
        })
        .from(posTerminals)
        .innerJoin(companies, eq(companies.id, posTerminals.companyId))
        .where(eq(posTerminals.id, session.terminalId))
        .limit(1);

      if (!terminal) {
        return fail({
          message: t("sessionClose.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      {
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

      return await db.transaction(async (tx) => {
        const [locked] = await tx
          .select({
            status: posSessions.status,
            openingFloat: posSessions.openingFloat,
          })
          .from(posSessions)
          .where(
            and(
              eq(posSessions.id, details.sessionId),
              eq(posSessions.terminalId, session.terminalId),
            ),
          )
          .for("update");
        if (!locked || locked.status !== PosSessionStatus.OPEN) {
          return fail({
            message: t("sessionClose.post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        // An empty cart left open (no items, no tender) is not a sale: void it
        // so it never blocks closing the till.
        await tx
          .update(posOrders)
          .set({ status: PosOrderStatus.VOIDED, updatedAt: new Date() })
          .where(
            and(
              eq(posOrders.sessionId, details.sessionId),
              eq(posOrders.status, PosOrderStatus.OPEN),
              sql`not exists (select 1 from ${posOrderItems} where ${posOrderItems.orderId} = ${posOrders.id})`,
              sql`not exists (select 1 from ${posPayments} where ${posPayments.orderId} = ${posOrders.id})`,
            ),
          );

        // Fail if any sale in this session is still OPEN
        const [openOrder] = await tx
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
            message: t("sessionClose.post.widget.openSaleBlocks"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [foreignCash] = await tx
          .select({ id: posOrders.id })
          .from(posOrders)
          .innerJoin(posPayments, eq(posPayments.orderId, posOrders.id))
          .where(
            and(
              eq(posOrders.sessionId, details.sessionId),
              eq(posOrders.status, PosOrderStatus.COMPLETED),
              ne(posOrders.currency, terminal.currency),
              eq(posPayments.method, PosPaymentMethod.CASH),
            ),
          )
          .limit(1);
        if (foreignCash) {
          return fail({
            message: t("sessionClose.post.mixedCash"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const closedAt = new Date();

        const [updated] = await tx
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

        // Reconciliation: opening float + cash kept from completed sales
        // - cash paid out for refunds from this drawer.
        const [orders] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(posOrders)
          .where(
            and(
              eq(posOrders.sessionId, details.sessionId),
              eq(posOrders.status, PosOrderStatus.COMPLETED),
            ),
          );
        const orderCount = orders?.count ?? 0;
        const openingFloat = locked.openingFloat;
        const cash = await getPosSessionCash(
          tx,
          details.sessionId,
          openingFloat,
        );
        const expectedFloat = cash.expectedCash;
        const variance =
          (Math.round(details.closingFloat * 10_000) -
            Math.round(expectedFloat * 10_000)) /
          10_000;

        return success({
          result: {
            currency: terminal.currency,
            terminalName: terminal.terminalName,
            companyName: terminal.companyName,
            ...updated,
            openingFloat,
            expectedFloat,
            cashSalesTotal: cash.cashSalesTotal,
            cashRefundsTotal: cash.cashRefundsTotal,
            variance,
            orderCount,
          },
        });
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
