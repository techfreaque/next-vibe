import { describe, expect, it } from "bun:test";

import type { FiscalProviderAdapter, FiscalRegisterResult } from "./adapter";
import { FiscalReceiptStatus } from "./enum";
import { okpFromPkp } from "./okp";
import {
  FISCAL_ERROR_NO_ADAPTER,
  MAX_FISCAL_ATTEMPTS,
  processFiscalReceipts,
  type QueuedFiscalReceipt,
} from "./queue-state";
import type { FiscalReceiptData } from "./receipt-data";

const NOW = new Date("2026-11-26T12:00:00.000Z");
const PKP = Buffer.from("signature-bytes").toString("base64");

const payload: FiscalReceiptData = {
  dic: "2020123456",
  ico: "12345678",
  icDph: null,
  sellerName: "Test",
  cashRegisterCode: "88812345678900001",
  receiptNumber: 3,
  issuedAt: "2026-11-26T09:00:00.000Z",
  orderNumber: "POS-3",
  currency: "EUR",
  items: [],
  vatSummary: [],
  total: 9.9,
  payments: [],
};

function receipt(
  overrides: Partial<QueuedFiscalReceipt> = {},
): QueuedFiscalReceipt {
  return {
    id: "r1",
    adapter: "fake",
    status: FiscalReceiptStatus.PENDING,
    payload,
    attempts: 0,
    pkp: null,
    okp: null,
    sendDeadline: new Date("2026-11-30T09:00:00.000Z"),
    deadlineMissedAt: null,
    ...overrides,
  };
}

function fakeAdapter(
  result: FiscalRegisterResult | Error,
): FiscalProviderAdapter & { calls: number } {
  const adapter = {
    id: "fake",
    certified: true,
    deviceKinds: ["ORP"],
    calls: 0,
    register: (): Promise<FiscalRegisterResult> => {
      adapter.calls += 1;
      return result instanceof Error
        ? Promise.reject(result)
        : Promise.resolve(result);
    },
  };
  return adapter;
}

describe("processFiscalReceipts", () => {
  it("registers pending receipts with the UID as QR", async () => {
    const adapter = fakeAdapter({ status: "REGISTERED", uid: "O-ABC" });
    const [entry] = await processFiscalReceipts(
      [receipt()],
      () => adapter,
      NOW,
    );
    expect(entry?.patch).toMatchObject({
      status: FiscalReceiptStatus.REGISTERED,
      uid: "O-ABC",
      qrData: "O-ABC",
      attempts: 1,
      lastError: null,
      registeredAt: NOW,
    });
  });

  it("stores PKP/OKP and the OKP QR for offline results", async () => {
    const okp = okpFromPkp(PKP);
    const adapter = fakeAdapter({ status: "OFFLINE", pkp: PKP, okp });
    const [entry] = await processFiscalReceipts(
      [receipt()],
      () => adapter,
      NOW,
    );
    expect(entry?.patch.status).toBe(FiscalReceiptStatus.OFFLINE);
    expect(entry?.patch.okp).toBe(okp);
    expect(entry?.patch.qrData).toBe(
      `${okp}:88812345678900001:261126100000:3:9.90`,
    );
  });

  it("retries offline receipts and skips final ones", async () => {
    const adapter = fakeAdapter({ status: "REGISTERED", uid: "O-1" });
    const patches = await processFiscalReceipts(
      [
        receipt({ id: "a", status: FiscalReceiptStatus.OFFLINE, pkp: PKP }),
        receipt({ id: "b", status: FiscalReceiptStatus.REGISTERED }),
        receipt({ id: "c", status: FiscalReceiptStatus.FAILED }),
      ],
      () => adapter,
      NOW,
    );
    expect(patches.map(({ id }) => id)).toEqual(["a"]);
    expect(adapter.calls).toBe(1);
  });

  it("keeps the status on failure until the attempt limit", async () => {
    const adapter = fakeAdapter({ status: "FAILED", error: "timeout" });
    const [first] = await processFiscalReceipts(
      [receipt()],
      () => adapter,
      NOW,
    );
    expect(first?.patch).toMatchObject({
      status: FiscalReceiptStatus.PENDING,
      attempts: 1,
      lastError: "timeout",
    });
    const [last] = await processFiscalReceipts(
      [receipt({ attempts: MAX_FISCAL_ATTEMPTS - 1 })],
      () => adapter,
      NOW,
    );
    expect(last?.patch.status).toBe(FiscalReceiptStatus.FAILED);
  });

  it("turns adapter exceptions into errors", async () => {
    const [entry] = await processFiscalReceipts(
      [receipt()],
      () => fakeAdapter(new Error("socket closed")),
      NOW,
    );
    expect(entry?.patch.lastError).toBe("socket closed");
  });

  it("flags receipts past the send deadline", async () => {
    const [entry] = await processFiscalReceipts(
      [receipt({ sendDeadline: new Date("2026-11-26T11:00:00.000Z") })],
      () => null,
      NOW,
    );
    expect(entry?.patch.lastError).toBe(FISCAL_ERROR_NO_ADAPTER);
    expect(entry?.patch.deadlineMissedAt).toEqual(NOW);
  });
});
