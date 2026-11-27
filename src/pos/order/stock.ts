import "server-only";

import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, LineType } from "@/chart-of-accounts/enum";
import type { AutoPostLine } from "@/chart-of-accounts/shared/auto-post";
import { stockLevels, warehouses } from "@/inventory/db";
import {
  applyStockMovement,
  type StockTransaction,
} from "@/inventory/stock/shared-helpers";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import { posOrderItems } from "../db";

export function roundCogsAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function buildPosCogsLines(opts: {
  totalCogs: number;
  currency: string;
  description: string;
  reverse?: boolean;
}): AutoPostLine[] {
  const rounded = roundCogsAmount(opts.totalCogs);
  if (rounded <= 0) {
    return [];
  }
  if (opts.reverse) {
    return [
      {
        type: LineType.DEBIT,
        subtype: AccountSubtype.INVENTORY,
        amount: rounded,
        currency: opts.currency,
        description: opts.description,
      },
      {
        type: LineType.CREDIT,
        subtype: AccountSubtype.COGS,
        amount: rounded,
        currency: opts.currency,
        description: opts.description,
      },
    ];
  }
  return [
    {
      type: LineType.DEBIT,
      subtype: AccountSubtype.COGS,
      amount: rounded,
      currency: opts.currency,
      description: opts.description,
    },
    {
      type: LineType.CREDIT,
      subtype: AccountSubtype.INVENTORY,
      amount: rounded,
      currency: opts.currency,
      description: opts.description,
    },
  ];
}

export async function hasCogsAndInventoryAccounts(
  tx: StockTransaction,
  companyId: string,
): Promise<boolean> {
  const rows = await tx
    .select({ subtype: accountNodes.subtype })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, companyId),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
        inArray(accountNodes.subtype, [
          AccountSubtype.COGS,
          AccountSubtype.INVENTORY,
        ]),
      ),
    );
  const subtypes = new Set(rows.map((row) => row.subtype));
  return (
    subtypes.has(AccountSubtype.COGS) && subtypes.has(AccountSubtype.INVENTORY)
  );
}

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
): Promise<
  ResponseType<{
    issued: number;
    totalCogs: number;
    negativeStockWarnings: number;
  }>
> {
  const [warehouse] = await tx
    .select({
      id: warehouses.id,
      negativeStockPolicy: warehouses.negativeStockPolicy,
    })
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

  const requireStockLevel = warehouse.negativeStockPolicy === "BLOCK";
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
        // Under BLOCK policy, an inventory level registers a company SKU for stock
        // management (including zero stock). Under WARN/ALLOW, any physical SKU
        // sold through a till linked to a warehouse issues stock even from zero.
        requireStockLevel
          ? sql`exists (
        select 1 from ${stockLevels}
        join ${warehouses} on ${warehouses.id} = ${stockLevels.warehouseId}
        where ${stockLevels.productId} = ${catalogProducts.id}
          and ${warehouses.companyId} = ${order.companyId}
      )`
          : undefined,
      ),
    )
    .groupBy(catalogProducts.id)
    .orderBy(asc(catalogProducts.id));

  if (products.length === 0) {
    return success({ issued: 0, totalCogs: 0, negativeStockWarnings: 0 });
  }

  let totalCogsUnits = 0;
  let negativeStockWarnings = 0;
  for (const product of products) {
    const qty = Number(product.quantity);
    const movement = await applyStockMovement(
      {
        warehouseId: warehouse.id,
        companyId: order.companyId,
        productId: product.id,
        type: "ISSUE",
        quantity: -qty,
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
    if (movement.data.negativeStockWarning) {
      negativeStockWarnings += 1;
    }
    const resolvedCost = movement.data.unitCost;
    if (resolvedCost !== null && resolvedCost > 0) {
      totalCogsUnits += Math.round(qty * resolvedCost * 10_000);
    }
  }
  return success({
    issued: products.length,
    totalCogs: roundCogsAmount(totalCogsUnits / 10_000),
    negativeStockWarnings,
  });
}
