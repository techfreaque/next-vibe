/**
 * POS Order Complete Repository
 * Completes an order: validates full payment, posts journal entry, updates status
 */

import { and, asc, eq, inArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { scopedTranslation as regimeTranslation } from "@/tax/regime/i18n";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { posOrders, posPayments } from "../../../db";
import { PosOrderStatus, PosPaymentMethod } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import { withOpenOrder } from "../../open-order";
import {
  isPosMinorUnitAmount,
  posSettlementAmounts,
} from "../../settlement-amounts";
import { issuePosOrderStock } from "../../stock";
import type { PosOrderCompletePostRequestOutput } from "./definition";

export class PosOrderCompleteRepository {
  static async completeOrder(
    data: PosOrderCompletePostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    pathOrderId?: string,
  ): Promise<
    ResponseType<{
      result: {
        currency: string;
        id: string;
        sessionId: string;
        status: string;
        total: number;
        journalEntryId: string | null;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    const orderId = pathOrderId ?? data.orderId;

    if (!orderId || (data.orderId !== undefined && data.orderId !== orderId)) {
      return fail({
        message: t("orderComplete.post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const stockConflict = fail({
      message: t("workflow.stockUnavailable"),
      errorType: ErrorResponseTypes.CONFLICT,
    });
    let stockFailed = false;

    try {
      const conflict = fail({
        message: t("orderComplete.post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
      return await withOpenOrder(
        orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderComplete.post.errors.notFound.title"),
          conflict: t("orderComplete.post.errors.conflict.title"),
        },
        async (tx, order) => {
          const regime = await getCompanyTaxRegime(
            tx,
            order.companyId,
            new Date(),
          );
          if (regime.exempt && order.taxAmount !== 0) {
            return fail({
              message: regimeTranslation.scopedT(locale).t("saleConflict"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const storedTotal = Math.round(order.total * 10_000);
          if (
            storedTotal < 0 ||
            order.journalEntryId ||
            storedTotal !==
              Math.round(order.subtotal * 10_000) +
                Math.round(order.taxAmount * 10_000)
          ) {
            return conflict;
          }
          const payments = await tx
            .select()
            .from(posPayments)
            .where(eq(posPayments.orderId, orderId))
            .orderBy(asc(posPayments.createdAt), asc(posPayments.id));
          const settlement =
            payments.length === 0
              ? posSettlementAmounts(order.total, order.taxAmount)
              : {
                  subtotal: order.subtotal,
                  taxAmount: order.taxAmount,
                  total: order.total,
                };
          const total = Math.round(settlement.total * 10_000);
          let excess = payments.reduce(
            (sum, payment) =>
              sum +
              Math.round(payment.amount * 10_000) -
              Math.round(payment.change * 10_000),
            -total,
          );
          if (excess < 0) {
            return conflict;
          }
          const cashChange: { id: string; change: number }[] = [];
          const lines: AutoPostLine[] = [];
          for (const payment of payments.toReversed()) {
            const amount = Math.round(payment.amount * 10_000);
            const change = Math.round(payment.change * 10_000);
            const cash = payment.method === PosPaymentMethod.CASH;
            if (
              amount <= 0 ||
              change < 0 ||
              change > amount ||
              (!cash && change > 0)
            ) {
              return conflict;
            }
            const additionalChange = cash
              ? Math.min(excess, amount - change)
              : 0;
            if (additionalChange > 0) {
              cashChange.push({
                id: payment.id,
                change: (change + additionalChange) / 10_000,
              });
              excess -= additionalChange;
            }
            const net = amount - change - additionalChange;
            if (net > 0) {
              lines.push({
                type: LineType.DEBIT,
                subtype: cash ? AccountSubtype.CASH : AccountSubtype.BANK,
                accountNodeId:
                  payment.accountNodeId ??
                  (cash ? order.cashAccountId : undefined) ??
                  undefined,
                amount: net / 10_000,
                currency: order.currency,
              });
            }
          }
          if (excess > 0) {
            return conflict;
          }
          const [hasChart] = await tx
            .select({ id: accountNodes.id })
            .from(accountNodes)
            .where(eq(accountNodes.companyId, order.companyId))
            .limit(1);
          let journalEntryId: string | null = null;
          if (
            total > 0 &&
            (hasChart ||
              order.cashAccountId ||
              payments.some((payment) => payment.accountNodeId))
          ) {
            if (
              ![
                settlement.subtotal,
                settlement.taxAmount,
                settlement.total,
                ...lines.map(({ amount }) => amount),
              ].every(isPosMinorUnitAmount)
            ) {
              return fail({
                message: t("workflow.legacyPostingReview"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
            const explicit = lines.flatMap((line) =>
              line.accountNodeId ? [line.accountNodeId] : [],
            );
            if (explicit.length) {
              const tenderAccounts = await tx
                .select({ id: accountNodes.id })
                .from(accountNodes)
                .where(
                  and(
                    eq(accountNodes.companyId, order.companyId),
                    inArray(accountNodes.id, explicit),
                    inArray(accountNodes.subtype, [
                      AccountSubtype.CASH,
                      AccountSubtype.BANK,
                    ]),
                  ),
                )
                .for("share");
              if (
                explicit.some(
                  (id) => !tenderAccounts.some((account) => account.id === id),
                )
              ) {
                return conflict;
              }
            }
            if (settlement.subtotal > 0) {
              lines.push({
                type: LineType.CREDIT,
                subtype: AccountSubtype.REVENUE_SALES,
                fallbackSubtype: AccountSubtype.REVENUE_SERVICE,
                amount: settlement.subtotal,
                currency: order.currency,
              });
            }
            if (settlement.taxAmount > 0) {
              lines.push({
                type: LineType.CREDIT,
                subtype: AccountSubtype.VAT_PAYABLE,
                amount: settlement.taxAmount,
                currency: order.currency,
              });
            }
            journalEntryId = await postJournalEntry(
              {
                companyId: order.companyId,
                date: new Date(),
                description: order.orderNumber,
                sourceId: orderId,
                sourceType: JournalSourceType.POS_ORDER,
                postedByUserId: userId,
                lines,
                logger,
              },
              tx,
            );
            if (!journalEntryId) {
              return fail({
                message: t("workflow.postingUnavailable"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
          }
          if (order.warehouseId) {
            const issued = await issuePosOrderStock(
              tx,
              { ...order, warehouseId: order.warehouseId },
              userId,
              logger,
              t("workflow.stockUnavailable"),
            );
            if (!issued.success) {
              stockFailed = true;
              return tx.rollback();
            }
          }
          for (const payment of cashChange) {
            await tx
              .update(posPayments)
              .set({ change: payment.change })
              .where(eq(posPayments.id, payment.id));
          }
          await tx
            .update(posOrders)
            .set({
              status: PosOrderStatus.COMPLETED,
              ...settlement,
              taxExemptionNotice: regime.notice,
              journalEntryId,
              updatedAt: new Date(),
            })
            .where(eq(posOrders.id, orderId));
          return success({
            result: {
              currency: order.currency,
              id: orderId,
              sessionId: order.sessionId,
              status: PosOrderStatus.COMPLETED,
              total: settlement.total,
              journalEntryId,
            },
          });
        },
      );
    } catch (error) {
      if (stockFailed) {
        return stockConflict;
      }
      logger.error("Error completing POS order", parseError(error));
      return fail({
        message: t("orderComplete.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
