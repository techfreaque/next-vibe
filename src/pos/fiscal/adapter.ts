/**
 * Fiscal provider adapter contract.
 *
 * A certified adapter wraps a certified ORP or SORP (zákon 384/2025 Z. z. § 2)
 * vendor or device that owns the CHDÚ and the signing key. Only adapters with
 * certified = true can unblock POS sales where the country requires eKasa.
 */

import type { FiscalReceiptData } from "./receipt-data";

export type FiscalRegisterResult =
  | { status: "REGISTERED"; uid: string }
  | { status: "OFFLINE"; pkp: string; okp: string }
  | { status: "FAILED"; error: string };

export interface FiscalProviderAdapter {
  /** FiscalAdapter value, stored in pos_fiscal_providers.adapter. */
  id: string;
  certified: boolean;
  /** FiscalDeviceKind values this adapter can drive (ORP, SORP, VRP). */
  deviceKinds: readonly string[];
  register(receipt: FiscalReceiptData): Promise<FiscalRegisterResult>;
}

export type FiscalAdapterResolver = (
  id: string,
) => FiscalProviderAdapter | null;
