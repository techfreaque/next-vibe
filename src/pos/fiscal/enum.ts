/**
 * POS fiscal receipt enums (eKasa and future online fiscal systems).
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Registered fiscal provider adapters. SANDBOX is a dev/test adapter and is
 * never certified, so it can never unblock a sale that requires eKasa.
 * Certified provider adapters (an ORP vendor integration) get added here.
 */
export const {
  enum: FiscalAdapter,
  options: FiscalAdapterOptions,
  Value: FiscalAdapterValue,
} = createEnumOptions(scopedTranslation, {
  SANDBOX: "enums.adapter.sandbox",
});

export const FiscalAdapterDB = [FiscalAdapter.SANDBOX] as const;

/**
 * Cash register type under zákon 384/2025 Z. z. § 2: ORP (hardware CHDÚ),
 * SORP (software ORP, protected storage may run at the vendor), VRP (free
 * virtual cash register of the Finančná správa).
 */
export const {
  enum: FiscalDeviceKind,
  options: FiscalDeviceKindOptions,
  Value: FiscalDeviceKindValue,
} = createEnumOptions(scopedTranslation, {
  ORP: "enums.deviceKind.orp",
  SORP: "enums.deviceKind.sorp",
  VRP: "enums.deviceKind.vrp",
});

export const FiscalDeviceKindDB = [
  FiscalDeviceKind.ORP,
  FiscalDeviceKind.SORP,
  FiscalDeviceKind.VRP,
] as const;

/** Lifecycle of one fiscal receipt in the registration queue. */
export const {
  enum: FiscalReceiptStatus,
  options: FiscalReceiptStatusOptions,
  Value: FiscalReceiptStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.receiptStatus.pending",
  REGISTERED: "enums.receiptStatus.registered",
  OFFLINE: "enums.receiptStatus.offline",
  FAILED: "enums.receiptStatus.failed",
});

export const FiscalReceiptStatusDB = [
  FiscalReceiptStatus.PENDING,
  FiscalReceiptStatus.REGISTERED,
  FiscalReceiptStatus.OFFLINE,
  FiscalReceiptStatus.FAILED,
] as const;
