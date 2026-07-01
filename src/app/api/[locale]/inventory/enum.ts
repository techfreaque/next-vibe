/**
 * Inventory enums
 * Defines the enums used in the inventory module using createEnumOptions pattern
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Stock movement type enum
 * What triggered a stock level change
 */
export const {
  enum: StockMovementType,
  options: StockMovementTypeOptions,
  Value: StockMovementTypeValue,
} = createEnumOptions(scopedTranslation, {
  RECEIPT: "enums.movementType.receipt",
  ISSUE: "enums.movementType.issue",
  TRANSFER_IN: "enums.movementType.transferIn",
  TRANSFER_OUT: "enums.movementType.transferOut",
  ADJUSTMENT: "enums.movementType.adjustment",
  SALE: "enums.movementType.sale",
  RETURN: "enums.movementType.return",
});

/**
 * Warehouse transfer status enum
 * Lifecycle of a stock transfer between warehouses
 */
export const {
  enum: TransferStatus,
  options: TransferStatusOptions,
  Value: TransferStatusValue,
} = createEnumOptions(scopedTranslation, {
  DRAFT: "enums.transferStatus.draft",
  IN_TRANSIT: "enums.transferStatus.inTransit",
  RECEIVED: "enums.transferStatus.received",
  CANCELLED: "enums.transferStatus.cancelled",
});

// DB enum arrays for Drizzle
// Note: Raw string literals to remain compatible with drizzle-kit's CJS evaluation.
export const StockMovementTypeDB = [
  "RECEIPT",
  "ISSUE",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "ADJUSTMENT",
  "SALE",
  "RETURN",
] as const;

export const TransferStatusDB = [
  "DRAFT",
  "IN_TRANSIT",
  "RECEIVED",
  "CANCELLED",
] as const;
