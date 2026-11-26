/**
 * POS Order Add Item Repository
 * Adds a line item to an open order and recalculates totals
 */

import { and, eq, isNull, or, sql, sum } from "drizzle-orm";
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

import { catalogProducts } from "@/products/db";
import {
  calculateSettledTaxLine,
  LINE_SETTLEMENT_V1,
} from "@/tax/line-settlement";
import { scopedTranslation as regimeTranslation } from "@/tax/regime/i18n";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { posOrderItems, posOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import { withOpenOrder } from "../../open-order";
import { posSettlementAmounts } from "../../settlement-amounts";
import type { PosOrderAddItemPostRequestOutput } from "./definition";

export class PosOrderAddItemRepository {
  static async addItem(
    data: PosOrderAddItemPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    pathOrderId?: string,
  ): Promise<
    ResponseType<{
      result: {
        currency: string;
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        taxAmount: number;
        lineTotal: number;
        orderTotal: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    const orderId = pathOrderId ?? data.orderId;

    if (!orderId || (data.orderId !== undefined && data.orderId !== orderId)) {
      return fail({
        message: t("orderAddItem.post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      const { item } = data;

      // Verify order exists and is open
      return await withOpenOrder(
        orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderAddItem.post.errors.notFound.title"),
          conflict: t("orderAddItem.post.errors.conflict.title"),
        },
        async (tx, order) => {
          // Resolve item fields — productId lookup fills in defaults
          let resolvedDescription = item.description;
          let resolvedUnitPrice = item.unitPrice;
          let resolvedTaxRate = item.taxRate;
          const resolvedQuantity = item.quantity ?? 1;

          if (item.productId) {
            const [product] = await tx
              .select({
                name: catalogProducts.name,
                basePrice: catalogProducts.basePrice,
                currency: catalogProducts.currency,
                defaultTaxRate: catalogProducts.defaultTaxRate,
              })
              .from(catalogProducts)
              .where(
                and(
                  eq(catalogProducts.id, item.productId),
                  or(
                    eq(catalogProducts.companyId, order.companyId),
                    and(
                      isNull(catalogProducts.companyId),
                      eq(catalogProducts.ownerUserId, userId),
                    ),
                  ),
                ),
              )
              .limit(1);

            if (
              !product ||
              (resolvedUnitPrice === undefined &&
                product.currency !== order.currency)
            ) {
              return fail({
                message: t("orderAddItem.post.errors.validation.title"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
            resolvedDescription = resolvedDescription ?? product.name;
            resolvedUnitPrice = resolvedUnitPrice ?? product.basePrice;
            resolvedTaxRate =
              resolvedTaxRate ?? product.defaultTaxRate ?? undefined;
          }

          // Validate that we have all required resolved values
          if (!resolvedDescription) {
            return fail({
              message: t("orderAddItem.post.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (resolvedUnitPrice === undefined || resolvedUnitPrice === null) {
            return fail({
              message: t("orderAddItem.post.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }

          // Calculate line amounts
          const regime = await getCompanyTaxRegime(
            tx,
            order.companyId,
            new Date(),
          );
          if (regime.exempt && (item.taxRate ?? 0) > 0) {
            return fail({
              message: regimeTranslation.scopedT(locale).t("saleConflict"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const taxRate = regime.exempt ? 0 : (resolvedTaxRate ?? 0);
          const values = [resolvedQuantity, resolvedUnitPrice, taxRate];
          if (
            resolvedQuantity <= 0 ||
            resolvedUnitPrice < 0 ||
            taxRate < 0 ||
            taxRate > 1 ||
            values.some((value) => {
              const units = Math.round(value * 10_000);
              return !Number.isSafeInteger(units) || units / 10_000 !== value;
            })
          ) {
            return fail({
              message: t("orderAddItem.post.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const net = sql`round(${resolvedQuantity}::numeric * ${resolvedUnitPrice}::numeric,4)`;
          const settled =
            order.lineSettlement === LINE_SETTLEMENT_V1
              ? calculateSettledTaxLine({
                  quantity: resolvedQuantity,
                  unitPrice: resolvedUnitPrice,
                  taxRate,
                })
              : undefined;
          const legacyTax = sql`round(${net} * ${taxRate}::numeric,4)`;
          const taxAmount = settled?.taxAmount ?? legacyTax;
          const lineTotal = settled?.lineTotal ?? sql`${net} + ${legacyTax}`;
          // Get current sort order
          const existingItems = await tx
            .select({ sortOrder: posOrderItems.sortOrder })
            .from(posOrderItems)
            .where(eq(posOrderItems.orderId, orderId));

          const maxSort = existingItems.reduce(
            (acc, i) => Math.max(acc, i.sortOrder ?? 0),
            -1,
          );

          const [newItem] = await tx
            .insert(posOrderItems)
            .values({
              orderId,
              productId: item.productId,
              description: resolvedDescription,
              quantity: resolvedQuantity,
              unitPrice: resolvedUnitPrice,
              taxRate,
              taxAmount,
              lineTotal,
              sortOrder: maxSort + 1,
            })
            .returning({
              id: posOrderItems.id,
              description: posOrderItems.description,
              quantity: posOrderItems.quantity,
              unitPrice: posOrderItems.unitPrice,
              taxAmount: posOrderItems.taxAmount,
              lineTotal: posOrderItems.lineTotal,
            });

          if (!newItem) {
            logger.error("Failed to insert order item");
            return fail({
              message: t("orderAddItem.post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          // Recalculate order totals from all items
          const [totals] = await tx
            .select({
              subtotal: sum(posOrderItems.lineTotal),
              taxAmount: sum(posOrderItems.taxAmount),
            })
            .from(posOrderItems)
            .where(eq(posOrderItems.orderId, orderId));

          const settlement = posSettlementAmounts(
            Number(totals?.subtotal ?? 0),
            Number(totals?.taxAmount ?? 0),
          );

          await tx
            .update(posOrders)
            .set({
              ...settlement,
              updatedAt: new Date(),
            })
            .where(eq(posOrders.id, orderId));

          return success({
            result: {
              currency: order.currency,
              ...newItem,
              orderTotal: settlement.total,
            },
          });
        },
        { beforeTender: t("orderVoid.post.widget.tendered") },
      );
    } catch (error) {
      logger.error("Error adding item to POS order", parseError(error));
      return fail({
        message: t("orderAddItem.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
