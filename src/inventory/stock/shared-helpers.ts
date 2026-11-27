import "server-only";

import { and, eq, isNull, or, sql } from "drizzle-orm";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { catalogProducts } from "@/products/db";

import { stockLevels, stockMovements, warehouses } from "../db";
import type { StockMovementTypeDB } from "../enum";

export type StockTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export async function getWarehouseCompanyId(
  warehouseId: string,
): Promise<string | null> {
  const [row] = await db
    .select({ companyId: warehouses.companyId })
    .from(warehouses)
    .where(eq(warehouses.id, warehouseId));
  return row?.companyId ?? null;
}

export async function applyStockMovement(
  opts: {
    warehouseId: string;
    companyId?: string;
    productId: string;
    type: (typeof StockMovementTypeDB)[number];
    quantity: number;
    unitCost?: number;
    reference?: string;
    notes?: string;
    sourceId?: string;
    sourceType?: string;
    userId: string;
    logger: EndpointLogger;
    insufficientStockError: TranslatedKeyType;
  },
  tx?: StockTransaction,
): Promise<
  ResponseType<{
    movementId: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
    unitCost: number | null;
    negativeStockWarning: boolean;
  }>
> {
  if (!tx) {
    return db.transaction((transaction) =>
      applyStockMovement(opts, transaction),
    );
  }
  const { warehouseId, productId, quantity, unitCost, userId } = opts;
  const invalid = fail({
    message: opts.insufficientStockError,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  const quantityUnits = Math.round(quantity * 10_000);
  if (
    !quantityUnits ||
    !Number.isSafeInteger(quantityUnits) ||
    quantityUnits / 10_000 !== quantity ||
    (unitCost !== undefined &&
      (!Number.isFinite(unitCost) ||
        unitCost < 0 ||
        Math.round(unitCost * 10_000) / 10_000 !== unitCost))
  ) {
    return invalid;
  }

  // Lock the warehouse even for its first stock row, when there is no level to lock yet.
  const [warehouse] = await tx
    .select({
      companyId: warehouses.companyId,
      negativeStockPolicy: warehouses.negativeStockPolicy,
    })
    .from(warehouses)
    .where(
      and(
        eq(warehouses.id, warehouseId),
        eq(warehouses.isActive, true),
        opts.companyId ? eq(warehouses.companyId, opts.companyId) : undefined,
      ),
    )
    .for("update");
  if (!warehouse) {
    return invalid;
  }
  const [product] = await tx
    .select({ id: catalogProducts.id })
    .from(catalogProducts)
    .where(
      and(
        eq(catalogProducts.id, productId),
        or(
          eq(catalogProducts.companyId, warehouse.companyId),
          and(
            isNull(catalogProducts.companyId),
            eq(catalogProducts.ownerUserId, userId),
          ),
        ),
      ),
    );
  if (!product) {
    return invalid;
  }

  const [level] = await tx
    .select({
      onHand: stockLevels.quantityOnHand,
      reserved: stockLevels.quantityReserved,
      unitCost: stockLevels.unitCost,
    })
    .from(stockLevels)
    .where(
      and(
        eq(stockLevels.warehouseId, warehouseId),
        eq(stockLevels.productId, productId),
      ),
    )
    .for("update");
  const wouldGoNegative =
    quantity < 0 &&
    Math.round((level?.onHand ?? 0) * 10_000) -
      Math.round((level?.reserved ?? 0) * 10_000) +
      quantityUnits <
      0;
  let negativeStockWarning = false;
  if (wouldGoNegative) {
    if (warehouse.negativeStockPolicy === "BLOCK") {
      return invalid;
    }
    if (warehouse.negativeStockPolicy === "WARN") {
      negativeStockWarning = true;
      opts.logger.warn("Stock level went negative under WARN policy", {
        warehouseId,
        productId,
        quantity,
      });
    }
  }

  const cost =
    quantity > 0 && unitCost !== undefined
      ? sql`case when ${stockLevels.unitCost} is null or ${stockLevels.quantityOnHand} <= 0 then ${unitCost}::numeric
      else (${stockLevels.quantityOnHand} * ${stockLevels.unitCost} + ${quantity}::numeric * ${unitCost}::numeric) / (${stockLevels.quantityOnHand} + ${quantity}::numeric) end`
      : stockLevels.unitCost;
  const movementUnitCost =
    quantity < 0 ? (level?.unitCost ?? null) : (unitCost ?? null);
  const [saved] = await tx
    .insert(stockLevels)
    .values({ warehouseId, productId, quantityOnHand: quantity, unitCost })
    .onConflictDoUpdate({
      target: [stockLevels.warehouseId, stockLevels.productId],
      set: {
        quantityOnHand: sql`${stockLevels.quantityOnHand} + ${quantity}::numeric`,
        unitCost: sql`${cost}`,
        updatedAt: new Date(),
      },
    })
    .returning({
      quantityOnHand: stockLevels.quantityOnHand,
      quantityReserved: stockLevels.quantityReserved,
      unitCost: stockLevels.unitCost,
    });
  const movementId = crypto.randomUUID();
  await tx.insert(stockMovements).values({
    id: movementId,
    warehouseId,
    productId,
    type: opts.type,
    quantity,
    unitCost: movementUnitCost,
    reference: opts.reference,
    sourceId: opts.sourceId,
    sourceType: opts.sourceType,
    notes: opts.notes,
    createdByUserId: userId,
  });
  return success({
    movementId,
    ...saved,
    unitCost: movementUnitCost ?? saved.unitCost,
    negativeStockWarning,
    quantityAvailable:
      (Math.round(saved.quantityOnHand * 10_000) -
        Math.round(saved.quantityReserved * 10_000)) /
      10_000,
  });
}
