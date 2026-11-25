/**
 * Purchasing Dashboard Repository
 * Aggregates KPI counts for purchase orders and vendors
 */

import "server-only";

import {
  and,
  asc,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  lt,
  lte,
  sql,
} from "drizzle-orm";
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
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";

import { purchaseOrderLines, purchaseOrders, purchasingVendors } from "../db";
import { scopedTranslation } from "../i18n";
import type {
  PurchasingDashboardRequestOutput,
  PurchasingDashboardResponseOutput,
} from "./definition";

export class PurchasingDashboardRepository {
  static async getDashboard(
    userId: string,
    data: PurchasingDashboardRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PurchasingDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const companies = await getDocumentCompanies(userId, data.companyId);
      if (data.companyId && !companies.length) {
        return fail({
          message: t("dashboard.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const companyIds = companies.map((company) => company.id);
      if (!companyIds.length) {
        return success({
          draftCount: 0,
          confirmedCount: 0,
          awaitingReceiptCount: 0,
          activeVendorCount: 0,
          dueThisWeekCount: 0,
          overdueDeliveryCount: 0,
          moneyByCurrency: [],
          deliveries: [],
        });
      }

      const now = new Date();
      const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
      const nextWeek = new Date(today.getTime() + 7 * 86_400_000);
      const monthStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      const orderScope = inArray(purchaseOrders.companyId, companyIds);
      const openOrder = inArray(purchaseOrders.status, [
        "SENT",
        "CONFIRMED",
        "PARTIALLY_RECEIVED",
      ]);
      const [counts, vendors, openValues, settled, upcoming] =
        await Promise.all([
          db
            .select({
              draft:
                sql<number>`count(*) filter (where ${purchaseOrders.status} = 'DRAFT')`.mapWith(
                  Number,
                ),
              confirmed:
                sql<number>`count(*) filter (where ${purchaseOrders.status} = 'CONFIRMED')`.mapWith(
                  Number,
                ),
              awaiting:
                sql<number>`count(*) filter (where ${openOrder})`.mapWith(
                  Number,
                ),
              overdue:
                sql<number>`count(*) filter (where ${openOrder} and ${lt(purchaseOrders.expectedDeliveryDate, today)})`.mapWith(
                  Number,
                ),
              due: sql<number>`count(*) filter (where ${openOrder} and ${gte(purchaseOrders.expectedDeliveryDate, today)} and ${lt(purchaseOrders.expectedDeliveryDate, nextWeek)})`.mapWith(
                Number,
              ),
            })
            .from(purchaseOrders)
            .where(orderScope),
          db
            .select({ count: countDistinct(purchasingVendors.id) })
            .from(purchasingVendors)
            .where(
              and(
                inArray(purchasingVendors.companyId, companyIds),
                eq(purchasingVendors.isActive, true),
              ),
            ),
          db
            .select({
              currency: purchaseOrders.currency,
              amount:
                sql<number>`coalesce(sum(round(${purchaseOrderLines.lineTotal} * greatest(0, ${purchaseOrderLines.quantity} - ${purchaseOrderLines.quantityReceived}) / nullif(${purchaseOrderLines.quantity},0),4)),0)`.mapWith(
                  Number,
                ),
            })
            .from(purchaseOrders)
            .innerJoin(
              purchaseOrderLines,
              eq(purchaseOrderLines.poId, purchaseOrders.id),
            )
            .where(and(orderScope, openOrder))
            .groupBy(purchaseOrders.currency),
          db
            .select({
              currency: paymentBills.currency,
              amount: sql<number>`sum(${paymentBills.total})`.mapWith(Number),
            })
            .from(paymentBills)
            .where(
              and(
                inArray(paymentBills.companyId, companyIds),
                eq(paymentBills.status, BillStatus.PAID),
                gte(paymentBills.paidAt, monthStart),
                lte(paymentBills.paidAt, now),
              ),
            )
            .groupBy(paymentBills.currency),
          db
            .select({
              id: purchaseOrders.id,
              number: purchaseOrders.poNumber,
              supplier: purchasingVendors.name,
              expected: purchaseOrders.expectedDeliveryDate,
              currency: purchaseOrders.currency,
              total: purchaseOrders.total,
            })
            .from(purchaseOrders)
            .leftJoin(
              purchasingVendors,
              and(
                eq(purchasingVendors.id, purchaseOrders.vendorId),
                eq(purchasingVendors.companyId, purchaseOrders.companyId),
              ),
            )
            .where(and(orderScope, openOrder))
            .orderBy(
              asc(purchaseOrders.expectedDeliveryDate),
              desc(purchaseOrders.createdAt),
              asc(purchaseOrders.id),
            )
            .limit(6),
        ]);
      const currencies = [
        ...new Set([
          ...companies.flatMap((company) =>
            company.currency ? [company.currency] : [],
          ),
          ...openValues.map((row) => row.currency),
          ...settled.map((row) => row.currency),
        ]),
      ].toSorted();
      return success({
        draftCount: counts[0]?.draft ?? 0,
        confirmedCount: counts[0]?.confirmed ?? 0,
        awaitingReceiptCount: counts[0]?.awaiting ?? 0,
        activeVendorCount: vendors[0]?.count ?? 0,
        dueThisWeekCount: counts[0]?.due ?? 0,
        overdueDeliveryCount: counts[0]?.overdue ?? 0,
        moneyByCurrency: currencies.map((currency) => ({
          currency,
          openValue:
            openValues.find((row) => row.currency === currency)?.amount ?? 0,
          settledBills:
            settled.find((row) => row.currency === currency)?.amount ?? 0,
        })),
        deliveries: upcoming.map((row) => ({
          ...row,
          expected: row.expected?.toISOString() ?? null,
          overdue: row.expected !== null && row.expected < today,
        })),
      });
    } catch (error) {
      logger.error("Failed to load purchasing dashboard", parseError(error));
      return fail({
        message: t("dashboard.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
