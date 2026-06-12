/**
 * POS enums
 * Defines the enums used in the POS module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Session status enum
 * Lifecycle of a cashier session
 */
export const {
  enum: PosSessionStatus,
  options: PosSessionStatusOptions,
  Value: PosSessionStatusValue,
} = createEnumOptions(scopedTranslation, {
  OPEN: "enums.sessionStatus.open",
  CLOSED: "enums.sessionStatus.closed",
});

/**
 * Order status enum
 * Lifecycle of a POS order
 */
export const {
  enum: PosOrderStatus,
  options: PosOrderStatusOptions,
  Value: PosOrderStatusValue,
} = createEnumOptions(scopedTranslation, {
  OPEN: "enums.orderStatus.open",
  COMPLETED: "enums.orderStatus.completed",
  VOIDED: "enums.orderStatus.voided",
});

/**
 * Payment method enum
 * How a customer pays
 */
export const {
  enum: PosPaymentMethod,
  options: PosPaymentMethodOptions,
  Value: PosPaymentMethodValue,
} = createEnumOptions(scopedTranslation, {
  CASH: "enums.paymentMethod.cash",
  CARD: "enums.paymentMethod.card",
  TRANSFER: "enums.paymentMethod.transfer",
  OTHER: "enums.paymentMethod.other",
});

// DB enum arrays for Drizzle
export const PosSessionStatusDB = [
  PosSessionStatus.OPEN,
  PosSessionStatus.CLOSED,
] as const;

export const PosOrderStatusDB = [
  PosOrderStatus.OPEN,
  PosOrderStatus.COMPLETED,
  PosOrderStatus.VOIDED,
] as const;

export const PosPaymentMethodDB = [
  PosPaymentMethod.CASH,
  PosPaymentMethod.CARD,
  PosPaymentMethod.TRANSFER,
  PosPaymentMethod.OTHER,
] as const;
