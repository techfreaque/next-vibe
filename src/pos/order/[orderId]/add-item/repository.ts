/**
 * POS Order Add Item Repository
 * Adds a line item to an open order and recalculates totals
 */

import { eq, sum } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { catalogProducts } from "@/products/db";

import {
  posOrderItems,
  posOrders,
  posSessions,
  posTerminals,
} from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { PosOrderAddItemPostRequestOutput } from "./definition";

export class PosOrderAddItemRepository {
  static async addItem(
    data: PosOrderAddItemPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
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

    try {
      const { orderId, item } = data;

      // Verify order exists and is open
      const [order] = await db
        .select({
          id: posOrders.id,
          status: posOrders.status,
          currency: posOrders.currency,
          sessionId: posOrders.sessionId,
        })
        .from(posOrders)
        .where(eq(posOrders.id, orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderAddItem.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify user is a member of the order's company via session → terminal chain
      const [session] = await db
        .select({ terminalId: posSessions.terminalId })
        .from(posSessions)
        .where(eq(posSessions.id, order.sessionId))
        .limit(1);

      if (session) {
        const [terminal] = await db
          .select({ companyId: posTerminals.companyId })
          .from(posTerminals)
          .where(eq(posTerminals.id, session.terminalId))
          .limit(1);

        if (terminal) {
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
      }

      if (order.status !== PosOrderStatus.OPEN) {
        return fail({
          message: t("orderAddItem.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Resolve item fields — productId lookup fills in defaults
      let resolvedDescription = item.description;
      let resolvedUnitPrice = item.unitPrice;
      let resolvedTaxRate = item.taxRate;
      const resolvedQuantity = item.quantity ?? 1;

      if (item.productId) {
        const [product] = await db
          .select({
            name: catalogProducts.name,
            basePrice: catalogProducts.basePrice,
            defaultTaxRate: catalogProducts.defaultTaxRate,
          })
          .from(catalogProducts)
          .where(eq(catalogProducts.id, item.productId))
          .limit(1);

        if (product) {
          resolvedDescription = resolvedDescription ?? product.name;
          resolvedUnitPrice = resolvedUnitPrice ?? product.basePrice;
          resolvedTaxRate =
            resolvedTaxRate ?? product.defaultTaxRate ?? undefined;
        }
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
      const taxRate = resolvedTaxRate ?? 0;
      const lineNet = resolvedQuantity * resolvedUnitPrice;
      const taxAmount = Math.round(lineNet * taxRate * 10000) / 10000;
      const lineTotal = lineNet + taxAmount;

      // Get current sort order
      const existingItems = await db
        .select({ sortOrder: posOrderItems.sortOrder })
        .from(posOrderItems)
        .where(eq(posOrderItems.orderId, orderId));

      const maxSort = existingItems.reduce(
        (acc, i) => Math.max(acc, i.sortOrder ?? 0),
        -1,
      );

      const [newItem] = await db
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
      const [totals] = await db
        .select({
          subtotal: sum(posOrderItems.lineTotal),
          taxAmount: sum(posOrderItems.taxAmount),
        })
        .from(posOrderItems)
        .where(eq(posOrderItems.orderId, orderId));

      const newSubtotal = Number(totals?.subtotal ?? 0);
      const newTaxAmount = Number(totals?.taxAmount ?? 0);
      const newTotal = newSubtotal;

      await db
        .update(posOrders)
        .set({
          subtotal: newSubtotal - newTaxAmount,
          taxAmount: newTaxAmount,
          total: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(posOrders.id, orderId));

      return success({
        result: {
          ...newItem,
          orderTotal: newTotal,
        },
      });
    } catch (error) {
      logger.error("Error adding item to POS order", parseError(error));
      return fail({
        message: t("orderAddItem.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
