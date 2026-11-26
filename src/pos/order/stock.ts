import "server-only";

import { and, asc, eq, sql } from "drizzle-orm";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { stockLevels, warehouses } from "@/inventory/db";
import {
  applyStockMovement,
  type StockTransaction,
} from "@/inventory/stock/shared-helpers";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import { posOrderItems } from "../db";

export async function issuePosOrderStock(
  tx: StockTransaction,
  order: {
    id: string;
    orderNumber: string;
    companyId: string;
    warehouseId: string;
  },
  userId: string,
  logger: EndpointLogger,
  insufficientStockError: TranslatedKeyType,
): Promise<ResponseType<{ issued: number }>> {
  const products = await tx
    .select({
      id: catalogProducts.id,
      quantity: sql<string>`sum(${posOrderItems.quantity})`,
    })
    .from(posOrderItems)
    .innerJoin(catalogProducts, eq(catalogProducts.id, posOrderItems.productId))
    .where(
      and(
        eq(posOrderItems.orderId, order.id),
        eq(catalogProducts.companyId, order.companyId),
        eq(catalogProducts.type, ProductType.PHYSICAL),
        // An inventory level registers a company SKU for stock management,
        // including zero stock. Stock kept elsewhere cannot fulfil this sale.
        sql`exists (
        select 1 from ${stockLevels}
        join ${warehouses} on ${warehouses.id} = ${stockLevels.warehouseId}
        where ${stockLevels.productId} = ${catalogProducts.id}
          and ${warehouses.companyId} = ${order.companyId}
      )`,
      ),
    )
    .groupBy(catalogProducts.id)
    .orderBy(asc(catalogProducts.id));

  if (products.length === 0) {
    return success({ issued: 0 });
  }

  const [warehouse] = await tx
    .select({ id: warehouses.id })
    .from(warehouses)
    .where(
      and(
        eq(warehouses.id, order.warehouseId),
        eq(warehouses.companyId, order.companyId),
        eq(warehouses.isActive, true),
      ),
    )
    .for("update");
  if (!warehouse) {
    return fail({
      message: insufficientStockError,
      errorType: ErrorResponseTypes.CONFLICT,
    });
  }

  for (const product of products) {
    const movement = await applyStockMovement(
      {
        warehouseId: warehouse.id,
        companyId: order.companyId,
        productId: product.id,
        type: "ISSUE",
        quantity: -Number(product.quantity),
        reference: order.orderNumber,
        sourceId: order.id,
        sourceType: "POS_ORDER",
        userId,
        logger,
        insufficientStockError,
      },
      tx,
    );
    if (!movement.success) {
      return movement;
    }
  }
  return success({ issued: products.length });
}
