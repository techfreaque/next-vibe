/**
 * Purchasing enums
 * Defines the enums used in the purchasing module using createEnumOptions pattern
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Purchase Order status enum
 * Tracks the lifecycle of a purchase order
 */
export const {
  enum: PurchaseOrderStatus,
  options: PurchaseOrderStatusOptions,
  Value: PurchaseOrderStatusValue,
} = createEnumOptions(scopedTranslation, {
  DRAFT: "enums.poStatus.draft",
  SENT: "enums.poStatus.sent",
  CONFIRMED: "enums.poStatus.confirmed",
  PARTIALLY_RECEIVED: "enums.poStatus.partiallyReceived",
  RECEIVED: "enums.poStatus.received",
  BILLED: "enums.poStatus.billed",
  CANCELLED: "enums.poStatus.cancelled",
});

// DB enum arrays for Drizzle
// Note: Raw string literals to remain compatible with drizzle-kit's CJS evaluation.
export const PurchaseOrderStatusDB = [
  "DRAFT",
  "SENT",
  "CONFIRMED",
  "PARTIALLY_RECEIVED",
  "RECEIVED",
  "BILLED",
  "CANCELLED",
] as const;
