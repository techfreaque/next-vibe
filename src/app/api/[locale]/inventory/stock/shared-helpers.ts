/**
 * Shared helpers for stock movement operations
 * Encapsulates the upsert-stockLevel + insert-stockMovement pattern
 */

import { and, eq } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { LoggerMetadata } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import { stockLevels, stockMovements, warehouses } from "../db";
import type { StockMovementTypeDB } from "../enum";

type MovementType = (typeof StockMovementTypeDB)[number];

/**
 * Get warehouse → companyId mapping; returns null if warehouse not found
 */
export async function getWarehouseCompanyId(
  warehouseId: string,
): Promise<string | null> {
  const [row] = await db
    .select({ companyId: warehouses.companyId })
    .from(warehouses)
    .where(eq(warehouses.id, warehouseId))
    .limit(1);
  return row?.companyId ?? null;
}

/**
 * Apply a stock movement:
 * - Upserts the stockLevels row (creates if not exists, updates quantityOnHand)
 * - Inserts a stockMovements row
 * - Updates weighted average unitCost on receipts
 *
 * Returns { movementId, quantityOnHand, quantityAvailable }
 */
export async function applyStockMovement(opts: {
  warehouseId: string;
  productId: string;
  type: MovementType;
  quantity: number; // signed: positive = in, negative = out
  unitCost?: number;
  reference?: string;
  notes?: string;
  sourceId?: string;
  sourceType?: string;
  userId: string;
  logger: EndpointLogger;
  insufficientStockError: TranslatedKeyType;
}): Promise<
  ResponseType<{
    movementId: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
    unitCost: number | null;
  }>
> {
  const {
    warehouseId,
    productId,
    type,
    quantity,
    unitCost,
    reference,
    notes,
    sourceId,
    sourceType,
    userId,
    logger,
    insufficientStockError,
  } = opts;

  // Get or create stock level
  const [existing] = await db
    .select()
    .from(stockLevels)
    .where(
      and(
        eq(stockLevels.warehouseId, warehouseId),
        eq(stockLevels.productId, productId),
      ),
    )
    .limit(1);

  const currentOnHand = existing?.quantityOnHand ?? 0;
  const currentReserved = existing?.quantityReserved ?? 0;
  const currentOnOrder = existing?.quantityOnOrder ?? 0;
  const currentCost = existing?.unitCost ?? null;

  // Validate available stock for outbound movements
  if (quantity < 0) {
    const available = currentOnHand - currentReserved;
    if (available + quantity < 0) {
      return fail({
        message: insufficientStockError,
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
  }

  const newOnHand = currentOnHand + quantity;

  // Weighted average cost update (only on positive movements with cost)
  let newUnitCost = currentCost;
  if (quantity > 0 && unitCost !== undefined && unitCost !== null) {
    if (currentCost === null || currentOnHand === 0) {
      newUnitCost = unitCost;
    } else {
      newUnitCost =
        (currentOnHand * currentCost + quantity * unitCost) /
        (currentOnHand + quantity);
    }
  }

  try {
    // Upsert stock level
    if (!existing) {
      await db.insert(stockLevels).values({
        warehouseId,
        productId,
        quantityOnHand: newOnHand,
        quantityReserved: currentReserved,
        quantityOnOrder: currentOnOrder,
        unitCost: newUnitCost ?? undefined,
        updatedAt: new Date(),
      });
    } else {
      await db
        .update(stockLevels)
        .set({
          quantityOnHand: newOnHand,
          unitCost: newUnitCost ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(stockLevels.id, existing.id));
    }

    // Insert movement record
    const [movement] = await db
      .insert(stockMovements)
      .values({
        warehouseId,
        productId,
        type,
        quantity,
        unitCost: unitCost ?? undefined,
        reference: reference ?? undefined,
        sourceId: sourceId ?? undefined,
        sourceType: sourceType ?? undefined,
        notes: notes ?? undefined,
        createdByUserId: userId,
        createdAt: new Date(),
      })
      .returning({ id: stockMovements.id });

    if (!movement) {
      return fail({
        message: insufficientStockError,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      movementId: movement.id,
      quantityOnHand: newOnHand,
      quantityReserved: currentReserved,
      quantityAvailable: newOnHand - currentReserved,
      unitCost: newUnitCost,
    });
  } catch (error) {
    logger.error("Error applying stock movement", error as LoggerMetadata);
    return fail({
      message: insufficientStockError,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
