/**
 * POS Order Add Payment Repository
 * Records a payment against an open order
 */

import { count, eq, sql } from "drizzle-orm";
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
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";

import { posOrders, posPayments } from "../../../db";
import { PosPaymentMethod } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import { withOpenOrder } from "../../open-order";
import {
  isPosMinorUnitAmount,
  posSettlementAmounts,
} from "../../settlement-amounts";
import type { PosOrderAddPaymentPostRequestOutput } from "./definition";

export class PosOrderAddPaymentRepository {
  static async addPayment(
    data: PosOrderAddPaymentPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    pathOrderId?: string,
  ): Promise<
    ResponseType<{
      result: {
        currency: string;
        id: string;
        method: string;
        amount: number;
        change: number;
        totalPaid: number;
        outstanding: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    if (pathOrderId !== undefined && pathOrderId !== data.details.orderId) {
      return fail({
        message: t("orderAddPayment.post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      const { details } = data;

      // Verify order exists and is open
      return await withOpenOrder(
        details.orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderAddPayment.post.errors.notFound.title"),
          conflict: t("orderAddPayment.post.errors.conflict.title"),
        },
        async (tx, order) => {
          if (
            details.method === PosPaymentMethod.CASH &&
            order.currency !== order.terminalCurrency
          ) {
            return fail({
              message: t("workflow.cashCurrencyMismatch"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          if (
            !isPosMinorUnitAmount(details.amount) ||
            (details.change !== undefined &&
              !isPosMinorUnitAmount(details.change))
          ) {
            return fail({
              message: t("workflow.tenderMinorUnits"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }

          // Coordinate with chart setup and company-currency changes while
          // accepting tender. Completion revalidates under the same lock.
          const company = await lockLedgerCompany(tx, order.companyId);
          if (!company) {
            return fail({
              message: t("orderAddPayment.post.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          const [paid] = await tx
            .select({
              count: count(),
              explicitAccount: sql<boolean>`coalesce(bool_or(${posPayments.accountNodeId} is not null), false)`,
              total: sql<string>`coalesce(sum(${posPayments.amount} - ${posPayments.change}),0)`,
            })
            .from(posPayments)
            .where(eq(posPayments.orderId, details.orderId));
          if (order.currency !== (company.currency ?? "EUR")) {
            const [ledgerAccount] = await tx
              .select({ id: accountNodes.id })
              .from(accountNodes)
              .where(eq(accountNodes.companyId, order.companyId))
              .limit(1);
            if (
              ledgerAccount ||
              order.cashAccountId ||
              details.accountNodeId ||
              paid.explicitAccount
            ) {
              return fail({
                message: t("workflow.ledgerCurrencyMismatch"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
          }
          const settlement =
            paid.count === 0
              ? posSettlementAmounts(order.total, order.taxAmount)
              : undefined;
          const orderTotal = settlement?.total ?? order.total;
          const remaining =
            Math.round(orderTotal * 10_000) -
            Math.round(Number(paid.total) * 10_000);
          const amount = Math.round(details.amount * 10_000);
          const change =
            details.change === undefined &&
            details.method === PosPaymentMethod.CASH
              ? Math.max(0, amount - remaining)
              : Math.round((details.change ?? 0) * 10_000);
          if (change % 100 !== 0) {
            return fail({
              message: t("workflow.legacyTenderReview"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          if (
            remaining <= 0 ||
            !Number.isSafeInteger(amount) ||
            amount <= 0 ||
            amount / 10_000 !== details.amount ||
            !Number.isSafeInteger(change) ||
            change < 0 ||
            change >= amount ||
            (details.change !== undefined &&
              details.change !== change / 10_000) ||
            (change > 0 && details.method !== PosPaymentMethod.CASH) ||
            amount - change > remaining
          ) {
            return fail({
              message: t("orderAddPayment.post.errors.conflict.title"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          const [payment] = await tx
            .insert(posPayments)
            .values({
              orderId: details.orderId,
              method: details.method,
              amount: details.amount,
              change: change / 10_000,
              reference: details.reference,
              accountNodeId: details.accountNodeId,
            })
            .returning({
              id: posPayments.id,
              method: posPayments.method,
              amount: posPayments.amount,
              change: posPayments.change,
            });

          if (!payment) {
            logger.error("Failed to insert payment");
            return fail({
              message: t("orderAddPayment.post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          if (settlement) {
            await tx
              .update(posOrders)
              .set({ ...settlement, updatedAt: new Date() })
              .where(eq(posOrders.id, details.orderId));
          }

          const outstanding = (remaining - amount + change) / 10_000;
          const totalPaid =
            (Math.round(orderTotal * 10_000) -
              Math.round(outstanding * 10_000)) /
            10_000;
          return success({
            result: {
              currency: order.currency,
              id: payment.id,
              method: payment.method,
              amount: payment.amount,
              change: payment.change,
              totalPaid,
              outstanding,
            },
          });
        },
      );
    } catch (error) {
      logger.error("Error adding payment to POS order", parseError(error));
      return fail({
        message: t("orderAddPayment.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
