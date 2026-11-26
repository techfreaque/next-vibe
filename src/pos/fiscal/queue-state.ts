/**
 * Pure state transitions of the fiscal receipt queue (unit tested).
 *
 * - REGISTERED: uid + QR from the UID, registeredAt set, error cleared.
 * - OFFLINE: the ORP issued the receipt offline (PKP/OKP); it stays queued
 *   until a later attempt registers it. QR from the OKP.
 * - FAILED result: attempts++, lastError set; the receipt only turns FAILED
 *   after MAX_FISCAL_ATTEMPTS, until then it keeps its status and retries.
 * - Any receipt still unregistered past sendDeadline gets deadlineMissedAt.
 */

import type { FiscalAdapterResolver, FiscalRegisterResult } from "./adapter";
import { FiscalReceiptStatus, type FiscalReceiptStatusValue } from "./enum";
import { okpFromPkp, qrDataFromOkp, qrDataFromUid } from "./okp";
import type { FiscalReceiptData } from "./receipt-data";

export const MAX_FISCAL_ATTEMPTS = 10;

export const FISCAL_ERROR_NO_ADAPTER = "FISCAL_ADAPTER_UNAVAILABLE";

export interface QueuedFiscalReceipt {
  id: string;
  adapter: string;
  status: typeof FiscalReceiptStatusValue;
  payload: FiscalReceiptData;
  attempts: number;
  pkp: string | null;
  okp: string | null;
  sendDeadline: Date | null;
  deadlineMissedAt: Date | null;
}

export interface FiscalReceiptPatch {
  status: typeof FiscalReceiptStatusValue;
  attempts: number;
  uid?: string;
  pkp?: string;
  okp?: string;
  qrData?: string;
  lastError: string | null;
  registeredAt?: Date;
  deadlineMissedAt: Date | null;
  updatedAt: Date;
}

export function isRetryable(status: typeof FiscalReceiptStatusValue): boolean {
  return (
    status === FiscalReceiptStatus.PENDING ||
    status === FiscalReceiptStatus.OFFLINE
  );
}

export function nextReceiptPatch(
  receipt: QueuedFiscalReceipt,
  result: FiscalRegisterResult,
  now: Date,
): FiscalReceiptPatch {
  const attempts = receipt.attempts + 1;
  if (result.status === "REGISTERED") {
    return {
      status: FiscalReceiptStatus.REGISTERED,
      attempts,
      uid: result.uid,
      qrData: qrDataFromUid(result.uid),
      lastError: null,
      registeredAt: now,
      deadlineMissedAt: receipt.deadlineMissedAt,
      updatedAt: now,
    };
  }
  const missed =
    receipt.deadlineMissedAt ??
    (receipt.sendDeadline && receipt.sendDeadline.getTime() < now.getTime()
      ? now
      : null);
  if (result.status === "OFFLINE") {
    // Our OKP from the device PKP; a mismatch would mean a broken adapter.
    const okp = okpFromPkp(result.pkp);
    return {
      status: FiscalReceiptStatus.OFFLINE,
      attempts,
      pkp: result.pkp,
      okp: result.okp || okp,
      qrData: qrDataFromOkp({
        okp: result.okp || okp,
        cashRegisterCode: receipt.payload.cashRegisterCode,
        issuedAt: receipt.payload.issuedAt,
        receiptNumber: receipt.payload.receiptNumber,
        total: receipt.payload.total,
      }),
      lastError: null,
      deadlineMissedAt: missed,
      updatedAt: now,
    };
  }
  return {
    status:
      attempts >= MAX_FISCAL_ATTEMPTS
        ? FiscalReceiptStatus.FAILED
        : receipt.status,
    attempts,
    lastError: result.error,
    deadlineMissedAt: missed,
    updatedAt: now,
  };
}

/** Runs one queue pass over the given receipts; returns the patches to persist. */
export async function processFiscalReceipts(
  receipts: readonly QueuedFiscalReceipt[],
  resolveAdapter: FiscalAdapterResolver,
  now: Date,
): Promise<{ id: string; patch: FiscalReceiptPatch }[]> {
  const patches: { id: string; patch: FiscalReceiptPatch }[] = [];
  for (const receipt of receipts) {
    if (!isRetryable(receipt.status)) {
      continue;
    }
    const adapter = resolveAdapter(receipt.adapter);
    let result: FiscalRegisterResult;
    if (!adapter) {
      result = { status: "FAILED", error: FISCAL_ERROR_NO_ADAPTER };
    } else {
      try {
        result = await adapter.register(receipt.payload);
      } catch (error) {
        result = {
          status: "FAILED",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
    patches.push({
      id: receipt.id,
      patch: nextReceiptPatch(receipt, result, now),
    });
  }
  return patches;
}
